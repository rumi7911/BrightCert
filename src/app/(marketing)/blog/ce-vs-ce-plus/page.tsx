import type { Metadata } from "next";
import { JsonLd } from "@/components/brightcert/json-ld";
import { ReadinessTeaser } from "@/components/brightcert/readiness-teaser";
import { SignalNav } from "@/components/brightcert/signal-nav";
import { SignalFooter } from "@/components/brightcert/signal-footer";
import { ScrollProgress } from "@/components/brightcert/scroll-progress";
import { ArticleHeader, ArticleProse, ShortAnswer, ArticleFaqList, ArticleDisclaimer, ArticleFinalCta } from "@/components/brightcert/article-kit";

const TITLE = "Cyber Essentials vs Cyber Essentials Plus";
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
  { label: "Can apply directly?", ce: "Yes", plus: "No: requires a current standard certificate first" },
  { label: "If a non-compliance is found", ce: "Correct and resubmit", plus: "30 days to remediate before you can pass" },
];

const FAQS = [
  {
    q: "Can I skip straight to Cyber Essentials Plus?",
    a: "No. Plus requires a current Cyber Essentials certificate before you can apply. The two are sequential, not alternatives.",
  },
  {
    q: "Does Cyber Essentials Plus replace the need for standard Cyber Essentials?",
    a: "No, you need both. Plus is standard Cyber Essentials plus an additional technical audit layer, not a separate scheme.",
  },
  {
    q: "How much more does Cyber Essentials Plus cost?",
    a: "Roughly 4–8x the standard certification fee, typically £1,500–£3,000+VAT versus £330–£500+VAT, because Plus requires real assessor time testing your actual systems rather than a questionnaire review.",
  },
  {
    q: "Does BrightCert prepare you for Cyber Essentials Plus?",
    a: "BrightCert's assessment covers the same five control areas Plus also checks, so it's a strong foundation either way. But the Plus technical audit itself has to be carried out by an accredited assessor, not a preparation tool.",
  },
];

export default function CeVsCePlusPage() {
  return (
    <div className="bg-[#F3F4EC]">
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
      <ScrollProgress />
      <SignalNav />

      <main className="pt-[150px] pb-24">
        <article>
          <div className="max-w-3xl mx-auto px-4">
            <ArticleHeader
              title={<>Cyber Essentials vs Cyber Essentials Plus: what&rsquo;s actually different?</>}
              byline="By Muhammad Sohaib Roomi, founder of BrightCert · Updated July 2026"
              related={{ href: "/blog/what-is-cyber-essentials", label: "plain-English Cyber Essentials guide" }}
            />

            <ShortAnswer>
              Both certify the same five technical controls, but Cyber Essentials is a self-assessment
              questionnaire your business fills in and a Certification Body reviews, while Cyber Essentials
              Plus adds an independent technical audit: an assessor actually scans and tests your systems
              rather than taking your word for it. Plus costs roughly <strong>4–8x more</strong> (£1,500–£3,000+VAT
              vs £330–£500+VAT), takes <strong>4–8 weeks</strong>{" "}instead of days, and you can&rsquo;t apply for
              it until you already hold standard Cyber Essentials.
            </ShortAnswer>

            <ArticleProse>
              <p className="mt-8 text-[#0F2044] font-medium">
                Most UK SMEs only need standard Cyber Essentials. Plus matters when a contract, tender, or
                insurer specifically asks for it.
              </p>

              <h2 className="pt-4 text-xl font-bold text-[#0F2044]">Same five controls, different way of checking them</h2>
              <p>
                Both certifications assess the same five NCSC-defined control areas: firewalls, secure
                configuration, security update management, user access control, and malware protection. Nothing
                about <em>what&rsquo;s</em>{" "}being checked changes between the two, only <em>how</em>.
              </p>
              <p>
                <strong className="text-[#0F2044]">Cyber Essentials (standard):</strong>{" "}You complete a
                questionnaire about how each control is implemented across your systems. A Certification Body
                reviews your answers and issues the certificate if they meet the scheme&rsquo;s requirements.
                It&rsquo;s entirely self-reported. Nobody logs into your network to verify it.
              </p>
              <p>
                <strong className="text-[#0F2044]">Cyber Essentials Plus:</strong>{" "}Same five controls, but your
                self-assessment answers get independently verified. An assessor runs an external vulnerability
                scan against your public IP addresses, tests a representative sample of your actual devices
                (every operating system type in use has to be included: servers, desktops, laptops, tablets,
                phones), and observes real users doing everyday tasks on sampled machines to confirm the controls
                are actually operating as described.
              </p>
              <p>
                In short: standard Cyber Essentials checks what you say is true. Plus checks whether it&rsquo;s
                actually true.
              </p>

              <h2 className="pt-4 text-xl font-bold text-[#0F2044]">What that difference costs you</h2>
            </ArticleProse>

            <div className="mt-4 overflow-x-auto rounded-[16px] border border-[#0F2044]/[0.08]">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#0F2044]/[0.08] bg-[#F3F4EC] font-mono text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                    <th className="px-4 py-3"></th>
                    <th className="px-4 py-3">Cyber Essentials</th>
                    <th className="px-4 py-3">Cyber Essentials Plus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0F2044]/[0.06] bg-white">
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

            <ArticleProse>
              <p className="mt-6">
                The price gap isn&rsquo;t arbitrary. It reflects real assessor time. A questionnaire review
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
                If nobody&rsquo;s specifically asked you for Plus, you almost certainly don&rsquo;t need it yet.
                Since Plus requires a current standard certificate first regardless, getting Cyber Essentials
                sorted is the right next step either way.
              </p>

              <h2 className="pt-4 text-xl font-bold text-[#0F2044]">Where BrightCert fits</h2>
              <p>
                BrightCert prepares you for <strong>standard Cyber Essentials</strong>, a free readiness
                assessment across the same five control areas, with a scored gap report (£199) that tells you
                what to fix before you apply. It&rsquo;s built for the self-assessment route, not the Plus
                technical audit, since Plus is inherently something only an accredited assessor can carry out on
                your live systems.
              </p>
              <p>
                If you&rsquo;re aiming for Plus eventually, using BrightCert to get standard Cyber Essentials
                genuinely solid first is still the right order of operations. Plus builds on the same five
                controls, so gaps caught early tend to be the same ones an external audit would otherwise flag.
              </p>
            </ArticleProse>

            <div className="mt-10 mb-10">
              <p className="text-sm font-medium text-[#64748B] mb-4 text-center">
                Find out where you stand on the five controls: three quick questions, no signup needed.
              </p>
              <ReadinessTeaser />
            </div>

            <ArticleFaqList items={FAQS} />

            <ArticleDisclaimer>
              <a
                href="https://iasme.co.uk/articles/cyber-essentials-and-cyber-essentials-plus-what-is-the-difference/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                IASME: Cyber Essentials and Cyber Essentials Plus, what&rsquo;s the difference?
              </a>{" "}
              ·{" "}
              <a
                href="https://www.ncsc.gov.uk/cyberessentials/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                NCSC: Cyber Essentials overview
              </a>
              . Verified July 2026.
            </ArticleDisclaimer>

            <ArticleFinalCta prompt="Check your Cyber Essentials readiness, free." />
          </div>
        </article>
      </main>

      <SignalFooter />
    </div>
  );
}
