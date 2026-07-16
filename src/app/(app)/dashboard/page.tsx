import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Download,
  Lock,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/brightcert/icon-tile";
import { Card } from "@/components/brightcert/card";
import { DotStatus, SectionHeader } from "@/components/brightcert/ledger";
import { SECTIONS } from "@/lib/questions";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import {
  getOverallStatus,
  getScoreColor,
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

const CONTROL_STATUS = {
  pass: { label: "On track", dot: "#059669" },
  warning: { label: "Needs work", dot: "#D97706" },
  fail: { label: "At risk", dot: "#DC2626" },
  missing: { label: "Not scored", dot: "#CBD5E1" },
} as const;

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
    <div className="mb-6 flex flex-col gap-4 border-b border-[#EEF1F6] pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#0F2044] sm:text-2xl">Dashboard</h1>
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

// Option A's dark verdict band: the navy hero carrying the assessor's verdict,
// the score, the delta, and the target meter — over the marketing site's glow.
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
    <section className="relative mb-8 overflow-hidden rounded-[14px] bg-[#0C1A38] px-6 py-6 sm:px-8 sm:py-7">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-36 right-[-70px] h-80 w-80 rounded-full bg-[#059669]/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-44 left-[-90px] h-80 w-80 rounded-full bg-[#2563EB]/15 blur-3xl"
      />
      <div aria-hidden className="bg-noise pointer-events-none absolute inset-0 opacity-[0.04]" />

      <div className="relative">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6EE7B7]">
          Readiness verdict
        </p>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:gap-8">
          <div className="flex shrink-0 items-baseline gap-1">
            {/* The one gradient-type moment in the app (approved blend B+C) */}
            <span className="font-display bg-[linear-gradient(100deg,#fff_30%,#6EE7B7_95%)] bg-clip-text text-[68px] font-extrabold leading-none tracking-tight text-transparent tabular-nums sm:text-[76px]">
              {score}
            </span>
            <span className="text-[26px] font-bold text-[#8DA0C4]">%</span>
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-[22px] font-bold leading-snug tracking-tight text-white sm:text-2xl">
              {verdict}
            </h2>
            <p className="mt-1.5 text-[13px] text-[#A9B8D6]">
              {scoreChange != null && previousDate && (
                <>
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      scoreChange < 0 ? "text-[#FCA5A5]" : "text-[#6EE7B7]"
                    )}
                  >
                    {scoreChange < 0 ? "▼" : "▲"} {Math.abs(scoreChange)} pts
                  </span>{" "}
                  since {previousDate} ·{" "}
                </>
              )}
              {p1Count > 0
                ? `${p1Count} critical ${p1Count === 1 ? "issue" : "issues"} open`
                : "no critical issues open"}
              {" · "}
              <Link
                href={`/assessment/${latest.id}/results`}
                className="bc-focus-light font-semibold text-[#6EE7B7] hover:text-white"
              >
                What does my score mean? →
              </Link>
            </p>
          </div>
        </div>

        <div className="relative mt-6 h-1.5 max-w-2xl rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(Math.max(score, 0), 100)}%`,
              backgroundColor: scoreColor,
              boxShadow: `0 0 16px ${scoreColor}88`,
            }}
          />
          <span
            className="absolute -top-1 -bottom-1 w-[2px] rounded-full bg-[#6EE7B7]"
            style={{ left: `${TARGET_SCORE}%` }}
            aria-hidden
          />
        </div>
        <div className="relative mt-1.5 flex max-w-2xl justify-between text-[10.5px] text-[#A9B8D6]">
          <span>0</span>
          {/* Label sits under the tick it describes, not at the meter's centre */}
          <span
            className="absolute -translate-x-1/2 whitespace-nowrap"
            style={{ left: `${TARGET_SCORE}%` }}
          >
            Target {TARGET_SCORE}%
          </span>
          <span>100</span>
        </div>
      </div>
    </section>
  );
}

function MiniMeter({ value, color }: { value: number; color: string }) {
  return (
    <span className="relative inline-block h-[5px] w-[130px] rounded-full bg-[#F0F3F8] align-middle">
      <span
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%`, backgroundColor: color }}
      />
      <span
        className="absolute -top-[3px] -bottom-[3px] w-[1.5px] rounded-full bg-[#99A2B4]"
        style={{ left: `${TARGET_SCORE}%` }}
        aria-hidden
      />
    </span>
  );
}

function ControlTable({ latest, controls }: { latest: AssessmentRow; controls: ControlScoreRow[] }) {
  return (
    <div>
      <SectionHeader
        title="Control areas"
        action={
          <Link
            href={`/assessment/${latest.id}/results`}
            className="bc-focus text-xs font-semibold text-[#047857] hover:text-[#065F46]"
          >
            Full results →
          </Link>
        }
      />
      <div>
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-b border-[#EEF1F6] py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#64748B]">
                Control
              </th>
              <th className="hidden border-b border-[#EEF1F6] py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#64748B] sm:table-cell">
                Progress to {TARGET_SCORE}%
              </th>
              <th className="border-b border-[#EEF1F6] py-2 text-right text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#64748B]">
                Score
              </th>
              <th className="border-b border-[#EEF1F6] py-2 text-right text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#64748B]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {SECTIONS.map((section) => {
              const control = controls.find((row) => row.section_id === section.id);
              const score = control?.score ?? 0;
              const status = (control?.status ?? "missing") as keyof typeof CONTROL_STATUS;

              return (
                <tr key={section.id}>
                  <td className="border-b border-[#F4F6FA] py-2.5 pr-4 text-[#33405C]">
                    <b className="font-semibold text-[#0F2044]">{section.id}.</b> {section.shortTitle}
                  </td>
                  <td className="hidden border-b border-[#F4F6FA] py-2.5 pr-4 sm:table-cell">
                    <MiniMeter value={score} color={control ? getScoreColor(score) : "#CBD5E1"} />
                  </td>
                  <td className="border-b border-[#F4F6FA] py-2.5 pr-4 text-right font-bold tabular-nums text-[#0F2044]">
                    {control ? `${score}%` : "—"}
                  </td>
                  <td className="border-b border-[#F4F6FA] py-2.5 text-right">
                    <DotStatus
                      label={(CONTROL_STATUS[status] ?? CONTROL_STATUS.missing).label}
                      color={(CONTROL_STATUS[status] ?? CONTROL_STATUS.missing).dot}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FixFirstList({ latest, controls }: { latest: AssessmentRow; controls: ControlScoreRow[] }) {
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
    <div className="mt-8">
      <SectionHeader
        title="Fix these first"
        action={
          p1Gaps.length > 0 ? (
            <Link
              href={`/assessment/${latest.id}/results#priority-actions`}
              className="bc-focus text-xs font-semibold text-[#047857] hover:text-[#065F46]"
            >
              All {p1Gaps.length} →
            </Link>
          ) : undefined
        }
      />
      {p1Gaps.length > 0 ? (
        <div className="border-t border-[#EEF1F6]">
          {p1Gaps.slice(0, 5).map((gap, index) => (
            <Link
              key={`${gap.issue}-${index}`}
              href={`/assessment/${latest.id}/results#priority-actions`}
              className="bc-focus flex items-baseline gap-4 border-b border-[#F4F6FA] py-2.5 transition-colors hover:bg-[#F8FAFC]"
            >
              <span className="min-w-0 flex-1 truncate text-[13px] text-[#33405C]">{gap.issue}</span>
              <span className="shrink-0 text-xs text-[#64748B]">{gap.sectionTitle}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="border-t border-[#EEF1F6] pt-3 text-[13px] text-[#77829A]">
          No critical blockers found. Review the control areas and report notes before applying.
        </p>
      )}
    </div>
  );
}

function ReportSection({
  latest,
  reportUrl,
}: {
  latest: AssessmentRow;
  reportUrl: string | undefined;
}) {
  const isPaid = latest.status === "paid";
  const isAnalysed = latest.status === "analysed";

  return (
    <div>
      <SectionHeader title="Readiness report" />
      <p className="mb-3 text-xs leading-relaxed text-[#77829A]">
        Your score, key findings, and remediation roadmap from the {formatDate(latest.created_at)}{" "}
        assessment — as a PDF you can hand to your IT provider.
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
      <p className="mt-2.5 text-center text-xs text-[#64748B]">
        <Link
          href={isPaid ? `/assessment/${latest.id}/report` : `/assessment/${latest.id}/results`}
          className="bc-focus hover:text-[#0F2044]"
        >
          {isPaid ? "View report online →" : "View free results →"}
        </Link>
      </p>
    </div>
  );
}

function HistorySection({
  assessments,
  reportMap,
}: {
  assessments: AssessmentRow[];
  reportMap: Map<string, string>;
}) {
  return (
    <div className="mt-7 border-t border-[#EEF1F6] pt-4">
      <SectionHeader title="History" />
      <div>
        {assessments.slice(0, 5).map((assessment, index) => {
          const reportUrl = reportMap.get(assessment.id);
          const href =
            assessment.status === "draft"
              ? `/assessment/${assessment.id}`
              : `/assessment/${assessment.id}/results`;

          return (
            <div
              key={assessment.id}
              className="flex items-baseline gap-2 border-b border-[#F4F6FA] py-2 text-[13px]"
            >
              <span className="font-bold tabular-nums text-[#0F2044]">
                {assessment.overall_score != null ? `${assessment.overall_score}%` : "—"}
              </span>
              <span className="min-w-0 flex-1 truncate text-[#77829A]">
                · #{assessments.length - index} · {shortDate(assessment.created_at)}
              </span>
              {assessment.status === "paid" && reportUrl ? (
                <a
                  href={reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bc-focus shrink-0 text-xs font-semibold text-[#047857] hover:text-[#065F46]"
                >
                  PDF
                </a>
              ) : (
                <Link
                  href={href}
                  className="bc-focus shrink-0 text-xs font-semibold text-[#047857] hover:text-[#065F46]"
                >
                  {assessment.status === "draft" ? "Continue" : "View"}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
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
        previousDate={previousWithScore ? shortDate(previousWithScore.created_at) : null}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <ControlTable latest={latest} controls={latestControls} />
          <FixFirstList latest={latest} controls={latestControls} />
        </div>
        <div>
          <ReportSection latest={latest} reportUrl={latestReportUrl} />
          <HistorySection assessments={assessments} reportMap={reportMap} />
        </div>
      </div>
    </div>
  );
}
