"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brightcert/logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/#what-we-check", label: "What we check" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#msp-partner", label: "For MSPs" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  // Homepage hero is navy — the navbar can float transparently over it.
  // Every other marketing page opens on a light background, so it stays solid there.
  const transparent = pathname === "/";

  return (
    <header className={cn("z-50 px-4", transparent ? "absolute top-4 inset-x-0" : "sticky top-4")}>
      <div
        className={cn(
          "max-w-6xl mx-auto rounded-[18px] pl-6 pr-3 py-3 flex items-center justify-between",
          transparent
            ? "bg-white/10 backdrop-blur-md border border-white/15"
            : "bg-white shadow-[0_8px_30px_-8px_rgba(15,32,68,0.25)]"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="BrightCert home">
          <Logo light={transparent} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                transparent
                  ? pathname === link.href
                    ? "text-white font-semibold"
                    : "text-white/75 hover:text-white"
                  : pathname === link.href
                    ? "text-[#0F2044] font-semibold"
                    : "text-[#475569] hover:text-[#0F2044]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className={transparent ? "border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30 shadow-none" : undefined}
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/assessment/new">Start Assessment</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className={cn("md:hidden p-2", transparent ? "text-white" : "text-[#475569]")}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden max-w-6xl mx-auto mt-2 rounded-[18px] bg-white shadow-[0_8px_30px_-8px_rgba(15,32,68,0.25)] px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#475569] hover:text-[#0F2044]"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-sm text-[#475569] hover:text-[#0F2044]"
            onClick={() => setMobileOpen(false)}
          >
            Sign in
          </Link>
          <Button asChild size="sm" className="w-full">
            <Link href="/assessment/new" onClick={() => setMobileOpen(false)}>
              Start Assessment
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}
