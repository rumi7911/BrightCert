# No-send CLI rehearsal — one canonical chain, 26 July 2026

Supersedes the fragmented rehearsal evidence referenced earlier in
[LAUNCH-GATE.md](./LAUNCH-GATE.md). That earlier pass used three different
prospect IDs across separate ad-hoc runs (one against `outreach/runs/validated.csv`
directly, two against untracked temp files outside `.outreach/`), so the
`canonical → validated → verified → imported → queue` chain was never
reproducible from one file. This pass resets `.outreach/` and `outreach/runs/`
entirely and reruns everything from one canonical `.outreach/prospects.csv`
containing exactly two rows, both traceable through every step below.

No email was sent by any command. No production data was read or written —
every command below operates only on local files under gitignored
`.outreach/`/`outreach/runs/` (confirmed via `.gitignore` lines 45–46) plus
live, read-only calls to the Companies House API.

## Canonical input — `.outreach/prospects.csv` (2 rows, mode 600)

| prospect_id | company_name | company_number | Purpose |
|---|---|---|---|
| `sme-example-001` | Example Manufacturing Ltd | `00123456` | Fictitious, deliberately nonexistent — proves the fail-closed path |
| `sme-example-005` | COGNUMI LTD | `17265250` | Real, active UK company (BrightCert's own operator) with a fictitious `.test` contact email — proves the `ready_manual_send` path without any real, contactable identity |

## Chain

| # | Command | Input | Output (mode 600) | Result |
|---|---|---|---|---|
| 1 | `outreach -- validate` (pre-review) | `.outreach/prospects.csv` | `outreach/runs/pre-review-validation.csv` | Both rows `gate_status=eligible` |
| 2 | `outreach -- validate` (final) | `.outreach/prospects.csv` | `outreach/runs/validated.csv` | Both rows `gate_status=eligible` |
| 3 | `outreach -- verify` (live Companies House) | `outreach/runs/validated.csv` | `outreach/runs/verified.csv` | `sme-example-001` → `verification_result=not_found`; `sme-example-005` → `verification_result=active` |
| 4 | `outreach -- seed-suppressions` | — | `.outreach/suppressions.csv` | Empty store created; idempotent (already confirmed in the prior rehearsal pass) |
| 5 | `outreach -- event --type imported` ×2 | `outreach/runs/verified.csv` | `.outreach/events.csv` | Both rows recorded |
| 6 | `outreach -- queue --step 1` | `outreach/runs/verified.csv` + `.outreach/events.csv` | `outreach/runs/step-1-review.csv` | `sme-example-001` → `queue_status=blocked`, `gate_reasons=company_unverified`, `verification_result=not_attempted` (correctly declines to re-call Companies House for a company `verify` already found not to exist). `sme-example-005` → `queue_status=ready_manual_send`, `verification_result=active`, `companies_house_checked_at` updated to a **new** timestamp later than step 3's — proves `queue` performs its own fresh live check, not just trusting the CSV |
| 7 | `outreach -- suppress --scope email` | — | `.outreach/suppressions.csv` | Suppressed `sme-example-005`'s contact email |
| 8 | `outreach -- queue --step 1` (rerun) | `outreach/runs/verified.csv` + updated suppressions | `outreach/runs/step-1-review-post-suppression.csv` | `sme-example-005` now → `queue_status=blocked`, `gate_reasons=suppressed_email`, `verification_result=not_attempted` — suppression is checked and blocks **before** any Companies House call, proving queue-level suppression enforcement on a row that had just been `ready_manual_send` moments earlier |
| 9 | `outreach -- event --type sent --sequence-step 1`, then repeated | `outreach/runs/verified.csv` | `.outreach/events.csv` | First call recorded; identical second call rejected: `Duplicate message event for campaign, prospect_id, type, and sequence_step` |
| 10 | `outreach -- report` | `.outreach/events.csv` | `outreach/runs/weekly-funnel.csv` | `imported=2, sent_messages=1, touch_1_sent=1, delivered_messages=0` — matches the exact events recorded above |

## Note on step 6/8 wording vs. the prior fragmented pass

The prior rehearsal pass (superseded by this one) fed `queue` a file where the
fictitious company's fields still carried their original, un-verified values
(`legal_entity_type=ltd`, `company_number=00123456`), so `queue` attempted its
own live call and got `verification_result=not_found` directly. In this
canonical run, `queue` is correctly fed `verified.csv` — where `verify` had
already blanked those fields after determining the company doesn't exist — so
`queue` short-circuits with `company_unverified`/`not_attempted` instead of
repeating a call that can't succeed. Both are genuine fail-closed outcomes;
this run's sequencing matches the documented canonical flow in
[operator-runbook.md](./operator-runbook.md) exactly, so this is the version
to treat as authoritative.

## Automated suite

`npm run test:run` — 177/177 tests passed (full suite; the outreach-specific
subset is a portion of this total).
