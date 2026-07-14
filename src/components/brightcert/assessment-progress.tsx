"use client";

import { useParams, usePathname } from "next/navigation";
import { SECTIONS, getSection } from "@/lib/questions";
import { cn } from "@/lib/utils";

// Five-segment progress indicator for the focused assessment flow —
// one segment per control area, driven by the current route.
export function AssessmentProgress() {
  const params = useParams<{ sectionId?: string }>();
  const pathname = usePathname();

  const isCheckAnswers = pathname.endsWith("/check-answers");
  const currentId = isCheckAnswers ? 6 : parseInt(params.sectionId ?? "1", 10);
  const section = getSection(currentId);
  const label = isCheckAnswers
    ? "Check your answers"
    : `Section ${currentId} of 5 · ${section?.shortTitle ?? ""}`;

  return (
    <div className="flex flex-col items-center gap-1.5" aria-label={label}>
      <div className="flex items-center gap-1.5" aria-hidden>
        {SECTIONS.map((s) => (
          <span
            key={s.id}
            className={cn(
              "h-1 w-6 rounded-full sm:w-9",
              s.id < currentId
                ? "bg-[#059669]"
                : s.id === currentId
                  ? "bg-[#059669]/40"
                  : "bg-[#E2E8F0]"
            )}
          />
        ))}
      </div>
      <p className="hidden sm:block text-[11px] leading-none text-[#77829A]">{label}</p>
    </div>
  );
}
