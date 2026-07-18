import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/brightcert/json-ld";
import { ReadinessTeaser } from "@/components/brightcert/readiness-teaser";

const TITLE = "What Is Cyber Essentials? A Plain-English Guide for UK Businesses";
const DESCRIPTION =
  "Cyber Essentials explained without the jargon: what it checks, how certification actually works, what it costs, and how to prepare, with sources.";
const PUBLISHED = "2026-07-19";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog/what-is-cyber-essentials" },
};

const CONTROLS = [
  {
    n: "01",
    name: "Firewalls",
    plain: "Is there a boundary between your network and the internet, and has anyone changed the default password on it?",
  },
  {
    n: "02",
    name: "Secure configuration",
    plain: "Are your devices set up deliberately, with unnecessary accounts and software removed, or however they arrived out of the box?",
  },
  {
    n: "03",
    name: "Security update management",
    plain: "When a security patch is released for something you use, is it actually applied, and applied quickly?",
  },
  {
    n: "04",
    name: "User access control",
    plain: "Does everyone have their own login, with only the access they need? Does a leaver actually lose access?",
  },
  {
    n: "05",
    name: "Malware protection",
    plain: "Is something actively watching every device for viruses and other malicious software?",
  },
];

const FAQS = [
  {
    q: "Is Cyber Essentials mandatory?",
    a: "Not by law, but it's a required condition for many UK government contracts, and increasingly requested by larger clients, insurers, and supply chains as proof of baseline security.",
  },
  {
    q: "How long does Cyber Essentials take to complete?",
    a: "The self-assessment questionnaire itself typically takes a business a few hours once you know your answers. Getting from a standing start to certified, including finding your gaps and fixing them, usually takes days to a couple of weeks if your systems are already in reasonable shape.",
  },
  {
    q: "Does Cyber Essentials expire?",
    a: "Yes. Certification lasts 12 months, after which you need to reassess and pay the certification fee again.",
  },
  {
    q: "Who actually needs Cyber Essentials?",
    a: "Any UK business can get certified, but it matters most if you bid for government contracts, work in a supply chain that requires it, or want a straightforward way to demonstrate baseline security to clients and insurers.",
  },
  {
    q: "What's the difference between Cyber Essentials and Cyber Essentials Plus?",
    a: "Standard Cyber Essentials is a self-assessment reviewed by a Certification Body. Cyber Essentials Plus adds an independent technical audit of your actual systems and costs roughly 4-8x more.",
  },
];

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5 text-[15px] leading-relaxed text-[#334155]">{children}</div>;
}

export default function WhatIsCyberEssentialsPage() {
  return (
    <div className="bg-[#F8FAFC]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          author: { "@type": "Person", name: "Muhammad Sohaib Roomi" },
          publisher: { "@type": "Organization", name: "BrightCert" },
          mainEntityOfPage: "https://brightcert.co.uk/blog/what-is-cyber-essentials",
        }}
      />
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

      <article className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/blog" className="bc-focus text-sm font-medium text-[#047857] hover:underline">
            ← Back to articles
          </Link>

          <h1 className="mt-6 text-3xl md:text-[2.75rem] font-bold text-[#0F2044] leading-[1.1]">
            What is Cyber Essentials? A plain-English guide
          </h1>
          <p className="mt-4 text-sm text-[#64748B]">
            By Muhammad Sohaib Roomi, founder of BrightCert · Updated July 2026
          </p>

          <div className="mt-8 rounded-[12px] border border-[#A7F3D0] bg-[#ECFDF5] p-6">
            <p className="text-sm font-semibold text-[#065F46] mb-2">Short answer</p>
            <p className="text-[15px] leading-relaxed text-[#065F46]">
              Cyber Essentials is a UK Government-backed certification scheme, created by the{" "}
              <strong>National Cyber Security Centre (NCSC)</strong>{" "}and delivered through{" "}
              <strong>IASME</strong>, that checks your business against five basic technical
              controls: firewalls, secure configuration, patching, user access, and malware
              protection. Most businesses complete it as a self-assessment questionnaire reviewed
              by a Certification Body, typically for <strong>£330–£500+VAT</strong>. It&rsquo;s the
              baseline standard UK government contracts and increasingly clients and insurers ask
              for as proof you&rsquo;ve got the fundamentals covered.
            </p>
          </div>

          <Prose>
            <p className="mt-8 text-[#0F2044] font-medium">
              Everything below is the plain-English version, no jargon, and links to deeper detail
              on cost, the free preparation tools, and Cyber Essentials Plus where you want it.
            </p>

            <h2 className="pt-4 text-xl font-bold text-[#0F2044]">Who&rsquo;s actually behind it</h2>
            <p>
              Cyber Essentials was created by the{" "}
              <a
                href="https://www.ncsc.gov.uk/cyberessentials/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#047857] underline hover:no-underline"
              >
                NCSC
              </a>, the UK Government&rsquo;s National Cyber Security Centre, and describes itself
              as &ldquo;the minimum standard of cyber security recommended by the Government for
              organisations of all sizes.&rdquo; Day-to-day delivery is handled by{" "}
              <strong>IASME</strong>, the NCSC&rsquo;s official Cyber Essentials Delivery Partner,
              which licenses a network of Certification Bodies across the UK to carry out
              assessments.
            </p>
            <p>
              That matters because it means Cyber Essentials isn&rsquo;t a product any one company
              sells. It&rsquo;s a fixed, published standard. The same five controls, the same
              requirements, regardless of which Certification Body reviews you.
            </p>

            <h2 className="pt-4 text-xl font-bold text-[#0F2044]">The five things it actually checks</h2>
            <p>
              Strip away the compliance language and Cyber Essentials asks five plain questions
              about your business:
            </p>
          </Prose>

          <div className="mt-5 space-y-0 rounded-[12px] border border-[#E2E8F0] bg-white overflow-hidden">
            {CONTROLS.map((c) => (
              <div key={c.n} className="flex gap-4 p-5 border-t border-[#F1F5F9] first:border-t-0">
                <span className="shrink-0 text-sm font-bold text-[#047857]">{c.n}</span>
                <div>
                  <p className="text-sm font-semibold text-[#0F2044] mb-1">{c.name}</p>
                  <p className="text-sm leading-relaxed text-[#475569]">{c.plain}</p>
                </div>
              </div>
            ))}
          </div>

          <Prose>
            <p className="mt-6">
              Answer all five with confidence and you&rsquo;re closer than most businesses starting
              out. Answer &ldquo;not sure&rdquo; to a few of them and you&rsquo;re completely
              normal. The gaps are usually fixable in days, not months.
            </p>
          </Prose>

          <div className="mt-10 mb-10">
            <p className="text-sm font-medium text-[#64748B] mb-4 text-center">
              Curious how your business would score? Three quick questions, no signup needed.
            </p>
            <ReadinessTeaser />
          </div>

          <Prose>
            <h2 className="pt-4 text-xl font-bold text-[#0F2044]">How certification actually works</h2>
            <p>
              The path is the same for almost every UK small business:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong className="text-[#0F2044]">Find your gaps first.</strong>{" "}Most businesses
                don&rsquo;t know where they stand before they start. A free readiness assessment
                (IASME&rsquo;s own tool, or BrightCert&rsquo;s scored version) tells you what to fix
                before you pay anything.
              </li>
              <li>
                <strong className="text-[#0F2044]">Fix what&rsquo;s missing.</strong>{" "}This is the actual
                security work: a proper firewall, MFA, current antivirus, and so on. What it costs
                depends entirely on your starting point.
              </li>
              <li>
                <strong className="text-[#0F2044]">Complete the self-assessment</strong>{" "}and pay the
                IASME certification fee: £330–£500+VAT depending on company size. A Certification
                Body reviews your answers and issues the certificate if they meet the requirements.
              </li>
              <li>
                <strong className="text-[#0F2044]">Optionally, go further with Cyber Essentials Plus.</strong>{" "}
                An independent technical audit on top of standard certification, usually only
                needed if a specific contract or insurer asks for it by name.
              </li>
            </ol>
            <p>
              Want the full breakdown on any one step? Three deeper guides:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <Link href="/blog/cyber-essentials-cost" className="text-[#047857] underline hover:no-underline">
                  How much Cyber Essentials actually costs
                </Link>: the certification fee, the hidden preparation cost, and a realistic first-year
                budget
              </li>
              <li>
                <Link href="/blog/iasme-tool-vs-brightcert" className="text-[#047857] underline hover:no-underline">
                  IASME&rsquo;s free Readiness Tool vs BrightCert
                </Link>: an honest comparison of the two free ways to find your gaps
              </li>
              <li>
                <Link href="/blog/ce-vs-ce-plus" className="text-[#047857] underline hover:no-underline">
                  Cyber Essentials vs Cyber Essentials Plus
                </Link>: what the technical audit actually involves, and whether you need it
              </li>
            </ul>

            <h2 className="pt-4 text-xl font-bold text-[#0F2044]">Where BrightCert fits</h2>
            <p>
              BrightCert is a free readiness assessment built around these same five control areas:
              60 plain-English questions, roughly two hours, and a readiness score you see before
              paying anything. The full scored report, with a prioritised fix list and a downloadable
              PDF, is a one-time £199. BrightCert doesn&rsquo;t issue the Cyber Essentials
              certificate (that always comes from an IASME-licensed Certification Body); it exists
              to make sure you walk into that step already knowing exactly where you stand.
            </p>
          </Prose>

          <h2 className="mt-12 mb-5 text-xl font-bold text-[#0F2044]">Frequently asked questions</h2>
          <div className="space-y-6">
            {FAQS.map((item) => (
              <div key={item.q}>
                <h3 className="text-base font-semibold text-[#0F2044] mb-1.5">{item.q}</h3>
                <p className="text-[15px] leading-relaxed text-[#475569]">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[12px] border border-[#E2E8F0] bg-white p-5">
            <p className="text-xs leading-relaxed text-[#64748B]">
              BrightCert helps UK businesses prepare for Cyber Essentials by assessing readiness,
              identifying gaps, and producing a practical report. BrightCert does not issue the
              official Cyber Essentials certificate. That comes from an IASME-licensed
              Certification Body.
            </p>
            <p className="mt-3 text-xs text-[#94A3B8]">
              Sources:{" "}
              <a
                href="https://www.ncsc.gov.uk/cyberessentials/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                NCSC: Cyber Essentials overview
              </a>{" "}
              ·{" "}
              <a
                href="https://iasme.co.uk/cyber-essentials/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                IASME: Cyber Essentials
              </a>
              . Verified July 2026.
            </p>
          </div>

          <div className="mt-10 border-t border-[#E2E8F0] pt-10 text-center">
            <p className="text-[#475569] mb-5">See where your business stands, free.</p>
            <Button asChild size="lg">
              <Link href="/assessment/new">Start Your Assessment</Link>
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
