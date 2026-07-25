-- Codex audit round 4 (2026-07-25). Run manually in the Supabase SQL
-- editor — idempotent, safe to re-run.
--
-- assessments.draft_reminder_24h_sent_at / draft_reminder_72h_sent_at:
-- written by src/app/api/cron/draft-reminders/route.ts, tracking each of the
-- two lifecycle nudges independently so a 24h send doesn't block or get
-- confused with the separate 72h send for the same assessment.

ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS draft_reminder_24h_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS draft_reminder_72h_sent_at timestamptz;
