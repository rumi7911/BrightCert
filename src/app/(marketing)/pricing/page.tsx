import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificationDisclaimer } from "@/components/brightcert/certification-disclaimer";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple pricing for Cyber Essentials readiness. Start free, pay £199 to unlock your full report.",
};

export default function PricingPage() {
  return (
    <div className="bg-[#F8FAFC] py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0F2044] mb-4">Simple pricing for Cyber Essentials readiness</h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            BrightCert helps you understand your Cyber Essentials readiness before you invest more time, money, or internal resources. Complete the assessment for free. Unlock your full readiness report when you are ready.
          </p>
        </div>

        {/* Hero pricing */}
        <div className="rounded-[16px] border-2 border-[#047857] bg-white p-8 max-w-lg mx-auto text-center mb-12">
          <p className="text-sm font-bold text-[#047857] uppercase tracking-wider mb-2">Assessment Report</p>
          <div className="text-5xl font-bold text-[#0F2044] mb-1">£199</div>
          <p className="text-[#64748B] mb-6">one-time payment</p>
          <p className="text-sm text-[#475569] mb-6">
            Get a clear readiness score, control-by-control analysis, and a practical remediation report for your business.
          </p>
          <Button asChild size="lg" className="w-full">
            <Link href="/assessment/new">Start Assessment</Link>
          </Button>
          <p className="text-xs text-[#64748B] mt-3">
            You can complete the assessment first and unlock the full report after your results are ready.
          </p>
        </div>

        {/* What is included */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-xl font-bold text-[#0F2044] mb-6 text-center">What is included</h2>
          <div className="space-y-3">
            {[
              { label: "Guided assessment", desc: "Answer structured questions across all five Cyber Essentials control areas." },
              { label: "AI-assisted analysis", desc: "Receive clear scoring, gap findings, and remediation suggestions based on your responses." },
              { label: "Readiness score", desc: "See how close your business is to being ready before applying." },
              { label: "Practical report", desc: "Download a PDF report with your results, gaps, and recommended next steps." },
              { label: "UK SME focus", desc: "Built specifically for UK small and medium-sized businesses preparing for Cyber Essentials." },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#059669] shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="text-sm font-semibold text-[#0F2044]">{item.label}</span>
                  <span className="text-sm text-[#64748B]"> — {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-xl font-bold text-[#0F2044] mb-6 text-center">Pricing FAQ</h2>
          <div className="space-y-6">
            {[
              { q: "Do I need to pay before starting?", a: "No. You can begin the assessment first. Payment is required to unlock the full report and PDF download." },
              { q: "Does BrightCert issue the Cyber Essentials certificate?", a: "No. BrightCert helps you prepare. Official certification is provided through IASME Certification Bodies." },
              { q: "Is this suitable for non-technical users?", a: "Yes. BrightCert is designed to explain Cyber Essentials preparation in plain English." },
              { q: "Can I share the report with my IT provider?", a: "Yes. The report is designed to help internal teams, external IT providers, and business owners understand what needs attention." },
              { q: "Is this for UK businesses only?", a: "Yes. BrightCert is built for UK SMEs preparing for Cyber Essentials." },
            ].map((item) => (
              <div key={item.q}>
                <p className="text-sm font-semibold text-[#0F2044] mb-1">{item.q}</p>
                <p className="text-sm text-[#64748B]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <CertificationDisclaimer />
      </div>
    </div>
  );
}
