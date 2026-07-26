-- Attribute message outcomes to the canonical sent-message cohort.
-- This forward-only view replacement leaves append-only event history intact.

drop view if exists public.outreach_weekly_funnel;
create view public.outreach_weekly_funnel
with (security_invoker = true)
as
with ranked_sent_events as (
  select
    e.*,
    row_number() over (
      partition by e.campaign_id, e.prospect_id, e.sequence_step
      order by e.occurred_at, e.id
    ) as canonical_rank
  from public.outreach_events e
  where e.event_type = 'sent'
    and e.sequence_step between 1 and 3
),
canonical_sent_events as (
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
  from ranked_sent_events ranked
  where ranked.canonical_rank = 1
),
ranked_outcome_events as (
  select
    e.*,
    row_number() over (
      partition by e.campaign_id, e.prospect_id, e.event_type, e.sequence_step
      order by e.occurred_at, e.id
    ) as canonical_rank
  from public.outreach_events e
  join canonical_sent_events sent
    on sent.campaign_id = e.campaign_id
   and sent.prospect_id = e.prospect_id
   and sent.sequence_step = e.sequence_step
   and e.occurred_at >= sent.occurred_at
  where e.event_type in ('delivered', 'bounced')
    and e.sequence_step between 1 and 3
),
canonical_outcome_events as (
  select
    ranked.campaign_id,
    ranked.prospect_id,
    ranked.event_type,
    ranked.sequence_step,
    ranked.occurred_at,
    ranked.amount_paid
  from ranked_outcome_events ranked
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
    sent.campaign_id,
    sent.prospect_id,
    sent.event_type,
    sent.segment,
    sent.trigger,
    sent.template_version,
    sent.sequence_step,
    sent.occurred_at,
    sent.amount_paid
  from canonical_sent_events sent

  union all

  select
    sent.campaign_id,
    sent.prospect_id,
    outcome.event_type,
    sent.segment,
    sent.trigger,
    sent.template_version,
    sent.sequence_step,
    sent.occurred_at,
    outcome.amount_paid
  from canonical_outcome_events outcome
  join canonical_sent_events sent
    on sent.campaign_id = outcome.campaign_id
   and sent.prospect_id = outcome.prospect_id
   and sent.sequence_step = outcome.sequence_step
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
    else least(
      round(a.delivered_messages::numeric * 100 / a.sent_messages, 2),
      100
    )
  end as delivery_rate,
  a.positive,
  a.neutral,
  a.objection,
  a.opt_out,
  a.bounced_messages,
  case
    when a.sent_messages = 0 then null
    else least(
      round(a.bounced_messages::numeric * 100 / a.sent_messages, 2),
      100
    )
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
