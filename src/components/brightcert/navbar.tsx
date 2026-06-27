"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/#what-we-check", label: "What we check" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#for-msps", label: "For MSPs" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-[#0F2044] text-lg">
          <ShieldCheck className="h-6 w-6 text-[#047857]" strokeWidth={1.5} />
          BrightCert
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#475569] hover:text-[#0F2044] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-sm text-[#475569] hover:text-[#0F2044] transition-colors"
          >
            Sign in
          </Link>
          <Button asChild size="sm">
            <Link href="/assessment/new">Start Assessment</Link>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-[#475569]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 py-4 flex flex-col gap-4">
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
