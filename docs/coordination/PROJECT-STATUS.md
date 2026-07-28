# BrightCert project status

Last reconciled: 28 July 2026, 22:00 BST

Reconciled by: Codex

Snapshot base: `main` / `origin/main` at `457fdc6`

## Production

- `https://brightcert.co.uk` resolves to Vercel deployment
  `dpl_D6WUFkvQcBzPEyCcSbzLXAfmdhSp`.
- The deployment is Ready and was built from `main` commit `457fdc6`.
- Hosting-plan changes are deferred until after the hackathon by owner
  decision.

## Active work

| Workstream | Branch | State | Ownership boundary |
|---|---|---|---|
| Coordination bootstrap | `codex/agent-coordination` | In progress in an isolated worktree | Coordination files and `AGENTS.md` only |
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

- The working-tree launch gate records 33 of 34 rows verified.
- The only recorded open row is the production PDF/report retest.
- The reminder rehearsal is documented and independently corroborated, but the
  evidence remains uncommitted in dirty `main`.
- Working-tree launch evidence is not integrated project history until it is
  reviewed and committed.

## Immediate priorities

1. Land this coordination protocol so both agents receive the same rules.
2. Reconcile and preserve dirty-main work without destructive cleanup.
3. Verify, commit, and push `codex/seo-growth`.
4. Review and integrate `codex/production-report-redesign`.
5. Complete the remaining deployed PDF/report verification.
6. Begin deterministic assessment work only from a clean, agreed integration
   base.

## Known constraints

- Do not reproduce the official Cyber Essentials questionnaire verbatim.
- BrightCert is a readiness service, not a Certification Body.
- Gemini remains the sole production LLM.
- UK English is required.
- Production writes and external communications require explicit owner
  instruction.
