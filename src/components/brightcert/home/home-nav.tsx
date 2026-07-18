"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/brightcert/logo";
import { useMagnetic } from "./motion-hooks";

const NAV_LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#what-we-check", label: "What we check" },
  { href: "#report", label: "Report" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

function MagneticCta({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useMagnetic<HTMLAnchorElement>();
  return (
    <Link ref={ref} href="/assessment/new" className={className}>
      {children}
    </Link>
  );
}

export function HomeNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      if (y > 320 && y > lastY.current + 6) setHidden(true);
      else if (y < lastY.current - 4 || y < 320) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = NAV_LINKS.map((l) => ({ href: l.href, el: document.querySelector(l.href) })).filter(
      (t): t is { href: string; el: Element } => !!t.el
    );
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = targets.find((t) => t.el === entry.target);
          if (match) setActiveHref(match.href);
        });
      },
      { rootMargin: "-38% 0px -55% 0px" }
    );
    targets.forEach((t) => observer.observe(t.el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-3.5 left-0 right-0 z-[170] transition-transform duration-500 ${hidden ? "-translate-y-[calc(100%+20px)]" : ""}`}
      >
        <div className="max-w-[1180px] mx-auto px-4">
          <div
            className={`flex items-center justify-between gap-6 rounded-full border pl-5 pr-3 py-2.5 backdrop-blur-xl transition-all duration-300 ${
              scrolled
                ? "bg-[#F3F4EC]/90 border-[#0F2044]/10 shadow-[0_14px_34px_-14px_rgba(15,32,68,0.28)]"
                : "bg-[#F3F4EC]/70 border-[#0F2044]/10 shadow-[0_6px_24px_-12px_rgba(15,32,68,0.18)]"
            }`}
          >
            <a href="#top" className="flex items-center gap-2.5 group" aria-label="BrightCert home">
              <Logo
                markClassName="h-8 w-8 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105"
                textClassName="text-lg"
              />
            </a>

            <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    activeHref === link.href ? "text-[#0F2044]" : "text-[#475569] hover:text-[#0F2044] hover:bg-[#0F2044]/[0.05]"
                  }`}
                >
                  {link.label}
                  {activeHref === link.href && (
                    <span className="absolute left-1/2 bottom-1 h-1 w-1 -translate-x-1/2 rounded-full bg-[#059669]" aria-hidden />
                  )}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3.5">
              <Link href="/login" className="text-sm font-medium text-[#475569] hover:text-[#0F2044] transition-colors">
                Sign in
              </Link>
              <MagneticCta className="group inline-flex items-center gap-2 rounded-full bg-[#047857] px-5 py-2.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(4,120,87,0.55)] transition-all hover:bg-[#065F46] hover:-translate-y-0.5">
                <span>Start assessment</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
              </MagneticCta>
            </div>

            <button
              type="button"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-[#0F2044]/[0.12]"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-4 w-4 text-[#0F2044]" /> : <Menu className="h-4 w-4 text-[#0F2044]" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[160] flex flex-col justify-center items-start bg-[#F3F4EC] px-6 py-24 transition-all duration-500 ${
          mobileOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-3 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex flex-col gap-1 mb-10" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-display text-4xl font-semibold tracking-tight text-[#0F2044] py-2 transition-colors hover:text-[#059669]"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Link
          href="/assessment/new"
          onClick={() => setMobileOpen(false)}
          className="inline-flex items-center gap-2 rounded-full bg-[#047857] px-6 py-3.5 text-base font-semibold text-white"
        >
          Start assessment
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
        <p className="mt-auto text-xs font-medium uppercase tracking-[0.14em] text-[#64748B]">
          Cyber Essentials readiness for UK SMEs
        </p>
      </div>
    </>
  );
}
