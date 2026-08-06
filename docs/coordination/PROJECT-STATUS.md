# BrightCert project status

Last reconciled: 4 August 2026, 21:20 BST

Reconciled by: Claude Code

Integrated coordination commit: `292263a`.

## Production

- `https://brightcert.co.uk` resolves to Vercel deployment
  `dpl_2UYyGxx8LXfLaQYp1cWewma82jSs`
  (`brightcert-1gqw0cx65`), Ready, created 4 August 2026 20:59 BST.
- Local `main`, `origin/main` and the deployed build are all `292263a`.
- **The report PDF customers receive changed on 4 August.** The redesigned
  document is live: 24 pages, ~3.7 MB, six typefaces embedded from
  `public/fonts` rather than fetched from jsdelivr at render time. Verified
  through the deployed serverless function, not just locally —
  `docs/outreach/PDF-DEPLOYED-VERIFICATION-2026-08-04.md`.
- Deploy identity was confirmed by byte-matching all six `public/fonts` assets
  against local `292263a`, because `vercel inspect` carries no git SHA and
  timing alone cannot rule out a stale alias.
- Earlier live checks still hold: homepage HTTP 200; `/pricing` states the
  `FOUNDING10` cap 10 times.
- Hosting-plan changes are deferred until after the hackathon by owner
  decision.

Before claiming anything is live, check
`git rev-list --left-right --count origin/main...main`. Between 30 July and
1 August, `main` sat 17 commits ahead of `origin/main` and none of that work
was deployed, while local inspection made it look shipped.

## Active work

| Workstream | Branch | State | Ownership boundary |
|---|---|---|---|
| Social infographic system | `codex/social-infographic-system` | Integrated at `47515ea` | Complete |
| Integrated signal sprint | `codex/integrated-signal-sprint` | Integrated at `aaf55a4` | Four founder drafts held at `Status: Founder review` |
| PDF production gate repair | `codex/pdf-production-gate` | Integrated at `6804252` | Renderer repair deployed; retest closed 3 Aug on `claude/pdf-production-retest` |
| PDF sandbox retest | `claude/pdf-production-retest` | Integrated at `6b3d800` | Closed the final launch-gate row. Conflicts with `codex/reminder-evidence-integration` on `LAUNCH-GATE.md` |
| Launch evidence backup | `claude/evidence-backup` | Integrated at `7a13d6c` | Complete |
| Report redesign wiring | `claude/report-redesign-wiring` | **Integrated at `292263a`, deployed** | Ported the redesign's visual half only. `src/lib/gemini/analyze.ts` and `prompts.ts` are the untouched seam for future v2 work — do not overwrite `public/fonts/*` or `src/lib/gemini/analyze-v2.ts` |
| Production report redesign | `codex/production-report-redesign` | **Do not integrate** | 111 files; rejected by `codex/report-redesign-review` at `67b646a`. Its design is now live via `claude/report-redesign-wiring`; its *lifecycle* blockers stand and were deliberately not ported |
| Reminder dry-run evidence | `claude/reminder-dry-run-evidence` | Integrated at `112f9d7` | Complete |
| Reminder evidence integration | `codex/reminder-evidence-integration` | Unmerged | Collides with `LAUNCH-GATE.md` only, which is now committed — re-check before merging |
| Preview build fallback | `codex/preview-build-supabase-fallback` | Unmerged, largely redundant | Same patch-id as work already integrated via `codex/seo-growth` |
| Review records | `claude/seo-growth-review`, `codex/report-redesign-review` | Unmerged, 1 file each | Review documents only |

## Dirty-main preservation boundary

**This boundary is largely resolved as of `7a13d6c`.** The launch-gate record,
the LIA sign-off, and seven evidence documents that previously existed only as
uncommitted working-tree content are now committed. Untracked files fell from
474 to 1.

What remains uncommitted in `main`: the authored promo-video source under
`videos/brightcert-promo/` (`STORYBOARD.md`, `SCRIPT.md`, `DESIGN.md`,
`compositions/*.html`, and the small JSON files). Its generated media is now
ignored. This is a deliberate owner decision, not an oversight — it is left
visible rather than ignored so it is not forgotten.

`docs/outreach/REMINDER-DRY-RUN-2026-07-28.md` is now committed, and the blob
is byte-identical to the copies on the three reminder branches. The untracked
copy that previously made those merges abort is gone, which unblocked
`claude/reminder-dry-run-evidence` — merged at `112f9d7`, bringing only its
handoff, since the identical blob merged without conflict.

## Launch status

- The launch gate records **all 34 rows verified** — 27 `verified` and 7
  `verified (sandbox)`. No row remains `owner action required` or
  `operator action required`.
- The final open row, the PDF/report retest, was closed on 3 August 2026. Full
  sandbox lifecycle passed on commit `a1afe13` (identical to `origin/main` and
  to the live deployment): unpaid locked, paid generating a valid 14-page PDF
  with the certification disclaimer intact, refunded revoking access. Evidence:
  [PDF-SANDBOX-RETEST-2026-08-03.md](../outreach/PDF-SANDBOX-RETEST-2026-08-03.md).
- **Recorded deviation — render half closed 4 August 2026.** That row asked for
  the lifecycle "on the deployed build" and it ran against `next dev`. A preview
  deployment could not close it: Preview carries only `INTERNAL_API_SECRET` and
  `CRON_SECRET`, so it has no Stripe, Supabase or GCS credentials. Closed
  instead by invoking the deployed production function through its
  shared-secret caller path on `292263a` — HTTP 200 in 14.5 s, 24-page
  3,860,209-byte PDF with five embedded font subsets, textually identical to
  the local render except the date. Cold start is therefore measured, and the
  CDN dependency is gone rather than tested. Evidence:
  [PDF-DEPLOYED-VERIFICATION-2026-08-04.md](../outreach/PDF-DEPLOYED-VERIFICATION-2026-08-04.md).
- **Still open:** the Stripe webhook → generate chain has never run on the
  deployed build. The 4 August run bypassed Stripe entirely, and the 3 August
  run was local. Also note the 3 August evidence describes a 14-page ~250 KB
  document that is no longer what ships.
- The seven `verified (sandbox)` rows are all payment-related and stay sandbox
  until a first real customer payment.

## Immediate priorities

1. **Apply migration `20260804000100_reports_unique_assessment.sql`, then merge
   and deploy `claude/pdf-size-and-race`.** That branch fixes priorities 1 and 2
   as they were previously written here. The migration is a hard prerequisite:
   the new code claims against the unique index, and without it PostgREST
   rejects the upsert with `42P10` and every generation 500s.
2. ~~Subset the six embedded typefaces.~~ **Withdrawn — the premise was wrong.**
   The 3,860,209-byte report was not font data; the font programs total
   **1,211 bytes**. 96.8% was images: three distinct payloads embedded once per
   page each, dominated by the 512px header logo at 147,028 B × 24 pages.
   `@react-pdf` cannot share an image across pages (it hands pdfkit a Buffer,
   and both cache layers key on strings), so the fix was a dedicated 96px
   asset — 12.6× smaller, measured, with identical extracted text. Subsetting
   the fonts would have saved about a kilobyte.
3. Verify the **Stripe webhook → generate chain on the deployed build**. The
   4 August verification invoked the route directly via its shared-secret path,
   so the webhook trigger has still only ever been exercised against
   `next dev`. This is the last untested link in the paid lifecycle.
4. Decide on report retention. Nothing deletes a GCS object — not the refund
   handler, not row cleanup — so report PDFs persist indefinitely with no
   deletion path. Four orphaned objects remain in the bucket, one
   (`527184e7-…`) with no matching assessment row. Needs a decision under UK
   GDPR storage limitation.
5. Owner-directed, do not start without instruction: log download/delivery
   events for chargeback evidence, add immediate-supply consent at checkout, and
   tighten terms §4. The last two are customer-facing legal copy.
6. Click-verify the `find-a-certification-body` IASME link shipped at `292263a`,
   and spot-check the four pages linking to IASME's
   `frequently-asked-questions/`. IASME 403s automated requests, so neither
   could be confirmed by fetching.
7. Decide whether the promo-video source is committed or discarded.

The test-mode Stripe webhook endpoint that Stripe was due to auto-disable on
4 August is no longer tracked as a priority: the outcome of deleting it and the
outcome of letting it auto-disable are the same, and live-mode delivery is
unaffected either way.

## Known constraints

- Do not reproduce the official Cyber Essentials questionnaire verbatim.
- BrightCert is a readiness service, not a Certification Body.
- Gemini remains the sole production LLM.
- UK English is required.
- Production writes and external communications require explicit owner
  instruction.
- The desktop shell exposes no `node`/`npm` on `PATH`, and Homebrew's Node 25
  has a broken `llhttp` dylib link. Use
  `/opt/homebrew/Cellar/node@20/20.20.2/bin`.
- `vercel ls` writes its status table to **stderr**; redirect with `2>&1` or
  a grep on stdout will never match.
