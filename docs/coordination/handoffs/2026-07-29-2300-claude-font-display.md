# Agent task handoff

- **Agent:** Claude Code
- **Date/time (BST):** 29 July 2026, 23:00
- **Task:** Restore `display: "swap"` for the two brand typefaces after
  `codex/seo-growth` moved all three faces to `"optional"`
- **Branch:** `claude/font-display`
- **Worktree:** `.worktrees/font-display`
- **Base commit:** `8060708` (`origin/main`)
- **Final commit:** `91e0037`, plus the commit containing this handoff
- **Status:** Complete on the task branch; awaiting owner-controlled merge

## Scope and ownership

- **Files intentionally changed:** `src/app/layout.tsx` and this handoff.
- **Files inspected but not changed:**
  `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`,
  the emitted `.next` font CSS, and the four other active branches (checked for
  overlap on `src/app/layout.tsx`).
- **Overlapping work discovered:** none. No active branch touches
  `src/app/layout.tsx`, the file was clean in dirty `main`, and no test asserts
  a `font-display` value.
- **Files another agent must not overwrite:** none introduced by this task.

## Changes

`codex/seo-growth` changed Inter, Bricolage Grotesque and JetBrains Mono from
`display: "swap"` to `display: "optional"` as a layout-shift optimisation, and
that reached production in `7734cb6` before the trade-off was reviewed. It was
raised in `2026-07-29-2035-claude-seo-growth-review.md` as an owner decision;
the owner chose to revert the brand faces.

`optional` gives the browser roughly 100 ms to have the font ready and then
keeps the fallback **for the entire page view without ever swapping**. For a
first-time visitor on a slow connection that means Inter and Bricolage are never
displayed at all. `DESIGN-SYSTEM.md` names Inter as a brand token, so this was a
design regression delivered as a performance change.

- **Inter → `swap`**, **Bricolage Grotesque → `swap`**. Per the Next.js font
  API reference, `swap` is also `next/font`'s documented default and is what
  every example in those docs uses.
- **JetBrains Mono stays `optional`.** It carries small decorative eyebrow,
  badge and quiz-meta labels rather than brand identity or reading copy, so a
  silent fallback costs little and avoids shifting the above-the-fold label
  rows. The accepted layout-shift cost is therefore confined to the two faces
  where brand fidelity actually matters.

Both decisions are recorded as comments next to the declarations so the next
reader does not "re-optimise" this back.

## Verification

All commands run from inside `.worktrees/font-display`.

```text
npx tsc --noEmit  -> exit 0
npm run test:run  -> 23 test files passed; 211 tests passed
npm run lint      -> exit 0
set -a; source <repository .env.local>; set +a; npm run build
                  -> Compiled successfully; 31/31 static pages generated
```

The change was verified in the **emitted CSS**, not only in source, because the
`display` option is compiled into `@font-face` rules and a source-only check
would not prove what ships:

```text
grep per family across .next/**/*.css
  Inter      ->  7 x font-display:swap
  Bricolage  -> 12 x font-display:swap
  JetBrains  -> 18 x font-display:optional
```

That is exactly the intended split, with no family carrying a mixed value.

## External state

- **Database writes:** None.
- **Deployment:** None. This is not live until the owner merges and deploys —
  production is still serving `optional` for all three faces from `7734cb6`.
- **Emails/messages:** None.
- **Payments:** None.
- **Other external actions:** Pushed `claude/font-display` to origin. No merge.

## Remaining risks or blockers

- **Cumulative Layout Shift will rise slightly** on first paint for uncached
  visitors, which is the deliberate cost of this change. `next/font`
  self-hosts and preloads both faces and emits size-adjusted fallback metrics,
  so the shift should be small, but it is a real regression against the
  Core Web Vitals motive behind the original edit. No CWV measurement was taken
  either before or after; if the owner wants that quantified it needs a field or
  Lighthouse comparison against production, which is a separate task.
- **The mono face is now inconsistent with the other two.** This is intentional
  and documented in the comments, but it does mean a visitor can see brand
  headings in Bricolage while mono labels render in the fallback. If uniformity
  is preferred, changing the single `"optional"` on `JetBrains_Mono` to
  `"swap"` is the whole change.
- No test guards these values, so a future edit could silently revert them. A
  test asserting the three `display` values would be a small follow-up; it was
  not added here because it was not requested and would be the only test of its
  kind in the repository.

## Next safe action

Owner merges `claude/font-display` into `main` and deploys. After deploying,
confirm the shipped CSS with the same per-family grep against the production
bundle, since the point of this change is only realised once it is live.

The remaining open items from tonight are unchanged: the test-mode Stripe
endpoint deletion (Aug 4 deadline), merging `claude/reminder-dry-run-evidence`
(needs the byte-identical untracked copy of
`docs/outreach/REMINDER-DRY-RUN-2026-07-28.md` removed from dirty `main` first),
and reconciling dirty `main` / `LAUNCH-GATE.md`, which still blocks both
remaining Codex branches and the last launch-gate row.
