"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SECTIONS } from "@/lib/questions";
import { getScoreColor } from "@/types/assessment";
import { cn } from "@/lib/utils";

const TARGET_SCORE = 70;

const CONTROL_STATUS = {
  pass: { label: "On track", dot: "#059669" },
  warning: { label: "Needs work", dot: "#D97706" },
  fail: { label: "At risk", dot: "#DC2626" },
  missing: { label: "Not scored", dot: "#CBD5E1" },
} as const;

type IssueGap = { issue: string; why: string; priority: "P1" | "P2" | "P3" };

export type DashboardControl = {
  sectionId: number;
  score: number | null;
  status: string;
  gaps: IssueGap[];
};

function MiniMeter({ value, color }: { value: number; color: string }) {
  return (
    <span className="relative inline-block h-[5px] w-[130px] rounded-full bg-[#0F2044]/[0.06] align-middle">
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

// Shared client state: clicking a control-area row filters the "Fix these
// first" list below it to that area. Both panels are real, read-only views
// over real Gemini-scored data — no "mark fixed" here, since kimi's version
// of that is unpersisted client state that silently resets on refresh, which
// would misrepresent recorded progress on a compliance product.
export function DashboardIssues({
  assessmentId,
  controls,
}: {
  assessmentId: string;
  controls: DashboardControl[];
}) {
  const [areaFilter, setAreaFilter] = useState<number | null>(null);

  const p1Gaps = useMemo(
    () =>
      controls.flatMap((control) => {
        const section = SECTIONS.find((item) => item.id === control.sectionId);
        return control.gaps
          .filter((gap) => gap.priority === "P1")
          .map((gap) => ({ ...gap, sectionId: control.sectionId, sectionTitle: section?.shortTitle ?? "Control area" }));
      }),
    [controls]
  );

  const visibleGaps = areaFilter == null ? p1Gaps : p1Gaps.filter((gap) => gap.sectionId === areaFilter);
  const activeSection = areaFilter != null ? SECTIONS.find((item) => item.id === areaFilter) : null;

  return (
    <>
      <div className="rounded-[16px] border border-[#0F2044]/[0.07] bg-white p-5 sm:p-6">
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="font-display text-[15px] font-bold text-[#0F2044]">Control areas</h2>
          <Link
            href={`/assessment/${assessmentId}/results`}
            className="bc-focus text-xs font-semibold text-[#047857] hover:text-[#065F46]"
          >
            Full results →
          </Link>
        </div>
        <p className="mb-4 text-[11.5px] text-[#77829A]">Select a row to filter the issues below by control area.</p>

        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-b border-[#0F2044]/[0.07] py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#64748B]">
                Control
              </th>
              <th className="hidden border-b border-[#0F2044]/[0.07] py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#64748B] sm:table-cell">
                Progress to {TARGET_SCORE}%
              </th>
              <th className="border-b border-[#0F2044]/[0.07] py-2 text-right text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#64748B]">
                Score
              </th>
              <th className="border-b border-[#0F2044]/[0.07] py-2 text-right text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#64748B]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {SECTIONS.map((section) => {
              const control = controls.find((row) => row.sectionId === section.id);
              const score = control?.score ?? 0;
              const status = (control?.status ?? "missing") as keyof typeof CONTROL_STATUS;
              const active = areaFilter === section.id;
              const hasGaps = p1Gaps.some((gap) => gap.sectionId === section.id);

              return (
                <tr
                  key={section.id}
                  onClick={() => hasGaps && setAreaFilter(active ? null : section.id)}
                  aria-pressed={active}
                  className={cn(
                    "transition-colors",
                    hasGaps && "cursor-pointer hover:bg-[#F3F4EC]",
                    active && "bg-[#059669]/[0.06]"
                  )}
                >
                  <td className="border-b border-[#0F2044]/[0.05] py-2.5 pr-4 text-[#33405C]">
                    <span className={cn("font-semibold", active ? "text-[#047857]" : "text-[#0F2044]")}>{section.id}.</span>{" "}
                    {section.shortTitle}
                  </td>
                  <td className="hidden border-b border-[#0F2044]/[0.05] py-2.5 pr-4 sm:table-cell">
                    <MiniMeter value={score} color={control ? getScoreColor(score) : "#CBD5E1"} />
                  </td>
                  <td className="border-b border-[#0F2044]/[0.05] py-2.5 pr-4 text-right font-bold tabular-nums text-[#0F2044]">
                    {control ? `${score}%` : "—"}
                  </td>
                  <td className="border-b border-[#0F2044]/[0.05] py-2.5 text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#33405C]">
                      <span
                        className="h-[7px] w-[7px] rounded-full"
                        style={{ backgroundColor: (CONTROL_STATUS[status] ?? CONTROL_STATUS.missing).dot }}
                        aria-hidden
                      />
                      {(CONTROL_STATUS[status] ?? CONTROL_STATUS.missing).label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-[16px] border border-[#0F2044]/[0.07] bg-white p-5 sm:p-6">
        <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-[15px] font-bold text-[#0F2044]">
            Fix these first
            {activeSection && (
              <span className="ml-2 align-middle font-mono text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#047857]">
                {activeSection.shortTitle}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-3">
            {activeSection && (
              <button
                type="button"
                onClick={() => setAreaFilter(null)}
                className="bc-focus text-xs font-semibold text-[#64748B] hover:text-[#0F2044]"
              >
                Clear filter
              </button>
            )}
            {p1Gaps.length > 0 && (
              <Link
                href={`/assessment/${assessmentId}/results#priority-actions`}
                className="bc-focus text-xs font-semibold text-[#047857] hover:text-[#065F46]"
              >
                All {p1Gaps.length} →
              </Link>
            )}
          </div>
        </div>

        {visibleGaps.length > 0 ? (
          <div className="mt-3 divide-y divide-[#0F2044]/[0.05] border-t border-[#0F2044]/[0.07]">
            {visibleGaps.slice(0, 8).map((gap, index) => (
              <Link
                key={`${gap.issue}-${index}`}
                href={`/assessment/${assessmentId}/results#priority-actions`}
                className="bc-focus flex items-baseline gap-4 py-2.5 transition-colors hover:bg-[#F3F4EC]"
              >
                <span className="mt-[3px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#DC2626]" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-[13px] text-[#33405C]">{gap.issue}</span>
                <span className="shrink-0 text-xs text-[#64748B]">{gap.sectionTitle}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 border-t border-[#0F2044]/[0.07] pt-3 text-[13px] text-[#77829A]">
            No critical blockers found. Review the control areas and report notes before applying.
          </p>
        )}
      </div>
    </>
  );
}
