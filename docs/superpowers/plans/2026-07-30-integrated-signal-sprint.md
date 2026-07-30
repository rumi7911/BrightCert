# BrightCert Integrated Signal Sprint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a controlled 30-prospect BrightCert signal sprint that coordinates unchanged manual email sequences with founder-led LinkedIn education aimed at the same trigger themes.

**Architecture:** Keep the canonical prospect, suppression, queue, and event systems unchanged. Add a non-authoritative private alignment template, a tracked operator playbook, four source-backed founder post briefs, and a relative 10-business-day overlay that links the existing outreach and social systems. Enforce the new contracts with a focused Vitest file that reads the tracked CSV and Markdown artefacts.

**Tech Stack:** Markdown, CSV, TypeScript, Vitest, existing `src/lib/outreach/csv.ts`, existing BrightCert outreach CLI and social production system.

## Global Constraints

- Execute only from a clean dedicated
  `codex/integrated-signal-sprint` worktree.
- Before implementation, integrate or explicitly supersede `codex/social-infographic-system`; do not edit its active worktree or create a second social calendar.
- Preserve dirty-main owner work. Never stage or copy its uncommitted outreach evidence.
- The cohort is exactly 24 direct SMEs and 6 MSPs, preserving the approved 120/30 ratio.
- Keep `sme-v1` and `msp-v1` copy, cadence, privacy wording, and opt-out controls unchanged.
- Email is manual. LinkedIn activity is manual, educational, non-invasive, and never an email eligibility requirement.
- Never name a prospect publicly, record private-life information, infer sensitive traits, scrape LinkedIn, automate engagement, or imply that a named account viewed a post.
- BrightCert is a readiness service, not a Certification Body. It does not certify or guarantee a pass.
- Do not describe Monitor, CE Plus Pack, or MSP Partner as purchasable.
- Do not reproduce the official Cyber Essentials questionnaire verbatim.
- Use UK English, one CTA per social item, no em dash in visible copy, no artificial urgency, and no unsupported customer or performance claim.
- The implementation must not authorise T0, send email, publish or schedule social content, deploy, write production data, or change an external service.
- Live operation still requires every launch-gate row to pass, a completed go/no-go record, no active pause or incident, and owner-set T0.
- The 30-prospect learning gate requires at least two relevant human replies and at least one booked conversation or assessment start; it does not replace existing safety rules, 25/50 checkpoints, or the 8% positive-reply decision rule.

---

## File Structure

### Create

- `docs/outreach/INTEGRATED-SIGNAL-SPRINT.md`

  Non-personal operator playbook, trigger mapping, private-file lifecycle, relative schedule, and promotion gate.
- `outreach/templates/signal-sprint-alignment.example.csv`

  Fictitious `.test`-safe schema example copied only as a header into the ignored private operator directory.
- `src/lib/outreach/signal-sprint-contract.test.ts`

  Deterministic contract tests for the alignment template, trigger mapping, public-copy guardrails, and cross-document links.
- `docs/social/sprints/2026-07-30-integrated-signal-sprint.md`

  Relative T0 publishing/contact overlay that extends the authoritative 12-week calendar.
- `docs/social/briefs/2026-07-30-ce-requirement-timing.md`

  Founder text post for tender, customer-assurance, and supply-chain triggers.
- `docs/social/briefs/2026-07-30-evidence-before-action.md`

  Founder text post for the evidence-first readiness theme.
- `docs/social/briefs/2026-07-30-readiness-before-certification.md`

  Founder text post explaining BrightCert's readiness-only role.
- `docs/social/briefs/2026-07-30-msp-one-client-workflow.md`

  Founder text post for the non-purchasable, one-client MSP pilot.

### Modify

- `docs/outreach/30-DAY-CALENDAR.md`

  Add the 30-prospect sprint gate without replacing the existing 25/50 checkpoints.
- `docs/outreach/SCORECARD.md`

  Define relevant replies and the sprint learning gate while retaining the existing 8% positive-reply rule.
- `docs/outreach/operator-runbook.md`

  Document creation and handling of the ignored alignment file and state that it is never an eligibility authority.
- `docs/social/README.md`

  Link the sprint overlay and distinguish it from the authoritative 12-week calendar.

### Do not modify

- `docs/outreach/ICP.md`
- `docs/outreach/EMAIL-SEQUENCES.md`
- `docs/outreach/LIA.md`
- `docs/outreach/LAUNCH-GATE.md`
- `.outreach/**`
- `src/lib/outreach/cli.ts`
- `src/lib/outreach/workflow.ts`
- `docs/social/12-WEEK-CALENDAR.md`

---

### Task 1: Add the sprint safety contract and operator playbook

**Files:**

- Create: `src/lib/outreach/signal-sprint-contract.test.ts`
- Create: `outreach/templates/signal-sprint-alignment.example.csv`
- Create: `docs/outreach/INTEGRATED-SIGNAL-SPRINT.md`

**Interfaces:**

- Consumes: `parseCsv(input: string): Record<string, string>[]` from `src/lib/outreach/csv.ts`; approved trigger labels from `docs/outreach/ICP.md`; existing ignored path `/.outreach/`.
- Produces: exact alignment header, allowed content themes, allowed LinkedIn planning states, deterministic trigger-to-theme map, and operator rules used by Tasks 2 and 3.

- [ ] **Step 1: Verify the clean combined execution base**

Run:

```bash
git fetch --all --prune
git status --short --branch
git branch --show-current
git merge-base --is-ancestor 47515ea HEAD
test -f docs/superpowers/specs/2026-07-30-integrated-signal-sprint-design.md
test -f docs/superpowers/plans/2026-07-30-integrated-signal-sprint.md
test -f docs/social/README.md
test -f docs/social/12-WEEK-CALENDAR.md
```

Expected:

- branch is `codex/integrated-signal-sprint`;
- status has no modified, staged, or untracked files;
- commit `47515ea`, the completed social-system handoff, is an ancestor;
- the approved design, this plan, and the integrated social system exist.

If the social commit is not an ancestor or the worktree is dirty, stop. Create
or select a clean combined task branch; do not merge or clean dirty `main`.

- [ ] **Step 2: Write the failing contract tests**

Create `src/lib/outreach/signal-sprint-contract.test.ts` with:

```ts
// @vitest-environment node

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { parseCsv } from "./csv";

const ALIGNMENT_HEADERS = [
  "cohort_id",
  "prospect_id",
  "content_theme",
  "content_item_id",
  "content_published_at",
  "linkedin_engagement_status",
  "linkedin_engagement_at",
  "first_touch_target_date",
  "operator_notes",
] as const;

const ALLOWED_THEMES = new Set([
  "requirement_urgency",
  "evidence_before_action",
  "readiness_before_certification",
]);

const ALLOWED_ENGAGEMENT_STATES = new Set([
  "not_reviewed",
  "no_natural_action",
  "useful_comment",
  "connection_existing",
  "connection_requested",
]);

const TRIGGER_MAP = new Map([
  ["tender_requirement", "requirement_urgency"],
  ["customer_assurance", "requirement_urgency"],
  ["supply_chain", "requirement_urgency"],
  ["renewal", "readiness_before_certification"],
  ["msp_client_service", "evidence_before_action"],
]);

const root = process.cwd();

describe("integrated signal sprint contract", () => {
  test("alignment example uses the exact private planning schema", async () => {
    const path = join(
      root,
      "outreach/templates/signal-sprint-alignment.example.csv"
    );
    const input = await readFile(path, "utf8");
    expect(input.split(/\r?\n/, 1)[0]?.split(",")).toEqual(ALIGNMENT_HEADERS);

    const rows = parseCsv(input);
    expect(rows).toHaveLength(5);
    expect(new Set(rows.map((row) => row.prospect_id)).size).toBe(rows.length);

    for (const row of rows) {
      expect(row.cohort_id).toBe("signal_sprint_01");
      expect(ALLOWED_THEMES.has(row.content_theme)).toBe(true);
      expect(ALLOWED_ENGAGEMENT_STATES.has(row.linkedin_engagement_status)).toBe(
        true
      );
      expect(row.prospect_id).toMatch(/^(sme|msp)-example-/);
    }
  });

  test("operator playbook preserves the approved trigger mapping", async () => {
    const text = await readFile(
      join(root, "docs/outreach/INTEGRATED-SIGNAL-SPRINT.md"),
      "utf8"
    );

    for (const [trigger, theme] of TRIGGER_MAP) {
      expect(text).toContain(`| \`${trigger}\` | \`${theme}\` |`);
    }

    expect(text).toContain("does not authorise T0");
    expect(text).toContain("24 direct SMEs");
    expect(text).toContain("6 MSPs");
    expect(text).toContain("not an eligibility authority");
    expect(text).toContain("72 hours");
    expect(text).toContain("seven days");
  });
});
```

- [ ] **Step 3: Run the focused test and verify the missing files fail**

Run:

```bash
npm run test:run -- src/lib/outreach/signal-sprint-contract.test.ts
```

Expected: FAIL with `ENOENT` for
`outreach/templates/signal-sprint-alignment.example.csv` or
`docs/outreach/INTEGRATED-SIGNAL-SPRINT.md`.

- [ ] **Step 4: Add the fictitious alignment example**

Create `outreach/templates/signal-sprint-alignment.example.csv` with exactly:

```csv
cohort_id,prospect_id,content_theme,content_item_id,content_published_at,linkedin_engagement_status,linkedin_engagement_at,first_touch_target_date,operator_notes
signal_sprint_01,sme-example-001,requirement_urgency,ce-requirement-timing,,not_reviewed,,,Fictitious tender-requirement schema example
signal_sprint_01,sme-example-002,requirement_urgency,ce-requirement-timing,,no_natural_action,,,Fictitious customer-assurance schema example
signal_sprint_01,sme-example-003,requirement_urgency,ce-requirement-timing,,connection_existing,,,Fictitious supply-chain schema example
signal_sprint_01,sme-example-004,readiness_before_certification,readiness-before-certification,,connection_requested,,,Fictitious renewal schema example
signal_sprint_01,msp-example-001,evidence_before_action,msp-one-client-workflow,,useful_comment,,,Fictitious MSP service schema example
```

Do not put a real company, person, profile URL, email address, publishing date,
or contact date in the tracked example.

- [ ] **Step 5: Write the non-personal operator playbook**

Create `docs/outreach/INTEGRATED-SIGNAL-SPRINT.md` with these exact sections:

1. `Authority and prerequisites`
   - State that the playbook does not authorise T0, sending, publishing, or a
     launch-gate status change.
   - Link `LAUNCH-GATE.md`, `SOP.md`, `ICP.md`, `EMAIL-SEQUENCES.md`,
     `operator-runbook.md`, `SCORECARD.md`, and the social sprint overlay.
2. `Cohort`
   - Exactly 24 direct SMEs and 6 MSPs.
   - Blocked rows are replaced only inside the same segment.
3. `Trigger mapping`
   - Include this exact table:

```markdown
| Approved trigger | Content theme |
|---|---|
| `tender_requirement` | `requirement_urgency` |
| `customer_assurance` | `requirement_urgency` |
| `supply_chain` | `requirement_urgency` |
| `renewal` | `readiness_before_certification` |
| `msp_client_service` | `evidence_before_action` |
```

4. `Private alignment file`
   - Record the exact CSV header.
   - Say it is ignored, private, mode `600`, business-context only, and not an
     eligibility authority.
   - State that it does not prove a prospect saw a post.
5. `Ten-business-day first-touch window`
   - Keep the relative schedule in the social overlay authoritative for
     publishing.
   - Keep the 25/50 checkpoints and existing daily caps authoritative for
     sending.
   - Follow-ups retain their original day-6/day-12 or day-7/day-14 cadence.
6. `Manual LinkedIn rules`
   - No scraping, automated engagement, generic familiarity comments, public
     prospect naming, profile-view claims, or unsolicited LinkedIn pitch.
7. `Learning gate`
   - Define a relevant reply as a human response about need, timing, the offer,
     or the proposed next step.
   - Exclude automated replies, out-of-office messages, bounces, opt-outs, and
     bare unsubscribe responses.
   - Require two relevant replies and one booked conversation or assessment
     start.
   - State that the gate supplements, but does not replace, safety controls,
     the 25/50 checkpoints, or the 8% positive-reply rule.
8. `Decision`
   - `continue`, `revise targeting`, or `pause`.
   - Never increase volume to rescue a missed gate.
9. `Measurement`
   - Keep the existing outreach event report as the funnel source of truth.
   - Review social metrics after 72 hours and seven days using the existing
     social metrics file.
   - Treat completed baselines and reconciled paid customers as primary
     outcomes.
   - State that aggregate social metrics do not prove a named account saw a
     post.
   - Join the private `cohort_id` locally by `prospect_id`; do not change the
     canonical prospect or event schemas for this sprint.

- [ ] **Step 6: Run the focused test**

Run:

```bash
npm run test:run -- src/lib/outreach/signal-sprint-contract.test.ts
```

Expected: PASS, 2 tests.

- [ ] **Step 7: Commit Task 1**

Run:

```bash
git add \
  src/lib/outreach/signal-sprint-contract.test.ts \
  outreach/templates/signal-sprint-alignment.example.csv \
  docs/outreach/INTEGRATED-SIGNAL-SPRINT.md
git diff --cached --check
git commit -m "docs: add integrated signal sprint contract"
```

Expected: one task-owned commit; no `.outreach/**` file staged.

---

### Task 2: Add source-backed founder content and the relative sprint overlay

**Files:**

- Modify: `src/lib/outreach/signal-sprint-contract.test.ts`
- Create: `docs/social/sprints/2026-07-30-integrated-signal-sprint.md`
- Create: `docs/social/briefs/2026-07-30-ce-requirement-timing.md`
- Create: `docs/social/briefs/2026-07-30-evidence-before-action.md`
- Create: `docs/social/briefs/2026-07-30-readiness-before-certification.md`
- Create: `docs/social/briefs/2026-07-30-msp-one-client-workflow.md`

**Interfaces:**

- Consumes: social brief conventions from
  `docs/social/CAROUSEL-BRIEF-TEMPLATE.md`, guardrails from
  `docs/social/QA-CHECKLIST.md`, trigger themes from Task 1, official GOV.UK
  PPN 014 and NCSC Cyber Essentials overview.
- Produces: four founder-review draft posts with stable `content_item_id`
  values and a T0-relative schedule consumed by the private alignment record.

- [ ] **Step 1: Extend the contract test for the four briefs**

Append these constants and tests to
`src/lib/outreach/signal-sprint-contract.test.ts`:

```ts
const BRIEFS = [
  "docs/social/briefs/2026-07-30-ce-requirement-timing.md",
  "docs/social/briefs/2026-07-30-evidence-before-action.md",
  "docs/social/briefs/2026-07-30-readiness-before-certification.md",
  "docs/social/briefs/2026-07-30-msp-one-client-workflow.md",
] as const;

const READINESS_DISCLAIMER =
  "BrightCert helps organisations prepare for Cyber Essentials. It does not issue certification.";

test("founder sprint briefs are review-blocked and safe for public review", async () => {
  for (const brief of BRIEFS) {
    const text = await readFile(join(root, brief), "utf8");
    expect(text).toContain("Status: Founder review");
    expect(text).toMatch(/Fact-check date: 20\d{2}-\d{2}-\d{2}/);
    expect(text).toContain(READINESS_DISCLAIMER);
    expect(text.match(/👉/g)).toHaveLength(1);
    expect(text).not.toContain("—");
    expect(text).not.toMatch(/\{\{(?:company_name|first_name|verified_trigger)/);
    expect(text).not.toMatch(/\b(?:guaranteed?|certif(?:y|ies|ied) you)\b/i);
  }
});

test("social overlay uses the four stable content item IDs", async () => {
  const text = await readFile(
    join(root, "docs/social/sprints/2026-07-30-integrated-signal-sprint.md"),
    "utf8"
  );

  for (const id of [
    "ce-requirement-timing",
    "evidence-before-action",
    "readiness-before-certification",
    "msp-one-client-workflow",
  ]) {
    expect(text).toContain(`\`${id}\``);
  }

  expect(text).toContain("relative to owner-set T0");
  expect(text).toContain("does not authorise publication");
});
```

- [ ] **Step 2: Run the focused test and verify the social files fail**

Run:

```bash
npm run test:run -- src/lib/outreach/signal-sprint-contract.test.ts
```

Expected: FAIL with `ENOENT` for the first missing social brief.

- [ ] **Step 3: Recheck every source used by the four drafts**

Record the execution date:

```bash
source_checked_on=$(date '+%Y-%m-%d')
printf '%s\n' "$source_checked_on"
```

Open and inspect:

- `https://www.gov.uk/government/publications/ppn-014-cyber-essentials-scheme/ppn-014-cyber-essentials-scheme-html`
- `https://www.ncsc.gov.uk/cyberessentials/overview`
- `https://brightcert.co.uk/how-it-works`

Confirm all of the following before writing:

- PPN 014 applies Cyber Essentials proportionately to relevant contracts and
  explicitly warns against a blanket requirement;
- the relevant examples include personal information, government information,
  and certain ICT systems or services;
- the NCSC page describes five technical controls, free preparation resources,
  and separate self-led or Certification Body certification routes;
- BrightCert's live page still describes a free readiness assessment and does
  not claim to issue certification; and
- none of the planned posts contradicts the current source wording.

Write the literal value printed by the command after `Fact-check date:` in each
brief. The blocks below show `2026-07-30`; if execution occurs on another date,
replace that value with the printed execution date. If any source has
materially changed, stop Task 2 and obtain owner review of corrected copy; do
not weaken or silently reinterpret the claim.

- [ ] **Step 4: Create the requirement-timing founder brief**

Create `docs/social/briefs/2026-07-30-ce-requirement-timing.md`.

Control fields:

```markdown
- Content item ID: `ce-requirement-timing`
- Theme: `requirement_urgency`
- Audience: UK SME owners and operations leaders facing tender, customer-assurance, or supply-chain requirements
- CTA: Start the free readiness assessment
- Status: Founder review
- Fact-check date: 2026-07-30
- Publication: Blocked until source recheck, founder approval, and owner-set schedule
```

Primary sources:

- `https://www.gov.uk/government/publications/ppn-014-cyber-essentials-scheme/ppn-014-cyber-essentials-scheme-html`
- `https://www.ncsc.gov.uk/cyberessentials/overview`

Use this exact founder post draft:

```text
Cyber Essentials is not required for every government contract.

For some contracts, though, it becomes part of the commercial requirement.

The current procurement note points to contracts involving personal information, government information or relevant ICT services.

For an SME, the costly mistake is finding this out after the bid is live.

Start with three questions:

• Is certification required, or are equivalent controls allowed?
• When must the evidence be available?
• What gaps need fixing before you apply?

BrightCert helps organisations prepare for Cyber Essentials. It does not issue certification.

👉 Start the free readiness assessment in the first comment.

#CyberEssentials #UKSME #PublicProcurement #SupplyChain
```

Use this exact first-comment URL:

```text
https://brightcert.co.uk/signup?utm_source=linkedin&utm_medium=organic-social&utm_campaign=founding_pilot_2026&utm_content=ce-requirement-timing&utm_term=tender_requirement
```

- [ ] **Step 5: Create the evidence-before-action founder brief**

Create `docs/social/briefs/2026-07-30-evidence-before-action.md`.

Control fields:

```markdown
- Content item ID: `evidence-before-action`
- Theme: `evidence_before_action`
- Audience: UK SME owners, operations leaders, and IT providers preparing for Cyber Essentials
- CTA: Start the free readiness assessment
- Status: Founder review
- Fact-check date: 2026-07-30
- Publication: Blocked until source recheck, founder approval, and owner-set schedule
```

Primary sources:

- `https://www.ncsc.gov.uk/cyberessentials/overview`
- `https://brightcert.co.uk/how-it-works`

Use this exact founder post draft:

```text
Cyber Essentials preparation gets easier when you split the work in two.

Evidence already in place.

Actions that still need an owner.

The evidence side might include device records, access settings, update policies and security configurations.

The action side might include unsupported software, excessive administrator access or controls that are not applied consistently.

Do not begin with another spreadsheet full of unassigned tasks.

Begin with:

• What can we already prove?
• What is missing?
• Who owns the next action?

BrightCert helps organisations prepare for Cyber Essentials. It does not issue certification.

👉 Start the free readiness assessment in the first comment.

#CyberEssentials #UKSME #CyberSecurity #Operations
```

Use this exact first-comment URL:

```text
https://brightcert.co.uk/signup?utm_source=linkedin&utm_medium=organic-social&utm_campaign=founding_pilot_2026&utm_content=evidence-before-action
```

- [ ] **Step 6: Create the readiness-before-certification founder brief**

Create `docs/social/briefs/2026-07-30-readiness-before-certification.md`.

Control fields:

```markdown
- Content item ID: `readiness-before-certification`
- Theme: `readiness_before_certification`
- Audience: UK SME owners and operations leaders considering Cyber Essentials
- CTA: Start the free readiness assessment
- Status: Founder review
- Fact-check date: 2026-07-30
- Publication: Blocked until source recheck, founder approval, and owner-set schedule
```

Primary sources:

- `https://www.ncsc.gov.uk/cyberessentials/overview`
- `https://brightcert.co.uk/how-it-works`

Use this exact founder post draft:

```text
Preparation and certification are different jobs.

Preparation is where you work out:

• What is already in place
• Where the likely gaps are
• What to fix first
• Who needs to own each action

Certification is the separate official process handled through IASME and licensed Certification Bodies.

BrightCert sits before that step.

The free readiness baseline helps turn uncertainty into a prioritised action plan before you apply.

It does not guarantee a pass.

BrightCert helps organisations prepare for Cyber Essentials. It does not issue certification.

👉 Start the free readiness assessment in the first comment.

#CyberEssentials #UKSME #Compliance #CyberSecurity
```

Use this exact first-comment URL:

```text
https://brightcert.co.uk/signup?utm_source=linkedin&utm_medium=organic-social&utm_campaign=founding_pilot_2026&utm_content=readiness-before-certification&utm_term=renewal
```

- [ ] **Step 7: Create the MSP one-client founder brief**

Create `docs/social/briefs/2026-07-30-msp-one-client-workflow.md`.

Control fields:

```markdown
- Content item ID: `msp-one-client-workflow`
- Theme: `evidence_before_action`
- Audience: UK MSP founders, service-delivery leaders, and technical directors supporting SMEs
- CTA: Read how the readiness workflow works
- Status: Founder review
- Fact-check date: 2026-07-30
- Publication: Blocked until source recheck, founder approval, and owner-set schedule
```

Primary sources:

- `https://www.ncsc.gov.uk/cyberessentials/overview`
- `https://brightcert.co.uk/how-it-works`

Use this exact founder post draft:

```text
Cyber Essentials preparation becomes difficult to scale when every client starts from a different spreadsheet.

For one suitable SME client, test a repeatable workflow:

• Capture answers and evidence once
• Review likely gaps against the five control areas
• Give every action an owner
• Keep the official certification step separate

That is the question behind BrightCert's partner-assisted pilot.

Not a new subscription.

Not a promise that the client will pass.

A one-client test of whether the evidence and action workflow is useful in practice.

BrightCert helps organisations prepare for Cyber Essentials. It does not issue certification.

👉 Read how the readiness workflow works in the first comment.

#CyberEssentials #MSP #UKSME #CyberSecurity
```

Use this exact first-comment URL:

```text
https://brightcert.co.uk/how-it-works?utm_source=linkedin&utm_medium=organic-social&utm_campaign=founding_pilot_2026&utm_content=msp-one-client-workflow&utm_term=msp_client_service
```

- [ ] **Step 8: Create the T0-relative social sprint overlay**

Create `docs/social/sprints/2026-07-30-integrated-signal-sprint.md` with:

- an authority statement that it extends, but does not replace,
  `docs/social/12-WEEK-CALENDAR.md`;
- an explicit statement that it is relative to owner-set T0 and does not
  authorise publication, outreach, or a launch-gate decision;
- the following schedule:

```markdown
| Relative business day | Founder/social item | Outreach relationship |
|---|---|---|
| T-2 | `ce-requirement-timing` | Public education before the first tender, assurance, and supply-chain Touch 1 rows |
| T0 | No new post required | Process one real prospect end to end, then pause for the existing owner checkpoint |
| T+1 | Founder-approved Week 1 carousel from the authoritative calendar | Broad trust asset; no claim that a prospect viewed it |
| T+2 | `evidence-before-action` | Supports SME and MSP evidence-first conversations |
| T+4 | Founder-approved derivative from the Week 1 carousel | Reminder only; one CTA |
| T+5 | `readiness-before-certification` | Supports renewal and readiness timing |
| T+6 | Founder-approved Week 2 carousel from the authoritative calendar | Broad trust asset; source and founder review still required |
| T+8 | `msp-one-client-workflow` | Supports the six MSP Touch 1 rows without advertising a purchasable MSP plan |
| T+9 | Founder-approved derivative from the Week 2 carousel | Final first-touch-window reminder; no volume compensation |
```

Also state:

- manual engagement may occur only where the founder has a substantive public
  contribution;
- the private alignment file records planning, not exposure;
- due email follow-ups consume the existing daily cap before new Touch 1 rows;
- a delayed or blocked post never causes extra email volume; and
- every post remains `Founder review` until the owner approves its source,
  copy, and publication timing.

- [ ] **Step 9: Run the focused test**

Run:

```bash
npm run test:run -- src/lib/outreach/signal-sprint-contract.test.ts
```

Expected: PASS, 4 tests.

- [ ] **Step 10: Commit Task 2**

Run:

```bash
git add \
  src/lib/outreach/signal-sprint-contract.test.ts \
  docs/social/sprints/2026-07-30-integrated-signal-sprint.md \
  docs/social/briefs/2026-07-30-ce-requirement-timing.md \
  docs/social/briefs/2026-07-30-evidence-before-action.md \
  docs/social/briefs/2026-07-30-readiness-before-certification.md \
  docs/social/briefs/2026-07-30-msp-one-client-workflow.md
git diff --cached --check
git commit -m "docs: draft founder signal sprint content"
```

Expected: four review-blocked briefs and one relative overlay committed; no
post published or scheduled.

---

### Task 3: Integrate the sprint with canonical calendars, reporting, and operator instructions

**Files:**

- Modify: `src/lib/outreach/signal-sprint-contract.test.ts`
- Modify: `docs/outreach/30-DAY-CALENDAR.md`
- Modify: `docs/outreach/SCORECARD.md`
- Modify: `docs/outreach/operator-runbook.md`
- Modify: `docs/social/README.md`

**Interfaces:**

- Consumes: Task 1 playbook/template and Task 2 social overlay/briefs.
- Produces: canonical cross-links, the 30-prospect checkpoint, and safe private-file creation instructions without changing the prospect or event schemas.

- [ ] **Step 1: Add failing cross-document contract tests**

Append this test to
`src/lib/outreach/signal-sprint-contract.test.ts`:

```ts
test("canonical operator and social docs link the sprint without replacing their controls", async () => {
  const files = new Map(
    await Promise.all(
      [
        "docs/outreach/30-DAY-CALENDAR.md",
        "docs/outreach/SCORECARD.md",
        "docs/outreach/operator-runbook.md",
        "docs/social/README.md",
      ].map(async (file) => [
        file,
        await readFile(join(root, file), "utf8"),
      ] as const)
    )
  );

  expect(files.get("docs/outreach/30-DAY-CALENDAR.md")).toContain(
    "30-prospect integrated signal sprint gate"
  );
  expect(files.get("docs/outreach/SCORECARD.md")).toContain(
    "two relevant human replies"
  );
  expect(files.get("docs/outreach/SCORECARD.md")).toContain(
    "does not replace the 8% positive-reply rule"
  );
  expect(files.get("docs/outreach/operator-runbook.md")).toContain(
    ".outreach/signal-sprint-alignment.csv"
  );
  expect(files.get("docs/outreach/operator-runbook.md")).toContain(
    "never an eligibility authority"
  );
  expect(files.get("docs/social/README.md")).toContain(
    "sprints/2026-07-30-integrated-signal-sprint.md"
  );
});
```

- [ ] **Step 2: Run the focused test and verify it fails on missing links**

Run:

```bash
npm run test:run -- src/lib/outreach/signal-sprint-contract.test.ts
```

Expected: FAIL because `30-DAY-CALENDAR.md` does not yet contain
`30-prospect integrated signal sprint gate`.

- [ ] **Step 3: Add the supplemental 30-prospect checkpoint to the calendar**

In `docs/outreach/30-DAY-CALENDAR.md`, after the existing Week 1 25-send review
and before Week 2, add:

```markdown
### 30-prospect integrated signal sprint gate

When the approved integrated sprint is active, continue from the unchanged
25-send checkpoint to exactly 30 Touch 1 prospects, weighted 24 SME / 6 MSP.
Apply the additional learning gate in
[INTEGRATED-SIGNAL-SPRINT.md](./INTEGRATED-SIGNAL-SPRINT.md) before releasing
prospect 31.

This does not replace the 25- or 50-prospect checkpoints, the 8% positive-reply
decision rule, the daily aggregate message caps, or any safety pause. Social
activity never makes a row eligible and a delayed post never creates extra
send capacity.
```

- [ ] **Step 4: Add the sprint learning gate to the scorecard**

In `docs/outreach/SCORECARD.md`, after `## Decision rules`, add:

```markdown
### Integrated signal sprint learning gate

At exactly 30 Touch 1 prospects, weighted 24 SME / 6 MSP, require:

- two relevant human replies; and
- at least one booked conversation or assessment start.

A relevant reply is a human response about the Cyber Essentials need, its
timing, the BrightCert offer, or the proposed next step. Automated replies,
out-of-office notices, bounces, opt-outs, and bare unsubscribe responses do not
count. A substantive objection may count as relevant message-learning evidence
but is not a positive reply and still stops the sequence.

This gate does not replace the 8% positive-reply rule, existing sample-size
caution, the 25/50 checkpoints, or any safety or launch control. Missing the
gate pauses the next cohort for trigger and account-selection review; it never
justifies more volume.
```

- [ ] **Step 5: Document safe creation of the private alignment file**

In `docs/outreach/operator-runbook.md`, immediately after the private run-data
introduction, add:

````markdown
### Integrated signal sprint alignment

The optional sprint alignment file is private planning data and is never an
eligibility authority. Create a header-only private file from the tracked
fictitious template:

```sh
mkdir -p .outreach
umask 077
head -n 1 outreach/templates/signal-sprint-alignment.example.csv \
  > .outreach/signal-sprint-alignment.csv
chmod 600 .outreach/signal-sprint-alignment.csv
```

Populate it only after the canonical prospect row exists. Do not copy the
fictitious example rows, private posts, profile-view claims, sensitive traits,
or inferred exposure. The canonical prospect file, suppression store, event
history, queue checks, and current Companies House result remain authoritative.
````

- [ ] **Step 6: Link the sprint overlay from the social system**

In `docs/social/README.md`, after `## Weekly production`, add:

```markdown
## Integrated signal sprint overlay

The relative publishing/contact overlay is
[2026-07-30-integrated-signal-sprint.md](./sprints/2026-07-30-integrated-signal-sprint.md).
It coordinates founder education with private trigger themes but does not
replace the [12-week calendar](./12-WEEK-CALENDAR.md), claim review, founder
approval, platform QA, or manual publishing controls.

The overlay never names prospects, proves post exposure, automates engagement,
or authorises outreach. If its timing conflicts with a source check or a due
email follow-up, the existing source and outreach controls win.
```

- [ ] **Step 7: Run the focused test**

Run:

```bash
npm run test:run -- src/lib/outreach/signal-sprint-contract.test.ts
```

Expected: PASS, 5 tests.

- [ ] **Step 8: Commit Task 3**

Run:

```bash
git add \
  src/lib/outreach/signal-sprint-contract.test.ts \
  docs/outreach/30-DAY-CALENDAR.md \
  docs/outreach/SCORECARD.md \
  docs/outreach/operator-runbook.md \
  docs/social/README.md
git diff --cached --check
git commit -m "docs: integrate signal sprint controls"
```

Expected: canonical cross-links and supplemental checkpoint committed; no
approved email copy, launch-gate status, or event schema changed.

---

### Task 4: Verify the complete package and hand it off

**Files:**

- Create: the exact handoff path printed in Task 4 Step 6
- Inspect only: every file changed in Tasks 1–3

**Interfaces:**

- Consumes: all previous task commits.
- Produces: reproducible verification evidence, a pushed task branch, and a safe owner-review boundary.

- [ ] **Step 1: Run the focused contract test**

Run:

```bash
npm run test:run -- src/lib/outreach/signal-sprint-contract.test.ts
```

Expected: PASS, 5 tests.

- [ ] **Step 2: Run policy and privacy scans**

Run:

```bash
rg -n 'TBD|TODO|FIXME|\{\{company_name\}\}|\{\{first_name\}\}' \
  docs/outreach/INTEGRATED-SIGNAL-SPRINT.md \
  docs/social/sprints/2026-07-30-integrated-signal-sprint.md \
  docs/social/briefs/2026-07-30-*.md

rg -n 'guarantee(?:d)? pass|we certify|BrightCert certifies|limited places|act fast|ending soon|—' \
  docs/outreach/INTEGRATED-SIGNAL-SPRINT.md \
  docs/social/sprints/2026-07-30-integrated-signal-sprint.md \
  docs/social/briefs/2026-07-30-*.md
```

Expected: no matches. The deliberate phrases `does not guarantee a pass` and
`does not issue certification` are safe, so use the exact prohibited patterns
above rather than broad searches for `guarantee` or `certification`.

- [ ] **Step 3: Verify private data was not tracked**

Run:

```bash
git status --short
git ls-files '.outreach/**'
git diff --name-only HEAD~3...HEAD
```

Expected:

- no `.outreach/**` file listed;
- the three implementation commits change only the Task 1–3 paths;
- no dirty-main or production evidence path included.

- [ ] **Step 4: Run the full repository verification**

Run:

```bash
npm run test:run
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

Expected:

- all tests pass;
- lint exits 0;
- TypeScript exits 0;
- production build completes and generates all expected routes;
- no whitespace errors.

If the build needs existing repository environment variables, load them only
from the protected local environment without printing them. Do not create,
commit, or copy an environment file.

- [ ] **Step 5: Review the final diff**

Run:

```bash
git log --oneline --decorate -n 8
git diff --stat HEAD~3...HEAD
git diff --check HEAD~3...HEAD
```

Confirm:

- four founder briefs remain `Status: Founder review`;
- no publishing date is invented;
- no social item claims a prospect saw it;
- the sprint gate supplements rather than replaces existing controls;
- `docs/social/12-WEEK-CALENDAR.md` and approved email copy are unchanged; and
- no email, LinkedIn post, deployment, database write, or external mutation
  occurred.

- [ ] **Step 6: Write the coordination handoff**

Compute and print the exact handoff path:

```bash
handoff_stamp=$(date '+%Y-%m-%d-%H%M')
handoff_path="docs/coordination/handoffs/${handoff_stamp}-codex-integrated-signal-sprint.md"
printf '%s\n' "$handoff_path"
test ! -e "$handoff_path"
```

Create the printed path with `apply_patch` and the repository template. Record:

- branch, worktree, base commit, and exact task commit SHAs;
- every file changed;
- focused and full verification commands with exact results;
- source URLs and retrieval dates used for the post briefs;
- explicit external state: no sends, posts, scheduling, deployment, database
  writes, or payments;
- remaining blockers: owner review of all four briefs, launch-gate go/no-go,
  owner-set T0, and integration order; and
- next safe action: owner reviews copy and assets before any publishing or
  prospect contact.

- [ ] **Step 7: Commit and push the handoff**

Run:

```bash
handoff_path=$(git ls-files --others --exclude-standard \
  'docs/coordination/handoffs/*-codex-integrated-signal-sprint.md')
test -n "$handoff_path"
test "$(printf '%s\n' "$handoff_path" | wc -l | tr -d ' ')" -eq 1
git add "$handoff_path"
git diff --cached --check
git commit -m "docs: hand off integrated signal sprint"
git push -u origin codex/integrated-signal-sprint
git status --short --branch
```

Expected: clean worktree, branch pushed, no merge, PR, deployment, send, or
social publication.
