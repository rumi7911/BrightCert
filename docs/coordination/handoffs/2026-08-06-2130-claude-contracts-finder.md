# Handoff — Contracts Finder research helper, and two source-quality findings

Agent: Claude Code
Date: 6 August 2026, 21:30 BST
Branch: `claude/contracts-finder` (includes a merge of `claude/lia-source-amendment`)
Worktree: `.worktrees/contracts-finder`

## Task

Build the Contracts Finder helper offered in the 4 August outreach session, and
record what the source is actually worth.

## What was built

| File | Purpose |
|---|---|
| `src/lib/outreach/contracts-finder.ts` | Pure logic — search body, phrase re-check, candidate row shape. No network, so it is testable |
| `src/lib/outreach/contracts-finder.test.ts` | 23 unit tests |
| `scripts/contracts-finder.ts` | CLI entry: paging, CSV write, operator instructions |
| `package.json` | One line: `outreach:contracts-finder` |

```sh
npm run outreach:contracts-finder -- \
  --output outreach/runs/cf-candidates.csv \
  --statuses Open,Awarded,Closed
```

Design constraints, deliberate:

- **Emits candidates for triage, never prospect rows.** A test asserts the
  output carries no `work_email`, `contact_name`, `lia_status`,
  `human_approved_at` or `trigger` column. Linking a company to a notice is a
  human judgement under ICP.md and nothing here pretends otherwise.
- **Refuses to write into `.outreach/`.** The canonical prospect file stays
  human-owned.
- **Re-checks the phrase against notice text.** The API keyword search is fuzzy:
  an unquoted `cyber essentials` search returned a Surrey County Council
  social-care notice at score 1 with no mention of the scheme. Quoting the
  phrase makes the API accurate — the real run dropped 0 of 270 for a missing
  phrase — but the re-check is what makes that safe to rely on.
- Reuses `atomicWriteCsv`, so output inherits mode 600 and spreadsheet-formula
  neutralisation.

## Finding 1 — Contracts Finder is an MSP source, not an SME source

Live run, exact phrase, 6 August 2026:

| Status | Notices |
|---|---:|
| **Open** | **0** |
| Awarded | 70 |
| Closed | 154 |
| After de-duplication | 170 |
| With a named awarded supplier | 70 |
| Awarded 2025 or later | 6 |

Zero open notices, so the "find SMEs bidding on a CE-requiring notice" play has
nothing to work with — and the API never names bidders anyway, so that play was
always inference, which ICP.md rates Weak.

The 70 named suppliers are overwhelmingly IT, security and software firms
(Logiq Consulting, Prism Infosec, Synergi Software, Claranet, Select Technology
Systems, 6ByThree Digital). Winning a contract that required Cyber Essentials
means they already hold it — poor direct-SME prospects, reasonable
**MSP-segment** candidates under `msp_client_service`. Roughly 22 were awarded
in 2024 or later.

Caution recorded in the doc: several are security consultancies and some are
IASME-licensed Certification Bodies, so the ICP's competing-product check is the
main filter here, not a formality. **IASME Consortium Ltd itself appears in the
results.**

## Finding 2 — the throughput estimate is void, and Source C is now alone

With Source A withdrawn (see below) and Source B worth about the 30 MSP rows,
**Source C carries the entire 120-row SME segment by itself** — and it was
written up as the weakest of the three and has never been measured.

The 6–10 rows/hour and 15–20 hour figures assumed Source A's sorted queue. They
are removed rather than adjusted, because adjusting them would invent a number.
The doc now says to work Source C for one timed hour and multiply from the real
rate, and to raise the 120-row target with the owner if it comes out at 2–3.

## Merged in: `claude/lia-source-amendment`

Both branches edit `TRIGGER-RESEARCH-METHOD.md`, so that branch is merged here
to give `main` one clean merge. It contains:

- **LIA Amendment 1, recorded as WITHDRAWN before approval.** The NCSC/IASME
  certificate register's own page states it "must not be used for marketing,
  data research, or any other purpose". The approved source list is unchanged.
- Source A withdrawn in the method doc, kept with the reason rather than
  deleted.
- The `renewal` trigger survives, but its evidence must come from the company's
  own published material — already an approved source.

## Commands and results

| Command | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npm run lint` | clean |
| `npx vitest run src/lib/outreach/contracts-finder.test.ts` | 23 passed |
| `npm run test:run` | **288 passed, 1 failed** — see below |
| Live API run | 170 candidates written, mode 600 |

**The single failure is a worktree artifact, proven not assumed.**
`pdf-primitives.test.tsx` shells out to `scripts/prepare-report-fonts.mjs`,
which builds an explicit `process.cwd()/node_modules/@fontsource/...` path. This
worktree's `node_modules` is near-empty; every other test resolves because Node
walks up to the parent repository's copy, but an explicit path does not get that
fallback. The same test run in the main checkout passes 5/5. Running
`npm install` in the worktree would also fix it.

## External state

None. Contracts Finder's API is public and unauthenticated; only GET-equivalent
searches were issued. No database, no Stripe, no email, no deploy. The output
CSV is under `outreach/runs/`, which is gitignored.

## Remaining risks

- **Source C is unmeasured and now load-bearing.** The single biggest unknown in
  the campaign.
- The MSP candidates need the competing-product check applied one by one; some
  are Certification Bodies and are disqualified outright.
- Notice pages 403 automated requests, so every `notice_url` must be opened in a
  browser before it can be cited as evidence.
- Open-notice monitoring has no schedule. Re-running the helper periodically is
  an operator habit, not automation.

## Next safe action

Merge this branch — it carries both the helper and the register withdrawal.
Then the real next step is not code: one timed hour of Source C research to
establish whether the 120-row SME target is reachable at all.
