-- Forward-only Task 3 upgrade for outreach message-step evidence and reporting.
-- Existing append-only events are preserved. NOT VALID checks enforce new rows
-- without requiring historical message events to have data they never stored.

alter table public.outreach_events
  add column if not exists sequence_step smallint;

do $migration$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'outreach_events_sequence_step_range'
      and conrelid = 'public.outreach_events'::regclass
  ) then
    alter table public.outreach_events
      add constraint outreach_events_sequence_step_range
      check (sequence_step between 1 and 3)
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'outreach_events_message_step_required'
      and conrelid = 'public.outreach_events'::regclass
  ) then
    alter table public.outreach_events
      add constraint outreach_events_message_step_required
      check (
        event_type not in ('sent', 'delivered', 'bounced')
        or sequence_step is not null
      )
      not valid;
  end if;
end;
$migration$;

do $migration$
declare
  duplicate_keys bigint;
begin
  select count(*)
  into duplicate_keys
  from (
    select 1
    from public.outreach_events
    where event_type in ('sent', 'delivered', 'bounced')
      and sequence_step is not null
    group by campaign_id, prospect_id, event_type, sequence_step
    having count(*) > 1
  ) duplicates;

  if duplicate_keys > 0 then
    raise exception 'Cannot enforce outreach message-event uniqueness: % unreconciled duplicate key(s) exist',
      duplicate_keys;
  end if;
end;
$migration$;

drop index if exists public.outreach_events_funnel_idx;
create index if not exists outreach_events_funnel_idx
  on public.outreach_events (
    occurred_at,
    campaign_id,
    event_type,
    sequence_step,
    prospect_id
  );

drop index if exists public.outreach_events_message_step_idx;
create unique index if not exists outreach_events_message_step_idx
  on public.outreach_events (
    campaign_id,
    prospect_id,
    event_type,
    sequence_step
  )
  where event_type in ('sent', 'delivered', 'bounced')
    and sequence_step is not null;

drop view if exists public.outreach_weekly_funnel;
create view public.outreach_weekly_funnel
with (security_invoker = true)
as
with ranked_message_events as (
  select
    e.*,
    row_number() over (
      partition by e.campaign_id, e.prospect_id, e.event_type, e.sequence_step
      order by e.occurred_at, e.id
    ) as canonical_rank
  from public.outreach_events e
  where e.event_type in ('sent', 'delivered', 'bounced')
    and e.sequence_step between 1 and 3
),
canonical_message_events as (
  select
    ranked.campaign_id,
    ranked.prospect_id,
    ranked.event_type,
    ranked.segment,
    ranked.trigger,
    ranked.template_version,
    ranked.sequence_step,
    ranked.occurred_at,
    ranked.amount_paid
  from ranked_message_events ranked
  where ranked.canonical_rank = 1
),
reportable_events as (
  select
    e.campaign_id,
    e.prospect_id,
    e.event_type,
    e.segment,
    e.trigger,
    e.template_version,
    e.sequence_step,
    e.occurred_at,
    e.amount_paid
  from public.outreach_events e
  where e.event_type not in ('sent', 'delivered', 'bounced')

  union all

  select
    m.campaign_id,
    m.prospect_id,
    m.event_type,
    m.segment,
    m.trigger,
    m.template_version,
    m.sequence_step,
    m.occurred_at,
    m.amount_paid
  from canonical_message_events m
),
deduplicated as (
  select
    date_trunc('week', e.occurred_at)::date as week_start,
    e.campaign_id,
    e.segment,
    coalesce(e.trigger, '') as trigger,
    coalesce(e.template_version, '') as template_version,
    e.prospect_id,
    e.event_type,
    e.sequence_step,
    max(e.amount_paid) as amount_paid
  from reportable_events e
  group by
    date_trunc('week', e.occurred_at)::date,
    e.campaign_id,
    e.segment,
    coalesce(e.trigger, ''),
    coalesce(e.template_version, ''),
    e.prospect_id,
    e.event_type,
    e.sequence_step
),
aggregated as (
  select
    d.week_start,
    d.campaign_id,
    d.segment,
    d.trigger,
    d.template_version,
    count(distinct d.prospect_id) filter (
      where d.event_type = 'imported'
    ) as imported,
    count(distinct d.prospect_id) filter (
      where d.event_type in ('eligible', 'queued')
    ) as eligible_queued,
    count(*) filter (where d.event_type = 'sent') as sent_messages,
    count(distinct d.prospect_id) filter (
      where d.event_type = 'sent' and d.sequence_step = 1
    ) as touch_1_sent,
    count(*) filter (
      where d.event_type = 'delivered'
    ) as delivered_messages,
    count(distinct d.prospect_id) filter (
      where d.event_type = 'positive'
    ) as positive,
    count(distinct d.prospect_id) filter (
      where d.event_type = 'neutral'
    ) as neutral,
    count(distinct d.prospect_id) filter (
      where d.event_type = 'objection'
    ) as objection,
    count(distinct d.prospect_id) filter (
      where d.event_type = 'opt_out'
    ) as opt_out,
    count(*) filter (
      where d.event_type = 'bounced'
    ) as bounced_messages,
    count(distinct d.prospect_id) filter (
      where d.event_type = 'booked'
    ) as booked,
    count(distinct d.prospect_id) filter (
      where d.event_type = 'baseline_completed'
    ) as baseline_completed,
    count(distinct d.prospect_id) filter (
      where d.event_type = 'checkout_started'
    ) as checkout_started,
    count(distinct d.prospect_id) filter (
      where d.event_type = 'paid'
    ) as paid,
    count(distinct d.prospect_id) filter (
      where d.event_type = 'refunded'
    ) as refunded,
    count(distinct d.prospect_id) filter (
      where d.event_type = 'lost'
    ) as lost,
    coalesce(
      sum(d.amount_paid) filter (where d.event_type = 'paid'),
      0
    )::numeric(12, 2) as paid_revenue
  from deduplicated d
  group by
    d.week_start,
    d.campaign_id,
    d.segment,
    d.trigger,
    d.template_version
)
select
  a.week_start,
  a.campaign_id,
  c.campaign_key as campaign,
  a.segment,
  a.trigger,
  a.template_version,
  a.imported,
  a.eligible_queued,
  a.sent_messages,
  a.touch_1_sent,
  a.delivered_messages,
  case
    when a.sent_messages = 0 then null
    else round(a.delivered_messages::numeric * 100 / a.sent_messages, 2)
  end as delivery_rate,
  a.positive,
  a.neutral,
  a.objection,
  a.opt_out,
  a.bounced_messages,
  case
    when a.sent_messages = 0 then null
    else round(a.bounced_messages::numeric * 100 / a.sent_messages, 2)
  end as hard_bounce_rate,
  a.booked,
  a.baseline_completed,
  a.checkout_started,
  a.paid,
  a.refunded,
  a.lost,
  a.paid_revenue
from aggregated a
join public.outreach_campaigns c on c.id = a.campaign_id;

revoke all on table public.outreach_weekly_funnel
  from public, anon, authenticated;
grant select on table public.outreach_weekly_funnel to service_role;
