# Agent task handoff

- **Agent:** Claude Code
- **Date/time (BST):** 28 July 2026, 22:07
- **Task:** Commit the reminder provider-failure rehearsal evidence into
  versioned history
- **Branch:** `claude/reminder-dry-run-evidence`
- **Worktree:** `.worktrees/reminder-dry-run-evidence`
- **Base commit:** `89c0e5f`
- **Final commit:** The commit containing this handoff
- **Status:** Partial — the evidence document is committed; the matching
  `LAUNCH-GATE.md` row change is deliberately **not** included (see Overlapping
  work)

## Scope and ownership

- **Files intentionally changed:**
  `docs/outreach/REMINDER-DRY-RUN-2026-07-28.md` (new) and this handoff.
- **Files inspected but not changed:** `docs/outreach/LAUNCH-GATE.md`,
  `src/app/api/cron/unlock-reminders/route.ts`,
  `src/app/api/cron/draft-reminders/route.ts`, `src/lib/resend/emails.ts`,
  `vercel.json`, `docs/coordination/PROJECT-STATUS.md`, and the newest
  coordination handoffs.
- **Overlapping work discovered:** Yes — `docs/outreach/LAUNCH-GATE.md` in dirty
  `main` contains **22 uncommitted changed rows**, of which only the
  `Reminder dry-run` row is this task's work. The other 21 rows are owner/Codex
  work from 27–28 July. Staging that file would have swept 21 rows of another
  agent's unreviewed work into this commit, so it was excluded. The owner has
  confirmed they will reconcile `LAUNCH-GATE.md` themselves.
- **Files another agent must not overwrite:** none introduced by this task. The
  identical evidence document also still exists as an untracked file in dirty
  `main`; it is safe to discard there once this branch is integrated.

## Changes

Documentation only. No source file, test, configuration, schema, or dependency
was changed on this branch.

The new evidence document records a provider-failure rehearsal of both reminder
cron routes, run earlier on 28 July 2026 against the real routes and the real
production database. It closes the evidence gap behind the `Reminder dry-run`
launch-gate row, which required proof that the reminder path surfaces
provider/API failure, does not record false success, and sends no unintended
live reminder.

Key result: `unlock-reminders` correctly distinguishes a **transient** provider
failure (error surfaced, `reminder_sent_at` left `null`, retried next run) from
a **permanent** recipient-lookup failure (error surfaced, `reminder_sent_at`
stamped to suppress an identical retry forever), and records success in neither
case. `throwIfResendError` (`src/lib/resend/emails.ts:15`) is load-bearing —
the Resend SDK returns delivery errors in the response body rather than
throwing, so without that guard a failed send would have fallen through to the
success branch and consumed the customer's only reminder.

## Verification

Rehearsal commands and results (run 28 July 2026 from the `main` worktree
against production data, before this branch existed):

```text
Blast-radius check before creating any fixture:
  GET /rest/v1/assessments?status=eq.analysed&reminder_sent_at=is.null
  -> analysed+unstamped total: 0 ; DUE (>24h): 0
  (only disposable fixtures were reachable by the route)

curl -H "Authorization: Bearer $CRON_SECRET" /api/cron/unlock-reminders
  -> {"processed":2,"sent":0,"failed":2}  HTTP 200

Scenario A (valid recipient chain, provider rejects send):
  Error: API key is invalid
    at throwIfResendError (src/lib/resend/emails.ts:15:29)
    at sendUnlockReminderEmail (src/lib/resend/emails.ts:179:3)
    at async GET (src/app/api/cron/unlock-reminders/route.ts:77:7)
  read-back -> reminder_sent_at: null            (retry preserved)

Scenario B (organisation with no owner profile):
  Error: No owner profile for org ... at route.ts:56
  read-back -> reminder_sent_at: 2026-07-28T20:44:04.855+00:00  (retry suppressed)

Scenario C: GET /api/cron/draft-reminders?dryRun=true
  -> {"dryRun":true,"wouldSend":0,"recipients":[]}  HTTP 200

Scenario D: both routes, no bearer and wrong bearer
  -> 401, 401, 401

Teardown (FK-safe order) -> 204/204/204/204/204/200
Read-back after teardown:
  fixture assessments []   fixture orgs []   fixture profile []
  organisations name like *Rehearsal* []
  unlock-reminders due-row query []   (back to pre-rehearsal state)
```

Branch verification:

```text
git worktree add .worktrees/reminder-dry-run-evidence \
  -b claude/reminder-dry-run-evidence origin/main
  -> HEAD is now at 89c0e5f

diff -q <authored original> <worktree copy>   -> identical
link targets LAUNCH-GATE.md, VERIFICATION-2026-07-26.md  -> both resolve
secret scan (resend/stripe/jwt/service_role/CRON_SECRET patterns) -> clean
```

No test, lint, type-check or build command was run for this branch, because
**no code surface changed** — the diff is two Markdown files. Running the
JavaScript suite here would produce a result that says nothing about this
change; it is recorded as not applicable rather than performed for appearance.
Any code-surface verification remains owed by whichever branch changes code.

## External state

- **Database writes:** Yes, during the rehearsal (not during this commit). Two
  disposable organisations, one disposable auth user, one disposable profile and
  two disposable assessments were created in the production Supabase project,
  and one of those fixture assessments had `reminder_sent_at` stamped by the
  route under test. All six records were deleted afterwards and absence was
  confirmed by read-back, including a name-pattern sweep. No pre-existing row
  was created, modified, or deleted.
- **Deployment:** None.
- **Emails/messages:** None. No email left the machine. Three independent
  guards: an invalid `RESEND_API_KEY` override (proven in use by the observed
  `API key is invalid` error), `.invalid` fixture recipients (RFC 2606 reserved,
  can never resolve), and the measured zero-real-row blast radius above.
- **Payments:** None.
- **Other external actions:** Pushed this task branch to origin. No merge, no
  production deployment, no migration.

## Remaining risks or blockers

- **Blocker (owner-owned):** the `Reminder dry-run` row in
  `docs/outreach/LAUNCH-GATE.md` is still uncommitted in dirty `main`, mixed
  with 21 other pending rows. Until the owner reconciles that file, the gate
  status is not in versioned history even though the evidence now is.
- **Improvement, not a gap:** `unlock-reminders` has no `?dryRun=true` mode,
  unlike `draft-reminders`. That asymmetry is why this path had no prior
  evidence, and it means the unlock-reminder recipient list cannot be previewed
  before a live run. The gate's own requirements are met without it. Adding the
  flag for parity would be a small, well-bounded follow-up task.
- The rehearsal exercised the failure paths. The **success** path
  (`sent > 0` with a real provider accepting the message) was deliberately not
  exercised, because doing so requires a live send. Its stamping behaviour is
  therefore proven by code reading and by the negative cases, not by observation.

## Next safe action

Owner reconciles `docs/outreach/LAUNCH-GATE.md` in dirty `main` and integrates
this branch. After that, per `PROJECT-STATUS.md` priority order, the next
bounded task is reviewing and integrating `codex/production-report-redesign`
(`d33e62d`) — which is the prerequisite for the remaining open `PDF/report`
launch-gate row and for any deterministic-assessment work. Do not start the
PDF/report retest from dirty `main`.
