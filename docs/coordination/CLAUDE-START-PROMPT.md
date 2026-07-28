# Claude Code start prompt

Copy the text below into Claude Code at the start of its next BrightCert task.

```text
Before doing any work, follow the repository coordination protocol in
AGENTS.md.

1. Run git fetch --all --prune.
2. Read AGENTS.md, docs/coordination/PROJECT-STATUS.md, and the newest files in
   docs/coordination/handoffs/.
3. Run git worktree list and inspect git status --short --branch in every
   relevant worktree.
4. Treat all existing uncommitted files as owner or other-agent work. Do not
   stage, modify, discard, reformat, reset, or include them in your task.
5. Do not work directly on main. Create an isolated worktree on a
   claude/<task-name> branch.
6. Before editing, tell me the bounded task, branch/worktree, likely files, and
   any overlap you found. If another active branch touches the same files,
   stop and report the conflict instead of resolving it silently.
7. Read the relevant Next.js documentation under node_modules/next/dist/docs/
   before changing Next.js code.
8. Verify your work with focused tests and the appropriate full test, lint,
   type-check, and build commands.
9. Review the final diff, stage only files owned by this task, commit, and push
   the task branch. Do not merge, deploy, migrate production data, send email,
   or change an external service unless I explicitly request it.
10. Finish by adding a uniquely named handoff under
    docs/coordination/handoffs/ using HANDOFF-TEMPLATE.md. Include exact test
    results, commit SHA, external actions, remaining risks, and the next safe
    action.

Git and versioned evidence are the source of truth. Do not rely on a previous
Claude or Codex chat summary without checking the repository and evidence.
```
