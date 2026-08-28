# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 15 August 2026, 23:50 BST
- **Task:** Promote the owner-approved Cobleys Touch 1 into the private
  canonical prospect ledger and produce the next safe T0 queue evidence.
- **Branch:** `codex/contracts-finder-review`
- **Worktree:** `.worktrees/contracts-finder-review`
- **Base commit:** `ee9cc87`
- **Evidence commit:** `6d90933` (`docs: record Cobleys T0 readiness gate`)
- **Final commit:** The follow-up commit that records the evidence SHA above.
- **Status:** Canonical row locally eligible; live queue blocked before
  Companies House verification; nothing sent

## Scope and ownership

Private owner-only files intentionally changed in the main workspace:

- `.outreach/prospects.csv`
- `.outreach/prospects-rehearsal-2026-07-26.csv`
- `.outreach/final-first-touches-2026-08-15.md`
- `.outreach/go-no-go-2026-08-15.csv`
- `.outreach/cobleys-t0-readiness-2026-08-15.md`
- `.outreach/runs/cobleys-pre-review-validation-2026-08-15.csv`

This handoff is the only tracked file intentionally changed. No application
code, production data, email, LinkedIn connection/message, social post,
schedule, deployment or external service was changed.

The former two `.test` rehearsal prospects were removed from the active
canonical file and preserved intact in the new private rehearsal archive. The
rehearsal event and suppression stores were not deleted or rewritten.

## Result

The canonical private prospect file now contains exactly one real row:

- prospect ID `sme-cobleys-001`;
- COBLEYS SOLICITORS LTD, company number 03943212;
- Paolo Martini, Managing Partner and Director;
- named first-party corporate mailbox, Hunter `valid`, score 100;
- first-party Cyber Essentials renewal trigger due 15 October 2026;
- `10-49` employee band supported conservatively by 17 named people on the
  current first-party team directory;
- approved LIA/copy/sequence state; and
- no customer, suppression, duplicate or prior-event match.

The refreshed official pages checked on 15 August 2026 still support the
trigger, contact, role, entity and active status. The CLI validation snapshot
contains one row with `gate_status=eligible` and no `gate_reasons`.

## Blocking control

The required live verification command failed closed before writing a verified
snapshot because `COMPANIES_HOUSE_API_KEY` is absent from the operator
environment:

```text
Outreach command failed: COMPANIES_HOUSE_API_KEY is required for Companies House verification
verify_exit=1
```

Consequently no `imported` event was recorded and no queue command was run.
There is no `ready_manual_send` row. The public Companies House page confirms
the entity for research, but it was not used to bypass the API-backed queue
control.

The integrated signal sprint also remains short of its required 24 SME and six
MSP first-touch cohort. This one-account checkpoint does not waive that cohort
requirement or authorise T0.

## Verification performed

```text
source refresh
Cobleys certificate page: certification 2025-10-15; recertification due 2026-10-15
Paolo profile: named mailbox; managing partner and director
Cobleys team directory: 17 named team members
Companies House public register: 03943212; active; private limited company

local identity/safety checks
canonical_rows=1
exact_email_rows=1
exact_company_rows=1
suppression_matches=0
event_matches=0
existing_customer=false

outreach validate
rows=1
gate_status=eligible
gate_reasons=(none)

CSV and permission checks
prospects.csv: 1 row, 27 headers
rehearsal archive: 2 rows, 27 headers
go/no-go ledger: 4 rows, 15 headers
validation snapshot: 1 row, 29 headers
all six private files: mode 600
```

## Coordination discrepancy

Repository facts at task time:

- this task branch started at `ee9cc87`;
- main was at `a8e6c2c`;
- `docs/coordination/PROJECT-STATUS.md` still identified main as `572ae58`.

The status snapshot is stale relative to Git. It was not reconciled because the
owner did not request a shared-status update. Its operational statement that
there are zero send-ready real rows remains true.

## Next safe action

Load the owner's Companies House API key into the operator environment, then
run the documented `verify -> event imported -> queue --step 1` chain against
the private Cobleys snapshot. Require exactly one current
`ready_manual_send` row and perform the second-human copy/recipient check.
Neither queue readiness nor the approved copy constitutes permission to send;
the owner must separately authorise the manual email and any LinkedIn action.
