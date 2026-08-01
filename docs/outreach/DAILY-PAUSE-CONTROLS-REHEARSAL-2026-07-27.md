# Daily pause-control rehearsal — 27 July 2026

> **VERIFIED — TABLETOP REHEARSAL COMPLETE**

This pre-T0 rehearsal tests the founder-operated volume, stop, pause and
resumption decisions in [SOP.md](./SOP.md) and
[30-DAY-CALENDAR.md](./30-DAY-CALENDAR.md). It did not send an email, create a
prospect record, use personal data, or change a provider setting.

## Authority and scope

| Record | Value |
|---|---|
| Campaign | `founding_pilot_2026` |
| Owner/operator | Muhammad Sohaib Roomi |
| Pause/resume authority | Muhammad Sohaib Roomi |
| Rehearsal reviewer | Codex |
| Owner instruction | “Go with daily pause-control rehearsal.” |
| Date | 27 July 2026 |
| Live messages sent | 0 |

The owner had already accepted the founder, outreach-operator, technical-owner
and pause/resume roles. The rehearsal applies the approved rules:

- start at 10–15 total prospect messages per business day;
- count Touch 1 and every follow-up together;
- never exceed 20 total messages/day before the healthy
  50-distinct-Touch-1 checkpoint;
- a healthy 50-prospect checkpoint does not raise the cap by itself;
- only recorded owner approval may raise the cap to 30 total messages/day;
- pause when message hard bounces exceed 3%, any spam complaint occurs, any
  provider/inbox/DNS/domain-reputation warning appears, an opt-out is not
  processed the same day, or a send/control bypass is suspected; and
- the provider's technical ceiling never replaces these operating limits.

## Scenario results

`BLOCK EXCESS` means the excess message is deferred before sending. `PAUSE`
means all campaign sending stops immediately and the incident process starts.

| ID | Scenario | Calculation or signal | Expected and observed decision | Result |
|---|---|---|---|---|
| R1 | Normal start day | 9 Touch 1 + 4 follow-ups = 13 total; 0/13 hard bounces | Continue; 13 is inside the 10–15 start range and below the cap | Pass |
| R2 | Planned pre-50 cap excess | 14 Touch 1 + 7 follow-ups = 21 total; fewer than 50 healthy Touch 1 prospects | Block and defer at least 1 before sending; cap remains 20 | Pass |
| R3 | Actual pre-50 cap bypass | 21 messages were sent where the cap was 20 | Pause for a suspected send/control bypass | Pass |
| R4 | Bounce rate below the stated threshold | 1/40 messages = 2.5%; no other warning | No automatic threshold pause; continue only while other controls remain healthy | Pass |
| R5 | Bounce rate above the stated threshold | 1/20 messages = 5% | Pause immediately | Pass |
| R6 | Spam complaint | One complaint; bounce rate irrelevant | Pause immediately | Pass |
| R7 | Provider/domain warning | One warning; bounce rate irrelevant | Pause immediately | Pass |
| R8 | Opt-out missed on the day received | Same-day suppression/control failed | Pause immediately and suppress before any resumption | Pass |
| R9 | Healthy 50-prospect checkpoint without owner uplift | 16 Touch 1 + 5 follow-ups = 21; no recorded approval for 30 | Block and defer at least 1; cap remains 20 | Pass |
| R10 | Healthy 50-prospect checkpoint with recorded owner uplift | 20 Touch 1 + 10 follow-ups = 30 | Continue at no more than 30 while all safety evidence remains healthy | Pass |

Every reply, objection, bounce, opt-out, conversion, loss or closure also stops
later touches for that prospect. A failure to apply that stop is a suspected
control bypass and pauses the campaign.

## Paused-state response rehearsal

For R3, R5, R6, R7 and R8, the required response was rehearsed in this order:

1. stop drafts, queues, scheduled work and manual sends;
2. preserve minimal non-PII evidence and the affected prospect/message IDs;
3. suppress any objection, opt-out or bounce immediately;
4. notify the owner and technical/privacy reviewer;
5. identify the affected batch, cause, scope and corrective control;
6. rerun the relevant queue, copy, DNS/provider, suppression or data checks;
   and
7. resume only after healthy corrective evidence and an explicit, recorded
   decision by Muhammad Sohaib Roomi.

No poor result may be averaged into a larger healthy batch, and no provider
ceiling authorises continued sending.

## Decision

| Sign-off | Value |
|---|---|
| Result | Verified; 10/10 scenarios produced the documented decision |
| Owner/operator and pause authority | Muhammad Sohaib Roomi |
| Evidence reviewer | Codex |
| Decision date | 27 July 2026 |
| Restrictions | No live send occurred; this rehearsal does not itself authorise T0 while other launch-gate rows remain open |

