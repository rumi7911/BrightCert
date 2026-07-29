# BrightCert project status

Last reconciled: 29 July 2026, 19:28 BST

Reconciled by: Codex

Integrated coordination commit: `89c0e5f`

## Production

- `https://brightcert.co.uk` resolves to Vercel deployment
  `dpl_D6WUFkvQcBzPEyCcSbzLXAfmdhSp`.
- The deployment is Ready and was built from `main` commit `457fdc6`.
- Hosting-plan changes are deferred until after the hackathon by owner
  decision.

## Active work

| Workstream | Branch | State | Ownership boundary |
|---|---|---|---|
| Coordination bootstrap | `codex/agent-coordination` | Integrated into `main` at `df5b771` | Coordination files and `AGENTS.md` only |
| Reminder rehearsal evidence | `codex/reminder-evidence-integration` | Verified integration branch; awaiting owner-controlled merge | Claude's evidence plus the single reminder launch-gate row |
| SEO growth and indexing | `codex/seo-growth` | Large uncommitted change set | Do not edit or stage from another worktree |
| Production report redesign | `codex/production-report-redesign` | Clean at `d33e62d` | Treat as the report implementation branch |
| Main working tree | `main` | Dirty with owner/previous-agent changes | Do not work in, reset, stage, or clean |

## Dirty-main preservation boundary

The main working tree currently contains modifications or untracked work in:

- Claude and agent configuration
- Outreach launch-gate, LIA, SOP, rehearsal, verification, and founder-script
  evidence
- PDF report source and tests
- Local tooling, output, temporary, and video directories

These files have mixed ownership. No agent may assume authorship or include
them in another task's commit without an explicit reconciliation.

## Launch status

- Claude's reminder rehearsal evidence is committed at `66f85ef`, independently
  reviewed, and reconciled with the reminder launch-gate row on
  `codex/reminder-evidence-integration`.
- The dirty-main launch gate records 33 of 34 rows verified, with only the
  production PDF/report retest open. That total also depends on 21 other
  owner/previous-agent row edits which remain uncommitted and are deliberately
  excluded from this bounded integration branch.
- Integrating this branch versions the reminder evidence and reminder row; it
  does not by itself integrate or claim authorship over those other rows.
- The dirty-main evidence duplicate remains owner work and has not been
  altered or staged.

## Immediate priorities

1. Owner reviews and integrates `codex/reminder-evidence-integration`.
2. Verify, commit, and push `codex/seo-growth`.
3. Review and integrate `codex/production-report-redesign`.
4. Complete the remaining deployed PDF/report verification.
5. Begin deterministic assessment work only from a clean, agreed integration
   base.

## Known constraints

- Do not reproduce the official Cyber Essentials questionnaire verbatim.
- BrightCert is a readiness service, not a Certification Body.
- Gemini remains the sole production LLM.
- UK English is required.
- Production writes and external communications require explicit owner
  instruction.
