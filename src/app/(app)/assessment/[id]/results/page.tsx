import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, XCircle, Lock, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificationDisclaimer } from "@/components/brightcert/certification-disclaimer";
import { ScoreCircle } from "@/components/brightcert/score-circle";
import { IconTile } from "@/components/brightcert/icon-tile";
import { SECTIONS } from "@/lib/questions";
import { createClient } from "@/lib/supabase/server";
import type { ControlScore, Gap } from "@/types/assessment";
import { getScoreColor } from "@/types/assessment";

export const metadata: Metadata = { title: "Your Results" };

const STATUS_CONFIG = {
  pass: { color: "#065F46", bg: "#ECFDF5", label: "Pass", icon: CheckCircle2 },
  warning: { color: "#92400E", bg: "#FFFBEB", label: "Review needed", icon: AlertTriangle },
  fail: { color: "#B91C1C", bg: "#FEF2F2", label: "Needs work", icon: XCircle },
} as const;

// Decorative filler for the pre-payment blur curtain. Deliberately generic —
// the real findings are never sent to the browser until the report is paid.
const LOCKED_PLACEHOLDERS = [
  {
    issue: "Cloud services are not protected by dedicated network security controls.",
    why: "Even though your services run in the cloud, they still need protection from unauthorised access and internet-based attacks.",
  },
  {
    issue: "Firewall rules are not reviewed on a regular schedule.",
    why: "Outdated or overly permissive rules create security holes that allow attackers to bypass your defences.",
  },
  {
    issue: "Default credentials remain in place on some devices and software.",
    why: "Default usernames and passwords are publicly known and are a common first target for attackers.",
  },
  {
    issue: "Access rights are broader than staff need for their day-to-day roles.",
    why: "Excess permissions increase the impact of a compromised account and the risk of accidental exposure.",
  },
  {
    issue: "Endpoint protection is not consistently deployed across the estate.",
    why: "Unprotected devices are exposed to malware, ransomware, and other malicious software.",
  },
  {
    issue: "Security updates are not applied automatically where possible.",
    why: "Delayed patching leaves known vulnerabilities open for attackers to exploit.",
  },
];

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

function StatusPill({ status }: { status: ControlScore["status"] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <Icon className="h-3 w-3" strokeWidth={2} />
      {cfg.label}
    </span>
  );
}

// Paid view: expandable card with the full summary and gap list
function ControlCard({ control }: { control: ControlScore }) {
  const section = SECTIONS.find((s) => s.id === control.sectionId);

  return (
    <div className="rounded-[12px] border border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(15,32,68,0.05)] transition-all duration-200 hover:shadow-[0_8px_24px_-8px_rgba(15,32,68,0.12)]">
      <details>
        <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-[#E2E8F0] flex items-center justify-center text-sm font-bold text-[#64748B] shrink-0">
              {control.sectionId}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F2044]">{section?.title}</p>
              <p className="text-xs text-[#64748B] mt-0.5">{truncate(control.summary, 80)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-3">
            <div className="text-right hidden sm:block">
              <p className="text-lg font-bold" style={{ color: getScoreColor(control.score) }}>
                {control.score}%
              </p>
            </div>
            <StatusPill status={control.status} />
            <ChevronDown className="h-4 w-4 text-[#94A3B8]" />
          </div>
        </summary>
        <div className="border-t border-[#F1F5F9] px-5 pb-5 pt-4">
          <p className="text-sm text-[#475569] mb-4 leading-relaxed">{control.summary}</p>
          {control.gaps.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#0F2044] mb-2">Gaps identified</p>
              <ul className="space-y-2">
                {control.gaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                      style={{
                        color: gap.priority === "P1" ? "#B91C1C" : gap.priority === "P2" ? "#92400E" : "#475569",
                        backgroundColor: gap.priority === "P1" ? "#FEF2F2" : gap.priority === "P2" ? "#FFFBEB" : "#F1F5F9",
                      }}
                    >
                      {gap.priority}
                    </span>
                    <div>
                      <p className="text-sm text-[#334155]">{gap.issue}</p>
                      <p className="text-xs text-[#64748B]">{gap.why}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}

// Unpaid view: score + status only, no expandable detail
function ControlRow({ control }: { control: Pick<ControlScore, "sectionId" | "score" | "status"> }) {
  const section = SECTIONS.find((s) => s.id === control.sectionId);

  return (
    <div className="rounded-[12px] border border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(15,32,68,0.05)] flex items-center justify-between p-5">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[#E2E8F0] flex items-center justify-center text-sm font-bold text-[#64748B] shrink-0">
          {control.sectionId}
        </div>
        <p className="text-sm font-semibold text-[#0F2044]">{section?.title}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-3">
        <p className="text-lg font-bold" style={{ color: getScoreColor(control.score) }}>
          {control.score}%
        </p>
        <StatusPill status={control.status} />
      </div>
    </div>
  );
}

function P1Item({ issue, why }: { issue: string; why: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[10px] border border-[#FECACA] bg-[#FEF6F6] p-4">
      <span className="text-xs font-bold bg-[#DC2626] text-white px-1.5 py-0.5 rounded shrink-0 mt-0.5">P1</span>
      <div>
        <p className="text-sm font-medium text-[#0F2044]">{issue}</p>
        <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{why}</p>
      </div>
    </div>
  );
}

function UnlockCard({ assessmentId }: { assessmentId: string }) {
  return (
    <div className="rounded-[16px] border-2 border-[#047857] bg-white p-6 shadow-[0_24px_60px_-16px_rgba(15,32,68,0.4)]">
      <div className="flex items-start gap-4 mb-5">
        <IconTile icon={Lock} size="sm" />
        <div>
          <h3 className="text-base font-bold text-[#0F2044]">Unlock your full readiness report</h3>
          <p className="text-sm text-[#64748B] mt-1">
            Get a detailed PDF report with all findings, remediation steps, and preparation guidance.
          </p>
        </div>
      </div>
      <ul className="space-y-1.5 mb-5">
        {[
          "Executive summary",
          "Control-by-control gap analysis",
          "Prioritised P1, P2, P3 remediation roadmap",
          "Step-by-step fix instructions",
          "Preparation notes for your Certification Body",
          "PDF download: save, print, or share with your IT provider",
        ].map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-[#475569]">
            <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" strokeWidth={1.5} />
            {feature}
          </li>
        ))}
      </ul>
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href={`/api/stripe/checkout?assessmentId=${assessmentId}`}>
            Unlock Full Report · £199
          </Link>
        </Button>
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <FileText className="h-4 w-4" strokeWidth={1.5} />
          One-time payment. Instant PDF access.
        </div>
      </div>
    </div>
  );
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

  const controls: ControlScore[] = rows.map((row) => ({
    sectionId: row.section_id as 1 | 2 | 3 | 4 | 5,
    score: row.score,
    status: row.status as "pass" | "warning" | "fail",
    summary: row.summary ?? "",
    gaps: (row.gaps as Gap[]) ?? [],
    remediation: row.remediation ?? [],
  }));

  const isPaid = assessment.status === "paid";
  const overallScore = assessment.overall_score ?? 0;
  const fullSummary =
    assessment.executive_summary ??
    "Your assessment has been analysed. Review the control areas below to understand your readiness gaps and priority actions.";
  // Pre-payment, only a teaser of the executive summary leaves the server
  const executiveSummary = isPaid ? fullSummary : truncate(fullSummary, 220);

  const p1Gaps = controls.flatMap((c) =>
    c.gaps.filter((g) => g.priority === "P1").map((g) => ({ ...g, sectionId: c.sectionId }))
  );
  const firstP1 = p1Gaps[0];
  const lockedP1Count = Math.max(0, p1Gaps.length - 1);
  const placeholders = LOCKED_PLACEHOLDERS.slice(0, Math.max(3, Math.min(lockedP1Count, 6)));

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-[#0F2044] mb-1">Your readiness results</h1>
      <p className="text-sm text-[#64748B] mb-6">Based on your assessment responses</p>

      {/* Score summary */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 mb-5 shadow-[0_1px_3px_rgba(15,32,68,0.06),0_16px_48px_-16px_rgba(15,32,68,0.1)]">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <ScoreCircle score={overallScore} size="lg" />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-[#0F2044] mb-2">Overall readiness score</h2>
            <p className="text-sm text-[#475569] leading-relaxed">{executiveSummary}</p>
            {!isPaid && (
              <p className="text-xs text-[#94A3B8] mt-2">Full executive summary included in your report.</p>
            )}
          </div>
        </div>
      </div>

      {/* Certification disclaimer — mandatory */}
      <div className="mb-6">
        <CertificationDisclaimer />
      </div>

      {/* Control area cards */}
      <h2 className="text-base font-semibold text-[#0F2044] mb-3">Results by control area</h2>
      <div className="space-y-3 mb-8">
        {controls.map((control) =>
          isPaid ? (
            <ControlCard key={control.sectionId} control={control} />
          ) : (
            <ControlRow key={control.sectionId} control={control} />
          )
        )}
      </div>

      {/* P1 priority actions */}
      {p1Gaps.length > 0 && (
        <div id="priority-actions" className="mb-8 scroll-mt-24">
          <h2 className="text-base font-semibold text-[#0F2044] mb-3">
            Priority P1 actions{" "}
            <span className="font-semibold text-[#B91C1C]">· {p1Gaps.length} found</span>
          </h2>

          {isPaid ? (
            <div className="space-y-2.5">
              {p1Gaps.map((gap, i) => (
                <P1Item key={i} issue={gap.issue} why={gap.why} />
              ))}
            </div>
          ) : (
            <>
              {/* One real finding as proof of quality */}
              {firstP1 && (
                <div className="mb-2.5">
                  <P1Item issue={firstP1.issue} why={firstP1.why} />
                </div>
              )}

              {/* Frosted curtain: decorative placeholder rows (the real
                  findings are never sent to the browser) + floating unlock card */}
              <div className="relative min-h-[560px]">
                <div className="space-y-2.5 blur-[6px] select-none pointer-events-none" aria-hidden>
                  {placeholders.map((item, i) => (
                    <P1Item key={i} issue={item.issue} why={item.why} />
                  ))}
                </div>
                <div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white"
                  aria-hidden
                />
                <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
                  <div className="w-full max-w-[560px]">
                    <UnlockCard assessmentId={assessmentId} />
                  </div>
                </div>
              </div>
              {lockedP1Count > 0 && (
                <p className="mt-3 text-center text-xs text-[#94A3B8]">
                  {lockedP1Count} more P1 {lockedP1Count === 1 ? "issue" : "issues"}, plus all P2 and
                  P3 actions, in your full report.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Below the fold: unlock card for edge cases without P1s; report link when paid */}
      {isPaid ? (
        <div className="rounded-[16px] border border-[#A7F3D0] bg-[#ECFDF5] p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#047857] shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <h3 className="text-base font-bold text-[#0F2044]">Your full report is unlocked</h3>
                <p className="text-sm text-[#475569] mt-0.5">
                  View the complete findings, remediation roadmap, and download your PDF.
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="w-full sm:w-auto shrink-0">
              <Link href={`/assessment/${assessmentId}/report`}>View full report</Link>
            </Button>
          </div>
        </div>
      ) : (
        p1Gaps.length === 0 && <UnlockCard assessmentId={assessmentId} />
      )}
    </div>
  );
}
