import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Download,
  Lock,
  Plus,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/brightcert/icon-tile";
import { Card } from "@/components/brightcert/card";
import { SECTIONS } from "@/lib/questions";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import {
  getOverallStatus,
  getScoreColor,
  SCORE_STATUS_MAP,
  type Gap,
  type OverallStatus,
} from "@/types/assessment";

export const metadata: Metadata = { title: "Dashboard" };

const TARGET_SCORE = 70;

// The dashboard leads with a verdict, not a widget — an assessor's reading
// of where the organisation stands.
const VERDICT_SENTENCES: Record<OverallStatus, string> = {
  ready: "Ready for Cyber Essentials.",
  nearly_ready: "Nearly ready for Cyber Essentials.",
  needs_fixes: "Not yet ready for Cyber Essentials.",
  not_ready: "Not ready for Cyber Essentials.",
};

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

function shortDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function daysAgo(value: string | null | undefined) {
  if (!value) return null;
  const diff = Date.now() - new Date(value).getTime();
  const days = Math.max(0, Math.floor(diff / 86_400_000));
  if (days === 0) return "assessed today";
  if (days === 1) return "assessed yesterday";
  return `assessed ${days} days ago`;
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

// Thin meter with the 70% target as a rule — every score is read against
// the same line.
function Meter({
  value,
  color,
  target,
  className,
}: {
  value: number;
  color: string;
  target?: number;
  className?: string;
}) {
  return (
    <div className={cn("relative h-2 rounded-full bg-[#EEF2F7]", className)}>
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%`, backgroundColor: color }}
      />
      {target != null && (
        <span
          className="absolute -top-[3px] -bottom-[3px] w-[2px] rounded-full bg-[#0F2044]/45"
          style={{ left: `${target}%` }}
          aria-hidden
        />
      )}
    </div>
  );
}

function OverallStatusChip({ status }: { status: OverallStatus }) {
  const meta = SCORE_STATUS_MAP[status];
  const Icon = status === "ready" ? CheckCircle2 : status === "nearly_ready" ? AlertTriangle : XCircle;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ color: meta.color, backgroundColor: meta.bgColor }}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {meta.label}
    </span>
  );
}

function EmptyState() {
  return (
    <div>
      <DashboardHeader />
      <Card className="rounded-[16px] p-8 text-center sm:p-12">
        <IconTile icon={ClipboardList} size="lg" className="mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-[#0F2044]">Start your first assessment</h2>
        <p className="mx-auto mt-2 mb-6 max-w-md text-sm leading-relaxed text-[#64748B]">
          Complete a Cyber Essentials readiness assessment to see your score, identify gaps, and unlock a practical report.
        </p>
        <Button asChild>
          <Link href="/assessment/new">Start Assessment</Link>
        </Button>
      </Card>
    </div>
  );
}

function DashboardHeader({ subtitle }: { subtitle?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F2044] sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-[#64748B]">{subtitle ?? "Your Cyber Essentials readiness overview"}</p>
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
      <Card className="rounded-[16px] p-8">
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
            <Link href={`/assessment/${assessment.id}`}>Continue Assessment</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

function SubmittedState({ assessment }: { assessment: AssessmentRow }) {
  return (
    <div>
      <DashboardHeader />
      <Card className="rounded-[16px] p-8">
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
      </Card>
    </div>
  );
}

function VerdictBand({
  latest,
  p1Count,
  scoreChange,
  previousDate,
}: {
  latest: AssessmentRow;
  p1Count: number;
  scoreChange: number | null;
  previousDate: string | null;
}) {
  const score = latest.overall_score ?? 0;
  const status = (latest.overall_status ?? getOverallStatus(score)) as OverallStatus;
  const verdict = VERDICT_SENTENCES[status] ?? VERDICT_SENTENCES[getOverallStatus(score)];
  const scoreColor = getScoreColor(score);

  return (
    <Card as="section" className="mb-4 p-6 lg:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-12">
        <div className="flex shrink-0 items-baseline justify-center gap-1 md:justify-start">
          <span
            className="font-display text-[64px] font-bold leading-none tracking-tight tabular-nums"
            style={{ color: scoreColor }}
          >
            {score}
          </span>
          <span className="text-2xl font-bold text-[#94A3B8]">%</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <OverallStatusChip status={status} />
            {scoreChange != null && previousDate && (
              <span
                className={cn(
                  "text-xs font-semibold tabular-nums",
                  scoreChange < 0 ? "text-[#B91C1C]" : "text-[#047857]"
                )}
              >
                {scoreChange < 0 ? "▼" : "▲"} {Math.abs(scoreChange)} pts since {previousDate}
              </span>
            )}
          </div>

          <h2 className="font-display mb-5 text-2xl font-bold tracking-tight text-[#0F2044] sm:text-[26px]">
            {verdict}
          </h2>

          <Meter value={score} color={scoreColor} target={TARGET_SCORE} />
          <div className="mt-1.5 flex justify-between text-[11px] text-[#94A3B8]">
            <span>0</span>
            <span className="font-medium text-[#64748B]">Target {TARGET_SCORE}%</span>
            <span>100</span>
          </div>

          <p className="mt-4 text-sm text-[#475569]">
            {p1Count > 0
              ? `Fix the ${p1Count} critical ${p1Count === 1 ? "issue" : "issues"} below to move towards the ${TARGET_SCORE}% target.`
              : "No critical blockers are open. Review the control areas before applying."}{" "}
            <Link
              href={`/assessment/${latest.id}/results`}
              className="font-semibold text-[#047857] hover:text-[#065F46]"
            >
              What does my score mean? →
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
}

function ControlMeters({ latest, controls }: { latest: AssessmentRow; controls: ControlScoreRow[] }) {
  const statusMeta: Record<string, { label: string; color: string; bg: string; icon: LucideIcon }> = {
    pass: { label: "On track", color: "#065F46", bg: "#ECFDF5", icon: CheckCircle2 },
    warning: { label: "Needs work", color: "#92400E", bg: "#FFFBEB", icon: AlertTriangle },
    fail: { label: "At risk", color: "#B91C1C", bg: "#FEF2F2", icon: XCircle },
    missing: { label: "Not scored", color: "#64748B", bg: "#F1F5F9", icon: Clock },
  };

  return (
    <Card as="section" className="p-0">
      <div className="flex items-center justify-between border-b border-[#F1F5F9] px-5 py-3.5">
        <h2 className="text-sm font-semibold text-[#0F2044]">Control areas</h2>
        <span className="text-[11px] text-[#94A3B8]">Target {TARGET_SCORE}%</span>
      </div>
      {SECTIONS.map((section) => {
        const control = controls.find((row) => row.section_id === section.id);
        const score = control?.score ?? 0;
        const meta = statusMeta[control?.status ?? "missing"] ?? statusMeta.missing;
        const Icon = meta.icon;

        return (
          <Link
            key={section.id}
            href={`/assessment/${latest.id}/results`}
            className="flex items-center gap-3 border-t border-[#F1F5F9] px-5 py-3 transition-colors first:border-t-0 hover:bg-[#F8FAFC] sm:gap-4"
          >
            <span className="w-3 shrink-0 text-xs font-semibold text-[#94A3B8]">{section.id}</span>
            <span className="w-32 shrink-0 truncate text-sm font-medium text-[#0F2044] sm:w-40">
              {section.shortTitle}
            </span>
            <Meter
              value={score}
              color={control ? getScoreColor(score) : "#CBD5E1"}
              target={TARGET_SCORE}
              className="hidden flex-1 sm:block"
            />
            <span className="ml-auto w-11 shrink-0 text-right text-sm font-bold tabular-nums text-[#0F2044] sm:ml-0">
              {control ? `${score}%` : "—"}
            </span>
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold sm:w-[110px]"
              style={{ color: meta.color, backgroundColor: meta.bg }}
            >
              <Icon className="h-3 w-3" strokeWidth={2} />
              {meta.label}
            </span>
          </Link>
        );
      })}
    </Card>
  );
}

function PriorityQueue({ latest, controls }: { latest: AssessmentRow; controls: ControlScoreRow[] }) {
  const p1Gaps = controls.flatMap((control) => {
    const section = SECTIONS.find((item) => item.id === control.section_id);
    return getGaps(control)
      .filter((gap) => gap.priority === "P1")
      .map((gap) => ({
        ...gap,
        sectionTitle: section?.shortTitle ?? "Control area",
      }));
  });

  return (
    <Card as="section" className="p-0">
      <div className="flex items-center justify-between border-b border-[#F1F5F9] px-5 py-3.5">
        <h2 className="text-sm font-semibold text-[#0F2044]">Fix these first</h2>
        {p1Gaps.length > 0 ? (
          <span className="inline-flex items-center rounded-full bg-[#FEF2F2] px-2.5 py-0.5 text-[11px] font-semibold text-[#B91C1C]">
            {p1Gaps.length} P1 {p1Gaps.length === 1 ? "issue" : "issues"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-semibold text-[#065F46]">
            <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
            None open
          </span>
        )}
      </div>

      {p1Gaps.length > 0 ? (
        <>
          {p1Gaps.slice(0, 5).map((gap, index) => (
            <Link
              key={`${gap.issue}-${index}`}
              href={`/assessment/${latest.id}/results#priority-actions`}
              className="flex items-center gap-3 border-t border-[#F1F5F9] px-5 py-3 transition-colors first:border-t-0 hover:bg-[#F8FAFC]"
            >
              <span className="shrink-0 rounded-[4px] border border-[#FECACA] bg-[#FEF2F2] px-1.5 py-0.5 text-[10px] font-bold text-[#B91C1C]">
                P1
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#0F2044]">{gap.issue}</span>
              <span className="hidden shrink-0 text-xs text-[#94A3B8] sm:block">{gap.sectionTitle}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-[#CBD5E1]" strokeWidth={1.5} />
            </Link>
          ))}
          <Link
            href={`/assessment/${latest.id}/results#priority-actions`}
            className="block border-t border-[#F1F5F9] px-5 py-3 text-[13px] font-semibold text-[#047857] transition-colors hover:bg-[#F8FAFC] hover:text-[#065F46]"
          >
            View all {p1Gaps.length} issues →
          </Link>
        </>
      ) : (
        <div className="px-5 py-4">
          <p className="text-sm font-medium text-[#0F2044]">No critical blockers found</p>
          <p className="mt-1 text-sm text-[#64748B]">Review the control areas and report notes before applying.</p>
        </div>
      )}
    </Card>
  );
}

function ReportCard({
  latest,
  reportUrl,
}: {
  latest: AssessmentRow;
  reportUrl: string | undefined;
}) {
  const isPaid = latest.status === "paid";
  const isAnalysed = latest.status === "analysed";

  const chip = reportUrl
    ? { label: "PDF ready", color: "#065F46", bg: "#ECFDF5" }
    : isPaid
      ? { label: "Generating", color: "#1E40AF", bg: "#EFF6FF" }
      : isAnalysed
        ? { label: "Ready to unlock", color: "#92400E", bg: "#FFFBEB" }
        : { label: "Locked", color: "#64748B", bg: "#F1F5F9" };

  return (
    <Card as="section" className="p-0">
      <div className="flex items-center justify-between border-b border-[#F1F5F9] px-5 py-3.5">
        <h2 className="text-sm font-semibold text-[#0F2044]">Readiness report</h2>
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={{ color: chip.color, backgroundColor: chip.bg }}
        >
          {chip.label}
        </span>
      </div>
      <div className="px-5 py-4">
        <p className="mb-4 text-[13px] leading-relaxed text-[#64748B]">
          Your score, key findings, and remediation roadmap from the {formatDate(latest.created_at)} assessment — as a PDF you can share with your IT provider.
        </p>
        {reportUrl ? (
          <Button asChild size="sm" className="w-full">
            <a href={reportUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </Button>
        ) : isPaid ? (
          <Button asChild size="sm" className="w-full">
            <Link href={`/assessment/${latest.id}/report`}>Generate report</Link>
          </Button>
        ) : isAnalysed ? (
          <Button asChild size="sm" className="w-full">
            <Link href={`/api/stripe/checkout?assessmentId=${latest.id}`}>
              <Lock className="h-4 w-4" />
              Unlock report · £199
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={`/assessment/${latest.id}/results`}>View results</Link>
          </Button>
        )}
        <p className="mt-3 text-center text-xs text-[#94A3B8]">
          <Link
            href={isPaid ? `/assessment/${latest.id}/report` : `/assessment/${latest.id}/results`}
            className="hover:text-[#0F2044]"
          >
            {isPaid ? "View report online →" : "View free results →"}
          </Link>
        </p>
      </div>
    </Card>
  );
}

function HistoryCard({
  assessments,
  reportMap,
}: {
  assessments: AssessmentRow[];
  reportMap: Map<string, string>;
}) {
  return (
    <Card as="section" className="p-0">
      <div className="border-b border-[#F1F5F9] px-5 py-3.5">
        <h2 className="text-sm font-semibold text-[#0F2044]">History</h2>
      </div>
      {assessments.slice(0, 5).map((assessment, index) => {
        const reportUrl = reportMap.get(assessment.id);
        const href =
          assessment.status === "draft"
            ? `/assessment/${assessment.id}`
            : `/assessment/${assessment.id}/results`;

        return (
          <div
            key={assessment.id}
            className="flex items-center gap-3 border-t border-[#F1F5F9] px-5 py-3 first:border-t-0"
          >
            <span className="w-10 shrink-0 text-sm font-bold tabular-nums text-[#0F2044]">
              {assessment.overall_score != null ? `${assessment.overall_score}%` : "—"}
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-[#64748B]">
              #{assessments.length - index} · {shortDate(assessment.created_at)}
            </span>
            <StatusBadge status={assessment.status} />
            {assessment.status === "paid" && reportUrl ? (
              <a
                href={reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#047857] hover:text-[#065F46]"
              >
                PDF
              </a>
            ) : (
              <Link href={href} className="text-xs font-semibold text-[#047857] hover:text-[#065F46]">
                {assessment.status === "draft" ? "Continue" : "View"}
              </Link>
            )}
          </div>
        );
      })}
    </Card>
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
  const latestReportUrl = reportMap.get(latest.id);
  const lastActivity = latest.submitted_at ?? latest.created_at;

  return (
    <div>
      <DashboardHeader subtitle={`Your Cyber Essentials readiness · ${daysAgo(lastActivity) ?? "overview"}`} />

      <VerdictBand
        latest={latest}
        p1Count={p1Count}
        scoreChange={scoreChange}
        previousDate={previousWithScore ? formatDate(previousWithScore.created_at) : null}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4">
          <ControlMeters latest={latest} controls={latestControls} />
          <PriorityQueue latest={latest} controls={latestControls} />
        </div>
        <div className="space-y-4">
          <ReportCard latest={latest} reportUrl={latestReportUrl} />
          <HistoryCard assessments={assessments} reportMap={reportMap} />
        </div>
      </div>
    </div>
  );
}
