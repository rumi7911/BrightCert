# Agent task handoff

- **Agent:** Claude Code
- **Date/time (BST):** 3 August 2026, 22:30
- **Task:** Wire the redesigned report PDF into synchronous generation, without
  the rejected artifact lifecycle; fix the dead IASME link
- **Branch:** `claude/report-redesign-wiring`
- **Worktree:** `.worktrees/report-redesign-wiring`
- **Base commit:** `6b3d800`
- **Final commit:** `178d9e4`, plus the commit containing this handoff
- **Status:** Complete, not deployed

## Scope and ownership

- Files intentionally changed: 55. The bulk is the ported design under
  `src/lib/pdf/report/` and `public/fonts/`. Hand-written or hand-modified:
  `next.config.ts`, `package.json`, `src/app/api/reports/generate/route.ts`,
  `src/app/(app)/assessment/[id]/report/page.tsx`,
  `src/lib/pdf/report/pages/CoverPage.tsx`,
  `src/lib/pdf/report/report-input.ts` (one import line),
  `src/lib/pdf/report/report-view-model.ts`,
  `src/lib/pdf/ReportDocument.test.tsx`, and the new
  `src/lib/gemini/analyze-v2.ts`.
- Files inspected but not changed: `src/lib/gemini/analyze.ts`,
  `src/lib/gemini/prompts.ts`, `src/app/api/stripe/webhook/route.ts`,
  `src/lib/gcs/upload.ts`, the full `codex/production-report-redesign` range and
  its release review at `67b646a`.
- Overlapping work discovered: `codex/production-report-redesign` is the source
  of this design and remains **do not integrate** as a whole.
  `codex/reminder-evidence-integration` conflicts with `main` on
  `LAUNCH-GATE.md` (from the earlier retest merge), unrelated to this branch.
- Files another agent must not overwrite: `public/fonts/*` and their licence
  files; `src/lib/gemini/analyze.ts` and `prompts.ts` are deliberately
  untouched and are the seam for any future v2 work.

## Changes

### What was ported, and what was not

The release review at `67b646a` rejected `d33e62d`, but its three blockers were
all about the asynchronous artifact lifecycle, not the visual design: no worker
trigger on the current Vercel plan (a newly paid customer would sit queued
indefinitely), orphan GCS objects after ambiguous completion, and a legacy
backfill that can attach an object to the wrong historical row. Its own next
safe action was to keep synchronous generation for the hackathon.

Ported: `src/lib/pdf/report/` (brand tokens, ten page components, charts, view
model, fixtures), the composed `ReportDocument`, `render-report`,
`report-input`, the added v2 types in `src/types/assessment.ts`, the six pinned
local fonts with OFL licences, and `scripts/prepare-report-fonts.mjs`.

Not ported: the queue worker, repository layer, `/api/reports/download`,
`/api/reports/retry`, the four migrations, and `backfill-report-artifacts`.

### Rendering from data we already store

`generate/route.ts` now calls `parsePersistedReportInput(payload, generatedAt)`
and `renderValidatedReport(input)`. The payload it builds is unchanged, so
every existing assessment renders through the parser's legacy v1 path.

The design degrades honestly there rather than inventing content:
`portfolioEligibility` is `review_required`, management implications and the
report headline are synthesised from counts, key strengths is empty, and
actions carry no owner, timeframe or evidence. Those fields only populate when
the analysis is upgraded to v2.

### Why the v2 parser was split out

`report-input.ts` imported `parseGeminiAnalysisResult` from
`@/lib/gemini/analyze`, which on the redesign branch returns the v2 shape and
**rejects any payload whose `analysisVersion` is not 2**. Porting that module
would have broken every live analysis, since the prompt still emits v1.

The parser half is therefore lifted into `src/lib/gemini/analyze-v2.ts`, with
`analyzeAssessment` and the prompt left out entirely. `analyze.ts` and
`prompts.ts` on `main` are untouched. Nothing produces v2 payloads yet, so that
module is reached only by the fixtures. When the prompt is upgraded, move it
back or have `analyzeAssessment` call it and the fuller pages populate with no
further change.

### Two deliberate departures from the ported design

1. **Certification disclaimer added to the cover.** The design placed it only
   on the methodology page. It is on page 1 today, the launch-gate evidence
   recorded 3 August cites it there, and the cover is the page most likely to
   be shared or screenshotted alone. `ReportDocument.test.tsx` previously
   asserted the disclaimer appeared on exactly one page; it now asserts exactly
   two, that the first is the cover and the second is the final page, and that
   heading and body always travel together. The invariant was tightened, not
   loosened.
2. **`outputFileTracingIncludes` added for `/api/reports/generate`.** Fonts are
   now read off disk from `process.cwd()/public/fonts` at render time. I
   assumed tracing would miss them and **verified the assumption was wrong**: a
   control build without the entry still traced all six fonts, because Next
   16.2.12 traces all of `public/` into the function. The entry is kept as
   belt-and-braces and the comment says so plainly, because the failure it
   guards against is silent at build time and total at runtime.

### IASME link

`certified-assessors` returns nothing in the search index and is reported dead
by the owner; IASME hard-blocks automated requests (403 on every path including
the site root) so it could not be confirmed by fetching. Replaced with
`find-a-certification-body` in `report/page.tsx` (href and visible text). The
redesigned PDF carries no IASME link at all, so the third occurrence
disappeared with the old document.

## Verification

```text
npx tsc --noEmit
exit 0, no output

npm run lint
exit 0, no warnings
(the 3 unused-variable warnings the release review recorded on the source
 branch were fixed, not inherited)

npm run test:run
33 test files passed, 256/256 tests passed
(was 217 on main; +39 from the ported design's own suites)

npm run build
exit 0, Compiled successfully, 31/31 static pages

file-trace check, WITH the config entry
.next/server/app/api/reports/generate/route.js.nft.json
-> 9 public/fonts entries traced (6 fonts + 3 licences)

control build, WITHOUT the config entry
-> 9 public/fonts entries still traced; public/ subdirs traced = fonts + logo
-> proves Next traces public/ by default; the entry is insurance, not required

real-data render through the wired parser and document
assessment 182d5f7f, analysisVersion=1
-> 3,920,905 bytes, %PDF-1.3, %%EOF present
-> cover renders headline, 63/100 Nearly Ready, metric strip and the
   certification disclaimer; visually inspected
```

## External state

- **Database writes:** None. Reads only, to render a preview from stored data.
- **Deployment:** None.
- **Emails/messages:** None.
- **Payments:** None.
- **Other external actions:** None. No GCS object written; the preview render
  was written to a scratch directory outside the repository. Three
  `@fontsource` devDependencies were installed at pinned `5.3.0`.

## Remaining risks or blockers

1. **The wired path has not been exercised end to end on a running server.**
   Unit coverage includes `render-report.test.ts`, which drives the route's own
   dynamic-import wrapper with both v1 and v2 inputs, and the real-data render
   above. But no paid checkout has produced a PDF through the new code. The
   3 August retest covered the *old* document. Repeat that sandbox lifecycle
   before or immediately after deploying.
2. **The PDF grew from ~250 KB to ~3.9 MB**, because six font faces are now
   embedded rather than referenced over HTTP. Correct for reliability, but
   heavy for email attachment or a slow connection. Subsetting the faces to the
   glyphs actually used would bring it down sharply.
3. **The triple-generation race recorded on 3 August is unchanged** and now
   costs three renders of a larger document. It remains the highest-value
   follow-up.
4. **`find-a-certification-body` was not confirmed by fetching**, only by the
   search index. Click it once before relying on it. Four other pages link to
   `iasme.co.uk/cyber-essentials/frequently-asked-questions/`, unverified for
   the same reason and worth a spot-check.
5. **The v1 rendering is honest but sparse.** If the thin executive readout
   matters commercially, the v2 analysis is the fix, and it is a separate,
   larger task that changes the billed AI path.

## Next safe action

Owner review of the rendered output, then merge to `main` and deploy. Because
this changes what every paying customer receives, the safest sequence is:
merge, deploy, then repeat the sandbox paid PDF lifecycle from
`PDF-SANDBOX-RETEST-2026-08-03.md` against the deployed build — which also
closes the deviation recorded in that document.

Do not merge `codex/production-report-redesign` itself at any point. Its
lifecycle blockers stand.
