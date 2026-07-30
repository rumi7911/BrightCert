# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 30 July 2026, 12:19
- **Task:** Convert the approved BrightCert integrated signal sprint design
  into an exact, test-driven implementation plan
- **Branch:** `codex/integrated-signal-sprint-design`
- **Worktree:** `.worktrees/integrated-signal-sprint-design`
- **Base commit:** `11ef342` (`origin/main` when the design task started)
- **Design commit:** `a2c2a74`
- **Plan commit:** `6ec8c6d`
- **Status:** Plan complete; awaiting owner choice of execution approach

## Scope and ownership

Files intentionally changed:

- `docs/superpowers/plans/2026-07-30-integrated-signal-sprint.md`
- this handoff

Files inspected but not changed:

- the approved sprint specification;
- current outreach calendar, scorecard, operator runbook, CLI entrypoint, CSV
  helper, and existing tests;
- the completed `codex/social-infographic-system` README, calendar, metrics,
  templates, QA checklist, briefs, and handoffs; and
- current official GOV.UK and NCSC Cyber Essentials pages.

Overlapping work:

- `docs/social/**` remains present only on the completed
  `codex/social-infographic-system` branch. The implementation plan requires a
  clean combined execution branch containing commit `47515ea`; it does not
  instruct an agent to edit that branch's worktree.
- Dirty-main outreach evidence remains owner work and is excluded.

## Plan

The plan contains four independently reviewable tasks:

1. add a focused Vitest contract, fictitious alignment CSV template, and
   non-personal sprint operator playbook;
2. add four source-backed founder LinkedIn draft briefs plus a T0-relative
   social overlay;
3. integrate the supplemental 30-prospect gate with the existing calendar,
   scorecard, operator runbook, and social README; and
4. run focused/full verification, confirm no private data or external
   mutations, and create the implementation handoff.

No new outreach command is planned. The existing queue and event systems
already provide the authoritative eligibility and funnel behaviour, so adding a
new CLI surface would be unnecessary scope.

## Source verification

Read-only source review on 30 July 2026 confirmed the planned claims against:

- GOV.UK PPN 014:
  `https://www.gov.uk/government/publications/ppn-014-cyber-essentials-scheme/ppn-014-cyber-essentials-scheme-html`
- NCSC Cyber Essentials overview:
  `https://www.ncsc.gov.uk/cyberessentials/overview`
- live BrightCert product context:
  `https://brightcert.co.uk/how-it-works`

The implementation plan requires a fresh source check on the execution date
and blocks Task 2 if the source wording has materially changed.

## Verification

Commands were run from
`.worktrees/integrated-signal-sprint-design`.

```text
git fetch --all --prune
-> completed

git status --short --branch
-> clean before plan authoring; only the task-owned plan was present before
   commit

npm run test:run
-> 23 test files passed; 211 tests passed on the clean design worktree baseline

placeholder scan
-> no TBD, TODO, FIXME, deferred implementation, timestamp, branch, or handoff
   placeholders remain; one intentional Task 4 command scans future briefs for
   raw template variables

Markdown fence parser
-> balanced, including the nested four-backtick operator-runbook example

git diff --cached --check
-> passed before plan commit
```

The plan was self-reviewed against every approved specification section.
Coverage includes cohort mix, unchanged email copy, trigger mapping, publishing
rhythm, manual engagement boundaries, private alignment data, full-funnel and
social measurement, promotion gate, pause handling, verification, and explicit
non-authorisation of T0 or external action.

## External state

- **Database writes:** None
- **Deployment:** None
- **Emails/messages:** None
- **LinkedIn/social publishing or scheduling:** None
- **Payments:** None
- **Other external actions:** Read-only official-source retrieval. The task
  branch will be pushed after this handoff commit. No merge or PR is created.

## Remaining risks and blockers

- Implementation needs a clean combined branch containing the approved
  spec/plan and completed social-system commit `47515ea`.
- The four post drafts remain founder-review material. The plan does not
  approve or publish them.
- Live prospect contact remains blocked until every launch-gate row passes, the
  go/no-go record is complete, no pause is active, and the owner sets T0.
- The 30-prospect thresholds are learning gates, not statistical proof or
  public performance claims.

## Next safe action

The owner chooses one execution mode:

1. subagent-driven implementation with a fresh worker and review gate per task;
   or
2. inline implementation in this task using the executing-plans workflow.

Either route must first create a clean
`codex/integrated-signal-sprint` worktree containing the completed social
system and this approved plan. No sending, publishing, or production mutation
is part of implementation.
