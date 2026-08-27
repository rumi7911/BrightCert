# Handoff — LIA Amendment 2 draft

- **Agent:** Claude
- **Date:** 27 August 2026
- **Branch:** `claude/lia-amendment-2`
- **Worktree:** `.worktrees/lia-amendment-2`
- **Commit:** `e15fa79`
- **Base:** `main` at `b802c56`

## Why

`.outreach/utonomy-lia-2026-08-16.md` records its decision as "Pass in principle
under campaign LIA Amendment 2", and `go-no-go-2026-08-16.csv` records
`lia_assessment = pass_amendment_2`. **No Amendment 2 existed in
`docs/outreach/LIA.md`.** Verified against the committed file and its history:
the document holds Amendment 1 (WITHDRAWN) and its source table still reads
"**Not** the NCSC/IASME certificate register".

Nothing was sent on the missing authority — the Utonomy row is `candidate` with
`human_approved_at` blank.

## What was checked, not assumed

- **BlockMark's own terms** (`blockmarktech.com/terms/`) carry no prohibition on
  marketing, data research, bulk extraction or automated access — only a general
  clause against reproducing or redistributing site content. This is materially
  weaker than IASME's search-page wording and is why the proposal is arguable.
- **The organisation page is behind a human-verification challenge**, so its
  terms could not be read from the page itself and manual single-account reading
  became a written control rather than an assumption.

## What the draft does

Unsigned, not in force, with the decision row deliberately blank. It would permit
a certificate page to **corroborate** a date for a company already found through
an approved source, and explicitly keeps Amendment 1's **discovery** prohibition
intact — no browsing, searching, filtering or sorting a registry to find
companies, whoever hosts it.

## Two things the owner must resolve

1. **How Utonomy and Gemsatwork were found.** The 16 August ICP filtered for "a
   public Cyber Essentials or Cyber Essentials Plus renewal between September and
   November 2026". That filter cannot be applied to company websites, and both
   dates cite `registry.blockmarktech.com`. If the companies were found by
   searching a registry for that date range, approving this draft does not cure
   it — the defect is in discovery, not in evidencing. H.W. Coates' date came
   from the company's own accreditations page and is clean.
2. **The Utonomy row needs correcting either way.** `prospects.csv` cites the
   registry URL as `trigger_evidence_url`; control 3 of the draft would not
   permit that. Re-point it at `https://utonomy.co.uk/about-us/` and keep the
   registry URL as corroboration inside the account assessment.

## Also done this session

Recorded the Cobleys `delivered` event (step 1) from the owner's report, via
`npx tsx scripts/outreach.ts event`. As with the `sent` event, `occurred_at` is
the reconciliation time rather than the provider's delivery timestamp.

Cadence note: SME touches are business days 1, 6, 12. Counting from Mon 17 Aug,
**Touch 2 was due Mon 24 Aug and did not go**; Touch 3 falls Tue 1 Sep.

## Verification

`npx vitest run src/lib/outreach` — 171 passed, 7 files. Docs-only change
otherwise; no code touched.

## Next safe action

Owner answers the discovery question, then either signs Amendment 2 and corrects
the Utonomy row, or rejects it and re-sources Utonomy from its own site. No send
until one of those happens.
