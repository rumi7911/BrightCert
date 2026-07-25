-- Columns added manually via the Supabase SQL editor on 2026-07-24, tracked
-- here so a fresh environment/DB rebuild doesn't silently break UTM
-- attribution or the unlock-reminder cron. Idempotent — safe to re-run.
--
-- organisations UTM columns: consented attribution written by
-- src/app/auth/callback/route.ts. The flat values retain the latest touch for
-- existing signup/reporting consumers; first_* and last_* preserve lineage.
--
-- assessments.reminder_sent_at: written by
-- src/app/api/cron/unlock-reminders/route.ts to avoid re-sending the same
-- "unlock your report" reminder on every daily run.

ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS first_utm_source text,
  ADD COLUMN IF NOT EXISTS first_utm_medium text,
  ADD COLUMN IF NOT EXISTS first_utm_campaign text,
  ADD COLUMN IF NOT EXISTS first_utm_content text,
  ADD COLUMN IF NOT EXISTS last_utm_source text,
  ADD COLUMN IF NOT EXISTS last_utm_medium text,
  ADD COLUMN IF NOT EXISTS last_utm_campaign text,
  ADD COLUMN IF NOT EXISTS last_utm_content text;

ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS reminder_sent_at timestamptz;
