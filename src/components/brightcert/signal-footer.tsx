"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brightcert/logo";

type FooterLink = { label: string; href?: string; anchor?: string };

const PRODUCT_LINKS: FooterLink[] = [
  { label: "How it works", href: "/how-it-works" },
  { label: "What we check", anchor: "what-we-check" },
  { label: "Your report", anchor: "report" },
  { label: "Pricing", href: "/pricing" },
];

const RESOURCES_LINKS: FooterLink[] = [
  { label: "Founder's note", anchor: "founder" },
  { label: "Who it's for", anchor: "who" },
  { label: "FAQs", href: "/faq" },
  { label: "Articles", href: "/blog" },
  { label: "Start assessment", href: "/assessment/new" },
];

const COMPANY_LINKS: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact us", href: "mailto:hello@brightcert.co.uk" },
];

export function SignalFooter() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const resolve = (link: FooterLink) => link.href ?? (isHome ? `#${link.anchor}` : `/#${link.anchor}`);

  return (
    <footer className="bg-gradient-to-b from-[#0F2044] to-[#0A1730] text-white pt-20 pb-9">
      <div className="max-w-[1180px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.6fr_1fr] gap-x-8 gap-y-10 md:gap-14 pb-12 border-b border-white/10">
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center" aria-label="BrightCert home">
              <Logo light markClassName="h-8 w-8" textClassName="text-lg" />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-white/60 max-w-[38ch]">
              BrightCert helps UK SMEs prepare for Cyber Essentials with guided assessments, readiness scoring, gap analysis, and practical remediation reports.
            </p>
          </div>

          <nav className="flex flex-col gap-3" aria-label="Product">
            <strong className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Product</strong>
            {PRODUCT_LINKS.map((l) => (
              <a key={l.label} href={resolve(l)} className="w-fit text-[14.5px] text-white/65 transition-all hover:text-[#6EE7B7] hover:translate-x-0.5">
                {l.label}
              </a>
            ))}
          </nav>

          <nav className="flex flex-col gap-3" aria-label="Resources">
            <strong className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Resources</strong>
            {RESOURCES_LINKS.map((l) => (
              <a key={l.label} href={resolve(l)} className="w-fit text-[14.5px] text-white/65 transition-all hover:text-[#6EE7B7] hover:translate-x-0.5">
                {l.label}
              </a>
            ))}
          </nav>

          <nav className="flex flex-col gap-3 sm:col-span-2 md:col-span-1" aria-label="Company">
            <strong className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Company</strong>
            {COMPANY_LINKS.map((l) => (
              <a key={l.label} href={resolve(l)} className="w-fit text-[14.5px] text-white/65 transition-all hover:text-[#6EE7B7] hover:translate-x-0.5">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="sm:col-span-2 md:col-span-1">
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
