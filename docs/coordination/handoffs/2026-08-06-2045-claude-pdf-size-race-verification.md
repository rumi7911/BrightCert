# Handoff — deployed verification of PDF size and single-flight generation

Agent: Claude Code
Date: 6 August 2026, 20:45 BST
Branch: `claude/pdf-size-verification`
Worktree: `.worktrees/pdf-size-verification`
Commit: see branch tip

## Task

Verify, on the deployed build, both halves of `claude/pdf-size-and-race` after
the owner applied its prerequisite migration and merged it — then record the
evidence.

## What happened

The owner applied
`supabase/migrations/20260804000100_reports_unique_assessment.sql` in the
Supabase SQL Editor (`Success. No rows returned`). Index existence was then
proven independently by probing PostgREST with a non-existent assessment id:
the response was `23503` (foreign key), **not** `42P10`, which means the planner
accepted `on conflict (assessment_id)` and the index exists. No row was written.

`claude/pdf-size-and-race` was merged to `main` as `b46e957` and pushed by the
owner, producing production deployment `dpl_95sCzWQSMZPQw14ie1T18RZrs6r8`.
Deploy identity was proven by byte-matching `logo-mark-report.png` (10,195 B),
an asset that did not exist before this merge.

| Result | Value |
|---|---|
| Deployed PDF size | **308,210 B** (was 3,860,209 B) — 12.5× smaller |
| Pages | 24, A4, unchanged |
| Images embedded | present (120 `/Image` byte occurrences) — file tracing works |
| Three simultaneous callers | one `200` (9.22 s), two `202` (2.38 s, 2.77 s) |
| `reports` rows written | **1** (the 3 August bug produced 3) |
| Repeat call after completion | `200` in 1.03 s — served, not re-rendered |

Full evidence:
[`PDF-SIZE-RACE-VERIFICATION-2026-08-06.md`](../../outreach/PDF-SIZE-RACE-VERIFICATION-2026-08-06.md).

## External state changed

Assessment `182d5f7f-0202-40dc-ad23-7a78229724ec` (org "Sohaib",
founder-owned) was set to `paid` twice, for roughly 15 seconds each time, and
restored to `analysed` both times. Only `status` was ever written — `paid_at`,
`amount_paid` and `stripe_session_id` stayed null throughout, and were read back
to prove it. Restoration ran from a shell `trap` so it would execute even on
failure or interrupt.

The report row created by each run was deleted. `reports` is back to its single
pre-existing row (`78c383b1`). No Stripe object was created and no charge was
made.

**Two GCS objects were written** at the deterministic path for that assessment
(one per run, the second overwriting the first). Nothing in the codebase deletes
GCS objects, so it remains. The orphan count did not grow.

**Two report-ready emails were sent** to the founder's own address. The route's
email call is fire-and-forget and cannot be suppressed by the caller.

## Commands and results

Pre-merge, on `claude/pdf-size-and-race`:

| Command | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npm run lint` | clean |
| `npm run test:run` | 35 files / 266 tests passed |
| `npm run build` (on merged `main`) | clean |

The merged result was built before pushing, not just the branch.

Verification scripts are preserved in the session scratchpad as
`verify-pdf-size.sh` and `verify-single-flight.sh`. Both were executed by the
owner: the Claude Code permission classifier blocked the agent's own
`git push origin main` and its production-database writes.

## Remaining risks

- **The Stripe webhook → generate chain has still never run on a deployed
  build.** Both verifications used the internal shared-secret caller path. This
  is the last untested link in the paid lifecycle; closing it costs a real £199
  purchase at roughly £3.19 in non-refundable fees.
- **Stale-claim takeover is unit-tested only.** The compare-and-swap that
  reclaims a claim abandoned by a crashed renderer after 90 s was not provoked
  in production; doing so would require killing a function mid-render.
- **GCS retention is still undecided.** Four orphaned objects remain, one
  (`527184e7-…`) with no matching assessment row.
- Concurrency was synthesised, not observed under real load — no real customer
  has ever paid.

## Files touched

- `docs/outreach/PDF-SIZE-RACE-VERIFICATION-2026-08-06.md` (new)
- `docs/coordination/PROJECT-STATUS.md` (Production, Active work, Immediate
  priorities)
- this handoff

`docs/outreach/LAUNCH-GATE.md` was **deliberately not touched.**
`codex/reminder-evidence-integration` already conflicts with `main` on that
file, and two appends on 4 August made the conflict worse. A third append would
compound it for no benefit — the launch gate already records all 34 rows
verified.

## Next safe action

Merge this branch and `claude/outreach-trigger-research` (both docs-only, no
code surface, no conflict with each other). Then the work is outreach: the
pipeline holds zero real prospects, and the gating unknown is whether the IASME
certificate register supports postcode search — browser-only, since IASME 403s
automated requests.
