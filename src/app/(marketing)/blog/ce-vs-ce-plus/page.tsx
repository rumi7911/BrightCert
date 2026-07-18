import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/brightcert/json-ld";
import { ReadinessTeaser } from "@/components/brightcert/readiness-teaser";

const TITLE = "Cyber Essentials vs Cyber Essentials Plus: What's Actually Different?";
const DESCRIPTION =
  "The real difference between Cyber Essentials and Cyber Essentials Plus: verification method, cost, timeline, and which one your business actually needs.";
const PUBLISHED = "2026-07-19";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog/ce-vs-ce-plus" },
};

const COMPARE_ROWS = [
  { label: "Verification method", ce: "Self-assessment questionnaire", plus: "Self-assessment + independent technical audit" },
  { label: "Typical cost (small business)", ce: "£330–£500 + VAT", plus: "£1,500–£3,000 + VAT" },
  { label: "Typical timeline", ce: "Days to ~2 weeks", plus: "4–8 weeks" },
  { label: "Can apply directly?", ce: "Yes", plus: "No — requires a current standard certificate first" },
  { label: "If a non-compliance is found", ce: "Correct and resubmit", plus: "30 days to remediate before you can pass" },
];

const FAQS = [
  {
    q: "Can I skip straight to Cyber Essentials Plus?",
    a: "No. Plus requires a current Cyber Essentials certificate before you can apply — the two are sequential, not alternatives.",
  },
  {
    q: "Does Cyber Essentials Plus replace the need for standard Cyber Essentials?",
    a: "No, you need both — Plus is standard Cyber Essentials plus an additional technical audit layer, not a separate scheme.",
  },
  {
    q: "How much more does Cyber Essentials Plus cost?",
    a: "Roughly 4–8x the standard certification fee — typically £1,500–£3,000+VAT versus £330–£500+VAT, because Plus requires real assessor time testing your actual systems rather than a questionnaire review.",
  },
  {
    q: "Does BrightCert prepare you for Cyber Essentials Plus?",
    a: "BrightCert's assessment covers the same five control areas Plus also checks, so it's a strong foundation either way — but the Plus technical audit itself has to be carried out by an accredited assessor, not a preparation tool.",
  },
];

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5 text-[15px] leading-relaxed text-[#334155]">{children}</div>;
}

export default function CeVsCePlusPage() {
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
          mainEntityOfPage: "https://brightcert.co.uk/blog/ce-vs-ce-plus",
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
            Cyber Essentials vs Cyber Essentials Plus: what&rsquo;s actually different?
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

          <div className="mt-8 rounded-[12px] border border-[#A7F3D0] bg-[#ECFDF5] p-6">
            <p className="text-sm font-semibold text-[#065F46] mb-2">Short answer</p>
            <p className="text-[15px] leading-relaxed text-[#065F46]">
              Both certify the same five technical controls, but Cyber Essentials is a self-assessment
              questionnaire your business fills in and a Certification Body reviews, while Cyber Essentials
              Plus adds an independent technical audit — an assessor actually scans and tests your systems
              rather than taking your word for it. Plus costs roughly <strong>4–8x more</strong> (£1,500–£3,000+VAT
              vs £330–£500+VAT), takes <strong>4–8 weeks</strong> instead of days, and you can&rsquo;t apply for
              it until you already hold standard Cyber Essentials.
            </p>
          </div>

          <Prose>
            <p className="mt-8 text-[#0F2044] font-medium">
              Most UK SMEs only need standard Cyber Essentials. Plus matters when a contract, tender, or
              insurer specifically asks for it.
            </p>

            <h2 className="pt-4 text-xl font-bold text-[#0F2044]">Same five controls, different way of checking them</h2>
            <p>
              Both certifications assess the same five NCSC-defined control areas: firewalls, secure
              configuration, security update management, user access control, and malware protection. Nothing
              about <em>what&rsquo;s</em> being checked changes between the two — only <em>how</em>.
            </p>
            <p>
              <strong className="text-[#0F2044]">Cyber Essentials (standard):</strong> You complete a
              questionnaire about how each control is implemented across your systems. A Certification Body
              reviews your answers and issues the certificate if they meet the scheme&rsquo;s requirements.
              It&rsquo;s entirely self-reported — nobody logs into your network to verify it.
            </p>
            <p>
              <strong className="text-[#0F2044]">Cyber Essentials Plus:</strong> Same five controls, but your
              self-assessment answers get independently verified. An assessor runs an external vulnerability
              scan against your public IP addresses, tests a representative sample of your actual devices
              (every operating system type in use has to be included — servers, desktops, laptops, tablets,
              phones), and observes real users doing everyday tasks on sampled machines to confirm the controls
              are actually operating as described.
            </p>
            <p>
              In short: standard Cyber Essentials checks what you say is true. Plus checks whether it&rsquo;s
              actually true.
            </p>

            <h2 className="pt-4 text-xl font-bold text-[#0F2044]">What that difference costs you</h2>
          </Prose>

          <div className="mt-4 overflow-x-auto rounded-[12px] border border-[#E2E8F0]">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9] text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3">Cyber Essentials</th>
                  <th className="px-4 py-3">Cyber Essentials Plus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] bg-white">
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="px-4 py-3 font-medium text-[#0F2044]">{row.label}</td>
                    <td className="px-4 py-3 text-[#475569]">{row.ce}</td>
                    <td className="px-4 py-3 text-[#475569]">{row.plus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Prose>
            <p className="mt-6">
              The price gap isn&rsquo;t arbitrary — it reflects real assessor time. A questionnaire review
              takes hours; scanning your infrastructure and testing a representative device sample takes days,
              and someone has to actually do it.
            </p>

            <h2 className="pt-4 text-xl font-bold text-[#0F2044]">Do you need Plus, or is standard enough?</h2>
            <p>
              For most UK small businesses, standard Cyber Essentials is the right starting point and often
              the only requirement that ever comes up. Cyber Essentials Plus tends to matter specifically when:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                A contract, tender, or framework explicitly requires Plus by name (common in central government
                and NHS-adjacent supply chains)
              </li>
              <li>
                An insurer or a larger client&rsquo;s due-diligence process asks for independently verified
                controls, not self-reported ones
              </li>
              <li>
                You handle sensitive data at a scale where &ldquo;we said we&rsquo;re compliant&rdquo; isn&rsquo;t
                a strong enough answer for whoever&rsquo;s asking
              </li>
            </ul>
            <p>
              If nobody&rsquo;s specifically asked you for Plus, you almost certainly don&rsquo;t need it yet —
              and since Plus requires a current standard certificate first regardless, getting Cyber Essentials
              sorted is the right next step either way.
            </p>

            <h2 className="pt-4 text-xl font-bold text-[#0F2044]">Where BrightCert fits</h2>
            <p>
              BrightCert prepares you for <strong>standard Cyber Essentials</strong> — a free readiness
              assessment across the same five control areas, with a scored gap report (£199) that tells you
              what to fix before you apply. It&rsquo;s built for the self-assessment route, not the Plus
              technical audit, since Plus is inherently something only an accredited assessor can carry out on
              your live systems.
            </p>
            <p>
              If you&rsquo;re aiming for Plus eventually, using BrightCert to get standard Cyber Essentials
              genuinely solid first is still the right order of operations — Plus builds on the same five
              controls, so gaps caught early tend to be the same ones an external audit would otherwise flag.
            </p>
          </Prose>

          <div className="mt-10 mb-10">
            <p className="text-sm font-medium text-[#64748B] mb-4 text-center">
              Find out where you stand on the five controls — three quick questions, no signup needed.
            </p>
            <ReadinessTeaser />
          </div>

          <h2 className="mt-4 mb-5 text-xl font-bold text-[#0F2044]">Frequently asked questions</h2>
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
              certificate — that comes from an IASME-licensed Certification Body.
            </p>
            <p className="mt-3 text-xs text-[#94A3B8]">
              Sources:{" "}
              <a
                href="https://iasme.co.uk/articles/cyber-essentials-and-cyber-essentials-plus-what-is-the-difference/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                IASME — Cyber Essentials and Cyber Essentials Plus, what&rsquo;s the difference?
              </a>{" "}
              ·{" "}
              <a
                href="https://www.ncsc.gov.uk/cyberessentials/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                NCSC — Cyber Essentials overview
              </a>
              . Verified July 2026.
            </p>
          </div>

          <div className="mt-10 border-t border-[#E2E8F0] pt-10 text-center">
            <p className="text-[#475569] mb-5">Check your Cyber Essentials readiness, free.</p>
            <Button asChild size="lg">
              <Link href="/assessment/new">Start Your Assessment</Link>
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
