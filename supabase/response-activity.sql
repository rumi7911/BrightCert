-- Codex audit round 6 (2026-07-26). Run manually in the Supabase SQL
-- editor — idempotent, safe to re-run.
--
-- responses.updated_at: bumped explicitly on every save in
-- src/app/(assessment)/assessment/[id]/section/[sectionId]/page.tsx
-- (including edits to an already-answered question), and read by
-- src/app/api/cron/draft-reminders/route.ts to base the 24h/72h
-- abandonment window on real last-touched activity instead of the row's
-- original created_at, which stayed frozen even after an answer was
-- revised.

ALTER TABLE responses
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
