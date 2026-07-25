# BrightCert founding-customer outreach implementation

## Global constraints

- UK-only, English-only, corporate B2B pilot; exclude sole traders and unincorporated partnerships.
- Use `muhammad@brightcert.co.uk` for manual founder outreach. Do not add an automated cold-email sender.
- Initial target mix is 120 SME prospects and 30 MSP/IT-provider prospects.
- Every eligible prospect requires a company number, supported corporate legal entity type, active Companies House status, corporate work email, source URL and date, a documented Cyber Essentials trigger, approved legitimate-interests assessment, human review, and no suppression.
- Preserve source lineage and use only public business-context or licensed Clay data. Exclude unverifiable, personal-mail, role-account, disposable, prior opt-out, existing-customer, and no-trigger records.
- The founding offer is a free founder-led baseline followed by a £99 including VAT permanent report/workspace unlock via the existing £100 `FOUNDING10` discount. Never claim certification, a guaranteed pass, or remediation in two hours.
- Pre-consent campaign attribution must not use cookies, local storage, or session storage. Consent withdrawal must delete attribution and analytics state. A consented returning visitor with new UTMs must record the new campaign while preserving first-touch context.
- Prospect records expire 180 days after the sequence unless converted; active sequence records may be retained for 90 days after the sequence; minimal suppression evidence is retained so an opt-out is not contacted again.
- No secret may be committed or exposed to browser code. Companies House verification reads `COMPANIES_HOUSE_API_KEY` from the server/operator process environment.
- Work test-first. Human-facing prose and SQL policy documents do not require source-text tests.

## Task 1: Close the product-controlled pre-launch gates

- Replace the retired promise on auth, metadata, and the social card with: `Find out how ready you are in around 2 hours.`
- Use the generated replacement asset at `/Users/rumipro/.codex/generated_images/019f9105-df45-7a00-8fe0-a87bf8da2588/call_rB0l6uvGM8ydAnNNqRULmPbs.png`, converted to a 1200×630 JPEG at `public/og.jpg`.
- Add Vitest using the installed Next 16 testing guidance.
- Remove all pre-consent web-storage attribution. Capture current URL UTMs only after consent; preserve first and last touch for consented visitors; validate and size-limit data; keep backward-compatible top-level `utm_*` fields for signup.
- On denial or withdrawal, delete `bc_attribution`, all GA cookies, pending legacy storage, injected GA scripts, and in-memory GA state, and disable further GA events. On an already-consented return visit, capture any current campaign UTMs.
- Persist consented first- and last-touch values at signup in new organisation columns.
- Expand the public privacy notice for outreach/prospect data, Clay and public sources including Companies House, legitimate interests, the unconditional right to object to direct marketing, processor/sharing categories, the retention schedule, and minimal suppression retention. Publish plain-language opt-out instructions using reply or email.
- Ensure Resend helpers surface returned API errors instead of allowing reminder jobs to record false success.

## Task 2: Implement the outreach data and verification system

- Add a versioned, idempotent Supabase migration for campaigns, corporate companies, prospects, suppressions, append-only events, send attempts, and a weekly funnel view. Enable RLS with no anon/authenticated read policies; service role/operator scripts are the only application access.
- Implement pure, unit-tested prospect normalization and gate logic. The gate must reject unsupported entities, inactive/unverified companies, non-corporate or role/disposable emails, missing source/trigger/evidence/LIA/human approval, suppressions, existing customers, duplicates, and invalid sequence transitions.
- Implement a unit-tested Companies House client with Basic authentication, timeouts, bounded retry/backoff for 429/5xx, safe error mapping, exact company-number verification, supported corporate type checks, and no secret/raw payload logging.
- Implement CSV parsing/export protection and an operator CLI that validates a Clay export, verifies companies when the key is present, records explicit gate reasons, creates an approved manual-send queue, applies suppressions/outcomes, and emits weekly campaign reports. Protect spreadsheet formula injection and never place raw prospect data in Git.
- Add an idempotent seed command that creates the global suppression store without adding personal data.
- Document the secure key setup and add only the variable name to `.env.example`.

## Task 3: Create the campaign operating assets

- Add an approved LIA template/record for this UK corporate pilot, a data-flow and retention policy, the exact ICP and exclusion checklist, a Clay field-mapping CSV contract, a send-gate checklist, an opt-out/DSAR process, deliverability pause rules, and payment reconciliation evidence checklist.
- Create concise three-touch SME copy over 12 business days and three-touch MSP copy over 14 business days. Each touch must add value, use one low-friction CTA, include the privacy/objection wording, and stop after reply or opt-out.
- Provide campaign UTM conventions, a 30-day operator calendar, daily batch limits of 20 initially and 30 only after the first 50 healthy sends, and the target funnel of 150 sends / 15 positive replies / 8 calls / 5 baselines / 3 paid.
- Include operator-ready CSV templates with no real personal data and a weekly scorecard template split by segment, trigger, campaign, and copy version.

## Task 4: Verify production and external gates

- Run unit tests, lint, TypeScript, production build, auth redirect checks, consent browser scenarios, social-preview checks, reminder dry-runs, and PDF verification where supported.
- Add DMARC monitoring with `p=none` only after confirming the DNS record is absent and the exact Vercel-managed domain.
- Perform read-only Stripe/Supabase reconciliation to identify paid rows lacking Stripe evidence without exposing secrets. Do not delete or refund until exact records and transaction state are verified.
- Record owner-only gates that cannot be completed without an interactive card, dashboard access, inbox recipients, legal approval, or the Companies House API key. Never report these as passed without evidence.
