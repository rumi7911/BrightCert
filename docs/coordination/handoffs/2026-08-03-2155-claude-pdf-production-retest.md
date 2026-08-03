# Agent task handoff

- **Agent:** Claude Code
- **Date/time (BST):** 3 August 2026, 21:55
- **Task:** Run the outstanding sandbox PDF/report retest and close the final
  open launch-gate row
- **Branch:** `claude/pdf-production-retest`
- **Worktree:** `.worktrees/pdf-production-retest`
- **Base commit:** `a1afe13`
- **Final commit:** the commit containing this handoff
- **Status:** Complete

## Scope and ownership

- Files intentionally changed:
  - `docs/outreach/PDF-SANDBOX-RETEST-2026-08-03.md` (new — full evidence record)
  - `docs/outreach/LAUNCH-GATE.md` (PDF/report row only)
  - `docs/coordination/PROJECT-STATUS.md` (launch status and priorities)
  - `docs/coordination/handoffs/2026-08-03-2155-claude-pdf-production-retest.md` (this file)
- Files inspected but not changed: `src/app/api/stripe/webhook/route.ts`,
  `src/app/api/stripe/checkout/route.ts`, `src/app/api/reports/generate/route.ts`,
  `src/app/(app)/assessment/[id]/report/page.tsx`, `src/lib/stripe/client.ts`,
  `src/lib/gcs/client.ts`, `src/lib/gcs/upload.ts`, `src/lib/resend/client.ts`,
  `src/lib/resend/emails.ts`, `src/components/brightcert/checkout-link.tsx`,
  `src/app/(marketing)/terms/page.tsx`
- Overlapping work discovered: none. No other branch touches these documents.
  `codex/reminder-evidence-integration` still touches `LAUNCH-GATE.md` and will
  now conflict on the PDF/report row — see Remaining risks.
- Files another agent must not overwrite: the pre-existing untracked
  `videos/brightcert-promo/` in the main worktree, and the four pre-existing GCS
  objects under `reports/`.

**No application code was changed by this task.** The four findings below are
recorded, not fixed.

## Changes

Documentation only. The PDF/report launch-gate row moved from
`owner action required` to `verified (sandbox)`, backed by a new dated evidence
document. With that row closed, all 34 gate rows now carry a verified status
(27 `verified`, 7 `verified (sandbox)`), and no row remains
`owner action required` or `operator action required`.

The row's status wording deliberately matches the six existing payment-related
rows rather than claiming unqualified `verified`, because the run was a sandbox
run and because of the deviation recorded below.

### Deviation recorded, not hidden

The row asked for the lifecycle "on the deployed build". It ran against
`next dev` on the same commit. A sandbox run cannot target production without
repointing live checkout at test-mode keys. Fonts are CDN-fetched at render time
and `@react-pdf/renderer` is dynamically imported in both modes, so no bundling
difference can mask a renderer defect; what stays untested is Vercel cold-start
behaviour against `maxDuration = 60` for a render measured at 3.2–5.6 s. A
Vercel preview deployment with test-mode keys would close the residue.

### Test configuration approach

`.env.development.local` (mode `600`, matched by `.gitignore:34`) was used
because Next.js resolves it ahead of `.env.local` in development — see
`node_modules/next/dist/docs/01-app/02-guides/environment-variables.md:268`.
The live keys in `.env.local` were never edited, so no restore was needed. The
file was deleted after the run.

## Verification

```text
curl https://api.stripe.com/v1/balance -u sk_test_…
HTTP 200, livemode = false  (test mode confirmed before anything else ran)

POST /api/reports/generate  (unpaid 391f2022…, valid x-internal-secret)
403 {"error":"Assessment not paid"}

POST /api/reports/generate  (unpaid 391f2022…, no secret, no session)
401 {"error":"Unauthorized"}

GET /assessment/391f2022-…/report  (anonymous)
307 -> /signup?next=%2Fassessment%2F391f2022-…%2Freport

Stripe Checkout, test card 4242…, GBP 199.00
checkout.session.completed evt_1U0SV5LgYuMz5C749uabwkBR -> [200]
payment_intent.succeeded / charge.succeeded / charge.updated -> [200]
assessment 182d5f7f… -> status=paid, stripe_session_id/amount_paid/currency/paid_at populated

GET <GCS signed URL>
HTTP 200, 250964 bytes, %PDF-1.3, 14 pages, %%EOF present
pages 1-2 rendered and inspected: score 63% "Nearly Ready", org "Sohaib",
all five control areas named and scored, certification disclaimer on page 1,
footer "Page 1 of 14", P1 cards unsplit

Stripe full refund (test dashboard)
charge.refunded evt_3U0SV3LgYuMz5C742Y4s1J7A -> [200]
assessment 182d5f7f… -> status=analysed, stripe_session_id/amount_paid/currency/paid_at all null,
reminder_sent_at=2026-08-03T20:35:16.469+00:00
owner confirmed UI returned to the locked pay-to-unlock state

DELETE /rest/v1/reports?assessment_id=eq.182d5f7f…
deleted 3 rows (cb903e11…, 190fcf31…, 4bb99379…); read-back []

GCS delete reports/182d5f7f-….pdf
before exists=true (250964 bytes); after exists=false

npx tsc --noEmit
exit 0

npm run test:run
24 test files passed, 217/217 tests passed

npm run lint
exit 0

npm run build
exit 0, Compiled successfully, 31/31 static pages generated
```

## External state

- **Database writes:** yes, production Supabase. Assessment `182d5f7f…` was
  taken `analysed → paid → analysed` by the real webhook path and is back to its
  starting status with all four Stripe fields `null`. Three `reports` rows were
  created by the run and all three deleted, confirmed by read-back. Residual:
  `182d5f7f.reminder_sent_at` was overwritten by the refund handler from an
  earlier timestamp to `2026-08-03T20:35:16.469+00:00`; every analysed
  assessment already carried a value so the practical effect is nil, and no
  fabricated restore was attempted. No other row was touched. The production
  database contained zero `paid` assessments and no real customer records
  before and after.
- **Deployment:** None. Nothing was deployed; `main` is untouched by this task.
- **Emails/messages:** None. `RESEND_API_KEY` was blanked for the run; the log
  shows `Report-ready email failed: RESEND_API_KEY is required`, caught by the
  existing handler.
- **Payments:** One test-mode charge of GBP 199.00 and one full test-mode
  refund. `livemode: false` verified before the run. No live payment, no real
  card, no live-mode object touched.
- **Other external actions:** One GCS object written to the production bucket
  and then deleted. Four pre-existing objects under `reports/` were left
  untouched. A test-mode `sk_test_…` key was pasted into an assistant chat
  transcript during setup and **should be rolled** at
  <https://dashboard.stripe.com/test/apikeys>; no key was written to any tracked
  file and `git status` was confirmed clean.

## Remaining risks or blockers

Unresolved, ordered by how much they cost:

1. **The PDF generates three times per purchase.** Three
   `POST /api/reports/generate` calls returned `200` within 1.5 s (3.3 s, 5.6 s,
   3.2 s of render), producing three `reports` rows and three uploads to the
   same path. The existence guard at
   `src/app/api/reports/generate/route.ts:56-66` reads before any concurrent
   insert lands — a check-then-act race between the Stripe webhook, the report
   page's fire-and-forget trigger, and the poller reload. Not a correctness bug
   (identical content, same deterministic object path) but three concurrent
   renders per sale against a 60 s serverless ceiling. A unique index on
   `reports.assessment_id` plus an upsert would close it.
2. **PDF fonts are fetched from jsdelivr at render time**
   (`src/lib/pdf/ReportDocument.tsx:16-32`, four Inter weights). A third-party
   CDN sits in the critical path of a paid deliverable, and combined with
   finding 1 that is twelve external font requests per sale. Bundling the
   `.woff` files locally removes the dependency.
3. **GCS objects outlive their database rows.** Before this run the bucket held
   four objects under `reports/` against one `reports` row, including PDFs for
   two currently-unpaid assessments and one (`527184e7…`) with no matching
   assessment. Nothing deletes a GCS object — not the refund handler, not row
   cleanup. Not an access-control issue (a signed URL is only minted by the
   report page, which redirects when unpaid), but report content persists
   indefinitely with no deletion path, which needs a decision under UK GDPR
   storage limitation.
4. **No delivery or download is logged anywhere in `src/`.** On a chargeback,
   Stripe asks for evidence that digital goods were delivered. Logging
   assessment ID, user, timestamp and IP at signed-URL issue would provide it.
   Related owner decisions, not defects: there is no immediate-supply consent at
   checkout (the mechanism that extinguishes a consumer's statutory cancellation
   right for digital content), and terms §4
   (`src/app/(marketing)/terms/page.tsx:62`) currently promises only to
   "consider refund requests in good faith". These are commercial and legal
   calls for the owner and should be checked by a qualified adviser.

Optional improvements, not blockers: the deviation residue above (a preview-
deployment run), and rolling the exposed test key.

Merge risk: `codex/reminder-evidence-integration` also touches
`LAUNCH-GATE.md`. It will now conflict on the PDF/report row. Re-check it before
merging and resolve in favour of whichever record is newer per row.

## Next safe action

Merge this branch into `main` (documentation only; no application code changed,
so no deploy is required for correctness, though `main` should still be pushed).

The highest-value follow-up is finding 1, as a bounded task on
`claude/report-generation-race` or `codex/report-generation-race` based on
`main` after this merge: add a unique constraint on `reports.assessment_id` and
make the generate route upsert rather than check-then-insert. Findings 2 and 3
are small and independent. Finding 4 is owner-directed and includes
customer-facing legal copy, so it must not be started without explicit
instruction.
