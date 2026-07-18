import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { JsonLd } from "@/components/brightcert/json-ld";
import { Reveal } from "@/components/brightcert/reveal";
import { SignalNav } from "@/components/brightcert/signal-nav";
import { SignalFooter } from "@/components/brightcert/signal-footer";
import { ScrollProgress } from "@/components/brightcert/scroll-progress";
import { MagneticLink } from "@/components/brightcert/magnetic-link";
import { Tag, SectionTitle, Mark } from "@/components/brightcert/signal-primitives";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple pricing for Cyber Essentials readiness. Start free, pay £199 to unlock your full report.",
  alternates: { canonical: "/pricing" },
};

const PRICING_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "BrightCert pricing",
  url: "https://brightcert.co.uk/pricing",
  itemListElement: [
    {
      "@type": "Offer",
      name: "Assessment",
      price: "199",
      priceCurrency: "GBP",
      description:
        "Guided Cyber Essentials readiness assessment with AI-assisted scoring, gap analysis, prioritised remediation steps, and a downloadable PDF report. Free to complete; pay to unlock the full report.",
    },
    {
      "@type": "Offer",
      name: "Monitor",
      price: "99",
      priceCurrency: "GBP",
      description: "Monthly readiness review, remediation tracking, and renewal preparation support.",
    },
    {
      "@type": "Offer",
      name: "CE Plus Pack",
      price: "499",
      priceCurrency: "GBP",
      description: "Cyber Essentials Plus preparation: checklist, evidence collection guidance, and readiness review before technical testing.",
    },
    {
      "@type": "Offer",
      name: "MSP Partner",
      price: "299",
      priceCurrency: "GBP",
      description: "Multi-client dashboard and assessment workflow for MSPs supporting UK SME clients (per month).",
    },
  ],
};

const MINI_TIERS = [
  {
    id: undefined,
    name: "Monitor",
    price: "£99",
    cadence: "/mo",
    desc: "Ongoing visibility after your initial readiness report.",
    cta: { label: "Join Monitor", href: "/signup" },
  },
  {
    id: undefined,
    name: "CE Plus Pack",
    price: "£499",
    cadence: "one-time",
    desc: "Preparation for Cyber Essentials Plus before technical testing.",
    cta: { label: "Prepare for CE Plus", href: "/signup" },
  },
  {
    id: "msp",
    name: "MSP Partner",
    price: "£299",
    cadence: "/mo",
    desc: "For MSPs supporting multiple UK SME clients.",
    cta: { label: "Become a Partner", href: "mailto:hello@brightcert.co.uk?subject=MSP%20Partner" },
  },
];

const INCLUDED = [
  { n: "01", label: "Guided assessment", body: "Answer structured questions across all five Cyber Essentials control areas." },
  { n: "02", label: "AI-assisted analysis", body: "Clear scoring, gap findings, and remediation suggestions based on your responses." },
  { n: "03", label: "Readiness score", body: "See how close your business is to being ready before applying." },
  { n: "04", label: "Practical report", body: "Download a PDF report with your results, gaps, and recommended next steps." },
];

const FAQS = [
  { q: "Do I need to pay before starting?", a: "No. You can begin the assessment first. Payment is required to unlock the full report and PDF download." },
  { q: "Does BrightCert issue the Cyber Essentials certificate?", a: "No. BrightCert helps you prepare. Official certification is provided through IASME Certification Bodies." },
  { q: "Is this suitable for non-technical users?", a: "Yes. BrightCert is designed to explain Cyber Essentials preparation in plain English." },
  { q: "Can I share the report with my IT provider?", a: "Yes. The report is designed to help internal teams, external IT providers, and business owners understand what needs attention." },
  { q: "Is this for UK businesses only?", a: "Yes. BrightCert is built for UK SMEs preparing for Cyber Essentials." },
];

export default function PricingPage() {
  return (
    <div className="bg-[#F3F4EC]">
      <JsonLd data={PRICING_SCHEMA} />
      <ScrollProgress />
      <SignalNav />

      <main className="pt-[150px] pb-24">
        {/* ── HEADER ───────────────────────────────────────────────────── */}
        <section className="pb-16">
          <div className="max-w-[760px] mx-auto px-4 text-center">
            <Reveal>
              <Tag center>Pricing</Tag>
            </Reveal>
            <Reveal delay={100}>
              <SectionTitle className="mx-auto">
                Simple pricing for <Mark>Cyber Essentials</Mark> readiness
              </SectionTitle>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-[#475569] text-[clamp(1rem,1.4vw,1.13rem)] leading-[1.7] mt-[22px]">
                BrightCert helps you understand your Cyber Essentials readiness before you invest more time, money, or internal resources. Complete the assessment for free. Unlock your full readiness report when you&apos;re ready.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── TIER GRID: featured hero card + mini stack ──────────────── */}
        <section className="pb-24">
          <div className="max-w-[1180px] mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-[22px] items-stretch">
              <Reveal delay={100}>
                <article className="relative h-full overflow-hidden rounded-[26px] bg-gradient-to-br from-[#0F2044] to-[#142A56] text-white px-8 sm:px-[38px] pt-10 pb-[34px] shadow-[0_40px_80px_-34px_rgba(15,32,68,0.5)]">
                  <div className="pointer-events-none absolute -top-[140px] -right-[140px] h-[320px] w-[320px] rounded-full bg-[#6EE7B7]/[0.16] blur-[70px]" aria-hidden />
                  <span className="relative inline-block rounded-full bg-[#6EE7B7] px-[13px] py-[7px] font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#0F2044] mb-[22px]">
                    Most popular
                  </span>
                  <h2 className="relative font-display font-semibold text-2xl tracking-[-0.02em]">Assessment</h2>
                  <p className="relative text-sm text-white/70 mt-2 max-w-[40ch]">
                    Best for UK SMEs preparing for Cyber Essentials and wanting a clear view before applying.
                  </p>
                  <p className="relative flex items-baseline gap-1 my-[26px]">
                    <sup className="font-display text-2xl font-semibold -translate-y-3.5">£</sup>
                    <span className="font-display text-[56px] sm:text-[68px] font-bold tracking-[-0.04em] leading-none">199</span>
                    <em className="not-italic font-mono text-xs uppercase tracking-[0.1em] text-white/60 ml-2.5">one-time</em>
                  </p>
                  <ul className="relative grid gap-[13px] mb-[30px]">
                    {[
                      "Guided readiness assessment across all five control areas",
                      "AI-assisted scoring and gap analysis",
                      "Overall readiness score and control-by-control results",
                      "Prioritised remediation steps",
                      "Downloadable PDF report",
                      "Plain-English preparation guidance",
                    ].map((f) => (
                      <li key={f} className="flex gap-3 items-start text-[14.5px] leading-[1.5] text-white/85">
                        <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6EE7B7] text-[#0F2044]">
                          <Check className="h-3 w-3" strokeWidth={2.6} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <MagneticLink href="/assessment/new" className="group relative w-full justify-center inline-flex items-center gap-2.5 rounded-full bg-[#047857] px-7 py-4 font-display text-[15.5px] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(4,120,87,0.55)] transition-all duration-300 hover:bg-[#065F46] hover:-translate-y-0.5">
                    <span>Start your assessment</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                  </MagneticLink>
                  <p className="relative mt-3.5 text-center font-mono text-[10.5px] uppercase tracking-[0.08em] text-white/55">
                    Complete first. Pay when you&apos;re ready to unlock.
                  </p>
                </article>
              </Reveal>

              <div className="grid gap-4 content-stretch">
                {MINI_TIERS.map((tier, i) => (
                  <Reveal key={tier.name} delay={200 + i * 100}>
                    <article
                      id={tier.id}
                      className="flex flex-col gap-1.5 rounded-[22px] border border-[#0F2044]/[0.07] bg-white px-[26px] py-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_44px_-22px_rgba(15,32,68,0.22)]"
                    >
                      <div className="flex items-center justify-between gap-3.5">
                        <h3 className="font-display font-semibold text-lg tracking-[-0.015em] text-[#0F2044]">{tier.name}</h3>
                        <p className="flex items-baseline gap-0.5 text-[#0F2044]">
                          <sup className="text-[13px] -translate-y-1.5">£</sup>
                          <span className="font-display text-2xl font-bold tracking-[-0.02em]">{tier.price.replace("£", "")}</span>
                          <em className="not-italic ml-1.5 text-[#64748B] text-xs">{tier.cadence}</em>
                        </p>
                      </div>
                      <p className="text-[13.5px] text-[#475569]">{tier.desc}</p>
                      <MagneticLink href={tier.cta.href} className="mt-2 inline-flex items-center gap-1.5 font-display text-[13.5px] font-semibold text-[#059669] w-fit group">
                        {tier.cta.label}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                      </MagneticLink>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT'S INCLUDED (dark band) ─────────────────────────────── */}
        <section className="pb-24">
          <div className="max-w-[1180px] mx-auto px-4">
            <Reveal>
              <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-b from-[#0F2044] to-[#08152e] px-6 py-12 sm:px-12 sm:py-14">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04]" aria-hidden />
                <div className="relative">
                  <Tag light>What is included</Tag>
                  <h2 className="font-display font-semibold text-[28px] sm:text-[32px] tracking-[-0.02em] text-white mb-8 max-w-[20ch]">
                    Everything in your readiness report
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
                    {INCLUDED.map((item) => (
                      <div key={item.n} className="flex gap-3.5 items-start">
                        <span className="pt-[3px] font-mono text-[11px] font-bold text-[#6EE7B7]">{item.n}</span>
                        <div>
                          <strong className="block font-display font-semibold text-[15.5px] tracking-[-0.01em] text-white">{item.label}</strong>
                          <p className="text-[13.5px] text-white/60 mt-[3px] leading-[1.55]">{item.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── PRICING FAQ ──────────────────────────────────────────────── */}
        <section className="pb-20">
          <div className="max-w-[800px] mx-auto px-4">
            <Reveal>
              <Tag>Pricing FAQ</Tag>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="font-display font-semibold text-[26px] sm:text-[30px] tracking-[-0.02em] text-[#0F2044] mb-6">
                Common pricing questions
              </h2>
            </Reveal>
            <div className="border-t border-[#0F2044]/[0.1]">
              {FAQS.map((item, i) => (
                <Reveal key={item.q} delay={150 + i * 60}>
                  <div className="border-b border-[#0F2044]/[0.1] py-5">
                    <p className="font-display font-semibold text-[15.5px] text-[#0F2044] mb-1.5">{item.q}</p>
                    <p className="text-[13.5px] text-[#475569] leading-relaxed max-w-[62ch]">{item.a}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── DISCLAIMER ───────────────────────────────────────────────── */}
        <section>
          <Reveal className="max-w-[800px] mx-auto px-4">
            <div className="rounded-[16px] border border-[#0F2044]/[0.07] bg-white px-6 py-5 text-[12.5px] leading-relaxed text-[#475569]">
              <strong className="text-[#0F2044]">BrightCert</strong> provides Cyber Essentials readiness assessment and preparation support. BrightCert does not issue official Cyber Essentials certification: official certification is provided through IASME Certification Bodies.
            </div>
          </Reveal>
        </section>
      </main>

      <SignalFooter />
    </div>
  );
}
