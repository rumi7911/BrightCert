import { Users } from "lucide-react";

export function SocialProofBadge({ count }: { count: number }) {
  if (count < 1) return null;

  const label =
    count === 1
      ? "1 UK business has started a readiness assessment"
      : `${count.toLocaleString("en-GB")} UK businesses have started a readiness assessment`;

  return (
    <div className="absolute -bottom-5 left-4 md:left-8 z-10 flex items-center gap-3 rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3 shadow-[0_16px_40px_-12px_rgba(15,32,68,0.35)]">
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5]">
        <Users className="h-4 w-4 text-[#047857]" strokeWidth={1.5} aria-hidden />
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#059669] ring-2 ring-white" aria-hidden />
      </span>
      <p className="text-xs font-medium text-[#0F2044] leading-snug max-w-[180px]">{label}</p>
    </div>
  );
}
