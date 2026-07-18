import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/brightcert/json-ld";
import { ReadinessTeaser } from "@/components/brightcert/readiness-teaser";

const TITLE = "How Much Does Cyber Essentials Actually Cost in 2026?";
const DESCRIPTION =
  "The real cost of Cyber Essentials, broken down: the IASME certification fee, the hidden pre-assessment gap analysis cost, and Cyber Essentials Plus pricing, with sources.";
const PUBLISHED = "2026-07-18";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog/cyber-essentials-cost" },
};

const FEE_BANDS = [
  { size: "Micro", employees: "1–9", fee: "£330 + VAT" },
  { size: "Small", employees: "10–49", fee: "£400 + VAT" },
  { size: "Medium", employees: "50–249", fee: "£450 + VAT" },
  { size: "Large", employees: "250+", fee: "£500 + VAT" },
];

const BUDGET_ROWS = [
  { item: "IASME certification fee (micro/small band)", cost: "£330–£400 + VAT" },
  { item: "Pre-assessment gap analysis (consultant)", cost: "£750–£1,500" },
  { item: "Or: BrightCert readiness report", cost: "£199", highlight: true },
  { item: "Remediation (firewall, MFA, AV licensing, etc.)", cost: "Varies by starting point" },
];

const FAQS = [
  {
    q: "Does Cyber Essentials expire?",
    a: "Yes. Certification lasts 12 months, after which you need to reassess and pay the fee again.",
  },
  {
    q: "Can I do Cyber Essentials completely free?",
    a: "The certification fee itself (£330+) is unavoidable if you want the actual certificate. It goes to IASME or your Certification Body, not to any preparation tool. What's optional is the preparation cost: you can DIY it with NCSC's published guidance, pay a consultant £750–£1,500, or use a free readiness assessment like BrightCert's to find your gaps before you pay anything.",
  },
  {
    q: "What's the real difference in cost between Cyber Essentials and Cyber Essentials Plus?",
    a: "Standard Cyber Essentials is a self-assessment reviewed by an assessor (£330–£500+VAT). Cyber Essentials Plus adds an external technical audit of your actual systems, which is why it costs roughly 4–8x more (£1,500–£3,000+VAT).",
  },
  {
    q: "Does BrightCert issue the Cyber Essentials certificate?",
    a: "No. BrightCert is a readiness assessment. It scores you against the same five control areas Cyber Essentials checks and tells you what to fix, in plain English. The actual certificate is issued by an IASME-licensed Certification Body after you apply and pass their assessment.",
  },
];

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5 text-[15px] leading-relaxed text-[#334155]">{children}</div>;
}

export default function CyberEssentialsCostPage() {
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
          mainEntityOfPage: "https://brightcert.co.uk/blog/cyber-essentials-cost",
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
            How much does Cyber Essentials actually cost in 2026?
          </h1>
          <p className="mt-4 text-sm text-[#64748B]">
            By Muhammad Sohaib Roomi, founder of BrightCert · Updated July 2026
          </p>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Part of our{" "}
            <Link href="/blog/what-is-cyber-essentials" className="text-[#047857] underline hover:no-underline">
              plain-English Cyber Essentials guide
            </Link>
          </p>

          {/* Direct-answer summary box */}
          <div className="mt-8 rounded-[12px] border border-[#A7F3D0] bg-[#ECFDF5] p-6">
            <p className="text-sm font-semibold text-[#065F46] mb-2">Short answer</p>
            <p className="text-[15px] leading-relaxed text-[#065F46]">
              Budget <strong>£330–£500 + VAT</strong>{" "}for the Cyber Essentials certification fee itself, set by
              IASME based on your company size. Most businesses also spend <strong>£750–£1,500</strong>{" "}getting
              ready for it, usually paid to an IT consultant for a gap analysis, before they ever sit the
              assessment. Cyber Essentials Plus, which adds an external technical audit, typically costs{" "}
              <strong>£1,500–£3,000 + VAT</strong>{" "}on top of standard Cyber Essentials. Put together, a typical
              small business&rsquo;s real first-year spend lands between <strong>£1,800 and £3,500</strong>.
            </p>
          </div>

          <Prose>
            <p className="mt-8 text-[#0F2044] font-medium">
              That range surprises people, because most pricing pages only quote the first number.
            </p>

            <h2 className="pt-4 text-xl font-bold text-[#0F2044]">The three costs everyone conflates</h2>
            <p>
              Ask five IT providers &ldquo;how much does Cyber Essentials cost?&rdquo; and you&rsquo;ll get five
              different answers, because the question actually has three separate answers hiding inside it:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong className="text-[#0F2044]">The certification fee.</strong>{" "}What you pay IASME (or one of
                its licensed Certification Bodies) to actually review and issue your certificate. This is fixed,
                published, and non-negotiable.
              </li>
              <li>
                <strong className="text-[#0F2044]">The preparation cost.</strong>{" "}What it costs to find out where
                your gaps are and get ready before you submit. This part is unregulated: you can pay a
                consultant, do it yourself with a checklist, or use a tool. Nobody has to charge you for this
                step, but almost everyone does.
              </li>
              <li>
                <strong className="text-[#0F2044]">The remediation cost.</strong>{" "}What it actually costs to fix
                whatever the gap analysis finds (a proper firewall, MFA licensing, endpoint protection, and so
                on). This varies by business and isn&rsquo;t something any assessment, free or paid, can
                eliminate, only reveal accurately.
              </li>
            </ol>
            <p>
              Most &ldquo;Cyber Essentials cost&rdquo; articles quote only #1. The real spend is usually #1 and #2
              together, and #2 is the part almost nobody prices transparently.
            </p>

            <h2 className="pt-4 text-xl font-bold text-[#0F2044]">What the certification fee actually is</h2>
            <p>
              Cyber Essentials is a UK Government-backed scheme created by the{" "}
              <a
                href="https://www.ncsc.gov.uk/cyberessentials/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#047857] underline hover:no-underline"
              >
                National Cyber Security Centre (NCSC)
              </a>{" "}
              and delivered through <strong>IASME</strong>, the NCSC&rsquo;s official Cyber Essentials Delivery
              Partner. IASME licenses a network of Certification Bodies across the UK to carry out assessments.
            </p>
            <p>IASME publishes its certification fee in four size bands:</p>
          </Prose>

          <div className="mt-4 overflow-x-auto rounded-[12px] border border-[#E2E8F0]">
            <table className="w-full min-w-[440px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9] text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  <th className="px-4 py-3">Organisation size</th>
                  <th className="px-4 py-3">Employees</th>
                  <th className="px-4 py-3">IASME assessment fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] bg-white">
                {FEE_BANDS.map((row) => (
                  <tr key={row.size}>
                    <td className="px-4 py-3 font-medium text-[#0F2044]">{row.size}</td>
                    <td className="px-4 py-3 text-[#475569]">{row.employees}</td>
                    <td className="px-4 py-3 font-semibold text-[#0F2044]">{row.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Prose>
            <p className="mt-6">
              This fee covers the self-assessment questionnaire review and one year of certification. UK
              organisations with turnover under £20 million also get Cyber Liability Insurance included. It also
              includes one free resubmission if you don&rsquo;t pass first time; after that, a failed attempt
              means paying the fee again.
            </p>
            <p>
              Individual Certification Bodies can add their own margin on top of IASME&rsquo;s base fee, so
              it&rsquo;s worth asking directly what&rsquo;s included before you book.
            </p>

            <h2 className="pt-4 text-xl font-bold text-[#0F2044]">Cyber Essentials Plus costs more, for a real reason</h2>
            <p>
              Cyber Essentials Plus adds an external technical audit: an assessor actually tests your systems
              (vulnerability scanning, sampled device checks) rather than relying on your self-reported answers.
              You need standard Cyber Essentials first before you can sit Plus.
            </p>
            <p>
              Because it requires assessor time on-site or remote, pricing is set per engagement rather than in
              fixed bands. Most UK SMEs pay <strong>£1,500–£3,000 + VAT</strong>; larger or more complex
              environments can run higher.
            </p>

            <h2 className="pt-4 text-xl font-bold text-[#0F2044]">The hidden cost: getting ready before you apply</h2>
            <p>
              Here&rsquo;s the part that catches most business owners out. IASME&rsquo;s fee only covers the{" "}
              <em>review</em>. It assumes you already know where you stand. Most businesses don&rsquo;t, so they
              pay someone to find out first.
            </p>
            <p>
              A typical pre-assessment gap analysis from an IT consultancy costs <strong>£750–£1,500</strong>{" "}for
              a small business, and can run £500–£2,500+VAT depending on scope. What you&rsquo;re paying for is
              usually:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                A consultant&rsquo;s time (half a day to a full day, at typical UK IT-consultant day rates)
                reviewing your firewalls, access controls, patching, and malware protection against the five
                Cyber Essentials control areas
              </li>
              <li>A written report of what&rsquo;s missing</li>
              <li>Help drafting the policies and evidence the assessment expects</li>
            </ul>
            <p>
              That&rsquo;s a legitimate service, and a good consultant catches things a checklist might not. But
              it&rsquo;s also the exact step a well-built tool can do for a fraction of the cost, because the
              five control areas Cyber Essentials assesses are a fixed, published standard, not a moving target
              that needs bespoke consultancy every time.
            </p>
            <p>
              <strong className="text-[#0F2044]">
                This is the specific cost BrightCert exists to replace.
              </strong>{" "}
              Not the £330–£500 certification fee (BrightCert isn&rsquo;t a Certification Body and doesn&rsquo;t
              issue the certificate), but the £750–£1,500 people spend just finding out where they stand before
              they even apply. BrightCert&rsquo;s readiness assessment is free to complete, and the full scored
              gap report, the same kind of findings a consultant&rsquo;s gap analysis produces, costs a
              one-time <strong>£199</strong>.
            </p>

          </Prose>

          <div className="mt-10 mb-10">
            <p className="text-sm font-medium text-[#64748B] mb-4 text-center">
              Curious where you&rsquo;d stand? Three quick questions, no signup needed.
            </p>
            <ReadinessTeaser />
          </div>

          <Prose>
            <h2 className="pt-4 text-xl font-bold text-[#0F2044]">What a realistic first-year budget looks like</h2>
            <p>For a typical UK small business going for standard Cyber Essentials (not Plus):</p>
          </Prose>

          <div className="mt-4 overflow-x-auto rounded-[12px] border border-[#E2E8F0]">
            <table className="w-full min-w-[440px] text-left text-sm">
              <tbody className="divide-y divide-[#F1F5F9] bg-white">
                {BUDGET_ROWS.map((row) => (
                  <tr key={row.item} className={row.highlight ? "bg-[#ECFDF5]" : undefined}>
                    <td className="px-4 py-3 text-[#334155]">{row.item}</td>
                    <td
                      className={
                        "px-4 py-3 text-right font-semibold whitespace-nowrap " +
                        (row.highlight ? "text-[#047857]" : "text-[#0F2044]")
                      }
                    >
                      {row.cost}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-[#E2E8F0]">
                  <td className="px-4 py-3 font-semibold text-[#0F2044]">Typical total, consultant route</td>
                  <td className="px-4 py-3 text-right font-bold text-[#0F2044] whitespace-nowrap">
                    £1,800–£3,500
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-[#0F2044]">Typical total, BrightCert route</td>
                  <td className="px-4 py-3 text-right font-bold text-[#047857] whitespace-nowrap">
                    £1,000–£2,000 lower on preparation alone
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Prose>
            <p className="mt-6">
              Remediation cost is the same either way. Fixing a missing firewall costs what it costs regardless
              of who found the gap. The difference is entirely in what you pay to find out what needs fixing.
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
              BrightCert helps UK businesses prepare for Cyber Essentials by assessing readiness, identifying
              gaps, and producing a practical report. BrightCert does not issue the official Cyber Essentials
              certificate. That comes from an IASME-licensed Certification Body.
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
              . IASME published fee bands and third-party pricing data, verified July 2026.
            </p>
          </div>

          <div className="mt-10 border-t border-[#E2E8F0] pt-10 text-center">
            <p className="text-[#475569] mb-5">Want to see exactly where your business stands, free?</p>
            <Button asChild size="lg">
              <Link href="/assessment/new">Start Your Assessment</Link>
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
