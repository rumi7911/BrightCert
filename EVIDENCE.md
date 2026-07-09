# Evidence of BrightCert running in production

This documents that Gemini and Google Cloud Storage are live and doing real work in production, not mocked or stubbed, per `CLAUDE.md`'s explicit constraint: *"Gemini API is required — every assessment analysis must invoke Gemini. Do not mock or stub this in production."*

## 1. Live, testable product

**https://brightcert.co.uk** is live in production. The fastest way to verify any of this is to complete a real assessment yourself, submitting it triggers a real Gemini API call and returns a real score, not a canned response.

As of this writing, the homepage publicly displays a real, Supabase-backed count of assessments already started on the live site, reproducible with:

```bash
curl -s https://brightcert.co.uk/ | grep -oE '[0-9]+ UK business(es)? (has|have) started a readiness assessment'
```

```
7 UK businesses have started a readiness assessment
```
(fetched 2026-07-09, will read differently by the time you run it, that's the point, it's live data, not a fixture)

## 2. The Gemini integration is real code, not a mock

`src/lib/gemini/client.ts` initialises the actual `@google/generative-ai` SDK against `gemini-2.5-flash`:

```ts
export function getGeminiModel() {
  return getGeminiClient().getGenerativeModel({ model: "gemini-2.5-flash" });
}
```

`src/app/api/assessment/analyze/route.ts` is the route every assessment submission hits. It fetches the real questionnaire responses from Supabase, calls Gemini, and writes the real response straight into `control_scores` and `assessments`, there is no branch that returns a fixture instead:

```ts
// Call Gemini API
const result = await analyzeAssessment(orgName, responses);

// Save control_scores
const scoreRows = result.controls.map((control) => ({
  assessment_id: assessmentId,
  section_id: control.sectionId,
  score: control.score,
  status: control.status,
  summary: control.summary,
  gaps: control.gaps,
  remediation: control.remediation,
}));
```

The system prompt (`src/lib/gemini/prompts.ts`) constrains Gemini to strict JSON, a 0-100 score and pass/warning/fail status per Cyber Essentials control area, a prioritised gap list (P1/P2/P3), and an executive summary, which is exactly the shape the results page and paid PDF report render. There's also an idempotency guard (the route 409s if `control_scores` already exist for that assessment) since each analysis is a real, billed API call rather than something safe to run repeatedly.

## 3. The Google Cloud Storage integration is real code, not a mock

`src/lib/gcs/upload.ts` uploads the generated PDF to a real GCS bucket and returns a signed, time-limited URL rather than a public one, since these reports contain a business's actual security posture:

```ts
export async function uploadReport(pdfBuffer: Buffer, assessmentId: string): Promise<string> {
  const bucket = storage.bucket(bucketName);
  const filename = `reports/${assessmentId}.pdf`;
  const file = bucket.file(filename);

  await file.save(pdfBuffer, { contentType: "application/pdf", ... });

  const [signedUrl] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + SIGNED_URL_EXPIRY_MS, // 7 days
  });

  return signedUrl;
}
```

## 4. The Stripe webhook is real, signature-verified, and drives the pipeline end to end

`src/app/api/stripe/webhook/route.ts` verifies the Stripe signature against `STRIPE_WEBHOOK_SECRET` (rejecting anything that doesn't match), marks the assessment `paid` in Supabase, and then triggers PDF generation, which triggers the GCS upload above:

```ts
event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
...
if (event.type === "checkout.session.completed") {
  await supabase.from("assessments").update({ status: "paid" }).eq("id", assessmentId);
  fetch(`${appUrl}/api/reports/generate`, { method: "POST", ... });
}
```

## 5. Verified end-to-end during development

During development, the full path, signup, 60-question assessment, Gemini analysis, Stripe checkout, webhook delivery, PDF generation, GCS upload, download, was run and confirmed working with a real logged-in user and a real Stripe transaction, prior to the production Stripe keys being restored to live mode.

## What's not in this file

Screenshots of the GCP console showing Gemini API call volume, and a Stripe dashboard screenshot showing real GBP transactions, are the strongest remaining evidence and need to come directly from those dashboards. Add them here (or as separate files linked from this one) before submission if you want the strongest possible evidence trail.
