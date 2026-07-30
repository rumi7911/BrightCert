# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 30 July 2026, 11:51
- **Task:** Design a BrightCert integrated signal sprint combining a controlled
  30-prospect email cohort with founder-led LinkedIn content aimed at the same
  account themes
- **Branch:** `codex/integrated-signal-sprint-design`
- **Worktree:** `.worktrees/integrated-signal-sprint-design`
- **Base commit:** `11ef342` (`origin/main`)
- **Design commit:** `a2c2a74`
- **Status:** Design complete; awaiting owner review before implementation
  planning

## Scope and ownership

Files intentionally changed:

- `docs/superpowers/specs/2026-07-30-integrated-signal-sprint-design.md`
- this handoff

Files inspected but not changed:

- `AGENTS.md`
- `docs/coordination/PROJECT-STATUS.md`
- the newest coordination handoffs
- existing outreach ICP, sequences, SOP, launch-gate, founder-script, seed-batch,
  and operator-runbook material
- the completed `codex/social-infographic-system` handoff, calendar, brief,
  social metrics contract, and production-system documentation

Overlapping work discovered:

- `docs/social/**` is owned by the completed but unintegrated
  `codex/social-infographic-system` branch. The design treats that branch as an
  implementation dependency and does not modify its files or create a second
  social calendar.
- Dirty `main` contains mixed-owner outreach evidence and founder documents.
  None was modified, staged, or copied into this branch.

## Design

The approved design specifies:

- a 10-business-day Touch 1 sprint with 24 SMEs and 6 MSPs, preserving the
  approved 120/30 ratio;
- unchanged approved `sme-v1` and `msp-v1` email sequences;
- founder-led LinkedIn education around urgency, evidence-first preparation,
  and readiness-before-certification;
- manual, non-invasive account alignment without naming prospects or
  automating LinkedIn activity;
- a private ignored alignment record that does not replace the canonical
  prospect, event, suppression, or queue authorities;
- full-funnel measurement from Touch 1 through paid/customer;
- a learning gate of at least two relevant replies and one booked conversation
  or assessment start before the next cohort; and
- explicit confirmation that the design does not authorise T0, sending,
  publishing, production writes, or deployment.

## Verification

Commands were run from
`.worktrees/integrated-signal-sprint-design`.

```text
git fetch --all --prune
-> completed; origin references refreshed

git worktree list
git status --short --branch
git branch -vv --all
git diff --name-only <active branches>
-> dirty main and active ownership boundaries inspected; no overlap on the
   task-owned specification path

npm install
-> completed; 632 packages added; audit reported five existing moderate
   vulnerabilities; no dependency file changed

npm run test:run
-> 23 test files passed; 211 tests passed

placeholder scan
-> no TBD, TODO, FIXME, placeholder, or undecided markers

git diff --cached --check
-> passed after replacing five Markdown hard-break whitespace sequences with
   clean blank-line formatting
```

The specification was self-reviewed for placeholders, contradictions, scope,
and ambiguous requirements. The review added the explicit T0 non-authorisation,
defined a relevant reply, and added a private `cohort_id` without changing the
canonical event schema.

## External state

- **Database writes:** None
- **Deployment:** None
- **Emails/messages:** None
- **LinkedIn/social publishing:** None
- **Payments:** None
- **Other external actions:** The task branch will be pushed to origin after
  this handoff is committed. No merge is authorised or performed.

## Remaining risks and blockers

- Implementation that changes `docs/social/**` must wait until
  `codex/social-infographic-system` is integrated or explicitly superseded.
- The dirty-main outreach evidence remains unreconciled owner work and cannot
  be used as an implementation base.
- The launch gate is not signed go and the recorded PDF/report production
  retest remains open. This design cannot authorise live prospect contact.
- The 30-prospect thresholds are learning gates, not statistically reliable
  performance benchmarks or claims suitable for public use.

## Next safe action

Muhammad reviews
`docs/superpowers/specs/2026-07-30-integrated-signal-sprint-design.md`.
After explicit approval, invoke the writing-plans workflow from a clean,
agreed integration base. Do not begin implementation, send outreach, or
publish social content before that approval and the existing launch controls.
