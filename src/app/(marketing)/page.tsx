import { ArrowRight, Check, ClipboardList, Code2, Home as HomeIcon, HelpCircle, ListChecks, PoundSterling, ShieldCheck, Terminal, TrendingUp } from "lucide-react";
import { JsonLd } from "@/components/brightcert/json-ld";
import { Reveal } from "@/components/brightcert/reveal";
import { PoweredByMarquee } from "@/components/brightcert/powered-by-marquee";
import { SOCIAL_PROOF_THRESHOLD, SOCIAL_PROOF_FALLBACK, getAssessmentCountLabel } from "@/components/brightcert/social-proof-badge";
import { SignalNav } from "@/components/brightcert/signal-nav";
import { SignalFooter } from "@/components/brightcert/signal-footer";
import { Preloader } from "@/components/brightcert/home/preloader";
import { ScrollProgress } from "@/components/brightcert/scroll-progress";
import { HeroTitle } from "@/components/brightcert/home/hero-title";
import { HeroQuiz } from "@/components/brightcert/home/hero-quiz";
import { ScanCard } from "@/components/brightcert/home/scan-card";
import { HowItWorksRail, type RailStep } from "@/components/brightcert/how-it-works-rail";
import { ControlAccordion } from "@/components/brightcert/home/control-accordion";
import { ReportPreviewCard } from "@/components/brightcert/home/report-preview-card";
import { FaqAccordion, type FaqItem } from "@/components/brightcert/faq-accordion";
import { MagneticLink } from "@/components/brightcert/magnetic-link";
import { BTN_INK, BTN_EMERALD, BTN_GHOST, Tag, SectionTitle } from "@/components/brightcert/signal-primitives";
import { createAdminClient } from "@/lib/supabase/server";

// Live count is a light server read — cache for 5 minutes rather than
// hitting Supabase on every landing page visit.
export const revalidate = 300;

const HOME_FAQS: FaqItem[] = [
  {
    q: "Does BrightCert issue the official Cyber Essentials certificate?",
    a: "No. BrightCert provides readiness assessment and preparation support. Official Cyber Essentials certification must be completed through an IASME-licensed Certification Body.",
  },
  {
    q: "Do I need to pay before starting the assessment?",
    a: "No. You can complete the full assessment first. Payment of £199 is required only when you want to unlock your full readiness report and PDF download.",
  },
  {
    q: "How long does the assessment take?",
    a: "Most businesses complete the assessment in around 2 hours. You can save your progress and return at any time.",
  },
  {
    q: "Is BrightCert suitable for non-technical users?",
    a: "Yes. BrightCert explains Cyber Essentials preparation in plain English. You do not need to be a cyber security expert to complete the assessment.",
  },
  {
    q: "Do you store my answers securely?",
    a: "Yes. Your assessment responses are stored securely and used only to generate your readiness report. We never share your data with third parties.",
  },
  {
    q: "What is the difference between Cyber Essentials and Cyber Essentials Plus?",
    a: "Cyber Essentials is a self-assessed questionnaire reviewed by a Certification Body. Cyber Essentials Plus adds external technical verification. BrightCert supports preparation for both, with specific CE Plus guidance in the CE Plus Pack.",
  },
];

const HOME_HOW_STEPS: RailStep[] = [
  {
    num: "01",
    title: "Answer simple questions",
    body: "A guided assessment across the five Cyber Essentials control areas. Every question written in plain English, with helpful context where you need it.",
    tag: "~2 hours · save & return anytime",
  },
  {
    num: "02",
    title: "Get your readiness score",
    body: "BrightCert analyses your answers and scores your organisation across the core Cyber Essentials areas, instantly.",
    tag: "Scored out of 100",
  },
  {
    num: "03",
    title: "Review your gaps",
    body: "See where your business may fall short, with clear explanations and practical next steps: no auditor-speak.",
    tag: "Plain-English findings",
  },
  {
    num: "04",
    title: "Unlock your full report",
    body: "Pay £199 only when you're ready: unlock detailed gap analysis, remediation actions and a preparation summary.",
    tag: "PDF · shareable with your team",
  },
];

const PAIN_CARDS = [
  {
    icon: HelpCircle,
    title: "You're not sure where you stand",
    body: "You know Cyber Essentials matters, but you don't have a clear view of how close your business is to being ready.",
  },
  {
    icon: Terminal,
    title: "The language feels technical",
    body: "Firewalls, secure configuration, access control, patching: important, but rarely explained in a way SMEs can act on quickly.",
  },
  {
    icon: PoundSterling,
    title: "Consultants can be expensive",
    body: "Many businesses only find out what needs fixing after paying for external help. You deserve the picture first.",
  },
  {
    icon: ListChecks,
    title: "Your team needs next steps",
    body: "A score alone is not enough. You need a practical list of what to fix, why it matters, and what to do next.",
  },
];

const AUDIENCE_CARDS = [
  {
    icon: HomeIcon,
    title: "Small business owners",
    body: "Show customers, suppliers and partners you take cyber security seriously, without a large internal IT team.",
  },
  {
    icon: ClipboardList,
    title: "Operations managers",
    body: "You've been asked to prepare for Cyber Essentials and need a structured way to collect answers, spot gaps and organise next steps.",
  },
  {
    icon: Code2,
    title: "IT providers",
    body: "You support clients who need Cyber Essentials preparation and want a repeatable way to assess readiness before formal application.",
  },
  {
    icon: TrendingUp,
    title: "Growing suppliers",
    body: "You're bidding for work where Cyber Essentials is expected or required, and need to know whether your business is ready.",
  },
];

const COMPARE_ROWS = [
  ["You may not know where to begin", "Start with a guided assessment"],
  ["Technical language can slow you down", "Questions written in plain English"],
  ["You may pay for advice before knowing the gaps", "See your readiness position first"],
  ["Findings scattered across emails or calls", "Get a structured PDF report"],
  ["Teams may not know what to fix first", "Receive prioritised remediation steps"],
  ["Progress can feel unclear", "Track score, status and next actions"],
];

export default async function HomePage() {
  const supabase = createAdminClient();
  const { count: assessmentCount } = await supabase
    .from("assessments")
    .select("id", { count: "exact", head: true });

  const showCount = (assessmentCount ?? 0) >= SOCIAL_PROOF_THRESHOLD;
  const pillLabel = showCount ? getAssessmentCountLabel(assessmentCount ?? 0) : SOCIAL_PROOF_FALLBACK;

  return (
    <div className="bg-[#F3F4EC]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "BrightCert Cyber Essentials Readiness Assessment",
          description:
            "Guided Cyber Essentials readiness assessment for UK SMEs: 60 plain-English questions across the five official control areas, a readiness score, gap analysis, and a prioritised remediation report. Free to complete; the full report unlocks for £199.",
          brand: { "@id": "https://brightcert.co.uk/#organization" },
          url: "https://brightcert.co.uk",
          offers: {
            "@type": "Offer",
            price: "199",
            priceCurrency: "GBP",
            url: "https://brightcert.co.uk/pricing",
            availability: "https://schema.org/InStock",
          },
        }}
      />

      <Preloader />
      <ScrollProgress />
      <SignalNav />

      <main id="top">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative pt-[150px] sm:pt-[170px] lg:pt-[190px] overflow-hidden" aria-label="Hero">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(15,32,68,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,32,68,0.06)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:radial-gradient(ellipse_90%_70%_at_50%_0%,#000_30%,transparent_75%)]" />
            <div className="absolute -top-[220px] right-[-120px] h-[560px] w-[560px] rounded-full bg-[#059669]/[0.18] blur-[110px]" />
            <div className="absolute top-[220px] left-[-180px] h-[420px] w-[420px] rounded-full bg-[#0F2044]/[0.08] blur-[110px]" />
          </div>

          <div className="relative max-w-[1180px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1.06fr_0.94fr] gap-10 lg:gap-16 items-center">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2.5 rounded-full border border-[#0F2044]/[0.12] bg-white px-4 py-2.5 mb-7 font-mono text-xs text-[#475569] shadow-[0_4px_14px_-6px_rgba(15,32,68,0.15)]">
                  <span className="relative flex h-[7px] w-[7px] shrink-0">
                    {showCount && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#059669] opacity-75" aria-hidden />
                    )}
                    <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-[#059669]" aria-hidden />
                  </span>
                  {pillLabel}
                </span>
              </Reveal>

              <HeroTitle />

              <Reveal delay={200}>
                <p className="text-[#475569] text-[1.02rem] sm:text-[1.1rem] leading-[1.7] max-w-[50ch] mb-9">
                  BrightCert guides UK SMEs through a plain-English readiness assessment, highlights what needs attention, and creates a practical report before you apply for certification.
                </p>
              </Reveal>

              <Reveal delay={280}>
                <div className="flex flex-wrap gap-3.5 mb-[34px]">
                  <MagneticLink href="/assessment/new" className={BTN_EMERALD}>
                    <span>Start your assessment</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                  </MagneticLink>
                  <MagneticLink href="#how" className={BTN_GHOST}>
                    <span>See how it works</span>
                  </MagneticLink>
                </div>
              </Reveal>

              <Reveal delay={340}>
                <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
                  {["No payment to start", "Plain English, no jargon", "Pay only to unlock your report"].map((tick) => (
                    <li key={tick} className="inline-flex items-center gap-2 text-[13.5px] font-medium text-[#475569]">
                      <Check className="h-3.5 w-3.5 text-[#059669] shrink-0" strokeWidth={2.4} />
                      {tick}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={180} className="relative">
              <HeroQuiz />

              <div
                className="hidden sm:flex absolute -top-[38px] -right-[26px] items-center gap-3 rounded-[16px] border border-[#0F2044]/[0.07] bg-white px-4 py-3 shadow-[0_18px_40px_-16px_rgba(15,32,68,0.25)]"
                style={{ animation: "bc-float 6s ease-in-out 0.8s infinite" }}
                aria-hidden
              >
                <svg viewBox="0 0 44 44" width="40" height="40">
                  <circle cx="22" cy="22" r="19" fill="none" stroke="rgba(15,32,68,0.1)" strokeWidth="5" />
                  <circle
                    cx="22" cy="22" r="19" fill="none" stroke="#059669" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray="119.4" strokeDashoffset="38" transform="rotate(-90 22 22)"
                  />
                </svg>
                <div>
                  <strong className="block font-display text-[15px] text-[#0F2044]">67%</strong>
                  <span className="block font-mono text-[11px] text-[#64748B]">Nearly ready</span>
                </div>
              </div>

              <div
                className="hidden sm:flex absolute -bottom-[46px] -left-[30px] items-center gap-3 rounded-[16px] border border-[#0F2044]/[0.07] bg-white px-4 py-3 shadow-[0_18px_40px_-16px_rgba(15,32,68,0.25)]"
                style={{ animation: "bc-float 6s ease-in-out infinite" }}
                aria-hidden
              >
                <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#D97706] font-display text-[17px] font-bold text-white">
                  !
                </span>
                <div>
                  <strong className="block font-display text-[15px] text-[#0F2044]">4 gaps found</strong>
                  <span className="block font-mono text-[11px] text-[#64748B]">2 quick fixes</span>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={400} className="mt-[70px] sm:mt-[90px] lg:mt-[110px] border-y border-[#0F2044]/[0.07] bg-white/40">
            <div className="max-w-[1180px] mx-auto px-4 flex items-center gap-9 py-5">
              <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-[#64748B]">Powered by</p>
              <PoweredByMarquee />
            </div>
          </Reveal>
        </section>

        {/* ── PROBLEM ──────────────────────────────────────────────────── */}
        <section className="py-[clamp(84px,9.5vw,136px)]" id="problem">
          <div className="max-w-[1180px] mx-auto px-4">
            <div className="max-w-[760px] mb-[clamp(48px,6vw,76px)]">
              <Reveal>
                <Tag>The problem</Tag>
              </Reveal>
              <Reveal delay={100}>
                <SectionTitle>
                  Cyber Essentials can feel <span className="rounded-[0.16em] bg-[#A7F3D0] px-[0.12em] box-decoration-clone">harder</span> than it should
                </SectionTitle>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-[#475569] text-[clamp(1rem,1.4vw,1.13rem)] leading-[1.7] max-w-[56ch] mt-[22px]">
                  For many small businesses, Cyber Essentials starts with a simple goal: prove your organisation takes cyber security seriously. But preparation quickly becomes confusing, and that uncertainty leads to delays, guesswork, or expensive consultancy before you even understand the gaps.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
              {PAIN_CARDS.map((card, i) => (
                <Reveal key={card.title} delay={i * 90}>
                  <article className="group relative overflow-hidden rounded-[22px] border border-[#0F2044]/[0.07] bg-white px-[26px] pt-[30px] pb-[34px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_50px_-22px_rgba(15,32,68,0.22)]">
                    <span className="absolute top-[18px] right-[22px] font-mono text-xs font-medium text-[#64748B]/55 transition-colors group-hover:text-[#059669] group-hover:opacity-100">
                      0{i + 1}
                    </span>
                    <div className="mb-[22px] flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#EBEDDE] text-[#0F2044] transition-all duration-500 group-hover:-rotate-6 group-hover:scale-105 group-hover:bg-[#A7F3D0]">
                      <card.icon className="h-[22px] w-[22px]" strokeWidth={1.7} />
                    </div>
                    <h3 className="font-display font-semibold text-[19px] tracking-[-0.015em] leading-[1.25] text-[#0F2044] mb-2.5">{card.title}</h3>
                    <p className="text-[14.5px] leading-[1.65] text-[#475569]">{card.body}</p>
                    <span className="absolute left-0 bottom-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#059669] to-[#6EE7B7] transition-transform duration-500 group-hover:scale-x-100" />
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOLUTION ─────────────────────────────────────────────────── */}
        <section className="py-[clamp(84px,9.5vw,136px)] bg-[#EBEDDE]" id="solution">
          <div className="max-w-[1180px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1.02fr_0.98fr] gap-[clamp(48px,6vw,90px)] items-center">
            <div>
              <Reveal>
                <Tag>The solution</Tag>
              </Reveal>
              <Reveal delay={100}>
                <SectionTitle>
                  A clearer way to prepare for <span className="rounded-[0.16em] bg-[#A7F3D0] px-[0.12em] box-decoration-clone">Cyber Essentials</span>
                </SectionTitle>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-[#475569] text-[clamp(1rem,1.4vw,1.13rem)] leading-[1.7] max-w-[56ch] mt-[22px] mb-8">
                  BrightCert turns preparation into a guided, step-by-step process. Answer simple questions about your organisation, devices, users, software and security controls: BrightCert analyses your responses across the five control areas and gives you a readiness score, plain-English gap findings, and prioritised remediation steps.
                </p>
              </Reveal>
              <ul className="grid gap-[22px] mb-9">
                {[
                  { title: "Plain-English questions", body: "Every requirement translated into language a business owner can answer." },
                  { title: "AI-assisted analysis", body: "Your answers are scored across all five Cyber Essentials control areas." },
                  { title: "Prioritised next steps", body: "Know what to fix first, why it matters, and how to evidence it." },
                ].map((point, i) => (
                  <Reveal key={point.title} delay={300 + i * 100}>
                    <li className="flex gap-4 items-start">
                      <span className="mt-[3px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#A7F3D0] text-[#0F2044]">
                        <Check className="h-3 w-3" strokeWidth={2.6} />
                      </span>
                      <div>
                        <strong className="font-display font-semibold text-[16.5px] tracking-[-0.01em] text-[#0F2044]">{point.title}</strong>
                        <p className="text-[14.5px] text-[#475569] mt-0.5">{point.body}</p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ul>
              <Reveal delay={600}>
                <MagneticLink href="/assessment/new" className={BTN_INK}>
                  <span>Start your assessment</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                </MagneticLink>
              </Reveal>
            </div>

            <Reveal delay={250}>
              <ScanCard />
            </Reveal>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
        <section className="py-[clamp(84px,9.5vw,136px)]" id="how">
          <div className="max-w-[1180px] mx-auto px-4">
            <div className="max-w-[760px] mb-[clamp(48px,6vw,76px)]">
              <Reveal>
                <Tag>How it works</Tag>
              </Reveal>
              <Reveal delay={100}>
                <SectionTitle>
                  From uncertainty to action in <span className="rounded-[0.16em] bg-[#A7F3D0] px-[0.12em] box-decoration-clone">four steps</span>
                </SectionTitle>
              </Reveal>
            </div>
            <HowItWorksRail steps={HOME_HOW_STEPS} />
          </div>
        </section>

        {/* ── FIVE CONTROL AREAS ───────────────────────────────────────── */}
        <section className="py-[clamp(84px,9.5vw,136px)] bg-[#EBEDDE]" id="what-we-check">
          <div className="max-w-[1180px] mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-end mb-[clamp(48px,6vw,76px)]">
              <div>
                <Reveal>
                  <Tag>What we check</Tag>
                </Reveal>
                <Reveal delay={100}>
                  <SectionTitle>
                    Built around the <span className="rounded-[0.16em] bg-[#A7F3D0] px-[0.12em] box-decoration-clone">five control areas</span>
                  </SectionTitle>
                </Reveal>
              </div>
              <Reveal delay={200}>
                <p className="text-[#475569] text-[clamp(1rem,1.4vw,1.13rem)] leading-[1.7] pb-1.5">
                  Cyber Essentials focuses on five technical control areas that protect organisations from common internet-based threats. BrightCert structures your assessment around exactly these five areas: 60 questions in total.
                </p>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <ControlAccordion />
            </Reveal>
          </div>
        </section>

        {/* ── REPORT PREVIEW (dark) ────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0F2044] to-[#08152e] py-[clamp(84px,9.5vw,136px)]" id="report">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04]" aria-hidden />
          <div className="relative max-w-[1180px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-[clamp(48px,6vw,88px)] items-center">
            <div>
              <Reveal>
                <Tag light>Your report</Tag>
              </Reveal>
              <Reveal delay={100}>
                <SectionTitle light>
                  Know what to fix <span className="text-[#6EE7B7]">before</span> you apply
                </SectionTitle>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-white/70 text-[clamp(1rem,1.4vw,1.13rem)] leading-[1.7] max-w-[56ch] mt-[22px] mb-9">
                  Your BrightCert report gives you a structured view of your Cyber Essentials readiness: understand your position, share findings with the right people, and work through improvements before applying for official certification.
                </p>
              </Reveal>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-7 gap-y-5 mb-9">
                {[
                  { n: "01", label: "Executive summary", body: "Your readiness score, strongest areas, and main risks." },
                  { n: "02", label: "Five control area scores", body: "Performance across each Cyber Essentials control area." },
                  { n: "03", label: "Gap analysis", body: "Where your current setup may not meet expected requirements." },
                  { n: "04", label: "Priority action plan", body: "Recommended fixes, ordered by importance." },
                  { n: "05", label: "Preparation notes", body: "Guidance before working with a Certification Body." },
                  { n: "06", label: "PDF download", body: "Save it, share it, review it with your team." },
                ].map((item, i) => (
                  <Reveal key={item.n} delay={280 + i * 60}>
                    <li className="flex gap-3.5 items-start">
                      <span className="pt-[3px] font-mono text-[11px] font-bold text-[#6EE7B7]">{item.n}</span>
                      <div>
                        <strong className="block font-display font-semibold text-[15.5px] tracking-[-0.01em] text-white">{item.label}</strong>
                        <p className="text-[13.5px] text-white/60 mt-[3px] leading-[1.55]">{item.body}</p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={650}>
                <div className="flex flex-col items-start gap-4">
                  <MagneticLink href="/assessment/new" className={BTN_EMERALD}>
                    <span>Start your assessment</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                  </MagneticLink>
                  <p className="font-mono text-[11.5px] leading-[1.7] text-white/55 max-w-[44ch]">
                    Complete the assessment first. Pay £199 only when you&apos;re ready to unlock the full report.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={300}>
              <ReportPreviewCard />
            </Reveal>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────────── */}
        <section className="py-[clamp(84px,9.5vw,136px)]" id="pricing">
          <div className="max-w-[1180px] mx-auto px-4">
            <div className="max-w-[760px] mb-[clamp(48px,6vw,76px)]">
              <Reveal>
                <Tag>Pricing</Tag>
              </Reveal>
              <Reveal delay={100}>
                <SectionTitle>
                  Simple pricing for <span className="rounded-[0.16em] bg-[#A7F3D0] px-[0.12em] box-decoration-clone">Cyber Essentials</span> preparation
                </SectionTitle>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-[#475569] text-[clamp(1rem,1.4vw,1.13rem)] leading-[1.7] max-w-[56ch] mt-[22px]">
                  Start with a guided readiness assessment. Upgrade only when you need ongoing monitoring, CE Plus preparation, or partner features.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.04fr_0.96fr] gap-[22px] items-stretch">
              <Reveal delay={100}>
                <article className="relative h-full overflow-hidden rounded-[26px] bg-gradient-to-br from-[#0F2044] to-[#142A56] text-white px-[38px] pt-10 pb-[34px] shadow-[0_40px_80px_-34px_rgba(15,32,68,0.5)]">
                  <div className="pointer-events-none absolute -top-[140px] -right-[140px] h-[320px] w-[320px] rounded-full bg-[#6EE7B7]/[0.16] blur-[70px]" aria-hidden />
                  <span className="relative inline-block rounded-full bg-[#6EE7B7] px-[13px] py-[7px] font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#0F2044] mb-[22px]">
                    Most popular
                  </span>
                  <h3 className="relative font-display font-semibold text-2xl tracking-[-0.02em]">Assessment</h3>
                  <p className="relative text-sm text-white/70 mt-2 max-w-[40ch]">
                    Best for UK SMEs preparing for Cyber Essentials who want a clear view before applying.
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
                      "Prioritised remediation steps",
                      "Downloadable PDF report",
                    ].map((f) => (
                      <li key={f} className="flex gap-3 items-start text-[14.5px] leading-[1.5] text-white/85">
                        <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6EE7B7] text-[#0F2044]">
                          <Check className="h-3 w-3" strokeWidth={2.6} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <MagneticLink href="/assessment/new" className={`${BTN_EMERALD} relative w-full justify-center`}>
                    <span>Start your assessment</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                  </MagneticLink>
                  <p className="relative mt-3.5 text-center font-mono text-[10.5px] uppercase tracking-[0.08em] text-white/55">
                    Pay nothing until you unlock your report
                  </p>
                </article>
              </Reveal>

              <div className="grid gap-4 content-stretch">
                {[
                  { id: "monitor", name: "Monitor", price: "£99", cadence: "/month", body: "Ongoing visibility after your initial readiness report." },
                  { id: "ce-plus", name: "CE Plus Pack", price: "£499", cadence: "one-time", body: "Preparation for Cyber Essentials Plus before technical testing." },
                  { id: "msp-partner", name: "MSP Partner", price: "£299", cadence: "/month", body: "For MSPs supporting multiple UK SME clients." },
                ].map((tier, i) => (
                  <Reveal key={tier.id} delay={200 + i * 100}>
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
                      <p className="text-[13.5px] text-[#475569]">{tier.body}</p>
                      <MagneticLink href="/pricing" className="mt-2 inline-flex items-center gap-1.5 font-display text-[13.5px] font-semibold text-[#059669] w-fit group">
                        View pricing
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                      </MagneticLink>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── COMPARISON ───────────────────────────────────────────────── */}
        <section className="py-[clamp(84px,9.5vw,136px)] bg-[#EBEDDE]" id="compare">
          <div className="max-w-[1180px] mx-auto px-4">
            <div className="max-w-[760px] mb-[clamp(48px,6vw,76px)]">
              <Reveal>
                <Tag>Why BrightCert</Tag>
              </Reveal>
              <Reveal delay={100}>
                <SectionTitle>
                  Understand your gaps <span className="rounded-[0.16em] bg-[#A7F3D0] px-[0.12em] box-decoration-clone">before</span> you spend more
                </SectionTitle>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-[#475569] text-[clamp(1rem,1.4vw,1.13rem)] leading-[1.7] max-w-[56ch] mt-[22px]">
                  Traditional consultancy can be valuable for complex organisations. But most SMEs first need an answer to a simpler question:{" "}
                  <strong className="text-[#0F2044] font-semibold">are we ready, and what do we need to fix?</strong>
                </p>
              </Reveal>
            </div>

            <Reveal delay={200}>
              <div className="overflow-hidden rounded-[26px] border border-[#0F2044]/[0.07] bg-white shadow-[0_30px_60px_-34px_rgba(15,32,68,0.25)]">
                <div className="grid grid-cols-2">
                  <span className="bg-[#F3F4EC] px-[26px] py-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#64748B]">
                    Without BrightCert
                  </span>
                  <span className="border-l border-[#0F2044]/[0.07] bg-[#A7F3D0] px-[26px] py-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#0F2044]">
                    With BrightCert
                  </span>
                </div>
                {COMPARE_ROWS.map(([without, withUs], i) => (
                  <div key={without} className={`grid grid-cols-2 ${i > 0 ? "border-t border-[#0F2044]/[0.07]" : ""}`}>
                    <p className="flex items-center gap-3.5 px-[26px] py-[19px] text-[14.5px] text-[#64748B]">
                      <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#DC2626]/[0.12] text-[#DC2626] text-[11px]">
                        ✕
                      </span>
                      {without}
                    </p>
                    <p className="flex items-center gap-3.5 border-l border-[#0F2044]/[0.07] bg-gradient-to-r from-[#A7F3D0]/[0.25] to-transparent px-[26px] py-[19px] text-[14.5px] font-medium text-[#0F2044]">
                      <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#A7F3D0] text-[#0F2044]">
                        <Check className="h-3 w-3" strokeWidth={2.6} />
                      </span>
                      {withUs}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── AUDIENCES ────────────────────────────────────────────────── */}
        <section className="py-[clamp(84px,9.5vw,136px)]" id="who">
          <div className="max-w-[1180px] mx-auto px-4">
            <div className="max-w-[760px] mb-[clamp(48px,6vw,76px)]">
              <Reveal>
                <Tag>Who it&apos;s for</Tag>
              </Reveal>
              <Reveal delay={100}>
                <SectionTitle>
                  Built for the businesses that need <span className="rounded-[0.16em] bg-[#A7F3D0] px-[0.12em] box-decoration-clone">clarity fast</span>
                </SectionTitle>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
              {AUDIENCE_CARDS.map((card, i) => (
                <Reveal key={card.title} delay={i * 90}>
                  <article className="group rounded-[22px] border border-[#0F2044]/[0.07] bg-white px-6 pt-7 pb-[30px] transition-all duration-500 hover:-translate-y-2 hover:border-[#059669]/[0.35] hover:shadow-[0_26px_50px_-22px_rgba(15,32,68,0.22)]">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#A7F3D0] text-[#0F2044] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <card.icon className="h-[22px] w-[22px]" strokeWidth={1.7} />
                    </div>
                    <h3 className="font-display font-semibold text-[18px] tracking-[-0.015em] leading-[1.3] text-[#0F2044] mb-[9px]">{card.title}</h3>
                    <p className="text-sm leading-[1.65] text-[#475569]">{card.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── HONESTY STRIP (dark) ─────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0F2044] to-[#08152e] py-[clamp(70px,8vw,110px)]">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04]" aria-hidden />
          <div className="relative max-w-[1180px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-[90px_1fr] gap-[clamp(28px,4vw,54px)] items-start max-w-[920px]">
            <Reveal>
              <div className="flex h-[76px] w-[76px] items-center justify-center rounded-[24px] border border-[#6EE7B7]/[0.35] bg-[#6EE7B7]/[0.12] text-[#6EE7B7]" aria-hidden>
                <ShieldCheck className="h-[30px] w-[30px]" strokeWidth={1.6} />
              </div>
            </Reveal>
            <div>
              <Reveal delay={100}>
                <SectionTitle light className="text-[clamp(1.8rem,3.6vw,2.7rem)] max-w-[22ch]">
                  Clear guidance, <span className="text-[#6EE7B7]">without false promises</span>
                </SectionTitle>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-white/70 text-[clamp(1rem,1.4vw,1.13rem)] leading-[1.7] mt-[22px]">
                  BrightCert is careful about what it does, and what it doesn&apos;t do. We help you prepare for Cyber Essentials by assessing readiness, identifying gaps and creating a practical report.{" "}
                  <strong className="text-white font-semibold">We do not issue the official certificate.</strong> Official certification is handled through IASME-licensed Certification Bodies.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <p className="inline-flex items-center gap-2.5 mt-7 rounded-full border border-[#6EE7B7]/[0.35] bg-[#6EE7B7]/[0.08] px-[18px] py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#6EE7B7]">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#6EE7B7]" style={{ animation: "bc-pulse-dot 2.2s ease-in-out infinite" }} />
                  Readiness assessment, not official certification
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FOUNDER ──────────────────────────────────────────────────── */}
        <section className="py-[clamp(84px,9.5vw,136px)]" id="founder">
          <div className="max-w-[1180px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-[clamp(44px,6vw,90px)] items-center">
            <Reveal delay={100}>
              <div className="mx-auto max-w-[440px] rounded-[26px] border border-[#0F2044]/[0.07] bg-white px-[34px] py-10 text-center shadow-[0_30px_60px_-34px_rgba(15,32,68,0.25)]">
                <div className="relative mx-auto mb-[22px] flex h-[108px] w-[108px] items-center justify-center">
                  <span className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[#0F2044] font-display text-[27px] font-bold tracking-[0.02em] text-[#6EE7B7]">
                    MSR
                  </span>
                  <span
                    className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-[#059669]/50"
                    style={{ animation: "bc-spin 16s linear infinite" }}
                  />
                </div>
                <strong className="block font-display text-[19px] tracking-[-0.015em] text-[#0F2044]">Muhammad Sohaib Roomi</strong>
                <p className="text-[13.5px] text-[#64748B] mt-1 mb-[22px]">Founder, BrightCert · Cognumi Ltd</p>
                <ul className="flex flex-wrap justify-center gap-2">
                  {["MSc Cyber Security (Distinction)", "EC-Council Certified", "Fortinet Certified", "Founder, Cognumi"].map((chip) => (
                    <li
                      key={chip}
                      className="rounded-full border border-[#0F2044]/[0.15] px-3 py-[7px] font-mono text-[10.5px] tracking-[0.04em] text-[#475569] transition-colors hover:bg-[#A7F3D0] hover:border-[#A7F3D0] hover:text-[#0F2044]"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <Tag>Founder&apos;s note</Tag>
              </Reveal>
              <Reveal delay={100}>
                <SectionTitle>
                  Why I built <span className="rounded-[0.16em] bg-[#A7F3D0] px-[0.12em] box-decoration-clone">BrightCert</span>
                </SectionTitle>
              </Reveal>
              <Reveal delay={200}>
                <blockquote className="border-l-[3px] border-[#A7F3D0] pl-6 my-[26px]">
                  <p className="font-display font-medium text-[clamp(1.15rem,2vw,1.4rem)] leading-[1.45] tracking-[-0.015em] text-[#0F2044]">
                    &ldquo;I started BrightCert after watching UK small businesses stall out on Cyber Essentials. Not because the technical controls are hard, but because the preparation process is opaque and the language is written for auditors, not business owners.&rdquo;
                  </p>
                </blockquote>
              </Reveal>
              <Reveal delay={300}>
                <p className="text-[#475569] text-[15.5px] leading-[1.75] max-w-[62ch] mt-4">
                  My background is in cybersecurity research. I hold a Master&apos;s degree in Cyber Security with Advanced Research from the University of Hertfordshire, awarded with distinction. My thesis compared the Nessus and OpenVAS vulnerability scanners on Ubuntu web servers. I also hold certifications in Digital Forensics, Ethical Hacking and Network Defense from EC-Council, alongside Fortinet&apos;s Cybersecurity Fundamentals and Huawei&apos;s HCIP in Routing &amp; Switching.
                </p>
              </Reveal>
              <Reveal delay={400}>
                <p className="text-[#475569] text-[15.5px] leading-[1.75] max-w-[62ch] mt-4">
                  Outside BrightCert, I run <strong className="text-[#0F2044]">Cognumi</strong>, building AI-managed operations and security-focused automation for service businesses. BrightCert brings that same approach, plain-English analysis backed by real security research, to Cyber Essentials preparation.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="py-[clamp(84px,9.5vw,136px)] bg-[#EBEDDE]" id="faq">
          <div className="max-w-[1180px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-[clamp(44px,6vw,90px)] items-start">
            <div className="lg:sticky lg:top-[130px]">
              <Reveal>
                <Tag>FAQs</Tag>
              </Reveal>
              <Reveal delay={100}>
                <SectionTitle>
                  Answers, <span className="rounded-[0.16em] bg-[#A7F3D0] px-[0.12em] box-decoration-clone">before</span> you ask
                </SectionTitle>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-[#475569] text-[clamp(1rem,1.4vw,1.13rem)] leading-[1.7] mt-[22px]">
                  Everything UK SMEs usually want to know before starting their readiness assessment.
                </p>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <FaqAccordion items={HOME_FAQS} />
            </Reveal>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────── */}
        <section className="py-[clamp(60px,8vw,110px)]" id="cta">
          <div className="max-w-[1180px] mx-auto px-4">
            <Reveal>
              <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#0F2044] to-[#08152e] px-6 py-[clamp(56px,8vw,104px)] sm:px-[clamp(28px,6vw,90px)] text-center">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04]" aria-hidden />
                <div
                  className="pointer-events-none absolute left-1/2 -top-[40%] h-[720px] w-[720px] -translate-x-1/2 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(110,231,183,0.22), transparent 62%)" }}
                  aria-hidden
                />
                <div className="relative">
                  <Tag light>Ready when you are</Tag>
                  <h2 className="font-display font-semibold text-[clamp(2.2rem,5.2vw,4rem)] leading-[1.04] tracking-[-0.03em] text-white mb-[22px]">
                    Find out how ready
                    <br />
                    your business <span className="text-[#6EE7B7]">really</span> is
                  </h2>
                  <p className="text-white/70 text-[clamp(1rem,1.5vw,1.14rem)] max-w-[52ch] mx-auto mb-[38px]">
                    Complete your Cyber Essentials readiness assessment, review your score, and unlock a practical report showing exactly what to fix next.
                  </p>
                  <div className="flex flex-col items-center gap-[18px]">
                    <MagneticLink href="/assessment/new" className={`${BTN_EMERALD} px-9 py-[19px] text-[17px]`}>
                      <span>Start your assessment</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                    </MagneticLink>
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/55">
                      ~2 hours · no payment to start · save &amp; return
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SignalFooter />
    </div>
  );
}
