# 30-day founding-customer operator calendar

`T0` is the first Monday after every item in
[LAUNCH-GATE.md](./LAUNCH-GATE.md) has passed. Do not put a fixed date in the
campaign until that condition is true. The ten internal/friendly seed sends
before T0 are a ceiling and are not part of the 150 verified prospect target.

The target is 150 distinct, verified corporate prospects receiving Touch 1:
120 SME and 30 MSP. Later touches remain part of daily send volume but do not
create a new prospect in the 150 denominator. Never compress the 12- or
14-business-day cadence to finish by Day 30; late cohorts may complete their
follow-ups afterwards.

## Volume rules

- Start at 10–15 total prospect messages per business day.
- Cap all new touches plus follow-ups at 20/day until the first 50 prospect
  sends have healthy evidence.
- After the 50-send review passes, the owner may raise the cap to 30/day.
- Provider ceilings do not change these operating caps.
- Pause immediately for hard bounces over 3%, any spam complaint, or any
  provider/domain warning.
- Reply, objection, bounce, conversion, or closure removes every later touch.

## Day 1–3 setup

| Day | Work | Exit evidence |
|---|---|---|
| Day 1 | Freeze campaign slug, `sme-v1`/`msp-v1`, 120/30 list plan, LIA, privacy wording, source rules, UTM convention, and scorecard | Owner records the approved versions; no external send |
| Day 2 | Run up to ten internal/friendly seed sends; check From/Reply-To, plain-text rendering, links, SPF/DKIM/DMARC, inbox replies, and provider/domain warnings | Seed evidence is healthy or campaign pauses |
| Day 3 | Validate private list, load suppression/event stores, run exact Companies House verification, review first control prospect, rehearse opt-out and report commands | One-prospect control-path signed; every launch gate still current |

If all gates passed before Day 1 and the Day 1–3 checks remain healthy, external
Touch 1 sending begins with the next available business-day batch. If not, T0
moves; do not borrow days from setup.

## Week 1: control and first 25

Goals:

- manually send 10–15 total messages/day;
- reach 25 cumulative verified Touch 1 prospects, weighted 20 SME / 5 MSP;
- preserve the 120/30 ratio in each research batch where practical;
- collect delivery evidence and verbatim objections in protected notes; and
- change no copy or targeting variable before the 25-send checkpoint unless a
  safety issue requires it.

At 25 Touch 1 sends, review:

- company/role/trigger accuracy;
- hard bounces, spam complaints, domain/provider warnings, and opt-out handling;
- positive, neutral, objection, and lost reasons;
- reply quality by SME/MSP and trigger; and
- whether the free baseline and one-client MSP pilot are understood.

Pause under [SOP.md](./SOP.md) if any safety threshold fires. If delivery is
healthy but relevance is weak, continue only with an approved targeting or
message adjustment, changing one variable.

## Week 2: reach and review the first 50

Continue at 10–15/day, never above 20 total messages/day. SME Touch 2 becomes
due on business day 6 after each SME Touch 1; MSP Touch 2 becomes due on
business day 7. Due follow-ups take priority over new Touch 1 slots.

Reach 50 cumulative verified Touch 1 prospects, weighted 40 SME / 10 MSP, then
hold the next new batch for the 50-send health review:

- delivery denominator and hard-bounce rate are reconciled;
- no spam complaint or unresolved provider/domain warning exists;
- every reply/opt-out stopped later touches;
- sources, company checks, and queue evidence remain current;
- objections and positive replies are reviewed verbatim;
- call booking and baseline hand-off are workable; and
- no message, price, certification, timing, or privacy claim drift is present.

Only recorded owner approval can raise the total daily cap from 20 to 30.
A healthy checkpoint permits a higher ceiling; it does not require higher
volume.

## Week 3: calls, baselines, and one-variable tests

Target 90 cumulative verified Touch 1 prospects, weighted 72 SME / 18 MSP,
while honouring due follow-ups and the approved total daily cap.

- Reply personally to positive responses the same business day where possible.
- Book 20-minute calls manually; do not invent or publish a booking URL.
- Run guided baselines and reviewed action plans for qualified prospects.
- For MSPs, keep the pilot to one suitable corporate SME client.
- Record `booked`, `baseline_completed`, and `checkout_started` only from
  observed evidence.
- Preserve verbatim objections in protected notes and code an approved lost
  reason for review.

Run at most one experiment at a time. Examples:

1. trigger-specific Touch 1 subject within one segment;
2. one opening-line formulation for the same trigger strength; or
3. SME versus MSP offer wording only within its own segment.

Keep audience, trigger strength, body, CTA, cadence, and volume constant when
testing a subject. Increment `template_version` and `utm_content` so the change
is attributable. Do not declare a winner from opens; use positive reply and
downstream evidence.

## Week 4: winner focus and complete the 150

Focus research and available send slots on the best evidenced combination of
segment, trigger, and copy version, while preserving the final 120 SME / 30 MSP
mix. Do not lower the ICP to hit the number.

The remaining verified Touch 1 milestones are:

| Cumulative target | SME | MSP |
|---:|---:|---:|
| 120 | 96 | 24 |
| 150 | 120 | 30 |

Use up to the owner-approved cap, counting due follow-ups first. Continue calls,
baselines, founder support, payment reconciliation, and same-day response
handling. A prospect is `paid` only when Stripe and application entitlement
agree.

## Day 30 decision

Generate the weekly report and complete [SCORECARD.md](./SCORECARD.md). Review:

- verified Touch 1 total and exact 120/30 mix;
- 15 positive replies, 8 booked calls, 5 completed baselines, and 3 verified
  paid customers as the campaign success targets;
- positive reply rate and baseline-to-paid conversion against the decision
  rules;
- delivery, complaints, objections, opt-outs, and lost reasons;
- results by segment, trigger, campaign, and template version;
- revenue truth from Stripe plus application entitlement; and
- outstanding late-cohort follow-ups and retention dates.

Choose one recorded decision:

- **continue winner:** gates remain healthy and evidence supports the current
  segment/trigger/message;
- **revise targeting:** delivery is healthy but relevance or positive replies
  are below the approved rule;
- **revise message/offer:** the right contacts reply but misunderstand or reject
  the proposition;
- **revise onboarding:** positive replies/calls do not become completed
  baselines or verified paid customers; or
- **pause/stop:** safety, legal, provider, data, or product evidence is not
  adequate.

Do not extend volume or alter multiple variables merely to reach the target.
Assign an owner and review date to the decision, complete late follow-ups at
their original cadence, then run the retention schedule in
[DATA-FLOW-AND-RETENTION.md](./DATA-FLOW-AND-RETENTION.md).
