# BrightCert project status

Last reconciled: 1 August 2026, 20:05 BST

Reconciled by: Claude Code

Integrated coordination commit: `7a13d6c`

## Production

- `https://brightcert.co.uk` resolves to Vercel deployment
  `dpl_A18AAu1X89XgnoBPtqX8fQyotawV`
  (`brightcert-74yqsevwb`), Ready, created 1 August 2026 19:58 BST.
- Local `main`, `origin/main` and the deployed build are all `7a13d6c`.
- Live checks after deploy: homepage HTTP 200; `/pricing` states the
  `FOUNDING10` cap 10 times; emitted `@font-face` blocks are Inter 7×`swap`,
  Bricolage Grotesque 12×`swap`, JetBrains Mono 18×`optional`, matching the
  intended split exactly.
- Hosting-plan changes are deferred until after the hackathon by owner
  decision.

Before claiming anything is live, check
`git rev-list --left-right --count origin/main...main`. Between 30 July and
1 August, `main` sat 17 commits ahead of `origin/main` and none of that work
was deployed, while local inspection made it look shipped.

## Active work

| Workstream | Branch | State | Ownership boundary |
|---|---|---|---|
| Social infographic system | `codex/social-infographic-system` | Integrated at `47515ea` | Complete |
| Integrated signal sprint | `codex/integrated-signal-sprint` | Integrated at `aaf55a4` | Four founder drafts held at `Status: Founder review` |
| PDF production gate repair | `codex/pdf-production-gate` | Integrated at `6804252` | Renderer repair deployed; production retest still open |
| Launch evidence backup | `claude/evidence-backup` | Integrated at `7a13d6c` | Complete |
| Production report redesign | `codex/production-report-redesign` | **Do not integrate** | 111 files; rejected by `codex/report-redesign-review` at `67b646a` |
| Reminder dry-run evidence | `claude/reminder-dry-run-evidence` | Integrated at `112f9d7` | Complete |
| Reminder evidence integration | `codex/reminder-evidence-integration` | Unmerged | Collides with `LAUNCH-GATE.md` only, which is now committed — re-check before merging |
| Preview build fallback | `codex/preview-build-supabase-fallback` | Unmerged, largely redundant | Same patch-id as work already integrated via `codex/seo-growth` |
| Review records | `claude/seo-growth-review`, `codex/report-redesign-review` | Unmerged, 1 file each | Review documents only |

## Dirty-main preservation boundary

**This boundary is largely resolved as of `7a13d6c`.** The launch-gate record,
the LIA sign-off, and seven evidence documents that previously existed only as
uncommitted working-tree content are now committed. Untracked files fell from
474 to 1.

What remains uncommitted in `main`: the authored promo-video source under
`videos/brightcert-promo/` (`STORYBOARD.md`, `SCRIPT.md`, `DESIGN.md`,
`compositions/*.html`, and the small JSON files). Its generated media is now
ignored. This is a deliberate owner decision, not an oversight — it is left
visible rather than ignored so it is not forgotten.

`docs/outreach/REMINDER-DRY-RUN-2026-07-28.md` is now committed, and the blob
is byte-identical to the copies on the three reminder branches. The untracked
copy that previously made those merges abort is gone, which unblocked
`claude/reminder-dry-run-evidence` — merged at `112f9d7`, bringing only its
handoff, since the identical blob merged without conflict.

## Launch status

- The launch gate records **33 of 34 rows verified**, and that record is now
  committed rather than living in a dirty working tree.
- The only open row is the production PDF/report retest, marked
  `owner action required`. The renderer repair is now deployed; closing the row
  needs one sandbox paid PDF generation/download plus locked unpaid/refunded
  access checks against the deployed build.
- That retest is blocked on credentials, not on code: no `sk_test_` key exists
  in `.env.local` and the Stripe CLI has no config, so no agent on this machine
  can reach test mode.

## Immediate priorities

1. Delete the **test-mode** Stripe webhook endpoint. Stripe auto-disables it on
   4 August. Owner-only: Stripe API keys are mode-scoped, live mode cannot
   enumerate test-mode objects, and the live-mode endpoint is healthy and
   unaffected.
2. Run the sandbox paid/unpaid/refunded PDF retest and record it in a dated
   evidence document, then close the final launch-gate row.
3. Decide whether the promo-video source is committed or discarded.

## Known constraints

- Do not reproduce the official Cyber Essentials questionnaire verbatim.
- BrightCert is a readiness service, not a Certification Body.
- Gemini remains the sole production LLM.
- UK English is required.
- Production writes and external communications require explicit owner
  instruction.
- The desktop shell exposes no `node`/`npm` on `PATH`, and Homebrew's Node 25
  has a broken `llhttp` dylib link. Use
  `/opt/homebrew/Cellar/node@20/20.20.2/bin`.
- `vercel ls` writes its status table to **stderr**; redirect with `2>&1` or
  a grep on stdout will never match.
