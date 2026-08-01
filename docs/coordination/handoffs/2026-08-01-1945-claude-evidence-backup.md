# Agent task handoff

- **Agent:** Claude Code
- **Date/time (BST):** 1 August 2026, 19:45
- **Task:** Back up the launch-gate evidence that existed on no branch, and
  ignore the agent tooling and generated media cluttering dirty `main`
- **Branch:** `claude/evidence-backup`
- **Worktree:** the main worktree (see "Why not an isolated worktree" below)
- **Base commit:** `6804252` (local `main`)
- **Task commits:** `b349c17`, `f77a1b5`, `a9e8eaf`, plus the commit containing
  this handoff
- **Status:** Complete on the task branch; **not pushed** (see External state);
  awaiting owner-controlled merge

## Why not an isolated worktree

`AGENTS.md` requires a dedicated worktree per task. That was not possible here
and the deviation is deliberate.

The subject of this task is the *untracked working-tree content of `main`
itself*. Those files exist only in the main worktree's filesystem; a sibling
worktree checked out on a new branch would contain none of them, so the task
could not be performed there. Copying them into a sibling worktree would have
reproduced the exact failure that still blocks
`claude/reminder-dry-run-evidence`: a byte-identical untracked copy left behind
in dirty `main` that makes the later merge abort.

Instead, `git switch -c claude/evidence-backup` created the branch **at**
`main` inside the main worktree. That moves `HEAD` only; it changed no file,
and `git status` was confirmed at 17 entries immediately before and after.
`main` itself was never moved, and the operation reverses with
`git switch main`.

## Scope and ownership

Files intentionally changed:

- `.gitignore`
- `CLAUDE.md`, `docs/outreach/LAUNCH-GATE.md`, `docs/outreach/LIA.md`
  (previously modified in the working tree, now committed unaltered)
- nine previously untracked files, committed unaltered (listed below)
- this handoff

Files inspected but not changed:

- `src/lib/offer-contract.test.ts` (to determine its scan scope)
- `videos/brightcert-promo/**`, `.claude/**`, `.agents/skills/**`
- the six unmerged branches, checked for overlap

Overlapping work discovered:

- `docs/outreach/REMINDER-DRY-RUN-2026-07-28.md` also exists on
  `claude/reminder-dry-run-evidence`, `codex/reminder-evidence-integration`
  and `codex/preview-build-supabase-fallback`. The working-tree copy is
  **byte-identical** to all three (blob `b7c89d8`). Committing it here is
  therefore not a divergence, and it *unblocks*
  `claude/reminder-dry-run-evidence`: an identical add on both sides merges
  without conflict, which the untracked copy previously prevented.
- `docs/outreach/PDF-REPORT-VERIFICATION-2026-07-27.md` also exists on
  `codex/production-report-redesign`, but the two differ (working tree
  `9ccd690`, branch `f70f522`). Since that 111-file branch is marked
  do-not-integrate by Codex's own review at `67b646a`, the working-tree copy
  was genuinely unbacked and is committed here.

Files another agent must not overwrite: none introduced by this task.

## Changes

### `b349c17` — ignore agent tooling and generated local artefacts

Dirty `main` carried 474 untracked files and roughly 40 MB, which made
`git status` unreadable and put genuinely unbacked evidence one careless
`git clean -fd` away from deletion.

Ignored: `/.claude/`, `/.agents/skills/`, `/tmp/`, `/output/`,
`/.playwright-cli/`, and the heavy generated media under `videos/`
(`renders/`, `capture/`, `snapshots/`, `voice-auditions/`, `.waveform-cache/`,
`.thumbnails/`, and `*.wav`/`*.aiff`/`*.mp4`/`*.mov`).

Two deliberate exclusions from the ignore list, both narrower than the six
blanket directory lines originally proposed on 29 July:

- **`.agents/product-marketing.md` is tracked, not ignored.** It is authored
  positioning copy, and the launch gate's Public-message consistency row cites
  it as evidence ("the stale retired one-liner ... removed from
  `.agents/product-marketing.md`"). Ignoring `.agents/` wholesale would have
  made cited evidence permanently invisible. `.claude/skills/` is a directory
  of symlinks into `.agents/skills/`, so both point at the same vendored
  library and neither belongs in history.
- **`videos/` is not ignored wholesale.** Only its generated media is. The
  authored source (`STORYBOARD.md`, `SCRIPT.md`, `DESIGN.md`,
  `compositions/*.html`, `*.json`, `index.html`) stays visible as untracked, so
  it registers as an open decision rather than being silently ignored forever.
  It is **not** committed by this task — that was outside the approved scope.

Untracked file count fell from 474 to 22.

### `f77a1b5` — back up launch-gate evidence and compliance record

The committed `LAUNCH-GATE.md` still showed most rows as
`owner action required`. The 33-of-34-verified record existed only as an
uncommitted working-tree modification, as did the owner's `approved with
controls` sign-off in `LIA.md`. Six evidence documents existed on **no ref at
all**, and a seventh existed only in a differing copy on a rejected branch.

Committed unaltered: `LAUNCH-GATE.md`, `LIA.md`,
`SEED-BATCH-EVIDENCE.md`, `AUTH-VERIFICATION-2026-07-27.md`,
`DAILY-PAUSE-CONTROLS-REHEARSAL-2026-07-27.md`, `FOUNDER-SCRIPT.md`,
`PDF-REPORT-VERIFICATION-2026-07-27.md`, `REMINDER-DRY-RUN-2026-07-28.md`,
`.agents/product-marketing.md`.

### `a9e8eaf` — architecture notes and agent tooling state

`CLAUDE.md` (architecture section), `TASTESKILL-REDESIGN-HANDOFF.md`,
`skills-lock.json`.

## Verification

Run from the main worktree with Node 20.20.2 (the desktop shell exposes no
`npm`, and the Homebrew Node 25 build has a broken `llhttp` dylib link).

```text
npm run test:run  -> 24 test files passed; 217 tests passed
npm run lint      -> exit 0, no output
npx tsc --noEmit  -> exit 0
```

217/217 matches the baseline Codex recorded on `codex/pdf-production-gate`
exactly, so nothing regressed.

Ignore-rule safety, which is the one way a `.gitignore` edit can destroy work:

```text
git ls-files -i -c --exclude-standard  -> 3 files
same command against the COMMITTED .gitignore -> 3 files
```

Identical counts prove these rules newly ignored **zero** tracked files. The
three (`.superpowers/sdd/2026-07-25-brightcert-outreach/task-3*.md`) are a
pre-existing inconsistency created by the older `/.superpowers/` rule; they
were left alone as owner work.

Secret and PII scan across every file committed here, plus the staged diffs of
the three modified tracked files:

```text
sk_live | sk_test | whsec_ | re_<key> | AIza | -----BEGIN | service_role
  | eyJ<jwt> | api_key=<...>     -> no match
email addresses                  -> no match
```

The single grep hit was the literal prose string `sk_test_...` inside a
`LAUNCH-GATE.md` narrative sentence, not a credential.

`git diff --cached --check` reports a trailing blank line at EOF in
`AUTH-VERIFICATION-2026-07-27.md`,
`DAILY-PAUSE-CONTROLS-REHEARSAL-2026-07-27.md` and `FOUNDER-SCRIPT.md`. These
were **not** corrected. `AGENTS.md` forbids reformatting owner work, and these
are the exact files the launch gate cites, so they are committed byte-exact.

No build was run. No runtime source file changed; `.gitignore` is not read by
`next build`.

## External state

- **Database writes:** None
- **Deployment:** None
- **Emails/messages:** None
- **Payments:** None
- **Other external actions:** **None — the branch is NOT pushed.**
  `git push -u origin claude/evidence-backup` was blocked by the environment's
  permission classifier. The three commits exist only in the local repository,
  which means the evidence this task set out to protect is still not backed up
  off this machine. Pushing is the first thing the owner should authorise.

## Remaining risks or blockers

- **`FOUNDER-SCRIPT.md` quotes £99/`FOUNDING10` three times with no cap
  disclosure, and `.agents/product-marketing.md` once.** The Stripe coupon
  `ZXdXak08` carries `max_redemptions: 10`. The 29 July cap-disclosure guard in
  `src/lib/offer-contract.test.ts` does not reach either file: it scans only
  `src/app`, `public/`, `src/lib/resend/emails.ts` and `README.md`. The suite
  passing above is therefore **not** evidence that these two files comply —
  they were never scanned. `FOUNDER-SCRIPT.md` is the canonical *spoken*
  founder wording and its launch-gate row is marked `verified`, so this is
  customer-facing copy advertising a price that becomes unobtainable after ten
  redemptions. Deliberately not edited here: it is owner-approved,
  launch-gate-verified copy and changing it was outside the approved scope.
  Owner decision needed on both the wording and whether to widen the guard's
  scan to `docs/` and `.agents/`.
- Committing `LAUNCH-GATE.md` makes 33-of-34-verified the official record. The
  evidence was reviewed for secrets and PII, not re-verified on its merits.
- The authored promo-video source under `videos/brightcert-promo/` is still
  unbacked by Git. It is visible rather than ignored, awaiting an owner call.
- Local `main` remains 17 commits ahead of `origin/main` and unpushed; nothing
  from 30 July is deployed. Unchanged by this task.

## Next safe action

Owner authorises `git push -u origin claude/evidence-backup`, then fast-forwards
`main` and pushes it, putting both this backup and the 17 unpushed commits from
30 July on the remote.

Then, in order: rule on the `FOUNDER-SCRIPT.md` cap disclosure above; delete the
test-mode Stripe endpoint before the 4 August auto-disable; deploy and run the
sandbox paid/unpaid/refunded PDF retest that closes the final launch-gate row.
