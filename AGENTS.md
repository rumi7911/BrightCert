<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Codex and Claude coordination protocol

This repository is worked on by the owner, Codex, and Claude Code. Git and the
versioned coordination files are the shared source of truth; chat history is
not.

## Mandatory start-of-task checks

Before editing anything:

1. Run `git fetch --all --prune`.
2. Read this file, `docs/coordination/PROJECT-STATUS.md`, and the newest files
   in `docs/coordination/handoffs/`.
3. Run `git worktree list` and `git status --short --branch` in the intended
   worktree.
4. Inspect active branches or handoffs for overlapping files.
5. State the bounded task, branch, worktree, and likely files before editing.

Repository facts outrank status prose. If a coordination document disagrees
with Git, production, or the database, stop and record the discrepancy.

## Isolation and ownership

- Never do feature work directly on `main`.
- Never let two agents use the same worktree or branch.
- Codex branches use `codex/<task>`; Claude branches use `claude/<task>`.
- Create a dedicated worktree for every implementation task.
- Treat every pre-existing uncommitted change as owner work. Do not stage,
  amend, discard, reformat, or “clean up” it.
- If another active task touches the same files or schema, stop and coordinate
  instead of resolving the overlap silently.
- Do not merge, deploy, migrate production data, send messages, or change an
  external service unless the owner explicitly requests that action.

## Task completion and handoff

Before reporting completion:

1. Run focused tests plus the appropriate full tests, lint, type-check, and
   build for the changed surface.
2. Review `git diff` and stage only task-owned files.
3. Commit on the task branch and push that branch.
4. Add a new uniquely named file under `docs/coordination/handoffs/` using the
   template. Never overwrite another agent's handoff.
5. Record exact commands and results, commit SHA, external state changes,
   remaining risks, and the next safe action.

Use filenames like:

`YYYY-MM-DD-HHMM-<agent>-<task>.md`

The owner controls integration into `main`. A task branch being complete does
not mean it is merged, deployed, or live.

## Shared status rules

- `docs/coordination/PROJECT-STATUS.md` is a concise integrated snapshot, not a
  substitute for Git history or task handoffs.
- Update the snapshot only when integrating verified work or when the owner
  explicitly asks for a status reconciliation.
- Evidence for production operations belongs in dated evidence documents.
- Never claim another agent's rehearsal, test, or deployment is verified
  without checking the underlying code and evidence independently.
