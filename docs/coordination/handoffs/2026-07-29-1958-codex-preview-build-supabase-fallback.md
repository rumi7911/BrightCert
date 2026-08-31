# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 2026-07-29 19:58
- **Task:** Fix the Vercel Preview homepage prerender failure when Supabase build variables are unavailable
- **Branch:** `codex/preview-build-supabase-fallback`
- **Worktree:** `/Users/rumipro/Documents/Hackathon/brightcert/.worktrees/preview-build-supabase-fallback`
- **Base commit:** `9893b82`
- **Final commit:** `444750705712dd2b2ccb74ea2538a9fd920b6009` contains the implementation; this handoff is a follow-up documentation commit
- **Status:** Complete

## Scope and ownership

- Files intentionally changed:
  - `src/app/(marketing)/page.tsx`
  - `src/app/homepage-prerender.test.tsx`
  - `docs/coordination/handoffs/2026-07-29-1958-codex-preview-build-supabase-fallback.md`
- Files inspected but not changed:
  - `src/lib/supabase/server.ts`
  - `vitest.config.mts`
  - `node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md`
- Overlapping work discovered:
  - `codex/seo-growth` also changes the homepage. Apply implementation commit `4447507` to that branch after this branch is verified.
- Files another agent must not overwrite:
  - None after integration; coordinate before changing the homepage while either branch remains active.

## Changes

The public homepage now skips its optional assessment-count query when either
server-side Supabase variable is absent. It renders the existing public fallback
label instead, so static Preview builds do not depend on privileged database
credentials. Authenticated pages and API routes retain their existing strict
Supabase configuration behaviour.

A focused regression test proves that the homepage resolves without constructing
the admin client when the build variables are absent.

## Verification

```text
env -u NEXT_PUBLIC_SUPABASE_URL -u NEXT_PUBLIC_SUPABASE_ANON_KEY -u SUPABASE_SERVICE_ROLE_KEY npm run build
Failed before the fix while prerendering "/" with "supabaseUrl is required".

npm run test:run -- src/app/homepage-prerender.test.tsx
Failed before the fix because HomePage rejected with "supabaseUrl is required".

npm run test:run -- src/app/homepage-prerender.test.tsx
Passed after the fix: 1 test.

env -u NEXT_PUBLIC_SUPABASE_URL -u NEXT_PUBLIC_SUPABASE_ANON_KEY -u SUPABASE_SERVICE_ROLE_KEY npm run build
Passed after the fix: all 30 static pages generated.

npm run test:run
Passed: 19 files, 186 tests.

npm run lint
Passed with no output.

source /Users/rumipro/Documents/Hackathon/brightcert/.env.local && npm run build
Passed with configured Supabase access: all 30 static pages generated.

git diff --check
Passed.
```

## External state

- Database writes: None
- Deployment: None at handoff creation
- Emails/messages: None
- Payments: None
- Other external actions: `git fetch --all --prune` only

## Remaining risks or blockers

- The Preview deployment must be re-run from the updated
  `codex/reminder-evidence-integration` branch and checked in Vercel.
- The same implementation commit should be propagated to `codex/seo-growth`,
  whose homepage retains the same optional count query.
- `npm ci` reported five existing moderate dependency vulnerabilities; they are
  outside this build-fix scope.

## Next safe action

Push this task branch, fast-forward `codex/reminder-evidence-integration` to it,
verify the resulting Vercel Preview build, then apply implementation commit
`4447507` to `codex/seo-growth` in its own worktree.
