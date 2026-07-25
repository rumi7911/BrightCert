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

## Commands

All writes use a temporary sibling file and an atomic rename. Exported cells
that could be interpreted as spreadsheet formulas are neutralized.

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
not authority. The event store must already exist (normally beginning with
canonical `imported` events); a missing history is an error, not an empty
history.

The event types are `imported`, `eligible`, `queued`, `sent`, `delivered`,
`positive`, `neutral`, `objection`, `reply`, `opt_out`, `bounced`, `booked`,
`baseline_completed`, `checkout_started`, `paid`, `customer`, `refunded`,
`lost`, and `closed`.
Reports deduplicate a prospect within each event type and week. They deliberately
exclude opens and open rates.

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
