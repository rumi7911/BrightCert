// Shared building blocks for "Signal & Paper" pages (paper background, navy
// #0F2044 / emerald #047857-#059669). Extracted from the homepage so
// subsequent pages in the same visual system don't redefine them.

export const BTN_INK =
  "group inline-flex items-center gap-2.5 rounded-full bg-[#0F2044] px-7 py-4 font-display text-[15.5px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(15,32,68,0.45)] transition-all duration-300 hover:bg-[#152a54] hover:-translate-y-0.5 hover:shadow-[0_20px_38px_-12px_rgba(15,32,68,0.5)]";
export const BTN_EMERALD =
  "group inline-flex items-center gap-2.5 rounded-full bg-[#047857] px-7 py-4 font-display text-[15.5px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(4,120,87,0.55)] transition-all duration-300 hover:bg-[#065F46] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-12px_rgba(4,120,87,0.6)]";
export const BTN_GHOST =
  "inline-flex items-center gap-2.5 rounded-full border border-[#0F2044]/[0.14] px-7 py-4 font-display text-[15.5px] font-semibold text-[#0F2044] transition-all duration-300 hover:bg-[#0F2044] hover:text-white hover:border-[#0F2044] hover:-translate-y-0.5";
// Glassmorphic pill for GlowLink (see glow-link.tsx): mostly-solid emerald
// with a touch of translucency + blur, so the rotating gradient halo reads
// through the edges without sacrificing the brand color's legibility.
export const BTN_GLOW =
  "group inline-flex items-center gap-2.5 rounded-full bg-[#047857]/[0.92] backdrop-blur-sm border border-white/[0.15] px-7 py-4 font-display text-[15.5px] font-semibold text-white shadow-[0_8px_28px_-6px_rgba(37,99,235,0.45)] transition-all duration-300 hover:bg-[#065F46] hover:-translate-y-0.5";

export function Tag({
  children,
  light = false,
  center = false,
}: {
  children: React.ReactNode;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <p
      className={`flex items-center gap-3 font-mono text-[11.5px] font-medium uppercase tracking-[0.22em] mb-[22px] ${
        light ? "text-white/55" : "text-[#64748B]"
      } ${center ? "justify-center" : ""}`}
    >
      <span className={`h-0.5 w-7 rounded-full ${light ? "bg-[#6EE7B7]" : "bg-[#059669]"}`} aria-hidden />
      {children}
    </p>
  );
}

export function SectionTitle({
  children,
  light = false,
  className = "",
}: {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <h2
      className={`font-display font-semibold text-[clamp(2rem,4.4vw,3.35rem)] leading-[1.04] tracking-[-0.025em] max-w-[16ch] ${
        light ? "text-white" : "text-[#0F2044]"
      } ${className}`}
    >
      {children}
    </h2>
  );
}

// Inline highlight marker matching the hero's "harder"/"Cyber Essentials"
// emphasis treatment. Text color is inherited by default (right for navy
// text on a light page); pass className="text-[#0F2044]" when using it
// inside a dark section, since the mint pill needs dark text for contrast.
export function Mark({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`rounded-[0.16em] bg-[#A7F3D0] px-[0.12em] box-decoration-clone ${className}`}>{children}</span>;
}
