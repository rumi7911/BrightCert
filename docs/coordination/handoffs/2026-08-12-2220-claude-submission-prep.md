# Handoff — submission prep: README claim fix + submission-evidence merge

- **Agent:** Claude Code
- **Date:** 12 August 2026, 22:20 BST
- **Branch:** `claude/submission-prep`
- **Worktree:** `.worktrees/submission-prep`
- **Base:** `origin/main` @ `572ae58`
- **Head:** `e6cd939`

## Task

Close the two items found in the pre-submission repository audit, five days
before the XPRIZE deadline (17 August 2026).

## What changed

`dc0264d` — **README no longer claims subscription tiers.**
`README.md:52` read *"Stripe Checkout (one-time + subscription tiers)"*. There is
no subscription code path: `src/app/api/stripe/checkout/route.ts:15` is
`mode: "payment"` with a single `unit_amount: 19900`. Monitor, CE Plus Pack and
MSP Partner have no checkout and are not built. The row now reads
*"Stripe Checkout (one-time payment for the report unlock)"*.

This mattered because the claim sat two lines above a link to the source that
disproves it.

`e6cd939` — **Merged `claude/submission-evidence`** (no conflicts). Brings in:

- `docs/outreach/XPRIZE-MANDATORY-REQUIREMENTS-2026-08-10.md` — end-to-end proof
  that both mandatory judging requirements run in production
- `docs/submission/DEMO-VIDEO-SCRIPT.md`, `NARRATION.txt`, `build-narration.sh`
- `docs/submission/narration/shot-{1..6}.mp3` — the ElevenLabs narration
- `docs/growth/SEO-BASELINE-2026-08-11.md`
- `docs/coordination/PROJECT-STATUS.md` update

**13 files changed, 583 insertions, 6 deletions. No `src/` changes** —
`git diff origin/main --name-only -- src/` is empty.

## Verification

| Command | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npm run lint` | clean |
| `npm run test:run` | **294 passed / 36 files** |
| `git diff origin/main -- src/` | empty |

`npm run build` was **not** run in this worktree: its `node_modules` is a symlink
to the primary checkout and Turbopack rejects a symlink pointing outside the
project root (`Symlink [project]/node_modules is invalid`). Since the diff is
documentation plus one README table cell, the build surface is unchanged from
`572ae58`, which is the currently deployed and building commit.

## Audit findings that needed no change

- No secrets in tracked files or in history. The only key-shaped string across
  all commits is a truncated, expired local Stripe CLI webhook secret
  (`whsec_09965bd2…`) inside a docs table.
- `.env*`, `/.outreach/`, `/outreach/runs/` gitignored; nothing tracked.
  `.env.example` holds empty placeholders.
- Every email address in `docs/` and `src/` is fictitious (`.test` / `example`
  domains) apart from `hello@brightcert.co.uk`.
- Repo created **27 June 2026**, clearing the "newly created after 19 May 2026"
  rule. Public with an MIT `LICENSE`, satisfying "public (with relevant
  licensing)".
- `gemini-2.5-flash` (`src/lib/gemini/client.ts:16`) and `@google-cloud/storage`
  with signed URLs (`src/lib/gcs/upload.ts`) both sit in deployed code paths.
- Production live: `/`, `/pricing`, `/sitemap.xml` all 200.
- No product code is stranded on any branch. `codex/preview-build-supabase-fallback`
  and `codex/reminder-evidence-integration` appear to add a homepage prerender
  guard, but **main already has it** along with its test — a three-dot
  `git diff A...B` shows what a branch added at divergence and says nothing about
  what `A` has since gained. The other stale branches are ~19,500 lines *behind*
  main.

## External state changed

None. No pushes to `main`, no deploys, no database writes, no messages sent.

## Next safe action

Owner merges `claude/submission-prep` into `main` and pushes:

```sh
git checkout main && git merge --ff-only claude/submission-prep && git push origin main
```

Then verify the Vercel deploy actually picked it up (a real deploy race once
served stale code for 15 hours undetected).

## Remaining for submission

- Upload the demo video to **YouTube as Public** — the rules require "publicly
  visible", so Unlisted does not qualify. Runtime 2:03.6, inside the 3-minute cap.
- Complete the Devpost form: category, repository URL, text description, video link.
- Decide on untracked `videos/` — commit, ignore, or delete.
- Unrelated and still open: roll the exposed `sk_test_` Stripe key (not a repo
  exposure — it is not in git history), rotate the ElevenLabs key.
