# Trigger research method — direct SME segment

How to find the 120 direct-SME prospects the campaign needs, at the standard
[ICP.md](./ICP.md) and [LIA.md](./LIA.md) already set. Companion to the
[Clay CSV contract](./CLAY-CSV-CONTRACT.md), which defines the columns, and the
[operator runbook](./operator-runbook.md), which defines the commands.

This document is about the one step nothing automates: finding a **current,
public, business-context reason** this specific company needs Cyber Essentials
now, and being able to cite it.

---

## The core inversion

The obvious method is to build a list of plausible UK SMEs and then hunt for a
trigger on each. It fails, and predictably: the ICP's trigger bar is high, most
companies have no public trigger at any given moment, and you burn the research
budget on companies you then discard.

**Work backwards. Start from a source that *is* a trigger, and derive the
company from it.**

Every row sourced this way arrives with `trigger`, `trigger_evidence_url` and
`source_date` already satisfied, because the thing that found the company is the
evidence. What remains is ordinary verification work — Companies House, size,
named contact — which is mechanical.

The rest of this document is three such sources, strongest first.

---

## Source A — the IASME certificate register (`renewal`)

**Why this is the best source for this campaign.** Cyber Essentials
certificates last 12 months, and the public register carries the expiry date.
A company 1–3 months from expiry has a dated, public, business-context reason to
act, tied to a decision it has already made once. The ICP's strength table lists
"published certification expiry/renewal" as **Strong** — eligible if the other
gates pass, with no human-review escalation needed on trigger quality alone.

Register: <https://iasme.co.uk/cyber-essentials/ncsc-certificate-search/>

It is searchable by company name and certificate number; searching by postcode
is reported by third parties but **confirm that in the browser before relying on
it** — it materially changes how you work the source.

**This must be done in a browser.** IASME returns 403 to automated requests on
every path including the site root, established 3 August. Do not try to script
it; that is also the wrong instinct here, because the LIA requires human
approval of every row anyway.

### How to work it

1. Search by area or by name patterns matching the allowed sectors in
   [ICP.md](./ICP.md).
2. Record, for each result: company name, certificate level, issue date, expiry
   date, and the result URL.
3. Keep only companies whose expiry falls **1–3 months ahead**. Sooner and the
   decision is already made; later and the trigger is not yet current.
4. Discard CE Plus holders for the direct-SME pitch unless the readiness
   framing still fits — they are further along than the offer assumes.

### The honest caveat

The register only lists certificates issued in the last 12 months, so lapsed
holders drop off entirely. That cuts both ways: you cannot find companies that
let certification lapse (arguably a better prospect), but everything you *do*
find is current by construction.

---

## Source B — Contracts Finder (`tender_requirement`, `supply_chain`)

Public-sector contract notices that require or score Cyber Essentials, and the
suppliers around them. The ICP rates "live tender/framework requires or scores
Cyber Essentials" as **Strong**.

Contracts Finder has a public API — `POST api/rest/2/search_notices/{MimeType}`,
JSON/XML/CSV/OCDS, keyword and date search, with OAuth 2.0 only for protected
endpoints:
<https://www.contractsfinder.service.gov.uk/apidocumentation/home>

Two distinct plays, and they produce different rows:

| Play | Who you contact | Trigger label |
|---|---|---|
| A notice requires Cyber Essentials → find SMEs bidding or likely to bid | The bidder | `tender_requirement` |
| An awarded contract names a supplier → that supplier's own suppliers need it | The sub-supplier | `supply_chain` |

The first is cleaner. The second requires a documented chain and will usually
land as **Medium** strength, needing human review to connect the signal to the
named role — budget for that.

Also check the Find a Tender Service for higher-value notices.

### Where this gets weak

A company merely *appearing* on a tender list is not a trigger. The notice must
name Cyber Essentials in its requirements or scoring, and you must be able to
link the specific company to that specific notice. "Company operates in a sector
that sells to government" is the ICP's **Weak** row: block and research a better
trigger.

---

## Source C — the company's own assurance material (`customer_assurance`)

A company publishing a trust/security page, supplier-requirements page, or
customer-assurance material that names Cyber Essentials is telling you it is
relevant to them commercially.

Search patterns that work:

```
site:<domain> "cyber essentials"
"cyber essentials" "supplier requirements" -site:gov.uk
"our suppliers must" "cyber essentials"
```

Strength depends entirely on what the page says:

- Names Cyber Essentials as something they require of *their* suppliers, or
  commit to for customers → **Strong**, and the framing writes itself.
- Client assurance material merely naming Cyber Essentials → **Medium**, human
  review required.
- A generic cyber-security page or an undated compliance claim → **Weak**.
  Block it. This is the most common way a research session quietly drifts below
  the bar, because the page *feels* relevant.

---

## Research order — cheapest disqualifier first

Every step below can kill a candidate. Running them in this order means you
spend the expensive step (finding a named human) only on rows that survive
everything else.

| # | Check | Kills the row when | Cost |
|---|---|---|---|
| 1 | Trigger exists and is Strong, or Medium with a defensible link | Weak/prohibited per ICP table | free — you started here |
| 2 | Companies House: exact match, active, supported type | no match, inactive, unsupported type | seconds, API key available |
| 3 | Employee band ≈ 10–100 | outside band | minutes |
| 4 | Sector in the allowed list | out of scope | seconds |
| 5 | Not an existing customer, not suppressed, not a duplicate | any match | `seed-suppressions` + `queue` |
| 6 | Named contact in a role that can act on *this* trigger | only role inboxes findable | the expensive step |
| 7 | Corporate work email, verified, domain-matching, non-role | free-mail, role prefix, mismatch | varies |

Step 2 is the one people skip and regret. **Ambiguity blocks**: a missing
Companies House match does not prove sole-trader status, it just means you do
not know — research the entity or replace the row.

Step 7's role-prefix block is enforced in code at
`src/lib/outreach/gate.ts:109`, covering `info`, `hello`, `contact`, `sales`,
`support`, `admin`, `office`, `team`, `enquiries`, `marketing`, `security`,
`privacy`, and more. Do not spend time on a company where only a role inbox is
findable — that is a replace, not a puzzle.

---

## Which step fills which column

| Column | Comes from | Notes |
|---|---|---|
| `trigger`, `trigger_evidence_url` | Source A/B/C | The reason you found them |
| `source_url`, `source_date` | the page you actually read | `YYYY-MM-DD`, the date *you* checked |
| `company_name`, `company_number`, `legal_entity_type` | Companies House | `verify` re-checks and overwrites provisional values |
| `employee_band` | licensed enrichment or company source | band, never false precision |
| `sector` | company source | must be in the ICP allowed list |
| `contact_name`, `role` | company site, public business context | must plausibly own the trigger |
| `work_email` | verification tooling | non-role, domain-matching, `email_status=verified` |
| `personalisation_note` | you, from the cited evidence | ≥20 chars, factual, no inference beyond source |
| `segment`, `campaign`, `template_version` | operator | `sme` here |
| `lawful_basis`, `lia_status` | fixed | `legitimate_interests`, `approved` |
| `suppression_status` | `seed-suppressions` then `queue` | `clear` |
| `human_approved_at` | you, last | only after the checklist passes |

---

## Evidence standards

The gate checks that URLs are well-formed and dates parse. It cannot check that
a URL supports the claim — that is the human approval step, and it is the whole
point of it.

Before setting `human_approved_at`:

- **Reachable now.** Open both URLs. A paywalled, dead or login-gated page is
  not evidence.
- **Business context only.** Never a personal profile, never private-life
  information, never an inferred vulnerability. The LIA excludes these outright.
- **Accurately summarised.** `personalisation_note` must be supportable from the
  cited page alone. If writing it requires a leap, the trigger is Weak.
- **Current for the claim.** A renewal trigger cites a live expiry date; a
  tender trigger cites a live or recently-closed notice. `source_date` is when
  you checked, not when the page was published.

A useful test: if the recipient replied *"where did you get this?"*, the answer
should be one sentence and one link, and should sound reasonable to them.

---

## Working the pipeline

Research into the canonical CSV, then the documented sequence from the
[operator runbook](./operator-runbook.md):

```
validate (pre-review) → validate (reviewed) → verify → seed-suppressions
  → event imported → queue → report
```

`verify` is where Companies House confirms or overwrites what you recorded, so
expect rows to fail there — that is the control working, not a mistake.

Keep `.outreach/` and `outreach/runs/` at mode `600`. Both are gitignored and
must stay that way; nothing containing a real contact's details belongs in the
repository.

---

## Realistic throughput

Sources A and C need a browser and judgement. Expect roughly **6–10 qualified
rows per focused hour** once the method is familiar, lower at first, and lower
again for the MSP segment where the competitor check adds a step.

120 direct SME rows is therefore on the order of 15–20 hours of research. That
is the real cost of the campaign, and no tool removes it — the parts a scraper
automates (name, domain, generic inbox) are the parts the gate rejects.

Front-load Source A. It is the only source where the trigger, the deadline and
the relevance arrive together in one row of a public register.
