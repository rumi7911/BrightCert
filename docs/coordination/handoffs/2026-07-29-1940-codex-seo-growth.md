# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 29 July 2026, 19:40
- **Task:** Implement and package the first two weeks of the BrightCert
  organic-search plan: index controls, metadata/sitemap registry, trust page,
  and four existing-article refreshes
- **Branch:** `codex/seo-growth`
- **Worktree:** `.worktrees/seo-growth`
- **Base commit:** `89c0e5f`
- **Final commit:** Implementation is at `9610fa2`; this handoff is in the
  following documentation-only commit.
- **Status:** Complete on the task branch; awaiting owner-controlled merge and
  deployment

## Scope and ownership

- **Files intentionally changed:** SEO metadata and sitemap files; public,
  auth and private-route layouts; all existing marketing pages and four
  articles; shared article, JSON-LD, reveal, hero, logo and footer components;
  fee calculator/registry/tests; `public/pricing.md`; the 90-day execution
  document; this handoff.
- **Files inspected but not changed:** `next.config.ts`, `src/app/robots.ts`,
  question registry, production coordination files, current NCSC/IASME pages
  and requirements PDF.
- **Overlapping work discovered:** none in the SEO file set. The report
  redesign and dirty-main outreach/PDF worktrees touch separate ownership
  boundaries.
- **Files another agent must not overwrite:** the files in commit `9610fa2`
  until this branch is reviewed/integrated. Future article work should extend
  `src/lib/seo/registry.ts` rather than create a second source of truth.

## Changes

### Indexing and metadata

- Removed the inherited homepage canonical from the root layout and made the
  homepage canonical explicit.
- Added unique self-canonicals and metadata to every indexable public route.
- Added `noindex, nofollow, nocache` metadata to login, signup, app and
  assessment layouts while keeping login/signup crawlable for Google to
  process those directives.
- Replaced the hand-maintained sitemap with a typed SEO registry. It publishes
  only indexable canonical URLs with dated `lastModified` values and no
  `priority` or `changefreq`.
- Extended article metadata and structured data with author URL, publisher,
  image, published/modified dates and breadcrumbs. JSON-LD now escapes `<`
  before insertion.

### Accuracy, trust and content

- Added `/about` with the founder photograph, credentials, methodology,
  LinkedIn profile and a prominent readiness-not-certification disclaimer.
- Updated all four existing articles for Cyber Essentials requirements v3.3,
  the Danzell question set, current cloud/MFA wording and current official
  prices.
- Added the four official fee bands and a sourced interactive calculator:
  £320, £440, £500 and £600 plus VAT.
- Corrected `public/pricing.md`, which still described £320 as a typical
  certification price rather than the micro-organisation band.
- Added visible author/review details, a hub link, at least two related guides
  and an assessment CTA to each article. Replaced a stale 2021 IASME source
  link with IASME's current FAQ/guidance page.
- Preserved the IASME comparison's honest positioning and commercial path.
- Added `docs/seo/ORGANIC-SEARCH-EXECUTION.md` with weekly publishing,
  promotion, reporting and GSC/GA4 operator steps.

### Rendering and accessibility

- Made the keyword-bearing homepage H1 server-rendered instead of revealing
  only after client JavaScript.
- Added immediate rendering support to the reusable reveal component where
  above-the-fold content needs it.
- Corrected whitespace in a homepage CTA heading so its accessible text reads
  “ready your”, not “readyyour”.
- Added the About page to the global footer.

## Verification

Source/version review:

```text
Next.js 16 metadata, generateMetadata, sitemap and robots guides under
node_modules/next/dist/docs
-> reviewed before final code changes

IASME current pricing FAQ, retrieved 29 July 2026
-> confirms £320 / £440 / £500 / £600 + VAT bands by employee count

NCSC Cyber Essentials resources and Requirements for IT Infrastructure v3.3
PDF, retrieved 29 July 2026
-> confirms v3.3 effective 27 April 2026, cloud services cannot be excluded
   from scope, and cloud authentication must use MFA where available

IASME current question-set preview, retrieved 29 July 2026
-> confirms Danzell is the question set for purchases from 27 April 2026
```

Automated verification after the final source changes:

```text
npm run test:run -- src/app/seo.test.ts \
  src/lib/seo/cyber-essentials-fees.test.ts \
  src/components/brightcert/article-kit.test.tsx \
  src/components/brightcert/cyber-essentials-cost-calculator.test.tsx \
  src/components/brightcert/reveal.test.tsx \
  src/components/brightcert/home/hero-title.test.tsx
-> 6 files passed; 28 tests passed

npm run test:run
-> 22 files passed; 209 tests passed

npm run lint
-> passed

set -a; source <repository .env.local>; set +a; npm run build
-> passed; TypeScript passed; 31 static pages generated including /about

git diff --check / git diff --cached --check
-> passed
```

Browser and HTTP verification against the local SEO branch:

```text
Playwright CLI, Firefox, desktop and 390x844 mobile
-> /about and /blog/cyber-essentials-cost rendered correctly
-> homepage H1 present in server-rendered DOM
-> homepage canonical https://brightcert.co.uk/ and robots index, follow
-> cost article canonical, author and modified metadata correct; 3 JSON-LD
   blocks present
-> /login canonical self-referencing; robots noindex, nofollow, nocache
-> final clean navigations reported 0 browser application errors

HTTP walk of every URL emitted by local /sitemap.xml
-> 12 unique URLs; all 12 returned 200
-> no login/signup URLs; no priority/changefreq fields
-> robots.txt allows login/signup, blocks API/private application paths
-> /index returned one 308 to /
```

The first Playwright article metadata expression contained an invalid CSS
selector and produced an evaluator error. The selector was corrected and the
same check then passed; a final clean navigation reported zero errors. This was
test-operator input, not application behaviour.

## External state

- **Database writes:** None.
- **Deployment:** None.
- **Emails/messages:** None.
- **Payments:** None.
- **Other external actions:** Read-only retrieval of current NCSC, IASME and
  LinkedIn public pages. No GSC or GA4 account changes and no sitemap
  submission were made.

## Remaining risks or blockers

- The work is not live until the owner merges and deploys it. GSC URL
  inspection, indexing requests and sitemap resubmission must use the deployed
  version.
- The publishing roadmap intentionally schedules weeks 3–12; those ten new
  articles are not part of this first implementation branch.
- Google recrawl/indexing and rankings are external outcomes, not guaranteed
  by a successful deployment.
- The local Next build prints the existing multi-lockfile workspace-root
  warning. It does not fail compilation, type checking or generation.
- Firefox emitted its generic scroll-linked positioning warning. No
  application error or observed layout break accompanied it.

## Next safe action

Owner reviews and integrates `codex/seo-growth`, deploys the integrated commit,
then submits `https://brightcert.co.uk/sitemap.xml` in GSC and follows the
inspection checklist in `docs/seo/ORGANIC-SEARCH-EXECUTION.md`. Keep the
production report redesign review isolated from this branch.
