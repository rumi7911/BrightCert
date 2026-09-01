# Search Console baseline — 11 August 2026

First measurement of organic search performance, taken so later work has
something to be compared against. **Nothing here was acted on**; SEO moves on a
scale of months and the XPRIZE deadline is 17 August.

Property: `https://brightcert.co.uk/` · Window: 90 days to 11 August 2026
· Source: Search Console API, `searchAnalytics/query`

---

## Headline

| Metric | Value |
|---|---:|
| Clicks | **0** |
| Impressions | 149 |
| CTR | 0.00% |
| Average position | 51.2 |

**Zero clicks is expected, not a fault.** Average position 51 is page five.
The pages are not being passed over — they are not being seen. Any CTR or
copy analysis at this position would be reading noise.

---

## What is working

**Indexing is healthy.** All four blog posts, the homepage, and the legal pages
are indexed and returning impressions. `sitemap.xml` returns 200 and `robots.txt`
correctly allows the marketing surface while disallowing `/api/`, `/dashboard`,
`/assessment/`, `/settings` and `/auth/`. **There is no technical SEO fault to
fix** — the thing that could have been silently broken is not.

**Geographic targeting is right.** 117 of 149 impressions are `gbr`, for a
UK-only product. The rest is a long tail of 1–2 impression countries.

**The queries are the right queries.** Every meaningful term is Cyber Essentials
cost or comparison intent — the commercial middle of the funnel, not vague
informational traffic.

---

## Pages

| Page | Impressions | Avg position |
|---|---:|---:|
| `/blog/what-is-cyber-essentials` | 55 | 67.9 |
| `/blog/cyber-essentials-cost` | 46 | 36.7 |
| `/blog/ce-vs-ce-plus` | 28 | 64.2 |
| `/blog/iasme-tool-vs-brightcert` | 26 | **13.7** |
| `/login` | 3 | 14.3 |
| `/privacy` | 3 | 3.7 |
| `/` | 2 | 37.5 |
| `/terms` | 2 | 4.0 |

`iasme-tool-vs-brightcert` at **13.7** is the only page near page one, and it is
also the most commercially pointed post on the site. Treat it as the template
for future content rather than an outlier.

**Ignore `/privacy` at 3.7 and `/terms` at 4.0.** They are the best positions on
the site and they are worthless — they rank for brand-plus-qualifier queries
only. Quoting them as a success would be self-deception.

## Queries

| Query | Impressions | Avg position |
|---|---:|---:|
| cyber essentials certification cost | 10 | 40.4 |
| cyber essentials | 5 | 78.2 |
| cyber essentials cost | 5 | 35.8 |
| cyber essentials audit | 2 | 79.5 |
| cyber essentials costs | 2 | **19.0** |
| cyber essentials guide | 2 | 99.0 |
| cost of cyber essentials | 1 | 31.0 |

Cost intent dominates. That matches the product's actual wedge — £199 against
£2,000–5,000 consultant pricing — so the content and the offer are pointed at
the same place. That alignment is the most useful finding here.

## Devices

| Device | Impressions | Avg position |
|---|---:|---:|
| Desktop | 136 | 51.3 |
| Mobile | 10 | 41.9 |
| Tablet | 3 | 76.7 |

Desktop-dominant, consistent with a B2B compliance product researched at work.
Too little mobile data to conclude anything about mobile experience.

---

## The July spike

Impressions ran 33 on 20 July and 56 on 21 July, then collapsed to 1–6 per day
for the rest of the window.

This reads as the standard new-site sampling boost: Google trials a new domain,
sees no engagement signal, and settles it back. **It predates
`codex/seo-growth`, which landed 29–30 July**, so that work neither caused the
spike nor the decline — a tempting but wrong inference if the dates are not
checked.

---

## What this baseline does not support

- **No conclusions about content quality.** At position 51 nothing has had a
  fair test.
- **No CTR optimisation.** 0 clicks over 0.00% CTR is not a signal to tune
  titles or meta descriptions against.
- **No attribution for `codex/seo-growth`.** Its work landed 29–30 July, into a
  window already past the spike, and 12 days is too short to read.

## When it is worth returning to this

After the hackathon. The single lever that matters is **position**, and moving
from 51 to page one is months of content depth and links, not a configuration
change. The honest next step is more cost-and-comparison content in the shape of
`iasme-tool-vs-brightcert`, then re-measuring this same query on the same
90-day window.

## How to re-measure

> **Redacted 1 September 2026.** This section originally named the Google
> Cloud service account in full, stated the privilege it holds, and gave the
> project number. None of that is a credential and none of it granted access,
> but the repository is public and together they named a principal, its
> privilege level and the procedure to use it — which is reconnaissance value
> for no operational benefit, since anyone entitled to run this already has
> the values. They were replaced with pointers to where the values live. The
> method below is unchanged and still works. Nothing else in this record was
> altered.

Access is already provisioned and needs no new credentials:

- The service account that holds `siteFullUser` on the Search Console
  property is the one named in `GCS_CLIENT_EMAIL`; its key is in
  `GCS_PRIVATE_KEY`. See `.env.example` for the full set.
- The Search Console API is enabled on the same Google Cloud project that
  backs `GCS_PROJECT_ID`.
- Mint a JWT with scope `https://www.googleapis.com/auth/webmasters.readonly`
  against `oauth2.googleapis.com/token`, then POST to
  `searchconsole.googleapis.com/webmasters/v3/sites/{site}/searchAnalytics/query`.

Note for tooling: `google-auth-library` fails from the agent sandbox because it
reaches `www.googleapis.com`, which is unreachable there. Signing the JWT
directly with `node:crypto` and calling `oauth2.googleapis.com` works.
