import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificationDisclaimer } from "@/components/brightcert/certification-disclaimer";
import { Eyebrow } from "@/components/brightcert/eyebrow";
import { Reveal } from "@/components/brightcert/reveal";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple pricing for Cyber Essentials readiness. Start free, pay £199 to unlock your full report.",
};

const tiers = [
  {
    id: undefined,
    featured: true,
    name: "Assessment",
    price: "£199",
    period: "one-time",
    desc: "Best for UK SMEs preparing for Cyber Essentials and wanting a clear view before applying.",
    features: [
      "Guided CE readiness assessment",
      "Questions across all five control areas",
      "AI-assisted scoring and gap analysis",
      "Overall readiness score",
      "Control-by-control results",
      "Prioritised remediation steps",
      "Downloadable PDF report",
      "Plain-English preparation guidance",
    ],
    cta: { label: "Start Assessment", href: "/assessment/new" },
    note: "Complete first. Pay when you're ready to unlock.",
  },
  {
    id: undefined,
    featured: false,
    name: "Monitor",
    price: "£99",
    period: "/month",
    desc: "Businesses that want ongoing visibility after their initial readiness report.",
    features: [
      "Monthly readiness review",
      "Saved assessment history",
      "Ongoing remediation tracking",
      "Updated action list",
      "Report access",
      "Renewal preparation support",
    ],
    cta: { label: "Join Monitor", href: "/signup" },
    note: undefined,
  },
  {
    id: undefined,
    featured: false,
    name: "CE Plus Pack",
    price: "£499",
    period: "one-time",
    desc: "Businesses preparing for Cyber Essentials Plus before technical testing.",
    features: [
      "CE Plus preparation checklist",
      "Evidence collection guidance",
      "Device and system readiness review",
      "Remediation planning",
      "Internal preparation summary",
      "Priority support",
    ],
    cta: { label: "Prepare for CE Plus", href: "/signup" },
    note: undefined,
  },
  {
    id: "msp",
    featured: false,
    name: "MSP Partner",
    price: "£299",
    period: "/month",
    desc: "MSPs supporting multiple UK SME clients with Cyber Essentials preparation.",
    features: [
      "Multi-client dashboard",
      "Client assessment tracking",
      "Readiness reports",
      "Partner workflow tools",
      "Client remediation visibility",
      "MSP-focused reporting",
    ],
    cta: { label: "Become a Partner", href: "mailto:hello@brightcert.co.uk?subject=MSP%20Partner" },
    note: undefined,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-[#F8FAFC] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <Eyebrow center>Pricing</Eyebrow>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F2044] mb-5 leading-tight">
            Simple pricing for Cyber Essentials readiness
          </h1>
          <p className="text-lg text-[#475569] leading-relaxed">
            BrightCert helps you understand your Cyber Essentials readiness before you invest more time, money, or internal resources. Complete the assessment for free. Unlock your full readiness report when you are ready.
          </p>
        </Reveal>

        {/* Tier grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch mb-20">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              id={tier.id}
              className={
                tier.featured
                  ? "relative flex flex-col rounded-[16px] border-2 border-[#047857] bg-white p-6 shadow-[0_16px_40px_-12px_rgba(4,120,87,0.25)]"
                  : "flex flex-col rounded-[16px] border border-[#E2E8F0] bg-white p-6 transition-all duration-200 hover:shadow-[0_12px_32px_-12px_rgba(15,32,68,0.15)]"
              }
            >
              {tier.featured && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-[#047857] text-white text-[11px] font-semibold px-2.5 py-1 rounded-[4px] uppercase tracking-wide">Most Popular</span>
                </div>
              )}
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 mt-1 ${tier.featured ? "text-[#047857]" : "text-[#475569]"}`}>
                {tier.name}
              </p>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="font-display text-4xl font-bold text-[#0F2044] tabular-nums">{tier.price}</span>
                <span className="text-xs text-[#64748B]">{tier.period}</span>
              </div>
              <p className="text-xs text-[#475569] mb-5 min-h-[48px]">{tier.desc}</p>
              <ul className="space-y-2 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#475569]">
                    <Check className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${tier.featured ? "text-[#047857]" : "text-[#059669]"}`} strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Button asChild variant={tier.featured ? "cta" : "outline"} className="w-full">
                  <Link href={tier.cta.href}>{tier.cta.label}</Link>
                </Button>
                {tier.note && (
                  <p className="text-xs text-[#64748B] text-center mt-2">{tier.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* What is included */}
        <Reveal className="max-w-2xl mx-auto mb-20">
          <Eyebrow>What Is Included</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F2044] mb-8 leading-tight">
            Everything in your readiness report
          </h2>
          <div className="space-y-5">
            {[
              { label: "Guided assessment", desc: "Answer structured questions across all five Cyber Essentials control areas." },
              { label: "AI-assisted analysis", desc: "Receive clear scoring, gap findings, and remediation suggestions based on your responses." },
              { label: "Readiness score", desc: "See how close your business is to being ready before applying." },
              { label: "Practical report", desc: "Download a PDF report with your results, gaps, and recommended next steps." },
              { label: "UK SME focus", desc: "Built specifically for UK small and medium-sized businesses preparing for Cyber Essentials." },
            ].map((item) => (
              <div key={item.label} className="border-l-2 border-[#A7F3D0] pl-4">
                <p className="text-base font-semibold text-[#0F2044] mb-0.5">{item.label}</p>
                <p className="text-sm text-[#64748B]">{item.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* FAQ */}
        <Reveal className="max-w-2xl mx-auto mb-14">
          <Eyebrow>Pricing FAQ</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F2044] mb-6 leading-tight">
            Common pricing questions
          </h2>
          <div>
            {[
              { q: "Do I need to pay before starting?", a: "No. You can begin the assessment first. Payment is required to unlock the full report and PDF download." },
              { q: "Does BrightCert issue the Cyber Essentials certificate?", a: "No. BrightCert helps you prepare. Official certification is provided through IASME Certification Bodies." },
              { q: "Is this suitable for non-technical users?", a: "Yes. BrightCert is designed to explain Cyber Essentials preparation in plain English." },
              { q: "Can I share the report with my IT provider?", a: "Yes. The report is designed to help internal teams, external IT providers, and business owners understand what needs attention." },
              { q: "Is this for UK businesses only?", a: "Yes. BrightCert is built for UK SMEs preparing for Cyber Essentials." },
            ].map((item) => (
              <div key={item.q} className="border-b border-[#E2E8F0] py-5 last:border-b-0">
                <p className="text-base font-medium text-[#0F2044] mb-1.5">{item.q}</p>
                <p className="text-sm text-[#64748B] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="max-w-4xl mx-auto">
          <CertificationDisclaimer />
        </div>
      </div>
    </div>
  );
}
