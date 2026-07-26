# Founding-customer launch gate

This is the single go/no-go record for external outreach. Nothing in this
document is pre-verified. Attach current evidence and name the reviewer before
changing any row to `verified`.

## Status vocabulary

| Status | Meaning |
|---|---|
| `verified` | A named reviewer checked current evidence in the target environment and recorded date/location/result |
| `operator action required` | The campaign operator can run or document the check, but has not yet attached sufficient current evidence |
| `owner action required` | Founder/account/domain/legal authority or an interactive live action is required |

The overall decision is **no-go** if any row is not `verified`, any evidence is
stale/ambiguous, or a pause rule is active. All work in this checklist is
pre-T0. T0 is the first Monday after every row passes.

| Gate | Required evidence | Initial status | Owner/reviewer | Evidence/date |
|---|---|---|---|---|
| Public-message consistency | Auth, metadata, social preview, landing/pricing, email and founder script consistently describe readiness; no retired promise, certification, guaranteed pass, or two-hour remediation claim | operator action required |  |  |
| Offer consistency | Free guided baseline, reviewed action plan and founder support; optional £99 including VAT unlock uses the existing £100 `FOUNDING10` discount from £199; no scarcity/cohort claim | operator action required |  |  |
| Privacy notice | Live notice covers outreach sources including Clay/public sources/Companies House, legitimate interests, objection, sharing/processors, retention, minimal suppression and contact route | owner action required |  |  |
| Consent and attribution | Production test proves no pre-consent storage; consented first/last touch works; denial/withdrawal clears attribution, GA state/scripts/cookies; new UTMs update last touch | operator action required |  |  |
| Opt-out path | Reply and privacy contact route are monitored; same-day suppression/event/queue-block rehearsal passes | owner action required |  |  |
| LIA approval | [LIA.md](./LIA.md) is completed for this exact campaign with owner/date/reviewer/decision/sign-off; guidance rechecked | owner action required |  |  |
| ICP and copy approval | 120 SME/30 MSP criteria, triggers, exclusions, template versions, cadence, footer, UTM convention and human checklist are approved | owner action required |  |  |
| Private data controls | `.outreach/` and `outreach/runs/` are ignored; no live PII in Git; operator access and incident route are confirmed | operator action required |  |  |
| Suppression store | Idempotent seed succeeds; existing objections/bounces/customers are reconciled; email/domain/company test suppression blocks queue | operator action required |  |  |
| Fictitious CLI/control rehearsal | Exactly one no-send rehearsal with fictitious `.test` data covers pre-review/final validation, verification fail-closed evidence, imported and stepped events, fresh queue history blocks, ready/block unit evidence, suppression and report output under the current CLI/runbook | operator action required |  |  |
| Companies House credential | Key is loaded only from the protected operator environment and is absent from Git/browser/logs | owner action required |  |  |
| Companies House live check | Exact known company number returns expected active/type/checked result; mismatch/inactive/unsupported/error fails closed; queue repeats a fresh check | owner action required |  |  |
| Database migrations | The ordered reviewed outreach migrations, including the later sequence-step and sent-cohort reporting upgrades, are applied to the intended project; versions recorded; RLS/grants/constraints/functions/views verified | owner action required |  |  |
| Database reconciliation | Outreach/customer/application rows reconcile without unresolved paid or entitlement mismatches; no destructive correction is hidden | verified | Codex | 26 July 2026; zero production paid rows after the two unsupported statuses were reconciled to analysed; see [verification report](./VERIFICATION-2026-07-26.md) |
| Persisted report analysis audit | A read-only audit proves every existing paid assessment awaiting a report satisfies the current bounded report schema; any rejected legacy row is re-analysed or backfilled through an approved, evidenced process before generation, never silently truncated | owner action required |  |  |
| SPF | Current DNS/provider evidence passes for the exact sending domain/identity | verified | Codex | 26 July 2026 DNS TXT lookup; see [verification report](./VERIFICATION-2026-07-26.md) |
| DKIM | Current DNS/provider evidence passes for the exact sending domain/identity | verified | Codex | 26 July 2026 DNS TXT lookup; see [verification report](./VERIFICATION-2026-07-26.md) |
| DMARC | Exact domain record and monitoring destination are confirmed; policy is monitored and no conflicting record exists | verified | Codex | 26 July 2026 DNS TXT lookup; `p=none` monitoring record; see [verification report](./VERIFICATION-2026-07-26.md) |
| Single seed batch | Exactly one internal/friendly batch, no more than ten messages in aggregate, renders correctly, authenticates, routes replies, and shows no hard bounce, complaint, provider or domain warning; recipients and evidence are outside the prospect campaign | owner action required |  |  |
| Sending identity | `muhammad@brightcert.co.uk` From/Reply-To and monitored inbox are verified; provider ceiling is not used as the operating target | owner action required |  |  |
| Daily pause controls | Every new/follow-up message counts toward the 10–15/day start; maximum 20 until 50 distinct Touch 1 prospects are healthy; maximum 30 only after recorded owner approval; >3% message hard-bounce, any complaint/warning pause are assigned and rehearsed | operator action required |  |  |
| Production checkout | Live product creates the standard £199 checkout and accepts the authorised £100 `FOUNDING10` founding discount to the payable £99 including VAT price | owner action required |  |  |
| Webhook | Successful and failed/replayed live webhook handling is evidenced without secret exposure or false success | owner action required |  |  |
| Entitlement | Successful payment unlocks the matching assessment/report/workspace; failed/unpaid checkout does not | owner action required |  |  |
| Receipt | Live receipt/invoice evidence and amount/currency/tax presentation are correct | owner action required |  |  |
| Refund | Interactive live refund and corresponding entitlement/reconciliation behaviour are evidenced; no refund is inferred from a local row | owner action required |  |  |
| Revenue truth | Stripe object plus application entitlement agree for every row counted paid/refunded; test mode and manual marks are excluded | owner action required |  |  |
| Live/origin commit parity | Intended release commit equals the deployed/live commit and reviewed origin reference; no local-only fix is assumed live | owner action required |  |  |
| Auth verification | Production protected routes redirect correctly; sign-in/callback and signed-in access are tested | owner action required |  |  |
| Social preview | Live Open Graph image/text resolve with the intended 1200×630 asset and current readiness promise | owner action required |  |  |
| PDF/report | Production paid report/PDF generation rejects malformed or oversized persisted analysis before rendering; a valid boundary report preserves beginning/end markers without overflow; content, certification disclaimer and access control are verified | owner action required |  |  |
| Reminder dry-run | Reminder path surfaces provider/API failure, does not record false success, and sends no unintended live reminder | owner action required |  |  |
| Retention job/process | 90-day post-sequence and 180-day personal-data purge process, customer transfer, minimal suppression, operator evidence and owner are scheduled | operator action required |  |  |
| Rights/incident readiness | Inbox monitoring, one-month SAR workflow, immediate objection handling, breach escalation and pause/resume authority are assigned | owner action required |  |  |

## Pre-T0 control boundary

Before T0, run one fictitious/no-send CLI control-path rehearsal and exactly one
internal/friendly seed batch. The seed batch may contain fewer than ten
messages, but never more than ten in aggregate. It does not authorise prospect
contact and does not count towards the 150 Touch 1 prospects. Do not run a
second seed batch before or after T0.

## Go/no-go sign-off

| Record | Value |
|---|---|
| All rows verified | ☐ yes ☐ no |
| Active pause/incident | ☐ none ☐ present |
| Overall decision | ☐ go ☐ no-go |
| Founder/owner | ____________________ |
| Technical reviewer | ____________________ |
| Privacy/legal reviewer | ____________________ |
| Decision timestamp | ____________________ |
| Evidence index | ____________________ |
| Next review | ____________________ |

If the decision is go, set T0 to the first Monday after all rows passed, using
[30-DAY-CALENDAR.md](./30-DAY-CALENDAR.md). On T0, the first campaign record is
one real prospect processed end to end under the
[SOP checkpoint](./SOP.md#t0-first-real-prospect-checkpoint). It counts in the
150; pause after it to confirm the controls, then continue only within the
authorised daily cap. This live checkpoint is not a circular launch-gate row.
Any later failed gate or pause threshold returns the campaign to no-go.
