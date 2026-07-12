import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Circle, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTIONS, getQuestionsBySection } from "@/lib/questions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Assessment" };

type SectionTaskStatus = "completed" | "in_progress" | "not_started" | "cannot_start";

function SectionRow({
  sectionId,
  title,
  questionCount,
  status,
  assessmentId,
}: {
  sectionId: number;
  title: string;
  questionCount: number;
  status: SectionTaskStatus;
  assessmentId: string;
}) {
  const statusConfig = {
    completed: { label: "Completed", color: "#065F46", bg: "#ECFDF5", icon: CheckCircle2 },
    in_progress: { label: "In progress", color: "#92400E", bg: "#FFFBEB", icon: Clock },
    not_started: { label: "Not started", color: "#475569", bg: "#F1F5F9", icon: Circle },
    cannot_start: { label: "Cannot start yet", color: "#94A3B8", bg: "#F8FAFC", icon: Circle },
  }[status];

  const Icon = statusConfig.icon;
  const isClickable = status !== "cannot_start";

  const inner = (
    <div className={`flex items-center justify-between p-4 rounded-[8px] border transition-colors ${
      isClickable
        ? "border-[#E2E8F0] bg-white hover:border-[#A7F3D0] hover:bg-[#ECFDF5] cursor-pointer"
        : "border-[#E2E8F0] bg-[#F8FAFC] cursor-not-allowed opacity-60"
    }`}>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[#E2E8F0] flex items-center justify-center text-sm font-bold text-[#64748B]">
          {sectionId}
        </div>
        <div>
          <p className="text-sm font-medium text-[#0F2044]">{title}</p>
          <p className="text-xs text-[#64748B]">{questionCount} questions</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ color: statusConfig.color, backgroundColor: statusConfig.bg }}
        >
          {statusConfig.label}
        </span>
        {isClickable && <ChevronRight className="h-4 w-4 text-[#94A3B8]" />}
      </div>
    </div>
  );

  if (!isClickable) return <div>{inner}</div>;

  return (
    <Link href={`/assessment/${assessmentId}/section/${sectionId}?q=1`}>
      {inner}
    </Link>
  );
}

export default async function AssessmentTaskListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: responses } = await supabase
    .from("responses")
    .select("section_id")
    .eq("assessment_id", id);

  const answeredBySection: Record<number, number> = {};
  (responses ?? []).forEach((r) => {
    answeredBySection[r.section_id] = (answeredBySection[r.section_id] ?? 0) + 1;
  });

  const sectionStatuses: Record<number, SectionTaskStatus> = {};
  SECTIONS.forEach((section) => {
    const total = getQuestionsBySection(section.id).length;
    const answered = answeredBySection[section.id] ?? 0;
    sectionStatuses[section.id] =
      answered === 0 ? "not_started" : answered >= total ? "completed" : "in_progress";
  });

  const allCompleted = Object.values(sectionStatuses).every((s) => s === "completed");

  // Resume where the user left off: first incomplete section, first unanswered question
  const firstIncomplete = SECTIONS.find((s) => sectionStatuses[s.id] !== "completed");
  const continueSectionId = firstIncomplete?.id ?? 1;
  const continueQuestion = Math.min(
    (answeredBySection[continueSectionId] ?? 0) + 1,
    getQuestionsBySection(continueSectionId).length
  );

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard" className="text-sm text-[#64748B] hover:text-[#0F2044] mb-6 inline-flex items-center gap-1">
        ← Back to dashboard
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-[#0F2044] mb-1">Cyber Essentials Readiness Assessment</h1>
        <p className="text-sm text-[#64748B] mb-8">
          Complete all five sections to receive your readiness score and report.
        </p>

        {/* Section task list */}
        <div className="space-y-3 mb-8">
          {SECTIONS.map((section) => (
            <SectionRow
              key={section.id}
              sectionId={section.id}
              title={section.title}
              questionCount={getQuestionsBySection(section.id).length}
              status={sectionStatuses[section.id]}
              assessmentId={id}
            />
          ))}
        </div>

        {allCompleted && (
          <div className="rounded-[12px] border border-[#A7F3D0] bg-[#ECFDF5] p-4 mb-6">
            <p className="text-sm text-[#065F46] font-medium">
              All five sections complete. Review your answers before submitting.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {allCompleted ? (
            <Button asChild size="lg">
              <Link href={`/assessment/${id}/check-answers`}>Review and submit</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href={`/assessment/${id}/section/${continueSectionId}?q=${continueQuestion}`}>
                Continue assessment
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
