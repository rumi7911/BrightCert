# BrightCert Canva Proof Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an editable two-page Canva proof for the approved BrightCert
Editorial Authority social-carousel direction.

**Architecture:** Build one self-contained HTML import package with two fixed
1080 x 1350 pages and the real BrightCert logo mark. Import the package into
Canva as an Instagram-post design, inspect both page thumbnails, and stop for
owner review before producing slides 3 to 7.

**Tech Stack:** HTML/CSS, local BrightCert PNG assets, Canva design import and
Canva page-thumbnail inspection.

## Global Constraints

- Create exactly two proof pages at 1080 x 1350 px.
- Use navy `#0F2044`, emerald `#047857`, warm off-white `#F3F4EC` and white.
- Use an editorial serif for key numbers/headlines, Inter-style sans serif for
  supporting copy and monospace labels.
- Use the real BrightCert logo mark.
- Use `+ VAT` wherever a fee is shown.
- Use UK English and no em dash in visible copy.
- Do not imply BrightCert certifies organisations or guarantees a pass.
- Do not design slides 3 to 7.
- Do not replace any previously committed carousel asset.
- Do not publish, schedule or share the proof externally.

---

### Task 1: Build the two-page Canva import package

**Files:**

- Create temporarily:
  `tmp/social-infographic/canva-proof/brightcert-editorial-proof.html`
- Copy temporarily:
  `tmp/social-infographic/canva-proof/logo-mark.png`
- Create temporarily:
  `tmp/social-infographic/brightcert-editorial-proof.zip`

**Interfaces:**

- Consumes:
  `docs/superpowers/specs/2026-07-29-brightcert-social-carousel-redesign-design.md`
  and `public/logo-mark.png`.
- Produces: one ZIP import artifact containing the HTML and logo image.

- [ ] **Step 1: Create the proof HTML**

  Use two top-level elements marked `data-document-role="page"` and
  `data-label`, one for each 1080 x 1350 page. Implement:

  - Page 1 as a navy composition with oversized `£320` and `£600 + VAT`,
    emerald progression, real logo mark, compact labels and purposeful use of
    the full canvas.
  - Page 2 as an off-white four-step rising fee-band diagram with prices as the
    primary scan path, employee ranges as secondary text, IASME source,
    reviewed date and folio.

- [ ] **Step 2: Validate the source**

  Run:

  ```bash
  rg -n 'data-document-role="page"' tmp/social-infographic/canva-proof/brightcert-editorial-proof.html
  rg -n '£320|£440|£500|£600|\\+ VAT|IASME|29 July 2026' tmp/social-infographic/canva-proof/brightcert-editorial-proof.html
  ```

  Expected: exactly two page markers and all required fee/source strings.

- [ ] **Step 3: Package the import**

  Copy `public/logo-mark.png` into the package directory and create
  `tmp/social-infographic/brightcert-editorial-proof.zip` containing only the
  proof HTML and logo.

- [ ] **Step 4: Inspect package contents**

  Run:

  ```bash
  unzip -l tmp/social-infographic/brightcert-editorial-proof.zip
  ```

  Expected: one HTML file and one PNG logo asset, with no unrelated repository
  content.

### Task 2: Import and inspect the Canva proof

**Files:**

- Consume:
  `tmp/social-infographic/brightcert-editorial-proof.zip`
- External design:
  `BrightCert Cyber Essentials Cost 2026 - Editorial Proof`

**Interfaces:**

- Consumes: the ZIP package from Task 1.
- Produces: one editable two-page Canva design ID and edit URL.

- [ ] **Step 1: Import into Canva**

  Call Canva's design-import tool with:

  - `design_file`: the absolute ZIP path
  - `intended_design_type`: `instagram_post`
  - `name`: `BrightCert Cyber Essentials Cost 2026 - Editorial Proof`

  Expected: a Canva design ID and edit/view URL.

- [ ] **Step 2: Verify design metadata**

  Retrieve the Canva design metadata.

  Expected: title matches the proof name and the design contains exactly two
  pages.

- [ ] **Step 3: Inspect both page thumbnails**

  Retrieve pages 1 and 2 and display both thumbnails to the owner.

  Check:

  - no clipped, overlapping or unexpectedly wrapped text;
  - cover remains legible as a thumbnail;
  - all four fee bands are readable;
  - no dead-space pattern resembling the rejected NotebookLM PDF;
  - logo mark, source, date and folios render correctly.

- [ ] **Step 4: Stop at the review gate**

  Provide the Canva edit URL and previews. Do not create slides 3 to 7 until
  the owner explicitly approves the two-page proof.

### Task 3: Record implementation state

**Files:**

- Create:
  `docs/coordination/handoffs/2026-07-29-2353-codex-canva-editorial-proof.md`
- Remove: task-owned temporary import files after the Canva import is confirmed.

**Interfaces:**

- Consumes: the Canva design ID, URLs and verification results from Task 2.
- Produces: a versioned coordination record for the external Canva state.

- [ ] **Step 1: Record the Canva result**

  Document the design ID, title, page count, external mutations, preview
  outcome, remaining owner-review gate and the exact next safe action.

- [ ] **Step 2: Verify repository scope**

  Run:

  ```bash
  git diff --check
  git status --short --branch
  ```

  Expected: only the plan, handoff and any deliberately retained source files
  are task-owned changes.

- [ ] **Step 3: Commit and push**

  Stage only task-owned files, commit on `codex/social-infographic-system`, and
  push the branch. Do not merge into `main`.
