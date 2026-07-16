import Link from "next/link";
import Image from "next/image";
import { Check, FileText, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificationDisclaimer } from "@/components/brightcert/certification-disclaimer";
import { JsonLd } from "@/components/brightcert/json-ld";
import { Reveal } from "@/components/brightcert/reveal";
import { Eyebrow } from "@/components/brightcert/eyebrow";
import { ReadinessTeaser } from "@/components/brightcert/readiness-teaser";
import { IconTile } from "@/components/brightcert/icon-tile";
import {
  SOCIAL_PROOF_FALLBACK,
  SOCIAL_PROOF_THRESHOLD,
  SocialProofBadge,
  getAssessmentCountLabel,
} from "@/components/brightcert/social-proof-badge";
import { PoweredByMarquee } from "@/components/brightcert/powered-by-marquee";
import { getQuestionsBySection } from "@/lib/questions";
import { createAdminClient } from "@/lib/supabase/server";

// Live count is a light server read — cache for 5 minutes rather than
// hitting Supabase on every landing page visit.
export const revalidate = 300;

// ─── What-we-check table rows (one-line summaries from COPY.md) ──────────────
const CONTROL_AREA_ROWS = [
  {
    id: 1,
    title: "Boundary Firewalls & Internet Gateways",
    summary: "Whether your business has suitable protections between your internal systems and the internet.",
  },
  {
    id: 2,
    title: "Secure Configuration",
    summary: "Whether devices, systems, and software are configured securely before they are used.",
  },
  {
    id: 3,
    title: "User Access Control",
    summary: "Who has access to your systems and whether permissions are appropriate.",
  },
  {
    id: 4,
    title: "Malware Protection",
    summary: "Whether your devices are protected from malware and unsafe applications.",
  },
  {
    id: 5,
    title: "Security Update Management",
    summary: "Whether software and devices are kept updated against known vulnerabilities.",
  },
];

// ─── How-it-works step mockups (decorative) ───────────────────────────────────
function MockQuestionCard() {
  return (
    <div aria-hidden className="rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-[0_16px_40px_-16px_rgba(15,32,68,0.18)] max-w-sm w-full">
      <p className="text-[11px] font-semibold text-[#047857] uppercase tracking-wider mb-2">User Access Control</p>
      <p className="text-base font-semibold text-[#0F2044] mb-4 leading-snug">
        Do all users have their own individual login accounts?
      </p>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2.5 rounded-[8px] border-2 border-[#047857] bg-[#ECFDF5] px-3.5 py-2.5">
          <span className="h-4 w-4 rounded-full border-[5px] border-[#047857] bg-white shrink-0" />
          <span className="text-sm text-[#0F2044] font-medium">Yes, everyone has their own account</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-[8px] border border-[#E2E8F0] px-3.5 py-2.5">
          <span className="h-4 w-4 rounded-full border border-[#CBD5E1] shrink-0" />
          <span className="text-sm text-[#475569]">Some accounts are shared</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-[8px] border border-[#E2E8F0] px-3.5 py-2.5">
          <span className="h-4 w-4 rounded-full border border-[#CBD5E1] shrink-0" />
          <span className="text-sm text-[#475569]">Not sure</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-[8px] bg-[#047857] px-4 py-2 text-sm font-semibold text-white">Continue</span>
        <span className="text-xs text-[#94A3B8]">Question 4 of 12</span>
      </div>
    </div>
  );
}

function MockScoreCard() {
  return (
    <div aria-hidden className="rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-[0_16px_40px_-16px_rgba(15,32,68,0.18)] max-w-sm w-full">
      <div className="flex items-center gap-5 mb-5">
        <div className="relative h-20 w-20 shrink-0">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#F1F5F9" strokeWidth="8" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke="#D97706" strokeWidth="8"
              strokeDasharray={`${Math.PI * 68 * 0.67} ${Math.PI * 68}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#0F2044] tabular-nums">67%</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0F2044] mb-1">Overall readiness</p>
          <span className="inline-flex text-xs bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] px-2 py-0.5 rounded-full font-medium">Nearly ready</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {[
          { area: "Firewalls", score: 85, color: "#059669" },
          { area: "Configuration", score: 72, color: "#D97706" },
          { area: "User Access", score: 61, color: "#D97706" },
          { area: "Malware", score: 88, color: "#059669" },
          { area: "Updates", score: 54, color: "#DC2626" },
        ].map((row) => (
          <div key={row.area} className="flex items-center justify-between gap-3">
            <span className="text-xs text-[#64748B] w-24 shrink-0">{row.area}</span>
            <div className="h-1.5 flex-1 rounded-full bg-[#F1F5F9] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${row.score}%`, backgroundColor: row.color }} />
            </div>
            <span className="text-xs text-[#64748B] w-8 text-right tabular-nums">{row.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockGapsCard() {
  return (
    <div aria-hidden className="rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-[0_16px_40px_-16px_rgba(15,32,68,0.18)] max-w-sm w-full">
      <p className="text-sm font-semibold text-[#0F2044] mb-4">Priority fixes</p>
      <div className="space-y-3">
        {[
          { pill: "P1", pillBg: "#FEF2F2", pillColor: "#B91C1C", pillBorder: "#FECACA", text: "Enable MFA across cloud services", sub: "User Access Control" },
          { pill: "P1", pillBg: "#FEF2F2", pillColor: "#B91C1C", pillBorder: "#FECACA", text: "Replace unsupported operating systems", sub: "Security Update Management" },
          { pill: "P2", pillBg: "#FFFBEB", pillColor: "#92400E", pillBorder: "#FDE68A", text: "Review admin user access", sub: "User Access Control" },
          { pill: "P3", pillBg: "#EFF6FF", pillColor: "#1D4ED8", pillBorder: "#BFDBFE", text: "Document secure setup process", sub: "Secure Configuration" },
        ].map((gap) => (
          <div key={gap.text} className="flex items-start gap-3 rounded-[8px] border border-[#F1F5F9] bg-[#F8FAFC] px-3.5 py-3">
            <span
              className="text-[11px] font-bold px-1.5 py-0.5 rounded-[4px] border shrink-0 mt-0.5"
              style={{ backgroundColor: gap.pillBg, color: gap.pillColor, borderColor: gap.pillBorder }}
            >
              {gap.pill}
            </span>
            <div>
              <p className="text-sm text-[#0F2044] font-medium leading-snug">{gap.text}</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">{gap.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockReportCard() {
  return (
    <div aria-hidden className="rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-[0_16px_40px_-16px_rgba(15,32,68,0.18)] max-w-sm w-full">
      <div className="flex items-center gap-3 mb-5">
        <IconTile icon={FileText} />
        <div>
          <p className="text-sm font-semibold text-[#0F2044]">Readiness Report</p>
          <p className="text-xs text-[#94A3B8]">PDF · Fenwick &amp; Hale Ltd</p>
        </div>
      </div>
      <ul className="space-y-2 mb-5">
        {[
          "Executive summary",
          "Five control area scores",
          "Gap analysis",
          "Priority action plan",
          "Preparation notes",
        ].map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-sm text-[#475569]">
            <Check className="h-3.5 w-3.5 text-[#047857] shrink-0" strokeWidth={2} />
            {item}
          </li>
        ))}
      </ul>
      <span className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#047857] px-4 py-2.5 text-sm font-semibold text-white">
        Download PDF report
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const supabase = createAdminClient();
  const { count: assessmentCount } = await supabase
    .from("assessments")
    .select("id", { count: "exact", head: true });

  return (
    <div className="bg-[#F8FAFC]">
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

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative bg-gradient-to-br from-[#0F2044] to-[#142A56] text-white pt-24 md:pt-28"
        aria-label="Hero"
      >
        {/* Ambient glow + grain (clipped to hero) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-32 right-[-10%] h-[560px] w-[560px] rounded-full bg-[#059669]/[0.14] blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] h-[480px] w-[480px] rounded-full bg-[#2563EB]/[0.08] blur-[120px]" />
          <div className="absolute inset-0 bg-noise opacity-[0.03]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-4 py-1.5 mb-6 text-xs font-medium text-white/80">
            {(assessmentCount ?? 0) >= SOCIAL_PROOF_THRESHOLD ? (
              <>
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#6EE7B7] opacity-75 animate-ping" aria-hidden />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6EE7B7]" aria-hidden />
                </span>
                {getAssessmentCountLabel(assessmentCount ?? 0)}
              </>
            ) : (
              SOCIAL_PROOF_FALLBACK
            )}
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-[64px] font-bold leading-[1.05] mb-6 max-w-3xl mx-auto">
            Get Cyber Essentials ready in <span className="text-[#6EE7B7]">2 hours</span>
          </h1>
          <p className="text-lg text-white/80 mb-9 leading-relaxed max-w-2xl mx-auto">
            BrightCert guides UK SMEs through a plain-English Cyber Essentials readiness assessment, highlights what needs attention, and creates a practical report before you apply for certification.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/assessment/new">Start Your Assessment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30 shadow-none">
              <Link href="/how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>

        {/* Dashboard preview — overlaps into the next section */}
        <div className="relative max-w-5xl mx-auto px-4 mt-14 md:mt-16 -mb-24 md:-mb-36">
          <div
            className="pointer-events-none absolute inset-x-8 top-8 bottom-0 rounded-[24px] bg-[#059669]/[0.25] blur-[80px]"
            aria-hidden
          />
          <Image
            src="/dashboard-ledger.png"
            alt="BrightCert dashboard showing a 67% readiness verdict, control area scores, priority actions, and assessment history"
            width={2720}
            height={1980}
            priority
            className="relative w-full h-auto rounded-[16px] ring-1 ring-white/15 shadow-[0_48px_120px_-24px_rgba(3,10,28,0.85)]"
          />
          <SocialProofBadge count={assessmentCount ?? 0} />
        </div>
      </section>

      {/* ── 2. TRUST STRIP ──────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#E2E8F0] pt-40 md:pt-56 pb-12" aria-label="Trust strip">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-5">Powered by</p>
          <PoweredByMarquee />
        </div>
      </section>

      {/* ── 3. PROBLEM ──────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-28" aria-labelledby="problem-heading">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-16 right-[-8%] h-[420px] w-[420px] rounded-full bg-[#059669]/[0.05] blur-[130px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <Eyebrow>The Problem</Eyebrow>
                <h2 id="problem-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] mb-5 leading-tight">
                  Cyber Essentials can feel harder than it should
                </h2>
                <p className="text-[#475569] leading-relaxed">
                  For many small businesses, Cyber Essentials starts with a simple goal: prove that your organisation takes cyber security seriously. But the preparation process can quickly become confusing. That uncertainty often leads to delays, guesswork, or expensive consultancy before you even understand the gaps.
                </p>
              </div>
            </Reveal>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  title: "You are not sure where you stand",
                  body: "You know Cyber Essentials matters, but you do not have a clear view of how close your business is to being ready.",
                },
                {
                  title: "The language feels technical",
                  body: "Firewalls, secure configuration, access control, malware protection, patching: the requirements are important, but they are not always explained in a way SMEs can act on quickly.",
                },
                {
                  title: "Consultants can be expensive",
                  body: "Many businesses only find out what needs fixing after paying for external help. BrightCert gives you a clear readiness picture first.",
                },
                {
                  title: "Your team needs next steps",
                  body: "A score alone is not enough. You need a practical list of what to fix, why it matters, and what to do next.",
                },
              ].map((card, i) => (
                <Reveal
                  key={card.title}
                  delay={i * 80}
                  className={`rounded-[12px] border border-[#E2E8F0] bg-white p-6 transition-all duration-200 hover:shadow-[0_12px_32px_-12px_rgba(15,32,68,0.15)] hover:-translate-y-0.5 ${i % 2 === 1 ? "sm:mt-8" : ""}`}
                >
                  <h3 className="text-base font-semibold text-[#0F2044] mb-2 leading-snug">{card.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{card.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. SOLUTION ─────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 border-y border-[#E2E8F0]" aria-labelledby="solution-heading">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal>
              <h2 id="solution-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] mb-6 leading-tight">
                A clearer way to prepare for Cyber Essentials
              </h2>
              <p className="text-[#475569] leading-relaxed mb-4">
                BrightCert turns Cyber Essentials preparation into a guided, step-by-step process.
              </p>
              <p className="text-[#475569] leading-relaxed mb-9">
                You answer simple questions about your organisation, devices, users, software, and security controls. BrightCert analyses your responses across the five Cyber Essentials control areas and gives you a readiness score, plain-English gap findings, and prioritised remediation steps.
              </p>
              <Button asChild size="lg">
                <Link href="/assessment/new">Start Your Assessment</Link>
              </Button>
            </Reveal>
            <Reveal delay={120} className="lg:max-w-md lg:justify-self-end w-full">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">
                Try a 30-second sample
              </p>
              <ReadinessTeaser />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28" aria-labelledby="how-it-works-heading">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="max-w-2xl mb-14">
            <Eyebrow>How It Works</Eyebrow>
            <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] leading-tight">
              From uncertainty to action in four clear steps
            </h2>
          </Reveal>
          <div className="space-y-16 md:space-y-24">
            {[
              {
                step: "01",
                title: "Answer simple questions",
                body: "Complete a guided assessment covering the five Cyber Essentials control areas. Each question is written in plain English, with helpful context where needed.",
                mockup: <MockQuestionCard />,
              },
              {
                step: "02",
                title: "Get your readiness score",
                body: "BrightCert analyses your answers and scores your organisation across the core Cyber Essentials areas.",
                mockup: <MockScoreCard />,
              },
              {
                step: "03",
                title: "Review your gaps",
                body: "Your results show where your business may fall short, with clear explanations and practical next steps.",
                mockup: <MockGapsCard />,
              },
              {
                step: "04",
                title: "Unlock your full report",
                body: "Pay £199 to unlock your full readiness report, including detailed gap analysis, remediation actions, and a preparation summary.",
                mockup: <MockReportCard />,
              },
            ].map((item, i) => (
              <Reveal key={item.step} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="font-display text-5xl font-bold text-transparent mb-5 [-webkit-text-stroke:1.5px_#94A3B8]">{item.step}</div>
                  <h3 className="text-xl md:text-2xl font-semibold text-[#0F2044] mb-3">{item.title}</h3>
                  <p className="text-base text-[#475569] leading-relaxed max-w-lg">{item.body}</p>
                </div>
                <div className={`flex justify-center ${i % 2 === 1 ? "lg:order-1 lg:justify-start" : "lg:justify-end"}`}>
                  {item.mockup}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. WHAT WE CHECK — ledger table echoing the product's own UI ─── */}
      <section
        id="what-we-check"
        className="bg-white py-20 md:py-28 border-y border-[#E2E8F0]"
        aria-labelledby="what-we-check-heading"
      >
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="max-w-2xl mb-10">
            <h2 id="what-we-check-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] mb-4 leading-tight">
              Built around the Cyber Essentials requirements
            </h2>
            <p className="text-[#475569] leading-relaxed">
              Cyber Essentials focuses on five technical control areas that help protect organisations from common internet-based cyber threats. BrightCert structures your assessment around these same five areas.
            </p>
          </Reveal>
          <Reveal>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-[#E2E8F0] py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#64748B]">
                    Control area
                  </th>
                  <th className="hidden border-b border-[#E2E8F0] py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#64748B] sm:table-cell">
                    What we check
                  </th>
                  <th className="border-b border-[#E2E8F0] py-2.5 text-right text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#64748B]">
                    Questions
                  </th>
                </tr>
              </thead>
              <tbody>
                {CONTROL_AREA_ROWS.map((area) => (
                  <tr key={area.id}>
                    <td className="border-b border-[#EEF1F6] py-4 pr-6 align-baseline font-semibold text-[#0F2044] sm:whitespace-nowrap">
                      <b className="font-semibold">{area.id}.</b> {area.title}
                    </td>
                    <td className="hidden border-b border-[#EEF1F6] py-4 pr-6 align-baseline text-[#47536B] sm:table-cell">
                      {area.summary}
                    </td>
                    <td className="border-b border-[#EEF1F6] py-4 text-right align-baseline tabular-nums text-[#64748B]">
                      {getQuestionsBySection(area.id).length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* ── 7. REPORT PREVIEW — the single "what you get" moment ─────────── */}
      <section className="py-4 md:py-8" aria-labelledby="report-heading">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-[24px] bg-[#0F2044] text-white px-6 py-16 md:px-14 md:py-20">
            <div
              className="pointer-events-none absolute -top-24 left-[10%] h-[420px] w-[420px] rounded-full bg-[#059669]/[0.12] blur-[110px]"
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.03]" aria-hidden />
            <div className="relative flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <Eyebrow light>Your Report</Eyebrow>
                <h2 id="report-heading" className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
                  Know what to fix before you apply
                </h2>
                <p className="text-white/70 mb-7 leading-relaxed">
                  Your BrightCert report gives you a structured view of your Cyber Essentials readiness. It is designed to help you understand your current position, share findings with the right people, and work through improvements before applying for official certification.
                </p>
                <ul className="space-y-3 mb-9">
                  {[
                    { label: "Executive summary", desc: "Your readiness score, strongest areas, and main risks." },
                    { label: "Five control area scores", desc: "Performance across the five control areas." },
                    { label: "Gap analysis", desc: "Where your current setup may not meet expected requirements." },
                    { label: "Priority action plan", desc: "Recommended fixes, ordered by importance." },
                    { label: "Preparation notes", desc: "Guidance before working with a Certification Body." },
                    { label: "PDF download", desc: "Save it, share it, review it with your team." },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-[#6EE7B7] shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-sm text-white/80">
                        <strong className="block text-white font-medium">{item.label}</strong>
                        {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="bg-white text-[#0F2044] hover:bg-white/90 shadow-none">
                  <Link href="/assessment/new">Start Your Assessment</Link>
                </Button>
                <p className="mt-3 text-xs text-white/55">
                  Complete the assessment first. Pay £199 only when you are ready to unlock the full report.
                </p>
              </div>
              {/* Mock report card */}
              <div className="rounded-[16px] border border-white/10 bg-white/[0.06] backdrop-blur-md p-6 max-w-xs w-full shadow-[0_24px_60px_-16px_rgba(3,10,28,0.6)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-[#059669]" strokeWidth={1.5} />
                    <span className="font-semibold text-sm">BrightCert Report</span>
                  </div>
                  <span className="text-xs text-white/40">PDF</span>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    { area: "Firewalls", score: 85, status: "pass" },
                    { area: "Configuration", score: 72, status: "warning" },
                    { area: "User Access", score: 61, status: "warning" },
                    { area: "Malware", score: 88, status: "pass" },
                    { area: "Updates", score: 54, status: "fail" },
                  ].map((row) => (
                    <div key={row.area} className="flex items-center justify-between">
                      <span className="text-xs text-white/60">{row.area}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${row.score}%`,
                              backgroundColor: row.status === "pass" ? "#059669" : row.status === "warning" ? "#D97706" : "#DC2626",
                            }}
                          />
                        </div>
                        <span className="text-xs text-white/60 w-8 text-right tabular-nums">{row.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#059669]" strokeWidth={1.5} />
                  <span className="text-xs text-white/60">Download PDF report</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. PRICING ──────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-28" aria-labelledby="pricing-heading">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-[460px] w-[720px] rounded-full bg-[#059669]/[0.05] blur-[130px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow center>Pricing</Eyebrow>
            <h2 id="pricing-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] mb-4 leading-tight">
              Simple pricing for Cyber Essentials preparation
            </h2>
            <p className="text-[#475569]">
              Start with a guided readiness assessment. Upgrade only when you need ongoing monitoring, CE Plus preparation, or partner features.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-10 items-start">
            {/* Featured: Assessment */}
            <div className="relative flex flex-col rounded-[16px] border-2 border-[#047857] bg-white p-6 shadow-[0_16px_40px_-12px_rgba(4,120,87,0.25)]">
              <div className="absolute -top-3 left-6">
                <span className="bg-[#047857] text-white text-[11px] font-semibold px-2.5 py-1 rounded-[4px] uppercase tracking-wide">Most Popular</span>
              </div>
              <p className="text-xs font-semibold text-[#047857] uppercase tracking-wider mb-2 mt-1">Assessment</p>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="font-display text-4xl font-bold text-[#0F2044] tabular-nums">£199</span>
                <span className="text-xs text-[#64748B]">one-time</span>
              </div>
              <p className="text-xs text-[#475569] mb-5">Best for UK SMEs preparing for Cyber Essentials and wanting a clear view before applying.</p>
              <ul className="space-y-2 mb-6">
                {[
                  "Guided readiness assessment across all five control areas",
                  "AI-assisted scoring and gap analysis",
                  "Prioritised remediation steps",
                  "Downloadable PDF report",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-[#475569]">
                    <Check className="h-3.5 w-3.5 text-[#047857] shrink-0 mt-0.5" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Button asChild className="w-full">
                  <Link href="/assessment/new">Start Your Assessment</Link>
                </Button>
                <p className="text-xs text-[#64748B] text-center mt-2">Complete first. Pay when you&apos;re ready to unlock.</p>
              </div>
            </div>

            {/* Upgrade tiers — full detail lives on /pricing */}
            <div className="lg:pt-2">
              {[
                {
                  id: "monitor",
                  name: "Monitor",
                  price: "£99",
                  cadence: "/month",
                  bestFor: "Ongoing visibility after your initial readiness report.",
                  href: "/pricing#monitor",
                },
                {
                  id: "ce-plus",
                  name: "CE Plus Pack",
                  price: "£499",
                  cadence: "one-time",
                  bestFor: "Preparation for Cyber Essentials Plus before technical testing.",
                  href: "/pricing",
                },
                {
                  id: "msp-partner",
                  name: "MSP Partner",
                  price: "£299",
                  cadence: "/month",
                  bestFor: "For MSPs supporting multiple UK SME clients.",
                  href: "/pricing#msp",
                },
              ].map((tier, i) => (
                <div
                  key={tier.id}
                  id={tier.id === "ce-plus" ? undefined : tier.id}
                  className={`grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 py-5 border-b border-[#EEF1F6] sm:grid-cols-[130px_110px_minmax(0,1fr)_auto] ${i === 0 ? "border-t border-[#E2E8F0]" : ""}`}
                >
                  <span className="text-sm font-bold text-[#0F2044]">{tier.name}</span>
                  <span className="text-sm font-bold tabular-nums text-[#0F2044] text-right sm:text-left">
                    {tier.price} <span className="text-xs font-normal text-[#64748B]">{tier.cadence}</span>
                  </span>
                  <span className="col-span-2 text-[13px] text-[#64748B] sm:col-span-1">{tier.bestFor}</span>
                  <Link
                    href={tier.href}
                    className="bc-focus col-span-2 text-[13px] font-semibold text-[#047857] hover:text-[#065F46] sm:col-span-1 sm:text-right whitespace-nowrap"
                  >
                    View pricing →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. COMPARISON ──────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 border-y border-[#E2E8F0]" aria-labelledby="comparison-heading">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <h2 id="comparison-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] mb-4 leading-tight">
              Understand your gaps before you spend more
            </h2>
            <p className="text-[#475569] mb-2">
              Traditional consultancy can be valuable, especially for complex organisations. But many SMEs first need a clear answer to a simpler question:
            </p>
            <p className="font-semibold text-lg text-[#0F2044] mb-10">Are we ready, and what do we need to fix?</p>
          </Reveal>
          <div className="overflow-x-auto rounded-[12px] border border-[#E2E8F0]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="text-left py-3.5 px-5 text-[#64748B] font-medium">Without BrightCert</th>
                  <th className="text-left py-3.5 px-5 text-[#047857] font-semibold">With BrightCert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {[
                  ["You may not know where to begin", "Start with a guided assessment"],
                  ["Technical language can slow you down", "Questions are written in plain English"],
                  ["You may pay for advice before knowing the gaps", "See your readiness position first"],
                  ["Findings can be scattered across emails or calls", "Get a structured PDF report"],
                  ["Teams may not know what to fix first", "Receive prioritised remediation steps"],
                  ["Progress can feel unclear", "Track score, status, and next actions"],
                ].map(([without, with_], i) => (
                  <tr key={i}>
                    <td className="py-3.5 px-5 text-[#64748B]">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-[#DC2626] shrink-0 mt-0.5" strokeWidth={1.5} />
                        {without}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-[#0F2044] bg-[#ECFDF5]/40">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" strokeWidth={2} />
                        {with_}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 11. AUDIENCE ────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28" aria-labelledby="audience-heading">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="max-w-2xl mb-12">
            <h2 id="audience-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] leading-tight">
              Built for the businesses that need clarity fast
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {[
              {
                title: "Small business owners",
                body: "You need to show customers, suppliers, or partners that your business takes cyber security seriously, but you do not have a large internal IT team.",
              },
              {
                title: "Operations managers",
                body: "You have been asked to prepare for Cyber Essentials and need a structured way to collect answers, spot gaps, and organise next steps.",
              },
              {
                title: "IT providers",
                body: "You support clients who need Cyber Essentials preparation and want a repeatable way to assess readiness before formal application.",
              },
              {
                title: "Growing suppliers",
                body: "You are bidding for work where Cyber Essentials is expected or required, and you need to understand whether your business is ready.",
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 80} className="border-t-2 border-[#0F2044] pt-5">
                <h3 className="text-base font-semibold text-[#0F2044] mb-2">{card.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{card.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. TRUST ───────────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 border-y border-[#E2E8F0]" aria-labelledby="trust-heading">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal className="text-center">
            <h2 id="trust-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] mb-5 leading-tight">
              Clear guidance without false promises
            </h2>
            <p className="text-[#475569] mb-12 leading-relaxed max-w-2xl mx-auto">
              BrightCert is careful about what it does, and what it does not do. We help you prepare for Cyber Essentials by assessing your readiness, identifying gaps, and creating a practical report. We do not issue the official Cyber Essentials certificate. Official certification is handled through IASME Certification Bodies.
            </p>
          </Reveal>
          <CertificationDisclaimer />
        </div>
      </section>

      {/* ── 13. FOUNDER'S NOTE ──────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 border-y border-[#E2E8F0]" aria-labelledby="founder-heading">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <Eyebrow>Founder&apos;s Note</Eyebrow>
            <h2 id="founder-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] mb-8 leading-tight">
              Why I built BrightCert
            </h2>
          </Reveal>
          <Reveal
            delay={80}
            className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-8 md:p-10 shadow-[0_1px_3px_rgba(15,32,68,0.06),0_16px_48px_-16px_rgba(15,32,68,0.1)]"
          >
            <div className="space-y-4 text-[#475569] leading-relaxed mb-8">
              <p>
                I started BrightCert after watching UK small businesses stall out on Cyber Essentials, not because the technical controls are hard, but because the preparation process is opaque and the language is written for auditors, not business owners.
              </p>
              <p>
                My background is in cybersecurity research. I hold a Master&apos;s degree in Cyber Security with Advanced Research from the University of Hertfordshire, awarded with distinction, and my thesis compared the Nessus and OpenVAS vulnerability scanners on Ubuntu web servers. I also hold certifications in Digital Forensics, Ethical Hacking, and Network Defense from EC-Council, alongside Fortinet&apos;s Cybersecurity Fundamentals and Huawei&apos;s HCIP in Routing and Switching.
              </p>
              <p>
                Outside BrightCert, I run Cognumi, where I build AI-managed operations and security-focused automation for service businesses. BrightCert brings that same approach, plain-English analysis backed by real security research, to Cyber Essentials preparation.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                "MSc Cyber Security (Distinction)",
                "EC-Council Certified",
                "Fortinet Certified",
                "Founder, Cognumi",
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-6 border-t border-[#E2E8F0]">
              <div className="h-11 w-11 rounded-full bg-[#0F2044] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                MSR
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F2044]">Muhammad Sohaib Roomi</p>
                <p className="text-xs text-[#64748B]">Founder, BrightCert · Cognumi Ltd</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 14. FAQ ─────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 md:py-28" aria-labelledby="faq-heading">
        <div className="max-w-5xl mx-auto px-4">
          <Reveal className="mb-12">
            <Eyebrow>FAQs</Eyebrow>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] leading-tight">
                Common questions
              </h2>
              <p className="text-sm text-[#64748B]">
                Still have questions?{" "}
                <a href="mailto:hello@brightcert.co.uk" className="font-semibold text-[#047857] hover:underline">
                  Contact us
                </a>
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            {[
              { q: "Does BrightCert issue the official Cyber Essentials certificate?", a: "No. BrightCert provides readiness assessment and preparation support. Official Cyber Essentials certification must be completed through an IASME-licensed Certification Body." },
              { q: "Do I need to pay before starting the assessment?", a: "No. You can complete the full assessment first. Payment of £199 is required only when you want to unlock your full readiness report and PDF download." },
              { q: "How long does the assessment take?", a: "Most businesses can complete the assessment in around 2 hours. You can save your progress and return at any time." },
              { q: "Is BrightCert suitable for non-technical users?", a: "Yes. BrightCert is designed to explain Cyber Essentials preparation in plain English. You do not need to be a cyber security expert to complete the assessment." },
              { q: "Do you store my answers securely?", a: "Yes. Your assessment responses are stored securely and used only to generate your readiness report. We do not share your data with third parties." },
              { q: "What is the difference between Cyber Essentials and Cyber Essentials Plus?", a: "Cyber Essentials is a self-assessed questionnaire reviewed by a Certification Body. Cyber Essentials Plus also includes an external technical verification. BrightCert currently supports preparation for both, with specific CE Plus guidance in the CE Plus Pack." },
            ].map((item) => (
              <div key={item.q}>
                <p className="text-base font-medium text-[#0F2044] mb-2">{item.q}</p>
                <p className="text-sm text-[#475569] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 15. CTA BANNER ──────────────────────────────────────────────── */}
      <section className="pb-20 md:pb-28 pt-4" aria-label="Call to action">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0F2044] to-[#142A56] text-white px-6 py-16 md:py-20 text-center">
            <div
              className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 h-[480px] w-[720px] rounded-full bg-[#059669]/[0.15] blur-[110px]"
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.03]" aria-hidden />
            <div className="relative max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-[40px] font-bold mb-5 leading-tight">
                Find out how ready your business is
              </h2>
              <p className="text-white/70 mb-9 leading-relaxed">
                Complete your Cyber Essentials readiness assessment, review your score, and unlock a practical report showing what to fix next.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <Link href="/assessment/new">Start Your Assessment</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30 shadow-none">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
