# BrightCert integrated signal sprint design

**Status:** Approved in principle by Muhammad Sohaib Roomi on 30 July 2026

**Scope:** Campaign design only; no prospect contact, LinkedIn publishing, production writes, or changes to approved outreach copy

**Primary outcome:** Validate whether evidence-backed timing signals plus founder-led trust content can move qualified UK SMEs and MSPs into a BrightCert readiness baseline

## Background

BrightCert already has an approved, manually operated outreach system:

- a 120-SME / 30-MSP target mix;
- evidence-backed Cyber Essentials triggers;
- named corporate contacts and verified corporate-domain email;
- Companies House, suppression, lawful-basis, human-review, delivery-health,
  pause, and retention controls;
- approved `sme-v1` and `msp-v1` three-touch email sequences; and
- an append-only event funnel through baseline completion and payment.

The external GTM field-notes workbook supplied for review does not provide
prospects or audited benchmarks. Its useful contribution is a set of
directional operating principles: timing signals outperform firmographic
lists, manual learning should precede automation, founder content and outbound
should use the same account set, free diagnostic output can become the sales
conversation, and partner channels should begin with a narrow proven motion.

This design adapts those principles without weakening BrightCert's existing
compliance controls or replacing its approved messaging.

## Goals

1. Run a controlled first-touch sprint against 30 qualified prospects: 24
   direct SMEs and 6 MSPs.
2. Align founder-led LinkedIn education to the same trigger themes as the
   private account list without naming or exposing prospects.
3. Keep email copy fixed so the sprint tests account timing and signal quality.
4. Measure the full funnel from first touch through payment.
5. Define an explicit evidence gate before releasing the next cohort.

## Non-goals

- Building or purchasing a new lead database.
- Scraping or automating LinkedIn activity.
- Sending email, publishing social content, or scheduling posts automatically.
- Rewriting `sme-v1`, `msp-v1`, the founder script, the LIA, or the launch gate.
- Introducing paid advertising, bulk sequencing, open tracking, or a second
  outbound channel.
- Treating directional figures in the supplied workbook as BrightCert
  forecasts.
- Naming prospects or referring publicly to prospect-specific research.

## Dependencies and ownership boundaries

Implementation must begin from an integration base that contains the approved
outreach controls and the completed `codex/social-infographic-system` work.
Until that social branch is integrated or explicitly superseded:

- `docs/social/**` remains owned by that branch;
- no parallel social calendar or second social source of truth may be created;
- dirty-main outreach evidence, including untracked founder and seed-batch
  documents, remains owner work and must not be staged or rewritten; and
- the sprint may be specified and planned, but social production changes must
  wait for a clean, agreed integration base.

## Campaign structure

### Cohort

The first cohort contains exactly 30 distinct Touch 1 prospects:

| Segment | Prospects | Share |
|---|---:|---:|
| Direct SME | 24 | 80% |
| MSP / IT provider | 6 | 20% |
| **Total** | **30** | **100%** |

The mix preserves the approved 120/30 campaign ratio. A blocked or ineligible
record is replaced by an eligible record from the same segment, not by
borrowing from the other segment.

Every record must pass the existing ICP, source, trigger, lawful-basis,
Companies House, work-email, suppression, existing-customer, sequence-state,
and human-approval gates. Only a current `ready_manual_send` queue row can
proceed.

### Timing

The sprint has two related windows:

1. **Ten-business-day first-touch window:** prospect selection, content
   alignment, founder-led LinkedIn support, and all 30 Touch 1 messages.
2. **Follow-up tail:** the approved SME day-6/day-12 and MSP day-7/day-14
   replies continue after the first-touch window where the prospect remains
   eligible.

T0 remains the first real prospect processed end to end under the existing SOP
checkpoint. The campaign pauses after that record for the required control
review. Later daily releases remain within the current 10–15-message starting
limit and all existing owner-controlled pause rules. This design does not
increase or reinterpret those limits.

Nothing in this design authorises T0. Live operation still requires every
launch-gate row to be verified, the go/no-go record to be completed, no active
pause or incident, and the owner to set T0 under the existing launch process.

### Channel roles

- **Email:** the direct, manual outreach channel using unchanged approved
  sequences.
- **Founder LinkedIn:** public trust and education around the same trigger
  themes.
- **BrightCert LinkedIn/Instagram:** secondary redistribution only where
  already allowed by the social system.

LinkedIn engagement never determines email eligibility, and lack of a
connection or visible post view never blocks a qualified email.

## Message and content system

### Public themes

The sprint uses three founder-led themes:

1. **Why Cyber Essentials becomes urgent**

   Explain tender, customer-assurance, supply-chain, and renewal timing in
   general terms.

2. **Evidence before action**

   Help a business separate evidence it already has from fixes that still need
   an owner.

3. **Readiness before certification**

   Explain how a free readiness baseline can expose likely gaps before the
   official assessment, while stating that BrightCert does not certify or
   guarantee a pass.

### Trigger mapping

| Approved trigger | Public content theme |
|---|---|
| `tender_requirement` | Why Cyber Essentials becomes urgent |
| `customer_assurance` | Why Cyber Essentials becomes urgent |
| `supply_chain` | Why Cyber Essentials becomes urgent |
| `renewal` | Readiness before certification |
| `msp_client_service` | Evidence before action / one-client workflow |

The mapping is deterministic so account research does not lead to improvised
public claims or one-off messaging.

### Publishing rhythm

During each sprint week, the existing founder-led social system supplies:

- one founder carousel;
- two short founder text posts;
- one derivative graphic or reminder post; and
- at most one CTA per item: read the relevant guide or start the free
  assessment.

Every non-trivial regulatory, fee, certification, or requirements claim must
pass the existing primary-source and founder-review gates before publication.
The exact schedule may move around a source or approval delay; outreach volume
must not be increased to compensate for a delayed post.

### Manual account alignment

Before contact, the founder may review relevant public business activity and
leave a substantive comment where there is a genuine contribution to make.
The founder must not:

- name a prospect in BrightCert campaign content;
- mention private research or imply surveillance;
- automate connections, comments, profile views, or direct messages;
- use generic engagement solely to create artificial familiarity; or
- make LinkedIn acceptance or interaction a prerequisite for email.

Email remains the direct outreach channel. LinkedIn provides familiarity,
proof, and a public record of useful expertise.

## Data flow

### Existing private prospect record

The canonical `.outreach/prospects.csv` contract remains unchanged. Trigger,
source, personalisation, approval, and sequence fields continue to be governed
by the existing workflow.

### Private sprint alignment record

Implementation adds an ignored, private operator file such as
`.outreach/signal-sprint-alignment.csv` with this minimum contract:

```text
cohort_id,prospect_id,content_theme,content_item_id,content_published_at,linkedin_engagement_status,linkedin_engagement_at,first_touch_target_date,operator_notes
```

Rules:

- `cohort_id` is the stable private identifier for the 30-prospect sprint, for
  example `signal_sprint_01`.
- `prospect_id` must resolve to one canonical private prospect row.
- `content_theme` must be one of the three approved themes.
- `content_item_id` identifies a founder-reviewed tracked brief or published
  item; it is not proof that the prospect viewed the content.
- `linkedin_engagement_status` is limited to `not_reviewed`, `no_natural_action`,
  `useful_comment`, `connection_existing`, or `connection_requested`.
- `operator_notes` must contain business-context operational notes only and
  must not copy personal posts, infer private traits, or record sensitive data.
- The file remains ignored and is never committed.

The alignment record is planning evidence, not a new eligibility authority.
The canonical prospect file, event history, suppression store, and live queue
checks remain authoritative.

### Outcome events

The existing event model remains the funnel source of truth:

```text
sent → delivered → reply/positive → booked → baseline_completed
→ checkout_started → paid/customer
```

No open event is introduced. Social metrics remain aggregate and are not
joined to named recipients unless the recipient explicitly replies or
identifies the interaction through a lawful, existing workflow.

## Measurement

### Primary funnel

Report distinct prospects and rates by:

- segment (`sme` or `msp`);
- approved trigger;
- template version; and
- first-touch cohort.

The first-touch cohort is derived locally by joining `prospect_id` from the
append-only event history to the private alignment record's `cohort_id`. The
canonical event schema does not change solely to support this sprint.

The decision funnel is:

1. Touch 1 sent
2. Delivered
3. Any reply
4. Positive reply
5. Booked conversation
6. Baseline completed
7. Checkout started
8. Paid / customer

Completed baselines and paid customers are primary outcomes. Meetings and
replies are leading indicators.

### Social diagnostics

Use the existing 72-hour and seven-day social measurement windows:

- impressions or reach;
- saves and shares;
- meaningful comments;
- founder profile visits;
- website sessions;
- assessment starts; and
- UTM-attributed conversions.

These figures diagnose whether content is useful. They do not prove that a
named account saw a post and must not be represented as account-level
attribution.

### Promotion gate

The next cohort must not be released until:

1. existing delivery, hard-bounce, complaint, provider-warning, suppression,
   and incident controls remain clear;
2. the 30 Touch 1 prospects produce at least two relevant replies;
3. at least one prospect books a conversation or starts an assessment;
4. every response is traceable to the prospect's approved trigger and segment;
   and
5. manual review finds no evidence that LinkedIn activity made the approach
   invasive or misleading.

These thresholds are learning gates, not statistical proof or public
performance claims. If the gate is missed, the next cohort pauses while the
trigger mix and account selection are reviewed. Volume is not increased to
compensate.

A relevant reply is a human response about the Cyber Essentials need, its
timing, the BrightCert offer, or the proposed next step. Automated replies,
out-of-office notices, bounces, opt-outs, and bare unsubscribe responses do not
meet the threshold. A substantive objection may count as a relevant reply for
message-learning purposes, but it is not a positive reply and still stops the
sequence.

## Failure and pause handling

Existing controls always outrank the sprint:

- any opt-out, objection, bounce, reply, customer event, or terminal state
  stops later messages to that prospect as already documented;
- a complaint, provider/domain warning, hard-bounce threshold breach, missed
  objection, rights incident, or other campaign pause condition stops the
  relevant outreach activity;
- a disputed or stale social claim pauses that content item until it is
  rechecked against the primary source and founder-approved;
- a social-content delay does not justify more email volume or unreviewed copy;
- an ambiguous prospect signal blocks the record rather than inviting
  improvisation; and
- no failed cohort is rescued by adding channels, buying intent data, or
  loosening the ICP.

## Implementation deliverables

After the design and implementation plan are approved, implementation should
produce:

1. a tracked, non-personal integrated-sprint operator playbook under
   `docs/outreach/`;
2. the ignored private alignment-file schema and operator instructions;
3. founder content briefs that extend the integrated `docs/social/` system
   rather than create a second calendar;
4. a ten-business-day publishing/contact overlay that references the
   authoritative outreach and social schedules;
5. funnel and promotion-gate reporting instructions using the existing event
   and social metrics stores;
6. tests or deterministic validation for any new CLI/schema behaviour, if
   implementation adds executable behaviour; and
7. a dated coordination handoff with exact verification and no claim that
   anything was sent or published.

The implementation must not send messages, publish posts, modify production
data, or deploy without a separate explicit owner request.

## Verification plan

For documentation-only implementation:

- validate that no personal data, real recipient details, raw message IDs, or
  private URLs are tracked;
- verify all campaign terms match the canonical ICP, sequences, SOP, LIA, and
  social guardrails;
- confirm the 24/6 cohort preserves the 120/30 ratio;
- confirm every trigger maps to exactly one approved content theme;
- scan for prohibited certification, guarantee, scarcity, purchasability, and
  stale-metric claims;
- run repository lint, tests, type-check, and build if canonical tracked files
  or executable contracts change.

For later live operation:

- require current queue evidence for every email;
- record every manual send and outcome immediately in append-only history;
- record social metrics at 72 hours and seven days;
- apply the promotion gate before preparing the next cohort; and
- preserve owner review and pause decisions in non-personal dated evidence.

## Decisions captured

- Use an integrated signal sprint rather than content-first or email-first
  operation.
- Include founder-led LinkedIn content aimed at the same account themes.
- Keep public content broadly educational and prospect identities private.
- Use email as the direct outreach channel and LinkedIn as a trust layer.
- Keep approved email copy fixed for the first cohort.
- Use 24 SME and 6 MSP prospects.
- Use a ten-business-day first-touch window plus the approved follow-up tail.
- Require at least two relevant replies and one booked conversation or
  assessment start before promoting the motion.
