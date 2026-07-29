# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 29 July 2026, 23:08
- **Task:** Implement the BrightCert social infographic production system and
  produce the founder-reviewable Week 1 Cyber Essentials cost carousel
- **Branch:** `codex/social-infographic-system`
- **Worktree:** `.worktrees/social-infographic-system`
- **Base commit:** `8060708` (`origin/main`)
- **Final commit:** `f91cbb1`, plus the commit containing this handoff
- **Status:** Complete on the task branch; awaiting owner review and integration

## Scope and ownership

- **Files intentionally changed:** `docs/social/**` and this handoff.
- **Files inspected but not changed:** repository coordination files, website
  logo assets, the existing BrightCert cost article, and package scripts.
- **Overlapping work discovered:** none. No active handoff or task branch owned
  `docs/social/**`.
- **Files another agent must not overwrite:** `docs/social/**` until the owner
  integrates or rejects this branch.

## Changes

Added a reusable, founder-led social production system:

- a 1080 x 1350 editable PPTX master with six reusable page types;
- a seven-page Week 1 Cyber Essentials cost carousel in editable PPTX,
  LinkedIn PDF and seven numbered Instagram PNG formats;
- a one-page derivative graphic in editable PPTX and PNG formats;
- a completed Week 1 brief with primary sources, reviewed date, captions,
  tracked URLs and page-level accessibility descriptions;
- a reusable brief template, QA checklist, 12-week source-gated calendar and
  72-hour/seven-day measurement sheet.

The Week 1 fee bands are the current IASME amounts retrieved on 29 July 2026:
£320, £440, £500 and £600 plus VAT. The regulatory weeks remain source-gated;
no future carousel was presented as reviewed or publishable before its
matching article and founder review exist.

Canva was queried only to list available Brand Kits before creating anything.
The connection returned `UNAUTHORIZED` with an OAuth reauthentication error,
so no Canva design or Brand Kit was created. The PPTX master is the editable
Canva-import fallback. No social post was scheduled or published.

## Verification

All commands were run in `.worktrees/social-infographic-system`.

```text
slides_test.py docs/social/assets/master/BrightCert-Social-Carousel-Master.pptx
-> Test passed. No overflow detected.

slides_test.py docs/social/assets/week-01-cost/2026-07-29-Cyber-Essentials-Cost-Carousel.pptx
-> Test passed. No overflow detected.

slides_test.py docs/social/assets/week-01-cost/2026-07-29-Cyber-Essentials-Cost-Derivative.pptx
-> Test passed. No overflow detected.

pdftoppm -png -r 120 <Week 1 PDF> <temporary output>
-> Seven pages rendered and visually inspected as a contact sheet after the
   final regeneration; no clipping, overlap or rendering defects found.

file docs/social/assets/week-01-cost/*.png
-> Seven carousel PNGs and one derivative PNG, all 1080 x 1350 RGBA.

pdfinfo docs/social/assets/week-01-cost/2026-07-29-Cyber-Essentials-Cost-Carousel.pdf
-> 7 pages; consistent 810 x 1012.51 pt page size; 146,218 bytes; unencrypted.

pdffonts docs/social/assets/week-01-cost/2026-07-29-Cyber-Essentials-Cost-Carousel.pdf
-> All listed fonts embedded.

asset validation for PNG count and dimensions, PDF page count, exact
readiness disclaimer, all four official fee values, no em dash in visible
Week 1 copy, and git diff whitespace
-> passed.

npm run test:run
-> 23 test files passed; 211 tests passed.

npm run lint
-> exit 0, no diagnostics.

npx tsc --noEmit
-> exit 0, no diagnostics.

npm run build
-> compiled successfully; TypeScript completed; 31/31 static pages generated.
```

`npm ci` reported five moderate dependency vulnerabilities. No dependency file
was changed because dependency remediation is outside this documentation and
asset-only task.

## External state

- **Database writes:** None.
- **Deployment:** None.
- **Emails/messages:** None.
- **Payments:** None.
- **Other external actions:** IASME and NCSC pages were read for source
  verification. The Canva Brand Kit list call failed before mutation because
  the connection requires reauthentication. This branch will be pushed to
  origin after the handoff commit.

## Remaining risks or blockers

- Muhammad has not yet approved the Week 1 claims or publishing copy. The brief
  deliberately remains in `Founder review` status.
- The Canva connection must be reauthenticated before the Brand Kit and locked
  Canva master can be created in the owner's account. The editable PPTX master
  can be imported immediately after reconnection.
- Canva may substitute local rendering fallbacks during initial import. Confirm
  Bricolage Grotesque, Inter and JetBrains Mono in Canva, then re-check every
  page at phone size before export.
- Weeks 2 to 12 are a production calendar, not pre-approved claims. Each remains
  blocked on the matching article, current primary-source check and founder
  review.

## Next safe action

The owner reviews the Week 1 brief, PDF and PNG sequence. If approved, integrate
`codex/social-infographic-system` into the chosen integration base, reconnect
Canva, import the master and Week 1 PPTX, confirm fonts and locked elements, and
publish manually using the supplied captions and tracked links. Do not publish
before the founder approval boxes are completed.
