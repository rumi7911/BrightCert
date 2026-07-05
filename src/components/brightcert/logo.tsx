import { cn } from "@/lib/utils";

// Vector brand mark: navy tile, white check, emerald corner.
// The corner triangle is pre-clipped along the tile's 12px corner arc so no
// clipPath (and no unique id) is needed; the mark stays RSC-safe.
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <rect width="48" height="48" rx="12" fill="#0F2044" />
      <path d="M0 30 L18 48 L12 48 A12 12 0 0 1 0 36 Z" fill="#059669" />
      <path
        d="M13.5 24.5 L21 32 L34.5 16.5"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type LogoProps = {
  /** Light variant for navy backgrounds */
  light?: boolean;
  className?: string;
  markClassName?: string;
  textClassName?: string;
};

export function Logo({ light = false, className, markClassName = "h-8 w-8", textClassName = "text-xl" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={markClassName} />
      <span className={cn("font-display font-bold leading-none tracking-tight", textClassName)}>
        <span className={light ? "text-white" : "text-[#0F2044]"}>Bright</span>
        <span className={light ? "text-[#6EE7B7]" : "text-[#047857]"}>Cert</span>
      </span>
    </span>
  );
}
