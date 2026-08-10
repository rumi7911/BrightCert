# XPRIZE mandatory requirements — production evidence, 10 August 2026

`CLAUDE.md` records two mandatory requirements for judging: **the Gemini API**
and **at least one Google Cloud product**. Both are live in production and
verified end-to-end on the deployed build. This document records how, so the
claim can be re-checked rather than taken on trust.

| Requirement | Status | Verified |
|---|---|---|
| Gemini API is the live LLM in production | ✅ | 10 August 2026, 22:04 BST |
| Google Cloud Storage holds report PDFs | ✅ | 6 August 2026, 20:35 BST |

---

## Environment

| Item | Value |
|---|---|
| Production URL | `https://brightcert.co.uk` |
| Deployment | `brightcert-jyhg4pzs9`, Production, Ready, 46 s build, 10 August 2026 22:42 BST |
| Commit | `572ae58` — local `main`, `origin/main` and the deployed build all agree |
| Gemini model | `gemini-2.5-flash` (`src/lib/gemini/client.ts:16`) |
| GCS bucket | production, deterministic per-assessment path |

---

## Requirement 1 — Gemini API, live in production

**Method.** The analyze route authenticates by session ownership
(`verifyAssessmentOwnership`) and has no shared-secret caller path, so it can
only be exercised by a signed-in user in a browser. The owner therefore signed
in to the production site and submitted a real assessment. Nothing was mocked,
stubbed, or replayed.

**Subject.** Assessment `6e262696-14c4-4c84-82c4-10d6127b8203`, organisation
"rumi ltd", one of four draft assessments created 9 July 2026 and left
unanalysed until tonight — so the analysis could not have been served from
existing data.

**Result.** Submitted `2026-08-10T22:04:23Z`, status `analysed`, overall score
**49**, with a generated executive summary beginning *"Rumi Ltd currently needs
significant improvements to meet Cyber Essentials standards…"*.

All five control areas were scored and written to `control_scores`:

| Section | Score | Status | Gaps | Remediation steps |
|---|---:|---|---:|---:|
| 1 — Boundary Firewalls & Internet Gateways | 15% | fail | 5 | 3 |
| 2 — Secure Configuration | 45% | fail | 5 | 3 |
| 3 — User Access Control | 75% | warning | 4 | 3 |
| 4 — Malware Protection | 65% | warning | 5 | 3 |
| 5 — Security Update Management | 45% | fail | 5 | 3 |

The database figures match what the results page rendered, independently
checked. The `gaps` and `remediation` arrays are Gemini-generated prose, not
templated text — they are the substance of the product, not decoration.

### A false alarm worth recording

Before the browser test, an attempt was made to verify the production key
without a production write: the Vercel production environment was pulled, the
`GEMINI_API_KEY` extracted, and called directly against the Gemini API. It
returned **HTTP 401 `UNAUTHENTICATED`**, and the production key's SHA-256
differs from the local one.

**That was a false alarm.** The end-to-end browser test proves the production
key works. The 401 came from the extraction, not the key.

Recorded because the reasoning is reusable: *a differing key hash is not
evidence of a broken key*, and the only trustworthy test of a credential is the
path that actually uses it. A local key testing green proves nothing about
production either — local and production keys genuinely differ here.

---

## Requirement 2 — Google Cloud Storage

Verified 6 August 2026 and unchanged since. `POST /api/reports/generate` on the
deployed function rendered a 24-page report, uploaded it to the production GCS
bucket, and returned a signed URL from which the object was downloaded and
measured at **308,210 bytes**.

Full evidence, including the single-flight concurrency proof:
[`PDF-SIZE-RACE-VERIFICATION-2026-08-06.md`](./PDF-SIZE-RACE-VERIFICATION-2026-08-06.md).

GCS is not decorative here. It is the only store for report PDFs — they are not
written to the filesystem or to Supabase storage — so a working GCS path is a
precondition for any customer receiving the paid deliverable.

---

## How to re-verify

**Gemini** (3 minutes, no credential handling): sign in to
`https://brightcert.co.uk`, complete and submit an assessment, confirm the
results page renders five scored control areas. Then confirm `control_scores`
holds five rows for that assessment id.

**GCS** (owner-run script): the two scripts used on 6 August flip one
founder-owned assessment to `paid`, call the deployed generate route, measure
the object, and restore state from a shell `trap`. No Stripe object is created.

---

## What this document does not claim

- **No real customer has ever paid.** The Stripe webhook → generate chain has
  never run on a deployed build; every report verification has used the internal
  shared-secret caller path. This is the last untested link in the paid
  lifecycle and closing it costs a real £199 purchase at roughly £3.19 in
  non-refundable fees.
- **No official Cyber Essentials certificate is issued.** BrightCert provides
  readiness assessment, gap analysis and a report. Certification comes from an
  IASME-licensed Certification Body. The results page states this.
- Gemini currently chooses the per-control scores at `temperature: 0.2`, so
  identical inputs can score differently between runs. `analyze/route.ts:79`
  discards Gemini's `overallStatus` in favour of a locally computed one.
