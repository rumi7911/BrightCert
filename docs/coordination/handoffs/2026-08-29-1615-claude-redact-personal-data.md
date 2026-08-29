# Agent task handoff

- **Agent:** Claude Code
- **Date/time (BST):** 29 August 2026, 16:15 BST
- **Task:** Remove a prospect contact's name and work email address from the
  tracked repository, which is public.
- **Branch:** `claude/redact-personal-data`
- **Worktree:** `.worktrees/redact-personal-data`
- **Base commit:** `0ab0d06`
- **Status:** Working tree is clean of the values. Git history is not.

## What was found

An audit of tracked files for prospect identifiers returned 125 matching lines
across 17 files. Almost all are company names, which already appear widely on
`main` including in owner-authored documents. Two findings were different in
kind:

1. A named individual's verified work email address, in plain text, in
   `2026-08-16-2141-codex-remaining-cohort-batch.md`.
2. That person's full name and their Companies House director record, in the
   same file, in `2026-08-16-2252-codex-utonomy-first-touches.md`, and in
   `LIA.md`.

`github.com/rumi7911/BrightCert` has been **public since 27 June 2026**. The
branch carrying these files was pushed on 16 August, so the address was
publicly readable for thirteen days before this audit.

No other real address is in the tracked tree. Everything else the scan returned
is a `.test` fixture, a `you@yourcompany.co.uk` placeholder, or a vendor
`LICENSE` copyright line.

## What changed

| File | Change |
|---|---|
| `handoffs/2026-08-16-2141-...` | Name and mailbox replaced with role descriptions; dated redaction note added |
| `handoffs/2026-08-16-2252-...` | Contact line replaced with the role; dated redaction note added |
| `docs/outreach/LIA.md` | CEO named by role instead; dated redaction note added to the account conclusion |
| `docs/outreach/README.md` | New failure mode 5 recording the incident and the pre-commit grep that prevents it |

The dated notes exist because the SOP forbids silently editing a verified
evidence snapshot. Every note states what was removed and that nothing else in
the record changed. No verification result, date, count or conclusion was
altered, so the records still prove what they proved.

## What is NOT fixed

**The address remains in git history and is still publicly retrievable.**
Redacting the working tree does not remove it from the commits that introduced
it, and on a public repository those are readable by anyone and may already be
in GitHub's code search index.

Removing it properly needs a history rewrite (`git filter-repo`) plus a force
push. That was put to the owner. It is disruptive: there are 41 remote branches
and every existing clone breaks.

**Recommended regardless of that decision:** treat the address as disclosed.
It is a work mailbox rather than a credential, so the practical exposure is
low, but the honest position under UK GDPR is that a third party's personal
data was published, and the decision on whether that needs any further action
belongs to the owner.

## Verification

```text
git grep -i -E 'dawson|steve\.dawson@' -- .   → no matches (exit 1)
npx vitest run src/lib/outreach               → 7 files, 171 tests, all passed
```

Docs-only change; no source file was touched.

## Next

- Owner decides on the history rewrite.
- Owner decision still open on whether prospect **company** names should also
  leave the public repository. They are in 17 tracked files including
  owner-authored `LIA.md`, and were left alone here deliberately.
