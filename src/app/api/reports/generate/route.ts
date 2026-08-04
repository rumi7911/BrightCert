import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { uploadReport, getReportSignedUrl } from "@/lib/gcs/upload";
import { sendReportReadyEmail } from "@/lib/resend/emails";
import { verifyAssessmentOwnership } from "@/lib/auth/assessment-ownership";
import { claimReportGeneration } from "@/lib/reports/claim";
import {
  parsePersistedReportInput,
  PersistedReportPayloadError,
} from "@/lib/pdf/report/report-input";

export const maxDuration = 60; // PDF generation can take up to 60 seconds

export async function POST(request: NextRequest) {
  try {
    const { assessmentId } = await request.json();

    if (!assessmentId || typeof assessmentId !== "string") {
      return NextResponse.json({ error: "assessmentId is required" }, { status: 400 });
    }

    // Two trusted server-to-server callers (Stripe webhook, and the report
    // page's own fire-and-forget trigger) have no user session to check —
    // they authenticate via a shared secret instead. Anything else falls
    // back to a real ownership check.
    const internalSecret = process.env.INTERNAL_API_SECRET;
    const isInternalCaller = !!internalSecret && request.headers.get("x-internal-secret") === internalSecret;

    if (!isInternalCaller) {
      const ownership = await verifyAssessmentOwnership(assessmentId);
      if (!ownership.authorized) {
        return NextResponse.json({ error: "Unauthorized" }, { status: ownership.status });
      }
    }

    const supabase = createAdminClient();

    // Check assessment is paid
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .select("id, org_id, status, overall_score, overall_status, executive_summary, organisations(name)")
      .eq("id", assessmentId)
      .single();

    if (assessmentError || !assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    if (assessment.status !== "paid") {
      return NextResponse.json({ error: "Assessment not paid" }, { status: 403 });
    }

    // Cheap early exit for the common case: a finished report already exists.
    // An empty gcs_url is a claim marker, not a finished report — see the
    // claim block below — so it must not short-circuit here.
    //
    // The stored gcs_url is a 7-day signed URL that goes stale, so regenerate
    // a fresh one from the (deterministic) object path rather than reusing it.
    const { data: existingReport } = await supabase
      .from("reports")
      .select("id, gcs_url")
      .eq("assessment_id", assessmentId)
      .maybeSingle();

    if (existingReport?.gcs_url) {
      return NextResponse.json({ url: await getReportSignedUrl(assessmentId) });
    }

    // Fetch control scores for PDF content
    const { data: controlScores } = await supabase
      .from("control_scores")
      .select("*")
      .eq("assessment_id", assessmentId)
      .order("section_id");

    if (!controlScores || controlScores.length === 0) {
      return NextResponse.json({ error: "No control scores found" }, { status: 400 });
    }

    const orgData = assessment.organisations as unknown as { name: string } | null;
    const generatedAt = new Date().toISOString();
    let reportInput;
    try {
      reportInput = parsePersistedReportInput(
        {
          org_name: orgData?.name ?? "Your Organisation",
          executive_summary: assessment.executive_summary,
          overall_score: assessment.overall_score,
          overall_status: assessment.overall_status,
          control_scores: controlScores,
        },
        generatedAt
      );
    } catch (error) {
      if (error instanceof PersistedReportPayloadError) {
        console.error("Stored report analysis failed validation:", error);
        return NextResponse.json(
          {
            error:
              "Stored assessment analysis is invalid; re-run analysis before generating the report.",
          },
          { status: 422 }
        );
      }
      throw error;
    }

    // Claim the right to render before doing any expensive work.
    //
    // Three callers race here on every purchase — the Stripe webhook, the
    // report page's fire-and-forget trigger, and the page poller. The previous
    // check-then-act guard read before any of their inserts had landed, so all
    // three passed it and rendered. The unique index on reports.assessment_id
    // (migration 20260804000100) turns this insert into the mutex: exactly one
    // caller inserts the claim row, the rest conflict.
    const claim = await claimReportGeneration(supabase, assessmentId, generatedAt);

    if (claim.outcome === "already-complete") {
      return NextResponse.json({ url: await getReportSignedUrl(assessmentId) });
    }

    if (claim.outcome === "in-progress") {
      // Another caller holds a live claim. Both real callers are
      // fire-and-forget and the report page polls for readiness, so reporting
      // "not finished yet" is cheaper and truer than rendering a second copy.
      return NextResponse.json({ status: "generating" }, { status: 202 });
    }

    let pdfBuffer: Buffer;
    let gcsUrl: string;

    try {
      // Generate PDF. renderValidatedReport dynamically imports
      // @react-pdf/renderer and the document together, so the Font.register
      // side effect in brand-tokens and the renderer share one module instance.
      const { renderValidatedReport } = await import("@/lib/pdf/render-report");
      pdfBuffer = Buffer.from(await renderValidatedReport(reportInput));

      // Upload to Google Cloud Storage
      gcsUrl = await uploadReport(pdfBuffer, assessmentId);
    } catch (error) {
      // Release the claim, or the empty row would block every future attempt
      // until it aged past the stale window.
      await supabase.from("reports").delete().eq("id", claim.reportId);
      throw error;
    }

    // Publishing the real gcs_url is what marks the report finished.
    await supabase
      .from("reports")
      .update({ gcs_url: gcsUrl, generated_at: new Date().toISOString() })
      .eq("id", claim.reportId);

    // Send report-ready email (fire-and-forget)
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("org_id", assessment.org_id)
      .limit(1)
      .single();

    if (profile) {
      const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
      if (authUser?.user?.email) {
        sendReportReadyEmail(
          authUser.user.email,
          reportInput.orgName,
          assessmentId,
          reportInput.overallScore,
        ).catch((err) => console.error("Report-ready email failed:", err));
      }
    }

    return NextResponse.json({ url: gcsUrl });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Report generation failed" },
      { status: 500 }
    );
  }
}
