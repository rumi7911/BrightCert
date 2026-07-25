# Task 3 implementation report: founding-customer campaign pack

## Implementation

Created the nine-document founder operating pack under `docs/outreach/`:

- `LIA.md`: explicitly draft, unsigned Legitimate Interests Assessment with
  purpose, necessity and balancing tests; corporate-only scope; data
  minimisation, sources, impact, safeguards, objection and retention controls;
  and owner/date/review/sign-off fields.
- `ICP.md`: exact 120 SME/30 MSP mix, direct and partner profiles, roles,
  sectors, trigger-strength rubric, evidence rules, and fail-closed
  disqualifiers. Missing Companies House identity is correctly treated as
  ambiguous rather than proof of sole-trader status.
- `CLAY-CSV-CONTRACT.md`: the exact 27 canonical columns mapped to meanings,
  values, sources and human review, with a `.test`/fictitious-only example,
  deduplication/exclusions, and validate/verify/fresh-queue flow.
- `DATA-FLOW-AND-RETENTION.md`: compact source-to-deletion flow, owners, private
  storage boundaries, no-open-tracking rule, same-day opt-out handling, the
  90/180-day schedule, customer transfer, and minimal separate suppression.
- `SOP.md`: pre-flight, seed and daily workflow, exact CLI commands, manual
  founder send controls, sequence-state handling, terminal events, same-day
  suppression, delivery pauses, weekly reporting, DSAR/rights handling,
  retention cleanup, payment reconciliation, one-prospect acceptance path, and
  non-PII UTM conventions.
- `EMAIL-SEQUENCES.md`: concise three-touch SME sequence on business days
  1/6/12 and MSP sequence on 1/7/14, each with one reply CTA, verified-trigger
  opening, value-adding follow-up, and clear privacy/objection footer. Pricing
  is limited to the approved £99 including VAT via the existing £100
  `FOUNDING10` discount from £199.
- `30-DAY-CALENDAR.md`: gate-relative T0, setup, 25/50-send checkpoints,
  10–15/day start, 20/30 caps, calls/baselines, one-variable experiments,
  objections, winner focus, exact 120/30 completion, and Day-30 decision.
- `SCORECARD.md`: exact funnel definitions, targets, formulas, pause and
  diagnosis rules, required reporting splits, revenue truth, and a compact
  weekly template.
- `LAUNCH-GATE.md`: a single no-go-by-default checklist distinguishing
  `verified`, `operator action required`, and `owner action required` across
  product, privacy, legal, data, email-domain, payment, database and production
  evidence. No item is falsely pre-verified.

The pack cross-links the canonical Task 2 operator runbook and tracked CSV
template. No product code, sender, live data, booking URL, legal approval,
external send, or external mutation was added.

## Verification

- Full Vitest suite: 9 files passed, 119 tests passed.
- ESLint: exit 0.
- TypeScript `npx tsc --noEmit`: exit 0.
- Installed CLI smoke: validate, suppression seeding, imported event and weekly
  report succeeded using only the tracked fictitious example in a temporary
  directory; verify refused to write when the Companies House key was
  deliberately absent.
- CLI documentation audit: 23 documented commands across the pack/runbook use
  only subcommands and options accepted by `src/lib/outreach/cli.ts`, with every
  required option present.
- Pack audit: all nine documents present; exact canonical 27-column header;
  six email touches and exactly six CTA question marks; privacy and opt-out
  footer in every touch; only the approved £99/£100/£199 amounts; balanced code
  fences; and all local Markdown targets present.
- External documentation links: the BrightCert privacy page and both cited ICO
  guidance pages returned HTTP 200.
- Secret/PII hygiene: only the required founder address and explicitly
  fictitious `.test` contact address appear; no populated Companies House,
  Stripe, webhook or private-key pattern appears.
- Manual contextual review found no positive claim of official certification,
  guaranteed readiness/pass, completed remediation in two hours, artificial
  scarcity, customer/cohort count, open-rate evidence, or verified booking URL.
- Staged diff and whitespace checks were run before commit.

## External and owner gates

- The LIA remains `DRAFT — OWNER/LEGAL REVIEW REQUIRED BEFORE FIRST SEND`; this
  task does not provide legal advice or approval.
- Companies House live credentials/checks, production database migration,
  SPF/DKIM/DMARC, controlled seed sends, live checkout/webhook/entitlement/
  receipt/refund evidence, production commit parity, auth/preview/PDF/reminder
  evidence, and final go/no-go sign-off remain explicitly assigned owner or
  operator actions in `LAUNCH-GATE.md`.
- No email was sent, no live prospect/customer/payment data was accessed, and
  no external service or production data was mutated.
