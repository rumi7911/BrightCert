# Submission demo video — script and shot list

A ~2 minute screen-recorded walkthrough for the XPRIZE submission, to sit
**alongside** the existing 20-second promo rather than replace it.

The promo sells. This demo does a different job: show the product working, and
make the two mandatory judging requirements — the **Gemini API** and **Google
Cloud Storage** — visible rather than implied. The July promo mentions neither.

Every figure below is real and verified. Nothing here needs the `hyperframes`
pipeline or Node 22.

---

## Before you record

| Check | Why |
|---|---|
| Sign in as **rumi ltd** | The 10 August assessment scoring 49% is the demo subject |
| Hide or blur the sidebar email (`cognumiltd@gma…`) | It is visible on the results page and does not belong in a public video |
| Browser at 1920×1080, no extensions bar, no other tabs | The current screenshots show three unrelated tabs |
| Close DevTools | Nothing should suggest a staged environment |
| Have the 24-page PDF downloaded and ready to scroll | Generating it live risks a 12-second dead pause |

**Claim discipline — these are project rules, not style preferences:**

- Never say "certify", "certification", or "we certify you". BrightCert is
  readiness preparation. The official certificate comes from an IASME-licensed
  Certification Body.
- If you say **£99**, you must say **"for the first 10 customers"** in the same
  breath. Simplest option: quote **£199** and skip the founding discount
  entirely.
- Do not mention Monitor, CE Plus Pack, or MSP Partner. They have no checkout
  and are not built.
- Do not read the official Cyber Essentials questionnaire verbatim on screen.

---

## Narration — generated, done

Six MP3s in [`narration/`](./narration/), generated with **ElevenLabs**
(`eleven_multilingual_v2`, voice *George*, British). Regenerate or change voice:

```sh
docs/submission/build-narration.sh                        # George, default
docs/submission/build-narration.sh IKne3meq5aSn9XLyUdCD   # Charlie
```

The script parses [`NARRATION.txt`](./NARRATION.txt), so the spoken words and the
written script cannot drift apart. Voice ids are listed in the script header.
It needs `ELEVENLABS_API_KEY` in `.env.local`; the key in use is scoped to
text-to-speech only and has no `voices_read` or `user_read` permission, so voice
ids must be hard-coded rather than looked up.

A macOS `say` version was built first and rejected — the system voices sound
synthetic in a way that undercuts the product.

**Measured durations. These are the recording targets.** Record each clip *at
least* this long: trailing screen time is trimmed when the audio is laid over
it, but a clip shorter than its narration cannot be fixed afterwards.

| Shot | Narration | Record at least |
|---|---:|---:|
| 1 — the problem | 25.1 s | 30 s |
| 2 — the assessment | 16.1 s | 20 s |
| 3 — **Gemini** | 32.9 s | 40 s |
| 4 — report and GCS | 22.3 s | 27 s |
| 5 — the boundary | 10.0 s | 13 s |
| 6 — close | 11.6 s | 15 s |
| **Total** | **1:58** | |

Record the screen **silently** — no voice, no system sound. Narration is laid
over afterwards, so a fluffed take costs one shot rather than the whole video.

---

## Shot list

Total target: **1:50 – 2:10**. Timings are guides, not marks to hit exactly.

### Shot 1 — the problem (0:00 – 0:18)

**On screen:** `brightcert.co.uk` homepage, slow scroll.

> Cyber Essentials is the UK government-backed security standard. For a small
> business it usually means either two weeks of paperwork, or two to five
> thousand pounds for a consultant.
>
> BrightCert is a readiness service. It gets a company prepared in about two
> hours — and to be clear up front, it doesn't issue the certificate. That comes
> from a licensed Certification Body. What BrightCert does is get you ready to
> pass.

*Why this opening:* it puts the disclaimer in the first twenty seconds instead
of burying it. A judge who hears an over-claim early distrusts everything after.

### Shot 2 — the assessment (0:18 – 0:38)

**On screen:** open an assessment, answer two or three questions, show the
progress indicator and the five control-area sections.

> The assessment is sixty plain-English questions across the five Cyber
> Essentials control areas — firewalls, secure configuration, user access,
> malware protection, and update management.
>
> No payment to start, and progress saves as you go.

*Do not* read questions verbatim — paraphrase, or scroll past.

### Shot 3 — Gemini does the analysis (0:38 – 1:05) ← **the important shot**

**On screen:** submit the assessment, then the results page loading into the
49% readiness ring.

> When you submit, the answers go to Google's Gemini API — `gemini-2.5-flash`.
> Gemini scores each of the five control areas, writes the gap analysis in plain
> English, and produces a prioritised remediation plan.
>
> This is a real assessment. Forty-nine per cent. Firewalls at fifteen, secure
> configuration at forty-five, user access at seventy-five. Eleven issues to
> fix, each with a specific next step — and none of that text is templated.
> Gemini wrote it from these answers.

**Linger here.** Scroll the per-control-area breakdown slowly. This shot is the
entire reason the video exists — it is the only place a judge sees the mandatory
AI requirement actually doing work.

Say "Gemini" out loud. Do not say "AI" or "the model".

### Shot 4 — the report and Google Cloud (1:05 – 1:35)

**On screen:** the unlock panel, then the downloaded 24-page PDF, scrolling
through the executive summary, a control-area page, and the remediation plan.

> Unlocking the full report is a one-off payment. The report itself is generated
> server-side and stored in Google Cloud Storage, then served through a signed,
> expiring URL — so the file is never public.
>
> Twenty-four pages: executive summary, every control area scored, and a
> prioritised remediation plan the business can hand to whoever does the work.

*Optional, only if you want the engineering detail:* the report renders in about
twelve seconds and lands at roughly three hundred kilobytes. Generation is
single-flight, so three simultaneous requests produce exactly one render.

### Shot 5 — the honest boundary (1:35 – 1:50)

**On screen:** the results-page disclaimer panel — "Readiness assessment — not
official certification".

> That boundary is stated in the product, in the report, and in every email.
> BrightCert prepares you. An IASME-licensed Certification Body certifies you.

*Why this earns its place:* voluntarily naming what the product does **not** do
reads as credibility, not weakness — particularly in a compliance product where
over-claiming is the obvious failure mode.

### Shot 6 — close (1:50 – 2:00)

**On screen:** homepage, or the BrightCert mark.

> BrightCert. Built on the Gemini API and Google Cloud, for UK small businesses
> that need Cyber Essentials without the two-week detour.
>
> brightcert.co.uk

---

## The facts quoted above, and where they come from

| Claim | Source |
|---|---|
| Gemini `gemini-2.5-flash` | `src/lib/gemini/client.ts:16` |
| 60 questions, 5 control areas | Verified question count; `CLAUDE.md` names the five areas |
| 49%, control areas 15/45/75/65/45, 11 issues | Assessment `6e262696`, submitted 10 Aug 2026 22:04 |
| Gemini writes gaps and remediation | 5 `control_scores` rows, 4–5 gaps and 3 remediation steps each |
| Report stored in Google Cloud Storage, signed URL | `PDF-SIZE-RACE-VERIFICATION-2026-08-06.md` |
| 24 pages, ~308 KB, ~12 s | Same, measured on the deployed build |
| Single-flight generation | Same — three concurrent callers, one render |
| £199 one-off | `checkout/route.ts` inline `price_data`, `unit_amount: 19900` |
| Not a Certification Body | Project rule; stated on the results page |

---

## What is deliberately not in this video

- **No customer numbers, testimonials, or traction claims.** There are none, and
  inventing them would be worse than omitting them.
- **No unbuilt tiers.**
- **No founding discount**, to avoid the cap-disclosure requirement in a medium
  where a caption is easy to miss.
- **No live payment.** The Stripe webhook chain has never run on a deployed
  build; do not demonstrate a purchase you have not tested.
