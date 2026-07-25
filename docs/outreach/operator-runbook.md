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
prospect_id,campaign,segment,template_version,first_name,last_name,job_title,email,company_name,company_number,company_domain,source_url,source_date,trigger,trigger_evidence,lia_status,human_approved_at,existing_customer,email_status,company_status,company_type,companies_house_checked_at,sequence_state
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

npm run outreach -- queue \
  --input outreach/runs/verified.csv \
  --suppressions .outreach/suppressions.csv \
  --step 1 \
  --output outreach/runs/step-1-review.csv

npm run outreach -- event \
  --store .outreach/events.csv \
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

The event types are `imported`, `eligible`, `queued`, `sent`, `delivered`,
`positive`, `neutral`, `objection`, `opt_out`, `bounced`, `booked`,
`baseline_completed`, `checkout_started`, `paid`, `refunded`, and `lost`.
Reports deduplicate a prospect within each event type and week. They deliberately
exclude opens and open rates.
