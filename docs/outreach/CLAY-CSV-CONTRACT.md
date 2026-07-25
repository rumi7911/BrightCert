# Clay research and canonical CSV contract

Clay is a research/enrichment aid, not an email sender. It must not run a
sequence, mark legal approval, decide eligibility, or replace human review.
Export live data only to private ignored paths under `.outreach/` or
`outreach/runs/`. Never commit a live prospect file.

The canonical tracked template is
[`outreach/templates/prospects.example.csv`](../../outreach/templates/prospects.example.csv).
The command authority is the [operator runbook](./operator-runbook.md).

## Exact column order

```text
prospect_id,campaign,template_version,segment,company_name,domain,legal_entity_type,company_number,employee_band,sector,contact_name,role,work_email,source_url,source_date,trigger,trigger_evidence_url,personalisation_note,lawful_basis,lia_status,suppression_status,sequence_status,human_approved_at,existing_customer,email_status,company_status,companies_house_checked_at
```

Do not rename, omit, or reorder columns in the hand-off file. The CLI may
normalise values, but the operator should fix the source rather than rely on
legacy aliases.

## Field mapping

| Column | Meaning and accepted value | Authoritative source | Human approval? |
|---|---|---|---|
| `prospect_id` | Stable unique internal ID, non-empty | Operator naming convention | Yes |
| `campaign` | Stable campaign slug, e.g. `founding-pilot-2026` | Operator | Yes |
| `template_version` | Exact copy version, e.g. `sme-v1` or `msp-v1` | [EMAIL-SEQUENCES.md](./EMAIL-SEQUENCES.md) | Yes |
| `segment` | Exactly `sme` or `msp` | [ICP.md](./ICP.md) | Yes |
| `company_name` | Registered/trading name used accurately | Company website plus Companies House | Yes |
| `domain` | Lower-case company domain only, without path | Company website | Yes |
| `legal_entity_type` | `ltd`, `plc`, `llp`, `private-unlimited`, `private-unlimited-nsc`, `private-limited-guarant-nsc`, `private-limited-guarant-nsc-limited-exemption`, or `private-limited-shares-section-30-exemption` | Companies House; CSV value is provisional until verification | Yes |
| `company_number` | Exact 2–8 uppercase alphanumeric number, preserving leading zeroes | Companies House | Yes |
| `employee_band` | Sourced band such as `10-49` or `50-99`; no false precision | Licensed enrichment or company source | Yes |
| `sector` | Plain, stable sector label | Licensed enrichment/company source | Yes |
| `contact_name` | Relevant named business contact | Public business context or licensed data | Yes |
| `role` | Current professional role | Public business context or licensed data | Yes |
| `work_email` | Verified named corporate work email matching `domain` | Licensed verification/public business source | Yes |
| `source_url` | Reachable `http`/`https` URL showing company/contact context | Original public or licensed source | Yes |
| `source_date` | Date checked, `YYYY-MM-DD` | Operator/Clay research run | Yes |
| `trigger` | Stable label such as `renewal`, `tender_requirement`, `customer_assurance`, `supply_chain`, or `msp_client_service` | [ICP.md](./ICP.md) | Yes |
| `trigger_evidence_url` | Reachable `http`/`https` URL supporting the trigger | Original public business source | Yes |
| `personalisation_note` | At least 20 characters; factual summary connecting trigger to role | Human synthesis of cited evidence | Yes |
| `lawful_basis` | Exactly `legitimate_interests` for this approved pilot | Approved [LIA](./LIA.md) | Yes |
| `lia_status` | Exactly `approved` before queueing | Completed owner/legal LIA record | Yes |
| `suppression_status` | Exactly `clear` after screening | Current global suppression store | Yes |
| `sequence_status` | `candidate`, `approved`, `touch_1_sent`, `touch_2_sent`, `touch_3_sent`, `replied`, `opted_out`, `bounced`, `customer`, or `closed` | Operator event history | Yes |
| `human_approved_at` | Valid ISO 8601 timestamp after review | Operator | Yes |
| `existing_customer` | Explicit `false` to qualify; blank/unknown blocks | Customer/application reconciliation | Yes |
| `email_status` | Exactly `verified` to qualify | Licensed verifier/operator evidence | Yes |
| `company_status` | Exactly `active` to qualify; CSV value is not queue authority | Companies House | Yes |
| `companies_house_checked_at` | Valid ISO 8601 timestamp from verification; queue replaces stale authority with a fresh check | Companies House verification command | Yes |

`legal_entity_type`, `company_status`, and
`companies_house_checked_at` in a CSV are review data, not authority. The
`queue` command clears those assertions and performs a fresh exact-number
Companies House check for each otherwise eligible row.

## Safe fictitious example

The following is format guidance only. The `.test` domains and `00000000`
company number are deliberately non-live; this row must never be sent or
expected to pass a live Companies House check.

```csv
prospect_id,campaign,template_version,segment,company_name,domain,legal_entity_type,company_number,employee_band,sector,contact_name,role,work_email,source_url,source_date,trigger,trigger_evidence_url,personalisation_note,lawful_basis,lia_status,suppression_status,sequence_status,human_approved_at,existing_customer,email_status,company_status,companies_house_checked_at
sme-example-only,founding-example,sme-v1,sme,Fictitious Components Ltd,fictitious-components.test,ltd,00000000,10-49,manufacturing,Casey Example,Operations Director,casey.example@fictitious-components.test,https://fictitious-components.test/about,2026-07-25,tender_requirement,https://fictitious-components.test/tender,Fictitious tender page names Cyber Essentials,legitimate_interests,approved,clear,approved,2026-07-25T10:00:00Z,false,verified,active,2026-07-25T09:00:00Z
```

No tracked example is evidence of a live company, contact, approval, or send
decision.

## Deduplication and exclusions

Before export:

1. deduplicate by normalised `prospect_id` and lower-case `work_email`;
2. screen exact email, parent domain, and company number against suppressions;
3. reconcile existing customers and exclude any `true` or unknown result;
4. exclude free-mail, disposable, shared-role, unverified, or domain-mismatched
   addresses;
5. exclude unsupported/inactive/ambiguous legal entities;
6. exclude weak or missing triggers and missing source lineage;
7. exclude stopped sequence states; and
8. keep only one best relevant contact per opportunity where practical.

The CLI repeats critical gates. A row remaining in a validation output does not
mean it is approved; inspect `gate_status` and `gate_reasons`.

## Review, validate, verify, and queue

Load the Companies House key exactly as described in the
[operator runbook](./operator-runbook.md), then follow this literal lifecycle:

1. Clay exports research to the one canonical
   `.outreach/prospects.csv`.
2. Run pre-review validation to expose research and incomplete-review reasons:

```sh
npm run outreach -- validate \
  --input .outreach/prospects.csv \
  --output outreach/runs/pre-review-validation.csv
```

3. A human resolves research issues and fills approval, LIA,
   personalisation, and `sequence_status` fields in
   `.outreach/prospects.csv` itself, or re-exports reviewed Clay rows to that
   exact path. Do not edit the generated validation file.
4. Re-run validation from the reviewed canonical file, then verify the current
   validated snapshot:

```sh
npm run outreach -- validate \
  --input .outreach/prospects.csv \
  --output outreach/runs/validated.csv

npm run outreach -- verify \
  --input outreach/runs/validated.csv \
  --output outreach/runs/verified.csv
```

5. Seed suppressions, record `imported` against the current verified snapshot,
   and queue from that same snapshot:

```sh
npm run outreach -- seed-suppressions \
  --store .outreach/suppressions.csv

npm run outreach -- event \
  --store .outreach/events.csv \
  --prospects outreach/runs/verified.csv \
  --suppressions .outreach/suppressions.csv \
  --prospect-id sme-example-only \
  --type imported \
  --campaign founding-example \
  --segment sme

npm run outreach -- queue \
  --input outreach/runs/verified.csv \
  --suppressions .outreach/suppressions.csv \
  --events .outreach/events.csv \
  --step 1 \
  --output outreach/runs/step-1-review.csv
```

The event store must exist and contain the prospect's canonical history.
`queue` requires `COMPANIES_HOUSE_API_KEY`, performs a fresh exact-number
profile check, and approves only supported active corporate types. Send
manually only when the current row says
`queue_status=ready_manual_send` and a human has rechecked every field. See the
complete workflow in [SOP.md](./SOP.md).

6. Immediately after a manual send, record the exact message step:

```sh
npm run outreach -- event \
  --store .outreach/events.csv \
  --prospects outreach/runs/verified.csv \
  --suppressions .outreach/suppressions.csv \
  --prospect-id sme-example-only \
  --type sent \
  --campaign founding-example \
  --segment sme \
  --sequence-step 1
```

Then update `sequence_status` in `.outreach/prospects.csv`, not in a generated
snapshot. Re-run both final validation and verification before queueing Touch 2
or Touch 3. The CLI does not update prospect state.
