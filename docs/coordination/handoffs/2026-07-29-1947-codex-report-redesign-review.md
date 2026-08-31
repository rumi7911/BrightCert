# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 29 July 2026, 19:47
- **Task:** Read-only release review of the production report redesign and
  durable artifact lifecycle candidate
- **Branch:** `codex/report-redesign-review`
- **Worktree:** `.worktrees/report-redesign-review`
- **Base commit:** `89c0e5f`
- **Final commit:** This handoff is the only change on the review branch.
- **Status:** Complete; implementation candidate is not ready to integrate

## Scope and ownership

- **Files intentionally changed:** this handoff only.
- **Files inspected but not changed:** the complete Git range
  `32b18c6..d33e62d` in `.worktrees/production-report-redesign`, its two plan
  documents, rollout runbook, routes, worker, repository layer, migrations,
  backfill, PDF implementation and tests; the corresponding dirty-main PDF
  files and evidence.
- **Overlapping work discovered:** dirty `main` has different uncommitted
  versions of `src/lib/pdf/ReportDocument.tsx`,
  `src/lib/pdf/ReportDocument.test.tsx` and
  `docs/outreach/PDF-REPORT-VERIFICATION-2026-07-27.md`.
- **Files another agent must not overwrite:** those dirty-main files remain
  owner work. Do not rebase, merge or copy the candidate over them without an
  explicit reconciliation.

## Changes

No implementation was changed. This branch records an independently checked
release decision for candidate commit `d33e62d`.

The candidate is a 111-file, approximately 22,000-line lifecycle rewrite with
four database migrations, not only a visual PDF redesign. It diverges from
current `origin/main` at `32b18c6`, is not present on an origin branch, and
must not be treated as integrated or deployable merely because its local tests
are green.

## Verification

```text
git status --short --branch
-> codex/production-report-redesign clean at d33e62d

git merge-base d33e62d origin/main
-> 32b18c6

git diff --stat origin/main...d33e62d
-> 111 files; 22,253 insertions; 1,355 deletions

remote branches containing d33e62d
-> none

npm run test:run
-> 39 test files passed; 464 tests passed

npm run lint
-> exit 0 with 3 unused-variable warnings in
   src/lib/pdf/report/report-view-model.ts

set -a; source <repository .env.local>; set +a; npm run build
-> passed; TypeScript passed; 32 static pages generated

SHA-256 and diff comparison of candidate versus dirty-main PDF source, test,
and verification document
-> all three differ materially
```

An independent senior-code-review pass inspected the plans and Git range and
confirmed the strengths and blockers below.

## Findings

### Strengths

- Repository rows are defensively decoded and bound to exact
  assessment/source/renderer/analysis identities.
- Report completion and refund processing serialize on the assessment row.
- Download authorization is checked at request time; signed URLs are
  five-minute and responses are `private, no-store`.
- Immutable object keys, lease tokens, bounded retries, Stripe refund
  tombstones and explicit legacy provenance are sound design choices.
- The evidence correctly calls this an undeployed candidate and documents the
  Hobby scheduler constraint.

### Important blockers

1. **No worker trigger on the current deployment.**
   `vercel.json` contains only the two existing daily reminder jobs.
   `src/app/api/reports/generate/route.ts` and the Stripe webhook only enqueue;
   `src/components/brightcert/pdf-poller.tsx` only refreshes; the sole consumer
   is `/api/cron/report-generations`. The rollout deliberately leaves it
   unscheduled on Hobby. A newly paid customer without a legacy artifact would
   remain queued indefinitely.

2. **Ambiguous completion can leave sensitive orphan PDFs.**
   `src/lib/reports/worker.ts:238-263` intentionally retains an uploaded object
   when completion fails after the lease can no longer be proven. Lease expiry
   between upload and completion can therefore leave a GCS object with no
   persisted artifact or cleanup path. Refund cancellation has the same risk
   around lines 221-235.

3. **Duplicate legacy rows can receive false provenance.**
   `scripts/backfill-report-artifacts.ts:76-80,145-146` scans oldest first even
   though duplicate report rows for one assessment point to the same mutable
   `reports/<assessment>.pdf` object. The first row can win the unique
   storage-key conflict and attach the current object to the wrong historical
   ID/timestamp. The dry run uses different conflict semantics and can
   overstate what the real run will insert. The related SQL is at
   `supabase/migrations/20260728000200_report_artifact_legacy_backfill.sql:67-82`.

## External state

- **Database writes:** None.
- **Deployment:** None.
- **Emails/messages:** None.
- **Payments:** None.
- **Other external actions:** None. The implementation branch was not pushed,
  rebased, merged or modified.

## Remaining risks or blockers

- The owner has deferred a Vercel upgrade until after the hackathon. Under
  that decision, the asynchronous lifecycle switch cannot complete paid
  reports without an explicitly approved alternative trigger.
- The branch migrations depend on the existing out-of-band production schema;
  there is still no repository baseline that makes a fresh database reset
  reproduce that schema.
- Production PDF verification remains open and must not run from dirty `main`.

## Next safe action

Do not integrate `d33e62d`. First choose a current-Hobby-compatible delivery
path, preferably retaining synchronous generation for the hackathon rather
than deploying an unconsumed queue. Then:

1. reconcile orphan uploads after ambiguous completion by looking up the
   unique artifact ID and deleting only when no persisted ready artifact
   exists;
2. make legacy backfill group/fail closed on duplicates or explicitly choose
   the newest row, with identical dry-run/write semantics;
3. add focused tests for both cases;
4. reconcile the dirty-main PDF variants;
5. rebase the corrected candidate onto current `origin/main` and repeat the
   full verification before any owner-controlled integration.
