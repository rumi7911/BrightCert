# Outreach launch verification - 26 July 2026

Overall decision: **NO-GO for external prospect sends**.

The implementation is locally verified, but the reviewed branch is not the
live production release. The first ten internal/friendly seed messages remain
the only campaign-related send allowance, and even those still require the
owner-controlled inbox checks in [LAUNCH-GATE.md](./LAUNCH-GATE.md).

## Passed in the reviewed branch

| Check | Evidence | Result |
|---|---|---|
| Automated suite | `npm run test:run` | 10 files, 151 tests passed |
| Lint and types | `npm run lint`; `npx tsc --noEmit` | Passed |
| Production build | Existing repository-local environment; Next.js 16.2.9 | Passed; all 30 pages generated |
| Public proposition | Browser accessibility snapshot and repository scan | Homepage H1, auth copy, metadata and Open Graph use “Find out how ready you are in around 2 hours.”; retired H1 absent from reviewed sources |
| Consent before a decision | Fresh browser profile with Clay campaign UTMs | No consent, attribution, GA or local-storage cookie/state before choice |
| Consent granted | Browser accept path | `bc_consent`, first/last-touch attribution and GA loaded only after accept |
| Returning consented visitor | Second URL with different campaign UTMs | First touch preserved; last touch and flat current UTMs refreshed |
| Decline and withdrawal | Fresh decline plus accept-then-withdraw browser paths | Attribution and GA cookies/scripts/memory removed, GA disabled, no browser exception, later tracking blocked |
| Anonymous route protection | Browser checks for `/dashboard` and `/assessment/new` | Both redirect to signup with the encoded return path |
| Social preview source | Generated metadata plus `public/og.jpg` | Current description/alt; JPEG is 1200x630 and visually approved |
| PDF fixture | Real `@react-pdf/renderer` output, Poppler metadata/text/rendering | Exactly five A4 pages; all pages visually inspected; no clipping, overlap, orphan-only continuation or missing disclaimer/page number |
| Outreach controls | Focused tests, CLI smokes and independent reviews | Exact company verification, canonical history, suppressions, outcome stopping, audit events and step-aware reporting approved |

The production-build workspace-root warning about the main and worktree
lockfiles is expected for this isolated worktree and did not affect output.

## Verified production/external state

| Check | Evidence | Result |
|---|---|---|
| SPF | DNS TXT lookup | `v=spf1 include:spf.improvmx.com ~all` resolves |
| DKIM | DNS TXT lookup | `resend._domainkey` public key resolves |
| DMARC | DNS TXT lookup | Monitoring record resolves with `p=none`, aggregate reports, relaxed SPF/DKIM alignment and `pct=100` |
| Anonymous production redirects | HTTP headers | `/dashboard` and `/assessment/new` return 307 to signup with the correct return path |
| Draft reminder safety | Authenticated production `dryRun=true`; response reduced to counts | Dry-run true; three would-send records, all 72-hour tier; no email or database stamp performed |
| Stripe mode and webhook | Read-only Stripe API | Live mode; production webhook enabled for `checkout.session.completed` |
| Founding discount | Read-only Stripe API | `FOUNDING10` active and valid; £100 GBP one-time discount; zero redemptions at verification time |
| Payment-row reconciliation | Read-only production Supabase query after the authorised correction | Zero assessments remain marked paid without current payment evidence |

No secret, email address, assessment identifier or prospect record is included
in this report.

## Open gates

| Gate | Current evidence | Required next action |
|---|---|---|
| Reviewed release is live | Production still serves the retired homepage/Open Graph wording and a different social image; origin `main` remains at the pre-implementation commit | Merge/push the reviewed branch, deploy the intended commit, then repeat live message, consent, auth and social checks |
| Database changes | Outreach migrations and the organisation first/last-touch SQL are invariant-tested but not applied to the production project | Apply through the reviewed Supabase migration process; record versions, RLS/grants/functions/views and column checks |
| Companies House credential | `~/.config/brightcert/outreach.env` does not yet exist | Add the key outside the repository, load it into the operator shell and run one known-active plus fail-closed live verification |
| LIA and campaign approval | Complete draft exists | Owner/privacy reviewer completes the named sign-off fields for this exact campaign |
| Inbox placement | SPF/DKIM/DMARC records resolve; no controlled seed batch has been run here | Send one aggregate batch of no more than ten internal/friendly seeds; verify authentication, inbox placement, rendering and replies |
| Live payment lifecycle | Live Stripe configuration and discount are present; no real-card transaction was created | Owner completes one £99 including-VAT checkout, verifies webhook, entitlement, receipt/invoice and PDF, then refunds and reconciles it |
| Signed-in production auth | Anonymous redirects pass | Owner tests sign-in, callback, signed-in protected access and sign-out on the deployed commit |
| Production PDF | Five-page local rendering passes | Verify one paid production report, access control, storage URL, download and visual output after the live checkout |
| Provider/error evidence | Draft reminder dry-run passes | Exercise the approved provider-failure rehearsal without sending or falsely stamping success |

## Companies House key placement

Keep the key outside the project:

```sh
mkdir -p ~/.config/brightcert
umask 077
printf 'COMPANIES_HOUSE_API_KEY=\n' > ~/.config/brightcert/outreach.env
chmod 600 ~/.config/brightcert/outreach.env
```

Edit that file locally, then load it only into the operator shell:

```sh
set -a
. ~/.config/brightcert/outreach.env
set +a
```

Do not paste the value into chat, `.env.local`, Vercel browser variables, a CSV
or a command argument. The current Companies House integration is a local
operator CLI, so a Vercel environment variable is not required.
