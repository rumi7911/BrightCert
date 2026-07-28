# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 28 July 2026, 22:00
- **Task:** Establish shared Codex and Claude Code coordination
- **Branch:** `codex/agent-coordination`
- **Worktree:** `.worktrees/agent-coordination`
- **Base commit:** `457fdc6`
- **Final commit:** The commit containing this handoff
- **Status:** Complete

## Scope and ownership

- Files intentionally changed: `AGENTS.md` and `docs/coordination/**`
- Files inspected but not changed: repository `CLAUDE.md`, Git worktree state,
  production deployment metadata
- Overlapping work discovered: dirty `main`, uncommitted SEO work, and the
  separate report-redesign branch
- Files another agent must not overwrite: all dirty-main and SEO-worktree
  changes listed in `PROJECT-STATUS.md`

## Changes

Added one shared protocol imported by Claude Code and read by Codex, a current
status snapshot, a reusable handoff template, an append-only handoff directory,
and a Claude Code start prompt.

## Verification

```text
npm run test:run
18 test files passed; 185 tests passed

npm run lint
Exited 0 with no lint errors

npm run build
Initial isolated-worktree run reached prerendering and failed because the
ignored .env.local was not present: "supabaseUrl is required"

source ../../.env.local; npm run build
Exited 0; production build compiled, type-checked, and generated all 30 pages

npx vercel inspect https://brightcert.co.uk
Production deployment Ready

npx vercel inspect dpl_D6WUFkvQcBzPEyCcSbzLXAfmdhSp --logs
Build source confirmed as main commit 457fdc6
```

## External state

- Database writes: None
- Deployment: None
- Emails/messages: None
- Payments: None
- Other external actions: None

## Remaining risks or blockers

The protocol does not become the shared remote default until this branch is
integrated into `main`. Existing dirty-main changes still require ownership
reconciliation.

## Next safe action

Review and integrate `codex/agent-coordination`, then require both agents to
start from the shared protocol before touching another workstream.
