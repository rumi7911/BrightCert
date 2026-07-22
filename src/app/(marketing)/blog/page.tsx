import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/brightcert/reveal";
import { SignalNav } from "@/components/brightcert/signal-nav";
import { SignalFooter } from "@/components/brightcert/signal-footer";
import { ScrollProgress } from "@/components/brightcert/scroll-progress";
import { Tag, SectionTitle, Mark } from "@/components/brightcert/signal-primitives";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Plain-English guides on Cyber Essentials for UK SMEs: what it costs, what it checks, and how to prepare.",
  alternates: { canonical: "/blog" },
};

const ARTICLES = [
  {
    href: "/blog/what-is-cyber-essentials",
    title: "What is Cyber Essentials? A plain-English guide",
    dek: "The five controls, how certification actually works, and where to go for more detail: the place to start.",
    date: "July 2026",
  },
  {
    href: "/blog/ce-vs-ce-plus",
    title: "Cyber Essentials vs Cyber Essentials Plus: what's actually different?",
    dek: "Verification method, cost, timeline, and which one your business actually needs: with sources.",
    date: "July 2026",
  },
  {
    href: "/blog/iasme-tool-vs-brightcert",
    title: "IASME's free Readiness Tool vs BrightCert: what's the difference?",
    dek: "An honest, side-by-side comparison of the free official tool and BrightCert's scored assessment.",
    date: "July 2026",
  },
  {
    href: "/blog/cyber-essentials-cost",
    title: "How much does Cyber Essentials actually cost in 2026?",
    dek: "The IASME certification fee, the hidden pre-assessment gap-analysis cost, and Cyber Essentials Plus pricing: with sources.",
    date: "July 2026",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="bg-[#F3F4EC]">
      <ScrollProgress />
      <SignalNav />

      <main className="pt-[150px] pb-24">
        <section>
          <div className="max-w-[760px] mx-auto px-4 text-center mb-14">
            <Reveal>
              <Tag center>Articles</Tag>
            </Reveal>
            <Reveal delay={100}>
              <SectionTitle as="h1" className="mx-auto">
                <Mark>Plain-English</Mark> guides to Cyber Essentials
              </SectionTitle>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-[#475569] text-[clamp(1rem,1.4vw,1.13rem)] leading-[1.7] mt-[22px]">
                No jargon, sources included.
              </p>
            </Reveal>
          </div>

          <div className="max-w-[820px] mx-auto px-4 grid gap-4">
            {ARTICLES.map((article, i) => (
              <Reveal key={article.href} delay={i * 80}>
                <Link
                  href={article.href}
                  className="bc-focus group block rounded-[22px] border border-[#0F2044]/[0.07] bg-white px-7 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#059669]/[0.35] hover:shadow-[0_22px_44px_-22px_rgba(15,32,68,0.22)]"
                >
                  <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#94A3B8] mb-2.5">
                    {article.date}
                  </p>
                  <h2 className="font-display text-lg font-semibold text-[#0F2044] mb-2 leading-snug">{article.title}</h2>
                  <p className="text-sm leading-relaxed text-[#475569] mb-4">{article.dek}</p>
                  <span className="inline-flex items-center gap-1.5 font-display text-[13.5px] font-semibold text-[#059669]">
                    Read article
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <SignalFooter />
    </div>
  );
}
