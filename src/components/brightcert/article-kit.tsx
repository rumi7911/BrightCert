import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GlowLink } from "@/components/brightcert/glow-link";
import { BTN_EMERALD } from "@/components/brightcert/signal-primitives";

// Shared presentational pieces reused across the 4 blog articles. Each
// article's actual body prose/tables/lists stay bespoke per page — only the
// repeated chrome (header, callout, FAQ list, disclaimer, final CTA) lives
// here, in the "Signal & Paper" palette (paper bg, navy #0F2044, emerald
// #047857/#059669).

export function ArticleProse({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5 text-[15px] leading-relaxed text-[#475569]">{children}</div>;
}

export function ArticleHeader({
  title,
  byline,
  related,
}: {
  title: React.ReactNode;
  byline: string;
  related?: { href: string; label: string };
}) {
  return (
    <>
      <Link href="/blog" className="bc-focus inline-flex items-center gap-1.5 text-sm font-medium text-[#059669] hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Back to articles
      </Link>

      <h1 className="mt-6 font-display text-3xl md:text-[2.75rem] font-bold text-[#0F2044] leading-[1.1]">{title}</h1>
      <p className="mt-4 text-sm text-[#64748B]">{byline}</p>
      {related && (
        <p className="mt-2 text-sm text-[#94A3B8]">
          Part of our{" "}
          <Link href={related.href} className="text-[#059669] underline hover:no-underline">
            {related.label}
          </Link>
        </p>
      )}
    </>
  );
}

export function ShortAnswer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 rounded-[16px] border border-[#A7F3D0] bg-[#ECFDF5] p-6">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#059669] mb-2.5">Short answer</p>
      <p className="text-[15px] leading-relaxed text-[#065F46]">{children}</p>
    </div>
  );
}

export type ArticleFaqItem = { q: string; a: string };

export function ArticleFaqList({ items }: { items: ArticleFaqItem[] }) {
  return (
    <>
      <h2 className="mt-12 mb-5 font-display text-xl font-bold text-[#0F2044]">Frequently asked questions</h2>
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.q}>
            <h3 className="font-display text-base font-semibold text-[#0F2044] mb-1.5">{item.q}</h3>
            <p className="text-[15px] leading-relaxed text-[#475569]">{item.a}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export function ArticleDisclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-12 rounded-[16px] border border-[#0F2044]/[0.07] bg-white p-5">
      <p className="text-xs leading-relaxed text-[#64748B]">
        BrightCert helps UK businesses prepare for Cyber Essentials by assessing readiness, identifying gaps, and producing a practical report. BrightCert does not issue the official Cyber Essentials certificate. That comes from an IASME-licensed Certification Body.
      </p>
      <p className="mt-3 text-xs text-[#94A3B8]">Sources: {children}</p>
    </div>
  );
}

export function ArticleFinalCta({ prompt }: { prompt: string }) {
  return (
    <div className="relative mt-10 overflow-hidden rounded-[30px] bg-gradient-to-br from-[#0F2044] to-[#08152e] px-6 py-12 sm:px-12 sm:py-14 text-center">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04]" aria-hidden />
      <p className="relative text-white/70 text-base mb-7">{prompt}</p>
      <GlowLink href="/assessment/new" className={`relative ${BTN_EMERALD} justify-center`}>
        <span>Start your assessment</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
      </GlowLink>
    </div>
  );
}
