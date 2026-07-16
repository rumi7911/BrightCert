import Link from "next/link";
import { Logo } from "@/components/brightcert/logo";

const footerColumns = [
  {
    heading: "Product",
    links: [
      { href: "/assessment/new", label: "Start Assessment" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/#monitor", label: "Monitor" },
      { href: "/#msp-partner", label: "MSP Partner" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/how-it-works", label: "Cyber Essentials readiness" },
      { href: "/#what-we-check", label: "The five control areas" },
      { href: "/faq", label: "FAQs" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "mailto:hello@brightcert.co.uk", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#0F2044] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <Logo light markClassName="h-8 w-8" textClassName="text-lg" />
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              BrightCert helps UK SMEs prepare for Cyber Essentials with guided assessments, readiness scoring, gap analysis, and practical remediation reports.
            </p>
          </div>

          {/* Columns */}
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold text-white mb-3">{col.heading}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#94A3B8] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider + disclaimer */}
        <div className="border-t border-[#1a3366] pt-6 space-y-3">
          <p className="text-xs text-[#64748B]">
            BrightCert provides Cyber Essentials readiness assessment and preparation support. BrightCert does not issue official Cyber Essentials certification. Official certification is provided through IASME Certification Bodies.
          </p>
          <p className="text-xs text-[#64748B]">
            © {new Date().getFullYear()} Cognumi Ltd. All rights reserved. Registered in England and Wales.
          </p>
        </div>
      </div>
    </footer>
  );
}
