import type { Metadata } from "next";
import Link from "next/link";
import { Wifi, Settings, Users, Bug, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificationDisclaimer } from "@/components/brightcert/certification-disclaimer";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Step-by-step guide to using BrightCert for Cyber Essentials readiness assessment.",
};

const controlAreas = [
  { icon: Wifi, title: "Boundary Firewalls & Internet Gateways" },
  { icon: Settings, title: "Secure Configuration" },
  { icon: Users, title: "User Access Control" },
  { icon: Bug, title: "Malware Protection" },
  { icon: RefreshCw, title: "Security Update Management" },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-[#F8FAFC] py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#0F2044] mb-4">Cyber Essentials preparation, step by step</h1>
        <p className="text-lg text-[#475569] mb-12 leading-relaxed">
          BrightCert gives UK SMEs a clear way to prepare for Cyber Essentials before applying for official certification. Instead of starting with uncertainty, you start with a guided assessment.
        </p>

        <div className="space-y-10 mb-16">
          {[
            {
              step: "01",
              title: "Create your assessment",
              body: "Start by entering basic information about your organisation, including your business size, sector, and the systems you use. This helps BrightCert understand the context of your answers and tailor the readiness analysis around your organisation.",
            },
            {
              step: "02",
              title: "Answer questions across five control areas",
              body: "The assessment is split into the five Cyber Essentials control areas. Each section is designed to be clear and manageable. You can work through the questions in order and see your progress as you go.",
              extra: (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {controlAreas.map(({ icon: Icon, title }, idx) => (
                    <div key={title} className="flex items-center gap-2 text-sm text-[#475569]">
                      <div className="h-6 w-6 rounded-[6px] bg-[#ECFDF5] flex items-center justify-center shrink-0">
                        <Icon className="h-3.5 w-3.5 text-[#047857]" strokeWidth={1.5} />
                      </div>
                      {idx + 1}. {title}
                    </div>
                  ))}
                </div>
              ),
            },
            {
              step: "03",
              title: "Review your readiness score",
              body: "Once your assessment is complete, BrightCert analyses your answers and gives you an overall readiness score. You will also see how each control area is performing, with clear status labels such as pass, warning, or fail.",
            },
            {
              step: "04",
              title: "Understand your gaps",
              body: "BrightCert explains where your business may need improvement before applying for certification. Each gap is written in practical language, so you know what the issue is, why it matters, and what to do next.",
            },
            {
              step: "05",
              title: "Unlock your full report",
              body: "Your full report gives you a structured action plan that can be shared internally, reviewed with your IT provider, or used to support your preparation before applying through a Certification Body.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-6">
              <div className="text-4xl font-bold text-[#E2E8F0] shrink-0 w-12 text-center">{item.step}</div>
              <div className="flex-1 pb-8 border-b border-[#E2E8F0] last:border-b-0">
                <h2 className="text-xl font-bold text-[#0F2044] mb-3">{item.title}</h2>
                <p className="text-[#475569] leading-relaxed">{item.body}</p>
                {"extra" in item && item.extra}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <Button asChild size="lg">
            <Link href="/assessment/new">Start your Cyber Essentials readiness assessment today</Link>
          </Button>
        </div>

        <CertificationDisclaimer />
      </div>
    </div>
  );
}
