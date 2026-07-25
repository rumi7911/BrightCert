# Founding-customer outreach SOP

This is a manual founder workflow. It does not authorise an automated sender,
external send, database mutation, or legal conclusion. The sender is
`muhammad@brightcert.co.uk`; the primary CTA is a reply. After genuine interest,
book a 20-minute call manually because there is no verified public booking URL.

Use the exact command interface in the
[operator runbook](./operator-runbook.md). Live files belong only in the
Git-ignored `.outreach/` or `outreach/runs/` paths.

## Roles

| Role | Responsibility |
|---|---|
| Owner/founder | Approves launch, LIA and copy; sends manually; handles replies/calls; verifies payment evidence |
| Outreach operator | Researches, validates, verifies, queues, records outcomes, reports, suppresses, and runs retention review |
| Legal/privacy reviewer | Reviews the draft LIA/privacy/process where required; does not delegate approval to the CLI |
| Technical owner | Verifies production, database, authentication, email-domain, payment, and incident gates |

One person may hold several roles, but each approval and evidence item must
remain explicit.

## Pre-flight: no-go until complete

- [ ] Every item in [LAUNCH-GATE.md](./LAUNCH-GATE.md) has evidence and the
  overall decision is go.
- [ ] [LIA.md](./LIA.md) has completed owner/date/reviewer/sign-off fields for
  this exact campaign.
- [ ] [ICP.md](./ICP.md), source rules, 120/30 mix, and disqualifiers are
  approved.
- [ ] Public privacy notice explains sources, legitimate interests, objection,
  retention, and contact route.
- [ ] SPF, DKIM, DMARC, domain/provider warnings, inbox replies, and internal
  seed rendering are verified by the owner.
- [ ] Production checkout, webhook, entitlement, receipt, refund, and database
  reconciliation have owner evidence.
- [ ] Approved copy version, campaign slug, UTM convention, private directories,
  suppression store, and event store are ready.
- [ ] No live prospect file or populated secret appears in Git.

The first ten internal/friendly seed sends are a ceiling, not permission for
external prospecting. External sending remains blocked until every launch gate
passes.

## Secure setup and seed stores

Set up and load `COMPANIES_HOUSE_API_KEY` exactly as shown in the
[runbook](./operator-runbook.md). Never place the value in a command, CSV, log,
browser variable, or repository file.

Create the private stores:

```sh
npm run outreach -- seed-suppressions \
  --store .outreach/suppressions.csv
```

The seed command is idempotent. Create the event store by recording the
canonical `imported` event for each approved research row before queueing; a
missing event history is an error.

Internal/friendly seed tests are owner actions:

- send only approved plain-text test content to controlled recipients;
- check From/Reply-To, SPF/DKIM/DMARC results, rendering, links, and replies;
- do not use an open pixel or count opens;
- record recipient permission and results outside the prospect campaign; and
- pause on any provider or domain warning.

## Daily operating workflow

### 1. Prepare and validate

Export Clay research to `.outreach/prospects.csv` using
[CLAY-CSV-CONTRACT.md](./CLAY-CSV-CONTRACT.md), then:

```sh
npm run outreach -- validate \
  --input .outreach/prospects.csv \
  --output outreach/runs/validated.csv
```

Review every row. `gate_status=eligible` only means the static checks passed;
it does not authorise a send. Resolve or exclude every `gate_reasons` value.

### 2. Verify Companies House

```sh
npm run outreach -- verify \
  --input outreach/runs/validated.csv \
  --output outreach/runs/verified.csv
```

Confirm exact company-number match, `active` status, supported corporate type,
and fresh timestamp. A missing or ambiguous match blocks; never infer that it
is a sole trader.

### 3. Human review

For each row, confirm:

- [ ] strong or approved-medium trigger and reachable evidence;
- [ ] factual personalisation linked to the named role;
- [ ] corporate-domain, named, verified, non-role email;
- [ ] no duplicate, existing customer, suppression, reply, bounce, or stopped
  state;
- [ ] approved LIA covers source, segment, purpose, and channel;
- [ ] right segment and template version from
  [EMAIL-SEQUENCES.md](./EMAIL-SEQUENCES.md);
- [ ] no certification, guarantee, two-hour remediation, scarcity, cohort
  count, or booking-link claim;
- [ ] exactly one reply CTA and the privacy/opt-out wording; and
- [ ] `human_approved_at` reflects the actual review.

### 4. Seed canonical event history

Use values that exactly match one canonical prospect row:

```sh
npm run outreach -- event \
  --store .outreach/events.csv \
  --prospects outreach/runs/verified.csv \
  --suppressions .outreach/suppressions.csv \
  --prospect-id sme-example-001 \
  --type imported \
  --campaign founding-example \
  --segment sme
```

The identifiers above belong to the fictitious tracked template. Substitute
the reviewed private row's exact values for an authorised live run.

### 5. Build a fresh review queue

Queue each step only on the day it may be sent:

```sh
npm run outreach -- queue \
  --input outreach/runs/verified.csv \
  --suppressions .outreach/suppressions.csv \
  --events .outreach/events.csv \
  --step 1 \
  --output outreach/runs/step-1-review.csv
```

For later touches use `--step 2` with a private canonical row whose
`sequence_status` is `touch_1_sent`, or `--step 3` with
`sequence_status=touch_2_sent`. Do not edit a queue result to remove a block.
Only `queue_status=ready_manual_send` after the fresh exact-number check may
move to the manual draft.

### 6. Manually send

1. Open the reviewed row and approved copy side by side.
2. Recheck recipient, company, trigger sentence, subject/thread, CTA, privacy
   link, and opt-out line.
3. Check the inbox and event history once more for a reply or objection.
4. Send one plain-text message from `muhammad@brightcert.co.uk`.
5. Record the `sent` event immediately.
6. Update the private canonical CSV `sequence_status` to `touch_1_sent`,
   `touch_2_sent`, or `touch_3_sent` only after send evidence exists; re-run
   validation before a later queue.

```sh
npm run outreach -- event \
  --store .outreach/events.csv \
  --prospects outreach/runs/verified.csv \
  --suppressions .outreach/suppressions.csv \
  --prospect-id sme-example-001 \
  --type sent \
  --campaign founding-example \
  --segment sme
```

No CLI command sends an email or mutates `sequence_status`.

### 7. Handle replies and terminal outcomes

Any reply stops all later touches immediately. Classify it as `positive`,
`neutral`, `objection`, or the generic `reply`; record `booked` only when a
20-minute call is actually agreed. Use `lost` with the reason kept in the
approved operator notes, not invented in the event type.

For an opt-out:

```sh
npm run outreach -- event \
  --store .outreach/events.csv \
  --prospects outreach/runs/verified.csv \
  --suppressions .outreach/suppressions.csv \
  --prospect-id sme-example-001 \
  --type opt_out \
  --campaign founding-example \
  --segment sme
```

`opt_out` and `bounced` automatically add the canonical work email to the
suppression store before appending the event. Handle both the same day, remove
drafts/queues, update the private sequence state, and prove a fresh queue is
blocked. For a domain- or company-wide request, also use the explicit
suppression command with scope `domain` or `company`:

```sh
npm run outreach -- suppress \
  --store .outreach/suppressions.csv \
  --scope domain \
  --value fictitious-components.test \
  --reason opt-out
```

### 8. Record funnel outcomes

Use only supported types:

`imported`, `eligible`, `queued`, `sent`, `delivered`, `positive`, `neutral`,
`objection`, `reply`, `opt_out`, `bounced`, `booked`,
`baseline_completed`, `checkout_started`, `paid`, `customer`, `refunded`,
`lost`, and `closed`.

Do not manually mark `paid` from a promise, screenshot, checkout start, or
spreadsheet note. Complete the reconciliation checklist below first.

## Daily volumes and cadence

- Start with 10–15 total manual prospect messages per business day.
- Never exceed 20 total messages/day until the first 50 prospect sends have
  healthy delivery evidence.
- Only after the 50-send checkpoint is healthy may the owner approve up to 30
  total messages/day.
- Count new touches and follow-ups together. Due follow-ups take priority over
  increasing new Touch 1 volume.
- The provider's published technical ceiling is not the operating target.
- SME timing is business days 1, 6, and 12. MSP timing is business days 1, 7,
  and 14. Never compress a cadence to hit a volume target.

Follow the detailed programme in [30-DAY-CALENDAR.md](./30-DAY-CALENDAR.md).

## Pause and incident rules

Pause all sending immediately when:

- hard bounces exceed 3% of sent messages in the current campaign or recent
  batch;
- any spam complaint is reported;
- any provider, inbox, DNS, or domain-reputation warning appears;
- an opt-out was not processed the same day;
- a queue/send bypass, wrong recipient, misleading claim, or data exposure is
  suspected; or
- required launch evidence becomes stale or unavailable.

While paused:

1. stop drafts, queues, and scheduled manual work;
2. preserve minimal logs and affected IDs without copying personal data;
3. suppress any objection/bounce immediately;
4. notify the owner and technical/privacy reviewer;
5. identify the exact batch, root cause, scope, and corrective control;
6. re-run seed, queue, copy, DNS/provider, and data checks as applicable; and
7. resume only with recorded owner approval and healthy evidence.

Do not average away a bad batch or continue because the provider ceiling is
higher.

## Weekly reporting

```sh
npm run outreach -- report \
  --events .outreach/events.csv \
  --output outreach/runs/weekly-funnel.csv
```

Review the output using [SCORECARD.md](./SCORECARD.md). It deduplicates a
prospect within each event type/week and excludes opens/open rates. Review
verbatim objections in the protected operator notes, never in Git.

## Retention cleanup

Weekly and after the final sequence:

- identify sequence-end and expiry dates;
- delete rejected working copies promptly;
- keep active prospect records for no more than 90 days after sequence end;
- remove non-converted personal data by 180 days;
- move necessary converted-customer data to normal customer records;
- preserve only minimal separate suppression evidence; and
- record cleanup date, boundary, affected count, operator, and exceptions
  without personal data.

For approved optional Supabase storage, an authorised service-role operator may
invoke:

```sql
select public.purge_expired_outreach_prospect_personal_data(now());
```

Treat this as a production mutation: preview the eligible record count, use the
reviewed database process, and capture evidence. The CLI does not run retention
cleanup. See [DATA-FLOW-AND-RETENTION.md](./DATA-FLOW-AND-RETENTION.md).

## Rights request and DSAR process

On any possible access, correction, erasure, restriction, source, or objection
request:

1. log the received date and exact scope in a protected case record;
2. acknowledge and route it to the data owner immediately;
3. verify identity proportionately without collecting excessive ID;
4. search private CSVs, event/suppression stores, optional Supabase, the founder
   inbox, and approved processors;
5. separate third-party information and apply exemptions only with appropriate
   review;
6. respond securely, intelligibly, without undue delay, and ordinarily within
   one month; and
7. record completion and any limited data retained to prevent re-contact.

An objection to direct marketing is unconditional and is handled immediately;
do not wait for the wider request response.

## Payment reconciliation evidence

Before recording `paid` or counting revenue:

- [ ] exact prospect/customer and organisation are matched without relying only
  on email;
- [ ] Stripe payment/checkout object is live-mode, successful, and has the
  expected amount/currency;
- [ ] application assessment/organisation entitlement is unlocked for the same
  purchase;
- [ ] webhook/event evidence is present and not merely pending or replayed;
- [ ] receipt/invoice evidence exists where applicable;
- [ ] `FOUNDING10`, if used, produced the approved £100 discount from £199 to
  £99 including VAT;
- [ ] refunds, disputes, duplicates, test-mode objects, and prior reconciliations
  are checked;
- [ ] any mismatch is left unresolved and escalated rather than overwritten;
  and
- [ ] the event is recorded only after Stripe plus application entitlement
  agree.

Never expose keys, full payment credentials, or unnecessary customer data in
the evidence record. `refunded` requires corresponding Stripe evidence and an
entitlement review.

## One-prospect control-path acceptance test

Run this only after all launch gates pass, using one owner-approved private
corporate prospect. The test is not complete merely because the CLI exits zero.

1. Put exactly one reviewed row in `.outreach/control-prospect.csv`.
2. Validate to `outreach/runs/control-validated.csv`; require no gate reasons.
3. Verify to `outreach/runs/control-verified.csv`; compare the exact company
   number and require active/supported result.
4. Record its `imported` event in the real private event store.
5. Queue step 1 and require exactly one `ready_manual_send` row.
6. Have a second human check recipient, source, trigger, body, CTA, footer, and
   absence of tracking.
7. Manually send from the founder inbox, then record `sent` and update the
   private sequence state.
8. Confirm reply routing, delivery evidence, suppression lookup, and reporting
   row without using open tracking.
9. Hold the next batch until the owner signs the control result.

If the row blocks, the test passes only in the sense that the gate failed
closed; do not override it. Resolve the evidence or replace the prospect.

## UTM convention

Reply is the cold-email CTA; do not add a tracked booking link. If an approved
BrightCert page is shared manually after interest, use lower-case stable values:

| Parameter | Convention | Example |
|---|---|---|
| `utm_source` | Sender/channel origin | `founder_email` |
| `utm_medium` | Channel | `email` |
| `utm_campaign` | Approved campaign slug | `founding_pilot_2026` |
| `utm_content` | Segment, version, touch | `sme_v1_t1` |
| `utm_term` | Optional stable trigger slug | `tender_requirement` |

Use underscores, ASCII lower case, and no names, emails, company numbers, or
other personal data. Change one copy variable at a time and increment the
template version. UTMs are campaign attribution, not proof of identity,
delivery, consent, or payment. Consent controls described in
[DATA-FLOW-AND-RETENTION.md](./DATA-FLOW-AND-RETENTION.md) still apply.
