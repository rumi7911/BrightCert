import { Logo } from "@/components/brightcert/logo";

const PRODUCT_LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#what-we-check", label: "What we check" },
  { href: "#report", label: "Your report" },
  { href: "#pricing", label: "Pricing" },
];

const COMPANY_LINKS = [
  { href: "#founder", label: "Founder's note" },
  { href: "#who", label: "Who it's for" },
  { href: "#faq", label: "FAQs" },
  { href: "#cta", label: "Start assessment" },
];

export function HomeFooter() {
  return (
    <footer className="bg-gradient-to-b from-[#0F2044] to-[#0A1730] text-white pt-20 pb-9">
      <div className="max-w-[1180px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_0.8fr_0.8fr_1.2fr] gap-10 md:gap-14 pb-12 border-b border-white/10">
          <div>
            <a href="#top" className="inline-flex items-center" aria-label="BrightCert home">
              <Logo light markClassName="h-8 w-8" textClassName="text-lg" />
            </a>
            <p className="mt-5 text-sm leading-relaxed text-white/60 max-w-[38ch]">
              BrightCert helps UK SMEs prepare for Cyber Essentials with guided assessments, readiness scoring, gap analysis, and practical remediation reports.
            </p>
          </div>

          <nav className="flex flex-col gap-3" aria-label="Product">
            <strong className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Product</strong>
            {PRODUCT_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="w-fit text-[14.5px] text-white/65 transition-all hover:text-[#6EE7B7] hover:translate-x-0.5">
                {l.label}
              </a>
            ))}
          </nav>

          <nav className="flex flex-col gap-3" aria-label="Company">
            <strong className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Company</strong>
            {COMPANY_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="w-fit text-[14.5px] text-white/65 transition-all hover:text-[#6EE7B7] hover:translate-x-0.5">
                {l.label}
              </a>
            ))}
          </nav>

          <div>
            <strong className="block text-[11px] font-bold uppercase tracking-[0.18em] text-white/45 mb-3">Honest by design</strong>
            <p className="text-[12.5px] leading-relaxed text-white/45">
              BrightCert provides readiness assessment and preparation support. We do not issue official Cyber Essentials certification: official certification is provided through IASME Certification Bodies.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 pt-7 text-[11px] tracking-wide text-white/40">
          <p>&copy; {new Date().getFullYear()} Cognumi Ltd. All rights reserved. Registered in England and Wales.</p>
          <p>Designed for clarity &middot; Built for UK SMEs</p>
        </div>
      </div>
    </footer>
  );
}
