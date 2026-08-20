# BrightCert organic search execution

Owner: Muhammad Sohaib Roomi
Started: 28 July 2026
Review cadence: weekly, using rolling 28-day comparisons

## Baseline

The 28 July 2026 GSC export recorded:

- 98 impressions
- 0 clicks
- Average position around 55
- 78 UK impressions
- 89 desktop impressions
- `/blog/iasme-tool-vs-brightcert` at average position 8.17
- Cost-query cluster at weighted position 44.7
- Definition and requirements cluster at weighted position 72.6
- Commercial and readiness cluster at weighted position 74.1

This is the fixed baseline for the first 90-day comparison. Do not replace it with daily movement.

## Weekly publishing calendar

Each article requires founder review before publication. Do not publish a draft simply to meet the date.

| Week | Target publish date | Working title | Slug | Primary intent | Status |
|---|---:|---|---|---|---|
| 1 | 3 Aug | Technical SEO repair and sitemap resubmission | Existing routes | Index health | ✅ Done |
| 2 | 10 Aug | Refresh four existing guides and publish About | Existing routes | Accuracy and trust | ✅ Done |
| 3 | 17 Aug | Cyber Essentials Requirements v3.3: What Changed in 2026 | `/blog/cyber-essentials-requirements` | Requirements | ✅ Published 20 Aug |
| 4 | 24 Aug | Cyber Essentials Checklist for UK SMEs | `/blog/cyber-essentials-checklist` | Checklist | ✅ Published 20 Aug |
| 5 | 31 Aug | What Actually Happens in a Cyber Essentials Plus Audit | `/blog/cyber-essentials-plus-audit` | CE Plus audit | **Re-planned 20 Aug** |
| 6 | 7 Sep | How to Prepare for a Cyber Essentials Plus Assessment | `/blog/cyber-essentials-plus-preparation` | CE Plus preparation | **Re-planned 20 Aug** |
| 7 | 14 Sep | Cyber Essentials Plus Cost in 2026 | `/blog/cyber-essentials-plus-cost` | CE Plus cost | **Re-planned 20 Aug** |
| 8 | 21 Sep | Cyber Essentials Scope: Cloud, Remote Work and BYOD | `/blog/cyber-essentials-scope` | Scope | Unchanged |
| 9 | 28 Sep | Cyber Essentials MFA Requirements in 2026 | `/blog/cyber-essentials-mfa-requirements` | MFA | Moved from week 7 |
| 10 | 5 Oct | How to Prepare for Cyber Essentials: Step by Step | `/blog/how-to-prepare-for-cyber-essentials` | Preparation | Moved from week 5 |
| 11 | 12 Oct | Common Cyber Essentials Failure Reasons and Fixes | `/blog/cyber-essentials-failure-reasons` | Failure prevention | Unchanged |
| 12 | 19 Oct | Cyber Essentials Renewal Checklist | `/blog/cyber-essentials-renewal-checklist` | Renewal | Unchanged |
| 13 | 26 Oct | Cyber Essentials Assessment Questions: What to Prepare | `/blog/cyber-essentials-assessment-questions` | Questions | Deferred from week 6 |
| 14 | 2 Nov | How Long Does Cyber Essentials Take? | `/blog/how-long-does-cyber-essentials-take` | Timeline | Deferred from week 9 |
| 15 | 9 Nov | Cyber Essentials for Government Contracts | `/blog/cyber-essentials-government-contracts` | Contracts | Deferred from week 10 |

### Why weeks 5–7 changed

Re-planned 20 August after the first `npm run seo:measure` run, which surfaced
demand that no earlier baseline had recorded. Over the 90 days to 18 August,
Cyber Essentials **Plus** queries account for **43 of 189 impressions — 23% of
everything the site is seen for**, and they arrived unprompted:

| Query | Impressions | Avg position |
|---|---:|---:|
| cyber essentials plus audit | 20 | 77.9 |
| cyber essentials plus assessment | 16 | 65.1 |
| cyber essentials plus cost | 3 | 86.0 |
| ce plus / ce plus assessment | 2 | 68–81 |
| cyber essentials plus certification cost | 1 | **17.0** |
| cyber essentials plus readiness | 1 | 76.0 |

The site has exactly one page addressing any of this — `/blog/ce-vs-ce-plus`,
sitting at **67.8**, the worst-positioned commercial page on the site. It is
also the wrong shape: it answers "which one do I need", while the queries
arriving ask what the audit involves, how to prepare for it, and what it costs.
Three separate intents, one page, none of them served well.

`cyber essentials plus certification cost` at position **17** is the tell. That
is page two on a commercial query, from a page not written for it. The intent
is winnable with a page that actually targets it.

**Constraint that shapes all three articles:** the CE Plus Pack tier is not
built and not purchasable. These articles must not market it, must not imply
BrightCert performs the CE Plus technical audit — it does not, and cannot — and
should funnel to the readiness assessment that does exist. Write them to be
genuinely useful about a service BrightCert does not sell. That is the same
posture that made the IASME comparison the best-performing page on the site.

**Also required in week 5, alongside the new article:** rework
`/blog/ce-vs-ce-plus` into the hub for this cluster, linking out to all three
new pages. It keeps the comparison intent it was written for and stops
competing with pages aimed at the other three.

### Deferred, not dropped

Weeks 13–15 carry the three articles displaced by the CE Plus cluster. None
were cancelled; they addressed intents with no measured demand yet, which is a
reason to sequence them later, not to abandon them.

## Required article brief

Create the brief before drafting:

1. Primary query and one search intent.
2. A two-to-four sentence answer at the top.
3. Three questions a UK SME needs answered next.
4. One practical original element, such as a decision table, calculation, worked example or printable checklist.
5. Direct links to the relevant NCSC and IASME primary sources.
6. A founder-reviewed date.
7. One link to the main Cyber Essentials guide.
8. At least two links to related articles.
9. One descriptive link to the BrightCert assessment.
10. A clear reminder that BrightCert prepares organisations but does not certify them.

Do not reproduce the official Danzell questionnaire verbatim.

## Priority briefs

### Cyber Essentials requirements v3.3

- Primary query: `cyber essentials requirements`
- Concise answer: Explain the five controls and state that v3.3 took effect on 27 April 2026 with the Danzell question set.
- Original value: A table mapping each control to the evidence an SME should collect.
- Required coverage: cloud services, remote workers, BYOD, supported software and MFA where available.
- Primary sources:
  - https://www.ncsc.gov.uk/cyberessentials/resources
  - https://iasme.co.uk/cyber-essentials/preview-the-self-assessment-questions-for-cyber-essentials/
- Internal links: What Is Cyber Essentials, cost guide, preparation guide, assessment CTA.

### Cyber Essentials checklist

- Primary query: `cyber essentials checklist`
- Concise answer: A checklist is a preparation aid, not the certification application.
- Original value: A printable, dated checklist with owner, evidence and status columns.
- Required coverage: scope first, then the five controls, evidence collection and final review.
- Primary sources:
  - https://www.ncsc.gov.uk/cyberessentials/resources
  - https://iasme.co.uk/cyber-essentials/
- Internal links: requirements guide, MFA guide, scope guide, assessment CTA.

### Cyber Essentials Plus audit (week 5)

- Primary query: `cyber essentials plus audit` — 20 impressions, position 77.9, the single largest query the site is seen for
- Concise answer: CE Plus adds an independent technical audit of a sample of your devices, carried out by a Certification Body assessor, after the same self-assessment that standard Cyber Essentials uses.
- Original value: a walkthrough of what the assessor actually does, in order, and what the organisation has to have ready on the day
- Required coverage: the relationship to the standard self-assessment; device sampling; vulnerability scanning of in-scope devices; the email and browser tests; what happens when something fails; remote versus on-site
- Primary sources: NCSC Cyber Essentials resources; IASME Cyber Essentials pages
- Internal links: the CE vs CE Plus hub, the requirements v3.3 guide, the checklist, assessment CTA
- **Must not** imply BrightCert performs the audit or can pass you through it. BrightCert prepares; the audit belongs to an IASME-licensed Certification Body.

### Cyber Essentials Plus preparation (week 6)

- Primary query: `cyber essentials plus assessment` — 16 impressions, position 65.1
- Concise answer: preparation for CE Plus is mostly making sure the things you claimed in the self-assessment are actually true on the devices the assessor will sample.
- Original value: a preparation table in the same owner/evidence/status shape as the readiness checklist, aimed at the audit rather than the questionnaire
- Required coverage: the gap between claimed and actual state; device sampling and what makes a sample representative; patching within the 14-day window before an audit date; unsupported software as the common hard stop; MFA on cloud services; who needs to be available on the day
- Primary sources: NCSC resources; IASME Cyber Essentials pages
- Internal links: the audit article, the checklist, the requirements v3.3 guide, assessment CTA
- **Must not** market the CE Plus Pack tier, which is not built or purchasable.

### Cyber Essentials Plus cost (week 7)

- Primary query: `cyber essentials plus cost`, plus `cyber essentials plus certification cost` which already sits at position **17** from a page not written for it
- Concise answer: unlike standard Cyber Essentials, CE Plus has no fixed fee band. It is quoted per organisation because the audit effort depends on scope and network complexity.
- Original value: an explanation of what drives the quote — number and variety of in-scope devices, number of sites, cloud services, remote workers — so a reader can predict roughly where they will land and ask a Certification Body better questions
- Required coverage: the standard fee bands as the fixed part (£320/£440/£500/£600 + VAT, verified against IASME 20 August 2026); why Plus is quoted separately; what a quote should itemise; remediation as the genuinely variable cost
- Primary sources: NCSC resources; IASME Cyber Essentials pages
- Internal links: the cost guide, the audit article, the CE vs CE Plus hub, assessment CTA
- **Do not publish a specific CE Plus price as though it were an official fee.** There is no official band. Ranges quoted by other providers are their own pricing; attribute anything cited.

## Pre-publication gate

Every new or refreshed article must pass all of these:

- One unique H1, title and description.
- Self-referencing canonical.
- Article and breadcrumb structured data.
- Visible author link and reviewed date.
- Primary-source citations support factual claims.
- Current Cyber Essentials fee values where fees appear.
- No certification or pass guarantee.
- No old question-set wording presented as current.
- Hub link, at least two related article links and one product CTA.
- All linked pages return 200 or an intentional single 308.
- Mobile layout checked at 390px width.

## GSC and GA4 setup

These are account-admin actions and must be completed in the Google interfaces after the production deployment.

### Search Console

1. Submit `https://brightcert.co.uk/sitemap.xml`.
2. Inspect `/`, `/pricing`, `/how-it-works`, `/about` and all four existing articles.
3. Request indexing for the homepage, About page and materially refreshed articles.
4. Inspect `/privacy` and `/terms` to confirm their selected canonical is self-referencing.
5. Inspect `/login` and `/signup` until Google reports `noindex`.
6. Do not use the temporary removals tool for the auth URLs.
7. Record indexed status once a week, not daily.

### GA4

1. In GA4 Admin, open Product links and link the verified Search Console property.
2. Confirm the web stream is `G-YW9BG1DXPC`.
3. Mark `assessment_started`, `sign_up` and `purchase` as key events.
4. Create an exploration with:
   - Session source / medium
   - Landing page
   - `assessment_started`
   - `sign_up`
   - `purchase`
5. Filter organic search with Session default channel group equals Organic Search.
6. Keep purchase value and transaction ID in the purchase event validation.

The application already emits consent-gated `assessment_started`, `sign_up` and `purchase` events. Linking the accounts and marking key events still require Google account access.

## Weekly scorecard

Record rolling 28-day values each Monday:

Run `npm run seo:measure` to fill this in; `-- --write` also saves a dated
report to `docs/growth/`. Latest run: **20 August 2026** — 189 impressions,
0 clicks, average position 49.2 desktop, `/blog/iasme-tool-vs-brightcert` at
12.6 and `/blog/cyber-essentials-cost` at 33.8. All four moved the right way
against 11 August, and clicks remain 0, which is expected at page five.

| Metric | Baseline | Current | Change | Action |
|---|---:|---:|---:|---|
| Non-brand impressions | 98 total impressions |  |  |  |
| Non-brand clicks | 0 |  |  |  |
| UK impressions | 78 |  |  |  |
| IASME comparison position | 8.17 |  |  | Protect top ten |
| Priority pages in top 30 | 0 confirmed |  |  |  |
| Organic assessment starts | 0 confirmed |  |  |  |
| Organic signups | 0 confirmed |  |  |  |
| Organic purchases | 0 confirmed |  |  |  |
| Relevant referring domains | 0 confirmed |  |  |  |

Decision rules:

- At least 50 impressions, position 4 to 15 and CTR below 2%: rewrite the title and description.
- At least 20 impressions and position 11 to 30: deepen the content and improve internal links.
- No impressions after 60 days: check indexing, intent and competing pages before adding more copy.
- A ranking drop on the IASME comparison: compare the changed query mix and page before editing the page again.

## Promotion routine

Allocate 2 to 3 hours after each article is published.

### Founder LinkedIn post

Use this structure:

1. State the practical question the article answers.
2. Give the exact answer or one useful number.
3. List three things the guide helps a UK SME do.
4. State that BrightCert prepares organisations but does not certify them.
5. Link to the guide.
6. Use three to five relevant hashtags.

Do not claim a user count, revenue result, deadline or guaranteed pass.

### Five personalised pitches

Send one useful, specific pitch to each of:

1. An MSP serving UK SMEs.
2. An IASME Cyber Advisor or Certification Body with a complementary audience.
3. A local Chamber of Commerce or SME association.
4. A UK cyber security publication or newsletter.
5. A university, alumni or founder community connected to Muhammad.

Pitch template:

> Subject: Current Cyber Essentials resource for [audience]
>
> Hi [name],
>
> I noticed your [specific page, service or recent post] helps [audience] with [relevant problem].
>
> I have published a current, source-linked [checklist/calculator/guide] for UK SMEs using the April 2026 Cyber Essentials v3.3 requirements. It gives [one concrete benefit].
>
> If it would genuinely help your readers or clients, the resource is here: [URL]
>
> I am happy to provide a short founder comment on [specific topic]. BrightCert is a readiness tool and does not issue certification.
>
> Muhammad

Do not automate sends, buy links, use mass directories or ask for reciprocal links.

## 90-day outcome review

Review on 26 October 2026:

- Intended public pages indexed.
- Login and signup removed from results.
- IASME comparison retained in the top ten.
- At least five priority pages in the top 30.
- One additional priority page in the top ten.
- 500 to 1,000 non-brand impressions per 28 days.
- 20 to 40 clicks per 28 days.
- At least three organic assessment starts.
- Five relevant referring domains.

These are targets, not guarantees.
