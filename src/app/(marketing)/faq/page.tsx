import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/brightcert/json-ld";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about BrightCert: what it is, what Cyber Essentials is, how long the assessment takes, what you get, and how certification works.",
  alternates: { canonical: "/faq" },
};

// Copy is verbatim from COPY.md (FAQ Page section)
const FAQS = [
  {
    q: "What is BrightCert?",
    a: "BrightCert is a Cyber Essentials readiness platform for UK SMEs. It helps businesses assess their current position, identify gaps, and prepare before applying for official certification.",
  },
  {
    q: "Does BrightCert issue Cyber Essentials certification?",
    a: "No. BrightCert does not issue the official Cyber Essentials certificate. BrightCert provides readiness assessment, gap analysis, and preparation support. Official certification is handled through IASME Certification Bodies.",
  },
  {
    q: "What is Cyber Essentials?",
    a: "Cyber Essentials is a UK Government-backed scheme designed to help organisations protect themselves against common online threats.",
  },
  {
    q: "Who is BrightCert for?",
    a: "BrightCert is for UK SMEs that want to understand how ready they are for Cyber Essentials before applying. It is also useful for business owners, operations managers, internal IT teams, and MSPs supporting SME clients.",
  },
  {
    q: "How long does the assessment take?",
    a: "Most businesses complete the assessment in around 2 hours.",
  },
  {
    q: "What do I get after the assessment?",
    a: "You receive a readiness score, control-by-control analysis, gap findings, and prioritised remediation steps. You can unlock the full report and PDF download for £199.",
  },
  {
    q: "What are the five Cyber Essentials control areas?",
    a: "1. Boundary Firewalls & Internet Gateways, 2. Secure Configuration, 3. User Access Control, 4. Malware Protection, 5. Security Update Management.",
  },
  {
    q: "Can I use BrightCert instead of a Certification Body?",
    a: "No. BrightCert is a preparation tool. You still need to apply through the official certification route when you are ready.",
  },
  {
    q: "Is BrightCert suitable if I already have an IT provider?",
    a: "Yes. BrightCert can help you organise your current position and create a clearer action list to review with your IT provider.",
  },
  {
    q: "Is my report a guarantee that I will pass Cyber Essentials?",
    a: "No. Your BrightCert report is a readiness report, not a certification decision or pass guarantee. It helps you identify likely gaps and prepare more effectively before applying.",
  },
];

export default function FaqPage() {
  return (
    <div className="bg-[#F8FAFC]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />

      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-12 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F2044] mb-4 leading-tight">
              Frequently asked questions
            </h1>
            <p className="text-[#475569]">
              Still have questions?{" "}
              <a
                href="mailto:hello@brightcert.co.uk"
                className="bc-focus font-semibold text-[#047857] hover:underline"
              >
                Contact us
              </a>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2">
            {FAQS.map((item) => (
              <div key={item.q}>
                <h2 className="text-base font-medium text-[#0F2044] mb-2">{item.q}</h2>
                <p className="text-sm text-[#475569] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 border-t border-[#E2E8F0] pt-10">
            <p className="text-[#475569] mb-5">
              Ready to see where your business stands?
            </p>
            <Button asChild size="lg">
              <Link href="/assessment/new">Start Your Assessment</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
