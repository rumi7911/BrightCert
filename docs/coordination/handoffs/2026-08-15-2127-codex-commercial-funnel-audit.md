# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 15 August 2026, 21:27 BST
- **Task:** Establish a read-only post-submission commercial funnel baseline
  and identify the next revenue-focused task.
- **Branch:** `codex/commercial-funnel-audit`
- **Worktree:** `.worktrees/commercial-funnel-audit`
- **Base commit:** `745fd43`
- **Final commit:** The commit containing this handoff.
- **Status:** Complete

## Scope and ownership

- Files intentionally changed:
  `docs/growth/COMMERCIAL-FUNNEL-BASELINE-2026-08-15.md` and this handoff.
- Files inspected but not changed: `AGENTS.md`, project status, current
  handoffs, product-marketing context, analytics instructions, Supabase schema
  support files, Stripe checkout code and production records returned by
  read-only Supabase, Stripe and Resend calls.
- Overlapping work discovered: None. The owner-managed untracked `videos/`
  directory on `main` was not touched.
- Files another agent must not overwrite: the dated baseline and this uniquely
  named handoff.

## Changes

- Recorded a sanitized commercial baseline without names, addresses or object
  identifiers.
- Separated known founder/demo activity from two non-founder-classified
  accounts instead of treating all 13 assessments as market traction.
- Reconciled database payment state with live-mode Stripe: zero paid sessions,
  zero charges, zero revenue and zero FOUNDING10 redemptions.
- Documented that all three non-founder-classified assessments completed all 60
  answers and entered checkout, but none paid. Their status remains ambiguous
  until the owner classifies the two accounts as genuine users, friendly
  testers or collaborators.
- Audited Resend history. The historical 22-recipient MSP batch delivered 21
  and bounced one (4.5%); no recipient address directly matches a later
  non-founder auth user. The baseline therefore rejects repeating that
  unverified method.
- Recommended a five-to-ten-row verified direct-SME batch plus consistent UTM
  attribution as the next commercial move. No price or paywall change is
  justified from the current small, contaminated sample.

## Verification

```text
git fetch --all --prune
passed; repository and handoffs inspected before work

production Supabase read-only counts
5 organisations; 3 profiles; 13 assessments; 272 responses;
25 control-score rows; 1 report row

assessment classification
known founder/demo: 10 assessments (2 analysed, 8 draft)
non-founder-classified: 3 assessments, all analysed with 60 answers
paid evidence rows: 0

live-mode Stripe read-only reconciliation
42 Checkout Sessions across 5 assessment references;
41 expired, 1 open, 0 paid; 0 charges; £0 net revenue;
0 FOUNDING10 redemptions

Resend read-only reconciliation
58 emails; 56 delivered, 2 bounced
historical MSP outreach: 22 unique business-domain recipients,
21 delivered, 1 bounced; 0 direct auth-user address matches

UTM retention check
0 of 5 organisations has retained attribution

git diff --check
run before commit
```

No application tests, lint, type-check or build are required because this task
changes dated documentation only.

## External state

- Database writes: None.
- Deployment: None.
- Emails/messages: None.
- Payments: None.
- Other external actions: Read-only production Supabase, live-mode Stripe and
  Resend API queries.

## Remaining risks or blockers

- The owner must classify the two non-founder accounts before their activity is
  described as real customer behaviour.
- Zero contacts are currently send-ready. Eleven public named addresses still
  need independent verification and 19 cohort gaps need licensed enrichment.
- The live Stripe webhook → generation chain remains unverified end-to-end.
- Acquisition attribution is absent from all current organisation rows.
- Report retention, orphaned GCS objects and credential rotation remain
  separate owner-directed tasks.

## Next safe action

On a new task branch from current `origin/main`, prepare the first verified
direct-SME batch: independently verify the 11 public named addresses, enrich
only the strongest missing SME contacts, run all suppressions and present a
five-to-ten-row go/no-go table. Do not send or publish before owner approval.
