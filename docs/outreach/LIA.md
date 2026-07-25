# Legitimate Interests Assessment: founding-customer outreach

> **DRAFT — OWNER/LEGAL REVIEW REQUIRED BEFORE FIRST SEND**
>
> This operating record is not legal advice and is not evidence of approval.

| Record | Value |
|---|---|
| Controller | BrightCert |
| Processing owner | ____________________ |
| Assessment date | ____________________ |
| Campaign/version | ____________________ |
| Reviewer | ____________________ |
| Review date | ____________________ |
| Decision | ☐ approved ☐ approved with controls ☐ rejected |
| Owner/legal sign-off | ____________________ |
| Next review/trigger | ____________________ |

The owner must complete and approve this record before setting any prospect's
`lia_status` to `approved`. Reassess it if the audience, data sources, channels,
offer, tooling, retention, or applicable guidance changes.

## Scope

This assessment covers a small, manually sent, English-language founding
customer pilot to UK corporate bodies:

- 120 direct SME prospects and 30 MSP/IT-provider prospects;
- named business contacts at verified corporate work addresses;
- three plain-text emails, stopping on reply, objection, bounce, conversion, or
  closure;
- manual sending by `muhammad@brightcert.co.uk`; and
- optional operator-only storage and reporting.

It excludes sole traders, unincorporated partnerships, consumers, personal or
role inboxes, children, special-category data, automated email sending, open
tracking, bought unverified lists, and any company whose corporate status is
ambiguous. A missing Companies House match blocks sending; it does not establish
that the organisation is a sole trader.

The [ICO's current B2B marketing guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/)
distinguishes corporate subscribers from sole traders and some partnerships,
while making clear that UK GDPR still applies when a named business contact's
personal data is used. Guidance is under review, so the owner must check it
again at sign-off.

## Processing and data

| Item | Limited campaign use |
|---|---|
| People | Relevant directors, owners in a corporate capacity, operations, IT, security, compliance, procurement, and MSP leadership/technical roles |
| Personal data | Name, role, corporate work email, company affiliation, public source URL/date, trigger evidence, and a short business-context personalisation note |
| Company data | Name, domain, company number, legal entity type, status, size band, sector, and Cyber Essentials trigger |
| Sources | Public company websites and business-context pages; Companies House; licensed Clay data used for research and enrichment |
| Operations | Research, validation, exact-number company verification, human review, manual email, suppression, outcome recording, reporting, and retention cleanup |
| Recipients/processors | Authorised BrightCert operators and approved infrastructure/processors described in the public privacy notice; no onward sale |

Do not collect private-life details, inferred sensitive traits, personal email
addresses, phone numbers for this campaign, social-media profiling, or data
unrelated to the contact's professional role.

## 1. Purpose test

### Interests pursued

BrightCert's specific interests are to:

1. identify whether a tightly defined set of UK corporate SMEs has a relevant,
   evidenced Cyber Essentials readiness need;
2. test demand for a free founder-led baseline, reviewed action plan, and
   optional paid workspace/report unlock;
3. learn the language, objections, and workflow needs of prospective direct
   customers and MSP partners; and
4. build a sustainable early customer base without indiscriminate marketing.

Prospects may benefit from a relevant, no-cost readiness baseline or a
partner-assisted client workflow. These interests are commercial but specific
and transparent. Direct marketing can only be a legitimate interest after the
full context-specific three-part test; it is not automatically lawful.

### Legitimacy

The purpose is lawful only if every contact is a verified corporate subscriber,
the message identifies BrightCert, provides a valid reply address and immediate
opt-out, matches an evidence-backed professional need, and all UK GDPR and PECR
controls below are met. The campaign must not imply certification, guaranteed
readiness/pass, or completed remediation in around two hours.

## 2. Necessity test

The proposed processing is targeted and limited:

- contact only 150 verified corporate prospects, not a broad scraped list;
- use one relevant named contact and corporate work address per opportunity
  where practical;
- require a current, documented trigger and human-written relevance check;
- send no more than three short emails on a fixed cadence;
- use reply as the primary CTA rather than behavioural tracking;
- stop immediately on any reply or objection; and
- remove non-converted personal data on the defined schedule.

Less intrusive alternatives were considered:

| Alternative | Assessment |
|---|---|
| General advertising/content only | Less targeted, but does not test one-to-one founder discovery or reach the small, evidenced cohort reliably |
| Contacting generic role inboxes | Avoided by the product gate; less personal data but poorer accountability and relevance |
| Consent request email | The request itself is direct marketing and adds an extra message; it does not remove the need to assess the activity |
| Postal outreach or telephone calls | Requires more data or effort and may be more intrusive; not used in this pilot |
| Automated sequencing/open tracking | Not necessary; expressly excluded |

On that limited design, named business-contact data appears necessary to reach
the person responsible for the evidenced business issue. The owner must reject
the assessment if the same pilot objective can reasonably be achieved with
materially less personal data or less intrusive contact.

## 3. Balancing test

### Reasonable expectations

A person in a relevant senior, operational, IT, security, compliance, or MSP
role may reasonably expect a concise business email connected to a public
procurement, renewal, customer-assurance, or service signal. They are less
likely to expect contact where the source is obscure, stale, personal, unrelated
to their role, or obtained without clear provenance. A strong or medium trigger
under [ICP.md](./ICP.md) is therefore mandatory.

No prior relationship is assumed. That weighs against BrightCert and is
mitigated by the narrow cohort, professional context, plain identity, short
sequence, no surveillance, and unconditional objection route.

### Likely impact

Expected impact is limited inbox interruption and the possibility of surprise,
annoyance, mis-targeting, unwanted profiling, or disclosure of a work address.
Higher-impact risks include contacting an individual subscriber by mistake,
using inaccurate data, continuing after objection, exposing a prospect file, or
creating pressure through misleading claims.

The campaign does not make consequential automated decisions, use sensitive
data, monitor opens, or combine professional data with private-life profiles.
The recipient can object by replying or emailing BrightCert, without giving a
reason.

### Safeguards

- exact company-number and active corporate-type verification through Companies
  House at queue time;
- sole traders and unincorporated partnerships excluded; ambiguity blocks;
- verified corporate-domain email only; personal, disposable, and role
  addresses blocked;
- public business-context or licensed sources with URL and date lineage;
- one documented trigger, meaningful personalisation note, LIA status, and
  timestamped human approval per prospect;
- suppression screening before every touch and append-only minimal suppression
  evidence;
- manual sending from an identified founder address;
- one low-friction reply CTA and a privacy/objection notice in every email;
- immediate stop on any reply and same-day opt-out handling;
- no open pixels, open-rate reporting, cookies, or automated sender;
- private ignored CSV paths, least access, and no prospect data in Git;
- delivery pause thresholds in [SOP.md](./SOP.md); and
- 90-day post-sequence operational retention, with non-converted personal data
  removed no later than 180 days.

## Right to object and requests

The right to object to processing for direct marketing is unconditional. On an
objection, stop marketing immediately, add the minimum suppression evidence the
same day, and do not require a reason. Follow
[DATA-FLOW-AND-RETENTION.md](./DATA-FLOW-AND-RETENTION.md) and
[SOP.md](./SOP.md).

Treat any request for access, deletion, source information, correction, or
restriction as a rights request even if it does not use formal language. Route
it through the process in [SOP.md](./SOP.md). The
[ICO subject access guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/subject-access-requests/a-guide-to-subject-access/)
requires a response without undue delay and ordinarily within one month;
identity checks must be proportionate.

## Retention and review

- Keep active sequence records only as needed to operate the sequence and for
  up to 90 days after it ends.
- Remove non-converted prospect personal data by 180 days after sequence end.
- Move converted customers into normal customer records governed by the
  customer retention notice; do not retain duplicate outreach copies merely
  because they converted.
- Retain only the minimum immutable suppression evidence needed to prevent
  re-contact after an objection or bounce.
- Review this LIA before each materially different campaign and at the next
  review date above.

## Draft conclusion

Subject to completed owner/legal review, the current narrow corporate B2B design
may be capable of meeting the purpose, necessity, and balancing tests because it
uses limited professional data, a verified trigger, manual review, a short
sequence, no open tracking, immediate objection handling, and short retention.

This is not an approval. Sending remains **no-go** until the sign-off fields are
completed and every item in [LAUNCH-GATE.md](./LAUNCH-GATE.md) is passed.
