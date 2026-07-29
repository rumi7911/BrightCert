import type { Metadata } from "next";
import { JsonLd } from "@/components/brightcert/json-ld";
import { ReadinessTeaser } from "@/components/brightcert/readiness-teaser";
import { CyberEssentialsCostCalculator } from "@/components/brightcert/cyber-essentials-cost-calculator";
import { SignalNav } from "@/components/brightcert/signal-nav";
import { SignalFooter } from "@/components/brightcert/signal-footer";
import { ScrollProgress } from "@/components/brightcert/scroll-progress";
import {
  ArticleHeader,
  ArticleProse,
  ShortAnswer,
  ArticleFaqList,
  ArticleDisclaimer,
  ArticleFinalCta,
  ArticleRelatedLinks,
} from "@/components/brightcert/article-kit";
import { CYBER_ESSENTIALS_FEE_BANDS } from "@/lib/seo/cyber-essentials-fees";
import { articleStructuredData, ARTICLES, metadataFor } from "@/lib/seo/registry";

const ARTICLE = ARTICLES.cyberEssentialsCost;

export const metadata: Metadata = metadataFor(ARTICLE);

const FEE_BANDS = CYBER_ESSENTIALS_FEE_BANDS.map((band) => ({
  size: band.size,
  employees: band.range,
  fee: `£${band.feeExVat} + VAT`,
}));

const BUDGET_ROWS = [
  { item: "IASME certification fee", cost: "£320–£600 + VAT" },
  { item: "Pre-assessment gap analysis (consultant)", cost: "£750–£1,500" },
  { item: "Or: BrightCert readiness report", cost: "£99 including VAT with FOUNDING10 (first 10 customers)", highlight: true },
  { item: "Remediation (firewall, MFA, AV licensing, etc.)", cost: "Varies by starting point" },
];

const FAQS = [
  {
    q: "Does Cyber Essentials expire?",
    a: "Yes. Certification lasts 12 months, after which you need to reassess and pay the fee again.",
  },
  {
    q: "Can I do Cyber Essentials completely free?",
    a: "The certification fee itself starts at £320 + VAT and is unavoidable if you want the certificate. It goes to IASME or your Certification Body, not to a preparation tool. Preparation can be free if you use NCSC and IASME guidance yourself, or you can pay for a consultant or a readiness report.",
  },
  {
    q: "What's the real difference in cost between Cyber Essentials and Cyber Essentials Plus?",
    a: "Standard Cyber Essentials uses official fee bands from £320 to £600 + VAT. Cyber Essentials Plus adds an external technical audit, so its price is set by the Certification Body based on scope, device sample and complexity. Ask for a written quote rather than relying on a generic range.",
  },
  {
    q: "Does BrightCert issue the Cyber Essentials certificate?",
    a: "No. BrightCert is a readiness assessment. It scores you against the same five control areas Cyber Essentials checks and tells you what to fix, in plain English. The actual certificate is issued by an IASME-licensed Certification Body after you apply and pass their assessment.",
  },
];

export default function CyberEssentialsCostPage() {
  return (
    <div className="bg-[#F3F4EC]">
      <JsonLd
        data={articleStructuredData(ARTICLE)}
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
              title="How much does Cyber Essentials actually cost in 2026?"
              article={ARTICLE}
              related={{ href: "/blog/what-is-cyber-essentials", label: "plain-English Cyber Essentials guide" }}
            />

            <ShortAnswer>
              The official Cyber Essentials assessment fee is <strong>£320 to £600 + VAT</strong>, based on
              organisation size: £320 for 0–9 employees, £440 for 10–49, £500 for 50–249 and £600 for 250 or more.
              Preparation and remediation are separate costs. Cyber Essentials Plus is priced by the
              Certification Body for your scope, so there is no single official Plus fee.
            </ShortAnswer>

            <ArticleProse>
              <p className="mt-8 rounded-[14px] border border-[#0F2044]/[0.08] bg-white p-5">
                <strong className="text-[#0F2044]">Current-version note:</strong>{" "}Applications started from 27
                April 2026 use Cyber Essentials requirements v3.3 and the Danzell question set. Budget for any
                work needed to enable multi-factor authentication on cloud services where MFA is available.
              </p>
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
                  className="text-[#059669] underline hover:no-underline"
                >
                  National Cyber Security Centre (NCSC)
                </a>{" "}
                and delivered through <strong>IASME</strong>, the NCSC&rsquo;s official Cyber Essentials Delivery
                Partner. IASME licenses a network of Certification Bodies across the UK to carry out assessments.
              </p>
              <p>IASME publishes its certification fee in four size bands:</p>
            </ArticleProse>

            <div className="mt-4 overflow-x-auto rounded-[16px] border border-[#0F2044]/[0.08]">
              <table className="w-full min-w-[440px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#0F2044]/[0.08] bg-[#F3F4EC] font-mono text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                    <th className="px-4 py-3">Organisation size</th>
                    <th className="px-4 py-3">Employees</th>
                    <th className="px-4 py-3">IASME assessment fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0F2044]/[0.06] bg-white">
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

            <CyberEssentialsCostCalculator />

            <ArticleProse>
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
                official fixed bands. Ask an IASME-licensed Certification Body for a quote that states the scope,
                sampled devices, retest terms and whether standard certification is included.
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
                <strong className="text-[#0F2044]">This is the specific cost BrightCert exists to replace.</strong>{" "}
                Not the £320–£600 certification fee (BrightCert isn&rsquo;t a Certification Body and doesn&rsquo;t
                issue the certificate), but the £750–£1,500 people spend just finding out where they stand before
                they even apply. BrightCert&rsquo;s readiness assessment is free to complete, and the full scored
                gap report, the same kind of findings a consultant&rsquo;s gap analysis produces, is{" "}
                <strong>£99 including VAT with code FOUNDING10</strong> for the first 10 customers, a £100 founding discount from the
                standard £199 price.
              </p>
            </ArticleProse>

            <div className="mt-10 mb-10">
              <p className="text-sm font-medium text-[#64748B] mb-4 text-center">
                Curious where you&rsquo;d stand? Three quick questions, no signup needed.
              </p>
              <ReadinessTeaser />
            </div>

            <ArticleProse>
              <h2 className="pt-4 text-xl font-bold text-[#0F2044]">What a realistic first-year budget looks like</h2>
              <p>For a typical UK small business going for standard Cyber Essentials (not Plus):</p>
            </ArticleProse>

            <div className="mt-4 overflow-x-auto rounded-[16px] border border-[#0F2044]/[0.08]">
              <table className="w-full min-w-[440px] text-left text-sm">
                <tbody className="divide-y divide-[#0F2044]/[0.06] bg-white">
                  {BUDGET_ROWS.map((row) => (
                    <tr key={row.item} className={row.highlight ? "bg-[#ECFDF5]" : undefined}>
                      <td className="px-4 py-3 text-[#334155]">{row.item}</td>
                      <td
                        className={
                          "px-4 py-3 text-right font-semibold whitespace-nowrap " +
                          (row.highlight ? "text-[#059669]" : "text-[#0F2044]")
                        }
                      >
                        {row.cost}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-[#0F2044]/[0.08]">
                    <td className="px-4 py-3 font-semibold text-[#0F2044]">Before remediation, consultant route</td>
                    <td className="px-4 py-3 text-right font-bold text-[#0F2044] whitespace-nowrap">
                      Official fee + quoted consultancy
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-[#0F2044]">Before remediation, BrightCert route</td>
                    <td className="px-4 py-3 text-right font-bold text-[#059669] whitespace-nowrap">
                      Official fee + £99 including VAT
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ArticleProse>
              <p className="mt-6">
                Remediation cost is the same either way. Fixing a missing firewall costs what it costs regardless
                of who found the gap. The difference is in what you pay to find out what needs fixing. Consultant
                estimates above are illustrative and should be confirmed with a written quote.
              </p>
            </ArticleProse>

            <ArticleRelatedLinks currentPath={ARTICLE.path} />
            <ArticleFaqList items={FAQS} />

            <ArticleDisclaimer>
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
                href="https://iasme.co.uk/cyber-essentials/frequently-asked-questions/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                IASME: Cyber Essentials pricing FAQ
              </a>
              {" "}·{" "}
              <a
                href="https://www.ncsc.gov.uk/cyberessentials/resources"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                NCSC: Cyber Essentials v3.3 resources
              </a>
              . IASME published fee bands and third-party pricing data, verified July 2026.
            </ArticleDisclaimer>

            <ArticleFinalCta prompt="Want to see exactly where your business stands, free?" />
          </div>
        </article>
      </main>

      <SignalFooter />
    </div>
  );
}
