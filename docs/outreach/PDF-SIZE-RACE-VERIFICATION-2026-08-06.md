# Deployed-build verification: report PDF size and single-flight generation — 6 August 2026

Verifies the two changes merged as `b46e957` (`claude/pdf-size-and-race`) on the
**deployed serverless function**, not locally:

1. the report PDF collapsing from 3.86 MB to ~308 KB, and
2. concurrent generation callers producing exactly one render.

Companion to
[`PDF-DEPLOYED-VERIFICATION-2026-08-04.md`](./PDF-DEPLOYED-VERIFICATION-2026-08-04.md),
which measured the 3,860,209-byte baseline this run is compared against. Same
method, same subject assessment, so the two numbers are directly comparable.

It does not exercise the Stripe webhook chain — see
[What this run does not cover](#what-this-run-does-not-cover).

---

## Environment

| Item | Value |
|---|---|
| Commit under test | `b46e957` (merge of `claude/pdf-size-and-race`) |
| Vercel deployment | `dpl_95sCzWQSMZPQw14ie1T18RZrs6r8` (`brightcert-msexd7b0m`) |
| Deployment state | Production, Ready, 47 s build, created 6 August 2026 20:27 BST |
| Aliases | `brightcert.co.uk`, `www.brightcert.co.uk`, `brightcert.vercel.app`, `brightcert-git-main-…` |
| Stripe | **Not involved.** No checkout, no charge, no test-mode override |
| Supabase | Production |
| GCS | Production bucket, deterministic per-assessment path |
| Subject assessment | `182d5f7f-0202-40dc-ad23-7a78229724ec`, org "Sohaib" (founder-owned), score 63 |

Production Supabase held 8 assessments at the time of the run — all
founder-owned, from June and July, and **zero real customer records**. One
report row existed, for `78c383b1`, dated 30 June. That is what makes a
production write defensible here; re-establish it before repeating this.

---

## Prerequisite applied first: the unique index

`supabase/migrations/20260804000100_reports_unique_assessment.sql` was applied
to production by the owner via the Supabase SQL Editor **before** the merge,
returning `Success. No rows returned`.

This ordering is not cosmetic. Without the unique index, the claim upsert's
`on conflict (assessment_id)` has nothing to match, PostgREST rejects it with
`42P10`, and every report generation returns 500. Merging first would have
taken report generation down.

Index existence was then proven independently of the success message, by
probing PostgREST with a deliberately non-existent assessment id:

```
POST /rest/v1/reports?on_conflict=assessment_id
  → HTTP 409  {"code":"23503", … violates foreign key constraint
                "reports_assessment_id_fkey"}
```

`23503` rather than `42P10` is the proof: the planner accepted the
`on conflict` clause, which requires the unique index to exist. The foreign key
then rejected the throwaway UUID, so **no row was written**. The migration's
dedupe step deleted nothing — the three duplicate rows the 3 August retest
produced were already gone.

---

## Deploy identity

`vercel inspect` carries no git SHA, so "Ready" alone does not establish *which*
code is live. Identity was proven by byte-matching a `public/` asset that did
not exist before this merge:

| | Bytes |
|---|---:|
| `https://brightcert.co.uk/logo-mark-report.png` | 10,195 |
| Local `public/logo-mark-report.png` at `b46e957` | 10,195 |

`cmp` reports the two files identical.

---

## Part 1 — PDF size

Method: temporarily set `status` to `paid` on the subject assessment, call
`POST /api/reports/generate` with the `x-internal-secret` shared-secret caller
path, download from the returned signed URL, measure, then restore. Only
`status` was ever written; `paid_at`, `amount_paid` and `stripe_session_id`
stayed null throughout, so the row could not be mistaken for a real payment.

| Measure | 4 August (`292263a`) | 6 August (`b46e957`) |
|---|---:|---:|
| PDF size | 3,860,209 B | **308,210 B** |
| Pages | 24 | 24 |
| Page size | A4 | A4 |
| Producer | react-pdf | react-pdf |
| Generation time | 14.5 s | 12.1 s |

**12.5× smaller.** The branch predicted ~307 KB from a vitest measurement
adjusted for the known ~3.7% under-read; the deployed render landed within 1 KB
of that.

### The check that mattered more than the size

A render that failed to load the logo would produce an *even smaller* file and
look like a larger win. The PDF was therefore checked for embedded images:
**120 `/Image` byte occurrences**, so the asset is present and
`outputFileTracingIncludes` traced `public/logo-mark-report.png` into the
serverless bundle correctly.

That count is a raw byte-string scan, catching both XObject definitions and
their references in page resource dictionaries. It is **not** comparable to the
"72 image objects" figure in the 4 August analysis, which counted parsed
objects. Different method, different number; no conclusion should be drawn from
the difference between them.

---

## Part 2 — single-flight generation

The 3 August retest observed the real defect: three concurrent callers — the
Stripe webhook, the report page's fire-and-forget trigger, and the page poller
— each passed the check-then-act guard, each rendered, and each uploaded to one
deterministic GCS path.

Method: three POSTs launched as background jobs and joined with `wait`, so they
are genuinely simultaneous. Sequential calls would pass even against the old
code and would prove nothing.

| Caller | Status | Time | Body |
|---|---|---:|---|
| 1 | `202` | 2.77 s | `{"status":"generating"}` |
| 2 | `200` | 9.22 s | signed url |
| 3 | `202` | 2.38 s | `{"status":"generating"}` |

**Rows written to `reports` for this assessment: 1.**

The row count is the load-bearing evidence. Status codes record what the route
said; the row count records what it did, and one row is the direct refutation of
the 3 August three-row observation. The two losing callers returned in ~2.5 s
without reaching the renderer.

### Completed-report path

A fourth call, after generation completed, returned **HTTP 200 in 1.03 s** with
a signed URL — the `already-complete` path serving the existing object rather
than re-rendering. A ~12 s response would have indicated a re-render, meaning
every poll of the report page cost a full render and a GCS write.

---

## State restoration

Restoration ran from a shell `trap` on `EXIT INT TERM`, so it would execute even
if generation failed or timed out. Both runs were read back afterwards rather
than assumed:

```
status: analysed | paid_at: None | amount_paid: None | stripe_session_id: None
report row delete: HTTP 204
reports table now holds 1 row: 78c383b1
```

Identical to the pre-run snapshot.

---

## What this run does not cover

- **The Stripe webhook → generate chain has still never run on a deployed
  build.** This run used the internal shared-secret caller path. The last
  untested link in the paid lifecycle remains a real £199 purchase, at roughly
  £3.19 in non-refundable fees. Owner decision.
- **No real customer has ever paid**, so concurrency here was synthesised rather
  than observed under genuine production load.
- **Stale-claim takeover was not exercised.** The compare-and-swap path that
  reclaims a claim abandoned by a crashed renderer after 90 s is covered by unit
  tests only; provoking it in production would require killing a function
  mid-render.
- **GCS object count was not audited.** One report row is strong evidence of one
  upload, since the upload precedes the row write, but the bucket itself was not
  enumerated. Four orphaned objects from earlier runs remain, one (`527184e7`)
  with no matching assessment row; nothing in the codebase deletes GCS objects.
  The retention decision is still open.

---

## Commands

Both runs are preserved as scripts and were executed by the owner, since the
agent's production-write and `git push` attempts were blocked by the Claude Code
permission classifier.

```sh
zsh verify-pdf-size.sh        # Part 1
zsh verify-single-flight.sh   # Part 2
```

Pre-merge checks on `claude/pdf-size-and-race`, run before integration:

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npm run lint` | clean |
| `npm run test:run` | 35 files / 266 tests passed |
| `npm run build` (merged `main`) | clean |
