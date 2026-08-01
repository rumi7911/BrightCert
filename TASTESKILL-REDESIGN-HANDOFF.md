# Tasteskill Redesign Handoff — Step 3 Implementation

**For:** Codex (or any coding agent) continuing from an approved design audit.
**State:** Steps 1–2 of the tasteskill v2 redesign protocol are DONE and USER-APPROVED. Your job is Step 3 (implement) and Step 4 (closing audits).
**Date:** 2026-07-05 · Repo baseline: commit `4e957d9` on `main`.

---

## 1. Project context

- **Product:** BrightCert — AI-powered Cyber Essentials readiness SaaS for UK SMEs. Live at https://brightcert.co.uk (Vercel, auto-deploys on push to `main`).
- **Stack:** Next.js 16 (App Router, `src/` dir, Tailwind v4 via `@theme` in `src/app/globals.css`), Supabase, Stripe (LIVE keys in prod — do not touch payment code), Gemini API, GCS, Resend.
- **Design rules source:** `.agents/skills/design-taste-frontend/SKILL.md` (tasteskill v2, symlinked at `.claude/skills/design-taste-frontend`). This is the ONLY design authority for this task. Key sections: 9.G (em-dash ban), 11 (redesign protocol), 14 (pre-flight check).
- **Project rules that still bind:** `CLAUDE.md`/`AGENTS.md` in repo root; `COPY.md` copy is verbatim **for wording** (see ruling below); `DESIGN-SYSTEM.md` tokens (navy `#0F2044`, emerald `#047857` CTA / `#059669` decorative, slate scale, radii 8/12/16/24, Lucide 1.5px icons).
- **Fonts:** Bricolage Grotesque (display, all h1–h3 via global CSS rule) + Inter (body). Both loaded in `src/app/layout.tsx` via next/font.
- **Shared components:** `src/components/brightcert/eyebrow.tsx`, `reveal.tsx` (IntersectionObserver scroll reveal), `app-sidebar.tsx`.

### Verification workflow (macOS, no Playwright package installed)
```bash
npx tsc --noEmit && npm run build        # must pass before shipping
npm run dev                               # localhost:3000
# Screenshots via cached headless chromium:
~/Library/Caches/ms-playwright/chromium_headless_shell-1224/chrome-headless-shell-mac-arm64/chrome-headless-shell \
  --headless --disable-gpu --screenshot=/tmp/out.png \
  --window-size=1440,9600 --virtual-time-budget=10000 --hide-scrollbars \
  http://localhost:3000
```
Note: `Reveal`-wrapped content is `opacity:0` until IntersectionObserver fires — use a tall viewport (everything in view at load) or sections will look blank in screenshots.

### Ship workflow
```bash
git add -A && git commit -m "..."   # end message with: Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
git push origin main                 # auto-deploys to brightcert.co.uk
```

---

## 2. Approved mode + user rulings

- **Mode: Redesign – Preserve** (skill §11.A). Targeted evolution only.
- **Ruling (a) — em-dash vs COPY.md:** the skill's em-dash ban (§9.G) governs **punctuation**; COPY.md governs **wording**. Restructure sentences with period / comma / colon / parentheses. Zero wording changes.
- **Ruling (b) — div mockups:** the 4 how-it-works step mockups (`MockQuestionCard`, `MockScoreCard`, `MockGapsCard`, `MockReportCard` in the landing page) are KEPT. User-approved exception to the "no div-based fake screenshots" rule.

### Frozen — never change (skill §11.F + user constraint)
- URL structure / route slugs
- Primary nav labels ("How it works", "What we check", "Pricing", "For MSPs", "Sign in")
- Form field names and order (`email`, `org_name`)
- Brand logo / wordmark treatment
- Legal copy: `src/components/brightcert/certification-disclaimer.tsx`, `/privacy`, `/terms`, footer disclaimer — em-dashes in these files are EXEMPT (legal copy is frozen)
- Anchors in use: `#what-we-check`, `#msp-partner`, `#faq` (landing), `/pricing#msg` → actually `/pricing#msp`
- The GOV.UK question-per-screen flow (`assessment/[id]/section/...`) — product UI, out of the skill's scope
- Gemini/Stripe/Supabase/GCS logic — this is a visual task only

### Declared exceptions (do NOT "fix" these)
- Centered hero (user's explicit CollectiveOS-reference choice)
- The 4 div-built step mockups (user-approved)
- Light-locked theme (B2B; dark mode deferred deliberately)
- Em-dashes baked into `public/dashboard-preview.png` pixels (image asset, can't edit)
- Em-dashes in code comments (not user-visible; ignore)
- Em-dashes in question content `src/lib/questions/index.ts`, PDF `src/lib/pdf/ReportDocument.tsx`, and app-flow pages other than dashboard row label (product UI, out of scope for this pass — optional cleanup only if trivial)

---

## 3. Step 3 work items (in priority order)

### 3.1 Em-dash purge — visible marketing copy, emails, titles
Method: punctuation-only restructure. Keep every word identical.

| File:line | Current (excerpt) | Fix |
|---|---|---|
| `src/app/layout.tsx:21,32,39` | `BrightCert — Cyber Essentials Readiness for UK SMEs` | `BrightCert \| Cyber Essentials Readiness for UK SMEs` (title metadata, 3 places) |
| `src/app/(marketing)/page.tsx:308` | `…patching — the requirements are important…` | `…patching: the requirements are important…` |
| `src/app/(marketing)/page.tsx:370` | `…not to look perfect — it is to understand…` | `…not to look perfect. It is to understand…` |
| `src/app/(marketing)/page.tsx:606` | `<strong>{item.label}</strong> — {item.desc}` | Restructure the list row: label on its own line (`block` strong) with desc below, or `{label}: {desc}`. Renders 6× in the report-preview list. |
| `src/app/(marketing)/page.tsx:847` | `…takes cyber security seriously — but you do not have…` | `…takes cyber security seriously, but you do not have…` |
| `src/app/(marketing)/page.tsx:880` | `…what it does — and what it does not do.` | `…what it does, and what it does not do.` |
| `src/app/(app)/dashboard/page.tsx:178` | `Assessment — {date}` | `Assessment · {date}` or two-line stack (date smaller weight) |
| `src/lib/resend/emails.ts:33` | footer legal text `…readiness assessments only — it does not issue…` | LEGAL copy → leave, OR use `:` if you judge it non-legal phrasing. Prefer leave. |
| `src/lib/resend/emails.ts:87` | subject `Welcome to BrightCert — start your…` | `Welcome to BrightCert: start your…` |
| `src/lib/resend/emails.ts:125` | subject `` `…report is ready — ${overallScore}% readiness score` `` | `` `…report is ready: ${overallScore}% readiness score` `` |
| `src/app/(auth)/signup/page.tsx` | check for visible em-dash; fix same way | comma/period restructure |

Also scan `src/app/(app)/assessment/new/page.tsx`, `check-answers`, `results`, `report`, `settings-form.tsx` — fix any em-dash in **rendered strings** with the same method (they're user-visible product UI; cheap wins). Ignore ones inside code comments.

Verification: `grep -rn "—" src --include="*.tsx" --include="*.ts"` → remaining hits must ONLY be code comments, legal copy (disclaimer/privacy/terms/email footer), questions/index.ts, or ReportDocument.tsx.

### 3.2 Dead anchor fixes (bugs)
- `src/components/brightcert/navbar.tsx`: `{ href: "/#for-msps", label: "For MSPs" }` → change href to `/#msp-partner` (existing id on landing pricing MSP card). **Label unchanged.**
- `src/app/(marketing)/page.tsx`: add `id="monitor"` to the Monitor pricing card div (footer links to `/#monitor`).

### 3.3 Eyebrow reduction: 11 → 5 on landing page
`src/app/(marketing)/page.tsx`. KEEP `<Eyebrow>` on: Problem ("The Problem"), How It Works, Your Report (`light` variant), Pricing, FAQs.
REMOVE `<Eyebrow>` from: Solution, The Five Control Areas, What You Get, Why BrightCert, Who It Is For, Trust & Clarity. Delete just the `<Eyebrow>…</Eyebrow>` line in each; headings stand alone. Adjust `mb-*` spacing on the following `h2` if it looks cramped (add `mt` equivalent not needed; heading already has mb).

### 3.4 Hero slim-down to 4-element stack
`src/app/(marketing)/page.tsx` hero section:
- KEEP: `h1`, first paragraph ("BrightCert guides UK SMEs through…"), the two CTAs.
- DELETE: second paragraph ("No confusing forms. No expensive consultancy-first process…") and the micro-strip `<p>` below the CTAs ("Built for UK businesses preparing for Cyber Essentials.").
- Rationale on record: the micro-strip's content is repeated verbatim in the trust strip directly below the hero; nothing is lost from the page. Do not re-add the deleted copy elsewhere.

### 3.5 FAQ recomposition (landing)
`src/app/(marketing)/page.tsx` FAQ section (`id="faq"` — keep the id):
- Replace the 10-row `<details>` accordion (`FaqItem`) with a **two-column static Q&A grid** at `lg:` (single column mobile): `grid lg:grid-cols-2 gap-x-12 gap-y-8`, each item = question (`text-base font-medium text-[#0F2044]`) + answer (`text-sm text-[#475569] leading-relaxed`). No border on every row. Delete the now-unused `FaqItem` component and `ChevronDown` import if unused elsewhere in the file.
- Q&A text verbatim, all 10 items.

---

## 4. Step 4 — closing audits (ALL must pass; post results in writing)

1. **Em-dash audit:** run the grep above. List remaining hits; each must map to a declared exception. Any other hit = FAIL, fix it.
2. **Pre-Flight Check (skill §14):** run the full checklist against the landing page. Expected flags & their dispositions:
   - Centered hero → PASS via declared exception
   - Div mockups / "real images" box → PASS via declared exception
   - Dark mode → deferred exception
   - Eyebrow count ≤ 5 → must PASS after 3.3
   - Hero stack ≤ 4 / subtext / no micro-strip → must PASS after 3.4
   - Everything else: verify honestly, fix fails.
3. **Preservation audit:** list every URL, nav label, form field, and anchor changed. **Expected list: EMPTY.** (Navbar href retarget in 3.2 is a broken-link bug fix to an existing approved anchor; note it explicitly as such.)
4. **Brand fidelity audit:** confirm navy `#0F2044` + emerald `#047857/#059669` accents, Bricolage/Inter stack, logo treatment, and radii system all survived unchanged.

Then: `npx tsc --noEmit && npm run build`, screenshot localhost:3000 (tall viewport), eyeball the hero / FAQ / pricing card anchors, commit, push, and confirm https://brightcert.co.uk picks it up (grep the deployed HTML for a changed string).

---

## 5. Reference — Step 1 audit summary (already approved)

- **Brand tokens:** navy `#0F2044` + `#142A56` gradient; emerald dual-token accent; Bricolage/Inter; radii 8/12/16/24; Lucide 1.5px.
- **IA:** `/` (14 sections) · `/pricing` · `/how-it-works` · `/privacy` · `/terms` · `/login` · `/signup` · app: `/dashboard` → `/assessment/new` → `section/[1-5]` → `check-answers` → `results` → `report` · `/settings`. Conversion path: landing → assessment → free results → £199 Stripe → PDF.
- **Preserve:** dashboard-image hero, navy inset rounded sections with grain, Bricolage headlines, GOV.UK flow, CertificationDisclaimer, COPY.md voice, focus rings, `prefers-reduced-motion` support.
- **Retire (this task):** em-dashes (11 visible + emails + title), 11 eyebrows (cap 5), 5-element hero stack, 2 dead anchors, FAQ long-list accordion.
- **Dials (current):** DESIGN_VARIANCE 5 · MOTION_INTENSITY 3 · VISUAL_DENSITY 5. Keep these; no new motion required.
- **SEO baseline:** title template `%s | BrightCert`; OG image `logo.png` 1270×630; `en_GB`; live anchors `#what-we-check` `#msp-partner` `#faq` `/pricing#msp`; no JSON-LD (out of scope).

## 6. Known backlog (NOT part of this task — do not drift into it)
- UNIQUE constraint on `reports.assessment_id` (Supabase migration)
- 4 remaining unbranded Supabase auth email templates
- Google OAuth consent branding
- Dark mode (deferred)
- JSON-LD structured data
