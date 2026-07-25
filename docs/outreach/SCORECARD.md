# Founding-customer scorecard

The campaign target is 150 distinct verified Touch 1 sends: 120 SME and 30 MSP.
Follow-ups are outcomes for the same prospects, not extra prospects in that
denominator. Open rate is excluded because the campaign does not use open
tracking.

Generate the canonical weekly CSV with:

```sh
npm run outreach -- report \
  --events .outreach/events.csv \
  --output outreach/runs/weekly-funnel.csv
```

The report groups by week, campaign, segment, trigger, and template version and
deduplicates each prospect within an event type/week. See the event rules in the
[operator runbook](./operator-runbook.md).

## Funnel definitions

| Status | Count only when |
|---|---|
| `sent` | A reviewed manual message was actually sent from the founder inbox; use distinct verified Touch 1 recipients for the 150 campaign denominator |
| `delivered` | Provider/inbox evidence shows delivery and no hard bounce; absence of a bounce alone is not an open |
| `bounced` | A hard bounce is observed; suppress the address the same day and stop the sequence |
| `positive` | A human reply expresses relevant interest in the baseline, pilot, details, or a conversation |
| `neutral` | A human reply is neither interest nor rejection, such as a referral or timing note without intent |
| `objection` | A human reply gives a substantive concern or negative response; it stops the sequence even if it is not an opt-out |
| `opt-out` | The person or company asks not to receive marketing, by any clear wording; record the CLI event as `opt_out` and suppress immediately |
| `booked` | A 20-minute call is mutually agreed and placed in the founder's calendar |
| `baseline completed` | The guided baseline is completed far enough to produce the reviewed action plan; starting is insufficient |
| `checkout started` | A live checkout session is created/entered for the relevant assessment; it is not revenue |
| `paid` | Successful live Stripe payment and matching application entitlement both exist after reconciliation |
| `refunded` | Stripe shows a completed/recorded refund and application entitlement has been reviewed accordingly |
| `lost reason` | A terminal `lost` event has one approved reason in protected operator notes, such as no current need, timing, budget, existing solution, wrong fit, or no decision; never infer it from silence |

The CLI also supports `imported`, `eligible`, `queued`, generic `reply`,
`customer`, and `closed` operational events. Use `reply` when a response cannot
yet be classified, `customer` only after customer state exists, and `closed`
for an intentionally ended record that is not otherwise classified.

Any positive, neutral, objection, generic reply, opt-out, bounce, paid/customer,
lost, or closed event stops later queue attempts. Silence is not an event or a
lost reason.

## Success targets

| Outcome | Target |
|---|---:|
| Verified Touch 1 sends | 150 |
| SME / MSP mix | 120 / 30 |
| Positive replies | 15 |
| Booked calls | 8 |
| Completed baselines | 5 |
| Verified paid customers | 3 |

These are campaign targets, not historic results or promises.

## Formulas

Use distinct prospects in each relevant denominator:

```text
delivery rate = delivered / sent
hard-bounce rate = hard bounced / sent
positive reply rate = positive / sent
call booking rate = booked / positive
baseline completion rate = baseline completed / booked
completed-baseline-to-paid rate = verified paid / baseline completed
opt-out rate = opt-out / sent
verified gross paid revenue = sum of reconciled Stripe payments before refunds
verified net revenue = verified gross paid revenue - reconciled refunds
```

Show `n/a`, not zero, when the denominator is zero. Do not sum percentages
across weeks; recompute them from cumulative counts. The CLI report's
`paid_revenue` is operator-event data and does not become revenue truth until it
matches Stripe plus application entitlement.

## Decision rules

- Positive reply rate at or above 8% supports continuing the tested
  segment/trigger/message, subject to sample size and all safety gates.
- Completed-baseline-to-paid rate at or above 20% supports the current
  baseline-to-checkout path; interpret small denominators cautiously.
- Hard bounces over 3%, any spam complaint, or any provider/domain warning
  pauses all sending immediately.
- Any same-day opt-out failure, misleading claim, queue bypass, or data incident
  also pauses sending.
- Healthy delivery but positive replies below 8%: review ICP/trigger accuracy
  first, then test one message variable.
- Positive replies but weak booking: revise reply handling, call proposition,
  or scheduling process.
- Booked calls but weak baseline completion: revise onboarding, qualification,
  and founder hand-off.
- Completed baselines but paid conversion below 20%: review product value,
  evidence workflow, price understanding, checkout, and entitlement before
  increasing volume.

These rules guide an owner decision; they do not override legal, provider,
privacy, or launch gates.

## Required reporting splits

Review counts and rates by:

1. segment: `sme` / `msp`;
2. trigger label;
3. campaign slug; and
4. template/copy version.

Never combine copy versions when declaring a winner. Preserve the 120/30 total
mix and inspect whether one trigger is carrying the aggregate. Record complaint
counts from provider evidence beside, not inside, the CLI report because
`complaint` is not a supported event type.

## Weekly review template

Copy this table into a protected operator record. Use one row per exact
week/segment/trigger/campaign/template combination.

| Week start | Campaign | Segment | Trigger | Template | Sent | Delivered | Hard bounced | Positive | Neutral | Objection | Opt-out | Booked | Baseline completed | Checkout started | Verified paid | Refunded | Lost | Complaints |
|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `YYYY-MM-DD` | `founding_pilot_2026` | `sme` | `tender_requirement` | `sme-v1` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

Weekly review:

- [ ] Reconcile sent/delivery/bounce evidence with the founder inbox/provider.
- [ ] Reconcile every paid/refunded row with Stripe plus application
  entitlement using [SOP.md](./SOP.md).
- [ ] Calculate cumulative rates with explicit denominators.
- [ ] Review protected verbatim objections and approved lost reasons.
- [ ] Compare SME/MSP, triggers, campaigns, and copy versions.
- [ ] Check the 25/50-send checkpoints and daily volume cap.
- [ ] Record any one-variable test and avoid using opens.
- [ ] Choose continue, revise targeting, revise message, revise onboarding, or
  pause; name the owner and review date.
- [ ] Schedule rights, suppression, and retention actions.
