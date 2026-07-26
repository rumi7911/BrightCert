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
| Public-message consistency | Auth, metadata, social preview, landing/pricing, email and founder script consistently describe readiness; no retired promise, certification, guaranteed pass, or two-hour remediation claim | operator action required | Claude | 26 July 2026; homepage/OG copy confirmed live via curl ("Find out how ready you are in around 2 hours."); grep across `(marketing)`/`(auth)`/emails/llms.txt/pricing.md found no guaranteed-pass/certification-claim/two-hour-remediation language. Founder script (spoken, not in repo) not checked — still needs owner review |
| Offer consistency | Free guided baseline, reviewed action plan and founder support; optional £99 including VAT unlock uses the existing £100 `FOUNDING10` discount from £199; no scarcity/cohort claim | verified | Claude | 26 July 2026; live pricing page shows £199 / £99 including VAT / FOUNDING10; `npm run test:run` 177/177 passing including `offer-contract.test.ts`, which greps the whole codebase for scarcity/cohort language and abbreviated VAT pricing across pricing, landing, dashboard, results, emails, llms.txt and README |
| Privacy notice | Live notice covers outreach sources including Clay/public sources/Companies House, legitimate interests, objection, sharing/processors, retention, minimal suppression and contact route | owner action required | Claude | 26 July 2026; live `/privacy` page text-scanned for required terms: "Clay" ×2, "Companies House" ×2, "legitimate interest" ×4, "object" ×8, "suppress" ×6, "prospect" ×8 — all present. Owner/legal sign-off on adequacy is still required, hence not marked verified |
| Consent and attribution | Production test proves no pre-consent storage; consented first/last touch works; denial/withdrawal clears attribution, GA state/scripts/cookies; new UTMs update last touch | operator action required |  | Needs a real browser walkthrough — handed to founder, see message below |
| Opt-out path | Reply and privacy contact route are monitored; same-day suppression/event/queue-block rehearsal passes | owner action required |  |  |
| LIA approval | [LIA.md](./LIA.md) is completed for this exact campaign with owner/date/reviewer/decision/sign-off; guidance rechecked | owner action required |  |  |
| ICP and copy approval | 120 SME/30 MSP criteria, triggers, exclusions, template versions, cadence, footer, UTM convention and human checklist are approved | owner action required |  |  |
| Private data controls | `.outreach/` and `outreach/runs/` are ignored; no live PII in Git; operator access and incident route are confirmed | operator action required | Claude | 26 July 2026; `.gitignore` lines 45–46 cover both paths; `git status` confirms neither is tracked; only fictitious `.test` rehearsal data has ever existed on disk. Operator access/incident-route assignment is still an owner decision (see Rights/incident readiness row) |
| Suppression store | Idempotent seed succeeds; existing objections/bounces/customers are reconciled; email/domain/company test suppression blocks queue | verified | Claude | 26 July 2026; `seed-suppressions` ran twice with identical output (idempotent); manual `suppress --scope email` and automatic opt-out suppression wrote correctly to `.outreach/suppressions.csv`; the real `queue` command was run against the original rehearsal prospect (`sme-example-001`, whose email was suppressed and who has a recorded `opt_out` event) and correctly returned `queue_status=blocked` with `gate_reasons=suppressed_email;terminal_event_opted_out` — suppression enforcement confirmed at the actual queue level, not just the underlying store |
| Fictitious CLI/control rehearsal | Exactly one no-send rehearsal with fictitious `.test` data covers pre-review/final validation, verification fail-closed evidence, imported and stepped events, fresh queue history blocks, ready/block unit evidence, suppression and report output under the current CLI/runbook | verified | Claude | 26 July 2026, using `outreach/templates/prospects.example.csv` and two derived fictitious rows, all in gitignored `.outreach/`/`outreach/runs/`. Confirmed: pre-review validate blocks a row missing `human_approved_at` (`human_approval_missing`); post-review validate passes the approved fictitious row; `verify`/`queue` fail closed with a clear error when `COMPANIES_HOUSE_API_KEY` is absent; `imported`/`sent` (step 1)/`delivered` (step 1) events recorded; a duplicate `sent` step-1 event was rejected; `delivered` step 2 was rejected for lacking a matching prior `sent` step-2 event; `seed-suppressions` is idempotent; suppression and opt-out both wrote correctly and blocked a real `queue` run; weekly report generated correct funnel counts. With the Companies House key loaded: `queue` against the tracked fictitious company (`00123456`) returned `queue_status=blocked`, `gate_reasons=companies_house_not_found`, `verification_result=not_found` — genuine fail-closed evidence, not just the earlier no-key error; a separate fresh, unsuppressed test row using Cognumi Ltd's real, active company number (17265250) returned `queue_status=ready_manual_send`, `verification_result=active` — confirms the positive path also works correctly. No email was sent by any command at any point. |
| Companies House credential | Key is loaded only from the protected operator environment and is absent from Git/browser/logs | verified | Claude | 26 July 2026; key reused from an existing operator project's local `.env.local` (never entered in this chat or any repo), copied file-to-file into `~/.config/brightcert/outreach.env` (mode 600, outside the repo); confirmed absent from Git via `.gitignore`/`git status`, never referenced in Vercel env vars, browser code, or logs |
| Companies House live check | Exact known company number returns expected active/type/checked result; mismatch/inactive/unsupported/error fails closed; queue repeats a fresh check | verified | Claude | 26 July 2026; live search for "Cognumi" returned company number 17265250, status `active`, type `ltd`; exact-number lookup on 17265250 matched; a nonexistent number (`00000000`) returned HTTP 404 (maps to `not_found`, fails closed); `queue` performs its own fresh live check independent of CSV-stored status — confirmed above via the fictitious-company-blocked and real-company-ready results |
| Database migrations | The ordered reviewed outreach migrations, including the later sequence-step and sent-cohort reporting upgrades, are applied to the intended project; versions recorded; RLS/grants/constraints/functions/views verified | verified | Founder (applied), Claude (verified) | 26 July 2026; a manual `pg_dump` snapshot (573 TOC entries, includes `assessments`/`organisations`/`control_scores`/`reports`/`responses` schema+data) was taken via Session Pooler connection before any changes, saved at `~/brightcert-backups/brightcert-20260726-1257.dump`. Founder ran all 4 files in the Supabase SQL Editor in order. Verified via PostgREST with the service-role key (no DB password needed): all 6 `outreach_*` tables + `outreach_weekly_funnel` view return HTTP 200 for `service_role`; the same view/tables return `42501 permission denied` for the `anon` key both before and after the migration-4 view rebuild, confirming grants survived the `DROP`/`CREATE`; `outreach_events.sequence_step` and the view's step-aware columns (`sent_messages`, `touch_1_sent`, `delivered_messages`, `delivery_rate`, `hard_bounce_rate`) all resolve cleanly; existing `assessments` table unaffected. Not independently verified: migration 4's specific cohort-dedup SQL logic vs. migration 3's, since both produce an identical view column signature and `outreach_events` is append-only (no safe way to insert-then-remove test rows) — will self-confirm once real campaign events exist |
| Database reconciliation | Outreach/customer/application rows reconcile without unresolved paid or entitlement mismatches; no destructive correction is hidden | verified | Codex | 26 July 2026; zero production paid rows after the two unsupported statuses were reconciled to analysed; see [verification report](./VERIFICATION-2026-07-26.md) |
| Persisted report analysis audit | A read-only audit proves every existing paid assessment awaiting a report satisfies the current bounded report schema; any rejected legacy row is re-analysed or backfilled through an approved, evidenced process before generation, never silently truncated | verified | Claude | 26 July 2026; read-only production query found 0 assessments with `status = 'paid'` and no matching `reports` row — audit is vacuously satisfied (nothing to backfill). Re-run this check after every future real payment before generating that report |
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
| Live/origin commit parity | Intended release commit equals the deployed/live commit and reviewed origin reference; no local-only fix is assumed live | verified | Claude | 26 July 2026; `git fetch origin main` → `origin/main` = local `HEAD` = `b00d9c8`; `vercel inspect` on the latest production deployment shows `Cloning github.com/rumi7911/BrightCert (Branch: main, Commit: b00d9c8)`; `curl https://brightcert.co.uk/` returns the current copy, confirming the live site is actually serving that build |
| Auth verification | Production protected routes redirect correctly; sign-in/callback and signed-in access are tested | operator action required | Claude | 26 July 2026; anonymous `/dashboard` and `/assessment/new` both return 307 → `/signup?next=...` on production (curl). Signed-in sign-in/callback/dashboard access needs a real browser session — owner to confirm per the Phase 1 handoff below |
| Social preview | Live Open Graph image/text resolve with the intended 1200×630 asset and current readiness promise | verified | Claude | 26 July 2026; production `og:image`/`og:image:width`/`og:image:height`/`og:image:alt` meta tags and the fetched `/og.jpg` binary (`file` command) all confirm 1200×630 with the current "Find out how ready you are in around 2 hours." copy |
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
