# Mobile dashboard and contact page design

Date: 15 August 2026

Branch: `codex/mobile-contact-ux`

Worktree: `/Users/rumipro/Documents/Hackathon/brightcert/.worktrees/mobile-contact-ux`

## Objective

Make the existing BrightCert dashboard work cleanly on phone and tablet widths, and replace the footer's email-only contact link with a public `/contact` page containing a working form.

The work is a targeted, brand-preserving refinement. It does not redesign the information architecture, desktop dashboard, assessment flow, or marketing site.

## Design direction

BrightCert is a trust-first B2B readiness product for UK SMEs. The interface should remain calm, direct, and accessible, using the existing navy, emerald, paper background, Bricolage display type, Inter body type, and established 8px/16px radius rules.

Design settings for this task:

- Design variance: 4
- Motion intensity: 2
- Visual density: 5

The mobile experience prioritises readable hierarchy, complete content, reliable tap targets, and no horizontal scrolling. Decorative motion is out of scope.

## Scope

### Included

- Responsive fixes for all dashboard states: empty, draft, submitted, analysed, and paid.
- Responsive treatment for the dashboard top bar, verdict band, control areas, priority issues, report summary, history, and tip card.
- A public `/contact` marketing route.
- A contact form that sends to `hello@brightcert.co.uk` through the existing Resend integration.
- Accessible validation, pending, success, and failure states.
- A basic honeypot spam control.
- Footer, SEO registry, and sitemap integration for `/contact`.
- Automated and browser-level responsive verification.

### Excluded

- Database storage of contact submissions.
- A customer support ticket system, autoresponder, or CRM integration.
- CAPTCHA, third-party rate limiting, or new infrastructure.
- Changes to dashboard data fetching or assessment scoring.
- A broad audit of unrelated pages.
- Deployment or live email submission.

## Responsive dashboard

### App frame

The existing mobile navigation strip and drawer remain. The page canvas must never exceed the viewport width. Layout wrappers continue to use `min-w-0`, and dense children must be allowed to wrap or switch presentation below 640px.

### Sticky dashboard header

On phones, the title and subtitle remain above the actions. The two actions become a one-column grid with full-width controls and at least a 44px touch height. `Unlock report` remains visually primary and `New assessment` remains secondary. At the small breakpoint and above, the current horizontal arrangement returns.

Long promotional copy stays in the existing tooltip and supporting areas. Button labels stay on one line.

### Empty, draft, and submitted states

State cards reduce horizontal padding on small screens. Icon and copy groups may stack where necessary. Their primary action becomes full width on phones and returns to intrinsic width above the small breakpoint.

### Verdict band

The score remains the first visual anchor but scales down on phones. Verdict text, score change, critical issue count, and the explanatory link become distinct readable lines rather than one metadata sentence. Separator characters that encourage overflow are removed from the mobile presentation.

The target meter remains a real score visual. Labels stay inside the card and do not collide at 320px.

### Control areas

The current table remains at the small breakpoint and above. Below that breakpoint, the same data is rendered as interactive stacked rows:

- Row one: numbered control name and score.
- Row two: status and a concise prompt when the row can filter priority issues.
- The full row is a minimum 44px target.
- Active and hover/focus states preserve the existing emerald treatment.

The desktop progress meter remains unchanged. The mobile presentation does not duplicate the dense meter.

### Priority issues

Issue descriptions wrap on phones instead of truncating. The control-area label moves below or alongside the description according to available width. Clear-filter and all-issues actions wrap without colliding.

### Supporting column

The current two-column desktop grid remains. Report, history, and tip sections stack naturally below the primary dashboard content on smaller screens. History rows allow their middle label to shrink without pushing actions outside the card.

## Contact page

### Page structure

`/contact` uses the existing `SignalNav` and `SignalFooter`. The page is a single light theme matching the marketing site.

Desktop uses two columns:

- Introductory copy, direct email fallback, and a clear statement that replies are sent by email as soon as possible without promising a fixed service level.
- The contact form in a single elevated white surface.

Below 768px the page becomes one column. The form follows the introduction, every field is full width, and primary actions are at least 44px high.

### Form fields

- Name: required, 2 to 100 characters.
- Work email: required, valid email shape, maximum 254 characters.
- Organisation: optional, maximum 120 characters.
- Enquiry type: required, selected from a fixed server-owned list: Product question, Assessment support, Billing and reports, Partnerships, Privacy, or Something else.
- Message: required, 10 to 5,000 characters.
- Website: hidden honeypot field, expected to be empty.

Labels appear above fields. Placeholders provide examples only and never replace labels. Field descriptions and errors sit below their relevant control.

### Submission behaviour

The client form uses React 19 `useActionState` with a Next.js Server Action, following the installed Next.js 16.2 guidance.

Submission flow:

1. Native constraints provide immediate basic feedback.
2. The Server Action normalises and validates every field.
3. A populated honeypot returns a generic success response without sending.
4. Valid input is passed to a dedicated contact-email function.
5. The email is sent from the configured verified BrightCert sender to the fixed recipient `hello@brightcert.co.uk`.
6. The visitor's validated email is set as `replyTo`.
7. The action returns a success state. The client shows an accessible confirmation and resets the form.

No submission data is written to Supabase, logs, analytics, or browser storage.

### Email content and safety

The email subject includes only the fixed enquiry label and a safely normalised name. The body contains the submitted fields in a simple BrightCert-branded template.

All user-provided content is HTML-escaped before interpolation. The `to` and `from` addresses are server-owned constants. Only a successfully validated email is used for `replyTo`. Control characters are not accepted in short fields.

### Feedback states

- Pending: button disabled with `Sending...`; fields remain visible.
- Validation error: inline field messages plus an accessible form-level prompt.
- Delivery error: a recoverable form-level message and the direct `hello@brightcert.co.uk` link.
- Success: confirmation that the message was sent and that BrightCert will reply by email as soon as possible; the form resets.

The status region uses `aria-live="polite"`. Focus, labels, helper text, placeholders, and errors meet WCAG AA contrast against their surfaces.

### Privacy copy

The form states that submitted details are used only to answer the enquiry and are sent by email. It links to the existing privacy policy. Since no new storage or marketing purpose is introduced, the task does not change consent behaviour.

## Component and module boundaries

- `src/app/(marketing)/contact/page.tsx`: page composition and metadata.
- `src/app/(marketing)/contact/contact-form.tsx`: client interaction and accessible state rendering.
- `src/app/(marketing)/contact/actions.ts`: Server Action boundary and form validation orchestration.
- `src/lib/contact/contact-form.ts`: pure parsing, normalisation, and validation.
- `src/lib/resend/emails.ts`: contact email delivery using the existing Resend client.
- `src/components/brightcert/signal-footer.tsx`: route the shared contact link to `/contact`.
- `src/app/(app)/dashboard/page.tsx`: responsive dashboard layout and verdict presentation.
- `src/components/brightcert/dashboard-issues.tsx`: mobile control rows and wrapping issue presentation.
- `src/lib/seo/registry.ts`: add indexable contact metadata.
- Existing sitemap and SEO tests: prove route discovery and canonical metadata.

Pure validation stays independent of React and Resend. This allows field behaviour to be tested without mocking framework internals. The Server Action remains a thin coordinator.

## Error handling

- Invalid input never calls Resend.
- Resend API errors and thrown transport errors return the same safe visitor-facing failure message.
- Internal provider details are not exposed in the page.
- The direct mail link remains available when submission fails.
- A honeypot submission does not reveal that spam detection was triggered.

## Test strategy

Implementation follows red, green, refactor cycles.

### Pure validation tests

- Accept a valid complete submission.
- Accept an omitted organisation.
- Reject each missing required field.
- Reject malformed or oversized email values.
- Reject unknown enquiry types.
- Reject short or oversized messages.
- Normalise surrounding whitespace.
- Identify a populated honeypot without delivering.

### Email tests

- Always sends to `hello@brightcert.co.uk`.
- Uses the configured fixed sender.
- Uses the validated visitor address only as `replyTo`.
- Escapes HTML and control characters from visitor content.
- Surfaces a Resend API error to the action boundary.

### Component and contract tests

- Footer contact link targets `/contact`.
- Contact page exposes labelled controls, privacy copy, and email fallback.
- Form renders field errors and delivery errors accessibly.
- Success feedback resets the form.
- SEO registry and sitemap include `/contact`.
- Dashboard mobile markup provides a narrow-screen presentation without removing the wider-screen table.

### Browser verification

Verify `/dashboard` and `/contact` at 320, 375, 390, 768, 1024, and 1440 CSS pixels where applicable. Checks include:

- No horizontal page overflow.
- Dashboard actions fit the viewport.
- Verdict content and target labels do not collide.
- Control rows remain readable and tappable.
- Contact labels, errors, pending state, success state, and keyboard focus are visible.
- Mobile navigation and footer still work.

No browser verification will submit a real Resend email.

## Completion criteria

- The supplied dashboard scenario has no horizontal overflow at phone widths.
- All dashboard states retain clear primary actions.
- `/contact` is reachable from the footer and works without JavaScript-dependent navigation.
- A valid form submission is addressed only to `hello@brightcert.co.uk` through Resend.
- Invalid and spam-like submissions do not send.
- No contact data is persisted.
- Focused tests, full tests, lint, type-check, and production build pass.
- The branch is committed, pushed, and documented in a new coordination handoff without merging or deploying.
