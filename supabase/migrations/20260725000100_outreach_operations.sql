-- Operator-only storage for the BrightCert founding-customer outreach pilot.
-- This migration intentionally grants no access to anon or authenticated roles.

create extension if not exists pgcrypto;

create table if not exists public.outreach_campaigns (
  id uuid primary key default gen_random_uuid(),
  campaign_key text not null unique check (length(trim(campaign_key)) between 1 and 100),
  name text not null check (length(trim(name)) between 1 and 200),
  segment text not null check (segment in ('sme', 'msp', 'mixed')),
  template_version text not null check (length(trim(template_version)) between 1 and 100),
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.outreach_companies (
  id uuid primary key default gen_random_uuid(),
  company_number text not null unique check (
    company_number = upper(company_number)
    and company_number ~ '^[A-Z0-9]{2,8}$'
  ),
  company_name text not null check (length(trim(company_name)) > 0),
  company_status text not null check (length(trim(company_status)) > 0),
  company_type text not null check (
    company_type in (
      'ltd',
      'plc',
      'llp',
      'private-unlimited',
      'private-unlimited-nsc',
      'private-limited-guarant-nsc',
      'private-limited-guarant-nsc-limited-exemption',
      'private-limited-shares-section-30-exemption'
    )
  ),
  companies_house_checked_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, company_number)
);

create table if not exists public.outreach_prospects (
  id uuid primary key default gen_random_uuid(),
  prospect_id text not null unique check (length(trim(prospect_id)) between 1 and 150),
  campaign_id uuid not null references public.outreach_campaigns(id),
  company_id uuid not null,
  segment text not null check (segment in ('sme', 'msp')),
  template_version text not null check (length(trim(template_version)) between 1 and 100),
  company_name text not null check (length(trim(company_name)) > 0),
  company_number text not null check (
    company_number = upper(company_number)
    and company_number ~ '^[A-Z0-9]{2,8}$'
  ),
  domain text not null check (domain = lower(domain)),
  legal_entity_type text not null check (
    legal_entity_type in (
      'ltd',
      'plc',
      'llp',
      'private-unlimited',
      'private-unlimited-nsc',
      'private-limited-guarant-nsc',
      'private-limited-guarant-nsc-limited-exemption',
      'private-limited-shares-section-30-exemption'
    )
  ),
  employee_band text not null check (length(trim(employee_band)) > 0),
  sector text not null check (length(trim(sector)) > 0),
  contact_name text,
  role text,
  work_email text check (
    work_email is null
    or (work_email = lower(work_email) and work_email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$')
  ),
  work_email_hash text,
  email_status text not null check (length(trim(email_status)) > 0),
  company_status text not null check (length(trim(company_status)) > 0),
  companies_house_checked_at timestamptz not null,
  source_url text check (source_url is null or source_url ~ '^https?://'),
  source_date date not null,
  trigger text not null check (length(trim(trigger)) > 0),
  trigger_evidence_url text check (
    trigger_evidence_url is null or trigger_evidence_url ~ '^https?://'
  ),
  personalisation_note text,
  lawful_basis text not null check (lawful_basis = 'legitimate_interests'),
  lia_status text not null check (lia_status in ('pending', 'approved', 'rejected')),
  suppression_status text not null check (suppression_status in ('clear', 'suppressed')),
  human_approved_at timestamptz,
  existing_customer boolean not null default false,
  sequence_status text not null default 'candidate' check (
    sequence_status in (
      'candidate',
      'approved',
      'touch_1_sent',
      'touch_2_sent',
      'touch_3_sent',
      'replied',
      'opted_out',
      'bounced',
      'customer',
      'closed'
    )
  ),
  expires_at timestamptz not null,
  personal_data_purged_at timestamptz,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, work_email),
  unique (id, campaign_id),
  foreign key (company_id, company_number)
    references public.outreach_companies (id, company_number)
);

create table if not exists public.outreach_suppressions (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('email', 'domain', 'company')),
  value text not null check (length(trim(value)) > 0),
  reason text not null check (length(trim(reason)) > 0),
  source text not null default 'operator',
  created_at timestamptz not null default now(),
  unique (scope, value)
);

create table if not exists public.outreach_events (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.outreach_campaigns(id),
  prospect_id uuid not null,
  event_type text not null check (
    event_type in (
      'imported',
      'eligible',
      'queued',
      'sent',
      'delivered',
      'positive',
      'neutral',
      'objection',
      'reply',
      'opt_out',
      'bounced',
      'booked',
      'baseline_completed',
      'checkout_started',
      'paid',
      'customer',
      'refunded',
      'lost',
      'closed'
    )
  ),
  segment text not null check (segment in ('sme', 'msp')),
  trigger text,
  template_version text,
  sequence_step smallint check (sequence_step between 1 and 3),
  occurred_at timestamptz not null default now(),
  amount_paid numeric(12, 2) check (amount_paid is null or amount_paid >= 0),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  check (
    event_type not in ('sent', 'delivered', 'bounced')
    or sequence_step is not null
  ),
  foreign key (prospect_id, campaign_id)
    references public.outreach_prospects (id, campaign_id)
);

create table if not exists public.outreach_send_attempts (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.outreach_campaigns(id),
  prospect_id uuid not null,
  sequence_step smallint not null check (sequence_step between 1 and 3),
  status text not null check (status in ('queued', 'sent', 'delivered', 'failed', 'cancelled')),
  attempted_at timestamptz,
  failure_code text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  unique (campaign_id, prospect_id, sequence_step),
  foreign key (prospect_id, campaign_id)
    references public.outreach_prospects (id, campaign_id)
);

create index if not exists outreach_prospects_company_idx
  on public.outreach_prospects (company_id);
create index if not exists outreach_prospects_state_idx
  on public.outreach_prospects (campaign_id, sequence_status);
create index if not exists outreach_events_funnel_idx
  on public.outreach_events (
    occurred_at,
    campaign_id,
    event_type,
    sequence_step,
    prospect_id
  );
create unique index if not exists outreach_events_message_step_idx
  on public.outreach_events (
    campaign_id,
    prospect_id,
    event_type,
    sequence_step
  )
  where event_type in ('sent', 'delivered', 'bounced');
create index if not exists outreach_suppressions_lookup_idx
  on public.outreach_suppressions (scope, value);

create or replace function public.reject_outreach_event_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'outreach_events is append-only';
end;
$$;

drop trigger if exists outreach_events_append_only on public.outreach_events;
create trigger outreach_events_append_only
  before update or delete on public.outreach_events
  for each row execute function public.reject_outreach_event_mutation();

create or replace function public.reject_outreach_suppression_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'outreach_suppressions is append-only';
end;
$$;

drop trigger if exists outreach_suppressions_append_only on public.outreach_suppressions;
create trigger outreach_suppressions_append_only
  before update or delete on public.outreach_suppressions
  for each row execute function public.reject_outreach_suppression_mutation();

create or replace function public.purge_expired_outreach_prospect_personal_data(
  p_now timestamptz default now()
)
returns integer
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  affected integer;
begin
  update public.outreach_prospects
  set
    work_email_hash = null,
    work_email = null,
    contact_name = null,
    role = null,
    source_url = null,
    trigger_evidence_url = null,
    personalisation_note = null,
    metadata = '{}'::jsonb,
    personal_data_purged_at = p_now,
    updated_at = p_now
  where expires_at <= p_now
    and personal_data_purged_at is null;

  get diagnostics affected = row_count;
  return affected;
end;
$$;

alter table public.outreach_campaigns enable row level security;
alter table public.outreach_companies enable row level security;
alter table public.outreach_prospects enable row level security;
alter table public.outreach_suppressions enable row level security;
alter table public.outreach_events enable row level security;
alter table public.outreach_send_attempts enable row level security;

create or replace view public.outreach_weekly_funnel
with (security_invoker = true)
as
with deduplicated as (
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
  from public.outreach_events e
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
  count(distinct d.prospect_id) filter (where d.event_type = 'imported') as imported,
  count(distinct d.prospect_id) filter (where d.event_type in ('eligible', 'queued')) as eligible_queued,
  count(*) filter (where d.event_type = 'sent') as sent_messages,
  count(distinct d.prospect_id) filter (
    where d.event_type = 'sent' and d.sequence_step = 1
  ) as touch_1_sent,
  count(*) filter (where d.event_type = 'delivered') as delivered_messages,
  count(distinct d.prospect_id) filter (where d.event_type = 'positive') as positive,
  count(distinct d.prospect_id) filter (where d.event_type = 'neutral') as neutral,
  count(distinct d.prospect_id) filter (where d.event_type = 'objection') as objection,
  count(distinct d.prospect_id) filter (where d.event_type = 'opt_out') as opt_out,
  count(*) filter (where d.event_type = 'bounced') as bounced_messages,
  count(distinct d.prospect_id) filter (where d.event_type = 'booked') as booked,
  count(distinct d.prospect_id) filter (where d.event_type = 'baseline_completed') as baseline_completed,
  count(distinct d.prospect_id) filter (where d.event_type = 'checkout_started') as checkout_started,
  count(distinct d.prospect_id) filter (where d.event_type = 'paid') as paid,
  count(distinct d.prospect_id) filter (where d.event_type = 'refunded') as refunded,
  count(distinct d.prospect_id) filter (where d.event_type = 'lost') as lost,
  coalesce(sum(d.amount_paid) filter (where d.event_type = 'paid'), 0)::numeric(12, 2) as paid_revenue
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

revoke all on table public.outreach_campaigns from public, anon, authenticated;
revoke all on table public.outreach_companies from public, anon, authenticated;
revoke all on table public.outreach_prospects from public, anon, authenticated;
revoke all on table public.outreach_suppressions from public, anon, authenticated;
revoke all on table public.outreach_events from public, anon, authenticated;
revoke all on table public.outreach_send_attempts from public, anon, authenticated;
revoke all on table public.outreach_weekly_funnel from public, anon, authenticated;
revoke all on function public.reject_outreach_event_mutation() from public, anon, authenticated;
revoke all on function public.reject_outreach_suppression_mutation() from public, anon, authenticated;
revoke all on function public.purge_expired_outreach_prospect_personal_data(timestamptz) from public, anon, authenticated;

grant all on table public.outreach_campaigns to service_role;
grant all on table public.outreach_companies to service_role;
grant all on table public.outreach_prospects to service_role;
grant all on table public.outreach_suppressions to service_role;
grant all on table public.outreach_events to service_role;
grant all on table public.outreach_send_attempts to service_role;
grant select on table public.outreach_weekly_funnel to service_role;
grant execute on function public.purge_expired_outreach_prospect_personal_data(timestamptz) to service_role;
