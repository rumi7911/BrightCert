# Integrated signal sprint

## Authority and prerequisites

This playbook coordinates a controlled learning sprint. It does not authorise T0,
sending email, publishing or scheduling social content, changing the launch-gate
status, writing production data, or deploying.

Before any live activity, follow the existing
[launch gate](./LAUNCH-GATE.md), [SOP](./SOP.md), [ICP](./ICP.md),
[approved email sequences](./EMAIL-SEQUENCES.md),
[operator runbook](./operator-runbook.md), and [scorecard](./SCORECARD.md).
The [social sprint overlay](../social/sprints/2026-07-30-integrated-signal-sprint.md)
governs only the relative publishing plan. Every launch-gate row must pass, the
go/no-go record must be complete, no pause or incident may be active, and the
owner must set T0.

## Cohort

The first cohort contains exactly 24 direct SMEs and 6 MSPs, for 30 distinct
Touch 1 prospects. This preserves the approved 120/30 campaign ratio.

Every prospect must pass the existing ICP, source, trigger, lawful-basis,
Companies House, corporate-email, suppression, customer, sequence-state, and
human-review controls. Replace a blocked row only with an eligible row from the
same segment.

## Trigger mapping

| Approved trigger | Content theme |
|---|---|
| `tender_requirement` | `requirement_urgency` |
| `customer_assurance` | `requirement_urgency` |
| `supply_chain` | `requirement_urgency` |
| `renewal` | `readiness_before_certification` |
| `msp_client_service` | `evidence_before_action` |

The mapping selects a public education theme. It never changes prospect
eligibility, email copy, sequence, or suppression status.

## Private alignment file

The tracked fictitious example is
`outreach/templates/signal-sprint-alignment.example.csv`. The live alignment
record must remain ignored and private at
`.outreach/signal-sprint-alignment.csv`, with file mode `600`.

Its exact CSV header is:

```csv
cohort_id,prospect_id,content_theme,content_item_id,content_published_at,linkedin_engagement_status,linkedin_engagement_at,first_touch_target_date,operator_notes
```

Record business-context only. Do not store private-life information, inferred
sensitive traits, scraped LinkedIn data, or unverified claims. The file is not an eligibility authority.
The canonical prospect record, suppression store, event history, queue checks,
and current Companies House result remain authoritative.

The alignment file records planning and manual engagement status. It does not
prove a prospect saw a post, and aggregate post metrics cannot establish named
account exposure.

## Ten-business-day first-touch window

The relative schedule in the
[social sprint overlay](../social/sprints/2026-07-30-integrated-signal-sprint.md)
is authoritative for publishing order. The existing 25/50 checkpoints, pause
rules, and daily aggregate caps remain authoritative for sending. Due
follow-ups consume the existing daily cap before new Touch 1 rows.

All 30 Touch 1 prospects should be processed within ten business days only when
the existing controls permit it. SME follow-ups retain the approved day-6 and
day-12 cadence. MSP follow-ups retain the approved day-7 and day-14 cadence.
A delayed or blocked social item never creates extra email capacity.

## Manual LinkedIn rules

LinkedIn activity is manual, educational, and non-invasive. Never:

- scrape LinkedIn or automate engagement;
- leave generic familiarity comments;
- name a prospect or describe prospect-specific research publicly;
- claim that a profile view or post view occurred;
- infer private or sensitive information; or
- send an unsolicited LinkedIn pitch.

The founder may engage only where there is a substantive public contribution.
No connection, view, reaction, or comment is required for email eligibility.

## Learning gate

A relevant reply is a human response about the Cyber Essentials need, its
timing, the BrightCert offer, or the proposed next step. Automated replies,
out-of-office messages, bounces, opt-outs, and bare unsubscribe responses do
not count.

Before releasing another cohort, require:

- at least two relevant human replies; and
- at least one booked conversation or assessment start.

The gate supplements, but does not replace, the safety controls, 25/50
checkpoints, or the 8% positive-reply rule. A substantive objection may inform
message learning but is not a positive reply and still stops the sequence.

## Decision

At the gate, record one decision:

- `continue`;
- `revise targeting`; or
- `pause`.

Never increase volume to rescue a missed gate. A missed gate pauses the next
cohort for trigger and account-selection review.

## Measurement

The existing outreach event report remains the funnel source of truth. Treat
completed readiness baselines and reconciled paid customers as the primary
outcomes. Join the private `cohort_id` locally by `prospect_id`; do not change
the canonical prospect or event schemas for this sprint.

Review aggregate social metrics after 72 hours and seven days using the
existing social metrics file. These metrics are directional support signals,
not named-account attribution. Aggregate social metrics do not prove a named
account saw a post.
