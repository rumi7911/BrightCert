# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 30 July 2026, 22:56
- **Task:** Reconcile and independently verify the four dirty-main PDF renderer
  repairs that block the final production launch-gate retest
- **Branch:** `codex/pdf-production-gate`
- **Worktree:** `.worktrees/pdf-production-gate`
- **Base commit:** `aaf55a4` (local `main`)
- **Implementation commit:** `9c414c4`
- **Final commit:** The commit containing this handoff
- **Status:** Repair complete on the task branch; not deployed and launch gate
  remains open

## Scope and ownership

Files intentionally changed:

- `src/lib/pdf/ReportDocument.tsx`
- `src/lib/pdf/ReportDocument.test.tsx`
- this handoff

Files inspected but not changed:

- dirty-main versions of the two PDF files;
- dirty-main `docs/outreach/LAUNCH-GATE.md`;
- dirty-main `docs/outreach/PDF-REPORT-VERIFICATION-2026-07-27.md`;
- `codex/production-report-redesign`;
- `codex/report-redesign-review`; and
- the current outreach launch evidence.

Overlapping work discovered:

- `codex/production-report-redesign` touches both PDF files and the launch
  evidence, but the independent review at `67b646a` explicitly says not to
  integrate that 111-file lifecycle candidate.
- reminder-evidence branches also touch `LAUNCH-GATE.md`.
- Dirty `main` contains the owner versions of the PDF source and test.

The task therefore reconciled only the two renderer files into a new isolated
branch. It did not edit, stage, discard, or clean any dirty-main file. Launch
evidence remains a separate production-operation task.

## Changes

The reconciled renderer:

- adds the previously omitted Remediation Action Plan, including control
  headings, effort labels, and numbered remediation steps;
- keeps each issue and explanation card together across page boundaries;
- keeps each readiness disclaimer heading and body together;
- truncates only the long footer organisation label and gives the page number
  a fixed, separated column; and
- uses singular `action` when a control has one remediation item.

The regression suite renders real PDFs and proves:

- the final remediation marker survives;
- both disclaimers remain intact on the same pages as their bodies;
- all 25 issue/why marker pairs remain on the same page;
- footer text stays at least eight PDF points clear of every page number; and
- the singular action label is grammatically correct.

The source and test are byte-identical to the owner versions in dirty `main`.
This records and preserves those changes without adopting anything from the
rejected report-lifecycle branch.

## Verification

All repository commands ran from `.worktrees/pdf-production-gate`.
The desktop shell did not expose `npm`, so verification invoked the repository
CLIs with the bundled Node 24.14.0 executable.

```text
full Vitest baseline
-> 24 test files passed; 216 tests passed

focused test after applying only the owner regression tests
-> one test file failed; 2 tests failed for the expected missing renderer
   behaviour
-> no production file had been changed

focused test after applying the renderer repair
-> one test file passed; 2 tests passed

cmp source/test against dirty main
-> both byte-identical

fresh maximum-boundary PDF render
-> 34 A4 pages; 280,284 bytes; PDF 1.3; no encryption; no JavaScript
-> beginning, organisation, final remediation, disclaimer and page-34 markers
   all present

pdftoppm render at 110 DPI
-> 34 PNG pages generated

visual inspection
-> all 34 pages reviewed in four contact sheets
-> pages 1, 2, 16, 33 and 34 also reviewed at original resolution
-> no clipping, overlap, fragmented issue/why card, broken disclaimer, or
   footer/page-number collision found

full Vitest final
-> 24 test files passed; 217 tests passed

ESLint
-> exit 0; no diagnostics

TypeScript
-> exit 0; no diagnostics

Next.js 16.2.12 Turbopack production build
-> first invocation failed before compilation because Turbopack could not find
   a child `node` executable in the desktop shell PATH
-> rerun with the bundled Node directory exposed to child workers passed
-> compiled successfully; TypeScript completed; 31/31 static pages generated

git diff --check
-> exit 0
```

The temporary boundary PDF, extracted text, 34 PNG pages, contact sheets, crops,
and disposable renderer script were deleted after inspection. No generated
artefact is staged.

## External state

- **Database writes:** None
- **Deployment:** None
- **Emails/messages:** None
- **Payments:** None
- **Other external actions:** None

## Remaining risks or blockers

- The branch has not been merged into `main`, pushed to `origin/main`, or
  deployed.
- Dirty `main` still contains byte-identical uncommitted PDF source/test changes
  and must be reconciled deliberately before integration; do not discard them
  merely because this branch exists.
- The production launch-gate row remains `owner action required`.
- Closing the gate still requires deployment of this exact repair, live/origin
  commit parity, one sandbox paid PDF generation/download, and locked
  unpaid/refunded access checks.
- The 34-page report is an accepted maximum-boundary fixture. The extra
  disclaimer-only page under maximum input is visually clean but remains a
  pagination trade-off rather than a normal customer-report expectation.

## Next safe action

Owner reviews `9c414c4`. After explicit integration and deployment approval:

1. reconcile the byte-identical dirty-main PDF files without disturbing other
   owner work;
2. integrate and push the exact repair;
3. deploy that exact commit;
4. conduct the sandbox paid/unpaid/refunded production PDF retest; and
5. record the result in a new dated evidence document before changing the
   launch-gate row.

Do not integrate `codex/production-report-redesign` as a shortcut.
