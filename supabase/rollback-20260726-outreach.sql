-- Targeted rollback for the 26 July 2026 outreach launch migrations:
--   attribution-and-reminders.sql
--   migrations/20260725000100_outreach_operations.sql
--   migrations/20260726000100_outreach_sequence_step_reporting.sql
--   migrations/20260726000200_outreach_message_cohort_reporting.sql
--
-- Those four are purely additive (new tables, new nullable columns, no
-- existing data touched), so reversing them is just dropping what they
-- added — no destructive pg_restore needed, and every real row in
-- organisations/assessments/control_scores/reports/responses is untouched.
-- Run in the Supabase SQL Editor only if those migrations need to be undone.

drop view if exists public.outreach_weekly_funnel;
drop table if exists public.outreach_send_attempts;
drop table if exists public.outreach_events;
drop table if exists public.outreach_suppressions;
drop table if exists public.outreach_prospects;
drop table if exists public.outreach_companies;
drop table if exists public.outreach_campaigns;
drop function if exists public.purge_expired_outreach_prospect_personal_data(timestamptz);
drop function if exists public.reject_outreach_suppression_mutation();
drop function if exists public.reject_outreach_event_mutation();

alter table organisations
  drop column if exists utm_source,
  drop column if exists utm_medium,
  drop column if exists utm_campaign,
  drop column if exists utm_content,
  drop column if exists first_utm_source,
  drop column if exists first_utm_medium,
  drop column if exists first_utm_campaign,
  drop column if exists first_utm_content,
  drop column if exists last_utm_source,
  drop column if exists last_utm_medium,
  drop column if exists last_utm_campaign,
  drop column if exists last_utm_content;
alter table assessments drop column if exists reminder_sent_at;
