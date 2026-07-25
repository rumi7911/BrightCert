# Task 3 second scoped fix report

Base: `d319fb4`

## Changes

- File-backed message events are now globally idempotent on the exact
  `(campaign, prospect_id, event_type, sequence_step)` key. A duplicate
  `sent`, `delivered`, or `bounced` event fails explicitly while the event CSV
  remains byte-for-byte unchanged. The check runs inside the existing exclusive
  file lock, so concurrent writers share the same decision boundary.
- Weekly file reports canonicalise message events globally before assigning a
  week or dimensions. The earliest valid occurrence owns the row; later
  cross-week duplicates cannot inflate weekly or cumulative totals. Distinct
  sequence steps remain distinct messages, and only step 1 contributes to
  `touch_1_sent`.
- Restored `20260725000100_outreach_operations.sql` to its exact historical
  `08e0f0d` contents. A new ordered
  `20260726000100_outreach_sequence_step_reporting.sql` performs the Task 3
  schema upgrade for databases that already applied the original migration.
- The forward migration adds the sequence field, uses `NOT VALID` constraints
  so legacy rows are preserved while new message writes require valid steps,
  fails clearly if unreconciled duplicate message keys prevent uniqueness,
  replaces the message index and weekly view, globally selects the earliest
  message occurrence with `row_number()`, and restores the view's
  security-invoker and service-role-only access. It never updates or deletes
  append-only event history and is manually idempotent after success.
- Updated the operator runbook, scorecard, and launch gate to describe global
  file/report idempotency, earliest-occurrence ownership, correct cumulative
  sums, and the ordered migration set.

## RED/GREEN evidence

1. Global file/message idempotency and cross-week reporting:
   - RED: the workflow, CLI, and migration run executed 56 tests with 10
     failures and 46 passes. Duplicate file events were accepted, cross-week
     duplicates inflated report rows, the forward migration was absent, and
     the original migration still contained Task 3 edits.
   - GREEN: the focused workflow and CLI suites passed 45 tests. Cross-week
     duplicates for all three message event types fail without changing the
     event file; reporting assigns deliberately out-of-order duplicates to the
     earliest occurrence while preserving a distinct second step.
2. Forward migration:
   - GREEN: the migration suite passed 11 tests against the ordered initial and
     forward migration set. It verifies the historical baseline, guarded
     column/constraint upgrade, duplicate preflight, replacement indexes,
     global canonicalisation, append-only history, and restored view security.

## Verification

- Focused outreach suite: 5 files passed, 135 tests passed.
- Full Vitest suite: 9 files passed, 149 tests passed.
- Full ESLint: exit 0.
- `npx tsc --noEmit`: exit 0.
- Production build with the existing repository-local environment: exit 0;
  all 30 static pages generated. The pre-existing multiple-lockfile/Turbopack
  root warning remains.
- Installed CLI duplicate smoke in a temporary directory:
  - validation, imported event, and step 1 send succeeded;
  - the same step 1 send in a later week failed with the explicit duplicate
    error and left the event-store SHA-256 unchanged;
  - a distinct step 2 send succeeded;
  - the report contained two total sent messages and one Touch 1.
- Migration and hygiene audit:
  - the initial migration is byte-for-byte identical to `08e0f0d`;
  - the later migration is ordered, forward-only, append-history preserving,
    duplicate-safe, sequence-aware, globally canonical, security-invoker, and
    service-role restricted;
  - outreach private/run files remain ignored and no live file or populated
    credential is tracked.
- Task 3 documentation audit: all nine campaign-pack documents plus the
  runbook are present; 30 CLI commands are valid; 50 local links resolve;
  claims checks pass; email copy, ICP, and LIA remain byte-for-byte unchanged
  from `08e0f0d`; only the approved £99/£100/£199 amounts appear.
- The BrightCert privacy page and both ICO guidance links present in the pack
  returned HTTP 200.
- `git diff --check`: exit 0.

## External-only gate

- The migrations are invariant-tested but were not applied because this
  environment has no local PostgreSQL, Supabase CLI, or Docker executable.
  Apply the ordered migration set through the normal reviewed Supabase
  deployment process.
- No live Companies House lookup was made, no email was sent, and no live or
  production data or external service was mutated.
