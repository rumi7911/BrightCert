# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 8 August 2026, 21:00 BST
- **Task:** Integrate and review the Contracts Finder helper, run the first
  Source B and Source C research pass, and prepare the founder-content and
  outreach checkpoint.
- **Branch:** `codex/contracts-finder-review`
- **Worktree:** `.worktrees/contracts-finder-review`
- **Base commit:** `c646e15`
- **Final commit:** `572ae58` for the helper safety fix; the documentation commit
  is the commit containing this handoff and is local only pending owner
  integration approval.
- **Status:** Partial

## Scope and ownership

- Files intentionally changed: Contracts Finder output-path logic and tests;
  this handoff; `PROJECT-STATUS.md`; the four integrated-sprint founder briefs'
  fact-check dates.
- Files inspected but not changed: the integrated sprint overlay, launch gate,
  outreach ICP and research method, private prospect and research CSVs, and the
  Contracts Finder candidate output.
- Overlapping work discovered: Claude's `claude/contracts-finder` already
  contained the Source A withdrawal and Source B helper. It was reviewed and
  integrated locally before this checkpoint.
- Files another agent must not overwrite: the owner's untracked `videos/`
  directory and the private `.outreach/` research files.

## Changes

- Integrated Claude's Contracts Finder work locally and added a reviewed safety
  boundary: output must resolve to a CSV inside `outreach/runs/`; absolute paths
  and traversal are rejected.
- Ran the helper against Open, Awarded and Closed notices. It returned 170
  de-duplicated candidates, including 70 with named suppliers. Recent suppliers
  were manually triaged; obvious Certification Bodies, security consultancies,
  wrong-size firms and wrong-audience firms were excluded or held. No MSP row
  is send-ready.
- Ran the first Source C direct-SME pass. Twenty-six companies were assessed:
  four can advance, 19 were excluded, and three were held. The four advancing
  companies are Pure Electronics/Pure PCB, Grommets, Arkle Electronic Systems,
  and Frewer & Co Engineers. They still require licensed mailbox verification,
  suppression, existing-customer and duplicate checks, plus owner review.
- Kept the private research CSV outside Git with mode 600. No live record was
  added to `.outreach/prospects.csv`; it still contains rehearsal data only.
- Refreshed the government, NCSC and BrightCert sources behind all four founder
  briefs. Their claims remain supportable as of 8 August. Founder approval and
  publication timing remain deliberately unchecked.
- Recommended the next clean T0 as Monday 17 August 2026, conditional on all 30
  prospects and the launch sign-off being complete. The T-2 education post
  would be Thursday 13 August. Monday 10 August is not authorised or ready.

## Verification

```text
npx vitest run src/lib/outreach/contracts-finder.test.ts
28 passed

npm run test:run
294 passed

npm run lint
clean

npx tsc --noEmit
clean

npm run build
31/31 pages built

node node_modules/tsx/dist/cli.mjs scripts/contracts-finder.ts --output outreach/runs/cf-candidates-2026-08-08.csv --statuses Open,Awarded,Closed
170 de-duplicated candidates written; output mode 600

ruby -rcsv -e 'rows=CSV.read(ARGV[0], headers:true); p rows.group_by { |r| r["decision"] }.transform_values(&:size)' .outreach/research-2026-08-08.csv
26 valid rows: 4 advance_research, 19 exclude, 3 hold

curl -fsSL --max-time 20 https://brightcert.co.uk/how-it-works
HTTP success; live page still supports the readiness, scoring, gap-analysis and preparation claims
```

## External state

- Database writes: None.
- Deployment: None.
- Emails/messages: None.
- Payments: None.
- Other external actions: Read-only Contracts Finder, government, NCSC,
  Companies House and company-site research. No LinkedIn post was published and
  no founder or launch approval was recorded.

## Remaining risks or blockers

- Zero real prospects are send-ready. The 30-row T0 gate requires 24 verified
  direct SMEs and six verified MSPs.
- The four advancing SMEs still need licensed mailbox verification and all
  privacy, suppression, duplication and owner checks.
- The 6-to-10-row-per-hour assumption is withdrawn. This first Source C pass
  did not establish a sustainable fully verified throughput rate.
- All four founder posts remain blocked on Muhammad's approval and an owner-set
  publication schedule.
- `docs/outreach/LAUNCH-GATE.md` records all row evidence as verified, but the
  final go/no-go signature table remains blank.
- Local `main` is seven commits ahead of `origin/main`; nothing from this task
  has been pushed or deployed.

## Next safe action

Continue direct-SME research until at least 24 candidates survive every check,
find and verify six non-competing MSPs, then present the complete 30-row cohort,
the four founder posts and the launch-gate decision for owner approval. If the
owner approves the proposed dates, publish the first education post manually on
Thursday 13 August and begin Touch 1 on Monday 17 August, subject to the daily
caps and pause controls.
