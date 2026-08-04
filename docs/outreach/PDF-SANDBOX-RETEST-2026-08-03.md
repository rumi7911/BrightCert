# PDF/report sandbox retest — 3 August 2026

Closes the outstanding half of the **PDF/report** launch-gate row: repeating one
sandbox paid PDF generation/download plus locked unpaid and refunded access
checks, against the code carrying Codex's renderer repair.

Run by Claude Code (setup, server-side verification, cleanup) and Muhammad
Sohaib Roomi (browser: login, checkout, refund, visual confirmation).

Commit under test: `a1afe13` — identical to `origin/main` and to the live
production deployment `brightcert-g6znupt9a` at the time of the run.

**Read the [Deviation](#deviation-from-the-row-as-written) section before
treating this as a production verification.** The lifecycle ran against a local
production-equivalent code path, not against the deployed Vercel build.

> **Update, 4 August 2026:** the render half of that deviation is closed against
> the deployed build — see
> [`PDF-DEPLOYED-VERIFICATION-2026-08-04.md`](./PDF-DEPLOYED-VERIFICATION-2026-08-04.md).
> The document this file tested has since been replaced by the redesigned report
> at `292263a`; the Stripe webhook → generate chain remains verified only
> locally.

---

## Environment

| Item | Value |
|---|---|
| Stripe mode | test (`GET /v1/balance` returned `livemode: false`) |
| Stripe key source | founder-supplied `sk_test_…`; **never committed or printed to a file in the repo** |
| Webhook delivery | `stripe listen --forward-to localhost:3000/api/stripe/webhook`, secret `whsec_09965bd2…` |
| App | `next dev` (Next.js 16.2.12, Turbopack), Node 20.20.2 |
| Config isolation | `.env.development.local` (mode `600`, matched by `.gitignore:34`), deleted after the run |
| Supabase | production project — the same one the live site uses |
| GCS | production bucket `brightcert-reports` |
| Email | suppressed by design (`RESEND_API_KEY` blank) |

`.env.development.local` was used because Next.js resolves it ahead of
`.env.local` in development (`node_modules/next/dist/docs/01-app/02-guides/environment-variables.md:268`).
The live keys in `.env.local` were never edited, so there was nothing to
restore. The dev server confirmed the override on boot:
`Environments: .env.development.local, .env.local`.

Fixtures were pre-existing assessments belonging to org `Sohaib`
(`d8fbffe2-…`). No new org, user or assessment was created. At the time of the
run the production database contained **zero** assessments in `paid` status and
no real customer records.

---

## 1. Unpaid access is locked

Assessment `391f2022-7ad9-462b-b670-79e6e612ffc5` (`status = analysed`), never
paid at any point in this run.

| Check | Request | Result |
|---|---|---|
| Trusted internal caller cannot generate a PDF for an unpaid assessment | `POST /api/reports/generate` with a valid `x-internal-secret` | **403** `{"error":"Assessment not paid"}` |
| Anonymous caller cannot generate a PDF | `POST /api/reports/generate`, no secret, no session | **401** `{"error":"Unauthorized"}` |
| Anonymous visitor cannot reach the report page | `GET /assessment/391f2022-…/report` | **307** → `/signup?next=%2Fassessment%2F391f2022-…%2Freport` |
| Signed-in owner cannot reach the report page | browser, logged in as the owning account | redirected to the `/results` paywall (owner-observed) |

The first row is the strongest of the four: the internal secret is the most
privileged path into that route, and the paywall still holds. Access control is
enforced at the generation route, not only by a UI redirect.

## 2. Paid generation and download

Assessment `182d5f7f-0202-40dc-ad23-7a78229724ec`, org `Sohaib`, score 63.

Real Stripe Checkout completed in the browser with test card `4242…`, £199.00
GBP.

Webhook deliveries (all `[200]`):

```
21:30:19  payment_intent.created         evt_3U0SV3LgYuMz5C742xhTnSJB
21:30:19  payment_intent.succeeded       evt_3U0SV3LgYuMz5C742j38TXkN
21:30:19  checkout.session.completed     evt_1U0SV5LgYuMz5C749uabwkBR
21:30:20  charge.succeeded               evt_3U0SV3LgYuMz5C74219gTSts
21:30:22  charge.updated                 evt_3U0SV3LgYuMz5C7420dYBAPG
```

The assessment flipped to `status = paid` with `stripe_session_id`,
`amount_paid`, `currency` and `paid_at` populated, and the report page moved
from the "Generating PDF…" state to a live **Download PDF** button.

The generated object was fetched directly from GCS via its signed URL and
inspected independently of the UI:

| Property | Observed |
|---|---|
| HTTP | 200 |
| Size | 250,964 bytes |
| Header / trailer | `%PDF-1.3` … `%%EOF` present |
| Pages | 14 |
| Cover | "Cyber Essentials Readiness Report", `Sohaib · Generated 3 August 2026` |
| Score | `63%` / "Nearly Ready" |
| Control areas | all five present and correctly named — Boundary Firewalls & Internet Gateways 45%, Secure Configuration 65%, User Access Control 75%, Malware Protection 60%, Security Update Management 70% |
| Certification disclaimer | present on page 1 — "Readiness assessment — not official certification … BrightCert does not issue official Cyber Essentials certification" |
| Footer | `BrightCert Readiness Report — Sohaib — 3 August 2026`, `Page 1 of 14` |
| Priority action plan | present from page 2, P1 items rendered as discrete unsplit cards |

Pages 1 and 2 were rendered and visually inspected. No clipping, no overlap, no
card fragmentation — consistent with the four defects Codex repaired.

## 3. Refund revokes entitlement

Full refund issued from the Stripe test dashboard.

Webhook deliveries (all `[200]`):

```
21:35:15  refund.created                 evt_3U0SV3LgYuMz5C742xgz91Zd
21:35:15  charge.refunded                evt_3U0SV3LgYuMz5C742Y4s1J7A
21:35:16  charge.refund.updated          evt_3U0SV3LgYuMz5C742frXdrqX
21:35:19  refund.updated                 evt_3U0SV3LgYuMz5C742D13gV1f
```

Post-refund database state, read directly:

```json
{ "status": "analysed", "stripe_session_id": null, "amount_paid": null,
  "currency": null, "paid_at": null,
  "reminder_sent_at": "2026-08-03T20:35:16.469+00:00" }
```

The owner reloaded the report page and was returned to the unpaid state
prompting payment to unlock — confirming the revoke in the UI, not only in the
database.

---

## Deviation from the row as written

The launch-gate row asked for this lifecycle **"on the deployed build"**. It was
run against `next dev` on the same commit instead.

This is a deliberate deviation, not an oversight. A sandbox test cannot be run
against production without pointing the live deployment's environment at
test-mode Stripe keys, which would take real checkout offline for the duration.

What the deviation does **not** put at risk:

- The renderer itself. Fonts are fetched from a remote CDN at render time
  (`src/lib/pdf/ReportDocument.tsx:16-32`), not bundled, so font resolution is
  identical in dev and production — there is no bundling difference to mask a
  defect.
- `@react-pdf/renderer` is dynamically imported in both modes
  (`src/app/api/reports/generate/route.ts:105`).
- Stripe, Supabase and GCS were the real production services in both cases.

What remains genuinely untested on Vercel:

- Cold-start behaviour and the `maxDuration = 60` ceiling on the generate route,
  against a render measured locally at 3.2–5.6 s.
- Outbound network from the serverless function to the jsdelivr font CDN.

**To close this gap fully**, run the same three sections against a Vercel
preview deployment configured with test-mode Stripe keys, with
`stripe listen --forward-to <preview-url>`. That exercises the real serverless
runtime without touching production checkout.

### Closed, 4 August 2026 — by a different route

The preview approach above turned out not to be available: `vercel env ls` shows
the Preview environment carries only `INTERNAL_API_SECRET` and `CRON_SECRET`, so
a preview deployment has no Stripe, Supabase or GCS credentials to run against.

The render half of the gap was closed instead by invoking the deployed
production function directly through its shared-secret caller path, on the
redesigned document at `292263a`. See
[`PDF-DEPLOYED-VERIFICATION-2026-08-04.md`](./PDF-DEPLOYED-VERIFICATION-2026-08-04.md).

Both bullets under "what remains genuinely untested on Vercel" are now resolved,
though the second is resolved by removal rather than by test: the redesign
embeds the six typefaces from `public/fonts`, so there is no longer any outbound
call to the jsdelivr CDN at render time. Cold-start behaviour was measured at
14.5 s against the `maxDuration = 60` ceiling.

What is still untested on Vercel after 4 August is the **Stripe webhook →
generate chain** end to end, because that run bypassed Stripe entirely.

---

## Findings raised by this run

None of these block the row; all were discovered while verifying it.

### 1. The PDF is generated three times per purchase

Three `POST /api/reports/generate` calls returned `200` within 1.5 seconds
(3.3 s, 5.6 s and 3.2 s of render), producing three `reports` rows and three
uploads to the same GCS path.

The "does a report already exist?" guard
(`src/app/api/reports/generate/route.ts:56-66`) reads before any concurrent
insert has landed, so all three callers pass it — a check-then-act race. The
callers are the Stripe webhook, the report page's own fire-and-forget trigger,
and the poller-driven reload.

Impact is cost and noise rather than correctness: all three wrote identical
content to the same deterministic object path, so the customer receives the
correct PDF. But every sale currently costs three concurrent renders against a
60-second serverless ceiling, plus duplicate rows.

The route comment already says duplicates are tolerated; this records how many
actually occur in practice.

### 2. PDF fonts are fetched from a third-party CDN at render time

`ReportDocument.tsx:16-32` registers four Inter weights from
`cdn.jsdelivr.net`. A jsdelivr outage, block or slow response sits directly in
the critical path of a paid deliverable, and combined with finding 1 that is
twelve external font requests per sale. Bundling the four `.woff` files locally
would remove the dependency.

### 3. GCS objects outlive their database rows

Before this run the bucket held four objects under `reports/` while the
`reports` table held one row — including PDFs for `391f2022` and `40d43386`,
both currently unpaid, and `527184e7` which has no matching assessment at all.
Nothing deletes a GCS object: not the refund handler, not report-row cleanup.

These are not reachable by a user (a signed URL is only minted by the report
page, which redirects when unpaid), so this is a retention and tidiness issue
rather than an access-control one. It does mean report content persists
indefinitely with no deletion path, which is worth a decision under UK GDPR
storage limitation.

Pre-existing objects were left untouched; only this run's own object was
deleted.

### 4. No download or delivery is logged

There is no download event anywhere in `src/`. If a customer charges back,
Stripe asks for evidence that digital goods were delivered — what was supplied,
when, and to whom. Logging assessment ID, user, timestamp and IP at
signed-URL issue would provide it.

Related and untested here: there is no immediate-supply consent at checkout,
which is the mechanism that extinguishes a consumer's statutory cancellation
right for digital content, and terms §4
(`src/app/(marketing)/terms/page.tsx:62`) currently promises only to "consider
refund requests in good faith". Neither is a defect — they are commercial
decisions for the owner, recorded here because they surfaced during this test.

---

## Cleanup

| Artifact | Action | Verified |
|---|---|---|
| 3 duplicate `reports` rows (`cb903e11…`, `190fcf31…`, `4bb99379…`) | deleted | read-back returned `[]` |
| GCS object `reports/182d5f7f-….pdf` (250,964 bytes) | deleted | `exists = false` on read-back |
| `.env.development.local` | deleted | absent |
| Local Stripe/PDF scratch files | deleted | `git status` clean apart from the pre-existing untracked `videos/` |
| 4 pre-existing GCS objects | **left untouched** | not this task's to remove |

Residual state change: `182d5f7f.reminder_sent_at` was overwritten by the refund
handler, moving from an earlier timestamp to `2026-08-03T20:35:16.469+00:00`.
Every analysed assessment already carried a value, so the practical effect is
nil, but the field is not byte-identical to its pre-test value and no attempt
was made to fabricate a restore.

The assessment is otherwise back to exactly its pre-test state: `analysed`,
with all four Stripe payment-evidence fields `null`.

## Credential note

The test-mode secret key was pasted into an assistant chat transcript during
setup. It is test mode, so no live funds are reachable with it, but it should be
rolled at <https://dashboard.stripe.com/test/apikeys>. No key was written to any
tracked file, and `git status` was confirmed clean after the run.
