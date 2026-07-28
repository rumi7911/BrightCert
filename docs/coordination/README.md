# Agent coordination

This directory keeps Codex, Claude Code, and the project owner aligned without
depending on private chat context.

## Files

- `PROJECT-STATUS.md` — concise snapshot of integrated and active work.
- `HANDOFF-TEMPLATE.md` — required structure for task handoffs.
- `CLAUDE-START-PROMPT.md` — reusable prompt for starting Claude Code.
- `handoffs/` — append-only, uniquely named task records.

## Workflow

1. Fetch and read `AGENTS.md`, the status snapshot, and recent handoffs.
2. Confirm that the intended files do not overlap another active worktree.
3. Work on an isolated agent-prefixed branch and worktree.
4. Verify, commit, push, and write a unique handoff.
5. The owner reviews and controls integration into `main`.

Chat summaries are useful context but are not evidence. Git, tests, production
inspection, database read-backs, and dated evidence documents remain
authoritative.
