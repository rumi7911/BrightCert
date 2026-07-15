import { Users } from "lucide-react";

// Single-digit counts read as "nobody's here yet" to a sceptical SME owner —
// the opposite of social proof. Below this threshold both hero surfaces fall
// back to the COPY.md positioning line; the live number returns automatically
// the moment it's strong.
export const SOCIAL_PROOF_THRESHOLD = 25;

// Verbatim from COPY.md — the hero's positioning line
export const SOCIAL_PROOF_FALLBACK = "Built for UK businesses preparing for Cyber Essentials.";

export function getAssessmentCountLabel(count: number) {
  return `${count.toLocaleString("en-GB")} UK businesses have started a readiness assessment`;
}

export function SocialProofBadge({ count }: { count: number }) {
  const showCount = count >= SOCIAL_PROOF_THRESHOLD;
  const label = showCount ? getAssessmentCountLabel(count) : SOCIAL_PROOF_FALLBACK;

  return (
    <div className="absolute -bottom-5 left-4 md:left-8 z-10 flex items-center gap-3 rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3 shadow-[0_16px_40px_-12px_rgba(15,32,68,0.35)]">
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5]">
        <Users className="h-4 w-4 text-[#047857]" strokeWidth={1.5} aria-hidden />
        {showCount && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#059669] ring-2 ring-white" aria-hidden />
        )}
      </span>
      <p className="text-xs font-medium text-[#0F2044] leading-snug max-w-[180px]">{label}</p>
    </div>
  );
}
