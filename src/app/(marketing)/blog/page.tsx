import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Plain-English guides on Cyber Essentials for UK SMEs: what it costs, what it checks, and how to prepare.",
  alternates: { canonical: "/blog" },
};

const ARTICLES = [
  {
    href: "/blog/ce-vs-ce-plus",
    title: "Cyber Essentials vs Cyber Essentials Plus: what's actually different?",
    dek: "Verification method, cost, timeline, and which one your business actually needs — with sources.",
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
    dek: "The IASME certification fee, the hidden pre-assessment gap-analysis cost, and Cyber Essentials Plus pricing — with sources.",
    date: "July 2026",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="bg-[#F8FAFC]">
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0F2044] mb-4 leading-tight">
            Articles
          </h1>
          <p className="text-[#475569] mb-12">
            Plain-English guides on Cyber Essentials for UK SMEs — no jargon, sources included.
          </p>

          <div className="space-y-8">
            {ARTICLES.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="bc-focus block rounded-[12px] border border-[#E2E8F0] bg-white p-6 transition-colors hover:border-[#A7F3D0] hover:bg-[#ECFDF5]"
              >
                <p className="text-xs font-medium text-[#94A3B8] mb-2">{article.date}</p>
                <h2 className="text-lg font-semibold text-[#0F2044] mb-2">{article.title}</h2>
                <p className="text-sm leading-relaxed text-[#475569]">{article.dek}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
