import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  FileText,
  Target,
  AlertCircle,
  CheckCircle2,
  Check,
  XCircle,
  ChevronDown,
  Wifi,
  Settings,
  Users,
  Bug,
  RefreshCw,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificationDisclaimer } from "@/components/brightcert/certification-disclaimer";
import { Reveal } from "@/components/brightcert/reveal";

// ─── Section eyebrow ──────────────────────────────────────────────────────────
function Eyebrow({ children, center = false, light = false }: { children: React.ReactNode; center?: boolean; light?: boolean }) {
  const tone = light ? "text-[#6EE7B7]" : "text-[#047857]";
  const dash = light ? "bg-[#6EE7B7]" : "bg-[#047857]";
  return (
    <p className={`flex items-center gap-2 text-xs font-bold ${tone} uppercase tracking-widest mb-4 ${center ? "justify-center" : ""}`}>
      <span className={`h-px w-6 ${dash}`} aria-hidden />
      {children}
    </p>
  );
}

// ─── Control area card ────────────────────────────────────────────────────────
function ControlCard({
  icon: Icon,
  number,
  title,
  checks,
  className = "",
}: {
  icon: React.ElementType;
  number: number;
  title: string;
  checks: string[];
  className?: string;
}) {
  return (
    <div className={`group rounded-[16px] border border-[#E2E8F0] bg-white p-6 transition-all duration-200 hover:border-[#A7F3D0] hover:shadow-[0_12px_32px_-12px_rgba(15,32,68,0.18)] hover:-translate-y-0.5 ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="h-10 w-10 rounded-[10px] bg-[#ECFDF5] flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#D1FAE5]">
          <Icon className="h-5 w-5 text-[#047857]" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#047857] uppercase tracking-wider mb-0.5">Area {number}</p>
          <h3 className="text-base font-semibold text-[#0F2044] leading-snug">{title}</h3>
        </div>
      </div>
      <ul className="space-y-2">
        {checks.map((check) => (
          <li key={check} className="flex items-start gap-2.5 text-sm text-[#475569]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#059669] shrink-0 mt-[7px]" aria-hidden />
            <span>{check}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
        <div className="h-11 w-11 rounded-[10px] bg-[#ECFDF5] flex items-center justify-center shrink-0">
          <FileText className="h-5.5 w-5.5 text-[#047857]" strokeWidth={1.5} />
        </div>
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

// ─── FAQ item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-[#E2E8F0] py-5">
      <summary className="flex items-center justify-between cursor-pointer list-none gap-4">
        <span className="text-base font-medium text-[#0F2044]">{q}</span>
        <ChevronDown className="h-4 w-4 text-[#64748B] group-open:rotate-180 transition-transform duration-200 shrink-0" />
      </summary>
      <p className="mt-3 text-sm text-[#475569] leading-relaxed max-w-2xl">{a}</p>
    </details>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="bg-[#F8FAFC]">

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
          <h1 className="font-display text-5xl md:text-6xl lg:text-[64px] font-bold leading-[1.05] mb-6 max-w-3xl mx-auto">
            Get Cyber Essentials ready in <span className="text-[#6EE7B7]">2 hours</span>
          </h1>
          <p className="text-lg text-white/80 mb-3 leading-relaxed max-w-2xl mx-auto">
            BrightCert guides UK SMEs through a plain-English Cyber Essentials readiness assessment, highlights what needs attention, and creates a practical report before you apply for certification.
          </p>
          <p className="text-sm text-white/60 mb-9 max-w-xl mx-auto">
            No confusing forms. No expensive consultancy-first process. Just clear questions, smart analysis, and a step-by-step view of what to fix next.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
            <Button asChild size="lg">
              <Link href="/assessment/new">Start Your Assessment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30 shadow-none">
              <Link href="/how-it-works">See How It Works</Link>
            </Button>
          </div>
          <p className="text-xs text-white/50">Built for UK businesses preparing for Cyber Essentials.</p>
        </div>

        {/* Dashboard preview — overlaps into the next section */}
        <div className="relative max-w-5xl mx-auto px-4 mt-14 md:mt-16 -mb-24 md:-mb-36">
          <div
            className="pointer-events-none absolute inset-x-8 top-8 bottom-0 rounded-[24px] bg-[#059669]/[0.25] blur-[80px]"
            aria-hidden
          />
          <Image
            src="/dashboard-preview.png"
            alt="BrightCert dashboard showing a 67% readiness score, open priority actions, and assessment history"
            width={1586}
            height={992}
            priority
            className="relative w-full h-auto rounded-[16px] ring-1 ring-white/15 shadow-[0_48px_120px_-24px_rgba(3,10,28,0.85)]"
          />
        </div>
      </section>

      {/* ── 2. TRUST STRIP ──────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#E2E8F0] pt-40 md:pt-56 pb-12" aria-label="Trust strip">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm font-semibold text-[#475569] mb-8">
            Designed for UK SMEs preparing for Cyber Essentials
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
            {[
              { label: "Plain-English questions", desc: "No jargon-heavy compliance language." },
              { label: "AI-assisted gap analysis", desc: "Clear scoring across the five control areas." },
              { label: "Practical remediation report", desc: "Know what to fix before applying." },
              { label: "UK-specific guidance", desc: "Built around Cyber Essentials, GBP pricing, and SME needs." },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 80} className="border-l-2 border-[#A7F3D0] pl-4">
                <p className="text-sm font-semibold text-[#0F2044] mb-1">{item.label}</p>
                <p className="text-sm text-[#64748B]">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PROBLEM ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28" aria-labelledby="problem-heading">
        <div className="max-w-6xl mx-auto px-4">
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
                  body: "Firewalls, secure configuration, access control, malware protection, patching — the requirements are important, but they are not always explained in a way SMEs can act on quickly.",
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
                  <XCircle className="h-5 w-5 text-[#DC2626] mb-3" strokeWidth={1.5} />
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
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Reveal>
            <Eyebrow center>The Solution</Eyebrow>
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
              <Link href="/assessment/new">Start Your Readiness Assessment</Link>
            </Button>
          </Reveal>
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
                note: "Answer honestly. The goal is not to look perfect — it is to understand what needs fixing before you apply.",
                mockup: <MockQuestionCard />,
              },
              {
                step: "02",
                title: "Get your readiness score",
                body: "BrightCert analyses your answers and scores your organisation across the core Cyber Essentials areas.",
                note: "See your overall readiness score and understand which areas are strong, weak, or incomplete.",
                mockup: <MockScoreCard />,
              },
              {
                step: "03",
                title: "Review your gaps",
                body: "Your results show where your business may fall short, with clear explanations and practical next steps.",
                note: "No alarmist language. Just clear findings, prioritised by what matters most.",
                mockup: <MockGapsCard />,
              },
              {
                step: "04",
                title: "Unlock your full report",
                body: "Pay £199 to unlock your full readiness report, including detailed gap analysis, remediation actions, and a preparation summary.",
                note: "Use the report to fix issues internally or prepare for your application with a Certification Body.",
                mockup: <MockReportCard />,
              },
            ].map((item, i) => (
              <Reveal key={item.step} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="font-display text-5xl font-bold text-transparent mb-5 [-webkit-text-stroke:1.5px_#94A3B8]">{item.step}</div>
                  <h3 className="text-xl md:text-2xl font-semibold text-[#0F2044] mb-3">{item.title}</h3>
                  <p className="text-base text-[#475569] leading-relaxed mb-3 max-w-lg">{item.body}</p>
                  <p className="text-sm text-[#64748B] italic max-w-lg">{item.note}</p>
                </div>
                <div className={`flex justify-center ${i % 2 === 1 ? "lg:order-1 lg:justify-start" : "lg:justify-end"}`}>
                  {item.mockup}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. WHAT WE CHECK ────────────────────────────────────────────── */}
      <section
        id="what-we-check"
        className="bg-white py-20 md:py-28 border-y border-[#E2E8F0]"
        aria-labelledby="what-we-check-heading"
      >
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="max-w-2xl mb-12">
            <Eyebrow>The Five Control Areas</Eyebrow>
            <h2 id="what-we-check-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] mb-4 leading-tight">
              Built around the Cyber Essentials requirements
            </h2>
            <p className="text-[#475569] leading-relaxed">
              Cyber Essentials focuses on five technical control areas that help protect organisations from common internet-based cyber threats. BrightCert structures your assessment around these same five areas.
            </p>
          </Reveal>
          {/* Bento: 3 across, then 2 wider */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            <Reveal className="md:col-span-2" delay={0}>
              <ControlCard
                icon={Wifi}
                number={1}
                title="Boundary Firewalls & Internet Gateways"
                checks={[
                  "Whether firewalls are in place",
                  "Whether default settings have been changed",
                  "Whether inbound access is controlled",
                  "Whether unnecessary services are exposed",
                  "Whether network boundaries are understood",
                ]}
                className="h-full"
              />
            </Reveal>
            <Reveal className="md:col-span-2" delay={80}>
              <ControlCard
                icon={Settings}
                number={2}
                title="Secure Configuration"
                checks={[
                  "Whether default passwords are changed",
                  "Whether unused accounts are removed",
                  "Whether unnecessary software is disabled",
                  "Whether devices are configured consistently",
                  "Whether secure setup processes are documented",
                ]}
                className="h-full"
              />
            </Reveal>
            <Reveal className="md:col-span-2" delay={160}>
              <ControlCard
                icon={Users}
                number={3}
                title="User Access Control"
                checks={[
                  "Whether users have only the access they need",
                  "Whether admin accounts are limited",
                  "Whether leavers are removed quickly",
                  "Whether multi-factor authentication is used",
                  "Whether access is reviewed regularly",
                ]}
                className="h-full"
              />
            </Reveal>
            <Reveal className="md:col-span-3" delay={240}>
              <ControlCard
                icon={Bug}
                number={4}
                title="Malware Protection"
                checks={[
                  "Whether anti-malware protection is active",
                  "Whether protection is kept up to date",
                  "Whether application controls are used",
                  "Whether users can install software freely",
                  "Whether mobile and desktop devices are covered",
                ]}
                className="h-full"
              />
            </Reveal>
            <Reveal className="md:col-span-3" delay={320}>
              <ControlCard
                icon={RefreshCw}
                number={5}
                title="Security Update Management"
                checks={[
                  "Whether security updates are applied promptly",
                  "Whether unsupported software is removed",
                  "Whether operating systems are still supported",
                  "Whether update responsibilities are clear",
                  "Whether patching is tracked across devices",
                ]}
                className="h-full"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 7. PRODUCT FEATURES ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="max-w-2xl mb-12">
            <Eyebrow>What You Get</Eyebrow>
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] mb-4 leading-tight">
              A practical readiness report, not another vague checklist
            </h2>
            <p className="text-[#475569] leading-relaxed">
              BrightCert does more than ask questions. It turns your answers into a clear picture of your Cyber Essentials readiness, so your business can take action with confidence.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Target,
                title: "Readiness score",
                body: "See your overall readiness level at a glance, with clear pass, warning, and fail indicators across each control area.",
                note: "Your score helps you understand whether you are close to applying or whether key gaps need attention first.",
              },
              {
                icon: ShieldCheck,
                title: "Control-by-control analysis",
                body: "Break down your results across all five Cyber Essentials areas, so you know exactly where the risks are.",
                note: "Instead of one generic result, BrightCert shows which parts of your setup are strong and which need work.",
              },
              {
                icon: AlertCircle,
                title: "Plain-English gap findings",
                body: "Understand what each issue means without needing to be a cyber security expert.",
                note: "BrightCert explains findings in simple language, helping business owners and IT providers act quickly.",
              },
              {
                icon: CheckCircle2,
                title: "Prioritised remediation steps",
                body: "Get a clear action list showing what to fix first.",
                note: "Each recommendation helps your team move from 'we know there is a problem' to 'we know what to do next.'",
              },
              {
                icon: FileText,
                title: "Downloadable PDF report",
                body: "Unlock a professional report you can save, share, and use as part of your preparation process.",
                note: "The report gives your team a structured summary of your readiness, key gaps, and recommended next steps.",
              },
              {
                icon: Star,
                title: "Built for UK SMEs",
                body: "BrightCert is designed for UK businesses that want practical guidance without unnecessary complexity.",
                note: "The language, pricing, structure, and compliance context are UK-specific from the start.",
              },
            ].map((item, i) => (
              <Reveal
                key={item.title}
                delay={(i % 3) * 80}
                className="group rounded-[16px] bg-white p-6 shadow-[0_1px_3px_rgba(15,32,68,0.06),0_8px_24px_-12px_rgba(15,32,68,0.08)] transition-all duration-200 hover:shadow-[0_16px_40px_-12px_rgba(15,32,68,0.18)] hover:-translate-y-0.5"
              >
                <div className="h-10 w-10 rounded-[10px] bg-[#ECFDF5] flex items-center justify-center mb-4 transition-colors group-hover:bg-[#D1FAE5]">
                  <item.icon className="h-5 w-5 text-[#047857]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-[#0F2044] mb-2">{item.title}</h3>
                <p className="text-sm text-[#475569] mb-2 leading-relaxed">{item.body}</p>
                <p className="text-xs text-[#64748B] italic">{item.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. REPORT PREVIEW ───────────────────────────────────────────── */}
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
                    { label: "Executive summary", desc: "A simple overview of your readiness score, strongest areas, and main risks." },
                    { label: "Five control area scores", desc: "A breakdown of your performance across the five Cyber Essentials control areas." },
                    { label: "Gap analysis", desc: "Clear explanations of where your current setup may not meet expected requirements." },
                    { label: "Priority action plan", desc: "A practical list of recommended fixes, ordered by importance." },
                    { label: "Preparation notes", desc: "Helpful guidance to support your next steps before working with a Certification Body." },
                    { label: "PDF download", desc: "A professional copy of your report that can be saved, shared, or reviewed with your team." },
                  ].map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-[#6EE7B7] shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-sm text-white/80">
                        <strong className="text-white font-medium">{item.label}</strong> — {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="bg-white text-[#0F2044] hover:bg-white/90 shadow-none">
                  <Link href="/assessment/new">Unlock Full Report for £199</Link>
                </Button>
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
      <section className="py-20 md:py-28" aria-labelledby="pricing-heading">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow center>Pricing</Eyebrow>
            <h2 id="pricing-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] mb-4 leading-tight">
              Simple pricing for Cyber Essentials preparation
            </h2>
            <p className="text-[#475569]">
              Start with a guided readiness assessment. Upgrade only when you need ongoing monitoring, CE Plus preparation, or partner features.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
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
              <p className="text-xs text-[#475569] mb-5 min-h-[48px]">Best for UK SMEs preparing for Cyber Essentials and wanting a clear view before applying.</p>
              <ul className="space-y-2 mb-6">
                {[
                  "Guided CE readiness assessment",
                  "Questions across all five control areas",
                  "AI-assisted scoring and gap analysis",
                  "Overall readiness score",
                  "Control-by-control results",
                  "Prioritised remediation steps",
                  "Downloadable PDF report",
                  "Plain-English preparation guidance",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#475569]">
                    <Check className="h-3.5 w-3.5 text-[#047857] shrink-0 mt-0.5" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Button asChild className="w-full">
                  <Link href="/assessment/new">Start Assessment</Link>
                </Button>
                <p className="text-xs text-[#64748B] text-center mt-2">Complete first. Pay when you&apos;re ready to unlock.</p>
              </div>
            </div>

            {/* Monitor */}
            <div className="flex flex-col rounded-[16px] border border-[#E2E8F0] bg-white p-6 transition-all duration-200 hover:shadow-[0_12px_32px_-12px_rgba(15,32,68,0.15)]">
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2 mt-1">Monitor</p>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="font-display text-4xl font-bold text-[#0F2044] tabular-nums">£99</span>
                <span className="text-xs text-[#64748B]">/month</span>
              </div>
              <p className="text-xs text-[#475569] mb-5 min-h-[48px]">Businesses that want ongoing visibility after their initial readiness report.</p>
              <ul className="space-y-2 mb-6">
                {["Monthly readiness review", "Saved assessment history", "Ongoing remediation tracking", "Updated action list", "Report access", "Renewal preparation support"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#475569]">
                    <Check className="h-3.5 w-3.5 text-[#059669] shrink-0 mt-0.5" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/pricing">Join Monitor</Link>
                </Button>
              </div>
            </div>

            {/* CE Plus */}
            <div className="flex flex-col rounded-[16px] border border-[#E2E8F0] bg-white p-6 transition-all duration-200 hover:shadow-[0_12px_32px_-12px_rgba(15,32,68,0.15)]">
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2 mt-1">CE Plus Pack</p>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="font-display text-4xl font-bold text-[#0F2044] tabular-nums">£499</span>
                <span className="text-xs text-[#64748B]">one-time</span>
              </div>
              <p className="text-xs text-[#475569] mb-5 min-h-[48px]">Businesses preparing for Cyber Essentials Plus before technical testing.</p>
              <ul className="space-y-2 mb-6">
                {["CE Plus preparation checklist", "Evidence collection guidance", "Device and system readiness review", "Remediation planning", "Internal preparation summary", "Priority support"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#475569]">
                    <Check className="h-3.5 w-3.5 text-[#059669] shrink-0 mt-0.5" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/pricing">Prepare for CE Plus</Link>
                </Button>
              </div>
            </div>

            {/* MSP */}
            <div className="flex flex-col rounded-[16px] border border-[#E2E8F0] bg-white p-6 transition-all duration-200 hover:shadow-[0_12px_32px_-12px_rgba(15,32,68,0.15)]" id="msp-partner">
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2 mt-1">MSP Partner</p>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="font-display text-4xl font-bold text-[#0F2044] tabular-nums">£299</span>
                <span className="text-xs text-[#64748B]">/month</span>
              </div>
              <p className="text-xs text-[#475569] mb-5 min-h-[48px]">MSPs supporting multiple UK SME clients with Cyber Essentials preparation.</p>
              <ul className="space-y-2 mb-6">
                {["Multi-client dashboard", "Client assessment tracking", "Readiness reports", "Partner workflow tools", "Client remediation visibility", "MSP-focused reporting"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#475569]">
                    <Check className="h-3.5 w-3.5 text-[#059669] shrink-0 mt-0.5" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/pricing#msp">Become a Partner</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. COMPARISON ──────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 border-y border-[#E2E8F0]" aria-labelledby="comparison-heading">
        <div className="max-w-4xl mx-auto px-4">
          <Reveal>
            <Eyebrow>Why BrightCert</Eyebrow>
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
            <Eyebrow>Who It Is For</Eyebrow>
            <h2 id="audience-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] mb-4 leading-tight">
              Built for the businesses that need clarity fast
            </h2>
            <p className="text-[#475569] leading-relaxed">
              BrightCert is designed for UK SMEs that need to prepare for Cyber Essentials without turning the process into a long, technical project.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {[
              {
                title: "Small business owners",
                body: "You need to show customers, suppliers, or partners that your business takes cyber security seriously — but you do not have a large internal IT team.",
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
            <Eyebrow center>Trust &amp; Clarity</Eyebrow>
            <h2 id="trust-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] mb-5 leading-tight">
              Clear guidance without false promises
            </h2>
            <p className="text-[#475569] mb-12 leading-relaxed max-w-2xl mx-auto">
              BrightCert is careful about what it does — and what it does not do. We help you prepare for Cyber Essentials by assessing your readiness, identifying gaps, and creating a practical report. We do not issue the official Cyber Essentials certificate. Official certification is handled through IASME Certification Bodies.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-10">
            {[
              {
                title: "Preparation, not certification",
                body: "BrightCert helps you understand your readiness before applying. It does not replace the official certification process.",
              },
              {
                title: "Plain-English explanations",
                body: "Every finding is written to help non-technical business users understand what needs attention.",
              },
              {
                title: "Practical next steps",
                body: "Your report focuses on action, not fear.",
              },
              {
                title: "UK-specific product",
                body: "BrightCert is built for UK SMEs preparing for a UK cyber security scheme.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#059669] shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-base font-semibold text-[#0F2044] mb-1">{item.title}</p>
                  <p className="text-sm text-[#64748B]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <CertificationDisclaimer />
        </div>
      </section>

      {/* ── 13. FAQ ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-4">
          <Reveal className="mb-10">
            <Eyebrow>FAQs</Eyebrow>
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-[#0F2044] leading-tight">
              Common questions
            </h2>
          </Reveal>
          <div>
            {[
              { q: "Does BrightCert issue the official Cyber Essentials certificate?", a: "No. BrightCert provides readiness assessment and preparation support. Official Cyber Essentials certification must be completed through an IASME-licensed Certification Body." },
              { q: "Do I need to pay before starting the assessment?", a: "No. You can complete the full assessment first. Payment of £199 is required only when you want to unlock your full readiness report and PDF download." },
              { q: "How long does the assessment take?", a: "Most businesses can complete the assessment in around 2 hours. You can save your progress and return at any time." },
              { q: "What happens after I complete the assessment?", a: "BrightCert analyses your responses across the five Cyber Essentials control areas and shows you an overall readiness score. You can then unlock the full report for £199 to see your gaps, remediation steps, and preparation guidance." },
              { q: "Is BrightCert suitable for non-technical users?", a: "Yes. BrightCert is designed to explain Cyber Essentials preparation in plain English. You do not need to be a cyber security expert to complete the assessment." },
              { q: "Can I share the report with my IT provider?", a: "Yes. The PDF report is designed to help internal teams, external IT providers, and business owners understand what needs attention and what to do next." },
              { q: "Is this only for UK businesses?", a: "Yes. BrightCert is built specifically for UK SMEs preparing for Cyber Essentials, which is a UK-specific cyber security certification scheme managed by the NCSC." },
              { q: "What are the five Cyber Essentials control areas?", a: "They are: 1. Boundary Firewalls & Internet Gateways, 2. Secure Configuration, 3. User Access Control, 4. Malware Protection, and 5. Security Update Management. BrightCert covers all five." },
              { q: "Do you store my answers securely?", a: "Yes. Your assessment responses are stored securely and used only to generate your readiness report. We do not share your data with third parties." },
              { q: "What is the difference between Cyber Essentials and Cyber Essentials Plus?", a: "Cyber Essentials is a self-assessed questionnaire reviewed by a Certification Body. Cyber Essentials Plus also includes an external technical verification. BrightCert currently supports preparation for both, with specific CE Plus guidance in the CE Plus Pack." },
            ].map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 14. CTA BANNER ──────────────────────────────────────────────── */}
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
