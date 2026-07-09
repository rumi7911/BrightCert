import { cn } from "@/lib/utils";

// Recurring icon treatment: a rounded emerald tile with a small corner
// accent, echoing the cut-corner triangle in the BrightCert "B" mark.
const SIZE_CONFIG = {
  sm: { tile: "h-10 w-10", icon: "h-5 w-5", radius: 10, notch: "h-2.5 w-2.5" },
  md: { tile: "h-11 w-11", icon: "h-5.5 w-5.5", radius: 10, notch: "h-2.5 w-2.5" },
  lg: { tile: "h-12 w-12", icon: "h-6 w-6", radius: 12, notch: "h-3 w-3" },
};

const TONE_CONFIG = {
  emerald: { bg: "bg-[#ECFDF5] group-hover:bg-[#D1FAE5]", icon: "text-[#047857]" },
  red: { bg: "bg-[#FEF2F2]", icon: "text-[#DC2626]" },
  slate: { bg: "bg-[#F1F5F9]", icon: "text-[#475569]" },
};

export function IconTile({
  icon: Icon,
  size = "md",
  tone = "emerald",
  className,
}: {
  icon: React.ElementType;
  size?: "sm" | "md" | "lg";
  tone?: "emerald" | "red" | "slate";
  className?: string;
}) {
  const config = SIZE_CONFIG[size];
  const toneConfig = TONE_CONFIG[tone];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 transition-colors",
        config.tile,
        toneConfig.bg,
        className
      )}
      style={{ borderRadius: config.radius }}
    >
      <Icon className={cn(config.icon, toneConfig.icon)} strokeWidth={1.5} aria-hidden />
      <span
        aria-hidden
        className={cn("absolute -bottom-1 -right-1", config.notch)}
        style={{
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          backgroundColor: "#059669",
        }}
      />
    </div>
  );
}
