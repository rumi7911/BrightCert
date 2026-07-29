# Agent task handoff

- **Agent:** Claude Code
- **Date/time (BST):** 29 July 2026, 22:35
- **Task:** Exclude sibling task worktrees from root-level lint and test runs
- **Branch:** `claude/worktree-ignores`
- **Worktree:** `.worktrees/worktree-ignores`
- **Base commit:** `7734cb6` (`origin/main`)
- **Final commit:** `492085b`, plus the commit containing this handoff
- **Status:** Complete on the task branch; awaiting owner-controlled merge

## Scope and ownership

- **Files intentionally changed:** `eslint.config.mjs`, `vitest.config.mts`,
  and this handoff.
- **Files inspected but not changed:** `package.json` scripts, the vitest 4.1.10
  `defaultExclude` value, and the four other active branches (checked for
  overlap on both config files).
- **Overlapping work discovered:** none. No active branch touches either config
  file, and both were clean in dirty `main` before this task.
- **Files another agent must not overwrite:** none introduced by this task.

## Changes

Task worktrees live at `.worktrees/` **inside** the repository root, so ESLint
and Vitest walked into every other agent's checked-out branch when run from the
main worktree.

- `eslint.config.mjs` — added `.worktrees/**` to the existing `globalIgnores`
  list.
- `vitest.config.mts` — added `exclude: [...defaultExclude, "**/.worktrees/**"]`.
  The defaults are **spread rather than replaced**: setting `exclude` outright
  would have silently dropped vitest's own `**/node_modules/**` and `**/.git/**`
  entries, trading one collection bug for a worse one.

This removes the need for the documented workaround — "always run from inside
the task worktree" — which previously had to be remembered before any result
from the repository root could be trusted.

## Verification

The fix cannot be meaningfully verified from inside an isolated worktree,
because such a worktree contains no nested `.worktrees/` directory and so
cannot reproduce the fault. It was therefore measured **from the main worktree
root**, before and after, by temporarily copying the two fixed config files in
and restoring them with `git checkout --` afterwards.

```text
BEFORE (main worktree root, configs at 7734cb6)
  npm run lint   -> 78899 problems
  npx vitest run -> Test Files  23 failed | 218 passed (241)

AFTER (same root, fixed configs copied in)
  npm run lint   -> exit 0, no output
  npx vitest run -> Test Files  23 passed (23)
                    Tests      212 passed (212)

restore
  git checkout -- eslint.config.mjs vitest.config.mts
  git status --short -- <both>   -> clean
  git status --short | wc -l     -> 19 (dirty-main work preserved intact)
```

Contamination source confirmed before fixing, so the change targets the real
cause rather than a symptom:

```text
npm run lint | <extract file paths> | cut -d/ -f1 | sort | uniq -c
-> 1536 .worktrees
   (zero offending files outside .worktrees/)
```

On the task branch itself:

```text
npm run test:run  -> 23 test files passed; 211 tests passed
npm run lint      -> exit 0
npx tsc --noEmit  -> exit 0
```

The 211-vs-212 difference is expected and not a regression: dirty `main`
carries an uncommitted modification to `src/lib/pdf/ReportDocument.test.tsx`
that adds one test, and that file is owner work which this branch does not
contain.

No build was run. Neither file affects the Next.js build — `next build` does not
read `vitest.config.mts`, and lint is not part of the build script. A build was
run against these exact sources on `main` at `7734cb6` earlier in the session
and passed (31/31 static pages).

## External state

- **Database writes:** None.
- **Deployment:** None. Both files are development tooling and are not read at
  runtime, so this change does not require a deployment.
- **Emails/messages:** None.
- **Payments:** None.
- **Other external actions:** Pushed `claude/worktree-ignores` to origin. No
  merge.

## Remaining risks or blockers

- **The pattern is `.worktrees/` specifically.** A worktree created anywhere
  else inside the repository root would reintroduce the problem. `AGENTS.md`
  does not currently mandate the `.worktrees/` location; all five existing
  worktrees follow it by convention only. Worth codifying if this recurs.
- `tsc --noEmit` was **not** affected by this bug and is not fixed by this
  change, because `tsconfig.json` scoping already kept it to the local project.
  No action needed; recorded so a future reader does not assume all three tools
  shared the fault.
- Historical verification claims in earlier handoffs that reported a root-level
  `npm test` or `npm run lint` result may have been contaminated. Any such
  figure predating this commit should be treated as unreliable unless the
  handoff explicitly states the command was run from inside a task worktree.
  Both of today's Claude handoffs state this; `2026-07-29-1935-codex-reminder-evidence-integration.md`
  also explicitly discarded one such run.

## Next safe action

Owner merges `claude/worktree-ignores` into `main`. It is a two-file tooling
change with no runtime effect and no deployment requirement. After merging,
`npm run lint` and `npm run test:run` become trustworthy from the repository
root, which removes a standing footgun for both agents.
