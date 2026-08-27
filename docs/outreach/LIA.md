# Legitimate Interests Assessment: founding-customer outreach

> **APPROVED WITH CONTROLS**
>
> This operating record is not legal advice. The owner completed a documented
> self-review and approved the controls on 26 July 2026.
>
> **Amendment 1 — 6 August 2026 — WITHDRAWN, NOT APPROVED.** Adding the
> NCSC/IASME certificate register as a source was proposed and then withdrawn
> the same day: the register's own page prohibits use for marketing or data
> research. **The approved source list is unchanged.** The register must not be
> used to find, qualify, or evidence prospects. See
> [Amendment 1](#amendment-1--withdrawn--ncsciasme-certificate-register).
>
> **Amendment 2 — 27 August 2026 — DRAFT, NOT APPROVED.** A narrowing proposal
> that would permit a public digital certificate page to *corroborate* a date for
> a company already found through an approved source, while leaving the discovery
> prohibition intact. **It is unsigned and not in force**, and it must not be
> cited as authority. One prospect record already cites it in error — see
> [Amendment 2](#amendment-2--draft-not-approved--public-digital-certificate-pages-as-corroboration).

| Record | Value |
|---|---|
| Controller | Cognumi Ltd, trading as BrightCert |
| Processing owner | Muhammad Sohaib Roomi |
| Assessment date | 26 July 2026 |
| Campaign/version | `founding_pilot_2026`; `sme-v1` and `msp-v1` |
| Reviewer | Muhammad Sohaib Roomi (self-review) |
| Review date | 26 July 2026 |
| Decision | ☒ approved with controls ☐ approved ☐ rejected |
| Owner/legal sign-off | Muhammad Sohaib Roomi, owner approval provided 26 July 2026 |
| Guidance evidence date | 26 July 2026 |
| Next review/trigger | Day 30 review, or earlier if the audience, sources, channel, offer, tooling, retention, or applicable guidance changes |

The owner must complete and approve this record before setting any prospect's
`lia_status` to `approved`. Reassess it if the audience, data sources, channels,
offer, tooling, retention, or applicable guidance changes.

## Current guidance check

The draft was rechecked on 26 July 2026 against the ICO's:

- [business-to-business marketing guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/);
- [legitimate-interests guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/legitimate-interests/), last updated 23 March 2026;
- [guidance on applying and documenting the three-part test](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/legitimate-interests/how-do-we-apply-legitimate-interests-in-practice/); and
- [guidance on respecting direct-marketing preferences and suppression](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/direct-marketing-guidance/respect-peoples-preferences/).

The current guidance supports the controls used here: corporate-subscriber
verification, a documented purpose/necessity/balancing assessment, sender
identity and a valid opt-out address, privacy information no later than the
first communication, an unconditional stop when a named contact objects, and a
minimal suppression record rather than later re-contact. The B2B marketing
guidance is marked by the ICO as under review following the Data (Use and
Access) Act, so a material guidance update triggers reassessment before further
sends.

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
| Sources | Public company websites and business-context pages; Companies House; licensed Clay data used for research and enrichment. **Not** the NCSC/IASME certificate register — see [Amendment 1](#amendment-1--withdrawn--ncsciasme-certificate-register) |
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

---

## Amendment 1 — WITHDRAWN — NCSC/IASME certificate register

| Record | Value |
|---|---|
| Proposed | 6 August 2026 |
| **Withdrawn** | **6 August 2026, same day, before approval** |
| Outcome | **Rejected. The approved source list is unchanged.** |
| Reason | The register's own page prohibits use for marketing or data research |

This record is kept rather than deleted so the question is not reopened without
the reason being visible.

### What was proposed

Adding the public NCSC/IASME Cyber Essentials certificate register
(<https://iasme.co.uk/cyber-essentials/ncsc-certificate-search/>) as a source,
to supply the `renewal` trigger. It is the only public source carrying a dated
Cyber Essentials expiry, and [ICP.md](./ICP.md) rates published
certification expiry as a Strong trigger.

### Why it was withdrawn

The certificate search page states:

> Please note this search function is solely for the use of checking
> certification and must not be used for marketing, data research, or any other
> purpose.

That prohibits both intended uses — finding prospects (data research) and
evidencing outreach (marketing). The page is also behind a Cloudflare human
verification challenge, and the search refuses an empty query, which is
consistent with the stated restriction rather than incidental to it.

This is not a technicality that a careful LIA could work around:

- **The balancing test cannot survive it.** §3 turns on whether a contact would
  reasonably expect the approach given the source. A source used in direct
  breach of its own stated terms fails that limb on its face, and no safeguard
  elsewhere in this record compensates.
- **The safeguard in §3 requires "public business-context or licensed sources
  with URL and date lineage."** A source whose licence terms exclude this use is
  not a licensed source for this use.
- **Reputational exposure is severe and specific.** IASME is the accreditation
  body for the scheme BrightCert sells readiness for. Mining their register to
  cold-email their certificate holders, against their published terms, risks the
  one relationship the business can least afford to damage — and BrightCert
  already has to be careful to state it is not a Certification Body.

### Narrow use that remains permitted

Checking the certification status of a company already identified through an
approved source is what the page says the search is for, and is unaffected.

But that use cannot feed the campaign: the register may not be cited as
`trigger_evidence_url`, and an expiry date read from it may not become the
reason for an email. A `renewal` trigger must be evidenced from the **company's
own published material** — its trust page, certificate badge, or an
announcement it made itself — which falls under the already-approved "public
company websites and business-context pages".

### Consequence

[TRIGGER-RESEARCH-METHOD.md](./TRIGGER-RESEARCH-METHOD.md) named the register as
its primary source for the direct-SME segment. That section is withdrawn there
too. Sources B (Contracts Finder) and C (company assurance material) are
unaffected and become primary.

---

## Amendment 2 — DRAFT, NOT APPROVED — public digital certificate pages as corroboration

| Record | Value |
|---|---|
| Proposed | 27 August 2026 |
| Status | **Draft. Not approved. No sign-off given.** |
| Prepared by | Claude, at the owner's request |
| Owner decision | ☐ approved with controls ☐ approved ☐ rejected — *unsigned* |
| Decision date | *blank until the owner signs* |

**Nothing in this amendment is in force.** Until the owner completes the
decision row above, the approved source list remains as stated in
[Processing and data](#processing-and-data) and Amendment 1 stands unmodified.

### Why this is being written

On 16 August 2026 Utonomy Ltd was added to the canonical prospect ledger as a
`candidate`, and `.outreach/utonomy-lia-2026-08-16.md` records its decision as
*"Pass in principle under campaign LIA Amendment 2"*. The `go-no-go` review of
the same date records `lia_assessment = pass_amendment_2`.

**No Amendment 2 existed.** The account-level assessment is careful and its
purpose, necessity and balancing reasoning is sound, but the campaign-level
authorisation it cites was never written into this record. This draft exists to
close that gap — in one direction or the other — before anything is sent.

Utonomy has not been contacted. The row is `candidate` with `human_approved_at`
deliberately blank, so nothing has gone out on an authority that did not exist.

### What is proposed

That `registry.blockmarktech.com` organisation certificate pages may be used to
**corroborate** a certification date for a company already identified through an
already-approved source — and for nothing else.

Specifically permitted:

- Reading one organisation's certificate page to confirm or date a Cyber
  Essentials claim the company already makes in its own published material.
- Recording that date in the account-level assessment as a supporting fact.

Specifically **not** permitted, and unchanged from Amendment 1:

- **Discovery.** Browsing, searching, filtering or sorting any certificate
  registry to find companies by expiry date, renewal window, scope, location or
  size. This is the "data research" use Amendment 1 rejected, and it stays
  rejected regardless of which host serves the page.
- **Bulk extraction** of registry records by any means.
- Citing a registry URL as `trigger_evidence_url`. That field must continue to
  point at the **company's own published material**, per Amendment 1.
- Using a registry-read expiry date as the *reason* an email is sent, where the
  company has published no certification claim of its own.

### Why the distinction is drawn there

Amendment 1 rejected the NCSC/IASME certificate register because its search page
states the function *"must not be used for marketing, data research, or any
other purpose"*. That wording restricts the **search function**. It is the
mechanism of finding companies that it forbids, and this draft does not seek to
reopen that.

Two things were checked on 27 August rather than assumed, which is the discipline
Amendment 1 was written to enforce:

1. **BlockMark's own terms carry no equivalent prohibition.** The terms page
   restricts reproducing, publishing or redistributing website content without
   permission. It says nothing about marketing, data research, bulk extraction
   or automated access of registry records. This is a materially weaker
   restriction than IASME's, and it is the reason this draft is arguable at all.
2. **The organisation page sits behind a human-verification challenge.** That
   is a signal about automated access irrespective of the written terms, and it
   is why manual, one-account-at-a-time reading is a control below rather than
   an incidental detail.

The substantive argument for corroboration is that a certificate the holder has
made publicly inspectable is closer to a trust badge than to a mined database
record, *provided the company was not found by mining*. The argument against is
that the page is hosted and controlled by the certification platform rather than
by the company, and that a company which displays "Cyber Essentials" without
publishing a date has not itself chosen to publish that date. Both are real; the
controls below are drawn to keep the first true and the second immaterial.

### Controls, if approved

1. Manual reading of one named organisation's page at a time. No crawler, no
   scripted retrieval, no stored copy of the page beyond the URL and the single
   date fact.
2. The company must already have been identified through an approved source and
   must already make a Cyber Essentials claim in its own published material. The
   registry may confirm a claim; it may not create one.
3. `trigger_evidence_url` points at the company's own page. The registry URL, if
   recorded at all, belongs in the account-level assessment as corroboration.
4. The message may not state or imply that certification is lapsing, outstanding
   or at risk, and may not quote the expiry date back to the recipient.
5. Every use is logged in the account-level assessment with the date read.

### The open question the owner must answer first

**How were Utonomy and Gemsatwork actually found?**

`.outreach/remaining-cohort-progress-2026-08-16.md` records the ICP as "UK
active companies with 10 to 100 employees, **a public Cyber Essentials or Cyber
Essentials Plus renewal between September and November 2026**". A date-range
filter of that kind cannot be applied to company websites, because almost no
company publishes its expiry date. Both Utonomy's and Gemsatwork's dates are
cited to `registry.blockmarktech.com`. H.W. Coates' date, by contrast, came from
the company's own accreditations page and is clean.

If those two companies were found **by searching a registry for a renewal date
range**, that is the discovery use this amendment does not permit and Amendment 1
rejected — and approving this draft would not cure it, because the defect is in
how the candidate was found, not in how the date was later evidenced.

If Utonomy was found another way and the registry was consulted afterwards, it
falls inside what is proposed here.

Only the owner knows which happened. **This draft cannot be approved without
that answer.**

### Consequence for the Utonomy row either way

As it currently stands, `prospects.csv` cites
`https://registry.blockmarktech.com/organisations/GBLTD09612773/` as
`trigger_evidence_url`. **Control 3 above would not permit that**, so the row
needs correcting before any send even on the permissive outcome:

- Re-point `trigger_evidence_url` at `https://utonomy.co.uk/about-us/`, which
  is where Utonomy makes its own Cyber Essentials claim and is an
  already-approved source.
- Keep the registry URL only in `.outreach/utonomy-lia-2026-08-16.md` as
  corroboration of timing.
- Correct that file's decision line, which currently cites an amendment that did
  not exist when it was written.

### If rejected

Utonomy is re-sourced from its own site or dropped. Its own material supports a
Cyber Essentials claim but no date, so the `renewal` trigger would weaken to an
undated certification claim, and [ICP.md](./ICP.md) should decide whether that
clears the bar. Gemsatwork is dropped, its size evidence being unresolved in any
case. Nothing else in the ledger depends on this amendment.
