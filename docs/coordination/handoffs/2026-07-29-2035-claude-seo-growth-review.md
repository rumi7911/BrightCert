# Agent task handoff

- **Agent:** Claude Code
- **Date/time (BST):** 29 July 2026, 20:35
- **Task:** Read-only release review of `codex/seo-growth` (`11d71ea`)
- **Branch:** `claude/seo-growth-review`
- **Worktree:** `.worktrees/seo-growth-review`
- **Base commit:** `89c0e5f`
- **Final commit:** The commit containing this handoff
- **Status:** Complete — recommend integration after two copy/config decisions
  that belong to the owner

## Scope and ownership

- **Files intentionally changed:** this handoff only. No source, schema,
  configuration, or dependency was changed on this branch.
- **Files inspected but not changed:** the range `origin/main..codex/seo-growth`
  (39 files, +1651/−308) in `.worktrees/seo-growth`; plus
  `src/app/api/stripe/checkout/route.ts` and `src/proxy.ts` on `origin/main`
  for corroboration.
- **Overlapping work discovered:** yes — see "Branch overlap" below.
- **Files another agent must not overwrite:** none introduced by this task.
  `codex/seo-growth` remains Codex's branch; this review does not modify it.

## Changes

No implementation change. This branch records an independently verified review
decision for candidate `11d71ea`.

## Verification

All commands run **from inside `.worktrees/seo-growth`**, not the parent
repository root — a parent-root run scans sibling worktrees and produces
invalid cross-branch results (as recorded in
`2026-07-29-1935-codex-reminder-evidence-integration.md`).

```text
npx tsc --noEmit
-> exit 0, no diagnostics

npm run test:run
-> 23 test files passed; 210 tests passed; duration 2.14s

npm run lint
-> exit 0, no warnings

set -a; source <repository .env.local>; set +a; npm run build
-> passed; route manifest completed; /blog/* , /faq, /how-it-works, /pricing,
   /privacy, /terms, /login, /signup, /sitemap.xml, /robots.txt all static

git show f0a68c0 | git patch-id --stable
git show 4447507 | git patch-id --stable
-> both 90747379c31b1e350a86e3f2db9005c23760fadc (same logical patch)
```

Live Stripe reads (read-only, no writes, no test-mode key available):

```text
GET /v1/coupons
-> ZXdXak08 "Founding 10 customers" 100.00 GBP off, valid=true,
   duration=once, max_redemptions=10, times_redeemed=0

GET /v1/promotion_codes
-> FOUNDING10 active=true  (max_redemptions 10, redeemed 0)
   FOUNDING10 active=false (max_redemptions 1,  redeemed 0)

GET /v1/prices , GET /v1/products
-> 0 results (expected: checkout/route.ts builds inline price_data,
   unit_amount 19900, and does not reference a Price object)
```

## Findings

### Strengths

- `src/lib/seo/registry.ts` makes page metadata single-source. `metadataFor`
  emits a per-page absolute canonical, correct `openGraph.url`, and
  `{index:false, follow:false, nocache:true}` for non-indexable pages.
- **Removing `alternates: { canonical: "/" }` from `src/app/layout.tsx` is a
  genuine bug fix**, not just a refactor. A root-level canonical of `/` is
  inherited by every route, which would have pointed the whole site's canonical
  at the homepage and suppressed indexing of `/pricing`, `/faq`, `/blog/*` and
  the rest. Per-page canonicals now replace it.
- `/login` and `/signup` gain layouts with `indexable: false`, so auth pages
  are explicitly `noindex` instead of relying on the proxy redirect alone.
- `sitemap.ts` now derives from the registry and filters on `indexable`, so the
  sitemap can no longer drift from page metadata. Dropping `changeFrequency`
  and `priority` is not a regression — Google ignores both.
- The fee calculator cites its source and carries a visible "Reviewed 28 July
  2026" date. `getCyberEssentialsFee` rejects negative and non-integer input,
  and the `Number.POSITIVE_INFINITY` upper band means no employee count falls
  through unmatched.
- Founder `sameAs`/`@id` JSON-LD is well formed, and the existing "BrightCert
  does not issue official Cyber Essentials certification" disclaimer is
  preserved in the Organization schema.

### Owner decisions required before integration

1. **`FOUNDING10` is capped at 10 redemptions and this branch puts the £99
   price into indexed metadata.**
   The coupon is real and correctly configured (£100 off, valid, 0 of 10 used),
   so the claim is accurate *today*. The risk is durability, not honesty:
   `SITE_PAGES.pricing.description` now advertises "£99 including VAT with
   FOUNDING10" in the meta description, and search engines cache snippets for
   weeks. On the 11th customer the code stops working while the site — and
   Google's cached snippet — still quote £99. Under the UK CPRs a price shown
   that cannot be obtained is a problem.
   This is **not introduced by this branch** (13 files on `origin/main` already
   carry the claim; this branch adds a 14th), but the branch materially widens
   exposure by moving it into indexed metadata.
   Options: state the limit in the copy ("first 10 customers"), raise
   `max_redemptions`, or drop the promo price from meta descriptions and keep
   it on-page only.

2. **`display: "swap"` → `display: "optional"` on all three fonts**
   (`src/app/layout.tsx`). This is a deliberate Core Web Vitals trade: it
   removes font-swap layout shift, but `optional` means a visitor whose font
   is not cached within roughly 100 ms sees the fallback face **for that entire
   page view and never swaps**. First-time visitors on slow connections will
   not see Inter or Bricolage Grotesque at all. Given `DESIGN-SYSTEM.md`
   specifies Inter as a brand token, this is a design decision, not purely a
   performance one, and should be the owner's call.

### Minor, non-blocking

- `/assessment/[id]/check-answers` and `/assessment/[id]/section/[sectionId]`
  export no metadata. Both sit under `/assessment`, which `src/proxy.ts` lists
  in `PROTECTED`, so a crawler is redirected to `/signup` (itself now
  `noindex`) and cannot index them. Worth an explicit `noindex` for
  completeness rather than relying on the redirect.
- `CYBER_ESSENTIALS_FEE_BANDS` hardcodes IASME's fee schedule. It is sourced
  and dated, but it is a third party's pricing and will drift. Recommend a
  recurring review reminder tied to the "Reviewed" date already in the UI.
- The calculator uses `#047857` and radii of 20px/14px, where
  `DESIGN-SYSTEM.md` specifies emerald `#059669` and 12px/16px card radii.
  Possibly intentional for contrast on the light-green ground; flagging for
  consistency only.
- `STRIPE_PRICE_ASSESSMENT` and `STRIPE_PRICE_MONITOR` exist in Vercel
  production but are dead configuration — `checkout/route.ts` builds inline
  `price_data` and never reads them. Unrelated to this branch; noted while
  corroborating the pricing claim.

### Branch overlap

`codex/seo-growth` and `codex/preview-build-supabase-fallback` both modify
`src/app/(marketing)/page.tsx` and both add `src/app/homepage-prerender.test.tsx`.
The commits `f0a68c0` (seo) and `4447507` (preview) share the patch-id
`90747379c31b1e350a86e3f2db9005c23760fadc`, so this is the **same fix committed
twice on two branches**, not a divergent conflict. Integrating both is safe;
the second will apply as a no-op or a trivially resolvable duplicate. Per the
protocol this is reported, not resolved here.

## External state

- **Database writes:** None.
- **Deployment:** None.
- **Emails/messages:** None.
- **Payments:** None. Stripe access was read-only (`GET` on coupons,
  promotion codes, prices, products). No Stripe object was created, modified,
  or deleted.
- **Other external actions:** This review branch will be pushed. No merge, no
  rebase, and no modification of `codex/seo-growth`.

## Remaining risks or blockers

- The two owner decisions above are the only things standing between this
  branch and integration. Neither is a code defect.
- This review covered SEO correctness, build/test health, and the accuracy of
  customer-facing pricing claims. It did **not** assess whether the new copy
  matches `COPY.md` verbatim, because `COPY.md` lives at the workspace root
  (`/Users/rumipro/Documents/Hackathon/COPY.md`) outside the repository and is
  unversioned, so a reviewer cannot diff branch copy against it reproducibly.
- No live-mode indexing effect can be confirmed until this is deployed;
  everything above is verified from source, build output, and the Stripe API.

## Next safe action

Owner decides on the `FOUNDING10` exposure and the `font-display` change, then
integrates `codex/seo-growth`. Integrate
`codex/preview-build-supabase-fallback` and `codex/reminder-evidence-integration`
in the same pass, since the former duplicates a commit already on
`codex/seo-growth`.

Do **not** integrate `codex/production-report-redesign` (`d33e62d`) in this
pass — its three blockers are recorded in
`2026-07-29-1947-codex-report-redesign-review.md` and independently confirmed;
the unscheduled worker in particular would leave paid reports permanently
queued on the current Hobby plan.
