import type { Metadata } from "next";
import { ArrowRight, Wifi, Settings, Users, Bug, RefreshCw } from "lucide-react";
import { JsonLd } from "@/components/brightcert/json-ld";
import { Reveal } from "@/components/brightcert/reveal";
import { SignalNav } from "@/components/brightcert/signal-nav";
import { SignalFooter } from "@/components/brightcert/signal-footer";
import { ScrollProgress } from "@/components/brightcert/scroll-progress";
import { GlowLink } from "@/components/brightcert/glow-link";
import { Tag, SectionTitle, Mark, BTN_GLOW } from "@/components/brightcert/signal-primitives";
import { HowItWorksRail, type RailStep } from "@/components/brightcert/how-it-works-rail";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Step-by-step guide to using BrightCert for Cyber Essentials readiness assessment.",
  alternates: { canonical: "/how-it-works" },
};

const HOW_TO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to prepare for Cyber Essentials with BrightCert",
  description:
    "Assess your Cyber Essentials readiness in around 2 hours: answer plain-English questions across the five control areas, review your readiness score and gaps, and unlock a prioritised remediation report.",
  totalTime: "PT2H",
  step: [
    {
      "@type": "HowToStep",
      name: "Create your assessment",
      text: "Enter basic information about your organisation, including business size, sector, and the systems you use.",
    },
    {
      "@type": "HowToStep",
      name: "Answer questions across five control areas",
      text: "Work through plain-English questions covering Boundary Firewalls & Internet Gateways, Secure Configuration, User Access Control, Malware Protection, and Security Update Management.",
    },
    {
      "@type": "HowToStep",
      name: "Review your readiness score",
      text: "BrightCert analyses your answers and gives you an overall readiness score, with pass, warning, or fail status for each control area.",
    },
    {
      "@type": "HowToStep",
      name: "Understand your gaps",
      text: "Each gap is explained in practical language: what the issue is, why it matters, and what to do next.",
    },
    {
      "@type": "HowToStep",
      name: "Unlock your full report",
      text: "Get a structured action plan as a PDF to share internally, review with your IT provider, or use before applying through an IASME-licensed Certification Body.",
    },
  ],
};

const CONTROL_AREAS = [
  { icon: Wifi, title: "Boundary Firewalls & Internet Gateways" },
  { icon: Settings, title: "Secure Configuration" },
  { icon: Users, title: "User Access Control" },
  { icon: Bug, title: "Malware Protection" },
  { icon: RefreshCw, title: "Security Update Management" },
];

const ControlAreaGrid = (
  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
    {CONTROL_AREAS.map(({ icon: Icon, title }, idx) => (
      <div
        key={title}
        className="flex items-center gap-2.5 rounded-[10px] border border-[#0F2044]/[0.07] bg-[#F3F4EC] px-3 py-2.5 text-[13px] text-[#475569]"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[#A7F3D0] text-[#0F2044]">
          <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
        </div>
        <span className="font-mono text-[10px] text-[#94A3B8]">0{idx + 1}</span>
        {title}
      </div>
    ))}
  </div>
);

const STEPS: RailStep[] = [
  {
    num: "01",
    title: "Create your assessment",
    body: "Start by entering basic information about your organisation, including your business size, sector, and the systems you use. This helps BrightCert understand the context of your answers and tailor the readiness analysis around your organisation.",
    tag: "Takes about 5 minutes to set up",
  },
  {
    num: "02",
    title: "Answer questions across five control areas",
    body: "The assessment is split into the five Cyber Essentials control areas. Each section is designed to be clear and manageable. You can work through the questions in order and see your progress as you go.",
    tag: "60 questions total · 12 per area",
    extra: ControlAreaGrid,
  },
  {
    num: "03",
    title: "Review your readiness score",
    body: "Once your assessment is complete, BrightCert analyses your answers and gives you an overall readiness score. You will also see how each control area is performing, with clear status labels such as pass, warning, or fail.",
    tag: "Pass · warning · fail per area",
  },
  {
    num: "04",
    title: "Understand your gaps",
    body: "BrightCert explains where your business may need improvement before applying for certification. Each gap is written in practical language, so you know what the issue is, why it matters, and what to do next.",
    tag: "Plain-English findings",
  },
  {
    num: "05",
    title: "Unlock your full report",
    body: "Your full report gives you a structured action plan that can be shared internally, reviewed with your IT provider, or used to support your preparation before applying through a Certification Body.",
    tag: "PDF · shareable with your team",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-[#F3F4EC]">
      <JsonLd data={HOW_TO_SCHEMA} />
      <ScrollProgress />
      <SignalNav />

      <main className="pt-[150px] pb-24">
        {/* ── HEADER ───────────────────────────────────────────────────── */}
        <section className="pb-16">
          <div className="max-w-[760px] mx-auto px-4 text-center">
            <Reveal>
              <Tag center>How it works</Tag>
            </Reveal>
            <Reveal delay={100}>
              <SectionTitle as="h1" className="mx-auto">
                <Mark>Cyber Essentials</Mark> preparation, step by step
              </SectionTitle>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-[#475569] text-[clamp(1rem,1.4vw,1.13rem)] leading-[1.7] mt-[22px]">
                BrightCert gives UK SMEs a clear way to prepare for Cyber Essentials before applying for official certification. Instead of starting with uncertainty, you start with a guided assessment.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── STEPS ────────────────────────────────────────────────────── */}
        <section className="pb-20">
          <div className="max-w-[880px] mx-auto px-4">
            <HowItWorksRail steps={STEPS} />
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="pb-20">
          <Reveal className="max-w-[880px] mx-auto px-4 text-center">
            <GlowLink href="/assessment/new" className={`${BTN_GLOW} justify-center`}>
              <span>Start your Cyber Essentials readiness assessment</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
            </GlowLink>
          </Reveal>
        </section>

        {/* ── DISCLAIMER ───────────────────────────────────────────────── */}
        <section>
          <Reveal className="max-w-[880px] mx-auto px-4">
            <div className="rounded-[16px] border border-[#0F2044]/[0.07] bg-white px-6 py-5 text-[12.5px] leading-relaxed text-[#475569]">
              <strong className="text-[#0F2044]">BrightCert</strong>{" "}provides Cyber Essentials readiness assessment and preparation support. BrightCert does not issue official Cyber Essentials certification: official certification is provided through IASME Certification Bodies.
            </div>
          </Reveal>
        </section>
      </main>

      <SignalFooter />
    </div>
  );
}
