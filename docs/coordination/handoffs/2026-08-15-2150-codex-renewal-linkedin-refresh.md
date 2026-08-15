# Agent task handoff

- **Agent:** Codex
- **Date/time (BST):** 15 August 2026, 21:50 BST
- **Task:** Refresh the founder-review LinkedIn content so it supports the
  newly verified renewal-stage direct-SME cohort.
- **Branch:** `codex/contracts-finder-review`
- **Worktree:** `.worktrees/contracts-finder-review`
- **Base commit:** `b0569ea`
- **Final commit:** The commit containing this handoff.
- **Status:** Draft complete; founder approval and publication remain blocked

## Scope and ownership

- Files intentionally changed:
  `docs/social/briefs/2026-07-30-readiness-before-certification.md` and this
  handoff.
- No email, LinkedIn message, connection request, comment, scheduling action or
  publication occurred.
- No active branch or handoff overlaps the refreshed brief.

## Changes

- Replaced the generic preparation-versus-certification post with a renewal-led
  founder post aimed at UK SME owners and operations leaders.
- Added the official rule that suppliers must recertify every 12 months to
  maintain a valid certificate.
- Introduced a clearly labelled practical recommendation to start the readiness
  review 30 to 60 days before renewal.
- Kept the honest scope language: BrightCert prepares organisations but does
  not issue certification or guarantee a pass.
- Retained one CTA, the existing UTM-tagged first-comment link, UK English,
  founder voice, four hashtags and `Status: Founder review`.

The social-content workflow influenced the edit by keeping the post standalone,
using a direct first-line hook, short declarative lines and one conversion
action. The integrated-sprint rule remains intact: the post supports the same
accounts but never names them or claims they viewed it.

## Verification

```text
official source recheck
GOV.UK PPN 014: HTTP 200
NCSC Cyber Essentials overview: HTTP 200
BrightCert pricing: HTTP 200

claim review
12-month recertification statement supported by GOV.UK PPN 014
30-to-60-day timing presented as the founder's practical rule, not official law

copy review
one CTA; no em dash; UK English; readiness disclaimer present;
status remains Founder review

git diff --check
passed before commit
```

No application tests, lint, type-check or build are required because the task
changes a non-published content brief and its handoff only.

## External state

- Database writes: None.
- Deployment: None.
- Emails/messages: None.
- LinkedIn publication, scheduling or engagement: None.
- Payments: None.

## Remaining risks or blockers

- The owner/founder has not approved the revised copy or chosen a publication
  time.
- Publication must remain manual and follow the integrated sprint's relative
  schedule.
- Aggregate LinkedIn metrics cannot prove that any named account saw the post.

## Next safe action

Owner reviews the refreshed post alongside the final account go/no-go table.
After contact validation and explicit owner approval, set T0 and manually
publish the post at T+5 or revise the relative schedule to place the renewal
education before the first renewal-target outreach. Do not publish or send
without that approval.
