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

| Week | Target publish date | Working title | Slug | Primary intent |
|---|---:|---|---|---|
| 1 | 3 Aug | Technical SEO repair and sitemap resubmission | Existing routes | Index health |
| 2 | 10 Aug | Refresh four existing guides and publish About | Existing routes | Accuracy and trust |
| 3 | 17 Aug | Cyber Essentials Requirements v3.3: What Changed in 2026 | `/blog/cyber-essentials-requirements` | Requirements |
| 4 | 24 Aug | Cyber Essentials Checklist for UK SMEs | `/blog/cyber-essentials-checklist` | Checklist |
| 5 | 31 Aug | How to Prepare for Cyber Essentials: Step by Step | `/blog/how-to-prepare-for-cyber-essentials` | Preparation |
| 6 | 7 Sep | Cyber Essentials Assessment Questions: What to Prepare | `/blog/cyber-essentials-assessment-questions` | Questions |
| 7 | 14 Sep | Cyber Essentials MFA Requirements in 2026 | `/blog/cyber-essentials-mfa-requirements` | MFA |
| 8 | 21 Sep | Cyber Essentials Scope: Cloud, Remote Work and BYOD | `/blog/cyber-essentials-scope` | Scope |
| 9 | 28 Sep | How Long Does Cyber Essentials Take? | `/blog/how-long-does-cyber-essentials-take` | Timeline |
| 10 | 5 Oct | Cyber Essentials for Government Contracts | `/blog/cyber-essentials-government-contracts` | Contracts |
| 11 | 12 Oct | Common Cyber Essentials Failure Reasons and Fixes | `/blog/cyber-essentials-failure-reasons` | Failure prevention |
| 12 | 19 Oct | Cyber Essentials Renewal Checklist | `/blog/cyber-essentials-renewal-checklist` | Renewal |

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
