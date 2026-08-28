# Agent task handoff

- **Agent:** Claude Code
- **Date/time (BST):** 2026-08-28 22:50
- **Task:** Resolve how the August prospects were sourced; make discovery method an ICP gate
- **Branch:** `claude/lia-amendment-2`
- **Worktree:** `.worktrees/lia-amendment-2`
- **Base commit:** `b802c56`
- **Final commit:** the commit containing this handoff
- **Status:** Complete — **and it supersedes
  `2026-08-27-2035-claude-lia-amendment-2.md`, which is wrong**

## The headline finding: an approved LIA amendment is stranded on an unmerged branch

Yesterday's handoff, and the draft it described, rest on the claim that **no LIA
Amendment 2 existed**. That claim is false.

**Amendment 2 exists and the owner approved it with controls on 16 August 2026.**
It is commit `200439b`, "docs: approve narrow BlockMark outreach source", on
branch `codex/contracts-finder-review`. That branch has never been merged into
`main`, so the approved amendment is invisible to anyone reading `main` —
including me, yesterday, when I concluded it had never been written.

The Utonomy record that cites "campaign LIA Amendment 2" was correct all along.

### This is not an isolated file

`codex/contracts-finder-review` is **25 commits ahead of `main` and entirely
documentation**: the LIA amendment, a new Source D in the research method, 17
outreach handoffs covering 8–16 August, `PROJECT-STATUS.md`, and four social
briefs. It is the complete record of the August outreach campaign.

That is very likely why every session since has had to reconstruct the outreach
state from `.outreach/` and got it wrong — including a memory note claiming
"0 send-ready rows, outreach deprioritised" when six verified mailboxes and a
delivered first touch existed.

**Recommended next action for the owner: review and merge
`codex/contracts-finder-review`.** It is doc-only, so the risk is low and the
cost of leaving it unmerged is demonstrated. I have not merged it — merges are
owner decisions.

## Scope and ownership

- **Files intentionally changed:**
  - `docs/outreach/ICP.md` — new section, "How a candidate was found is itself a gate"
  - `docs/outreach/TRIGGER-RESEARCH-METHOD.md` — new section, "Sourcing audit, 28 August 2026"
  - this handoff
- **Files reverted on this branch:** `docs/outreach/LIA.md`. My Amendment 2
  draft (`e15fa79`) was written on the false premise above and is reverted in
  `90eecb6`. **Do not resurrect it.** The real amendment is `200439b`.
- **Files inspected but not changed:** `docs/outreach/EMAIL-SEQUENCES.md`,
  `docs/outreach/LAUNCH-GATE.md`, `src/lib/outreach/gate.ts`,
  `src/lib/outreach/cli.ts`
- **Overlapping work discovered:** `codex/contracts-finder-review` changes
  `docs/outreach/LIA.md` and `docs/outreach/TRIGGER-RESEARCH-METHOD.md`. My
  method-doc section appends at the end of the file; Codex's Source D inserts
  mid-file, so a merge should be clean. **`LIA.md` is now untouched on this
  branch specifically to avoid a conflict with the real amendment.**
- **Files another agent must not overwrite:** none.

## The audit itself

`.outreach/research-2026-08-09.csv` records a `source` per row. Across 50 rows:

| `source` family | Rows | Reading |
|---|---:|---|
| `first_party_*`, five variants | 47 | Source C, working as designed |
| `public_assurance`, `third_party_ce_plus` | 2 | Neither is a registry |
| `public_digital_certificate_plus_first_party_assurance` | 1 | Utonomy — evidence, not discovery |
| `public_digital_certificate_discovery` | 1 | Gemsatwork — discovery route |

**One row in fifty.** Gemsatwork was found via the registry, has no first-party
citation, and therefore fails Source D's condition that the company's own site
independently confirm the certification. It was already on `hold` with "obtain a
company-published certification reference" as its recorded next action — which
is that exact condition. The gate worked. Nothing was sent and it never entered
the canonical ledger.

**The cause was the ICP wording, not any individual decision.**
`.outreach/remaining-cohort-progress-2026-08-16.md` targets companies with a
renewal "between September and November 2026". Almost nobody publishes an expiry
date on their own site, so that filter can only be satisfied by searching a
registry, and no registry is approved for searching. The same file's next-action
list says to continue company-hosted discovery "to avoid dependence on
registry-only signals", so the pull was felt at the time.

`ICP.md` now makes discovery method a gate that fails independently of trigger
strength, and rules out date-range targeting.

## Changes I made and then reversed

I changed operational records on the false premise and **reverted all of them**
once `200439b` came to light. Recorded here so the reversals are not mistaken
for drift:

| Record | Changed to | Reverted to |
|---|---|---|
| `prospects.csv` `sme-utonomy-001.lia_status` | `pending` | `approved` |
| `prospects.csv` `sme-utonomy-001.trigger_evidence_url` | the company's own page | the BlockMark certificate page |
| `prospects.csv` `sme-utonomy-001.personalisation_note` | rewritten | 16 August text |
| `suppressions.csv` | added company `09786861` | removed |

The Utonomy row's original values are what Amendment 2 actually permits: the
certificate page **is** the approved evidence of the renewal date. The gate
returns `blocked` on `human_approval_missing` alone, which is the intended
control.

Gemsatwork is left on `hold` where it already was. Suppression is
semi-permanent, I proposed it on bad information, and the row cannot be sent to
either way. **Whether to suppress it outright is an owner decision, not mine.**

`.outreach/utonomy-lia-2026-08-16.md` carries a "Verification note, 28 August
2026" recording that the file was right and the repository was inconsistent.

## Verification

```text
git fetch --all --prune; git status --short --branch
main = origin/main = b802c56, clean apart from untracked videos/

WebFetch https://cobleys.co.uk/cyber-essentials/
certificate live; certification 2025-10-15, recertification due 2026-10-15,
profile version 3.2 (Willow), whole-organisation scope

npx tsx scripts/outreach.ts validate --input .outreach/prospects.csv --output <scratch>
sme-cobleys-001  gate=eligible
sme-utonomy-001  gate=blocked  human_approval_missing

npx vitest run src/lib/outreach/
7 files passed, 171 tests passed

git diff --name-only main...codex/contracts-finder-review
23 files, all documentation; includes docs/outreach/LIA.md
```

Node 20 was used throughout (`/opt/homebrew/Cellar/node@20/20.20.2/bin`); Node
26 breaks jsdom `localStorage` in the wider suite.

Docs-only change, so no lint, type-check or build was run for the changed
surface. The outreach suite was run because `.outreach/` data changed under it.

## External state

- **Database writes:** none
- **Deployment:** none
- **Emails/messages:** none sent. A **Touch 2 draft for Cobleys** is at
  `.outreach/cobleys-touch2-2026-08-28.md`, awaiting owner review. Two copy
  options; option A is approved copy with variables filled only.
- **Payments:** none
- **Other:** `.outreach/` files edited and reverted as tabled above; all at mode
  600 and gitignored. `marketing/linkedin-operational-facts-track.md` (outside
  this repo) had its post slots corrected: D → Fri 28 Aug, B → Wed 2 Sep,
  C → Fri 4 Sep.

## Risks and next safe actions

1. **Merge `codex/contracts-finder-review`.** The stranded approved amendment is
   the root cause of a fortnight of reconstructed and incorrect outreach state.
2. **Cobleys Touch 2** is drafted and gate-eligible. Business-day arithmetic:
   Mon 31 Aug is the summer bank holiday, so Touch 3 should move to **Tue 8
   September**, not Tue 1 September.
3. **`docs/outreach/EMAIL-SEQUENCES.md` Touch 3 is self-contradictory.** The
   template quotes £99 as "the existing £100 FOUNDING10 discount from £199" but
   omits the first-10-customers cap that the file's own pre-send checklist
   requires in the same breath. Touch 3 is the first touch that quotes a price.
   **Fix before 8 September.**
4. **Utonomy** is unblocked by owner approval of exact copy, nothing else.
   Timing decays 7 October 2026.
5. **Gemsatwork** — owner to decide suppress vs. leave on hold.
