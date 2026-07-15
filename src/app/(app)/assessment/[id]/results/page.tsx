import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ControlScore, Gap } from "@/types/assessment";
import { ResultsView } from "./results-view";

export const metadata: Metadata = { title: "Your Results" };

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: assessmentId } = await params;
  const supabase = await createClient();

  // Fetch assessment
  const { data: assessment } = await supabase
    .from("assessments")
    .select("id, overall_score, overall_status, executive_summary, status")
    .eq("id", assessmentId)
    .single();

  if (!assessment) redirect("/dashboard");

  // If not yet analysed, send back to check-answers
  if (assessment.status === "draft" || assessment.status === "submitted") {
    redirect(`/assessment/${assessmentId}/check-answers`);
  }

  // Fetch control scores
  const { data: rows } = await supabase
    .from("control_scores")
    .select("section_id, score, status, summary, gaps, remediation")
    .eq("assessment_id", assessmentId)
    .order("section_id");

  if (!rows || rows.length === 0) redirect(`/assessment/${assessmentId}/check-answers`);

  const isPaid = assessment.status === "paid";

  // Pre-payment, gap details never leave the server — only score + status per control
  const controls: ControlScore[] = rows.map((row) => ({
    sectionId: row.section_id as 1 | 2 | 3 | 4 | 5,
    score: row.score,
    status: row.status as "pass" | "warning" | "fail",
    summary: isPaid ? row.summary ?? "" : "",
    gaps: (row.gaps as Gap[]) ?? [],
    remediation: isPaid ? row.remediation ?? [] : [],
  }));

  const fullSummary =
    assessment.executive_summary ??
    "Your assessment has been analysed. Review the control areas below to understand your readiness gaps and priority actions.";
  // Pre-payment, only a teaser of the executive summary leaves the server
  const executiveSummary = isPaid ? fullSummary : truncate(fullSummary, 220);

  return (
    <ResultsView
      assessmentId={assessmentId}
      isPaid={isPaid}
      overallScore={assessment.overall_score ?? 0}
      executiveSummary={executiveSummary}
      controls={controls}
    />
  );
}
