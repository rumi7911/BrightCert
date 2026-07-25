# Task 3 fix report: outreach review, reporting, and launch controls

Base commit: `08e0f0d`

## Implementation

### Sequence-step evidence and reporting

- Added `sequence_step` to file and database outreach events.
- `sent`, `delivered`, and `bounced` now require a sequence step from 1 to 3.
  Invalid values fail before an event or bounce suppression is written. Other
  event types may omit the field and may record a valid step when useful.
- The database constrains message steps, includes the step in the funnel index,
  and uses a partial unique index to permit only one event of each message
  event type per prospect/step.
- File and SQL reports now expose `sent_messages`, `touch_1_sent`,
  `delivered_messages`, `delivery_rate`, `bounced_messages`, and
  `hard_bounce_rate`.
- Message counts deduplicate by prospect plus sequence step. Two steps for one
  prospect count as two messages, while `touch_1_sent` remains the distinct
  prospect denominator for the 150 target and positive-reply conversion.
- Message rates use message counts, show `n/a` in file reports when there is no
  send denominator, and exclude legacy malformed message events without valid
  step evidence.

### Canonical queue history

- Queueing now requires a matching `imported` event for the exact prospect,
  campaign, and segment. Empty, header-only, and unrelated histories block
  with `missing_imported_event`.
- Step 2 requires a matching step 1 `sent` event, and step 3 requires a matching
  step 2 `sent` event. Missing evidence blocks with
  `missing_prior_step_sent_event` in addition to the existing sequence-state
  transition gate.
- Terminal history is matched on the same canonical dimensions and blocks
  before any Companies House verification call.

### Executable private-file lifecycle

- The runbook, SOP, Clay contract, and command examples now use one literal
  lifecycle:
  1. Clay exports to `.outreach/prospects.csv`.
  2. The operator runs pre-review validation.
  3. A human updates that same canonical file or re-exports reviewed rows to
     that exact path.
  4. The operator re-runs final validation and Companies House verification.
  5. The operator records `imported` and queues from the current verified
     snapshot.
  6. After each manual send, the operator records `sent` with the exact step,
     updates canonical `sequence_status`, and refreshes both final snapshots
     before a later touch.
- Generated validation, verification, and queue snapshots are not edited.
  Documentation states explicitly that the CLI neither sends messages nor
  mutates prospect state.

### Launch and cap consistency

- Pre-T0 work is now separate: one fictitious/no-send CLI rehearsal, exactly
  one internal/friendly seed batch capped at ten aggregate messages, and every
  live/environment/legal/owner gate.
- T0 is the first Monday after all launch-gate rows pass. No second seed batch
  occurs after T0.
- The first T0 campaign record is one real prospect processed end to end and
  counted in the 150. The operator then pauses for owner confirmation before
  continuing within that day's authorised volume.
- The SOP, calendar, scorecard, and launch gate define the escalation checkpoint
  as 50 distinct Touch 1 prospects. Every new and follow-up message counts
  toward the daily 10–15, 20, and 30 aggregate caps.
- Approved email copy, ICP, LIA framing, £99/£100/£199 prices, objection text,
  and forbidden-claim controls remain unchanged from `08e0f0d`.

## TDD evidence

1. Event step, report, queue-history, and migration regressions:
   - RED: 3 focused files ran 44 tests with 18 failures and 26 passes. Failures
     reproduced missing message-step validation, prospect-only message
     collapsing, absent Touch 1/rate columns, advisory queue history, and the
     missing SQL fields/view logic.
   - GREEN: the same focused files passed 45 tests after implementation.
2. Legacy no-step message reporting:
   - RED: the focused regression failed because a legacy `sent` row without a
     step counted as a message.
   - GREEN: malformed message events are excluded from reporting.
3. Blank CLI step validation:
   - RED: the focused CLI regression showed that an explicitly blank step on a
     non-message event was accepted.
   - GREEN: all supplied invalid step values are rejected.
4. Final focused outreach suite:
   - 5 files passed, 127 tests passed, 0 failures.

## Full verification

- Full Vitest suite: 9 files passed, 141 tests passed, 0 failures.
- ESLint: exit 0 with no warnings.
- TypeScript `npx tsc --noEmit`: exit 0.
- Production build with the existing repository-local environment loaded:
  exit 0; compilation, TypeScript, and all 30 static pages completed. The
  pre-existing multiple-lockfile/Turbopack-root warning remains.
- Installed CLI smoke using only the tracked fictitious template in a temporary
  directory:
  - validation, suppression seeding, imported event, step 1 sent event, step 1
    delivered event, and weekly report all exited 0;
  - missing `--sequence-step` failed with the required error;
  - the event CSV contained the new column;
  - the message-week report row contained one send, one Touch 1, one delivery,
    and a `100.00%` delivery rate;
  - verification without a Companies House key failed before writing output.
- Migration/secret hygiene: exact canonical header, both ignore boundaries,
  blank key scaffold, no populated tracked credential, allowed-only tracked
  email addresses, approved-only prices, event step constraint/index, and
  weekly view metrics all passed.
- Task 3 documentation audit:
  - all nine campaign-pack documents plus the canonical runbook are present;
  - 30 documented outreach commands use supported subcommands/options and
    include every required option;
  - 50 local Markdown links resolve;
  - code fences are balanced;
  - six touches, six CTA question marks, six privacy footers, and six opt-out
    footers remain;
  - the canonical lifecycle is present in the runbook, SOP, and Clay contract;
  - email copy, ICP, and LIA are byte-for-byte unchanged from `08e0f0d`.
- The BrightCert privacy page and both cited ICO guidance pages returned HTTP
  200.
- `git diff --check`: exit 0.

## External and owner gates

- The migration is invariant-tested but was not applied to a database because
  this environment has no `psql`, Supabase CLI, or Docker executable. Apply it
  through the normal reviewed Supabase migration process before optional
  operator database use.
- No live Companies House lookup was made. The installed CLI failed closed
  without a key, and the complete boundary is fixture-tested.
- The LIA remains
  `DRAFT — OWNER/LEGAL REVIEW REQUIRED BEFORE FIRST SEND`.
- Live/environment/legal/owner launch rows, the single controlled seed batch,
  and the T0 real-prospect checkpoint remain explicit operator or owner
  actions; none is reported as already passed.
- No email was sent, no live prospect/customer/payment data was accessed, and
  no production or external service was mutated.
