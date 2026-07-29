import type { Metadata } from "next";
import { JsonLd } from "@/components/brightcert/json-ld";
import { ReadinessTeaser } from "@/components/brightcert/readiness-teaser";
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
import { articleStructuredData, ARTICLES, metadataFor } from "@/lib/seo/registry";

const ARTICLE = ARTICLES.iasmeToolVsBrightcert;

export const metadata: Metadata = metadataFor(ARTICLE);

const COMPARE_ROWS: { label: string; iasme: string; brightcert: string }[] = [
  { label: "Cost to complete", iasme: "Free", brightcert: "Free" },
  { label: "Built by", iasme: "IASME (the official Delivery Partner)", brightcert: "BrightCert" },
  { label: "Numerical score", iasme: "No", brightcert: "Yes: 0–100%, overall + per control area" },
  { label: "Prioritised fix list", iasme: "No: generic guidance per “no” answer", brightcert: "Yes: P1/P2/P3" },
  { label: "Output format", iasme: "On-screen plan, downloadable/printable", brightcert: "Full PDF report (£99 including VAT with FOUNDING10)" },
  { label: "Shareable with a third party", iasme: "Informal notes only", brightcert: "Formal report, built to hand over" },
  { label: "Covers the 5 official control areas", iasme: "Yes", brightcert: "Yes" },
  { label: "Time to complete", iasme: "Self-paced", brightcert: "~2 hours" },
];

const FAQS = [
  {
    q: "Is IASME's Readiness Tool the same as the actual Cyber Essentials assessment?",
    a: "No. It's preparatory guidance. The real assessment is a separate, paid questionnaire reviewed by a Certification Body, which is what actually leads to certification.",
  },
  {
    q: "Do I have to pay for BrightCert's assessment to see my results?",
    a: "No, the assessment and your overall readiness score are free. The full report with per-gap explanations, the prioritised fix list, and the PDF download is £99 including VAT with code FOUNDING10 — a £100 founding discount from the standard £199 price.",
  },
  {
    q: "Can I use both tools?",
    a: "Yes, and it's a reasonable approach. There's no conflict. IASME's tool is general orientation; BrightCert is the scored, prioritised version for when you're closer to actually applying.",
  },
  {
    q: "Does BrightCert replace the need for IASME's Readiness Tool?",
    a: "Not necessarily. If you've already got a clear picture from IASME's tool, you can go straight into a BrightCert assessment. They're not sequential requirements, just two different types of output.",
  },
  {
    q: "Are these the official Danzell assessment questions?",
    a: "IASME's formal Danzell self-assessment question set is the current certification application. The Readiness Tool and BrightCert are preparation tools, not substitutes for that official questionnaire. BrightCert maps readiness questions to the five control areas without reproducing the official question set verbatim.",
  },
];

export default function IasmeVsBrightCertPage() {
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
              title={<>IASME&rsquo;s free Cyber Essentials Readiness Tool vs BrightCert: what&rsquo;s the difference?</>}
              article={ARTICLE}
              related={{ href: "/blog/what-is-cyber-essentials", label: "plain-English Cyber Essentials guide" }}
            />

            <ShortAnswer>
              They solve different parts of the same problem, and plenty of businesses reasonably use both.
              IASME&rsquo;s Readiness Tool is free, official, and gives you a step-by-step action plan based on
              which questions you answer &ldquo;no&rdquo; to, but it doesn&rsquo;t produce a score, doesn&rsquo;t
              rank what to fix first, and doesn&rsquo;t give you a document you can hand to a director or an IT
              provider. BrightCert adds a scored gap analysis (0–100% across the five control areas) and a
              prioritised, shareable report for £99 including VAT with code FOUNDING10 after a free assessment,
              a £100 founding discount from the standard £199 price.
            </ShortAnswer>

            <ArticleProse>
              <p className="mt-8 text-[#0F2044] font-medium">
                This isn&rsquo;t a &ldquo;which one&rsquo;s better&rdquo; question. It&rsquo;s &ldquo;which one gives
                you what you actually need right now.&rdquo;
              </p>

              <h2 className="pt-4 text-xl font-bold text-[#0F2044]">What IASME&rsquo;s Readiness Tool actually is</h2>
              <p>
                The Cyber Essentials Readiness Tool is built by <strong>IASME</strong>, the NCSC&rsquo;s official
                Cyber Essentials Delivery Partner, and it&rsquo;s a genuinely good starting point. It&rsquo;s an
                interactive questionnaire, written in plain English, that assumes no technical knowledge. You work
                through it at your own pace, can save progress and come back later, and at the end you get a
                tailored action plan you can download or print.
              </p>
              <p>
                Where you&rsquo;ve answered &ldquo;no&rdquo; or &ldquo;I don&rsquo;t know&rdquo; to a question, the
                tool tells you what to do about it or points you to guidance. It&rsquo;s completely free, and
                it&rsquo;s the same organisation that will eventually certify you, so nothing about your prep is
                off-brand from what the real assessment expects.
              </p>
              <p>
                For applications started from 27 April 2026, the formal self-assessment uses the Danzell question
                set and Cyber Essentials requirements v3.3. IASME&rsquo;s Readiness Tool and BrightCert both help
                you prepare, but neither is the formal Danzell application and neither issues the certificate.
                Under v3.3, multi-factor authentication must be enabled for users of cloud services where the
                service makes MFA available.
              </p>

              <h2 className="pt-4 text-xl font-bold text-[#0F2044]">What it doesn&rsquo;t give you</h2>
              <p>
                The Readiness Tool is deliberately a guidance tool, not an assessment tool. Three specific gaps,
                if you&rsquo;ve used it:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[#0F2044]">No score.</strong>{" "}You finish knowing which questions you
                  answered &ldquo;no&rdquo; to, but not how ready you are overall, or how your Firewalls control
                  compares to your Malware Protection control. There&rsquo;s no single number to track improvement
                  against.
                </li>
                <li>
                  <strong className="text-[#0F2044]">No prioritisation.</strong>{" "}If you&rsquo;ve got eight gaps,
                  the tool doesn&rsquo;t tell you which one is the biggest risk to fix first. Every &ldquo;no&rdquo;
                  gets the same generic next-step guidance, regardless of how serious it is.
                </li>
                <li>
                  <strong className="text-[#0F2044]">Nothing to hand to someone else.</strong>{" "}If a director, an
                  investor, or an IT provider asks &ldquo;where do we actually stand?&rdquo;, there&rsquo;s no
                  polished output to send them, just your own notes from working through the questionnaire.
                </li>
              </ul>
              <p>
                None of that is a criticism of the tool for what it&rsquo;s built to be. It&rsquo;s a free,
                official first step, not a management report.
              </p>

              <h2 className="pt-4 text-xl font-bold text-[#0F2044]">What BrightCert adds</h2>
              <p>
                BrightCert covers the same ground, the same five official Cyber Essentials control areas, but
                the output is different:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[#0F2044]">A readiness score</strong> (0–100%) overall and per control
                  area, so you know exactly how close you are and where the weakest area is
                </li>
                <li>
                  <strong className="text-[#0F2044]">Gaps explained in plain English</strong>, written per-answer
                  rather than generic guidance for a &ldquo;no&rdquo;
                </li>
                <li>
                  <strong className="text-[#0F2044]">A prioritised fix list</strong> (P1/P2/P3) so you know what
                  to fix first if you can&rsquo;t fix everything at once
                </li>
                <li>
                  <strong className="text-[#0F2044]">A downloadable PDF report</strong>, something you can
                  actually send to a director, a tender panel, or your IT provider
                </li>
              </ul>
              <p>
                The assessment itself is free to complete, same as IASME&rsquo;s tool. The scored report and PDF
                are £99 including VAT with code FOUNDING10, a £100 founding discount from the standard £199 price.
              </p>
            </ArticleProse>

            <div className="mt-10 mb-10">
              <p className="text-sm font-medium text-[#64748B] mb-4 text-center">
                See the difference for yourself: three quick questions, no signup needed.
              </p>
              <ReadinessTeaser />
            </div>

            <ArticleProse>
              <h2 className="pt-4 text-xl font-bold text-[#0F2044]">Side by side</h2>
            </ArticleProse>

            <div className="mt-4 overflow-x-auto rounded-[16px] border border-[#0F2044]/[0.08]">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#0F2044]/[0.08] bg-[#F3F4EC] font-mono text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                    <th className="px-4 py-3"></th>
                    <th className="px-4 py-3">IASME Readiness Tool</th>
                    <th className="px-4 py-3">BrightCert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0F2044]/[0.06] bg-white">
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.label}>
                      <td className="px-4 py-3 font-medium text-[#0F2044]">{row.label}</td>
                      <td className="px-4 py-3 text-[#475569]">{row.iasme}</td>
                      <td className="px-4 py-3 text-[#059669] font-medium">{row.brightcert}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ArticleProse>
              <h2 className="pt-8 text-xl font-bold text-[#0F2044]">Which should you use?</h2>
              <p>
                <strong className="text-[#0F2044]">
                  If you just want to understand the Cyber Essentials requirements and get pointed toward what to
                  fix, start with IASME&rsquo;s tool.
                </strong>{" "}
                It&rsquo;s free, official, and a good use of twenty minutes.
              </p>
              <p>
                <strong className="text-[#0F2044]">
                  If you need a number to track, a ranked list of what actually matters most, or a document to
                  show someone else, that&rsquo;s the specific gap BrightCert fills.
                </strong>{" "}
                Several businesses use IASME&rsquo;s tool first for general orientation, then run a BrightCert
                assessment closer to the point where they&rsquo;re actually about to apply and need something
                concrete to act on.
              </p>
              <p>
                Neither tool, free or paid, issues the actual Cyber Essentials certificate. That step always
                goes through an IASME-licensed Certification Body.
              </p>
            </ArticleProse>

            <ArticleRelatedLinks currentPath={ARTICLE.path} />
            <ArticleFaqList items={FAQS} />

            <ArticleDisclaimer>
              <a
                href="https://iasme.co.uk/cyber-essentials/frequently-asked-questions/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                IASME: current Readiness Tool and certification guidance
              </a>{" "}
              ·{" "}
              <a
                href="https://www.ncsc.gov.uk/cyberessentials/resources"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                NCSC: Cyber Essentials help &amp; resources
              </a>
              {" "}·{" "}
              <a
                href="https://iasme.co.uk/cyber-essentials/preview-the-self-assessment-questions-for-cyber-essentials/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                IASME: current Danzell self-assessment questions
              </a>
              . Verified July 2026.
            </ArticleDisclaimer>

            <ArticleFinalCta prompt="Want the scored version? It's free to find out." />
          </div>
        </article>
      </main>

      <SignalFooter />
    </div>
  );
}
