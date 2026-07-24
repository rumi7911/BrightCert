-- Codex audit round 3 (2026-07-24/25). Run manually in the Supabase SQL
-- editor — idempotent, safe to re-run.
--
-- assessments.stripe_session_id/amount_paid/currency/paid_at: written by
-- src/app/api/stripe/webhook/route.ts and the fallback verification branch
-- in src/app/(app)/assessment/[id]/report/page.tsx, so a `paid` status can
-- be backed by an actual verified Stripe payment record instead of just a
-- status flag.
--
-- organisations.utm_content: deeper Clay attribution (distinguishes email
-- copy/CTA variants within the same campaign), written by
-- src/app/auth/callback/route.ts from the bc_attribution cookie set in
-- src/proxy.ts, alongside the existing utm_source/medium/campaign columns.

ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS stripe_session_id text,
  ADD COLUMN IF NOT EXISTS amount_paid integer,
  ADD COLUMN IF NOT EXISTS currency text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS utm_content text;
