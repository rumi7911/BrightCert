# BrightCert project status

Last reconciled: 3 August 2026, 21:55 BST

Reconciled by: Claude Code

Integrated coordination commit: `a1afe13`, plus the PDF retest record on
`claude/pdf-production-retest` (this file's own branch — update the SHA on
merge).

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
| PDF production gate repair | `codex/pdf-production-gate` | Integrated at `6804252` | Renderer repair deployed; retest closed 3 Aug on `claude/pdf-production-retest` |
| PDF sandbox retest | `claude/pdf-production-retest` | Documentation only; no application code changed | Closes the final launch-gate row. Conflicts with `codex/reminder-evidence-integration` on `LAUNCH-GATE.md` |
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

- The launch gate records **all 34 rows verified** — 27 `verified` and 7
  `verified (sandbox)`. No row remains `owner action required` or
  `operator action required`.
- The final open row, the PDF/report retest, was closed on 3 August 2026. Full
  sandbox lifecycle passed on commit `a1afe13` (identical to `origin/main` and
  to the live deployment): unpaid locked, paid generating a valid 14-page PDF
  with the certification disclaimer intact, refunded revoking access. Evidence:
  [PDF-SANDBOX-RETEST-2026-08-03.md](../outreach/PDF-SANDBOX-RETEST-2026-08-03.md).
- **Recorded deviation:** that row asked for the lifecycle "on the deployed
  build" and it ran against `next dev` on the same commit, because a sandbox run
  cannot target production without repointing live checkout at test keys. The
  renderer itself is unaffected by the difference (CDN fonts, dynamic import in
  both modes); Vercel cold-start against `maxDuration = 60` remains untested. A
  preview deployment with test-mode keys would close the residue.
- The seven `verified (sandbox)` rows are all payment-related and stay sandbox
  until a first real customer payment.

## Immediate priorities

1. Fix the **triple PDF generation** race. Every purchase currently triggers
   three concurrent renders and three `reports` rows, because the existence
   guard in `src/app/api/reports/generate/route.ts:56-66` reads before any
   concurrent insert lands. A unique index on `reports.assessment_id` plus an
   upsert closes it. Not a correctness bug; a cost and noise bug.
2. Bundle the four Inter `.woff` files locally. `ReportDocument.tsx:16-32`
   fetches them from jsdelivr at render time, putting a third-party CDN in the
   critical path of a paid deliverable.
3. Decide on report retention. Nothing deletes a GCS object — not the refund
   handler, not row cleanup — so report PDFs persist indefinitely with no
   deletion path. Needs a decision under UK GDPR storage limitation.
4. Owner-directed, do not start without instruction: log download/delivery
   events for chargeback evidence, add immediate-supply consent at checkout, and
   tighten terms §4. The last two are customer-facing legal copy.
5. Decide whether the promo-video source is committed or discarded.

The test-mode Stripe webhook endpoint that Stripe was due to auto-disable on
4 August is no longer tracked as a priority: the outcome of deleting it and the
outcome of letting it auto-disable are the same, and live-mode delivery is
unaffected either way.

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
