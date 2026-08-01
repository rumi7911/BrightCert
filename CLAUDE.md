@AGENTS.md

## Architecture

### Pages & Routes (planned App Router structure)

```
app/
  (marketing)/          # Public landing pages, no auth required
    page.tsx            # Landing page
    pricing/page.tsx
    how-it-works/page.tsx
  (auth)/
    login/page.tsx
    signup/page.tsx
  (app)/                # Protected — requires Supabase session
    dashboard/page.tsx  # Assessment history, report downloads
    assessment/
      [id]/
        page.tsx        # Questionnaire flow (5 sections)
        results/page.tsx # Score + gap analysis + report
    settings/page.tsx
  api/
    assessment/analyze/route.ts  # Calls Gemini API, scores responses
    reports/generate/route.ts    # Generates PDF, uploads to GCS
    stripe/webhook/route.ts
```

### Core Data Model (Supabase)

- **organisations** — name, size, sector, created_at
- **users** — email, org_id (FK), role
- **assessments** — org_id, status (draft/complete/paid), overall_score, created_at
- **responses** — assessment_id, section (1–5), question_key, answer, created_at
- **control_scores** — assessment_id, control_area (1–5), score (0–100), status (pass/warning/fail)
- **reports** — assessment_id, gcs_url, generated_at

### AI Flow (critical path)

1. User completes 5-section questionnaire (~60 questions)
2. On submission → `POST /api/assessment/analyze`
3. API route formats all responses into a structured prompt
4. Gemini API returns: per-control scores, gap descriptions in plain English, prioritised remediation steps
5. Scores and gaps saved to `control_scores` table
6. `POST /api/reports/generate` → builds PDF → uploads to Google Cloud Storage → saves URL

Gemini is the **sole AI engine**. Do not add Claude/OpenAI calls — the hackathon requires Gemini to be the live LLM in production.

### Payment Gate

Assessment is free to complete. Payment (£199 via Stripe) is required to view the full report and download the PDF. Use Stripe Checkout sessions, not Elements, for simplicity. Webhook updates `assessments.status = 'paid'`.

### The 5 Cyber Essentials Control Areas

Questions are organised into exactly these 5 sections — do not rename or reorder them:

1. Boundary Firewalls & Internet Gateways
2. Secure Configuration
3. User Access Control
4. Malware Protection
5. Security Update Management
