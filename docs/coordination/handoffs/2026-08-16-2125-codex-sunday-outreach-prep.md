# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 16 August 2026, 21:25 BST
- **Task:** Start the day's BrightCert outreach work with a no-send Sunday
  preparation pass: reconcile Claude, refresh source truth, validate the next
  contacts, monitor Contracts Finder and quantify the remaining cohort.
- **Branch:** `codex/contracts-finder-review`
- **Worktree:** `.worktrees/contracts-finder-review`
- **Base commit:** `08600cd`
- **Status:** Preparation complete; Cobleys remains the only commercially
  suitable account; nothing sent or published

## Scope and ownership

Private owner-only files intentionally changed in the main workspace:

- `.outreach/research-2026-08-09.csv`
- `.outreach/contact-evidence-2026-08-09.csv`
- `.outreach/go-no-go-2026-08-16.csv`
- `.outreach/final-first-touches-2026-08-15.md`
- `.outreach/daily-progress-2026-08-16.md`

The ignored, mode-600 Contracts Finder monitor output was written to
`outreach/runs/cf-candidates-2026-08-16.csv` in this task worktree. This handoff
is the only tracked file intentionally changed. No application code,
production data, canonical prospect row, email, LinkedIn action, publication,
schedule or deployment was changed.

## Claude reconciliation

No newer Claude outreach work exists after `claude/contracts-finder` at
`c4ee535` on 6 August. Claude's current outreach findings remain valid:

- the IASME certificate register prohibits marketing/data-research use and was
  not used;
- Contracts Finder is mainly an MSP candidate source, not a direct-SME renewal
  source; and
- company-published certificate/assurance material remains the defensible
  direct-SME source.

Claude's submission branches from 11-12 August concern the already-completed
hackathon submission and were left out of scope as the owner instructed.

## Universal source correction

The 16 August first-party recheck found contradictory evidence:

- Universal's 22 October 2025 article says the company achieved Cyber
  Essentials Plus and quotes Eddie Hing:
  `https://www.universalnetworks.co.uk/universal-networks-achieves-cyber-essentials-plus-certification/`;
- the article's `View Certificate` link still points to the basic Cyber
  Essentials certificate whose recertification date was 15 August 2026.

That does not establish Universal's current Plus expiry or prove a missed
renewal. The research row is now held, and the prior email/LinkedIn draft is
explicitly marked `Withdrawn. Do not use.` A current company-published Plus
certificate or unambiguous renewal date is required before rewriting.

## Next-contact validation

All three addresses were published in a first-party business context and had
zero local canonical-email, company, suppression or event matches before the
live Hunter calls.

| Account | Contact | Hunter result | Commercial result |
| --- | --- | --- | --- |
| Aerco Limited | Rob Laughton, Managing Director | valid, 100 | Hold timing; CE+ achieved 13 March 2026 |
| Hall Morrice LLP | Ian Mackie, Operations Director | valid, 88 | Hold timing; CE+ achieved 1 May 2026 |
| Fine-Cast Foundry Limited | David Gratton, Managing Director | invalid, 0 | Hold; do not contact address |

Companies House's live API separately returned Aerco `00572109` as active
`ltd` and Hall Morrice `SO303198` as active `llp`. The existing Cognumi Hunter
and Companies House keys were read at runtime only; neither value was printed,
copied into BrightCert or committed.

The cold-email and social workflows prevented drafting around weak timing:
deliverability alone is not relevance, and a LinkedIn connection is not a
substitute for a current buying signal.

## New renewal discovery

Manual company-source search found W.D.M. Limited's first-party Cyber
Essentials certificate with recertification due 25 September 2026. Companies
House shows active company `00403583`. It was held because current third-party
size evidence reports 138 employees, above the approved 10-100 range, and no
suitable named first-party mailbox was found. Size must be resolved before any
contact enrichment.

The measured discovery pass produced one new dated renewal candidate and zero
eligible rows, reinforcing the documented low throughput of manual Source C.

## Contracts Finder monitor

```text
phrase: "cyber essentials"
Open: 0
Awarded: 70
Closed: 154
API rows returned: 270
candidate rows after phrase re-check: 170
named awarded suppliers: 70
open opportunities: 0
```

The output contains candidates, not prospects. No row was promoted.

## Current funnel truth

```text
private research rows: 47
advance_research: 25
hold: 10
exclude: 12
verified named mailboxes: 5
current day-of-send ready rows: 0
commercially suitable account: Cobleys only
remaining integrated cohort after Cobleys: 23 SMEs + 6 MSPs
```

Cobleys' 15 August queue evidence passed, but the SOP requires verification and
queue regeneration on the actual day a message may be sent. Sunday was treated
as preparation only.

## Verification

```text
research CSV: 47 rows, 11 headers
contact-evidence CSV: 32 rows, 10 headers
16 August go/no-go CSV: 5 rows, 15 headers
all changed private files: mode 600
Universal draft status: Withdrawn. Do not use.
Contracts Finder output: mode 600
git worktree before handoff: clean
```

No application tests, lint, type-check or build were required because no
application code changed. CSV parsing, source checks, live API results,
duplicate/suppression queries and permission checks covered the changed
operational surface.

## External state

- Hunter API: three live mailbox checks; three verification credits may have
  been consumed.
- Companies House API: two read-only exact-company calls.
- Contracts Finder API: one read-only monitoring run.
- Database writes: None.
- Email/LinkedIn/publication/scheduling: None.
- Deployment and payments: None.

## Coordination discrepancy

Repository facts at task time:

- this task branch started at `08600cd`;
- main was at `a8e6c2c`;
- `docs/coordination/PROJECT-STATUS.md` still identified main as `572ae58` and
  predates the private Cobleys evidence.

The shared snapshot remains stale relative to Git. It was not reconciled
because the owner did not request an integrated status update. This dated
handoff and the private daily ledger record the current outreach state.

## Next safe action

Continue company-source discovery for September-November 2026 renewals and
review recent awarded suppliers for the six-MSP cohort. Do not spend enrichment
credits until entity, size and trigger timing pass.

For Cobleys, use a business-day morning, preferably Tuesday 18 August between
09:00 and 10:30 BST: refresh the source, replies, suppressions and events;
rerun verify and queue; complete the required human copy comparison; and obtain
separate explicit send authorisation. LinkedIn remains separately gated.
