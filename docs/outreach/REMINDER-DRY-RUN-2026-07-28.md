# Reminder provider-failure rehearsal — 28 July 2026

Closes the **Reminder dry-run** row in [LAUNCH-GATE.md](./LAUNCH-GATE.md), which
required evidence that the reminder path "surfaces provider/API failure, does not
record false success, and sends no unintended live reminder".

The earlier [VERIFICATION-2026-07-26.md](./VERIFICATION-2026-07-26.md) evidence
covered only `draft-reminders` with `dryRun=true`. The `unlock-reminders` path —
which has **no** `dryRun` mode — had never been exercised. This rehearsal covers
both, including a real provider failure against the real route and real database.

## Safety design

No email could leave the machine under any circumstance, by three independent
layers:

1. The dev server was started with `RESEND_API_KEY=re_INVALID_REHEARSAL_KEY_DO_NOT_SEND`
   overriding `.env.local`. Scenario A's observed error (`API key is invalid`)
   is itself proof the override took precedence and the real key was never used.
2. Every fixture recipient used `@brightcert-test.invalid`. `.invalid` is
   reserved by RFC 2606 and can never resolve.
3. **Blast radius was measured before creating anything.** The production query
   behind `unlock-reminders` (`status=analysed`, `submitted_at` older than 24h,
   `reminder_sent_at is null`) returned **0 real rows**, so the route could only
   ever process the disposable fixtures below. No real customer reminder state
   was reachable.

Fixtures were created solely for this rehearsal and fully deleted afterwards
(see Teardown). No pre-existing test fixture was touched.

## Scenarios

| # | Scenario | Expected | Observed | Result |
|---|---|---|---|---|
| A | `unlock-reminders`, complete valid recipient chain, provider rejects the send | Failure surfaced; `reminder_sent_at` stays `null` so tomorrow retries | `Error: API key is invalid` thrown by `throwIfResendError` (`src/lib/resend/emails.ts:15`) via `sendUnlockReminderEmail` (`emails.ts:179`), caught at `route.ts:77` and logged with stack. Read-back: `reminder_sent_at: null` | **Pass** |
| B | `unlock-reminders`, organisation with no owner profile → permanent lookup failure | Failure surfaced; `reminder_sent_at` **is** stamped, deliberately suppressing an identical retry forever | `Error: No owner profile for org …` at `route.ts:56`, logged "marking as attempted (won't retry)". Read-back: `reminder_sent_at: 2026-07-28T20:44:04.855+00:00` | **Pass** |
| — | Route response for A+B combined | Counts reflect reality, no false success | `{"processed":2,"sent":0,"failed":2}` — `sent:0` despite two processed rows | **Pass** |
| C | `draft-reminders?dryRun=true` | No send, no stamp | `{"dryRun":true,"wouldSend":0,"recipients":[]}`, HTTP 200 | **Pass** |
| D | Both routes without and with a wrong bearer token | 401 | `unlock-reminders` no-auth → 401; `draft-reminders` no-auth → 401; wrong-secret → 401 | **Pass** |

The A/B pair is the substantive result: the same route distinguishes a
*transient* provider failure (retry preserved) from a *permanent* recipient
failure (retry suppressed), and records success in neither.

`throwIfResendError` is load-bearing here — the Resend SDK returns delivery
errors in the response body rather than throwing, so without that guard a failed
send would have fallen through to the success branch and stamped
`reminder_sent_at`, silently consuming the customer's only reminder.

## Teardown

Deleted in FK-safe order (assessments → profile → organisations → auth user);
all deletes returned `204`/`200`. Confirmed by read-back:

- Both fixture assessments by ID: `[]`
- Both fixture organisations by ID: `[]`
- Fixture profile by ID: `[]`
- Any organisation matching `*Rehearsal*`: `[]`
- `unlock-reminders` due-row query: `[]` (back to the pre-rehearsal state)

## Finding — not a blocker for this gate

`draft-reminders` supports `?dryRun=true`; `unlock-reminders` does not. That
asymmetry is why this path had no prior evidence, and it means the unlock
reminder list cannot be previewed before a live run the way the draft list can.
Recommend adding the same `dryRun` flag to `unlock-reminders` for parity. The
gate's own requirements are met without it, so this is logged as an improvement
rather than an open gap.
