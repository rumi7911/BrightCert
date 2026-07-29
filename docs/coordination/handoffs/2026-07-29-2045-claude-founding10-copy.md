# Agent task handoff

- **Agent:** Claude Code
- **Date/time (BST):** 29 July 2026, 20:45
- **Task:** State the real `FOUNDING10` redemption cap wherever the discounted
  price is quoted, and reconcile the offer-contract guard and policy documents
  with that decision
- **Branch:** `claude/founding10-copy`
- **Worktree:** `.worktrees/founding10-copy`
- **Base commit:** `11d71ea` (`codex/seo-growth`), **not** `origin/main`
- **Final commit:** `c36ddb6`, plus the commit containing this handoff
- **Status:** Complete on the task branch; awaiting owner-controlled merge

## Scope and ownership

- **Files intentionally changed:** 20 — 12 copy surfaces under `src/app` and
  `src/lib/resend/emails.ts`; `src/lib/seo/registry.ts`; `public/llms.txt`;
  `public/pricing.md`; `README.md`; `src/lib/offer-contract.test.ts`;
  `src/app/api/stripe/checkout/route.ts` (comment only);
  `docs/outreach/SOP.md`; `docs/outreach/EMAIL-SEQUENCES.md`.
- **Files inspected but not changed:** `codex/seo-growth` range,
  dirty-`main` status, the Stripe coupon/promotion-code/price objects.
- **Overlapping work discovered:** yes, two items — see below.
- **Files another agent must not overwrite:** none introduced by this task.

### Base-branch choice

Thirteen files on `origin/main` carry the `FOUNDING10` claim, and **eight of
them are also modified by `codex/seo-growth`**. Branching from `origin/main`
would have produced an eight-file conflict on integration. This branch is
therefore based on `codex/seo-growth` (`11d71ea`), which also contains the
`src/lib/seo/registry.ts` meta description that motivated the change.

**Merge order is therefore `codex/seo-growth` first, then this branch.** If the
owner decides not to integrate `codex/seo-growth`, this branch must be rebased
onto `origin/main` and the `registry.ts` hunk dropped before it will apply.

### Dirty-main overlap

`docs/outreach/SOP.md` is one of the uncommitted dirty-`main` files. The owner's
uncommitted hunk is at lines 11–33; the line changed here is the compliance
checklist at line 123. The two regions do not overlap, so Git will merge them
without conflict, but the owner should confirm when reconciling dirty `main`.
`docs/outreach/EMAIL-SEQUENCES.md` is clean in dirty `main`.

## Changes

`FOUNDING10` is capped at **10 redemptions** in Stripe. Customer-facing copy
quoted the resulting £99 price with no mention of that cap, so once ten
customers redeem it, the site would advertise a price nobody can obtain.
`codex/seo-growth` widened the exposure by moving the claim into indexed
metadata, where a cached search snippet outlives any on-site correction.

All 25 occurrences now state the limit. Wording is matched to context: long
prose reads "for the first 10 customers", the two pill badges read
"Code FOUNDING10 · £100 off £199 · first 10 customers", and the pricing meta
description was rewritten to 159 characters (previously 158) so it keeps
"including VAT", the code, and the cap within the snippet budget.

### Conflict with an existing owner rule, and how it was resolved

`src/lib/offer-contract.test.ts` — added by the owner in `7d12739` on 26 July —
**banned first-customer copy outright**, and `SOP.md:123` and
`EMAIL-SEQUENCES.md:180` state the same rule. The first edit therefore broke
that test across 12 files.

This was raised with the owner rather than resolved unilaterally, because the
rule looked deliberate and compliance-related. The owner chose to permit
factual limits only. Accordingly:

- the scarcity guard is narrowed to `ARTIFICIAL_SCARCITY`, which still bans
  "limited cohort/places/offer/time/availability", "places/spots/seats
  left/remaining", "only N left", "ending soon", "act fast", "hurry" and
  "while stocks last";
- a **new** test, `discloses the FOUNDING10 cap wherever the discounted price
  appears`, requires the cap in any customer-facing file that mentions both
  `FOUNDING10` and `£99`. This is the guard that actually prevents the original
  failure, and it did not previously exist;
- `SOP.md` and `EMAIL-SEQUENCES.md` are amended so the written rule matches the
  code, drawing the distinction explicitly: a Stripe-verifiable cap is
  permitted and expected; any limit or count we cannot substantiate is not.

## Verification

All commands run **from inside `.worktrees/founding10-copy`**.

```text
npx tsc --noEmit
-> exit 0, no diagnostics

npm run test:run
-> 23 test files passed; 211 tests passed
   (210 before; the scarcity test was split into scarcity + cap-disclosure)

npm run lint
-> exit 0, no warnings

set -a; source <repository .env.local>; set +a; npm run build
-> Compiled successfully in 3.0s; 31/31 static pages generated
```

Both guards were verified to fail on a real violation rather than passing
vacuously:

```text
removed ", available to the first 10 customers." from README.md
-> × discloses the FOUNDING10 cap wherever the discounted price appears
   AssertionError: expected [ 'README.md' ] to deeply equal []
restored -> 11 passed

appended "Places left: only 3 remaining." to public/pricing.md
-> × contains no artificial scarcity or urgency copy
   AssertionError: expected [ 'public/pricing.md' ] to deeply equal []
reverted -> 11 passed
```

Stripe reads that establish the cap is real (read-only, no writes):

```text
GET /v1/coupons
-> ZXdXak08 "Founding 10 customers" 100.00 GBP off, valid=true,
   duration=once, max_redemptions=10, times_redeemed=0

GET /v1/promotion_codes
-> FOUNDING10 active=true (max_redemptions 10, redeemed 0)
   FOUNDING10 active=false (max_redemptions 1, redeemed 0)
```

## External state

- **Database writes:** None.
- **Deployment:** None. This copy is not live until the owner merges and
  deploys.
- **Emails/messages:** None. `src/lib/resend/emails.ts` was edited but no email
  was sent.
- **Payments:** None. Stripe access was read-only; no coupon, promotion code,
  price, or product was created, modified, or deleted.
- **Other external actions:** Pushed `claude/founding10-copy` to origin. No
  merge, no rebase, no modification of `codex/seo-growth`.

## Remaining risks or blockers

- **The cap and the copy are now coupled and must move together.** If
  `max_redemptions` is ever raised or the coupon replaced, the copy and both
  policy documents must change in the same pass. A comment at
  `src/app/api/stripe/checkout/route.ts:34` records this; nothing enforces it
  automatically, because the test cannot read Stripe.
- **The cap still bites at customer 11.** This change makes the site honest
  about the limit; it does not remove the limit. When the tenth code is
  redeemed, the £99 figure should be retired from the copy entirely, and
  cached search snippets will lag that change by days or weeks.
- `public/llms.txt` markets Monitor, CE Plus Pack and MSP Partner as "coming
  soon". Out of scope here and left unchanged, but flagged: none has a working
  Stripe checkout.
- This branch depends on `codex/seo-growth`. See "Base-branch choice".

## Next safe action

Owner integrates `codex/seo-growth` first, then this branch, then verifies the
rendered pricing page and one transactional email before deploying. The
`font-display: optional` decision recorded in
`2026-07-29-2035-claude-seo-growth-review.md` is still open and is independent
of this change.
