# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 16 August 2026, 21:41 BST
- **Task:** Continue the remaining direct-SME cohort with a bounded
  September-November renewal discovery and qualification batch.
- **Branch:** `codex/contracts-finder-review`
- **Worktree:** `.worktrees/contracts-finder-review`
- **Base commit:** `6a29299`
- **Evidence commit:** Pending first handoff commit.
- **Final commit:** Pending evidence-SHA follow-up commit.
- **Status:** One founder-review candidate found; nothing sent or scheduled

## Scope and ownership

Private owner-only files changed:

- `.outreach/research-2026-08-09.csv`
- `.outreach/contact-evidence-2026-08-09.csv`
- `.outreach/go-no-go-2026-08-16.csv`
- `.outreach/daily-progress-2026-08-16.md`
- `.outreach/remaining-cohort-progress-2026-08-16.md`

All are ignored and mode 600. This handoff is the only tracked file. No
canonical prospect, email, LinkedIn action, schedule, publication, application
code, database, deployment or payment was changed.

## Search method

The B2B prospecting branch used the existing direct-SME ICP: active UK entity,
10-100 employees, September-November 2026 Cyber Essentials renewal, current
decision-maker and a verifiable corporate mailbox. The search started from
publicly indexed company-hosted certificates and public official digital
certificates, then cross-checked company sites, Companies House and current
size evidence. The IASME register was not used.

No bulk scraping, LinkedIn scraping, CAPTCHA bypass or guessed email was used.
Hunter was withheld until entity, size, timing and role passed.

## Batch result

| Account | Result | Evidence |
| --- | --- | --- |
| Utonomy Ltd | Founder review | Active UK ltd 09612773; 33 employees in the 2025 filed-account summary; public official CE certificate valid to 7 October 2026; company site displays CE; current CEO and exact mailbox verified |
| H.W. Coates Limited | Exclude | Company-published CE certificate due 9 September 2026, but 373 employees in 2025 filed accounts |
| Gemsatwork Ltd | Hold | Public official CE certificate valid to 24 September 2026; size evidence conflicts at the 10-employee floor |

Utonomy is the only commercially qualified candidate. It is not send-ready:
the dated certificate is hosted on the public official BlockMark registry,
while Utonomy's own site confirms Cyber Essentials without displaying the
date. The owner must explicitly accept this source boundary before canonical
promotion, LIA and copy approval.

## Utonomy evidence and contact

- Company CE claim and leadership: `https://utonomy.co.uk/about-us/`
- Current company contact: `https://utonomy.co.uk/contact/`
- Public official digital certificate:
  `https://registry.blockmarktech.com/organisations/GBLTD09612773/`
- Companies House: `https://find-and-update.company-information.service.gov.uk/company/09612773`
- Current leadership: `https://utonomy.co.uk/team/`

The current company page identifies [redacted: named individual] as CEO and Companies House
lists [redacted: named individual] as an active director. A licensed Hunter
domain search returned `[redacted: mailbox held in the private ledger]`. Exact verification then
returned:

```text
status: valid
result: deliverable
score: 100
MX: true
SMTP server: true
SMTP check: true
accept-all: false
blocked: false
checked_at recorded: 2026-08-16T20:40:34Z
```

Before adding the evidence row, local checks found zero exact-email matches in
canonical prospects, research, contact evidence, suppressions or events and no
known-customer company match in the canonical file.

## Verification

```text
research rows: 50
advance_research: 26
hold: 11
exclude: 13
verified research mailboxes: 6
contact-evidence rows: 33
16 August go/no-go rows: 6
Utonomy decision: founder_review_trigger_source
private files: mode 600
tracked worktree before handoff: clean
```

Ruby CSV parsing and exact duplicate assertions covered each changed ledger.
No application code changed, so application lint, type-check and build were not
required.

## External state

- Hunter API: one rejected domain-search request due to plan pagination limit;
  it returned no contact data. One successful 10-result domain search and one
  exact email-verifier request followed. Credits may have been consumed under
  the owner's Hunter plan.
- Companies House API: one read-only exact-company call for Utonomy.
- Credential handling: the existing Hunter and Companies House keys were read
  at runtime from the owner-controlled Cognumi worktree. Values were not
  printed, copied into BrightCert, stored in evidence or committed.
- Email/LinkedIn/publication/scheduling: None.
- Database/deployment/payment changes: None.

## Coordination discrepancy

Repository facts at task time show this task branch at `6a29299` and main at
`a8e6c2c`. `docs/coordination/PROJECT-STATUS.md` still identifies main as
`572ae58` and predates the current private outreach evidence. It was not edited
because the owner did not request integrated status reconciliation.

## Next safe action

The owner reviews one narrow question: whether to accept Utonomy's public
official digital certificate as the dated trigger when the company site itself
confirms Cyber Essentials but does not show the date. If accepted, complete the
exact LIA and copy review and promote one canonical row; do not infer send or
LinkedIn authorisation.

In parallel, resolve Gemsatwork's 2024 employee count before spending any
contact credit and continue company-hosted September-November renewal
discovery. Cobleys remains paused for outcome monitoring.
