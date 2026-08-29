# Outreach

Start here. This directory holds twenty-five documents and roughly four
thousand lines governing a campaign with a handful of live rows, which is
enough volume to mislead anyone reading it cold. Eight files carry the
decisions; the rest are dated evidence you revisit only if something is
challenged.

**Never restate campaign state from prose in this directory.** Read the live
state from `.outreach/` and confirm it by running the gate. The prose ages; the
ledger and the gate do not. See "Failure modes this directory has already
caused" at the end.

## The five gates

Every prospect passes these in order. Each one can end a row on its own, and
they are ordered cheapest-disqualifier-first, so the expensive work of finding
a named human happens only on rows that already survived everything else.

| # | Gate | Decides | Passed by |
|---|---|---|---|
| 1 | Find | Was this company allowed to be discovered this way? | Approved source only |
| 2 | Qualify | Right kind of company, with an evidenced reason to write now? | ICP plus a linkable trigger |
| 3 | Verify | Is the record complete and safe to send? | The machine gate |
| 4 | Approve | Do we accept this exact copy to this exact person? | The owner, and only the owner |
| 5 | Send, then record | — | The owner sends; the event is logged |

### Gate 1 — Find

This gate is about the **search**, not the company. A business that fits
perfectly but was reached by a forbidden route is still ineligible, and no
later gate will catch it. Gate 1 and gate 2 fail independently: trigger
strength rates the evidence and says nothing about how the candidate surfaced.

Approved sources are defined in [TRIGGER-RESEARCH-METHOD.md](./TRIGGER-RESEARCH-METHOD.md)
and authorised in [LIA.md](./LIA.md):

- **Source A — withdrawn. Do not use.** The IASME certificate register. Its own
  terms forbid marketing and data research.
- **Source B** — Contracts Finder.
- **Source C** — the company's own published assurance material. First-party
  routes carried **46 of the first 50** researched rows, across five `source`
  variants, so this is the route to prefer. Counted from the private research
  ledger. The 28 August handoff still records 47, which does not add up against
  50 rows; the audit table in `TRIGGER-RESEARCH-METHOD.md` was corrected to 46
  on 29 August.
- **Source D** — a public BlockMark certificate page, eligible **only** where
  the company's own current website independently confirms the certification.
  Approved with controls by the owner on 16 August 2026 as LIA Amendment 2.
  It is an evidence route, never a discovery list.

Two rules that are easy to violate by accident:

- **A renewal window is not a search filter.** Expressing a target set as
  "renewals between month X and month Y" can only be satisfied by searching a
  register, so the filter is itself the violation. Never start from the date.
- **Record the discovery method for every row** in the `source` column of the
  research ledger, at the moment of research. Name the method, not the
  artefact. On 28 August 2026 that column was the only thing able to
  distinguish a company found from its own website from one found by searching
  a register, months after anyone could recall the difference.

Never frame an expiry date as evidence that certification has lapsed or that a
renewal has not started.

Both rules are written up in full in `ICP.md`, under "How a candidate was found
is itself a gate", and the audit that produced them is the dated sourcing audit
at the end of `TRIGGER-RESEARCH-METHOD.md`. Both landed on `main` on 29 August
2026.

### Gate 2 — Qualify

Profile and trigger, tested separately. See [ICP.md](./ICP.md). A row whose
only certification evidence is a registry page, with no first-party claim on
the company's own site, fails the approved conditions — hold it, do not send.

### Gate 3 — Verify

The only fully automated gate, and the one to trust. It applies more than forty
named block reasons per row, covering mailbox verification, role, free-mail and
disposable addresses, email/domain mismatch, company status and number,
duplicates, suppression state, sequence transitions and personalisation.

```sh
npx tsx scripts/outreach.ts validate \
  --input .outreach/prospects.csv \
  --output <scratch-file>
```

Every row returns `eligible`, or `blocked` with named reasons. The flags are
`--input` and `--output`; there is no `--prospects`. Logic lives in
`src/lib/outreach/gate.ts`, CLI in `src/lib/outreach/cli.ts`.

Two behaviours worth knowing before you act on a result:

- A `scope: "company"` suppression matches on **`company_number`**, not company
  name. Passing a name silently fails to match.
- `blocked` on `human_approval_missing` alone is the intended control working,
  not a defect in the row.

### Gate 4 — Approve

The gate no machine can pass. Approval is the `human_approved_at` timestamp on
the record, and it must reflect a real review. The pre-send checklist in
[EMAIL-SEQUENCES.md](./EMAIL-SEQUENCES.md) is the authority on copy. Non-negotiables:

- Never claim certification, a guaranteed pass, completed remediation in around
  two hours, artificial scarcity, or an unverified customer count.
- If £99 appears, it must state that the `FOUNDING10` code is limited to the
  first 10 customers, in the same breath. That cap is a real Stripe limit, and
  quoting the price without it advertises a price the recipient may not be able
  to obtain. Quoting £199 avoids the trap entirely.
- Never mention Monitor, CE Plus Pack or MSP Partner. No working checkout
  exists for them.
- Exactly one reply CTA, plus the privacy and objection wording.

### Gate 5 — Send, then record

The owner sends manually. Cadence is business days 1, 6 and 12 for SMEs, and 1,
7 and 14 for MSPs. Touches 2 and 3 reply in the original thread with no new
subject. Stop after Touch 3; there is no break-up email. Never compress a
cadence to hit a volume target.

Volume, from [SOP.md](./SOP.md): 10–15 messages per business day to start, never
above 20 until 50 distinct first touches show healthy delivery, and only then
may the owner authorise up to 30. Follow-ups count toward the cap and take
priority over new first touches.

Stop sending immediately on any reply or objection, hard bounces above 3% of
the batch, any spam complaint, any provider, inbox, DNS or domain-reputation
warning, an opt-out not processed the same day, or any suspected bypass, wrong
recipient, misleading claim or data exposure.

**Record the event after every send.** An unrecorded send is the specific
failure that has repeatedly made this campaign appear never to have started.

## Which document answers which question

| If you are asking | Read | Gate |
|---|---|---|
| Am I allowed to use this source? | [LIA.md](./LIA.md) | 1 |
| How do I find and evidence a trigger? | [TRIGGER-RESEARCH-METHOD.md](./TRIGGER-RESEARCH-METHOD.md) | 1–2 |
| Is this the right kind of company? | [ICP.md](./ICP.md) | 2 |
| Why is this row blocked? | `src/lib/outreach/gate.ts` | 3 |
| What exactly do I send, and when? | [EMAIL-SEQUENCES.md](./EMAIL-SEQUENCES.md) | 4–5 |
| How many a day, and when do I stop? | [SOP.md](./SOP.md) | 5 |
| What do I say on a call? | [FOUNDER-SCRIPT.md](./FOUNDER-SCRIPT.md) | — |
| What is the live state right now? | `.outreach/`, then run the gate | all |
| How do I set up keys and stores? | [operator-runbook.md](./operator-runbook.md) | — |

Everything else here is dated evidence: launch-gate rows, PDF and auth
verifications, seed-batch records, retention analysis, the calendar and
scorecard. Useful as proof, not as current state.

## Private state never enters this repository

`.outreach/` and `outreach/runs/` are gitignored and held at mode 600. Read
them for state. **Never copy a company name, contact name or mailbox into a
file in this repository, a commit message, or anything outward-facing**,
including shared pages and artifacts. Handoffs describe rows by prospect ID or
by role, never by company.

## Failure modes this directory has already caused

Recorded so they are not repeated. Each one cost real work.

1. **Concluding something does not exist because `main` does not have it.** An
   owner-approved LIA amendment sat on an unmerged branch for twelve days. A
   session read `main`, found no amendment, concluded none existed, drafted a
   replacement, and altered operational records on that premise. All of it was
   reverted. **Check unmerged branches** — `git log --oneline main..<branch>`
   across `codex/*` and `claude/*` — before concluding any authority is missing.
2. **Repeating stale status prose as current.** `PROJECT-STATUS.md` carried
   "there are currently zero send-ready rows", true on 8 August 2026 and false
   afterwards. Carried forward, it led sessions to describe a campaign with a
   delivered first touch as never having started. Prose in a snapshot is dated
   by definition; the ledger and the gate are not.
3. **Targeting a renewal date range.** The wording asked for renewals inside a
   month window, which is only satisfiable by searching a register. One row in
   fifty was sourced that way. The gate held and nothing was sent, but the ICP
   wording was the cause, not any individual decision.
4. **Suppressing by company name.** `scope: "company"` matches on
   `company_number`. A suppression written with a name normalises to something
   that never matches.

Repository facts outrank status prose, including this file. If this README
disagrees with `LIA.md`, the gate, or `.outreach/`, they win and this file is
wrong.
