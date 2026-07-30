# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 30 July 2026, 12:33
- **Task:** Implement the approved BrightCert integrated signal sprint package
- **Branch:** `codex/integrated-signal-sprint`
- **Worktree:** `.worktrees/integrated-signal-sprint`
- **Base commit:** `4eb7861` (`codex/integrated-signal-sprint-design`)
- **Dependency merge:** `c87d7a0` integrates completed
  `codex/social-infographic-system` at `47515ea`
- **Task commits:** `d7251c7`, `35afb62`, `5daf4d9`
- **Final commit:** The commit containing this handoff
- **Status:** Complete on the task branch; awaiting owner-controlled integration

## Scope and ownership

Files intentionally created:

- `docs/outreach/INTEGRATED-SIGNAL-SPRINT.md`
- `outreach/templates/signal-sprint-alignment.example.csv`
- `src/lib/outreach/signal-sprint-contract.test.ts`
- `docs/social/sprints/2026-07-30-integrated-signal-sprint.md`
- `docs/social/briefs/2026-07-30-ce-requirement-timing.md`
- `docs/social/briefs/2026-07-30-evidence-before-action.md`
- `docs/social/briefs/2026-07-30-readiness-before-certification.md`
- `docs/social/briefs/2026-07-30-msp-one-client-workflow.md`

Files intentionally modified:

- `docs/outreach/30-DAY-CALENDAR.md`
- `docs/outreach/SCORECARD.md`
- `docs/outreach/operator-runbook.md`
- `docs/social/README.md`

Files inspected but not changed:

- `docs/outreach/ICP.md`
- `docs/outreach/EMAIL-SEQUENCES.md`
- `docs/outreach/LIA.md`
- `docs/outreach/LAUNCH-GATE.md`
- `src/lib/outreach/cli.ts`
- `src/lib/outreach/workflow.ts`
- `docs/social/12-WEEK-CALENDAR.md`
- the approved design and implementation plan

Overlapping work discovered:

- The approved plan depended on the completed but unintegrated
  `codex/social-infographic-system` branch. The dependency was merged into this
  implementation branch at `c87d7a0` without editing its active worktree.
- The social worktree has an unrelated untracked `tmp/` directory. It was not
  opened, modified, staged, or removed.
- Dirty `main` owner work was not copied, modified, staged, or cleaned.

Files another agent must not overwrite:

- The 12 sprint-owned paths listed above while this branch awaits owner review.

## Changes

The branch now contains a controlled 30-prospect learning sprint with:

- an exact 24-SME / 6-MSP cohort and approved trigger-to-content mapping;
- a fictitious tracked alignment example plus instructions for creating the
  ignored, mode-`600` private operator file;
- explicit confirmation that social planning is never an eligibility authority
  and never proves named-account exposure;
- four source-backed founder LinkedIn text-post drafts, all blocked at
  `Status: Founder review`;
- a relative ten-business-day publishing/contact overlay tied to owner-set T0;
- a supplemental learning gate requiring two relevant human replies and one
  booked conversation or assessment start; and
- cross-links from the existing calendar, scorecard, runbook, and social system.

Approved `sme-v1` and `msp-v1` copy, prospect/event schemas, CLI behaviour,
launch-gate state, the 12-week social calendar, and production behaviour remain
unchanged.

The contract test has five checks covering the alignment schema, trigger map,
public-copy guardrails, stable content IDs, and canonical cross-document links.
Its pass-guarantee pattern was narrowed to permit the approved explicit
negation, `does not guarantee a pass`, while still rejecting positive pass
guarantees and claims that BrightCert can certify a prospect.

## Source verification

Sources retrieved and reviewed on 30 July 2026:

- `https://www.gov.uk/government/publications/ppn-014-cyber-essentials-scheme/ppn-014-cyber-essentials-scheme-html`
- `https://www.ncsc.gov.uk/cyberessentials/overview`
- `https://brightcert.co.uk/how-it-works`
- `https://brightcert.co.uk/pricing`
- `https://brightcert.co.uk/signup`

PPN 014 still requires a relevant and proportionate approach rather than a
blanket contract requirement. NCSC still describes five technical controls,
free preparation resources, and separate certification routes. BrightCert's
live pages still describe readiness-only support, no certification issuance,
and a free assessment start. No planned claim required correction.

## Verification

All commands ran from `.worktrees/integrated-signal-sprint`.

```text
npm install
-> 632 packages installed; five existing moderate audit findings; no tracked
   dependency file changed

npm run test:run
-> baseline: 23 test files passed; 211 tests passed

npm run test:run -- src/lib/outreach/signal-sprint-contract.test.ts
-> Task 1 red: two expected ENOENT failures
-> Task 1 green: one file passed; two tests passed
-> Task 2 red: two expected ENOENT failures
-> Task 2 green: one file passed; four tests passed
-> Task 3 red: expected missing calendar-link failure
-> final: one file passed; five tests passed

policy and privacy rg scans from the approved plan
-> no placeholder, raw personalisation token, prohibited guarantee, false
   certification, artificial urgency, or em-dash match

git ls-files '.outreach/**'
-> no tracked private outreach file

npm run test:run
-> 24 test files passed; 216 tests passed

npm run lint
-> exit 0

npx tsc --noEmit
-> exit 0

npm run build
-> Next.js 16.2.12 compiled successfully; 31/31 static pages generated

git diff --check
-> exit 0 for the clean worktree

git diff --check 4eb7861..d7251c7
git diff --check c87d7a0..HEAD
git show --check d7251c7
git show --check 35afb62
git show --check 5daf4d9
-> exit 0 for all sprint-owned changes
```

The plan's fixed `git diff --check HEAD~3...HEAD` range also included the
dependency merge and reported pre-existing Markdown hard-break whitespace and
blank lines in the integrated social-system commit. Those lines were not
rewritten because they belong to the completed dependency. All sprint-owned
commits pass their scoped whitespace checks.

## External state

- **Database writes:** None
- **Deployment:** None
- **Emails/messages:** None
- **LinkedIn/social publishing or scheduling:** None
- **Payments:** None
- **Other external actions:** Read-only retrieval of the five source URLs;
  dependency merge on the task branch only. No merge to `main`.

## Remaining risks or blockers

- Muhammad must review and approve all four founder briefs and select
  publication timing before any post is published or scheduled.
- Live outreach remains blocked until every launch-gate row passes, the go/no-go
  record is complete, no pause or incident is active, and the owner sets T0.
- Product and regulatory claims must be rechecked again if publishing occurs
  after the recorded fact-check date.
- The learning thresholds are directional gates for a 30-prospect cohort, not
  statistical proof or public performance claims.
- Owner-controlled integration must preserve the social-system dependency and
  the sprint commits together.

## Next safe action

Owner reviews the four founder drafts, the operator playbook, and this branch
diff. If approved, integrate `codex/integrated-signal-sprint` as one dependency-
complete branch. Do not publish, schedule, set T0, or contact a prospect as part
of integration.
