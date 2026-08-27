# Handoff — seo:measure ranking fix

- **Agent:** Claude
- **Date:** 27 August 2026
- **Branch:** `claude/seo-measure-sort`
- **Worktree:** `.worktrees/seo-measure-sort`
- **Commit:** `5d8b478`
- **Base:** `main` at `cc9b12e`

## Task

Fix `scripts/seo-measure.mjs`, which was reporting alphabetically-first rows as
if they were the top rows.

## What was wrong

The Search Console API orders result rows by clicks descending. The site has
zero clicks, so every row ties, and the tie-break is alphabetical by key. With
`rowLimit: 5` on the country dimension the response was `aus, can, chn, col,
deu` — `gbr` never appeared, and UK share printed as **0.0%** against a real
**76.4%** (236 of 309 impressions). The 20 August report carries the same
false 0.0%.

The queries table had the same defect at `rowLimit: 20`: it cut off at
`cyber essentials plus audit` and never showed the 32 queries that sort after
it. The pages table was under its limit, so it was unaffected in practice.

## Change

- Fetch each dimension with `ROW_LIMIT = 1000`.
- Rank client-side with `topBy()` — impressions descending, key as tie-break.
- Display top 15 pages / 25 queries / 5 devices.
- Print `Top 25 of N distinct queries` so a future reader can see it is a slice.

## Verification

```
npx eslint scripts/seo-measure.mjs          # clean
node .worktrees/seo-measure-sort/scripts/seo-measure.mjs   # run from repo root for .env.local
```

Live run confirms UK share 76.4% and an impression-ordered query table.
Run the script from the repo root: `loadEnv()` reads `.env.local` from
`process.cwd()` and the worktree has neither that file nor `node_modules`.

## Consequence for the content plan

The 20 August CE Plus re-plan was made on the truncated table. CE Plus still
holds up (26 + 17 + 3 + 4 = ~50 impressions), but a second cluster of
comparable size was invisible:

| Query | Impressions | Avg position |
|---|---:|---:|
| cyber essentials questionnaire | 12 | 88.5 |
| cyber essentials readiness assessment | 9 | **26.3** |
| cyber essentials self assessment | 8 | 32.1 |
| cyber essentials self assessment questionnaire | 5 | 61.0 |
| cyber essentials self-assessment | 4 | **31.5** |
| iasme cyber essentials questionnaire | 4 | 75.3 |
| cyber essentials readiness check | 4 | 78.3 |

~46 impressions, and unlike CE Plus it is the intent BrightCert actually
serves. Three of these already sit in the 26–35 band with no page written for
them. `docs/seo/ORGANIC-SEARCH-EXECUTION.md` defers
`/blog/cyber-essentials-assessment-questions` to week 13 on the stated grounds
of "no measured demand yet" — that premise came from the truncated table and
no longer holds.

**Owner decision required** before week 5 drafting: keep the CE Plus cluster at
weeks 5–7, or promote the self-assessment article. Not actioned here.

## Next safe action

Owner merges `claude/seo-measure-sort` into `main`, then re-runs
`npm run seo:measure -- --write` to record a corrected 27 August report.
The uncorrected `docs/growth/SEO-2026-08-20.md` is left as-is; its 0.0% UK
share is now explained by this handoff.
