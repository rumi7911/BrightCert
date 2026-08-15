# Mobile Responsive Dashboard and Contact Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the dashboard's phone-width overflow and add an accessible `/contact` form that emails `hello@brightcert.co.uk` through the existing Resend integration without persisting submissions.

**Architecture:** Keep dashboard changes inside the existing server-rendered dashboard and `DashboardIssues` client component. Build the contact flow as a pure validation module, a thin Server Action, a small client form, and a dedicated Resend email builder so validation and delivery contracts can be tested independently.

**Tech Stack:** Next.js 16.2 App Router, React 19 Server Actions and `useActionState`, TypeScript, Tailwind CSS 4, Resend 6, Vitest 4, Testing Library, Playwright browser verification.

## Global Constraints

- Work only in `/Users/rumipro/Documents/Hackathon/brightcert/.worktrees/mobile-contact-ux` on `codex/mobile-contact-ux`.
- Preserve the existing BrightCert navy, emerald, paper background, typography, routes, analytics hooks, and desktop dashboard information architecture.
- Support dashboard widths of 320, 375, 390, 768, 1024, and 1440 CSS pixels with no horizontal page overflow.
- Send contact submissions only to `hello@brightcert.co.uk` through Resend; do not write submissions to Supabase, logs, analytics, or browser storage.
- Do not add CAPTCHA, rate-limit infrastructure, a CRM, autoresponders, dependencies, database migrations, deployments, or live test emails.
- Use UK English and no em dash or en dash characters in new visitor-facing contact copy.
- Follow test-first red, green, refactor cycles and commit each independently testable task.
- Use `/opt/homebrew/Cellar/node@20/20.20.2/bin` on `PATH` for Node commands.

---

## File map

**Create**

- `src/lib/contact/contact-form.ts`: contact field types, fixed enquiry choices, normalisation, and validation.
- `src/lib/contact/contact-form.test.ts`: pure validation and honeypot tests.
- `src/app/(marketing)/contact/actions.ts`: public Server Action that coordinates validation and delivery.
- `src/app/(marketing)/contact/actions.test.ts`: action success, validation, honeypot, and delivery-failure behaviour.
- `src/app/(marketing)/contact/contact-form.tsx`: client form, pending state, field errors, reset, and success message.
- `src/app/(marketing)/contact/contact-form.test.tsx`: accessible form behaviour.
- `src/app/(marketing)/contact/page.tsx`: contact route composition and metadata.
- `src/components/brightcert/dashboard-issues.test.tsx`: mobile control selector and issue wrapping behaviour.

**Modify**

- `src/lib/resend/emails.ts`: build and send a safe contact email.
- `src/lib/resend/emails.test.ts`: fixed recipient, reply-to, escaping, and provider error coverage.
- `src/components/brightcert/signal-footer.tsx`: change Contact us from `mailto:` to `/contact`.
- `src/app/(app)/dashboard/page.tsx`: responsive actions, state cards, verdict metadata, history, and mobile spacing.
- `src/components/brightcert/dashboard-issues.tsx`: stacked mobile control rows and wrapping priority issue rows.
- `src/lib/seo/registry.ts`: register the new public route.
- `src/app/seo.test.ts`: prove contact metadata and sitemap inclusion.

---

### Task 1: Pure contact form validation

**Files:**

- Create: `src/lib/contact/contact-form.test.ts`
- Create: `src/lib/contact/contact-form.ts`

**Interfaces:**

- Produces: `ENQUIRY_TYPES`, `EnquiryType`, `ContactField`, `ContactSubmission`, `ContactFormValues`, `ContactFormState`, `INITIAL_CONTACT_STATE`, and `parseContactForm(formData: FormData): ContactParseResult`.
- `ContactParseResult` is `{ ok: true; spam: boolean; data: ContactSubmission } | { ok: false; state: ContactFormState }`.

- [ ] **Step 1: Write failing validation tests**

```ts
import { describe, expect, test } from "vitest";
import { parseContactForm } from "./contact-form";

function validForm(overrides: Record<string, string> = {}) {
  const form = new FormData();
  const values = {
    name: "Aisha Rahman",
    email: "aisha@example.co.uk",
    organisation: "Northstar Services Ltd",
    enquiryType: "assessment-support",
    message: "Please help us understand our latest readiness results.",
    website: "",
    ...overrides,
  };
  Object.entries(values).forEach(([key, value]) => form.set(key, value));
  return form;
}

describe("contact form validation", () => {
  test("normalises a valid submission without changing its meaning", () => {
    expect(parseContactForm(validForm({ name: "  Aisha Rahman  " }))).toEqual({
      ok: true,
      spam: false,
      data: {
        name: "Aisha Rahman",
        email: "aisha@example.co.uk",
        organisation: "Northstar Services Ltd",
        enquiryType: "assessment-support",
        message: "Please help us understand our latest readiness results.",
      },
    });
  });

  test.each([
    ["name", "", "Enter your name."],
    ["email", "not-an-email", "Enter a valid work email address."],
    ["enquiryType", "unknown", "Choose an enquiry type."],
    ["message", "Too short", "Enter at least 10 characters."],
  ])("rejects invalid %s", (field, value, message) => {
    const result = parseContactForm(validForm({ [field]: value }));
    expect(result).toMatchObject({ ok: false, state: { fieldErrors: { [field]: message } } });
  });

  test("recognises the hidden website field as spam", () => {
    expect(parseContactForm(validForm({ website: "https://spam.example" }))).toMatchObject({
      ok: true,
      spam: true,
    });
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
export PATH=/opt/homebrew/Cellar/node@20/20.20.2/bin:$PATH
npx vitest run src/lib/contact/contact-form.test.ts
```

Expected: FAIL because `src/lib/contact/contact-form.ts` does not exist.

- [ ] **Step 3: Implement the parser and public types**

```ts
export const ENQUIRY_TYPES = {
  "product-question": "Product question",
  "assessment-support": "Assessment support",
  "billing-reports": "Billing and reports",
  partnerships: "Partnerships",
  privacy: "Privacy",
  other: "Something else",
} as const;

export type EnquiryType = keyof typeof ENQUIRY_TYPES;
export type ContactField = "name" | "email" | "organisation" | "enquiryType" | "message";
export type ContactSubmission = {
  name: string;
  email: string;
  organisation: string;
  enquiryType: EnquiryType;
  message: string;
};
export type ContactFormValues = Record<ContactField, string>;
export type ContactFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: Partial<Record<ContactField, string>>;
  values: ContactFormValues;
};

export const INITIAL_CONTACT_STATE: ContactFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: { name: "", email: "", organisation: "", enquiryType: "", message: "" },
};
```

Implement `parseContactForm` with the exact bounds from the design: name 2-100, email at most 254 and matching a conservative email expression, organisation at most 120, fixed enquiry keys only, and message 10-5,000. Trim short fields and the message, preserve submitted values on validation failure, reject control characters in name and organisation, and return `spam: true` when `website` is non-empty.

- [ ] **Step 4: Expand boundary tests and verify GREEN**

Add literal boundary cases for optional organisation, 101-character name, 255-character email, 121-character organisation, and 5,001-character message. Run the focused command until all validation tests pass.

- [ ] **Step 5: Commit Task 1**

```bash
git add src/lib/contact/contact-form.ts src/lib/contact/contact-form.test.ts
git commit -m "feat: validate contact form submissions"
```

---

### Task 2: Contact email delivery and Server Action

**Files:**

- Modify: `src/lib/resend/emails.ts`
- Modify: `src/lib/resend/emails.test.ts`
- Create: `src/app/(marketing)/contact/actions.ts`
- Create: `src/app/(marketing)/contact/actions.test.ts`

**Interfaces:**

- Consumes: `ContactSubmission`, `ContactFormState`, `ENQUIRY_TYPES`, and `parseContactForm` from Task 1.
- Produces: `buildContactEmail(input: ContactSubmission)`, `sendContactEmail(input: ContactSubmission): Promise<void>`, and `submitContactForm(_previousState: ContactFormState, formData: FormData): Promise<ContactFormState>`.

- [ ] **Step 1: Write failing email payload tests**

Add tests using a literal submission and assert the returned payload has:

```ts
expect(buildContactEmail(submission)).toMatchObject({
  from: FROM_EMAIL,
  to: "hello@brightcert.co.uk",
  replyTo: "aisha@example.co.uk",
  subject: "Assessment support enquiry from Aisha Rahman",
});
expect(buildContactEmail({ ...submission, message: "<script>alert(1)</script>" }).html)
  .toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
expect(buildContactEmail({ ...submission, message: "<script>alert(1)</script>" }).html)
  .not.toContain("<script>");
```

Name the mutation caught: changing the fixed recipient, using visitor input as `from`, or interpolating raw HTML must fail.

- [ ] **Step 2: Run the email test and verify RED**

Run `npx vitest run src/lib/resend/emails.test.ts` and confirm failure because `buildContactEmail` is missing.

- [ ] **Step 3: Implement safe email building and delivery**

Add `CONTACT_EMAIL = "hello@brightcert.co.uk"`, an `escapeHtml` helper covering `& < > " '`, and:

```ts
export function buildContactEmail(input: ContactSubmission) {
  const enquiryLabel = ENQUIRY_TYPES[input.enquiryType];
  return {
    from: FROM_EMAIL,
    to: CONTACT_EMAIL,
    replyTo: input.email,
    subject: `${enquiryLabel} enquiry from ${input.name}`,
    html: baseTemplate(contactBody),
  };
}

export async function sendContactEmail(input: ContactSubmission): Promise<void> {
  const response = await getResend().emails.send(buildContactEmail(input));
  throwIfResendError(response);
}
```

Render escaped name, email, organisation, enquiry label, and newline-preserving escaped message. Do not include the honeypot.

- [ ] **Step 4: Write failing Server Action tests**

Mock only `sendContactEmail`, the external side effect below the action boundary. Test these observable outcomes:

```ts
expect(await submitContactForm(INITIAL_CONTACT_STATE, invalidForm)).toMatchObject({
  status: "error",
  fieldErrors: { email: "Enter a valid work email address." },
});
expect(await submitContactForm(INITIAL_CONTACT_STATE, honeypotForm)).toMatchObject({ status: "success" });
expect(await submitContactForm(INITIAL_CONTACT_STATE, validForm)).toMatchObject({
  status: "success",
  message: "Thanks, your message has been sent. We will reply by email as soon as possible.",
});
```

Use a rejected delivery promise and assert the returned failure is `We could not send your message. Please try again or email hello@brightcert.co.uk.` with no provider details.

- [ ] **Step 5: Verify action tests RED, implement, then verify GREEN**

Run `npx vitest run 'src/app/(marketing)/contact/actions.test.ts'`. Implement the thin Server Action with `"use server"`, `parseContactForm`, honeypot short-circuit, `sendContactEmail`, and a `try/catch`. Re-run the action and email tests until both pass.

- [ ] **Step 6: Commit Task 2**

```bash
git add src/lib/resend/emails.ts src/lib/resend/emails.test.ts 'src/app/(marketing)/contact/actions.ts' 'src/app/(marketing)/contact/actions.test.ts'
git commit -m "feat: deliver contact enquiries with Resend"
```

---

### Task 3: Contact form UI, public page, footer, and SEO

**Files:**

- Create: `src/app/(marketing)/contact/contact-form.test.tsx`
- Create: `src/app/(marketing)/contact/contact-form.tsx`
- Create: `src/app/(marketing)/contact/page.tsx`
- Modify: `src/components/brightcert/signal-footer.tsx`
- Modify: `src/lib/seo/registry.ts`
- Modify: `src/app/seo.test.ts`

**Interfaces:**

- Consumes: `submitContactForm`, `INITIAL_CONTACT_STATE`, and `ENQUIRY_TYPES`.
- Produces: `ContactForm` and public metadata at `SITE_PAGES.contact`.

- [ ] **Step 1: Write failing client form tests**

Mock the Server Action at the network boundary and render the real `ContactForm`. Assert:

```ts
expect(screen.getByRole("textbox", { name: "Name" })).toBeTruthy();
expect(screen.getByRole("textbox", { name: "Work email" })).toBeTruthy();
expect(screen.getByRole("combobox", { name: "Enquiry type" })).toBeTruthy();
expect(screen.getByRole("textbox", { name: "Message" })).toBeTruthy();
expect(screen.getByRole("button", { name: "Send message" })).toBeTruthy();
expect(screen.getByText(/used only to reply/i)).toBeTruthy();
```

Submit against a test action returning field errors and assert the relevant input has `aria-invalid="true"`, the literal field error appears, and focusable inputs retain the submitted values. Submit against a success action and assert the form fields are reset and the success message appears in a polite live region.

- [ ] **Step 2: Run form tests and verify RED**

Run `npx vitest run 'src/app/(marketing)/contact/contact-form.test.tsx'` and confirm failure because `ContactForm` is missing.

- [ ] **Step 3: Implement the client form**

Use `useActionState(submitContactForm, INITIAL_CONTACT_STATE)`, a `formRef`, and an effect keyed to the returned state object:

```tsx
const [state, formAction, pending] = useActionState(submitContactForm, INITIAL_CONTACT_STATE);
const formRef = useRef<HTMLFormElement>(null);

useEffect(() => {
  if (state.status === "success") formRef.current?.reset();
}, [state]);
```

Render label-above-input groups, `defaultValue={state.values.field}`, field-specific `aria-describedby`, the off-screen honeypot with `tabIndex={-1}` and `autoComplete="off"`, a 44px emerald button labelled `Sending...` while pending, and a polite form-level status. Use one 8px input radius and the existing focus-ring colours.

- [ ] **Step 4: Add the page, footer route, and SEO test first**

Update `src/app/seo.test.ts` before production files so it expects:

```ts
expect(urls).toContain("https://brightcert.co.uk/contact");
// Include [SITE_PAGES.contact, () => import("./(marketing)/contact/page")] in the metadata route table.
```

Run `npx vitest run src/app/seo.test.ts` and confirm RED because `SITE_PAGES.contact` and the route are missing.

- [ ] **Step 5: Implement the public route and metadata**

Add to the registry:

```ts
contact: {
  path: "/contact",
  title: "Contact BrightCert | Cyber Essentials Readiness Support",
  description: "Contact BrightCert about Cyber Essentials readiness assessments, reports, billing, privacy or partnerships.",
  indexable: true,
  lastModified: "2026-08-15",
},
```

Build `page.tsx` with `SignalNav`, a `main` using `min-h-[100dvh]`, a two-column `md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]` layout, the direct `mailto:hello@brightcert.co.uk` fallback, `ContactForm`, and `SignalFooter`. Export `metadata = metadataFor(SITE_PAGES.contact)`. Change the shared footer's Contact us link to `/contact`.

- [ ] **Step 6: Verify Task 3 GREEN and commit**

Run:

```bash
npx vitest run 'src/app/(marketing)/contact/contact-form.test.tsx' src/app/seo.test.ts
```

Then commit:

```bash
git add 'src/app/(marketing)/contact' src/components/brightcert/signal-footer.tsx src/lib/seo/registry.ts src/app/seo.test.ts
git commit -m "feat: add accessible contact page"
```

---

### Task 4: Responsive dashboard hierarchy and mobile control rows

**Files:**

- Create: `src/components/brightcert/dashboard-issues.test.tsx`
- Modify: `src/components/brightcert/dashboard-issues.tsx`
- Modify: `src/app/(app)/dashboard/page.tsx`

**Interfaces:**

- Consumes: existing `DashboardControl`, `AssessmentRow`, and `ControlScoreRow` data.
- Produces no new cross-module API. `DashboardIssues` keeps its current props.

- [ ] **Step 1: Write a failing real interaction test**

Render `DashboardIssues` with two controls containing different P1 gaps. The production mutation caught is omitting the phone selector or wiring it to the wrong section.

```tsx
render(<DashboardIssues assessmentId="assessment-1" controls={controls} />);
fireEvent.click(screen.getByRole("button", { name: /filter issues by firewalls/i }));
expect(screen.getByText("Change the default router password"));
expect(screen.queryByText("Remove unused administrator accounts")).toBeNull();
expect(screen.getByRole("table", { name: "Cyber Essentials control area scores" })).toBeTruthy();
```

- [ ] **Step 2: Run the focused dashboard test and verify RED**

Run `npx vitest run src/components/brightcert/dashboard-issues.test.tsx`. Confirm failure because the mobile filter buttons and accessible table name do not exist.

- [ ] **Step 3: Implement mobile control rows**

Keep the table under `hidden sm:table` and add `aria-label="Cyber Essentials control area scores"`. Add a `sm:hidden` list using full-width buttons for sections with gaps and non-interactive rows for sections without gaps. Each row uses `min-h-16`, puts control plus score on the first line, status plus `Filter critical issues` on the second line, and mirrors the existing active emerald state.

Change priority issue links from `items-baseline` plus `truncate` to `items-start`, `flex-col` below `sm`, and `break-words` so the complete issue remains available at 320px.

- [ ] **Step 4: Make dashboard actions and cards narrow-screen safe**

In `DashboardTopbar`, replace the action flex row with a one-column grid below `sm`, `w-full sm:w-auto`, and buttons/links with `h-11 w-full sm:h-9 sm:w-auto`. In empty, draft, and submitted cards use `p-5 sm:p-8`, stack icon/copy cleanly at phone widths, and make the primary action full width below `sm`.

In `VerdictBand`, use `px-4 sm:px-8`, scale the score from 56px to 76px, and render score change, critical count, and the help link in a wrapping `flex-col sm:flex-row sm:flex-wrap` block without separator characters. Keep target labels within the meter width.

In history rows, replace decorative dash placeholders with `Not scored`, allow metadata to wrap, and keep the action fixed at the end.

- [ ] **Step 5: Verify dashboard GREEN and commit**

Run `npx vitest run src/components/brightcert/dashboard-issues.test.tsx`, then:

```bash
git add src/components/brightcert/dashboard-issues.tsx src/components/brightcert/dashboard-issues.test.tsx 'src/app/(app)/dashboard/page.tsx'
git commit -m "fix: make dashboard responsive on phones"
```

---

### Task 5: Browser verification, quality gates, and coordination handoff

**Files:**

- Modify if needed: files owned by Tasks 1-4 only.
- Create: `docs/coordination/handoffs/2026-08-15-2225-codex-mobile-contact-ux.md`.

**Interfaces:**

- Consumes the complete feature.
- Produces final verification evidence and the repository handoff.

- [ ] **Step 1: Run focused and full automated verification**

```bash
export PATH=/opt/homebrew/Cellar/node@20/20.20.2/bin:$PATH
npx vitest run src/lib/contact/contact-form.test.ts src/lib/resend/emails.test.ts 'src/app/(marketing)/contact/actions.test.ts' 'src/app/(marketing)/contact/contact-form.test.tsx' src/components/brightcert/dashboard-issues.test.tsx src/app/seo.test.ts
npm run test:run
npx tsc --noEmit
npm run lint
npm run build
```

Every command must exit 0. Record exact counts and any warnings.

- [ ] **Step 2: Run local browser verification without sending email**

Start the development server with the repository's local environment available, open `/contact`, and inspect 320, 375, 390, 768, 1024, and 1440 widths. Use client-side validation and a blocked/mocked Server Action request so no Resend call occurs. Verify `document.documentElement.scrollWidth === document.documentElement.clientWidth`, labels, focus rings, menu, footer, and layout.

For the authenticated dashboard, use a development-only fixture route rendering the real exported dashboard presentation components with the screenshot-equivalent data. Guard it to development, verify the same overflow expression and target collisions at the required widths, capture evidence, then remove the fixture before final tests and commit. The fixture never enters the branch history.

- [ ] **Step 3: Run the frontend pre-flight audit**

Check new visitor-facing copy for zero em dash/en dash characters, one light theme, existing emerald accent, consistent 8px inputs and 16px form card, WCAG AA button/form contrast, one-line CTA labels, explicit mobile collapse, reduced-motion-safe interactions, and no decorative animation.

- [ ] **Step 4: Review diff and write the handoff**

Run `git diff origin/main...HEAD --check`, `git diff origin/main...HEAD --stat`, and inspect every changed file. Write a uniquely named handoff from `docs/coordination/HANDOFF-TEMPLATE.md` that records branch, worktree, commits, test commands/results, no live emails, no database writes, no deployment, remaining risks, and next safe action.

- [ ] **Step 5: Commit handoff and push the branch**

```bash
git add docs/coordination/handoffs/2026-08-15-2225-codex-mobile-contact-ux.md
git commit -m "docs: hand off mobile contact UX"
git push -u origin codex/mobile-contact-ux
```

Do not merge or deploy. The owner controls integration into `main`.
