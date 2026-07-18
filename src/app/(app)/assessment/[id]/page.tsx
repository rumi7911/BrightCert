import type { Metadata } from "next";
import Link from "next/link";
import { Bug, ChevronRight, RefreshCw, Settings, Users, Wifi, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTIONS, getQuestionsBySection } from "@/lib/questions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Assessment" };

type SectionTaskStatus = "completed" | "in_progress" | "not_started";

const STATUS_CONFIG: Record<SectionTaskStatus, { label: string; dot: string; tile: string; icon: string }> = {
  completed: { label: "Completed", dot: "#059669", tile: "bg-[#ECFDF5] group-hover:bg-[#D1FAE5]", icon: "text-[#047857]" },
  in_progress: { label: "In progress", dot: "#D97706", tile: "bg-[#FFFBEB] group-hover:bg-[#FEF3C7]", icon: "text-[#D97706]" },
  not_started: { label: "Not started", dot: "#CBD5E1", tile: "bg-[#F1F5F9] group-hover:bg-[#E2E8F0]", icon: "text-[#94A3B8]" },
};

const SECTION_ICONS: Record<number, LucideIcon> = {
  1: Wifi,
  2: Settings,
  3: Users,
  4: Bug,
  5: RefreshCw,
};

// A ring instead of a number — progress you can read at a glance, echoing
// the score ring used everywhere else in the app.
function ProgressRing({ percent, sub }: { percent: number; sub: string }) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  return (
    <div className="flex shrink-0 items-center gap-3">
      <div
        className="relative grid h-[76px] w-[76px] place-items-center rounded-full"
        style={{ background: `conic-gradient(#6EE7B7 ${clamped}%, rgba(255,255,255,0.14) ${clamped}% 100%)` }}
      >
        <div className="grid h-[60px] w-[60px] place-items-center rounded-full bg-[#0F2044]">
          <span className="font-display text-lg font-extrabold tabular-nums text-white">{clamped}%</span>
        </div>
      </div>
      <p className="max-w-[7.5rem] text-[11.5px] leading-snug text-[#A9B8D6]">{sub}</p>
    </div>
  );
}

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
  const Icon = SECTION_ICONS[sectionId];

  return (
    <Link
      href={`/assessment/${assessmentId}/section/${sectionId}?q=1`}
      className="bc-focus group flex items-center gap-4 border-b border-[#0F2044]/[0.05] py-3.5 px-1 transition-colors last:border-0 hover:bg-[#F3F4EC]"
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] transition-colors ${cfg.tile}`}>
        <Icon className={`h-5 w-5 ${cfg.icon}`} strokeWidth={1.6} />
      </div>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium text-[#0F2044]">
          <b className="font-bold">{sectionId}.</b> {title}
        </span>
        <span className="block text-xs tabular-nums text-[#77829A]">{answered}/{questionCount} answered</span>
      </span>
      <span className="hidden w-[110px] shrink-0 text-right sm:inline-flex sm:justify-end">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#33405C]">
          <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: cfg.dot }} aria-hidden />
          {cfg.label}
        </span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#99A2B4] transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
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
  let totalQuestions = 0;
  let totalAnswered = 0;
  SECTIONS.forEach((section) => {
    const total = getQuestionsBySection(section.id).length;
    const answered = answeredBySection[section.id] ?? 0;
    totalQuestions += total;
    totalAnswered += answered;
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
  const overallPercent = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  return (
    <div className="max-w-3xl">
      <Link
        href="/dashboard"
        className="bc-focus mb-5 inline-flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0F2044]"
      >
        ← Back to dashboard
      </Link>

      {/* Navy intro band — matches the dashboard's verdict hero treatment */}
      <section className="relative mb-6 overflow-hidden rounded-[14px] bg-gradient-to-br from-[#0F2044] to-[#08152e] px-6 py-6 sm:px-8 sm:py-7">
        <div aria-hidden className="pointer-events-none absolute -top-28 right-[-60px] h-64 w-64 rounded-full bg-[#059669]/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 left-[-70px] h-64 w-64 rounded-full bg-[#2563EB]/15 blur-3xl" />
        <div aria-hidden className="bg-noise pointer-events-none absolute inset-0 opacity-[0.04]" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#6EE7B7]">
              Readiness assessment
            </p>
            <h1 className="font-display mt-2 text-[24px] font-bold leading-tight tracking-tight text-white sm:text-[28px]">
              Cyber Essentials Readiness Assessment
            </h1>
            <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-[#A9B8D6]">
              Complete all five sections to receive your readiness score and report — most businesses finish in around 2 hours, and every answer saves as you go.
            </p>
          </div>
          <ProgressRing percent={overallPercent} sub={`${completedCount} of ${SECTIONS.length} sections complete`} />
        </div>
      </section>

      {/* Section task list */}
      <div className="mb-6 rounded-[16px] border border-[#0F2044]/[0.07] bg-white p-3 sm:p-4">
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
