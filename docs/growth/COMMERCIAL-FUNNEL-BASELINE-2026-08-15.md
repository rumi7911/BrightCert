# Commercial funnel baseline — 15 August 2026

Read-only baseline taken after the owner confirmed the XPRIZE submission was
complete. The purpose is to decide whether BrightCert should prioritise
acquisition, assessment activation or paid conversion next.

Sources: production Supabase, live-mode Stripe and Resend. The audit performed
no write, send, refund, deployment or customer-state change. Counts are
sanitised; no email address, organisation name, Stripe identifier or assessment
identifier is recorded here.

---

## Headline

| Funnel evidence | Current value |
|---|---:|
| Auth users | 3 |
| Organisations | 5 |
| Assessments | 13 |
| Analysed assessments | 5 |
| Draft assessments | 8 |
| Genuine external users | **0** |
| Genuine external organisations | **0** |
| Genuine external assessments | **0** |
| Paid assessments | **0** |
| Live Stripe charges | **0** |
| Verified live revenue | **£0** |
| FOUNDING10 redemptions | **0** |

The owner confirmed on 15 August that all three auth users, all five
organisations and all 13 assessments are owner-controlled internal activity.
This includes every signup, completion, checkout and generated report. The
commercial baseline is therefore **zero genuine signups, zero genuine users,
zero genuine assessment starts or completions, zero customers and £0
revenue**. The raw system counts are product/test evidence only and must not be
used as market traction or conversion evidence.

## Assessment funnel

| Classification | Organisations | Profiles | Assessments | Status | Draft answer counts |
|---|---:|---:|---:|---|---|
| Owner-confirmed internal activity | 5 | 3 | 13 | 5 analysed, 8 draft | 0, 0, 0, 0, 0, 0, 4, 8 |
| Genuine external activity | 0 | 0 | 0 | None | None |

Within the internal activity:

- all three assessments reached 60 answers and `analysed`;
- all three have an unlock-reminder stamp;
- all three created at least one live Checkout Session;
- three assessments created 35 Checkout Sessions in aggregate; and
- none produced a paid session, charge or entitlement.

This is not evidence about external assessment completion or paid conversion.
There is no genuine-user sample from which to diagnose activation, pricing or
paywall copy. Acquisition of the first real prospect and user is the current
commercial bottleneck.

## Live Stripe truth

Window: 27 June to 15 August 2026. Credential mode was checked as `live` before
the query.

| Stripe evidence | Value |
|---|---:|
| Checkout Sessions | 42 |
| Unique assessment references | 5 |
| Expired sessions | 41 |
| Open sessions at audit time | 1 |
| Paid sessions | **0** |
| Successful charges | **0** |
| Gross / refunded / net revenue | **£0 / £0 / £0** |
| FOUNDING10 promotion records | 2 total, 1 active |
| FOUNDING10 redemptions | **0** |

Session volume is not customer volume. Idempotency is bucketed by assessment
and hour, so repeated visits across different hours create additional sessions.
The owner confirmed that every checkout attempt was internal. Thirty-five of
the 42 sessions belong to three internal assessments; five belong to another
internal assessment; two reference an assessment that is no longer present in
the current database result. The single open session at audit time was also
internal.

The single `reports` row is an internally generated report, not customer or
revenue evidence. No current assessment has the matching paid state and Stripe
fields required by the project's revenue-truth rule.

## Email and reminder evidence

Resend returned 58 emails since 27 June: 56 delivered and two bounced.

| Category | Sends | Unique recipients | Last-event result |
|---|---:|---:|---|
| Draft 24-hour reminder | 6 | 1 | 6 delivered |
| Draft 72-hour reminder | 4 | 1 | 4 delivered |
| Analysed/unlock reminder | 4 | 2 | 4 delivered |
| Report-ready notification | 11 | 3 | 10 delivered, 1 bounced |
| Historical MSP outreach | 22 | 22 | 21 delivered, 1 bounced |
| Sign-in link | 3 | 1 | 3 delivered |
| Other controlled/product emails | 8 | 6 | 8 delivered |

The historical MSP outreach used the subject `Cyber Essentials prep for
clients` on 18–21 July. It reached 22 distinct business-domain addresses. One
bounced, a message bounce rate of **4.5%**, which exceeds the campaign's 3%
pause threshold. Because the owner confirmed that every signup is internal,
the batch produced no genuine signup visible in the product funnel.

Resend does not provide inbox-reply truth here. The product and owner evidence
does establish that the old, unverified MSP batch produced no genuine product
signup, must not be presented as conversion evidence and should not be
repeated.

## Attribution gap

Zero of five organisations has a retained UTM source. The app deliberately
stores attribution only through the consent-aware path, so a blank value does
not prove there was no campaign touch. Since all five organisations are
internal, the database currently contains no genuine acquisition source to
attribute.

Future outbound links already need source lineage for compliance. They should
also use one consistent campaign/content convention, and the first-touch review
must check whether the resulting attribution appears before channel performance
is claimed.

## Decision

The next commercial move should be a small, verified **direct-SME** batch, not
more broad MSP volume and not a paywall redesign.

1. Treat all current product activity as internal and report the real funnel as
   zero genuine signups, users, assessment starts, completions and customers.
2. Independently verify the 11 public named SME/MSP addresses and enrich only
   the highest-priority missing direct-SME contacts.
3. Exclude the previous 22-address MSP method from reuse: it produced a 4.5%
   bounce rate and no directly attributable signup.
4. Send only a five-to-ten-row human-approved batch after customer, duplicate,
   suppression, LIA and trigger-to-role review.
5. Use one UTM convention on every email and founder LinkedIn link, then check
   source retention and the Stripe session trail after the batch.
6. Do not change price or paywall copy until genuine users or interviews
   provide evidence about activation or purchase objections.

## Product and operational follow-ups

- The live Stripe webhook → report-generation chain remains unverified
  end-to-end. A controlled real transaction is an owner decision because it
  creates fees and changes production state.
- Report retention and the orphaned GCS objects remain a separate GDPR/storage
  task.
- The exposed test Stripe key and ElevenLabs key still need owner-controlled
  rotation.
- GA4 events are consent-gated and were not available through a connected data
  source in this audit. No GA4 conversion rate is claimed.
- Reminder delivery is evidenced, but open/click tracking is not treated as a
  success metric. Assessment and payment state remain the conversion truth.

## Re-measurement checkpoint

Re-run this same baseline after the first five-to-ten verified direct-SME
touches and at least one genuine signup, or after seven calendar days,
whichever comes later. Compare:

- new auth users and organisations;
- assessments started, submitted and paid;
- source-attributed organisations;
- unique assessment references entering checkout;
- verified Stripe payments and FOUNDING10 redemptions; and
- hard bounces, objections and replies recorded in the campaign event store.
