import Link from "next/link";
import { CheckCircle2, ChevronDown, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificationDisclaimer } from "@/components/brightcert/certification-disclaimer";
import { DotStatus, PageHeader, SectionHeader } from "@/components/brightcert/ledger";
import { ScoreCircle } from "@/components/brightcert/score-circle";
import { SECTIONS } from "@/lib/questions";
import type { ControlScore } from "@/types/assessment";

const STATUS_CONFIG = {
  pass: { label: "Pass", dot: "#059669" },
  warning: { label: "Review needed", dot: "#D97706" },
  fail: { label: "Needs work", dot: "#DC2626" },
} as const;

const PRIORITY_COLOR: Record<string, string> = {
  P1: "#B91C1C",
  P2: "#B45309",
  P3: "#475569",
};

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

// Paid view: hairline ledger row that discloses the full summary and gap list
function ControlDetailsRow({ control }: { control: ControlScore }) {
  const section = SECTIONS.find((s) => s.id === control.sectionId);
  const status = STATUS_CONFIG[control.status];

  return (
    <details className="group border-b border-[#F4F6FA]">
      <summary className="flex cursor-pointer list-none items-center gap-4 py-2.5 transition-colors hover:bg-[#F8FAFC]">
        <span className="min-w-0 flex-1 truncate text-[13px] text-[#33405C]">
          <b className="font-semibold text-[#0F2044]">{control.sectionId}.</b> {section?.title}
        </span>
        <span className="shrink-0 text-[13px] font-bold tabular-nums text-[#0F2044]">
          {control.score}%
        </span>
        <span className="w-[110px] shrink-0 text-right">
          <DotStatus label={status.label} color={status.dot} />
        </span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-[#99A2B4] transition-transform group-open:rotate-180"
          strokeWidth={1.5}
        />
      </summary>
      <div className="pb-4 pl-4 pr-1 pt-1">
        <p className="max-w-prose text-[13px] leading-relaxed text-[#47536B]">{control.summary}</p>
        {control.gaps.length > 0 && (
          <div className="mt-3">
            {control.gaps.map((gap, i) => (
              <div key={i} className="flex items-baseline gap-3 border-t border-[#F4F6FA] py-2">
                <span
                  className="shrink-0 text-[11px] font-bold tabular-nums"
                  style={{ color: PRIORITY_COLOR[gap.priority] ?? "#475569" }}
                >
                  {gap.priority}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-[#0F2044]">{gap.issue}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-[#77829A]">{gap.why}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}

// Unpaid view: score + status only, no disclosure
function ControlRow({ control }: { control: Pick<ControlScore, "sectionId" | "score" | "status"> }) {
  const section = SECTIONS.find((s) => s.id === control.sectionId);
  const status = STATUS_CONFIG[control.status];

  return (
    <div className="flex items-center gap-4 border-b border-[#F4F6FA] py-2.5">
      <span className="min-w-0 flex-1 truncate text-[13px] text-[#33405C]">
        <b className="font-semibold text-[#0F2044]">{control.sectionId}.</b> {section?.title}
      </span>
      <span className="shrink-0 text-[13px] font-bold tabular-nums text-[#0F2044]">
        {control.score}%
      </span>
      <span className="w-[110px] shrink-0 text-right">
        <DotStatus label={status.label} color={status.dot} />
      </span>
    </div>
  );
}

function P1Row({ issue, why }: { issue: string; why: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-[#F4F6FA] py-2.5">
      <span className="shrink-0 text-[11px] font-bold text-[#B91C1C]">P1</span>
      <span className="min-w-0">
        <span className="block text-[13px] font-medium text-[#0F2044]">{issue}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-[#77829A]">{why}</span>
      </span>
    </div>
  );
}

function UnlockCard({ assessmentId }: { assessmentId: string }) {
  return (
    <div className="rounded-[14px] border-2 border-[#047857] bg-white p-6 shadow-[0_24px_60px_-16px_rgba(15,32,68,0.4)]">
      <div className="mb-5 flex items-start gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]">
          <Lock className="h-4 w-4" strokeWidth={1.5} />
        </span>
        <div>
          <h3 className="text-base font-bold text-[#0F2044]">Unlock your full readiness report</h3>
          <p className="mt-1 text-sm text-[#64748B]">
            Get a detailed PDF report with all findings, remediation steps, and preparation guidance.
          </p>
        </div>
      </div>
      <ul className="mb-5 space-y-1.5">
        {[
          "Executive summary",
          "Control-by-control gap analysis",
          "Prioritised P1, P2, P3 remediation roadmap",
          "Step-by-step fix instructions",
          "Preparation notes for your Certification Body",
          "PDF download: save, print, or share with your IT provider",
        ].map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-[#475569]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#059669]" strokeWidth={1.5} />
            {feature}
          </li>
        ))}
      </ul>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
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

export type ResultsViewProps = {
  assessmentId: string;
  isPaid: boolean;
  overallScore: number;
  executiveSummary: string;
  controls: ControlScore[];
};

export function ResultsView({
  assessmentId,
  isPaid,
  overallScore,
  executiveSummary,
  controls,
}: ResultsViewProps) {
  const p1Gaps = controls.flatMap((c) =>
    c.gaps.filter((g) => g.priority === "P1").map((g) => ({ ...g, sectionId: c.sectionId }))
  );
  const firstP1 = p1Gaps[0];
  const lockedP1Count = Math.max(0, p1Gaps.length - 1);
  const placeholders = LOCKED_PLACEHOLDERS.slice(0, Math.max(3, Math.min(lockedP1Count, 6)));

  return (
    <div className="max-w-3xl">
      <PageHeader title="Your readiness results" subtitle="Based on your assessment responses" />

      {/* Overall score + executive summary */}
      <div className="mb-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <ScoreCircle score={overallScore} size="lg" />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h2 className="mb-2 text-[13px] font-semibold text-[#0F2044]">Overall readiness</h2>
          <p className="text-sm leading-relaxed text-[#47536B]">{executiveSummary}</p>
          {!isPaid && (
            <p className="mt-2 text-xs text-[#99A2B4]">
              Full executive summary included in your report.
            </p>
          )}
        </div>
      </div>

      {/* Certification disclaimer — mandatory */}
      <div className="mb-8">
        <CertificationDisclaimer />
      </div>

      {/* Control areas */}
      <div className="mb-8">
        <SectionHeader title="Results by control area" />
        <div className="border-t border-[#EEF1F6]">
          {controls.map((control) =>
            isPaid ? (
              <ControlDetailsRow key={control.sectionId} control={control} />
            ) : (
              <ControlRow key={control.sectionId} control={control} />
            )
          )}
        </div>
      </div>

      {/* P1 priority actions */}
      {p1Gaps.length > 0 && (
        <div id="priority-actions" className="mb-8 scroll-mt-24">
          <SectionHeader
            title="Priority P1 actions"
            action={
              <span className="text-xs font-semibold text-[#B91C1C]">{p1Gaps.length} found</span>
            }
          />

          {isPaid ? (
            <div className="border-t border-[#EEF1F6]">
              {p1Gaps.map((gap, i) => (
                <P1Row key={i} issue={gap.issue} why={gap.why} />
              ))}
            </div>
          ) : (
            <>
              {/* One real finding as proof of quality */}
              {firstP1 && (
                <div className="border-t border-[#EEF1F6]">
                  <P1Row issue={firstP1.issue} why={firstP1.why} />
                </div>
              )}

              {/* Frosted curtain: decorative placeholder rows (the real
                  findings are never sent to the browser) + floating unlock card */}
              <div className="relative min-h-[560px]">
                <div className="pointer-events-none select-none blur-[6px]" aria-hidden>
                  {placeholders.map((item, i) => (
                    <P1Row key={i} issue={item.issue} why={item.why} />
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
                <p className="mt-3 text-center text-xs text-[#99A2B4]">
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
        <div className="rounded-[12px] border border-[#A7F3D0] bg-[#ECFDF5] p-5">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#047857]" strokeWidth={1.5} />
              <div>
                <h3 className="text-sm font-bold text-[#0F2044]">Your full report is unlocked</h3>
                <p className="mt-0.5 text-[13px] text-[#47536B]">
                  View the complete findings, remediation roadmap, and download your PDF.
                </p>
              </div>
            </div>
            <Button asChild className="w-full shrink-0 sm:w-auto">
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
