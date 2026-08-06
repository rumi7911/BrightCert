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

The rest of this document is those sources. One of the three originally
listed here has since been withdrawn as prohibited — it is kept below with the
reason, not deleted.

---

## Source A — the IASME certificate register — **WITHDRAWN, DO NOT USE**

> **This source is prohibited.** The NCSC/IASME certificate search page states:
>
> > Please note this search function is solely for the use of checking
> > certification and must not be used for marketing, data research, or any
> > other purpose.
>
> That rules out both uses this document originally proposed — finding
> prospects and evidencing outreach. Established 6 August 2026. The
> corresponding LIA change was withdrawn the same day, before approval:
> [LIA Amendment 1](./LIA.md#amendment-1--withdrawn--ncsciasme-certificate-register).

The register was going to be the primary source for this segment, because it is
the only public place carrying a dated Cyber Essentials expiry. It cannot be
used. Do not reopen this without reading the withdrawal record first.

**What is still permitted:** checking the certification status of a company you
have already identified through an approved source. That is what the page says
the search is for. It cannot feed the campaign though — the register may not be
cited as `trigger_evidence_url`, and an expiry date read from it may not become
the reason for an email.

### The `renewal` trigger is not dead, but its evidence must change

A renewal trigger is still Strong under [ICP.md](./ICP.md). What changed is
where the evidence may come from: the **company's own published material**, not
the register. In practice that means a trust or security page that states a
certification date or expiry, a certificate badge the company displays itself,
or an announcement it published. All of that falls under the already-approved
"public company websites and business-context pages", and it is found the same
way as Source C.

This is a genuine loss. The register offered a sorted queue of dated deadlines;
company-published expiry dates are scattered and much rarer. Expect renewal to
become an occasional find inside Source C rather than a source of its own.

---

## Source B — Contracts Finder (`tender_requirement`, `supply_chain`, `msp_client_service`)

Public-sector contract notices that require or score Cyber Essentials, and the
suppliers around them.

Contracts Finder has a public API — `POST api/rest/2/search_notices/json`,
keyword and date search, no auth for public endpoints:
<https://www.contractsfinder.service.gov.uk/apidocumentation/home>

There is a helper for it:

```sh
npm run outreach:contracts-finder -- \
  --output outreach/runs/cf-candidates.csv \
  --statuses Open,Awarded,Closed
```

It writes **candidates for triage, never prospect rows**, and refuses to write
into `.outreach/`. The one thing it does that matters: the API's keyword search
is fuzzy, so every result is re-checked against the notice text before it is
kept. Quote the phrase and the API is accurate; leave it unquoted and it returns
unrelated notices — an unquoted `cyber essentials` search returned a Surrey
County Council social-care notice with score 1 and no mention of the scheme.

### What it actually yields — measured 6 August 2026

Run against the live API, exact phrase `"cyber essentials"`:

| Status | Notices |
|---|---:|
| **Open** | **0** |
| Awarded | 70 |
| Closed | 154 |
| After de-duplication | 170 |
| With a named awarded supplier | 70 |

**Zero open notices.** The whole "find SMEs bidding on a notice that requires
Cyber Essentials" play has nothing to work with on any given day, and even when
a notice exists the API does not name the bidders — you would be inferring who
might bid, which is the ICP's **Weak** row. Treat open notices as a monitoring
signal, not a source: re-run the helper periodically rather than expecting a
pipeline from it.

Of the 70 named suppliers, only **6 were awarded in 2025 or later**; the
distribution runs back to 2015. An award from 2018 evidences nothing current.

### The reframing: this is an MSP source, not an SME source

The named suppliers are overwhelmingly IT, security and software firms — Logiq
Consulting, Prism Infosec, Synergi Software, Claranet, Select Technology
Systems, 6ByThree Digital. That makes them poor direct-SME prospects: winning a
contract that required Cyber Essentials means they already hold it.

It makes them decent **MSP-segment** candidates. An IT provider that won public
work requiring Cyber Essentials is an evidence-backed signal that the scheme is
commercially relevant to them and their clients, which is what the MSP profile
in [ICP.md](./ICP.md) asks for. Use `msp_client_service`.

Two cautions before spending time there:

- The MSP profile excludes providers with an obvious competing readiness or
  evidence product. Several of these firms are security consultancies and some
  are IASME-licensed Certification Bodies — the competitor check is not a
  formality here, it is the main filter.
- **IASME Consortium Ltd itself appears in the results.** A useful reminder that
  the list is real, and that a named supplier is a starting point, not a
  qualified prospect.

Realistically this source is worth roughly the campaign's **30 MSP rows**, not
its 120 SME rows. Recent awards to non-Certification-Body IT providers are the
subset worth working.

### Where this gets weak

A company merely *appearing* on a tender list is not a trigger. The notice must
name Cyber Essentials in its requirements or scoring, and you must link the
specific company to that specific notice. "Company operates in a sector that
sells to government" is the ICP's **Weak** row: block and research a better
trigger. The helper leaves `triage_decision` and `triage_note` blank precisely
because it cannot make that judgement.

Notice pages 403 automated requests, so `notice_url` must be opened in a
browser — which the evidence standard requires anyway.

Also check the Find a Tender Service for higher-value notices.

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
| `trigger`, `trigger_evidence_url` | Source B/C | The reason you found them |
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

**The original estimate no longer holds, and nothing has replaced it yet.**

It said 6–10 qualified rows per focused hour, so 15–20 hours for the 120 direct
SME rows. That assumed Source A supplied a sorted queue of dated renewal
deadlines. Source A is withdrawn, and Source B turns out to be worth roughly the
30 MSP rows rather than the 120 SME ones.

What that leaves, honestly:

| Segment | Rows needed | Source | State |
|---|---:|---|---|
| MSP | 30 | B, recent awards to non-CB IT providers | ~22 candidates awarded 2024 or later; needs the competitor check |
| Direct SME | 120 | **C, essentially alone** | No measured rate |

Source C — finding companies whose own material names Cyber Essentials — is now
carrying the entire SME segment on its own. It was written up as the third and
weakest source, and it has not been measured.

**Do not plan a schedule from the old number.** Work Source C by hand for one
timed hour, count the rows that clear the ICP bar, and multiply from that. If
the rate is 2–3 an hour rather than 6–10, the 120-row target needs revisiting
with the owner rather than absorbing quietly into a longer timeline.

What has not changed: no tool removes this cost. The parts a scraper automates
— name, domain, generic inbox — are the parts the gate rejects, and the part
that matters, a defensible trigger, is the part nothing automates.
