# Codex handoff: Utonomy LIA and first touches

Date: 16 August 2026
Agent: Codex
Branch: `codex/contracts-finder-review`
Worktree: `/Users/rumipro/Documents/Hackathon/brightcert/.worktrees/contracts-finder-review`
Task commit: `200439b2cff507d3b381ea12137123b2c3b8a513`

> **Redacted 29 August 2026.** This snapshot originally named an individual
> at a prospect company and, in one place, their work email address. The
> repository is public, so both were replaced with role descriptions. The
> underlying values are unchanged in the private ledger under `.outreach/`,
> which is where they belong. Nothing else in this record was altered.

## Bounded task

Accept the owner-approved Utonomy certificate-source boundary, complete the
campaign and account-level legitimate-interests assessment, promote Utonomy to
the private canonical review flow, and prepare the exact personalised email
and LinkedIn first touches without sending or scheduling anything.

## Completed

- Added LIA Amendment 2 for narrow, manual use of public BlockMark organisation
  certificates when the company's own current site independently confirms the
  certification.
- Added Source D to the direct-SME trigger research method with the same
  controls. This does not reopen or weaken the prohibited IASME-register rule.
- Added one Utonomy row to the ignored private canonical prospect file as
  `sequence_status=candidate`, `lia_status=approved`, and blank
  `human_approved_at`.
- Recorded the account-level purpose, necessity, balancing test, evidence, and
  safeguards in `.outreach/utonomy-lia-2026-08-16.md`.
- Prepared the exact email Touch 1, LinkedIn connection note, optional
  post-acceptance note, and controlled order in
  `.outreach/utonomy-first-touches-2026-08-16.md`.
- Updated the ignored private go/no, remaining-cohort, and daily-progress
  records.
- Kept all private prospect and generated validation files at mode `600`.

## Evidence state

- Company: Utonomy Ltd, active UK limited company 09612773.
- Size: 33 employees in the latest extracted filed-account summary; canonical
  band `10-49`.
- Trigger: Utonomy's current company site displays Cyber Essentials; its public
  BlockMark organisation certificate is valid to 7 October 2026.
- Contact: the company's current CEO, who is also an active director. Name
  and mailbox are held in the private ledger only.
- Mailbox: licensed Hunter domain search plus exact verification returned
  valid/deliverable, score 100, SMTP true, and accept-all false at
  `2026-08-16T20:40:34Z`.
- Local duplicate, suppression, customer, and prior-event checks were clear.
- Canonical validation result: one Utonomy row, blocked only by
  `human_approval_missing`. No queue was created.

## Commands and results

- `git fetch --all --prune` — passed during task preflight.
- Coordination files, worktrees, branch status, and overlap were reviewed —
  clean dedicated worktree; no overlap found.
- Private CSV structural assertion — passed: two canonical prospects, exactly
  one Utonomy row, candidate state, blank human approval.
- `npm run outreach -- validate --input .../.outreach/prospects.csv --output .../outreach/runs/utonomy-preapproval-2026-08-16.csv`
  — passed; Utonomy blocked by `human_approval_missing` as intended.
- `git diff --check` — passed.
- `npm run lint` — passed.
- `npx tsc --noEmit` — passed.
- Initial `npm run test:run` — 284 passed and 10 analytics tests failed because
  Node had no local-storage backing file; no task code was implicated.
- `BC_TEST_STORAGE_FILE=$(mktemp) && NODE_OPTIONS="--localstorage-file=$BC_TEST_STORAGE_FILE" npm run test:run`
  — passed, 36 files and 294 tests.
- `npm run build` — passed; Next.js emitted the existing multiple-lockfile root
  warning only.

## External and private state changes

- No email, LinkedIn connection, LinkedIn message, publication, schedule,
  queue, production mutation, or third-party write occurred.
- The prior Hunter lookups are only recorded here; no additional Hunter credit
  was used in this task.
- Private ignored outreach files were updated under
  `/Users/rumipro/Documents/Hackathon/brightcert/.outreach/`.
- A private pre-approval validation snapshot was written under
  `/Users/rumipro/Documents/Hackathon/brightcert/outreach/runs/`.

## Remaining risks and next safe action

- The registry page may present browser verification and its terms or product
  behaviour may change. Any explicit marketing/data-research prohibition,
  private certificate, or visibility ambiguity blocks use immediately.
- The exact copy is not yet owner-approved. Do not set `human_approved_at`, do
  not change the sequence state to `approved`, and do not queue or contact the
  prospect until that approval is explicit.
- After exact-copy approval, update the private canonical approval fields and
  refresh validation, live Companies House verification, suppressions,
  customer/duplicate checks, and inbox/event stop checks on the actual send
  day.
- Cobleys remains paused pending the outcome of its owner-reported accidental
  Sunday send.
