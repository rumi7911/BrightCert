import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Target,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ArrowRight,
  Wifi,
  Settings,
  Users,
  Bug,
  RefreshCw,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificationDisclaimer } from "@/components/brightcert/certification-disclaimer";

// ─── Hero product preview ─────────────────────────────────────────────────────
function HeroPreview() {
  return (
    <div className="rounded-[16px] border border-white/10 bg-white/5 backdrop-blur-sm p-5 text-white text-sm max-w-sm w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-white/60 font-medium uppercase tracking-wide">Readiness Score</span>
        <span className="text-xs bg-[#D97706]/20 text-[#FCD34D] px-2 py-0.5 rounded-full font-medium">Nearly Ready</span>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative h-16 w-16">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
            <circle
              cx="32" cy="32" r="28" fill="none"
              stroke="#D97706" strokeWidth="6"
              strokeDasharray={`${Math.PI * 56 * 0.71} ${Math.PI * 56}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">71%</span>
        </div>
        <div>
          <p className="font-semibold">Acme Ltd</p>
          <p className="text-xs text-white/60">Assessment completed</p>
        </div>
      </div>
      <p className="text-xs text-white/60 font-medium mb-2">Priority fixes</p>
      <ul className="space-y-1.5 mb-4">
        {[
          "Enable MFA across cloud services",
          "Review admin user access",
          "Confirm security update process",
        ].map((fix) => (
          <li key={fix} className="flex items-start gap-2 text-xs">
            <AlertCircle className="h-3.5 w-3.5 text-[#FCD34D] shrink-0 mt-0.5" />
            <span>{fix}</span>
          </li>
        ))}
      </ul>
      <div className="border-t border-white/10 pt-3">
        <p className="text-xs text-white/60">
          <span className="text-[#FCD34D] font-medium">Unlock full report</span> for £199
        </p>
      </div>
    </div>
  );
}

// ─── Control area card ────────────────────────────────────────────────────────
function ControlCard({
  icon: Icon,
  number,
  title,
  checks,
}: {
  icon: React.ElementType;
  number: number;
  title: string;
  checks: string[];
}) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-9 w-9 rounded-[8px] bg-[#ECFDF5] flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-[#047857]" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs font-semibold text-[#047857] uppercase tracking-wider mb-0.5">Area {number}</p>
          <h3 className="text-sm font-semibold text-[#0F2044]">{title}</h3>
        </div>
      </div>
      <ul className="space-y-1.5">
        {checks.map((check) => (
          <li key={check} className="flex items-start gap-2 text-sm text-[#475569]">
            <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" strokeWidth={1.5} />
            <span>{check}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-[#E2E8F0] py-4">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <span className="text-sm font-medium text-[#0F2044]">{q}</span>
        <ChevronDown className="h-4 w-4 text-[#64748B] group-open:rotate-180 transition-transform shrink-0" />
      </summary>
      <p className="mt-3 text-sm text-[#475569] leading-relaxed">{a}</p>
    </details>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="bg-[#F8FAFC]">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section
        className="bg-gradient-to-br from-[#0F2044] to-[#142A56] text-white py-20 md:py-28"
        aria-label="Hero"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
                Get Cyber Essentials ready in 2 hours
              </h1>
              <p className="text-lg text-white/80 mb-3 leading-relaxed max-w-xl">
                BrightCert guides UK SMEs through a plain-English Cyber Essentials readiness assessment, highlights what needs attention, and creates a practical report before you apply for certification.
              </p>
              <p className="text-sm text-white/60 mb-8 max-w-xl">
                No confusing forms. No expensive consultancy-first process. Just clear questions, smart analysis, and a step-by-step view of what to fix next.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-4">
                <Button asChild size="lg">
                  <Link href="/assessment/new">Start Your Assessment</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                  <Link href="/how-it-works">See How It Works</Link>
                </Button>
              </div>
              <p className="text-xs text-white/50">Built for UK businesses preparing for Cyber Essentials.</p>
            </div>
            <div className="flex-shrink-0">
              <HeroPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST STRIP ──────────────────────────────────────────────── */}
      <section className="bg-white border-y border-[#E2E8F0] py-10" aria-label="Trust strip">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-sm font-semibold text-[#475569] mb-6">
            Designed for UK SMEs preparing for Cyber Essentials
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Plain-English questions", desc: "No jargon-heavy compliance language." },
              { label: "AI-assisted gap analysis", desc: "Clear scoring across the five control areas." },
              { label: "Practical remediation report", desc: "Know what to fix before applying." },
              { label: "UK-specific guidance", desc: "Built around Cyber Essentials, GBP pricing, and SME needs." },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#059669] shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-semibold text-[#0F2044]">{item.label}</p>
                  <p className="text-sm text-[#64748B]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PROBLEM ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20" aria-labelledby="problem-heading">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-bold text-[#047857] uppercase tracking-widest mb-3 text-center">The Problem</p>
          <h2 id="problem-heading" className="text-3xl font-bold text-[#0F2044] text-center mb-5">
            Cyber Essentials can feel harder than it should
          </h2>
          <p className="text-[#475569] text-center max-w-2xl mx-auto mb-12 leading-relaxed">
            For many small businesses, Cyber Essentials starts with a simple goal: prove that your organisation takes cyber security seriously. But the preparation process can quickly become confusing. That uncertainty often leads to delays, guesswork, or expensive consultancy before you even understand the gaps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            ].map((card) => (
              <div key={card.title} className="rounded-[12px] border border-[#E2E8F0] bg-white p-6">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-[#DC2626] shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F2044] mb-1">{card.title}</h3>
                    <p className="text-sm text-[#64748B] leading-relaxed">{card.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. SOLUTION ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 border-y border-[#E2E8F0]" aria-labelledby="solution-heading">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-[#047857] uppercase tracking-widest mb-3">The Solution</p>
          <h2 id="solution-heading" className="text-3xl font-bold text-[#0F2044] mb-5">
            A clearer way to prepare for Cyber Essentials
          </h2>
          <p className="text-[#475569] leading-relaxed mb-4">
            BrightCert turns Cyber Essentials preparation into a guided, step-by-step process.
          </p>
          <p className="text-[#475569] leading-relaxed mb-8">
            You answer simple questions about your organisation, devices, users, software, and security controls. BrightCert analyses your responses across the five Cyber Essentials control areas and gives you a readiness score, plain-English gap findings, and prioritised remediation steps.
          </p>
          <Button asChild size="lg">
            <Link href="/assessment/new">Start Your Readiness Assessment</Link>
          </Button>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20" aria-labelledby="how-it-works-heading">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-bold text-[#047857] uppercase tracking-widest mb-3 text-center">How It Works</p>
          <h2 id="how-it-works-heading" className="text-3xl font-bold text-[#0F2044] text-center mb-12">
            From uncertainty to action in four clear steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Answer simple questions",
                body: "Complete a guided assessment covering the five Cyber Essentials control areas. Each question is written in plain English, with helpful context where needed.",
                note: "Answer honestly. The goal is not to look perfect — it is to understand what needs fixing before you apply.",
              },
              {
                step: "02",
                title: "Get your readiness score",
                body: "BrightCert analyses your answers and scores your organisation across the core Cyber Essentials areas.",
                note: "See your overall readiness score and understand which areas are strong, weak, or incomplete.",
              },
              {
                step: "03",
                title: "Review your gaps",
                body: "Your results show where your business may fall short, with clear explanations and practical next steps.",
                note: "No alarmist language. Just clear findings, prioritised by what matters most.",
              },
              {
                step: "04",
                title: "Unlock your full report",
                body: "Pay £199 to unlock your full readiness report, including detailed gap analysis, remediation actions, and a preparation summary.",
                note: "Use the report to fix issues internally or prepare for your application with a Certification Body.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-4xl font-bold text-[#E2E8F0] mb-3">{item.step}</div>
                <h3 className="text-base font-semibold text-[#0F2044] mb-2">{item.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed mb-3">{item.body}</p>
                <p className="text-xs text-[#64748B] italic">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. WHAT WE CHECK ────────────────────────────────────────────── */}
      <section
        id="what-we-check"
        className="bg-white py-16 md:py-20 border-y border-[#E2E8F0]"
        aria-labelledby="what-we-check-heading"
      >
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-bold text-[#047857] uppercase tracking-widest mb-3 text-center">The Five Control Areas</p>
          <h2 id="what-we-check-heading" className="text-3xl font-bold text-[#0F2044] text-center mb-4">
            Built around the Cyber Essentials requirements
          </h2>
          <p className="text-[#475569] text-center max-w-2xl mx-auto mb-10 leading-relaxed">
            Cyber Essentials focuses on five technical control areas that help protect organisations from common internet-based cyber threats. BrightCert structures your assessment around these same five areas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
            />
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
            />
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
            />
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
            />
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
            />
          </div>
        </div>
      </section>

      {/* ── 7. PRODUCT FEATURES ─────────────────────────────────────────── */}
      <section className="py-16 md:py-20" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-bold text-[#047857] uppercase tracking-widest mb-3 text-center">What You Get</p>
          <h2 id="features-heading" className="text-3xl font-bold text-[#0F2044] text-center mb-4">
            A practical readiness report, not another vague checklist
          </h2>
          <p className="text-[#475569] text-center max-w-2xl mx-auto mb-10">
            BrightCert does more than ask questions. It turns your answers into a clear picture of your Cyber Essentials readiness, so your business can take action with confidence.
          </p>
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
            ].map((item) => (
              <div key={item.title} className="rounded-[16px] border border-[#E2E8F0] bg-white p-6">
                <div className="h-9 w-9 rounded-[8px] bg-[#ECFDF5] flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-[#047857]" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold text-[#0F2044] mb-2">{item.title}</h3>
                <p className="text-sm text-[#475569] mb-2 leading-relaxed">{item.body}</p>
                <p className="text-xs text-[#64748B] italic">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. REPORT PREVIEW ───────────────────────────────────────────── */}
      <section className="bg-[#0F2044] text-white py-16 md:py-20" aria-labelledby="report-heading">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <p className="text-xs font-bold text-[#059669] uppercase tracking-widest mb-3">Your Report</p>
              <h2 id="report-heading" className="text-3xl font-bold mb-5">
                Know what to fix before you apply
              </h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                Your BrightCert report gives you a structured view of your Cyber Essentials readiness. It is designed to help you understand your current position, share findings with the right people, and work through improvements before applying for official certification.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { label: "Executive summary", desc: "A simple overview of your readiness score, strongest areas, and main risks." },
                  { label: "Five control area scores", desc: "A breakdown of your performance across the five Cyber Essentials control areas." },
                  { label: "Gap analysis", desc: "Clear explanations of where your current setup may not meet expected requirements." },
                  { label: "Priority action plan", desc: "A practical list of recommended fixes, ordered by importance." },
                  { label: "Preparation notes", desc: "Helpful guidance to support your next steps before working with a Certification Body." },
                  { label: "PDF download", desc: "A professional copy of your report that can be saved, shared, or reviewed with your team." },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span className="text-sm text-white/80">
                      <strong className="text-white font-medium">{item.label}</strong> — {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="bg-white text-[#0F2044] hover:bg-white/90">
                <Link href="/assessment/new">Unlock Full Report for £199</Link>
              </Button>
            </div>
            {/* Mock report card */}
            <div className="rounded-[16px] border border-white/10 bg-white/5 p-6 max-w-xs w-full">
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
                  { area: "User Access", score: 60, status: "warning" },
                  { area: "Malware", score: 90, status: "pass" },
                  { area: "Updates", score: 55, status: "fail" },
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
                      <span className="text-xs text-white/60 w-8 text-right">{row.score}%</span>
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
      </section>

      {/* ── 9. PRICING ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20" aria-labelledby="pricing-heading">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-bold text-[#047857] uppercase tracking-widest mb-3 text-center">Pricing</p>
          <h2 id="pricing-heading" className="text-3xl font-bold text-[#0F2044] text-center mb-4">
            Simple pricing for Cyber Essentials preparation
          </h2>
          <p className="text-[#475569] text-center max-w-2xl mx-auto mb-10">
            Start with a guided readiness assessment. Upgrade only when you need ongoing monitoring, CE Plus preparation, or partner features.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Featured: Assessment */}
            <div className="rounded-[16px] border-2 border-[#047857] bg-white p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#047857] text-white text-xs font-semibold px-3 py-0.5 rounded-full">Most Popular</span>
              </div>
              <p className="text-xs font-semibold text-[#047857] uppercase tracking-wider mb-1">Assessment</p>
              <div className="text-3xl font-bold text-[#0F2044] mb-0.5">£199</div>
              <p className="text-xs text-[#64748B] mb-1">one-time</p>
              <p className="text-xs text-[#475569] mb-4">Best for UK SMEs preparing for Cyber Essentials and wanting a clear view before applying.</p>
              <ul className="space-y-1.5 mb-6">
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
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#059669] shrink-0 mt-0.5" strokeWidth={1.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full">
                <Link href="/assessment/new">Start Assessment</Link>
              </Button>
              <p className="text-xs text-[#64748B] text-center mt-2">Complete first. Pay when you're ready to unlock.</p>
            </div>

            {/* Monitor */}
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6">
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">Monitor</p>
              <div className="text-3xl font-bold text-[#0F2044] mb-0.5">£99</div>
              <p className="text-xs text-[#64748B] mb-1">/month</p>
              <p className="text-xs text-[#475569] mb-4">Businesses that want ongoing visibility after their initial readiness report.</p>
              <ul className="space-y-1.5 mb-6">
                {["Monthly readiness review", "Saved assessment history", "Ongoing remediation tracking", "Updated action list", "Report access", "Renewal preparation support"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#475569]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#059669] shrink-0 mt-0.5" strokeWidth={1.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/pricing">Join Monitor</Link>
              </Button>
            </div>

            {/* CE Plus */}
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6">
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">CE Plus Pack</p>
              <div className="text-3xl font-bold text-[#0F2044] mb-0.5">£499</div>
              <p className="text-xs text-[#64748B] mb-1">one-time</p>
              <p className="text-xs text-[#475569] mb-4">Businesses preparing for Cyber Essentials Plus before technical testing.</p>
              <ul className="space-y-1.5 mb-6">
                {["CE Plus preparation checklist", "Evidence collection guidance", "Device and system readiness review", "Remediation planning", "Internal preparation summary", "Priority support"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#475569]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#059669] shrink-0 mt-0.5" strokeWidth={1.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/pricing">Prepare for CE Plus</Link>
              </Button>
            </div>

            {/* MSP */}
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6" id="msp-partner">
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">MSP Partner</p>
              <div className="text-3xl font-bold text-[#0F2044] mb-0.5">£299</div>
              <p className="text-xs text-[#64748B] mb-1">/month</p>
              <p className="text-xs text-[#475569] mb-4">MSPs supporting multiple UK SME clients with Cyber Essentials preparation.</p>
              <ul className="space-y-1.5 mb-6">
                {["Multi-client dashboard", "Client assessment tracking", "Readiness reports", "Partner workflow tools", "Client remediation visibility", "MSP-focused reporting"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#475569]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#059669] shrink-0 mt-0.5" strokeWidth={1.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/pricing#msp">Become a Partner</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. COMPARISON ──────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 border-y border-[#E2E8F0]" aria-labelledby="comparison-heading">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-bold text-[#047857] uppercase tracking-widest mb-3 text-center">Why BrightCert</p>
          <h2 id="comparison-heading" className="text-3xl font-bold text-[#0F2044] text-center mb-4">
            Understand your gaps before you spend more
          </h2>
          <p className="text-[#475569] text-center mb-2">
            Traditional consultancy can be valuable, especially for complex organisations. But many SMEs first need a clear answer to a simpler question:
          </p>
          <p className="text-center font-semibold text-[#0F2044] mb-10">Are we ready, and what do we need to fix?</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-3 pr-4 text-[#64748B] font-medium">Without BrightCert</th>
                  <th className="text-left py-3 text-[#047857] font-semibold">With BrightCert</th>
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
                    <td className="py-3 pr-4 text-[#64748B]">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-[#DC2626] shrink-0 mt-0.5" strokeWidth={1.5} />
                        {without}
                      </div>
                    </td>
                    <td className="py-3 text-[#0F2044]">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" strokeWidth={1.5} />
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
      <section className="py-16 md:py-20" aria-labelledby="audience-heading">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-bold text-[#047857] uppercase tracking-widest mb-3 text-center">Who It Is For</p>
          <h2 id="audience-heading" className="text-3xl font-bold text-[#0F2044] text-center mb-4">
            Built for the businesses that need clarity fast
          </h2>
          <p className="text-[#475569] text-center max-w-2xl mx-auto mb-10">
            BrightCert is designed for UK SMEs that need to prepare for Cyber Essentials without turning the process into a long, technical project.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
            ].map((card) => (
              <div key={card.title} className="rounded-[12px] border border-[#E2E8F0] bg-white p-6">
                <h3 className="text-sm font-semibold text-[#0F2044] mb-2">{card.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. TRUST ───────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 border-y border-[#E2E8F0]" aria-labelledby="trust-heading">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-bold text-[#047857] uppercase tracking-widest mb-3 text-center">Trust & Clarity</p>
          <h2 id="trust-heading" className="text-3xl font-bold text-[#0F2044] text-center mb-5">
            Clear guidance without false promises
          </h2>
          <p className="text-[#475569] text-center mb-10 leading-relaxed">
            BrightCert is careful about what it does — and what it does not do. We help you prepare for Cyber Essentials by assessing your readiness, identifying gaps, and creating a practical report. We do not issue the official Cyber Essentials certificate. Official certification is handled through IASME Certification Bodies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
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
                  <p className="text-sm font-semibold text-[#0F2044] mb-1">{item.title}</p>
                  <p className="text-sm text-[#64748B]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <CertificationDisclaimer />
        </div>
      </section>

      {/* ── 13. FAQ ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold text-[#047857] uppercase tracking-widest mb-3 text-center">FAQs</p>
          <h2 id="faq-heading" className="text-3xl font-bold text-[#0F2044] text-center mb-10">
            Common questions
          </h2>
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
      <section className="bg-[#0F2044] text-white py-16" aria-label="Call to action">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Find out how ready your business is
          </h2>
          <p className="text-white/70 mb-8 leading-relaxed">
            Complete your Cyber Essentials readiness assessment, review your score, and unlock a practical report showing what to fix next.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/assessment/new">Start Your Assessment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
