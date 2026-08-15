# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 15 August 2026, 23:56 BST
- **Task:** Use the owner-provided Companies House API credential from the
  Cognumi project to complete Cobleys' live verification, imported event and
  step-1 queue chain.
- **Branch:** `codex/contracts-finder-review`
- **Worktree:** `.worktrees/contracts-finder-review`
- **Base commit:** `57a8d17`
- **Status:** Exactly one Cobleys row is `ready_manual_send`; nothing sent

## Scope and ownership

Private owner-only files intentionally changed in the main BrightCert
workspace:

- `.outreach/events.csv`
- `.outreach/go-no-go-2026-08-15.csv`
- `.outreach/cobleys-t0-readiness-2026-08-15.md`
- `.outreach/runs/cobleys-validated-2026-08-15.csv`
- `.outreach/runs/cobleys-verified-2026-08-15.csv`
- `.outreach/runs/cobleys-step-1-review-2026-08-15.csv`

This handoff is the only tracked file intentionally changed. No application
code, canonical prospect fields, production data, email, LinkedIn action,
publication, schedule or deployment was changed.

## Credential handling

The existing `COMPANIES_HOUSE_API_KEY` was read at runtime from:

`.worktrees/cognumi-outreach-system/.env.local` in the owner's Cognumi project.

The value was not printed, copied into BrightCert, written to evidence or
committed. It was supplied to the BrightCert CLI process through Node's
`--env-file` runtime option.

## Live result

Final validation returned one eligible Cobleys row with no gate reasons.
Companies House verification then returned:

```text
verification_result=active
verification_reason=(none)
company_number=03943212
company_status=active
legal_entity_type=ltd
companies_house_checked_at=(fresh timestamp present)
```

The exact canonical imported event was recorded at
`2026-08-15T22:55:55.424Z`. The subsequent step-1 queue performed its own fresh
Companies House check at `2026-08-15T22:55:56.221Z` and returned:

```text
queue_rows=1
sequence_step=1
queue_status=ready_manual_send
gate_reasons=(none)
verification_result=active
verification_reason=(none)
company_status=active
company_number=03943212
```

No `sent`, `delivered` or later-touch event was recorded.

## Commands and verification

The final validation used the documented CLI lifecycle against the private
canonical file. Verification and queue used the same Cognumi credential at
runtime. The imported event used exact canonical identifiers:

```text
prospect_id=sme-cobleys-001
campaign=founding_pilot_2026
segment=sme
trigger=renewal
template_version=sme-v1
event_type=imported
```

Observed private-file checks:

```text
prospects.csv: 1 row, 27 headers
events.csv: 4 rows, 10 headers; one Cobleys imported event
go/no-go ledger: 4 rows, 15 headers
validated snapshot: 1 row, 29 headers
verified snapshot: 1 row, 29 headers
step-1 queue: 1 row, 32 headers
queue assertion: ready_manual_send, no reasons, active
all changed private files: mode 600
```

The first verification invocation used a worktree-local `tsx` path that did
not exist and stopped before any Companies House request. The rerun used the
existing main-workspace `tsx` runtime and completed successfully. `npm exec`
also checked the runtime path; it changed no repository file.

No application tests, lint, type-check or build were required because no
application code changed. CSV parsing, exact event matching, permission checks
and live queue assertions covered the changed operational surface.

## External state

- Companies House API: two successful read-only exact-company calls, one from
  `verify` and one fresh call from `queue`.
- Private event store: one `imported` event appended for Cobleys.
- Database writes: None.
- Deployment: None.
- Email/message/connection/publication/scheduling: None.
- Payments: None.

## Coordination discrepancy

Repository facts at task time:

- this task branch started at `57a8d17`;
- main was at `a8e6c2c`;
- `docs/coordination/PROJECT-STATUS.md` still identified main as `572ae58` and
  zero send-ready real rows.

The Git SHA in the shared snapshot is stale. Its zero-send-ready statement is
also superseded by the private Cobleys queue generated in this task. The shared
snapshot was not reconciled because the owner did not request an integrated
status update; this dated handoff records the newer evidence.

## Remaining controls and next safe action

- A second human must compare the queued recipient, sources, trigger, exact
  body, CTA, privacy/objection footer and absence of tracking with the approved
  draft.
- `ready_manual_send` is evidence, not send authorisation. Obtain a separate
  explicit owner instruction before manually sending from the founder inbox.
- LinkedIn remains separately gated. Do not connect or message from this queue
  result.
- The integrated sprint still lacks the rest of its 24-SME/6-MSP cohort. This
  single-account checkpoint does not waive that cohort requirement.
