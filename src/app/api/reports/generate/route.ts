import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadReport } from "@/lib/gcs/upload";

export const maxDuration = 60; // PDF generation can take up to 60 seconds

export async function POST(request: NextRequest) {
  try {
    const { assessmentId } = await request.json();

    if (!assessmentId || typeof assessmentId !== "string") {
      return NextResponse.json({ error: "assessmentId is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Check assessment is paid
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .select("id, status, overall_score, overall_status, organisations(name)")
      .eq("id", assessmentId)
      .single();

    if (assessmentError || !assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    if (assessment.status !== "paid") {
      return NextResponse.json({ error: "Assessment not paid" }, { status: 403 });
    }

    // Check if report already exists
    const { data: existingReport } = await supabase
      .from("reports")
      .select("gcs_url")
      .eq("assessment_id", assessmentId)
      .single();

    if (existingReport) {
      return NextResponse.json({ url: existingReport.gcs_url });
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

    // Generate PDF
    // Dynamically import to avoid SSR issues with @react-pdf/renderer
    const { renderToBuffer } = await import("@react-pdf/renderer");
    const { createElement } = await import("react");
    const { ReportDocument } = await import("@/lib/pdf/ReportDocument");

    const orgData = assessment.organisations as unknown as { name: string } | null;
    const orgName = orgData?.name ?? "Your Organisation";

    const doc = createElement(ReportDocument, {
      orgName,
      assessmentId,
      overallScore: assessment.overall_score ?? 0,
      overallStatus: assessment.overall_status ?? "not_ready",
      controls: controlScores,
      generatedAt: new Date().toISOString(),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(doc as any);

    // Upload to Google Cloud Storage
    const gcsUrl = await uploadReport(Buffer.from(pdfBuffer), assessmentId);

    // Save report URL to database
    await supabase.from("reports").insert({
      assessment_id: assessmentId,
      gcs_url: gcsUrl,
    });

    return NextResponse.json({ url: gcsUrl });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Report generation failed" },
      { status: 500 }
    );
  }
}
