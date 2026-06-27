import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, XCircle, Lock, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificationDisclaimer } from "@/components/brightcert/certification-disclaimer";
import { ScoreCircle } from "@/components/brightcert/score-circle";
import { SECTIONS } from "@/lib/questions";
import type { ControlScore } from "@/types/assessment";
import { getScoreColor } from "@/types/assessment";

export const metadata: Metadata = { title: "Your Results" };

// Mock data — replaced by Supabase fetch in Phase 4
const MOCK_RESULT = {
  overallScore: 71,
  overallStatus: "nearly_ready" as const,
  executiveSummary:
    "Your organisation has made good progress on Cyber Essentials. Three of the five control areas are performing well, but user access control and security update management require attention before you apply for certification. The priority actions below will help you address the most significant gaps.",
  controls: [
    {
      sectionId: 1 as const,
      score: 85,
      status: "pass" as const,
      summary: "Your firewall configuration is largely compliant. Default passwords have been changed and inbound rules are reviewed.",
      gaps: [{ issue: "Guest Wi-Fi not confirmed as separated", why: "Separation prevents guests from accessing internal systems", priority: "P2" as const }],
      remediation: [],
    },
    {
      sectionId: 2 as const,
      score: 78,
      status: "warning" as const,
      summary: "Most configuration controls are in place, but an asset inventory and software baseline are not yet documented.",
      gaps: [
        { issue: "No formal device inventory maintained", why: "You cannot secure what you do not know about", priority: "P2" as const },
        { issue: "No documented secure baseline for new devices", why: "Inconsistent setup leads to security gaps", priority: "P2" as const },
      ],
      remediation: [],
    },
    {
      sectionId: 3 as const,
      score: 58,
      status: "fail" as const,
      summary: "User access controls need significant improvement. MFA is not enabled for cloud services and there is no formal leaver process.",
      gaps: [
        { issue: "MFA not enabled on cloud services", why: "Without MFA, a stolen password is all an attacker needs", priority: "P1" as const },
        { issue: "No formal process for removing leavers", why: "Ex-employees with active accounts are a significant risk", priority: "P1" as const },
        { issue: "Admin and user accounts not separated", why: "Using admin accounts for daily tasks exposes privileged credentials", priority: "P2" as const },
      ],
      remediation: [],
    },
    {
      sectionId: 4 as const,
      score: 90,
      status: "pass" as const,
      summary: "Anti-malware protection is deployed and up to date across all devices. Email filtering is in place.",
      gaps: [],
      remediation: [],
    },
    {
      sectionId: 5 as const,
      score: 55,
      status: "fail" as const,
      summary: "Security updates are not being applied within the required 14-day window and there is no formal patch tracking process.",
      gaps: [
        { issue: "Security patches not applied within 14 days", why: "The 14-day requirement is a core Cyber Essentials control", priority: "P1" as const },
        { issue: "No patch tracking process in place", why: "Without tracking, it is impossible to confirm compliance", priority: "P1" as const },
        { issue: "Some software may be past end of support", why: "Unsupported software cannot receive security patches", priority: "P2" as const },
      ],
      remediation: [],
    },
  ] as ControlScore[],
};

function ControlCard({ control }: { control: ControlScore }) {
  const section = SECTIONS.find((s) => s.id === control.sectionId);
  const statusConfig = {
    pass: { color: "#065F46", bg: "#ECFDF5", label: "Pass", icon: CheckCircle2 },
    warning: { color: "#92400E", bg: "#FFFBEB", label: "Review needed", icon: AlertTriangle },
    fail: { color: "#B91C1C", bg: "#FEF2F2", label: "Needs work", icon: XCircle },
  }[control.status];

  const Icon = statusConfig.icon;

  return (
    <div className="rounded-[12px] border border-[#E2E8F0] bg-white">
      <details>
        <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-[#E2E8F0] flex items-center justify-center text-sm font-bold text-[#64748B] shrink-0">
              {control.sectionId}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F2044]">{section?.title}</p>
              <p className="text-xs text-[#64748B] mt-0.5">{control.summary.substring(0, 80)}...</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-3">
            <div className="text-right hidden sm:block">
              <p className="text-lg font-bold" style={{ color: getScoreColor(control.score) }}>{control.score}%</p>
            </div>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap"
              style={{ color: statusConfig.color, backgroundColor: statusConfig.bg }}
            >
              <Icon className="h-3 w-3" strokeWidth={2} />
              {statusConfig.label}
            </span>
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

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: assessmentId } = await params;
  const result = MOCK_RESULT; // Phase 4: fetch from Supabase

  const p1Gaps = result.controls.flatMap((c) =>
    c.gaps.filter((g) => g.priority === "P1").map((g) => ({ ...g, sectionId: c.sectionId }))
  );

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-[#0F2044] mb-1">Your readiness results</h1>
      <p className="text-sm text-[#64748B] mb-6">Based on your assessment responses</p>

      {/* Score summary */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 mb-5">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <ScoreCircle score={result.overallScore} size="lg" />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-[#0F2044] mb-2">Overall readiness score</h2>
            <p className="text-sm text-[#475569] leading-relaxed">{result.executiveSummary}</p>
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
        {result.controls.map((control) => (
          <ControlCard key={control.sectionId} control={control} />
        ))}
      </div>

      {/* P1 priority actions */}
      {p1Gaps.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-semibold text-[#0F2044] mb-3">Priority P1 actions</h2>
          <div className="rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] divide-y divide-[#FECACA]">
            {p1Gaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <span className="text-xs font-bold bg-[#DC2626] text-white px-1.5 py-0.5 rounded shrink-0 mt-0.5">P1</span>
                <div>
                  <p className="text-sm font-medium text-[#0F2044]">{gap.issue}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{gap.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report lock card */}
      <div className="rounded-[16px] border-2 border-[#047857] bg-white p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="h-10 w-10 rounded-[10px] bg-[#ECFDF5] flex items-center justify-center shrink-0">
            <Lock className="h-5 w-5 text-[#047857]" strokeWidth={1.5} />
          </div>
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
            "PDF download — save, print, or share with your IT provider",
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
              Unlock Full Report — £199
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <FileText className="h-4 w-4" strokeWidth={1.5} />
            One-time payment. Instant PDF access.
          </div>
        </div>
      </div>
    </div>
  );
}
