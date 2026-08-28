# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 15 August 2026, 21:47 BST
- **Task:** Apply the owner's zero-external-activity clarification to the next
  prospecting step and recheck the strongest direct-SME timing signals.
- **Branch:** `codex/contracts-finder-review`
- **Worktree:** `.worktrees/contracts-finder-review`
- **Base commit:** `31d0b27`
- **Final commit:** The commit containing this handoff.
- **Status:** Research checkpoint complete; send-readiness blocked

## Scope and ownership

- Files intentionally changed: this handoff and the ignored private files
  `.outreach/research-2026-08-09.csv` and
  `.outreach/contact-evidence-2026-08-09.csv` in the repository root.
- No application code, canonical prospect row, production data, email,
  LinkedIn message or LinkedIn post was changed.
- No active branch or handoff overlaps these files. The owner-managed untracked
  `videos/` directory was not touched.

## Commercial premise

The owner confirmed that every signup, organisation, assessment, completion,
checkout and generated report currently in BrightCert is owner-controlled
internal activity. The real commercial funnel is therefore zero genuine users,
zero customers and £0 revenue. Acquisition of the first genuine user, not
paywall optimisation, is the binding constraint.

## Prospecting findings

Four direct-SME accounts now have current first-party renewal timing evidence:

| Account | Timing signal verified 15 August | Contact gate | Research status |
|---|---|---|---|
| Universal Networks UK Limited | Its linked CE+ certificate says recertification was due **15 August 2026** | Founder/MD identified; no public named mailbox | Highest-priority research account; not send-ready |
| Aerotech Precision Manufacturing Limited | Current downloads page still links only to the CE+ certificate due **28 July 2026**; no replacement is visible | Named public mailbox exists only in a recruitment context and is unverified | Strong overdue-renewal signal; not send-ready |
| Angel Solutions Ltd | Current CE+ certificate says recertification is due **3 September 2026** | Chief executive identified; no public named mailbox | Strong near-term research account; not send-ready |
| Cobleys Solicitors Ltd | First-party CE page says recertification is due **15 October 2026** | Managing partner and public named corporate mailbox found; deliverability unverified | Two-month planning account; not send-ready |

Primary evidence:

- Universal Networks certificate:
  `https://www.universalnetworks.co.uk/wp-content/uploads/2025/10/Cyber-Essentials-Certificate-Aug-2025.pdf`
- Aerotech downloads:
  `https://www.aero-tech.co.uk/about-aerotech-uk-precision-manufacturing/downloads/`
- Angel Solutions certificate:
  `https://www.angelsolutions.co.uk/wp-content/uploads/2024/06/Cyber-Essentials-Plus-Certificate.pdf`
- Cobleys Cyber Essentials page:
  `https://cobleys.co.uk/cyber-essentials/`

Companies House confirms that all four legal entities are active. First-party
leadership or team pages support the recorded decision-maker roles. No address
was guessed and shared mailboxes were not silently substituted for missing
named contacts.

## Founder-led LinkedIn implication

The same cohort should be warmed with general founder content about the annual
renewal window, without naming or embarrassing an individual company. The
useful angle is: a certificate date is a planning deadline, and a readiness
baseline should happen before the renewal application. This supports the
account outreach while remaining relevant to similar UK SMEs.

## Verification

```text
git fetch --all --prune
passed during the day's mandatory preflight

read-only first-party source rechecks
Universal Networks: recertification due 15 August 2026
Aerotech: recertification due 28 July 2026; no replacement visible
Angel Solutions: recertification due 3 September 2026
Cobleys Solicitors: recertification due 15 October 2026

ruby CSV parse
research-2026-08-09.csv: 46 valid rows
contact-evidence-2026-08-09.csv: 32 valid rows

advancing-row duplicate check
29 advancing rows in the 9 August ledger; 0 duplicate companies

stat private files
both private CSVs remain mode 600

git diff --check
run before commit
```

No application tests, lint, type-check or build are required because no
application code or tracked operational logic changed.

## External state

- Database writes: None.
- Deployment: None.
- Emails/messages: None.
- LinkedIn publication or engagement: None.
- Payments: None.
- Other external actions: Read-only public company pages, first-party
  certificates and Companies House records.

## Remaining risks or blockers

- Zero candidates are send-ready because none has independently validated
  deliverability.
- Universal Networks and Angel Solutions also lack an eligible public named
  mailbox and require licensed enrichment.
- Aerotech's named address is published in a recruitment context, so relevance
  needs explicit human approval even if deliverability later validates.
- Cobleys has the cleanest public contact evidence, but its mailbox still needs
  an independent validator and all duplicate, customer, suppression, LIA and
  role-relevance checks.
- A certificate remaining on a website does not prove a renewal was missed;
  outreach must describe the published timing, not assert that certification
  has lapsed.

## Next safe action

Use licensed enrichment for Universal Networks and Angel Solutions and an
independent mailbox validator for all available named addresses. Then present
the exact go/no-go table for owner approval. In parallel, prepare one
founder-review LinkedIn post about the 30-to-60-day CE renewal planning window.
Do not send, connect or publish before approval.
