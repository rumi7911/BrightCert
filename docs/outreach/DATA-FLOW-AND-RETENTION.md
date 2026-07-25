# Outreach data flow and retention

This policy covers the founding-customer campaign only. It should be read with
the [LIA](./LIA.md), [ICP](./ICP.md), [SOP](./SOP.md), and canonical
[operator runbook](./operator-runbook.md).

## Controlled flow

```text
public business sources / licensed Clay data
                    |
                    v
        private canonical CSV research
          (.outreach/prospects.csv)
                    |
                    v
 pre-review validate -> human review in canonical CSV
                    |
                    v
       final validate from canonical CSV
                    |
                    v
    exact-number Companies House verification
                    |
                    v
      global suppression + event history
                    |
                    v
  fresh queue check -> ready_manual_send only
                    |
                    v
 manual plain-text send by founder (no open tracking)
                    |
                    v
 reply/delivery/outcome events + same-day suppression
                    |
                    v
 optional private Supabase records -> weekly report
                    |
          +---------+----------+
          |                    |
          v                    v
 customer record       non-converted expiry purge
                               |
                               v
                  minimal immutable suppression only
```

Clay is research tooling, not a sender or decision-maker. It may enrich a
candidate record from licensed or public business-context sources. It must not
approve the LIA, invent a trigger, set human approval, or send an email.

## Data by stage

| Stage | Data and action | Owner | Required control |
|---|---|---|---|
| Research | Company, contact, role, corporate email, source URL/date, trigger evidence | Research operator | Public business context or licensed data only; private ignored path |
| Validation | Pre-review research reasons, then a final reviewed snapshot generated from `.outreach/prospects.csv` | Outreach operator | Human edits only the private canonical file; generated outputs preserve every row and blocked is not approved |
| Company verification | Exact company number, type, status, checked timestamp | Outreach operator | Server/operator environment key; no key or raw payload in Git/logs |
| Human approval | ICP relevance, source accuracy, LIA coverage, email copy | Founder/approved reviewer | Timestamped approval; ambiguity blocks |
| Queue | Suppression, event history, fresh Companies House result | Outreach operator | `ready_manual_send` is mandatory |
| Manual send | Recipient, subject, plain-text body, timestamp | Founder | From `muhammad@brightcert.co.uk`; no open pixel |
| Outcome | Sent/delivery/bounce/reply/objection/funnel event | Founder/operator | Record message events promptly with exact sequence step; update state in the private canonical file and re-run final validation/verification before a later touch |
| Optional database | Campaign, company, prospect, append-only events, send attempts, suppressions | Authorised service-role/operator | RLS, no public/anon/authenticated access |
| Reporting | Aggregated weekly funnel by approved dimensions | Founder | No opens/open rates; avoid exporting row-level PII |
| Disposal | Purge expired personal fields; preserve minimum suppression | Data owner/operator | Review evidence and record purge run |

## Purpose limitation and access

- Use the data only to qualify, operate, suppress, measure, and audit this
  campaign or to handle a rights request.
- Do not enrich private-life profiles, infer sensitive data, resell the list,
  upload it to an unapproved tool, or reuse it for a different campaign without
  a new purpose/LIA review.
- Restrict live CSVs, event stores, exports, inbox access, and optional database
  access to authorised operators. Do not commit them, paste them into tickets,
  or include them in screenshots or logs.
- Keep the Companies House key only in the operator environment described in
  the [runbook](./operator-runbook.md).

## Lifecycle and retention

| Record | Retention rule | End action |
|---|---|---|
| Rejected candidate | Delete as soon as the rejection/research check is complete unless a short audit need is documented | Remove personal fields and working copies |
| Active sequence | Keep only while needed to run the sequence | Stop immediately on terminal event |
| Non-converted prospect | May be retained for operational follow-up up to 90 days after sequence end; remove personal data no later than 180 days after sequence end | Clear work email and any prospect email fingerprint, contact, role, source/evidence, personalisation, and metadata |
| Non-personal funnel event | Keep only for documented reporting/accountability needs | Review under normal records schedule |
| Opt-out/bounce suppression | Minimal evidence needed to prevent re-contact | Retain separately; do not use it for marketing or restore it to prospect data |
| Converted customer | Move necessary data to normal customer/application records | Remove duplicate outreach personal data when no longer needed |
| Rights/incident record | Retain under the applicable legal/accountability schedule | Limit access and delete when that schedule ends |

The operator-only database function
`purge_expired_outreach_prospect_personal_data()` clears expired prospect
personal fields. It does not justify keeping a linkable email fingerprint for
ordinary expired prospects. Only a separate opt-out/bounce suppression record
retains the minimum evidence required to avoid re-contact.

The data owner must schedule at least a weekly expiry review during the pilot
and a final review after the last sequence. Record when the cleanup ran, the
time boundary used, the number of affected records, and any exception. Do not
copy deleted personal data into the cleanup log.

## Replies, objections, and rights requests

Any reply stops later touches immediately, even if the operator has not yet
classified it. An objection or opt-out requires same-day handling:

1. stop every queued/drafted touch;
2. record `opt_out`, which writes email suppression evidence before the event;
3. check that the suppression now blocks a fresh queue;
4. acknowledge briefly if appropriate, without marketing; and
5. retain only the minimum suppression evidence.

Requests for access, correction, erasure, restriction, source information, or
objection can arrive in ordinary language by reply or through the contact
address in the privacy notice. Log receipt, verify identity proportionately,
search all private CSV/event/database/inbox locations, and use the rights
procedure in [SOP.md](./SOP.md). Do not erase the minimal suppression record if
doing so would create a material risk of re-contact; explain the limited reason
for retaining it.

## Tracking and attribution

There is no open tracking, tracking pixel, or open-rate metric. Reply,
delivery/bounce evidence, booked calls, baselines, checkout, and verified
payment are the permitted funnel evidence.

UTM attribution is optional and must follow [SOP.md](./SOP.md). BrightCert only
captures campaign UTMs after analytics consent; denial or withdrawal removes
attribution and analytics state. Do not add cookies or browser storage to work
around that control.

## Incident handling

If a live file is committed, shared to the wrong recipient, uploaded to an
unapproved service, or accessed unexpectedly:

- pause research and all sends immediately;
- preserve minimal incident evidence without spreading the data;
- notify the data owner the same day;
- remove public/shared access using the approved incident process;
- assess affected people, data, systems, and notification duties; and
- document the decision and safe recovery before resuming.

Do not rewrite shared Git history or delete material incident evidence without
owner approval. The detailed pause/resume checklist is in [SOP.md](./SOP.md).
