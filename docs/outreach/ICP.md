# Ideal customer profile and exclusion checklist

This campaign is UK-only, English-only, corporate B2B. Every prospect must pass
this document, the [LIA](./LIA.md), the
[Clay CSV contract](./CLAY-CSV-CONTRACT.md), and the fresh queue checks in the
[operator runbook](./operator-runbook.md).

## Campaign mix

| Segment | Verified Touch 1 prospects | Purpose |
|---|---:|---|
| Direct SME | 120 | Test the founder-led readiness baseline and paid unlock |
| MSP/IT provider | 30 | Test a partner-assisted pilot for one suitable client |
| Total | 150 | Distinct, verified corporate prospects |

Do not dilute one segment to make up a shortfall in the other. A missing or
ineligible record is replaced with another verified record in the same segment.

## Direct SME profile

All criteria are required:

- UK corporate body with a supported Companies House type and active status;
- approximately 10–100 staff, recorded as a sourced employee band rather than
  false precision;
- a corporate-domain work email for a relevant named contact;
- a current, public, business-context Cyber Essentials trigger;
- likely to care about tender eligibility, customer trust, supply-chain
  assurance, renewal, or a clear readiness deadline; and
- no current BrightCert customer relationship or suppression.

Good-fit roles, in order of likely ownership:

- operations director/manager or managing director in a corporate capacity;
- IT manager, head of IT, security lead, or technical director;
- compliance, risk, quality, or information-governance lead; and
- procurement/bid lead only where the trigger and responsibility are explicit.

Do not use shared role accounts such as `info@`, `security@`, `operations@`, or
`procurement@`; the CLI blocks them even where the role itself is relevant.

## MSP/IT-provider profile

All criteria are required:

- active UK corporate body with a supported Companies House type;
- supports UK SMEs and can nominate one appropriate corporate client;
- named founder, managing director, service-delivery leader, technical
  director, vCISO/security lead, or partnerships lead;
- an evidence-backed signal that Cyber Essentials readiness or client evidence
  handling is relevant; and
- no obvious competing readiness assessment/evidence-workspace product.

An MSP that offers general cyber support is not automatically a competitor.
Disqualify when its public materials show a directly competing readiness
assessment or evidence workspace that would make the proposed pilot
misleading or irrelevant. Record the evidence URL and rationale.

## Allowed sectors

Sector alone never establishes eligibility. The following are in scope where
the corporate, email, trigger, LIA, source, suppression, and human-review gates
also pass:

- professional and business services;
- manufacturing and engineering;
- construction and property services;
- technology and software;
- logistics and supply-chain services;
- multi-site retail, hospitality, and leisure businesses;
- corporate charities/social enterprises with a supported legal entity type;
- private healthcare or care providers, provided no patient or special-category
  data is collected; and
- MSPs and IT support providers serving UK SMEs.

Public bodies, schools, and other organisations may have distinct procurement
or legal structures. They are out of this pilot unless the owner explicitly
extends the approved ICP and LIA before research.

## Evidence-backed triggers

The trigger must be current, relevant to the contact's role, supported by a
public business-context URL, and summarised without inference beyond the source.

For *how* to find these — the sources, the order to check things in, and the
expected throughput — see
[TRIGGER-RESEARCH-METHOD.md](./TRIGGER-RESEARCH-METHOD.md). This document sets
the standard; that one is the method for meeting it.

| Strength | Examples | Decision |
|---|---|---|
| Strong | Live tender/framework requires or scores Cyber Essentials; published certification expiry/renewal; customer or supply-chain requirement naming Cyber Essentials; dated contract deadline | Eligible if all other gates pass |
| Medium | Public bid/procurement page shows relevant government or supply-chain work; client assurance material names Cyber Essentials; MSP publicly offers Cyber Essentials support but lacks a readiness/evidence workspace | Eligible only after human review connects the signal to the named role |
| Weak | Generic cyber-security page, undated compliance claim, broad growth announcement, assumed need based only on sector/size, or a source more than reasonably current for the stated trigger | Block; research a better trigger or exclude |
| Prohibited | Private-life information, inferred vulnerability, scraped personal post unrelated to work, fabricated or inaccessible evidence, or a source with unclear rights/provenance | Exclude |

Examples of acceptable trigger labels include `tender_requirement`,
`renewal`, `customer_assurance`, `supply_chain`, and `msp_client_service`.
Use one stable label in `trigger` and put the factual explanation in
`personalisation_note`.

## How a candidate was found is itself a gate

A trigger can be strong and the row still be ineligible, because the strength
table above rates the *evidence* and says nothing about the *search*. Both are
gates and they fail independently.

**Record the discovery method for every row.** The research ledger carries a
`source` column for this. It is not bookkeeping: on 28 August 2026 it was the
only thing that could distinguish a company found from its own website from one
found by searching a certificate registry, months after anyone could recall the
difference. Write it at the moment of research, and name the method rather than
the artefact — `first_party_renewal` says how the company surfaced;
`public_digital_certificate` only says what was read.

**A renewal window is not a search filter.** Do not express the target set as
companies whose certificate expires inside a date range. Almost no company
publishes its expiry date on its own site, so a date-range filter can only be
satisfied by searching a certificate registry. No certificate registry is
approved as a discovery route: the NCSC/IASME register is prohibited outright by
[LIA Amendment 1](./LIA.md#amendment-1--withdrawn--ncsciasme-certificate-register),
and the narrow BlockMark permission granted in Amendment 2 covers *evidencing* a
date for a company already identified, expressly not bulk discovery.

A filter of that shape reads as a targeting criterion and functions as an
instruction to search a source that is not approved for searching. It is how the
one registry-discovered row in the August batch was generated — see the sourcing
audit in
[TRIGGER-RESEARCH-METHOD.md](./TRIGGER-RESEARCH-METHOD.md#sourcing-audit-28-august-2026).

The `renewal` trigger itself is unaffected and remains Strong. What changed is
the direction of travel: find the company first through an approved source, then
establish whether it has a renewal need, and only then date it. Never start from
the date.

A row whose only certification evidence is a registry page, with no first-party
Cyber Essentials claim on the company's own current site, fails the campaign's
approved conditions no matter how good the fit otherwise looks. Hold it and go
looking for the company's own statement; do not send on the registry alone.

## Disqualifiers

Exclude or block a record when any of the following applies:

- outside the UK, non-English campaign requirement, consumer, sole trader, or
  unincorporated partnership;
- no exact Companies House match, inactive company, unsupported company type,
  or mismatch between the supplied and returned company number;
- fewer than approximately 10 or more than approximately 100 staff for the
  direct SME segment, unless the ICP is formally revised;
- personal/free-mail, disposable, role, unverified, or company-domain-mismatched
  address;
- no named relevant role, source URL/date, trigger evidence URL, or meaningful
  personalisation note;
- weak, stale, unverifiable, or private-context trigger;
- no approved campaign LIA or timestamped human review;
- existing customer, duplicate prospect/email, prior objection, bounce,
  suppression match, or stopped sequence;
- MSP with an obvious competing readiness/evidence product;
- request for certification, guaranteed pass, or remediation BrightCert does
  not provide; or
- any concern that cannot be resolved from reliable evidence.

**Ambiguity blocks.** A missing Companies House match does not prove
sole-trader status. Do not contact the record; research the legal entity or
replace it.

## Human qualification checklist

Before setting `human_approved_at`:

- [ ] Segment is exactly `sme` or `msp`, with the 120/30 mix still on track.
- [ ] Exact corporate identity, active status, and supported type are evidenced.
- [ ] Direct SME size is approximately 10–100 staff, or MSP serves UK SMEs.
- [ ] Named role can reasonably act on the evidenced trigger.
- [ ] Work email is corporate, verified, non-role, and matches the company
  domain.
- [ ] Source and trigger evidence are public/licensed, dated, reachable, and
  accurately summarised.
- [ ] Trigger is strong or human-approved medium; it is not inferred from sector
  alone.
- [ ] MSP has no obvious directly competing readiness/evidence product.
- [ ] Existing-customer and all suppression/duplicate checks are clear.
- [ ] The approved [LIA](./LIA.md) covers this exact audience, source, and use.
- [ ] Personalisation states only a verifiable fact.
- [ ] The planned email uses the right segment/version from
  [EMAIL-SEQUENCES.md](./EMAIL-SEQUENCES.md).
