# Agent task handoff

- **Agent:** Claude Code
- **Date/time (BST):** 4 August 2026, 22:00
- **Task:** Priorities 1 and 2 from `PROJECT-STATUS.md` — the triple-generation
  race, and the report PDF's size
- **Branch:** `claude/pdf-size-and-race`
- **Worktree:** `.worktrees/pdf-size-and-race`
- **Base commit:** `b24dcdc`
- **Final commit:** `1d0ade6`, plus the commit containing this handoff
- **Status:** Complete, **not merged, not deployed, migration not applied**

## A correction to the record

`PROJECT-STATUS.md` priority 2 said the PDF's size was font data and prescribed
subsetting. **That was wrong, and it was my error from earlier the same day.**
The font programs in the delivered 3,860,209-byte PDF total **1,211 bytes**.

96.8% of the file was images: 72 image objects that are only **three distinct
payloads**, each embedded once per page. The largest is the 512px header logo
at 147,028 bytes × 24 pages = 3.53 MB. Subsetting the fonts would have saved
about a kilobyte.

The correction matters beyond this task: the same false premise is written into
the priorities list and the launch-gate record, and is fixed there by this
branch's doc commit.

## Scope and ownership

- Files changed: `next.config.ts`, `src/app/api/reports/generate/route.ts`,
  `src/app/api/reports/generate/route.test.ts`,
  `src/app/(app)/assessment/[id]/report/page.tsx`,
  `src/lib/pdf/report/components/BrandHeader.tsx`, new
  `src/lib/reports/claim.ts` + `claim.test.ts`, new
  `src/lib/pdf/report-size.test.ts`, new `public/logo-mark-report.png`, new
  `supabase/migrations/20260804000100_reports_unique_assessment.sql`.
- **`public/logo-mark.png` is deliberately unchanged.** `next/image` derives the
  web variants from it (`src/components/brightcert/logo.tsx:11`), so shrinking
  the shared asset would degrade the site.
- Files another agent must not overwrite: `src/lib/reports/claim.ts` and the
  new migration; `public/fonts/*`; `src/lib/gemini/analyze.ts` and `prompts.ts`.

## Why the images could not simply be deduplicated

`@react-pdf` 4.5.1 cannot share one image across pages, and this was read in the
installed source rather than assumed:

- `@react-pdf/image/lib/index.js:271-273` — `getCacheKey` returns `null` for a
  Buffer, so a Buffer `src` bypasses the decode cache entirely.
- `@react-pdf/render/lib/index.js:343` — the renderer calls
  `.image(node.image.data, …)`, a Buffer.
- `@react-pdf/pdfkit/lib/pdfkit.js:39158-39168` — `openImage` only consults or
  populates `_imageRegistry` when `typeof src === 'string'`.

So every `<Image>` usage embeds a fresh XObject regardless of what `src` we
pass. The only available lever is the size of each copy. 96px renders the 22pt
logo at roughly 314 DPI.

A vector logo would remove the per-page cost entirely and is the real fix if
this ever matters again — there is no SVG brand mark in `public/` today.

## The race fix

Generation is now single-flight. The unique index is the mutex; callers claim
before rendering instead of checking and hoping.

- An empty `gcs_url` marks a claim in progress. Publishing the real URL marks
  the report finished. **Anything deciding readiness must test `gcs_url`, never
  row existence** — `getReportSignedUrl` signs the deterministic path without
  checking the object exists, so a claim mistaken for a finished report would
  hand the customer a live-looking link to nothing. `report/page.tsx` was
  updated for exactly this.
- Losers receive `202 {status:"generating"}` rather than rendering a duplicate.
  Safe because both real callers are fire-and-forget and neither reads the body
  (`webhook/route.ts:62`, `report/page.tsx:99`), and the page has a poller.
- A claim older than `CLAIM_STALE_MS` (90 s, past `maxDuration = 60`) can be
  taken over by compare-and-swap, so a render killed mid-flight cannot wedge an
  assessment permanently.
- A failed render deletes its own claim row.

## Verification

```text
npx tsc --noEmit      exit 0
npm run lint          exit 0, no warnings
npm run test:run      35 files, 266/266  (was 33 files / 256 on main)
npm run build         exit 0, 31/31 static pages
nft trace             10 public assets in the generate function
                      (9 font entries + logo-mark-report.png)

size, real assessment 182d5f7f, one renderer, only the asset differing
  512px logo   3,722,366 bytes
  96px  logo     295,981 bytes      12.6x
  pdftotext -layout diff between them: 0 lines
  24 pages, 7 font references, %%EOF intact in both

claim protocol   7 focused tests, including three concurrent callers
                 producing exactly one winner and one row
```

### One measurement caveat, checked rather than assumed

PDFs rendered under **vitest** are not fully renderable by poppler — page 1
rasterises with layout but no text or logo, and `pdftoppm` reports
`Bad FCHECK in flate stream`. I ran the control before trusting the number: the
**old** 512px asset rendered under vitest fails identically, byte-for-byte the
same 21,614-byte blank page. So this is a vitest artifact, not a defect in the
change. The deployed production render of the same document rasterises
perfectly.

The consequence is that `295,981` is a vitest figure. The vitest control ran
3.7% under the real deployed render of the same document, so **production should
land near 307,000 bytes**. Confirm against a real render before quoting a
production number.

## External state

- **Database writes:** none. The migration is written but **not applied**.
- **Deployment:** none.
- **Emails, payments, GCS:** none. Real assessment data was read to render a
  preview into a scratch directory outside the repository.

## Remaining risks or blockers

1. **The migration must be applied before this deploys.** Without a unique
   constraint, `on conflict (assessment_id)` matches nothing and PostgREST
   rejects the upsert with `42P10` — every generation would 500. Production
   currently holds one `reports` row, so the migration's dedupe step is a
   no-op, but it is written defensively anyway.
2. **The claim protocol has not run against a real database.** Its concurrency
   guarantees are covered by focused tests against a fake that enforces the
   unique index, but PostgREST's `ignoreDuplicates` behaviour and the
   compare-and-swap takeover deserve one live exercise.
3. **The production size figure is inferred, not measured** — see the caveat
   above.
4. Unchanged from the previous handoff: the Stripe webhook → generate chain has
   never run on the deployed build; four orphaned GCS objects remain; the
   IASME links are unverified; the exposed `sk_test_` key should be rolled.

## Next safe action

Apply the migration to production, then merge and deploy, then render one real
report and confirm it lands near 307 KB with the logo intact. Doing it in that
order matters: the code depends on the index, and the index is harmless without
the code.
