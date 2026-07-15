import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DotStatus, PageHeader, SectionHeader } from "@/components/brightcert/ledger";
import { SECTIONS, getQuestionsBySection } from "@/lib/questions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Assessment" };

type SectionTaskStatus = "completed" | "in_progress" | "not_started";

const STATUS_CONFIG: Record<SectionTaskStatus, { label: string; dot: string }> = {
  completed: { label: "Completed", dot: "#059669" },
  in_progress: { label: "In progress", dot: "#D97706" },
  not_started: { label: "Not started", dot: "#CBD5E1" },
};

function SectionRow({
  sectionId,
  title,
  answered,
  questionCount,
  status,
  assessmentId,
}: {
  sectionId: number;
  title: string;
  answered: number;
  questionCount: number;
  status: SectionTaskStatus;
  assessmentId: string;
}) {
  const cfg = STATUS_CONFIG[status];

  return (
    <Link
      href={`/assessment/${assessmentId}/section/${sectionId}?q=1`}
      className="bc-focus flex items-center gap-4 border-b border-[#F4F6FA] py-3 transition-colors hover:bg-[#F8FAFC]"
    >
      <span className="min-w-0 flex-1 truncate text-[13px] text-[#33405C]">
        <b className="font-semibold text-[#0F2044]">{sectionId}.</b> {title}
      </span>
      <span className="hidden shrink-0 text-xs tabular-nums text-[#64748B] sm:inline">
        {answered}/{questionCount} answered
      </span>
      <span className="w-[110px] shrink-0 text-right">
        <DotStatus label={cfg.label} color={cfg.dot} />
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#99A2B4]" strokeWidth={1.5} />
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

  const completedCount = Object.values(sectionStatuses).filter((s) => s === "completed").length;

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard"
        className="bc-focus mb-5 inline-flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0F2044]"
      >
        ← Back to dashboard
      </Link>

      <PageHeader
        title="Cyber Essentials Readiness Assessment"
        subtitle="Complete all five sections to receive your readiness score and report."
      />

      {/* Section task list */}
      <div className="mb-8">
        <SectionHeader
          title="Sections"
          action={
            <span className="text-xs tabular-nums text-[#64748B]">
              {completedCount} of {SECTIONS.length} complete
            </span>
          }
        />
        <div className="border-t border-[#EEF1F6]">
          {SECTIONS.map((section) => (
            <SectionRow
              key={section.id}
              sectionId={section.id}
              title={section.title}
              answered={answeredBySection[section.id] ?? 0}
              questionCount={getQuestionsBySection(section.id).length}
              status={sectionStatuses[section.id]}
              assessmentId={id}
            />
          ))}
        </div>
      </div>

      {allCompleted && (
        <p className="mb-5 text-[13px] font-medium text-[#065F46]">
          All five sections complete. Review your answers before submitting.
        </p>
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
  );
}
