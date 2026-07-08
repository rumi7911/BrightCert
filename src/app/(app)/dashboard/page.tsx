import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Lock,
  Plus,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreCircle } from "@/components/brightcert/score-circle";
import { IconTile } from "@/components/brightcert/icon-tile";
import { SECTIONS } from "@/lib/questions";
import { createClient } from "@/lib/supabase/server";
import { getOverallStatus, getScoreColor, SCORE_STATUS_MAP, type Gap } from "@/types/assessment";

export const metadata: Metadata = { title: "Dashboard" };

const TARGET_SCORE = 70;

type AssessmentRow = {
  id: string;
  status: string;
  overall_score: number | null;
  overall_status: string | null;
  created_at: string;
  submitted_at: string | null;
};

type ControlScoreRow = {
  assessment_id: string;
  section_id: number;
  score: number;
  status: string;
  summary: string | null;
  gaps: Gap[] | null;
};

type ReportRow = {
  assessment_id: string;
  gcs_url: string;
};

function formatDate(value: string | null | undefined, month: "short" | "long" = "short") {
  if (!value) return "Not submitted";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month,
    year: "numeric",
  });
}

function daysAgo(value: string | null | undefined) {
  if (!value) return null;
  const diff = Date.now() - new Date(value).getTime();
  const days = Math.max(0, Math.floor(diff / 86_400_000));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function getGaps(row: Pick<ControlScoreRow, "gaps"> | undefined) {
  return Array.isArray(row?.gaps) ? row.gaps : [];
}

function countPriority(rows: ControlScoreRow[], priority: Gap["priority"]) {
  return rows.flatMap((row) => getGaps(row)).filter((gap) => gap.priority === priority).length;
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; color: string; bg: string; icon: LucideIcon }> = {
    draft: { label: "In progress", color: "#92400E", bg: "#FFFBEB", icon: Clock },
    submitted: { label: "Submitted", color: "#1E40AF", bg: "#EFF6FF", icon: Clock },
    analysed: { label: "Results ready", color: "#065F46", bg: "#ECFDF5", icon: CheckCircle2 },
    paid: { label: "Report unlocked", color: "#065F46", bg: "#ECFDF5", icon: CheckCircle2 },
  };
  const item = cfg[status] ?? { label: statusLabel(status), color: "#475569", bg: "#F1F5F9", icon: Clock };
  const Icon = item.icon;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize"
      style={{ color: item.color, backgroundColor: item.bg }}
    >
      <Icon className="h-3 w-3" strokeWidth={2} />
      {item.label}
    </span>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
  helper,
  tone = "emerald",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
  tone?: "emerald" | "red" | "slate";
}) {
  const tones = {
    emerald: { bg: "#ECFDF5", color: "#047857" },
    red: { bg: "#FEF2F2", color: "#DC2626" },
    slate: { bg: "#F1F5F9", color: "#475569" },
  }[tone];

  return (
    <div className="flex items-center gap-4 border-b border-[#E2E8F0] p-4 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:p-5">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: tones.bg, color: tones.color }}
      >
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[#64748B]">{label}</p>
        <p className="mt-0.5 text-lg font-bold text-[#0F2044]">{value}</p>
        <p className="text-xs text-[#64748B]">{helper}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div>
      <DashboardHeader />
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-8 text-center shadow-[0_1px_3px_rgba(15,32,68,0.05)] sm:p-12">
        <IconTile icon={ClipboardList} size="lg" className="mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-[#0F2044]">Start your first assessment</h2>
        <p className="mx-auto mt-2 mb-6 max-w-md text-sm leading-relaxed text-[#64748B]">
          Complete a Cyber Essentials readiness assessment to see your score, identify gaps, and unlock a practical report.
        </p>
        <Button asChild>
          <Link href="/assessment/new">Start Assessment</Link>
        </Button>
      </div>
    </div>
  );
}

function DashboardHeader() {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-[#0F2044] sm:text-5xl">Dashboard</h1>
        <p className="mt-2 text-sm text-[#64748B]">Your Cyber Essentials readiness overview</p>
      </div>
      <Button asChild size="sm">
        <Link href="/assessment/new">
          <Plus className="h-4 w-4" />
          New Assessment
        </Link>
      </Button>
    </div>
  );
}

function DraftState({ assessment }: { assessment: AssessmentRow }) {
  return (
    <div>
      <DashboardHeader />
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-8 shadow-[0_1px_3px_rgba(15,32,68,0.05)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <IconTile icon={ClipboardList} size="lg" />
            <div>
              <StatusBadge status="draft" />
              <h2 className="mt-3 text-xl font-bold text-[#0F2044]">Continue your assessment</h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#64748B]">
                Your latest assessment was started on {formatDate(assessment.created_at)}. Finish the answers to generate your readiness score and priority actions.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href={`/assessment/${assessment.id}/section/1?q=1`}>Continue Assessment</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function SubmittedState({ assessment }: { assessment: AssessmentRow }) {
  return (
    <div>
      <DashboardHeader />
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-8 shadow-[0_1px_3px_rgba(15,32,68,0.05)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <IconTile icon={Clock} size="lg" />
            <div>
              <StatusBadge status="submitted" />
              <h2 className="mt-3 text-xl font-bold text-[#0F2044]">Analysis in progress</h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#64748B]">
                Your answers have been submitted. Results will appear here as soon as the readiness analysis is complete.
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href={`/assessment/${assessment.id}/check-answers`}>View Answers</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ReadinessPanel({
  latest,
  p1Count,
}: {
  latest: AssessmentRow;
  p1Count: number;
}) {
  const score = latest.overall_score ?? 0;
  const status = latest.overall_status ?? getOverallStatus(score);
  const statusMeta = SCORE_STATUS_MAP[status as keyof typeof SCORE_STATUS_MAP] ?? SCORE_STATUS_MAP[getOverallStatus(score)];
  const scoreColor = getScoreColor(score);

  return (
    <section className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(15,32,68,0.05)] lg:p-6">
      <h2 className="text-base font-semibold text-[#0F2044]">Overall readiness</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
        <ScoreCircle score={score} size="lg" />
        <div>
          <p className="font-display text-3xl font-bold text-[#047857]">{statusMeta.label}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[#475569]">
            {p1Count > 0
              ? `You are close. Fix the ${p1Count} P1 ${p1Count === 1 ? "issue" : "issues"} below to improve your readiness.`
              : "No critical issues are currently open. Review the control areas before applying."}
          </p>
          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between text-xs text-[#64748B]">
              <span>0%</span>
              <span className="font-medium text-[#475569]">Target {TARGET_SCORE}%</span>
              <span>100%</span>
            </div>
            <div className="relative h-2 rounded-full bg-[#E2E8F0]">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min(score, 100)}%`, backgroundColor: scoreColor }}
              />
              <span
                className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-[#047857] shadow-[0_1px_3px_rgba(15,32,68,0.2)]"
                style={{ left: `calc(${TARGET_SCORE}% - 8px)` }}
                aria-hidden
              />
            </div>
          </div>
          <Link
            href={`/assessment/${latest.id}/results`}
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#047857] hover:text-[#065F46]"
          >
            What does my score mean?
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PriorityPanel({
  latest,
  controls,
}: {
  latest: AssessmentRow;
  controls: ControlScoreRow[];
}) {
  const p1Gaps = controls.flatMap((control) => {
    const section = SECTIONS.find((item) => item.id === control.section_id);
    return getGaps(control)
      .filter((gap) => gap.priority === "P1")
      .map((gap) => ({
        ...gap,
        sectionTitle: section?.shortTitle ?? section?.title ?? "Control area",
      }));
  });

  return (
    <section className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(15,32,68,0.05)] lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#DC2626]">Fix these first (P1 priority)</h2>
          <p className="mt-2 text-sm text-[#64748B]">These issues have the biggest impact on your readiness.</p>
        </div>
        <span className="rounded-[8px] border border-[#E2E8F0] px-2.5 py-1 text-xs font-semibold text-[#0F2044]">
          {p1Gaps.length} {p1Gaps.length === 1 ? "issue" : "issues"}
        </span>
      </div>

      {p1Gaps.length > 0 ? (
        <div className="mt-5 divide-y divide-[#F1F5F9]">
          {p1Gaps.slice(0, 3).map((gap, index) => (
            <div key={`${gap.issue}-${index}`} className="flex items-center gap-3 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#FEF2F2] text-[#DC2626]">
                <AlertTriangle className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[#0F2044]">{gap.issue}</p>
                  <span className="rounded-[4px] bg-[#FEF2F2] px-1.5 py-0.5 text-[11px] font-bold text-[#B91C1C]">
                    P1
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#64748B]">{gap.sectionTitle} · {gap.why}</p>
              </div>
              <Button asChild variant="outline" size="sm" className="hidden shrink-0 sm:inline-flex">
                <Link href={`/assessment/${latest.id}/results#priority-actions`}>
                  View &amp; fix
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[12px] border border-[#A7F3D0] bg-[#ECFDF5] p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#047857]" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-semibold text-[#0F2044]">No critical blockers found</p>
              <p className="mt-1 text-sm text-[#475569]">Review the control areas and report notes before applying.</p>
            </div>
          </div>
        </div>
      )}

      <Link
        href={`/assessment/${latest.id}/results#priority-actions`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#047857] hover:text-[#065F46]"
      >
        View all issues
        <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
      </Link>
    </section>
  );
}

function ControlAreas({ controls }: { controls: ControlScoreRow[] }) {
  const statusMeta: Record<string, { label: string; bg: string; color: string }> = {
    pass: { label: "Good", bg: "#ECFDF5", color: "#047857" },
    warning: { label: "Needs work", bg: "#FFFBEB", color: "#92400E" },
    fail: { label: "At risk", bg: "#FEF2F2", color: "#B91C1C" },
    missing: { label: "Not scored", bg: "#F1F5F9", color: "#64748B" },
  };

  return (
    <section className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(15,32,68,0.05)]">
      <h2 className="text-base font-semibold text-[#0F2044]">Cyber Essentials control areas</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {SECTIONS.map((section) => {
          const control = controls.find((row) => row.section_id === section.id);
          const score = control?.score ?? 0;
          const meta = statusMeta[control?.status ?? "missing"] ?? statusMeta.missing;
          const color = control ? getScoreColor(score) : "#CBD5E1";

          return (
            <div key={section.id} className="rounded-[10px] border border-[#E2E8F0] bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#ECFDF5] text-[#047857]">
                  <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-snug text-[#0F2044]">
                    {section.id}. {section.shortTitle}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#64748B]">{section.description}</p>
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-[#F1F5F9]">
                <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[#0F2044]">{control ? `${score}%` : "Not scored"}</span>
                <span className="rounded-[6px] px-2 py-0.5 text-xs font-semibold" style={{ color: meta.color, backgroundColor: meta.bg }}>
                  {meta.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AssessmentHistory({
  assessments,
  reportMap,
  p1CountMap,
}: {
  assessments: AssessmentRow[];
  reportMap: Map<string, string>;
  p1CountMap: Map<string, number>;
}) {
  return (
    <section className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(15,32,68,0.05)]">
      <h2 className="text-base font-semibold text-[#0F2044]">Assessment history</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-xs font-medium text-[#64748B]">
              <th className="pb-2 pr-4">Assessment</th>
              <th className="pb-2 pr-4">Date</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Score</th>
              <th className="pb-2 pr-4">P1 blockers</th>
              <th className="pb-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {assessments.slice(0, 5).map((assessment, index) => {
              const reportUrl = reportMap.get(assessment.id);
              return (
                <tr key={assessment.id}>
                  <td className="py-3 pr-4 font-medium text-[#0F2044]">
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <span className="rounded-[4px] bg-[#ECFDF5] px-1.5 py-0.5 text-[11px] font-bold text-[#047857]">
                          Latest
                        </span>
                      )}
                      Assessment #{assessments.length - index}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-[#475569]">{formatDate(assessment.created_at)}</td>
                  <td className="py-3 pr-4"><StatusBadge status={assessment.status} /></td>
                  <td className="py-3 pr-4 font-semibold text-[#0F2044]">
                    {assessment.overall_score != null ? `${assessment.overall_score}%` : "Not scored"}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-[#B91C1C]">{p1CountMap.get(assessment.id) ?? 0}</td>
                  <td className="py-3 text-right">
                    {assessment.status === "draft" ? (
                      <Link className="text-sm font-semibold text-[#047857] hover:text-[#065F46]" href={`/assessment/${assessment.id}/section/1?q=1`}>
                        Continue
                      </Link>
                    ) : assessment.status === "paid" && reportUrl ? (
                      <a className="text-sm font-semibold text-[#047857] hover:text-[#065F46]" href={reportUrl} target="_blank" rel="noopener noreferrer">
                        PDF
                      </a>
                    ) : (
                      <Link className="text-sm font-semibold text-[#047857] hover:text-[#065F46]" href={`/assessment/${assessment.id}/results`}>
                        Results
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ReportsPanel({
  latest,
  reportUrl,
}: {
  latest: AssessmentRow;
  reportUrl: string | undefined;
}) {
  const isPaid = latest.status === "paid";
  const isAnalysed = latest.status === "analysed";

  return (
    <section className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(15,32,68,0.05)]">
      <h2 className="text-base font-semibold text-[#0F2044]">Reports</h2>
      <div className="mt-4 rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#475569] ring-1 ring-[#E2E8F0]">
              <FileText className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-[#0F2044]">Cyber Essentials Readiness Report</p>
                <span className="rounded-[6px] bg-[#ECFDF5] px-2 py-0.5 text-xs font-semibold text-[#047857]">
                  {reportUrl ? "PDF ready" : isPaid ? "Generating" : isAnalysed ? "Ready to unlock" : "Locked"}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                Includes your score, key findings, and recommended actions from Assessment {formatDate(latest.created_at)}.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            {reportUrl ? (
              <Button asChild size="sm">
                <a href={reportUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            ) : isPaid ? (
              <Button asChild size="sm">
                <Link href={`/assessment/${latest.id}/report`}>Generate report</Link>
              </Button>
            ) : isAnalysed ? (
              <Button asChild size="sm">
                <Link href={`/api/stripe/checkout?assessmentId=${latest.id}`}>
                  <Lock className="h-4 w-4" />
                  Unlock report
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link href={`/assessment/${latest.id}/results`}>View results</Link>
              </Button>
            )}
            <Button asChild variant="outline" size="sm">
              <Link href={isPaid ? `/assessment/${latest.id}/report` : `/assessment/${latest.id}/results`}>
                View report
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) {
    return <EmptyState />;
  }

  const { data: assessmentRows } = await supabase
    .from("assessments")
    .select("id, status, overall_score, overall_status, created_at, submitted_at")
    .eq("org_id", profile.org_id)
    .order("created_at", { ascending: false });

  const assessments = (assessmentRows ?? []) as AssessmentRow[];
  if (assessments.length === 0) {
    return <EmptyState />;
  }

  const latest = assessments[0];
  if (latest.status === "draft") {
    return <DraftState assessment={latest} />;
  }
  if (latest.status === "submitted") {
    return <SubmittedState assessment={latest} />;
  }

  const assessmentIds = assessments.map((assessment) => assessment.id);
  const { data: allScoreRows } = assessmentIds.length
    ? await supabase
      .from("control_scores")
      .select("assessment_id, section_id, score, status, summary, gaps")
      .in("assessment_id", assessmentIds)
    : { data: [] };

  const allScores = (allScoreRows ?? []) as ControlScoreRow[];
  const latestControls = allScores
    .filter((score) => score.assessment_id === latest.id)
    .sort((a, b) => a.section_id - b.section_id);

  const paidIds = assessments.filter((assessment) => assessment.status === "paid").map((assessment) => assessment.id);
  const { data: reports } = paidIds.length
    ? await supabase
      .from("reports")
      .select("assessment_id, gcs_url")
      .in("assessment_id", paidIds)
    : { data: [] };

  const reportMap = new Map<string, string>();
  ((reports ?? []) as ReportRow[]).forEach((report) => {
    if (!reportMap.has(report.assessment_id)) {
      reportMap.set(report.assessment_id, report.gcs_url);
    }
  });

  const previousWithScore = assessments.slice(1).find((assessment) => assessment.overall_score != null);
  const scoreChange = latest.overall_score != null && previousWithScore?.overall_score != null
    ? latest.overall_score - previousWithScore.overall_score
    : null;
  const p1Count = countPriority(latestControls, "P1");
  const p1CountMap = new Map<string, number>();
  assessments.forEach((assessment) => {
    p1CountMap.set(
      assessment.id,
      countPriority(allScores.filter((score) => score.assessment_id === assessment.id), "P1")
    );
  });

  const latestReportUrl = reportMap.get(latest.id);
  const lastActivity = latest.submitted_at ?? latest.created_at;
  const reportStatus = latestReportUrl
    ? { value: "PDF available", helper: "Ready to download" }
    : latest.status === "paid"
      ? { value: "Generating", helper: "PDF processing" }
      : { value: "Ready to unlock", helper: "PDF report available" };

  return (
    <div>
      <DashboardHeader />

      <section className="mb-4 grid overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(15,32,68,0.05)] sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile
          icon={ShieldAlert}
          label="P1 blockers"
          value={String(p1Count)}
          helper={p1Count > 0 ? "Must fix to be ready" : "No critical issues"}
          tone={p1Count > 0 ? "red" : "emerald"}
        />
        <MetricTile
          icon={CalendarDays}
          label="Last assessment"
          value={formatDate(lastActivity)}
          helper={daysAgo(lastActivity) ?? "Latest activity"}
        />
        <MetricTile
          icon={TrendingUp}
          label="Score change"
          value={scoreChange == null ? "No baseline" : `${scoreChange > 0 ? "+" : ""}${scoreChange}%`}
          helper={scoreChange == null ? "Complete another assessment" : "Since last assessment"}
        />
        <MetricTile
          icon={FileText}
          label="Report status"
          value={reportStatus.value}
          helper={reportStatus.helper}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
        <ReadinessPanel latest={latest} p1Count={p1Count} />
        <PriorityPanel latest={latest} controls={latestControls} />
      </div>

      <div className="mt-4">
        <ControlAreas controls={latestControls} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
        <AssessmentHistory assessments={assessments} reportMap={reportMap} p1CountMap={p1CountMap} />
        <ReportsPanel latest={latest} reportUrl={latestReportUrl} />
      </div>
    </div>
  );
}
