# PDF/report verification — 27 July 2026

> **LOCAL FIX VERIFIED — PRODUCTION DEPLOYMENT AND RETEST REQUIRED**

The PDF/report gate is not yet closed. This audit found four defects in the
current report renderer, fixed them locally, and verified the repaired source.
Because these changes are not yet deployed, the production row in
`LAUNCH-GATE.md` remains `owner action required`.

## Scope

| Record | Value |
|---|---|
| Environment | Local production-equivalent build and generated PDF |
| Report fixture | Maximum accepted persisted payload boundary |
| Evidence reviewer | Codex |
| Date | 27 July 2026 |
| Production data mutation | None |

## Defects found and repaired

| Finding | Repair | Local result |
|---|---|---|
| Structured remediation actions and steps were accepted and stored but omitted from the paid PDF | Added a complete Remediation Action Plan with control headings, effort labels and numbered steps | Pass; the final step marker survives extraction and is visibly present |
| The cover disclaimer heading could remain on page 1 while its body moved to page 2 | Made each disclaimer block non-breaking | Pass; both disclaimer instances keep heading and body on the same page |
| A maximum-length organisation name collided with the footer page counter | Bounded the footer display name and reserved a fixed-width page-number column | Pass on all 34 boundary pages |
| A priority gap card could split across pages and leave a fragment behind | Made each issue/why gap card non-breaking | Pass; all 25 tagged issue/why pairs remain on the same page |

The footer truncation affects only the repeated footer label. The full
organisation name remains present in the report content.

## Boundary and validation evidence

| Check | Observed evidence | Result |
|---|---|---|
| Malformed persisted analysis | Direct parser check raised `PersistedReportPayloadError` | Pass |
| Oversized executive summary | Report route test returns HTTP 422 before rendering | Pass |
| Oversized organisation name | Report route test returns HTTP 422 before rendering | Pass |
| Exact accepted boundary | Report route test returns HTTP 200 | Pass |
| Beginning/end content preservation | Organisation, executive-summary, first/last gap and final remediation-step markers all survive PDF extraction | Pass |
| Certification distinction | Both “Readiness assessment — not official certification” notices are complete; the official Cyber Essentials next-step sentence is present | Pass |
| Footer layout | Extracted coordinates preserve at least an eight-point gap before every page counter | Pass |
| Visual inspection | All 34 rendered A4 pages were inspected; no clipping, footer collision, broken disclaimer or split gap card remained | Pass |
| PDF properties | 34 A4 pages, 288,446 bytes, no encryption and no JavaScript | Pass |

The 34-page count is an adversarial maximum-boundary fixture, not a normal
customer report-length target.

## Access-control evidence

The focused report-page tests confirm that a paid, non-refunded Stripe Checkout
Session unlocks the matching report path while a fully refunded Session cannot
restore access from an old success URL. Phase 5's sandbox lifecycle evidence in
`LAUNCH-GATE.md` additionally records a real application checkout, webhook,
entitlement, PDF download, refund revocation and replay-safe reconciliation.

That earlier sandbox lifecycle proves the access-control path, but it predates
the renderer repairs above and therefore does not prove that this exact PDF
source is live.

## Engineering verification

Fresh checks after the repairs:

| Command | Result |
|---|---|
| `npm run test:run` | 17 files, 183 tests passed |
| `npm run lint` | Pass |
| `npx tsc --noEmit` | Pass |
| `npm run build` | Pass; Next.js 16.2.12 production build completed |

## Remaining production acceptance

Before the launch-gate row can move to `verified`:

1. Place the PDF source and test changes in an isolated reviewed commit.
2. Deploy that exact commit and confirm live/origin/deployment commit parity.
3. Using Stripe sandbox mode, take one owner-controlled assessment through paid
   entitlement on the deployed application.
4. Generate and download the deployed PDF, confirm the remediation plan and
   complete certification disclaimer render correctly, and confirm an unpaid
   or refunded assessment cannot access it.
5. Remove the disposable sandbox data and record the deployed commit and
   production observations in the launch gate.

No real card is required; this preserves the founder's earlier direction to use
Stripe sandbox mode.
