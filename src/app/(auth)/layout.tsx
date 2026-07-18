import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/brightcert/logo";
import { Mark } from "@/components/brightcert/signal-primitives";

const TRUST_POINTS = [
  {
    title: "Plain-English questions",
    description: "No jargon-heavy compliance language.",
  },
  {
    title: "AI-assisted gap analysis",
    description: "Clear scoring across the five control areas.",
  },
  {
    title: "Practical remediation report",
    description: "Know what to fix before applying.",
  },
  {
    title: "UK-specific guidance",
    description: "Built around Cyber Essentials, GBP pricing, and SME needs.",
  },
];

const DISCLAIMER =
  "BrightCert provides readiness assessment. It does not issue official Cyber Essentials certification.";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden lg:flex w-[44%] max-w-[620px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0F2044] to-[#142A56] p-10 xl:p-14">
        {/* Ambient glow + grain */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-32 right-[-20%] h-[480px] w-[480px] rounded-full bg-[#059669]/[0.14] blur-[120px]" />
          <div className="absolute bottom-[-25%] left-[-20%] h-[420px] w-[420px] rounded-full bg-[#2563EB]/[0.08] blur-[120px]" />
          <div className="absolute inset-0 bg-noise opacity-[0.03]" />
        </div>

        <Link href="/" className="relative inline-flex w-fit" aria-label="BrightCert home">
          <Logo light markClassName="h-9 w-9" textClassName="text-xl" />
        </Link>

        <div className="relative">
          <h2 className="font-display text-3xl xl:text-[34px] font-bold leading-[1.15] tracking-tight text-white">
            Get <Mark className="text-[#0F2044]">Cyber Essentials</Mark> ready in 2 hours
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Built for UK businesses preparing for Cyber Essentials.
          </p>
          <ul className="mt-8 space-y-5">
            {TRUST_POINTS.map((point) => (
              <li key={point.title} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#6EE7B7]" strokeWidth={1.5} aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-white">{point.title}</p>
                  <p className="text-sm text-white/60">{point.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs leading-relaxed text-white/45">{DISCLAIMER}</p>
      </aside>

      {/* Form side */}
      <div className="flex flex-1 flex-col bg-[#F3F4EC]">
        {/* Mobile header (brand panel hidden below lg) */}
        <header className="flex h-16 items-center border-b border-[#0F2044]/[0.08] bg-[#F3F4EC] px-4 lg:hidden">
          <Link href="/" className="flex items-center" aria-label="BrightCert home">
            <Logo markClassName="h-7 w-7" textClassName="text-lg" />
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-12">
          {children}
        </main>

        <footer className="py-4 text-center text-xs text-[#64748B] lg:hidden">
          {DISCLAIMER}
        </footer>
      </div>
    </div>
  );
}
