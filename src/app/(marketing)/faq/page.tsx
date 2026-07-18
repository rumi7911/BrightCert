import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/brightcert/json-ld";
import { Reveal } from "@/components/brightcert/reveal";
import { SignalNav } from "@/components/brightcert/signal-nav";
import { SignalFooter } from "@/components/brightcert/signal-footer";
import { ScrollProgress } from "@/components/brightcert/scroll-progress";
import { GlowLink } from "@/components/brightcert/glow-link";
import { Tag, SectionTitle, Mark, BTN_EMERALD } from "@/components/brightcert/signal-primitives";
import { FaqAccordion, type FaqItem } from "@/components/brightcert/faq-accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about BrightCert: what it is, what Cyber Essentials is, how long the assessment takes, what you get, and how certification works.",
  alternates: { canonical: "/faq" },
};

// Copy is verbatim from COPY.md (FAQ Page section)
const FAQS: FaqItem[] = [
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
    <div className="bg-[#F3F4EC]">
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
      <ScrollProgress />
      <SignalNav />

      <main className="pt-[150px] pb-24">
        <section className="pb-20">
          <div className="max-w-[1180px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-[clamp(44px,6vw,90px)] items-start">
            <div className="lg:sticky lg:top-[130px]">
              <Reveal>
                <Tag>FAQs</Tag>
              </Reveal>
              <Reveal delay={100}>
                <SectionTitle>
                  <Mark>Frequently</Mark> asked questions
                </SectionTitle>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-[#475569] text-[clamp(1rem,1.4vw,1.13rem)] leading-[1.7] mt-[22px] mb-7">
                  Everything UK SMEs usually want to know about BrightCert and Cyber Essentials.
                </p>
                <p className="text-sm text-[#64748B]">
                  Still have questions?{" "}
                  <a href="mailto:hello@brightcert.co.uk" className="bc-focus font-semibold text-[#059669] hover:underline">
                    Contact us
                  </a>
                </p>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <FaqAccordion items={FAQS} />
            </Reveal>
          </div>
        </section>

        <section>
          <Reveal className="max-w-[1180px] mx-auto px-4">
            <div className="rounded-[30px] border border-[#0F2044]/[0.07] bg-white px-6 py-12 sm:px-12 sm:py-14 text-center">
              <p className="text-[#475569] text-base mb-7">Ready to see where your business stands?</p>
              <GlowLink href="/assessment/new" className={`${BTN_EMERALD} justify-center`}>
                <span>Start your assessment</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
              </GlowLink>
            </div>
          </Reveal>
        </section>
      </main>

      <SignalFooter />
    </div>
  );
}
