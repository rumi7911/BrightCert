# Outreach verification and data workflow

This is an operator-only, manual-send workflow. It validates and annotates
prospect files, checks exact company numbers, creates review queues, records
outcomes, and reports weekly funnel totals. It does not send email and does not
provide a browser or admin API.

## Secure Companies House key setup

Keep the key outside the repository in
`~/.config/brightcert/outreach.env`. Create the file with owner-only
permissions:

```sh
mkdir -p ~/.config/brightcert
umask 077
printf 'COMPANIES_HOUSE_API_KEY=\n' > ~/.config/brightcert/outreach.env
chmod 600 ~/.config/brightcert/outreach.env
```

Edit that external file to add the key. Load it only into the operator shell
that will run verification:

```sh
set -a
. ~/.config/brightcert/outreach.env
set +a
```

Never copy the key into a CSV, command argument, browser environment variable,
source file, log, or commit.

## Private run data

Put live input and output beneath `.outreach/` or `outreach/runs/`; both are
ignored by Git. Live files may contain personal data and must not be committed.
The tracked example uses only reserved `.test` domains and fictitious details.

The prospect contract is:

```text
prospect_id,campaign,template_version,segment,company_name,domain,legal_entity_type,company_number,employee_band,sector,contact_name,role,work_email,source_url,source_date,trigger,trigger_evidence_url,personalisation_note,lawful_basis,lia_status,suppression_status,sequence_status,human_approved_at,existing_customer,email_status,company_status,companies_house_checked_at
```

The supported sequence states are `candidate`, `approved`, `touch_1_sent`,
`touch_2_sent`, `touch_3_sent`, `replied`, `opted_out`, `bounced`, `customer`,
and `closed`. Step 1 requires `approved`, step 2 requires `touch_1_sent`, and
step 3 requires `touch_2_sent`. A reply, opt-out, bounce, customer conversion,
or closure stops all later steps.

## Canonical private-file lifecycle

All writes use a temporary sibling file and an atomic rename. Exported cells
that could be interpreted as spreadsheet formulas are neutralized. Generated
validation, verification, and queue files are snapshots: do not edit them.

1. Export Clay research to the one private canonical file,
   `.outreach/prospects.csv`.
2. Run pre-review validation. It is expected to block rows whose human
   approval, LIA, personalisation, or state fields are incomplete.
3. Review and fill those fields in `.outreach/prospects.csv` itself, or
   re-export the reviewed Clay rows to that exact path.
4. Re-run validation from the reviewed canonical file to the current
   `outreach/runs/validated.csv`, then verify that file to the current
   `outreach/runs/verified.csv`.
5. Record `imported` against the current verified snapshot, then queue from
   that same snapshot and the canonical event history.
6. After each manual send, immediately record `sent` with the exact
   `--sequence-step`. Update `sequence_status` in
   `.outreach/prospects.csv`, then re-run both final validation and verification
   before building a later-touch queue.

The CLI never sends a message and never mutates `.outreach/prospects.csv` or
its `sequence_status`.

## Commands

Pre-review research-quality validation:

```sh
npm run outreach -- validate \
  --input .outreach/prospects.csv \
  --output outreach/runs/pre-review-validation.csv
```

After human review has updated the private canonical file:

```sh
npm run outreach -- validate \
  --input .outreach/prospects.csv \
  --output outreach/runs/validated.csv

npm run outreach -- verify \
  --input outreach/runs/validated.csv \
  --output outreach/runs/verified.csv

npm run outreach -- seed-suppressions \
  --store .outreach/suppressions.csv

npm run outreach -- suppress \
  --store .outreach/suppressions.csv \
  --scope email \
  --value person@example.test \
  --reason opt-out

npm run outreach -- event \
  --store .outreach/events.csv \
  --prospects outreach/runs/verified.csv \
  --suppressions .outreach/suppressions.csv \
  --prospect-id sme-001 \
  --type imported \
  --campaign founding-2026 \
  --segment sme

npm run outreach -- queue \
  --input outreach/runs/verified.csv \
  --suppressions .outreach/suppressions.csv \
  --events .outreach/events.csv \
  --step 1 \
  --output outreach/runs/step-1-review.csv

npm run outreach -- event \
  --store .outreach/events.csv \
  --prospects outreach/runs/verified.csv \
  --suppressions .outreach/suppressions.csv \
  --prospect-id sme-001 \
  --type sent \
  --campaign founding-2026 \
  --segment sme \
  --sequence-step 1

npm run outreach -- event \
  --store .outreach/events.csv \
  --prospects outreach/runs/verified.csv \
  --suppressions .outreach/suppressions.csv \
  --prospect-id sme-001 \
  --type positive \
  --campaign founding-2026 \
  --segment sme \
  --trigger renewal \
  --template-version sme-v1

npm run outreach -- report \
  --events .outreach/events.csv \
  --output outreach/runs/weekly-funnel.csv
```

Validation and queue outputs retain every input row. Only rows with
`queue_status=ready_manual_send` are approved for manual sending; blocked rows
carry semicolon-separated `gate_reasons`. Always review the file before sending.
Queue always requires `COMPANIES_HOUSE_API_KEY` and performs a fresh exact-number
profile check; status/type/timestamps already present in a CSV are review data,
not authority. The event store must already exist. A missing file is an error;
an empty, header-only, or unrelated history blocks with
`missing_imported_event`. Step 2 also requires a matching `sent` event with
`sequence_step=1`; step 3 requires one with `sequence_step=2`. Missing
corroboration blocks with `missing_prior_step_sent_event`. All history matches
use prospect, campaign, and segment, and any block prevents the Companies House
request.

The event types are `imported`, `eligible`, `queued`, `sent`, `delivered`,
`positive`, `neutral`, `objection`, `reply`, `opt_out`, `bounced`, `booked`,
`baseline_completed`, `checkout_started`, `paid`, `customer`, `refunded`,
`lost`, and `closed`.
`sent`, `delivered`, and `bounced` require `--sequence-step 1`, `2`, or `3`.
Delivery and bounce recording also requires an earlier matching `sent` event
for the same campaign, prospect, and sequence step. The command fails before
writing an event or bounce suppression when that evidence is absent.
The event CSV persists that field:

```text
event_id,prospect_id,type,campaign,segment,trigger,template_version,sequence_step,occurred_at,amount_paid
```

The event command rejects a second message event with the same campaign,
prospect, event type, and sequence step, regardless of its timestamp. It exits
without rewriting the event file. Reconcile a genuine operator mistake from
the protected evidence; never edit or delete append-only audit history to make
the command pass.

Reports also defend against legacy or manually corrupted stores. They globally
deduplicate each message-event key using the earliest valid occurrence as
canonical. Sent messages own the reporting week and dimensions. Canonical
delivery and bounce outcomes join back to the matching sent message's week,
campaign, segment, trigger, and template; unmatched or pre-send outcomes are
excluded. `sent_messages`, `delivered_messages`, and `bounced_messages`
therefore count separate touches without cross-week duplicates or
denominator-free outcomes, while `touch_1_sent` counts distinct Touch 1
prospects.
`delivery_rate` and `hard_bounce_rate` are message-based percentages and show
`n/a` with no send denominator. Other event metrics remain distinct-prospect
counts per event type/week. Reports deliberately exclude opens and open rates.

Positive, neutral, objection, reply, opt-out, bounce, paid/customer, and
lost/closed events stop later queue attempts. Opt-out and bounce also append an
email suppression before the event is recorded. Event dimensions must match one
row in the supplied canonical prospect file.

Suppression and event files use bounded exclusive sibling locks around the
complete read/modify/replace operation. Suppression evidence is append-only in
the database. The operator-only
`purge_expired_outreach_prospect_personal_data()` database function clears the
work email, any prospect-level email fingerprint, contact, role, source,
evidence, and personalisation data at expiry while retaining non-personal
funnel events. Only separate immutable opt-out/bounce suppression records keep
the minimal evidence needed to prevent re-contact.
