import type { Metadata } from "next";
import Link from "next/link";
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

const ARTICLE = ARTICLES.whatIsCyberEssentials;

export const metadata: Metadata = metadataFor(ARTICLE);

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
    a: "Standard Cyber Essentials is a self-assessment reviewed by a Certification Body. Cyber Essentials Plus adds an independent technical audit of your systems. Standard fees are fixed by organisation size; Plus pricing is quoted by the provider for your scope.",
  },
  {
    q: "What changed in Cyber Essentials v3.3?",
    a: "Requirements v3.3 took effect on 27 April 2026 with the Danzell question set. It includes clearer scoping and cloud-service guidance, and requires multi-factor authentication for cloud services where the service makes MFA available.",
  },
];

export default function WhatIsCyberEssentialsPage() {
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
              title="What is Cyber Essentials? A plain-English guide"
              article={ARTICLE}
            />

            <ShortAnswer>
              Cyber Essentials is a UK Government-backed certification scheme, created by the{" "}
              <strong>National Cyber Security Centre (NCSC)</strong>{" "}and delivered through <strong>IASME</strong>,
              that checks your business against five basic technical controls: firewalls, secure configuration,
              patching, user access, and malware protection. Most businesses complete it as a self-assessment
              questionnaire reviewed by a Certification Body. In 2026, the official fee is{" "}
              <strong>£320–£600 + VAT</strong> based on organisation size.
              It&rsquo;s the baseline standard UK government contracts and increasingly clients and insurers ask
              for as proof you&rsquo;ve got the fundamentals covered.
            </ShortAnswer>

            <ArticleProse>
              <p className="mt-8 text-[#0F2044] font-medium">
                Everything below is the plain-English version, no jargon, and links to deeper detail on cost, the
                free preparation tools, and Cyber Essentials Plus where you want it.
              </p>

              <h2 className="pt-4 text-xl font-bold text-[#0F2044]">Who&rsquo;s actually behind it</h2>
              <p>
                Cyber Essentials was created by the{" "}
                <a
                  href="https://www.ncsc.gov.uk/cyberessentials/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#059669] underline hover:no-underline"
                >
                  NCSC
                </a>
                , the UK Government&rsquo;s National Cyber Security Centre, and describes itself as &ldquo;the
                minimum standard of cyber security recommended by the Government for organisations of all
                sizes.&rdquo; Day-to-day delivery is handled by <strong>IASME</strong>, the NCSC&rsquo;s official
                Cyber Essentials Delivery Partner, which licenses a network of Certification Bodies across the UK
                to carry out assessments.
              </p>
              <p>
                That matters because it means Cyber Essentials isn&rsquo;t a product any one company sells.
                It&rsquo;s a fixed, published standard. The same five controls, the same requirements, regardless
                of which Certification Body reviews you.
              </p>

              <h2 className="pt-4 text-xl font-bold text-[#0F2044]">The current 2026 requirements</h2>
              <p>
                Cyber Essentials requirements <strong>v3.3</strong> took effect on{" "}
                <strong>27 April 2026</strong> with the Danzell question set. If you apply now, use the current
                Danzell questions and v3.3 requirements rather than an older Willow checklist or saved answer set.
              </p>
              <p>
                One practical point for SMEs is multi-factor authentication. Where a cloud service makes MFA
                available, v3.3 requires it to be enabled for users of that service. Scope also needs to account
                for cloud services, remote workers and personally owned devices that can access organisational
                data or services.
              </p>

              <h2 className="pt-4 text-xl font-bold text-[#0F2044]">The five things it actually checks</h2>
              <p>Strip away the compliance language and Cyber Essentials asks five plain questions about your business:</p>
            </ArticleProse>

            <div className="mt-5 space-y-0 rounded-[16px] border border-[#0F2044]/[0.08] bg-white overflow-hidden">
              {CONTROLS.map((c) => (
                <div key={c.n} className="flex gap-4 p-5 border-t border-[#0F2044]/[0.06] first:border-t-0">
                  <span className="shrink-0 font-mono text-sm font-bold text-[#059669]">{c.n}</span>
                  <div>
                    <p className="font-display text-sm font-semibold text-[#0F2044] mb-1">{c.name}</p>
                    <p className="text-sm leading-relaxed text-[#475569]">{c.plain}</p>
                  </div>
                </div>
              ))}
            </div>

            <ArticleProse>
              <p className="mt-6">
                Answer all five with confidence and you&rsquo;re closer than most businesses starting out. Answer
                &ldquo;not sure&rdquo; to a few of them and you&rsquo;re completely normal. The gaps are usually
                fixable in days, not months.
              </p>
            </ArticleProse>

            <div className="mt-10 mb-10">
              <p className="text-sm font-medium text-[#64748B] mb-4 text-center">
                Curious how your business would score? Three quick questions, no signup needed.
              </p>
              <ReadinessTeaser />
            </div>

            <ArticleProse>
              <h2 className="pt-4 text-xl font-bold text-[#0F2044]">How certification actually works</h2>
              <p>The path is the same for almost every UK small business:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong className="text-[#0F2044]">Find your gaps first.</strong>{" "}Most businesses don&rsquo;t
                  know where they stand before they start. A free readiness assessment (IASME&rsquo;s own tool, or
                  BrightCert&rsquo;s scored version) tells you what to fix before you pay anything.
                </li>
                <li>
                  <strong className="text-[#0F2044]">Fix what&rsquo;s missing.</strong>{" "}This is the actual security
                  work: a properly configured firewall, MFA for cloud services where available, supported
                  software and suitable malware protection. What it costs depends on your starting point.
                </li>
                <li>
                  <strong className="text-[#0F2044]">Complete the self-assessment</strong>{" "}and pay the IASME
                  certification fee: £320–£600 + VAT depending on company size. A Certification Body reviews your
                  answers and issues the certificate if they meet the requirements.
                </li>
                <li>
                  <strong className="text-[#0F2044]">Optionally, go further with Cyber Essentials Plus.</strong>{" "}An
                  independent technical audit on top of standard certification, usually only needed if a specific
                  contract or insurer asks for it by name.
                </li>
              </ol>
              <p>Want the full breakdown on any one step? Three deeper guides:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <Link href="/blog/cyber-essentials-cost" className="text-[#059669] underline hover:no-underline">
                    How much Cyber Essentials actually costs
                  </Link>
                  : the certification fee, the hidden preparation cost, and a realistic first-year budget
                </li>
                <li>
                  <Link href="/blog/iasme-tool-vs-brightcert" className="text-[#059669] underline hover:no-underline">
                    IASME&rsquo;s free Readiness Tool vs BrightCert
                  </Link>
                  : an honest comparison of the two free ways to find your gaps
                </li>
                <li>
                  <Link href="/blog/ce-vs-ce-plus" className="text-[#059669] underline hover:no-underline">
                    Cyber Essentials vs Cyber Essentials Plus
                  </Link>
                  : what the technical audit actually involves, and whether you need it
                </li>
              </ul>

              <h2 className="pt-4 text-xl font-bold text-[#0F2044]">Where BrightCert fits</h2>
              <p>
                BrightCert is a free readiness assessment built around these same five control areas: 60
                plain-English questions, roughly two hours, and a readiness score you see before paying anything.
                The full scored report, with a prioritised fix list and a downloadable PDF, is £99 including VAT
                with code FOUNDING10 — a £100 founding discount from the standard £199 price.
                BrightCert doesn&rsquo;t issue the Cyber Essentials certificate (that always comes from an
                IASME-licensed Certification Body); it exists to make sure you walk into that step already knowing
                exactly where you stand.
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
              . Verified July 2026.
            </ArticleDisclaimer>

            <ArticleFinalCta prompt="See where your business stands, free." />
          </div>
        </article>
      </main>

      <SignalFooter />
    </div>
  );
}
