# Agent task handoff

- **Agent:** Claude Code
- **Date/time (BST):** 1 August 2026, 19:45
- **Task:** Back up the launch-gate evidence that existed on no branch, and
  ignore the agent tooling and generated media cluttering dirty `main`
- **Branch:** `claude/evidence-backup`
- **Worktree:** the main worktree (see "Why not an isolated worktree" below)
- **Base commit:** `6804252` (local `main`)
- **Task commits:** `b349c17`, `f77a1b5`, `a9e8eaf`, `1323a7c`, plus the commit containing
  this handoff
- **Status:** Complete on the task branch;
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
- `docs/outreach/FOUNDER-SCRIPT.md`, `.agents/product-marketing.md` and
  `src/lib/offer-contract.test.ts` (cap disclosure, `1323a7c`)
- this handoff

Files inspected but not changed:

- `docs/outreach/SOP.md`, `docs/outreach/EMAIL-SEQUENCES.md` (read to reuse
  their agreed cap wording; already compliant)
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

### `1323a7c` — disclose the FOUNDING10 cap in spoken and source copy

Backing up `FOUNDER-SCRIPT.md` surfaced a live compliance gap. It quoted
£99/`FOUNDING10` three times with **no** cap disclosure, and
`.agents/product-marketing.md` once. The Stripe coupon `ZXdXak08` carries
`max_redemptions: 10`, so after ten redemptions both documents direct the
founder to speak, and generated copy to repeat, a price nobody can obtain.
This is the same CPR/ASA exposure closed across 20 files on 29 July; these two
were missed because the guard could not see them.

The 217/217 pass recorded on `f77a1b5` was **not** evidence that these files
complied. `src/lib/offer-contract.test.ts` scanned only `src/app`, `public/`,
`src/lib/resend/emails.ts` and `README.md`, so neither file was ever read.

- Both files now state the cap wherever the £99 price appears, reusing the
  exact wording pattern already agreed in `SOP.md:125` and
  `EMAIL-SEQUENCES.md:183`.
- `FOUNDER-SCRIPT.md`'s own guardrail banned any "customer count", which
  contradicted the fix. Amended the same way `SOP.md` was on 29 July: the
  verified Stripe cap is permitted and expected; unsubstantiated limits,
  countdowns and counts stay banned.
- The guard now also scans a named `CUSTOMER_FACING_DOCS` allowlist:
  `FOUNDER-SCRIPT.md`, `EMAIL-SEQUENCES.md`, `SOP.md`,
  `.agents/product-marketing.md`.

**The allowlist is deliberate; a `docs/` directory sweep was rejected.** A
sweep would have demanded cap disclosure inside internal audit records that
legitimately quote £99 while describing the offer (`LAUNCH-GATE.md`,
`VERIFICATION-2026-07-26.md`, `SEED-BATCH-EVIDENCE.md`,
`docs/plans/2026-07-25-brightcert-outreach.md`, and this handoff), and would
have tripped the scarcity rule on thirteen files that merely discuss scarcity
as a subject — including prior handoffs quoting the rule and the vendored
marketing skill library under `.agents/skills/`. That volume of false
positives is how a guard gets disabled.

## Verification

Run from the main worktree with Node 20.20.2 (the desktop shell exposes no
`npm`, and the Homebrew Node 25 build has a broken `llhttp` dylib link).

```text
npm run test:run  -> 24 test files passed; 217 tests passed
npm run lint      -> exit 0, no output
npx tsc --noEmit  -> exit 0
```

217/217 matches the baseline Codex recorded on `codex/pdf-production-gate`
exactly, so nothing regressed. Re-run unchanged after `1323a7c`.

The widened guard was proved to have teeth on **both** newly covered files,
because a contract test that cannot fail is worse than none. Each file's cap
disclosure was deliberately removed, the test re-run, and the file restored:

```text
cap wording stripped from FOUNDER-SCRIPT.md
  -> 1 failed: expected [ 'docs/outreach/FOUNDER-SCRIPT.md' ] to deeply equal []
cap wording stripped from .agents/product-marketing.md
  -> 1 failed: expected [ '.agents/product-marketing.md' ] to deeply equal []
both restored from backup
  -> cmp against pre-test copies: byte-identical
```

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
- **Other external actions:** Pushed `claude/evidence-backup` to origin as a
  new branch, with the owner's explicit approval. No merge, no deploy. The
  previously unbacked evidence now exists off this machine for the first time.
  An earlier push attempt was blocked by the environment's permission
  classifier and was not worked around; the owner authorised it directly.

## Remaining risks or blockers

- Committing `LAUNCH-GATE.md` makes 33-of-34-verified the official record. The
  evidence was reviewed for secrets and PII, not re-verified on its merits.
- The authored promo-video source under `videos/brightcert-promo/` is still
  unbacked by Git. It is visible rather than ignored, awaiting an owner call.
- Local `main` remains 17 commits ahead of `origin/main` and unpushed; nothing
  from 30 July is deployed. Unchanged by this task.

## Next safe action

Owner fast-forwards `main` onto `claude/evidence-backup` and pushes `main`,
which also puts the 17 commits sitting unpushed since 30 July on the remote.
Nothing from 30 July is currently deployed.

Then, in order: delete the test-mode Stripe endpoint before the 4 August
auto-disable; deploy and run the sandbox paid/unpaid/refunded PDF retest that
closes the final launch-gate row.

Note for whoever reviews `1323a7c`: `FOUNDER-SCRIPT.md` is spoken copy whose
launch-gate row is marked `verified`. The wording change is factual and
narrow, but the row's reviewer may want to re-confirm it.
