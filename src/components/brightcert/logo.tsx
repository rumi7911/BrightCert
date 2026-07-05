import Image from "next/image";
import { cn } from "@/lib/utils";

// Brand mark: the BrightCert "B" (public/logo-mark.png, transparent background).
// The check is a transparent cutout, so on dark surfaces the mark sits on a
// white tile — pass `light` for that treatment.
export function LogoMark({ className = "h-8 w-8", light = false }: { className?: string; light?: boolean }) {
  if (light) {
    return (
      <span className={cn("inline-flex items-center justify-center rounded-[8px] bg-white", className)}>
        <Image src="/logo-mark.png" alt="" width={512} height={512} aria-hidden className="h-[72%] w-[72%] object-contain" />
      </span>
    );
  }
  return (
    <Image src="/logo-mark.png" alt="" width={512} height={512} aria-hidden className={cn("object-contain", className)} />
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
      <LogoMark className={markClassName} light={light} />
      <span className={cn("font-display font-bold leading-none tracking-tight", textClassName)}>
        <span className={light ? "text-white" : "text-[#0F2044]"}>Bright</span>
        <span className={light ? "text-[#6EE7B7]" : "text-[#047857]"}>Cert</span>
      </span>
    </span>
  );
}
