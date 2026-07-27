# BrightCert Decision + Delivery report redesign

**Date:** 27 July 2026
**Status:** Approved design, awaiting written-spec review
**Product:** BrightCert Cyber Essentials readiness report
**Audience:** UK SME owners/directors and their internal or external IT providers

## 1. Purpose

The paid PDF is BrightCert's principal customer deliverable and its strongest
brand expression. It must do more than restate assessment data. It must help a
business leader understand the position, make a priority decision and assign
accountability, while giving an IT provider enough detail to execute the work
without another interpretation exercise.

The redesign will replace the current formatted-assessment structure with a
strategy-consulting editorial report:

- a five-page executive decision report;
- an implementation-ready delivery and evidence appendix;
- tailored insight headlines rather than generic topic headings;
- charts that answer a decision question and are derived from validated data;
- a consistent BrightCert visual identity;
- explicit limitations that distinguish readiness from official certification.

The visual direction is **Decision + Delivery**. The header uses BrightCert's
existing transparent mark on a compact white contrast tile, paired with a
Bricolage Grotesque wordmark in white and emerald on a navy background.

This direction is inspired by premium strategy-consulting information design,
but it will not copy another firm's templates, marks, layouts or trade dress.

## 2. Success criteria

A successful report lets:

1. a director understand the headline, main decision, blockers, quick wins and
   90-day path in under five minutes;
2. an IT lead or MSP identify each action, recommended owner, timeframe and
   evidence requirement;
3. a reader trace every chart and conclusion to validated assessment data;
4. BrightCert present a distinctive, credible and consistent paid deliverable;
5. legacy analyses remain renderable without corrupting or inventing data;
6. maximum accepted content render without clipping, collisions or silent
   substantive truncation.

## 3. Non-goals

This redesign will not:

- claim that BrightCert is a Certification Body;
- guarantee certification readiness or a pass;
- add industry benchmarks that BrightCert does not possess;
- predict score uplift from completing an action;
- infer a technical audit, vulnerability scan or evidence verification;
- add decorative charts that do not support a decision;
- redesign the website, dashboard or assessment questionnaire;
- create a user-editable project-management or evidence-workspace interface;
- change the existing payment, refund or report-access policy.

## 4. Report architecture

The report is a dynamic A4 document. A typical report will be 12-16 pages,
depending on accepted content length. Page count is not padded to a fixed
number.

### Part I: executive decision report

#### Page 1 — Cover and action headline

- Full BrightCert brand lock-up on navy.
- Organisation name, date, confidentiality label and report version.
- Tailored conclusion headline, not a generic "Readiness Report" title.
- Overall score and status.
- Counts for P1 blockers and low-effort quick wins.
- Short readiness/certification distinction.

**Decision supported:** What is the current position, in one glance?

#### Page 2 — Executive readout

- Insight-led headline.
- Existing executive summary.
- Primary decision required.
- Three high-value metrics derived by server code.
- Key strengths and principal management implication.

**Decision supported:** What should leadership decide or sponsor now?

#### Page 3 — Readiness profile

- Direct-labelled horizontal score chart for the five control areas.
- Fixed 80-point readiness threshold labelled as BrightCert's internal score
  threshold, not an external benchmark.
- Strongest and weakest control callouts.
- No legend when labels can sit directly beside data.

**Decision supported:** Where is readiness strongest and weakest?

#### Page 4 — Action portfolio

- Two-dimensional priority-by-effort matrix.
- Every dot represents a validated remediation action.
- Quadrants describe quick wins, major blockers, scheduled improvements and
  actions needing careful planning.
- Direct action labels or numbered references must remain legible.

**Decision supported:** Where should limited time and attention go first?

#### Page 5 — 90-day delivery path

- Now: 0-30 days.
- Next: 31-60 days.
- Then: 61-90 days.
- Ongoing actions shown separately.
- Owner and evidence summaries for each phase.

**Decision supported:** What sequence reduces application risk fastest?

### Part II: delivery and evidence appendix

#### Pages 6-10 — Five control-area deep dives

Each control receives one primary page and may continue only when bounded
content requires it. Each starts with:

- a tailored control-level insight headline;
- score and status;
- management implication;
- validated gap findings and priorities;
- recommended actions;
- recommended owner, timeframe, effort and evidence required.

The layout keeps each finding and each action header with its first supporting
line. Continuations carry a clear control-area continuation label.

#### Following pages — Prioritised action register

A working table ordered by:

1. P1 before P2 before P3;
2. earlier timeframe before later timeframe;
3. lower effort before higher effort within the same priority/timeframe.

Columns:

- action;
- control area;
- priority;
- recommended owner;
- timeframe;
- effort;
- evidence required.

Long rows must remain readable and may continue as labelled blocks rather than
being compressed into illegible table cells.

#### Evidence checklist

Evidence items are grouped by timeframe and control area. The page states that
the list is BrightCert preparation guidance, not an official Certification Body
evidence request.

#### Method, limitations and next steps

- Self-reported assessment basis.
- Scoring/status method.
- No technical audit or certification decision.
- Report generation date and analysis version.
- Official certification route through an IASME-licensed Certification Body.
- Full readiness-assessment disclaimer.

## 5. Enhanced analysis contract

The analysis output becomes a versioned `analysisVersion: 2` contract.

### 5.1 Report-level fields

| Field | Requirement |
|---|---|
| `analysisVersion` | Literal `2` |
| `reportHeadline` | Tailored conclusion, 1-180 characters |
| `executiveSummary` | Existing plain-English summary, 1-900 characters |
| `primaryDecision` | Specific leadership decision/action, 1-320 characters |
| `keyStrengths` | Zero to three strings, each 1-240 characters |
| `overallScore` | Validated number from 0 to 100 |
| `overallStatus` | Existing bounded status enum |

The headline and primary decision must be supported by the control scores,
gaps and actions. They cannot introduce facts not present in the questionnaire
or validated output.

### 5.2 Control-level fields

Each of the five controls retains its current score, status, summary, gaps and
remediation, and adds:

| Field | Requirement |
|---|---|
| `headline` | Control-level conclusion, 1-180 characters |
| `managementImplication` | Business consequence and decision relevance, 1-480 characters |

Exactly one of each official Cyber Essentials control-area identifier remains
required.

### 5.3 Action-level fields

Each remediation action retains `title`, `steps` and `effort`, and adds:

| Field | Requirement |
|---|---|
| `priority` | `P1`, `P2` or `P3` |
| `recommendedOwner` | One bounded owner-role enum |
| `timeframe` | One bounded timeframe enum |
| `evidenceRequired` | One to four specific evidence strings, each 1-220 characters |

Owner-role values:

- `business_owner_director`
- `internal_it_lead`
- `msp_it_provider`
- `operations_compliance`
- `hr_people`
- `shared_business_it`

Display labels explicitly say **recommended owner**. BrightCert does not claim
that the person or supplier has accepted accountability.

Timeframe values:

- `days_0_30`
- `days_31_60`
- `days_61_90`
- `ongoing`

The priority on an action is required because the current gap and remediation
arrays have no reliable one-to-one relationship. Charts and register ordering
must use the action priority, not positional inference.

### 5.4 Deterministic derived metrics

Server code, not Gemini, calculates:

- P1 blocker count;
- low-effort quick-win count (Low effort plus P1 or P2);
- action counts by priority, effort, timeframe, owner and control;
- strongest and weakest control from scores;
- readiness-threshold deltas;
- chart positions and table ordering.

No derived metric can claim market comparison, likelihood of passing or
predicted post-remediation score.

## 6. Persistence and compatibility

### 6.1 Database changes

Use a non-destructive migration:

- add `analysis_version smallint not null default 1` to `assessments`;
- add `report_insights jsonb` to `assessments` for `reportHeadline`,
  `primaryDecision` and `keyStrengths`;
- add `headline` and `management_implication` to `control_scores`;
- retain the existing JSON remediation column and store validated v2 action
  metadata within each remediation item.

The application parser enforces the report-insight bounds before writing and
after reading the `jsonb` value.

### 6.2 Atomic analysis persistence

The complete Gemini response is parsed and validated before any database write.
The assessment update and five control-score rows are then saved through one
transactional database function. A failure leaves neither partial scores nor a
partially upgraded assessment.

### 6.3 Legacy v1 adapter

An assessment without `analysis_version = 2` uses a conservative adapter:

- existing scores, statuses, summaries, gaps and remediation remain unchanged;
- generic report-level headlines are derived from status and validated counts;
- legacy action priority is labelled `Priority to confirm`; it is never inferred
  from array position or from an unrelated gap;
- owner is displayed as `Business owner and IT provider to confirm`;
- timeframe is labelled `To confirm`;
- missing evidence is displayed as `Evidence to confirm during action review`.

The adapter never fabricates organisation-specific evidence or accountability.
A legacy report without validated action priorities replaces the action
portfolio matrix with a clearly labelled action-review notice; unvalidated
legacy actions are not plotted as if their priority were known.
A record explicitly marked v2 must contain the complete v2 structure and fails
closed if it does not.

## 7. Visual system

### 7.1 Typography

- **Bricolage Grotesque:** report headlines, page conclusions, major numbers and
  BrightCert wordmark.
- **Inter:** body copy, findings, actions, tables and footnotes.
- **JetBrains Mono:** small metadata, section labels, chart annotations and
  report versioning.

Licensed WOFF font assets are bundled with the application for server-side PDF
generation. Report rendering must not depend on a runtime font CDN.

### 7.2 Colour

| Role | Value |
|---|---|
| Primary navy | `#0F2044` |
| Dark navy | `#08152E` |
| Action emerald | `#047857` |
| Light emerald | `#6EE7B7` |
| Paper | `#F4F6F3` / white |
| Body slate | `#475569` |

Red and amber are semantic risk colours only. They are not decorative accents.
Charts must remain distinguishable through labels and shape/position, rather
than colour alone.

### 7.3 Brand lock-up

On navy headers:

- place the existing transparent logo mark inside a small white rounded tile;
- typeset `BrightCert` in Bricolage Grotesque;
- render `Bright` in white and `Cert` in light emerald;
- keep document metadata right-aligned and visually subordinate.

### 7.4 Editorial rules

- One conclusion per page.
- Page titles state the insight, not merely the subject.
- Use a consistent grid and generous whitespace.
- Prefer lines, spacing and alignment over nested rounded cards.
- Use flat, two-dimensional charts with direct labels.
- No chart gradients, 3D effects, ornamental doughnuts or unnecessary legends.
- Footers include confidentiality, organisation, page count and report version
  without collisions at the maximum organisation-name boundary.

## 8. Component architecture

The current single report component will be decomposed into:

```text
src/lib/pdf/report/
  brand-tokens.ts
  report-types.ts
  report-view-model.ts
  ReportDocument.tsx
  components/
    BrandHeader.tsx
    ReportFooter.tsx
    InsightHeadline.tsx
    MetricStrip.tsx
    ReadinessProfileChart.tsx
    ActionPortfolioMatrix.tsx
    RoadmapTimeline.tsx
    FindingBlock.tsx
    ActionBlock.tsx
  pages/
    CoverPage.tsx
    ExecutiveReadoutPage.tsx
    ReadinessProfilePage.tsx
    ActionPortfolioPage.tsx
    RoadmapPage.tsx
    ControlDeepDivePages.tsx
    ActionRegisterPages.tsx
    EvidenceChecklistPage.tsx
    MethodologyPage.tsx
```

Responsibilities:

- parser modules validate external and persisted data;
- the compatibility adapter produces one canonical report input;
- `report-view-model.ts` performs deterministic sorting and chart derivation;
- chart components only render supplied view-model data;
- page components own pagination and editorial hierarchy;
- `ReportDocument.tsx` composes pages and document metadata.

The public report route continues to import the document dynamically on the
server.

## 9. Error handling and data integrity

- Reject invalid v2 Gemini output before persistence.
- Save analysis atomically.
- Validate persisted analysis again before rendering.
- Return HTTP 422 for invalid persisted report data.
- Do not silently truncate substantive findings, actions or evidence.
- Do not insert a `reports` row unless rendering and upload complete.
- Preserve existing paid/unpaid/refunded access checks.
- Preserve idempotent existing-report behaviour.
- Log validation paths and internal errors without recording assessment answers
  or secrets in user-facing responses.
- Render explicit empty states for a valid control with no gaps or actions.

## 10. Testing and acceptance

### 10.1 Analysis and parser tests

- Valid v2 response.
- Missing or malformed new fields.
- Owner/timeframe/priority enum rejection.
- Evidence array count and text boundaries.
- Exactly five distinct controls.
- Server-derived status consistency.
- Atomic persistence success and rollback behaviour.
- Legacy v1 compatibility.
- Explicitly marked malformed v2 fail-closed behaviour.

### 10.2 View-model tests

- Blocker and quick-win counts.
- Strongest/weakest control selection, including ties.
- Priority/effort matrix coordinates.
- Timeline grouping.
- Action-register ordering.
- Evidence de-duplication without losing distinct artefacts.
- No benchmark or predicted-uplift fields.

### 10.3 PDF structural tests

- Every expected page/section marker is extractable.
- Report and control insight headlines appear.
- Chart labels and values survive extraction.
- Disclaimer heading/body stay together.
- Finding and action blocks do not fragment incorrectly.
- Footer content never overlaps page numbers.
- Legacy and v2 reports both render.
- Maximum accepted content produces no unbreakable-overflow warning.

### 10.4 Visual acceptance

Generate at least:

1. a realistic mixed-status v2 report;
2. an all-pass report with few/no gaps;
3. a high-risk report with maximum accepted findings/actions;
4. a legacy v1 report.

Render every page to PNG and inspect at full resolution for:

- clipping and overlap;
- hierarchy and legibility;
- chart labels and threshold clarity;
- continuation-page context;
- action-register readability;
- logo and font fidelity;
- disclaimer and footer integrity.

### 10.5 Full application acceptance

- full test suite;
- lint;
- TypeScript;
- production build;
- exact live/origin/deployment commit parity;
- one deployed Stripe-sandbox paid report generation and download;
- locked unpaid/refunded access after the redesign;
- disposable sandbox-data cleanup;
- updated launch-gate evidence.

## 11. Rollout

1. Implement and validate the v2 schema and atomic persistence.
2. Implement the compatibility adapter and canonical report view model.
3. Build reusable brand and chart components.
4. Build executive pages.
5. Build delivery/evidence pages.
6. Run automated boundary and compatibility tests.
7. Render and visually inspect every acceptance fixture.
8. Deploy the exact reviewed commit.
9. Run the sandbox report lifecycle.
10. Update the PDF/report launch gate only after production evidence passes.

The current local PDF fixes for disclaimer integrity, footer safety, unbroken
gap blocks and remediation coverage are requirements of the redesigned
renderer, even where the implementation is replaced.
