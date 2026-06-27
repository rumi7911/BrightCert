import { NextRequest, NextResponse } from "next/server";
import { analyzeAssessment } from "@/lib/gemini/analyze";
import { createClient } from "@/lib/supabase/server";
import { getOverallStatus } from "@/types/assessment";

export async function POST(request: NextRequest) {
  try {
    const { assessmentId } = await request.json();

    if (!assessmentId || typeof assessmentId !== "string") {
      return NextResponse.json({ error: "assessmentId is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Check if already analysed
    const { data: existingScores } = await supabase
      .from("control_scores")
      .select("id")
      .eq("assessment_id", assessmentId)
      .limit(1);

    if (existingScores && existingScores.length > 0) {
      return NextResponse.json({ error: "Assessment already analysed" }, { status: 409 });
    }

    // Fetch assessment + org name
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .select("id, org_id, organisations(name)")
      .eq("id", assessmentId)
      .single();

    if (assessmentError || !assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    // Fetch all responses
    const { data: responses, error: responsesError } = await supabase
      .from("responses")
      .select("question_key, answer, section_id")
      .eq("assessment_id", assessmentId);

    if (responsesError || !responses || responses.length === 0) {
      return NextResponse.json({ error: "No responses found" }, { status: 400 });
    }

    const orgs = assessment.organisations as unknown as { name: string } | null;
    const orgName = orgs?.name ?? "Your organisation";

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

    const { error: scoresError } = await supabase
      .from("control_scores")
      .insert(scoreRows);

    if (scoresError) {
      throw new Error(`Failed to save scores: ${scoresError.message}`);
    }

    // Update assessment overall score
    const overallStatus = getOverallStatus(result.overallScore);
    await supabase
      .from("assessments")
      .update({
        overall_score: result.overallScore,
        overall_status: overallStatus,
        status: "analysed",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", assessmentId);

    return NextResponse.json({
      success: true,
      overallScore: result.overallScore,
      overallStatus,
      executiveSummary: result.executiveSummary,
      controls: result.controls,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
