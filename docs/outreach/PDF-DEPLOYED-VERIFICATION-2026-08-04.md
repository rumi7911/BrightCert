# Deployed-build PDF verification — 4 August 2026

Closes the deviation recorded in
[`PDF-SANDBOX-RETEST-2026-08-03.md`](./PDF-SANDBOX-RETEST-2026-08-03.md#deviation-from-the-row-as-written),
which ran the paid PDF lifecycle against `next dev` rather than the deployed
Vercel build.

This run exercises the **deployed serverless function** on
`https://brightcert.co.uk`, on the redesigned report document merged the same
day. It does not exercise the Stripe webhook chain — see
[What this run does not cover](#what-this-run-does-not-cover).

---

## Environment

| Item | Value |
|---|---|
| Commit under test | `292263a` (merge of `claude/report-redesign-wiring`) |
| Vercel deployment | `dpl_2UYyGxx8LXfLaQYp1cWewma82jSs` (`brightcert-1gqw0cx65`) |
| Deployment state | Production, Ready, 46 s build, created 4 August 2026 20:59 BST |
| Aliases | `brightcert.co.uk`, `www.brightcert.co.uk`, `brightcert.vercel.app`, `brightcert-git-main-…` |
| Stripe | **Not involved.** No checkout, no charge, no test-mode override |
| Supabase | Production |
| GCS | Production bucket `brightcert-reports` |
| Subject assessment | `182d5f7f-0202-40dc-ad23-7a78229724ec`, score 63, `analysisVersion` 1 |

Production Supabase held 8 assessments at the time of the run, all founder-owned
from June–July, and **zero real customer records**. That is what makes a
production write defensible here; re-establish it before repeating this.

---

## Why this method

`vercel env ls` shows the Preview environment carries only `INTERNAL_API_SECRET`
and `CRON_SECRET` — no Stripe, Supabase or GCS credentials. The preview-based
approach proposed by the 3 August deviation section therefore was not available
without provisioning roughly fifteen secrets into Preview.

`POST /api/reports/generate` accepts a shared-secret header for its two trusted
server-to-server callers (`src/app/api/reports/generate/route.ts:24-32`). That
provides a £0 path to the identical render, upload and signing code on the real
Vercel runtime, bypassing only the Stripe trigger.

---

## Step 1 — deployment is the merge commit, not a stale serve

`vercel inspect` carries no git SHA, so deploy timing alone would not rule out a
stale alias. The merge added `public/fonts/*`, which existed in no prior deploy,
so those assets are a decisive marker.

| Font | Live on `brightcert.co.uk` | Local at `292263a` |
|---|---|---|
| `Inter-Regular.woff` | 200, 30,696 B | 30,696 B |
| `Inter-SemiBold.woff` | 200, 31,260 B | 31,260 B |
| `BricolageGrotesque-Regular.woff` | 200, 27,264 B | 27,264 B |
| `BricolageGrotesque-SemiBold.woff` | 200, 27,256 B | 27,256 B |
| `JetBrainsMono-Regular.woff` | 200, 27,496 B | 27,496 B |
| `JetBrainsMono-Bold.woff` | 200, 28,208 B | 28,208 B |

Root and `/pricing` both returned 200.

---

## Step 2 — render through the deployed function

```text
UPDATE assessments SET status='paid'  -- temporary, see cleanup
  -> BEFORE: analysed
  -> existing reports rows for this assessment: 0

POST https://brightcert.co.uk/api/reports/generate
  header x-internal-secret: <INTERNAL_API_SECRET>
  body   { "assessmentId": "182d5f7f-…" }

  HTTP 200 in 14.5 s
  signed URL host storage.googleapis.com
  signed URL path /brightcert-reports/reports/182d5f7f-….pdf
```

The status flip was required because the 3 August refund test left the
assessment at `analysed`, and the route rejects anything not `paid` with 403
(`route.ts:48-50`).

---

## Step 3 — the artifact

```text
download            HTTP 200, 3,860,209 bytes, application/pdf
header              %PDF-1.3
trailer             %%EOF present
pages               24
embedded subsets    5  (Inter-Regular, Inter-SemiBold,
                        BricolageGrotesque-SemiBold,
                        JetBrainsMono-Regular, JetBrainsMono-Bold)
base-14 referenced  Helvetica, Helvetica-Bold
```

**This is the result the run existed to obtain.** Five embedded `/FontFile2`
streams prove the serverless function read the typefaces off disk from
`process.cwd()/public/fonts` at render time. That is the failure mode
`next.config.ts` guards against — silent at build time, total at runtime — and
it is now observed working rather than inferred from the file trace.

### Content equivalence

`pdftotext -layout` against the locally rendered preview of the same assessment:

```text
diff local.txt deployed.txt  ->  104 lines, every one a date
  <  3 AUGUST 2026     (local preview, rendered 3 Aug)
  >  4 AUGUST 2026     (deployed render, rendered 4 Aug)
```

No other textual difference. Page 1 renders the headline, `63 / 100 Nearly
Ready`, the metric strip, and the certification disclaimer.

The 60,696-byte size difference against the local preview (3,920,905 vs
3,860,209) is font-subset and compression variance, not a content difference.

---

## Step 4 — cleanup, state restored

| Action | Result |
|---|---|
| `reports` rows created by one trigger | 1 (`0bf024c4-…`) — no race, single caller |
| Deleted that row | 0 rows remain for the assessment |
| GCS object `reports/182d5f7f-….pdf` | existed, 3,860,209 B — deleted |
| Assessment status | restored `paid` → `analysed` |

Post-run state matches pre-run exactly: 8 assessments, 0 `paid`, 1 `reports` row
(`435be284-…`, from 30 June).

Four pre-existing orphaned GCS objects remain untouched, unchanged from the
3 August finding:

```text
reports/391f2022-….pdf  225,595 B  2026-07-26
reports/40d43386-….pdf  223,658 B  2026-07-26
reports/527184e7-….pdf  191,484 B  2026-07-26   <- no matching assessment row
reports/78c383b1-….pdf   38,546 B  2026-06-30
```

---

## External state changed by this run

- **Database:** two writes to `assessments.status` (set then restored) and one
  `reports` insert (by the route) then delete. Net zero.
- **GCS:** one object written (by the route) then deleted. Net zero.
- **Email:** one report-ready email sent to the assessment owner's address —
  the founder's own account — by the route's fire-and-forget call
  (`route.ts:121-138`). Not suppressible from the caller side.
- **Payments:** none. No Stripe object of any kind was created.

---

## What this run does not cover

1. **The Stripe webhook → generate chain on the deployed build.** This run
   invoked the route directly. The webhook path is unchanged by the redesign,
   and was exercised on 3 August against `next dev`, but the two have never been
   verified together on Vercel.
2. **The triple-generation race.** One caller produced one row, as expected. The
   race needs concurrent callers and remains unfixed — see finding 1 of the
   3 August record.
3. **Cold start under real purchase load.** 14.5 s against `maxDuration = 60`
   leaves headroom, but that was a single warm-ish invocation, not a measured
   distribution.

### Note on the 14.5 s render

The local render of the same assessment measured 3.2–5.6 s. The deployed
invocation took 14.5 s wall-clock including cold start, upload and signing.
Well inside the 60 s ceiling, but roughly a quarter of it, and the document is
now ~15× larger than the one those earlier numbers were taken from.

> **Correction, later on 4 August.** This document originally proposed font
> subsetting as the fix for that size, and that was wrong. The font programs in
> this 3,860,209-byte PDF total **1,211 bytes**. 96.8% of the file is images:
> 72 image objects that are only three distinct payloads, each embedded once per
> page, dominated by the 512px header logo at 147,028 B × 24 pages = 3.53 MB.
> `@react-pdf` cannot share an image across pages, so the fix is a smaller
> asset, not subsetting. Addressed on `claude/pdf-size-and-race`
> (`1d0ade6`): 12.6× smaller with byte-identical extracted text.
