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
| Paid assessments | **0** |
| Live Stripe charges | **0** |
| Verified live revenue | **£0** |
| FOUNDING10 redemptions | **0** |

The raw assessment count overstates market activity. Ten assessments belong to
known founder/demo-classified organisations: two analysed and eight drafts.
The remaining three analysed assessments belong to two non-founder-classified
accounts. All three contain 60 answers and reached checkout, but neither the
database nor Stripe records a payment.

The two non-founder accounts must be classified by the owner before they are
described as genuine prospects or customers. Their checkout activity clusters
around project rehearsal and submission dates, so treating them as organic
users without that confirmation would be unsafe.

## Assessment funnel

| Classification | Organisations | Profiles | Assessments | Status | Draft answer counts |
|---|---:|---:|---:|---|---|
| Known founder/demo | 2 | 1 | 10 | 2 analysed, 8 draft | 0, 0, 0, 0, 0, 0, 4, 8 |
| Non-founder-classified | 2 | 2 | 3 | 3 analysed | None |
| Orphan/fixture | 1 | 0 | 0 | None | None |

For the two non-founder-classified users:

- all three assessments reached 60 answers and `analysed`;
- all three have an unlock-reminder stamp;
- all three created at least one live Checkout Session;
- the three assessments created 35 Checkout Sessions in aggregate; and
- none produced a paid session, charge or entitlement.

This is not evidence that assessment completion is the current bottleneck.
Among the only possibly external activity, completion is strong and payment is
absent. The sample is too small and too operationally contaminated to conclude
that price or paywall copy is the cause.

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
Thirty-five of the 42 sessions belong to the three non-founder-classified
assessments; five belong to one known demo assessment; two reference an
assessment that is no longer present in the current database result.

The single `reports` row is not revenue evidence. No current assessment has the
matching paid state and Stripe fields required by the project's revenue-truth
rule.

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
pause threshold. No campaign-recipient address matches either of the two
non-founder auth-user addresses.

That exact-address comparison does not rule out a forwarded message, a signup
under a different address or an inbox reply. Resend does not provide reply
truth here. It does establish that the old, unverified MSP batch must not be
used as evidence of a direct signup conversion and should not be repeated.

## Attribution gap

Zero of five organisations has a retained UTM source. The app deliberately
stores attribution only through the consent-aware path, so a blank value does
not prove there was no campaign touch. It does mean the current database cannot
answer which channel produced either non-founder account.

Future outbound links already need source lineage for compliance. They should
also use one consistent campaign/content convention, and the first-touch review
must check whether the resulting attribution appears before channel performance
is claimed.

## Decision

The next commercial move should be a small, verified **direct-SME** batch, not
more broad MSP volume and not a paywall redesign.

1. Owner classifies the two non-founder accounts as genuine users, friendly
   testers or project collaborators.
2. Independently verify the 11 public named SME/MSP addresses and enrich only
   the highest-priority missing direct-SME contacts.
3. Exclude the previous 22-address MSP method from reuse: it produced a 4.5%
   bounce rate and no directly attributable signup.
4. Send only a five-to-ten-row human-approved batch after customer, duplicate,
   suppression, LIA and trigger-to-role review.
5. Use one UTM convention on every email and founder LinkedIn link, then check
   source retention and the Stripe session trail after the batch.
6. Do not change price or paywall copy until a small number of confirmed real
   users or interviews provides evidence for the objection.

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
touches, or after seven calendar days, whichever comes later. Compare:

- new auth users and organisations;
- assessments started, submitted and paid;
- source-attributed organisations;
- unique assessment references entering checkout;
- verified Stripe payments and FOUNDING10 redemptions; and
- hard bounces, objections and replies recorded in the campaign event store.
