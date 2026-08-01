# Production authentication verification — 27 July 2026

> **VERIFIED — SIGNED-IN AND SIGNED-OUT CONTROL PATHS PASSED**

This check used the deployed application at `https://brightcert.co.uk` and a
real owner-controlled account. No email address, magic-link URL, session
cookie, assessment identifier or other account-level secret is recorded here.

## Scope

| Record | Value |
|---|---|
| Environment | Production |
| Authentication method | Emailed magic link |
| Owner/operator | Muhammad Sohaib Roomi |
| Evidence reviewer | Codex |
| Date | 27 July 2026 |
| Production data mutation | None; no assessment was started or changed |

## Results

| Check | Observed evidence | Result |
|---|---|---|
| Anonymous dashboard protection | `/dashboard` redirected to `/signup?next=%2Fdashboard` and showed the account-creation page | Pass |
| Sign-in request | `/login?next=%2Fdashboard` accepted the owner-controlled email and displayed the check-inbox state | Pass |
| Magic-link callback | After the owner completed the emailed link, the browser reached `/dashboard` | Pass |
| Signed-in dashboard | URL remained `/dashboard`, title was `Dashboard \| BrightCert`, and the authenticated workspace/dashboard content rendered | Pass |
| Signed-in protected assessment access | Direct navigation to `/assessment/new` remained on that route, title was `Start Assessment \| BrightCert`, and the `Begin Assessment` control rendered | Pass |
| Visible sign-out control | Opening the responsive navigation exposed the visible `Sign out` control; submitting it reached `/login` and rendered the clean sign-in form | Pass |
| Dashboard after sign-out | Direct navigation to `/dashboard` redirected to `/signup?next=%2Fdashboard` | Pass |
| Assessment after sign-out | Direct navigation to `/assessment/new` redirected to `/signup?next=%2Fassessment%2Fnew` | Pass |

The callback is evidenced by the transition from the magic-link check-inbox
state to the authenticated dashboard. The private callback token itself was
not copied or retained.

## Decision

| Sign-off | Value |
|---|---|
| Result | Verified |
| Owner/operator | Muhammad Sohaib Roomi |
| Evidence reviewer | Codex |
| Decision date | 27 July 2026 |
| Restrictions | This verifies authentication only; it does not close the separate PDF/report or reminder gates |

