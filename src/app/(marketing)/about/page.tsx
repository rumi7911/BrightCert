import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/brightcert/json-ld";
import { GlowLink } from "@/components/brightcert/glow-link";
import { SignalFooter } from "@/components/brightcert/signal-footer";
import { SignalNav } from "@/components/brightcert/signal-nav";
import { ScrollProgress } from "@/components/brightcert/scroll-progress";
import { BTN_GLOW } from "@/components/brightcert/signal-primitives";
import {
  AUTHOR_LINKEDIN_URL,
  AUTHOR_URL,
  metadataFor,
  SITE_PAGES,
  SITE_URL,
} from "@/lib/seo/registry";

export const metadata: Metadata = metadataFor(SITE_PAGES.about);

const CREDENTIALS = [
  "MSc Cyber Security with Advanced Research, Distinction, University of Hertfordshire",
  "EC-Council training in Digital Forensics, Ethical Hacking and Network Defense",
  "Fortinet Cybersecurity Fundamentals",
  "Huawei HCIP Routing & Switching",
];

const METHOD = [
  {
    title: "Start with primary sources",
    body: "BrightCert guidance is checked against current NCSC requirements and IASME scheme information. We link to those sources so you can verify important claims yourself.",
  },
  {
    title: "Translate without changing meaning",
    body: "The assessment turns technical requirements into questions a business owner or operations manager can answer, while keeping the five official control areas intact.",
  },
  {
    title: "Separate evidence from judgement",
    body: "Your answers produce a readiness score and prioritised findings. They are preparation guidance, not an assessor's certification decision.",
  },
  {
    title: "Review material changes",
    body: "Public guidance is founder-reviewed when the Cyber Essentials question set, requirements or official pricing changes.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#F3F4EC]">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "AboutPage",
              "@id": `${AUTHOR_URL}#about`,
              url: AUTHOR_URL,
              name: SITE_PAGES.about.title,
              description: SITE_PAGES.about.description,
              isPartOf: { "@id": `${SITE_URL}/#website` },
              mainEntity: { "@id": `${AUTHOR_URL}#person` },
              inLanguage: "en-GB",
            },
            {
              "@type": "Person",
              "@id": `${AUTHOR_URL}#person`,
              name: "Muhammad Sohaib Roomi",
              url: AUTHOR_URL,
              image: `${SITE_URL}/founder-msr.png`,
              jobTitle: "Founder of BrightCert",
              sameAs: [AUTHOR_LINKEDIN_URL],
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "University of Hertfordshire",
              },
              worksFor: { "@id": `${SITE_URL}/#organization` },
              knowsAbout: [
                "Cyber Essentials readiness",
                "Cyber security",
                "Vulnerability assessment",
                "Network security",
              ],
            },
          ],
        }}
      />
      <ScrollProgress />
      <SignalNav />

      <main className="pt-[150px] pb-24">
        <section className="mx-auto grid max-w-[1080px] gap-12 px-4 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="rounded-[28px] border border-[#0F2044]/[0.08] bg-white p-7 shadow-[0_28px_60px_-38px_rgba(15,32,68,0.35)] sm:p-9">
            <div className="relative mx-auto aspect-square max-w-[320px] overflow-hidden rounded-[22px] bg-[#E2E8F0]">
              <Image
                src="/founder-msr.png"
                alt="Muhammad Sohaib Roomi, founder and reviewer at BrightCert"
                fill
                priority
                sizes="(max-width: 640px) 80vw, 320px"
                className="object-cover"
              />
            </div>
            <div className="mt-6">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#047857]">
                Founder and reviewer
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-[#0F2044]">Muhammad Sohaib Roomi</p>
              <p className="mt-1 text-sm text-[#64748B]">London, United Kingdom</p>
              <a
                href={AUTHOR_LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#047857] underline hover:no-underline"
              >
                View Muhammad on LinkedIn
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#047857]">About BrightCert</p>
            <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.6rem,6vw,4.7rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-[#0F2044]">
              Practical Cyber Essentials preparation, reviewed by a security researcher
            </h1>
            <p className="mt-7 max-w-[62ch] text-[1.05rem] leading-[1.75] text-[#475569]">
              Muhammad built BrightCert after seeing UK small businesses struggle to translate Cyber Essentials
              requirements into a clear plan. The product guides an organisation through 60 plain-English
              questions, identifies likely gaps and produces a prioritised readiness report.
            </p>
            <p className="mt-4 max-w-[62ch] text-[1.05rem] leading-[1.75] text-[#475569]">
              BrightCert is operated by Cognumi Ltd. It is a preparation tool, not a Certification Body. Official
              Cyber Essentials certification is issued only through an IASME-licensed Certification Body.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-[1080px] px-4">
          <div className="grid gap-8 rounded-[28px] bg-[#0F2044] p-8 text-white md:grid-cols-[0.8fr_1.2fr] md:p-12">
            <div>
              <ShieldCheck className="h-10 w-10 text-[#6EE7B7]" strokeWidth={1.6} aria-hidden />
              <h2 className="mt-5 font-display text-3xl font-semibold">Relevant experience</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Credentials are included to show who reviews BrightCert&apos;s public guidance. They do not make
                BrightCert an official Certification Body.
              </p>
            </div>
            <ul className="grid gap-4">
              {CREDENTIALS.map((credential) => (
                <li key={credential} className="flex gap-3 rounded-[16px] border border-white/10 bg-white/[0.05] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#6EE7B7]" strokeWidth={1.7} aria-hidden />
                  <span className="text-sm leading-relaxed text-white/80">{credential}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-[1080px] px-4">
          <div className="max-w-[720px]">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#047857]">Methodology</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0F2044] sm:text-4xl">
              How BrightCert guidance is produced
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#475569]">
              The aim is simple: make the scheme easier to act on without pretending readiness software can
              replace an official assessor.
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {METHOD.map((item, index) => (
              <article key={item.title} className="rounded-[20px] border border-[#0F2044]/[0.08] bg-white p-6">
                <span className="font-mono text-xs font-bold text-[#047857]">0{index + 1}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-[#0F2044]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-[1080px] px-4">
          <div className="rounded-[28px] border border-[#A7F3D0] bg-[#ECFDF5] p-8 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-[#0F2044]">Check the guidance for yourself</h2>
            <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-[#475569]">
              Our Cyber Essentials guides cite NCSC and IASME sources and show when they were last reviewed.
              Start with the plain-English overview, then use the free assessment when you want a view of your own
              readiness.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/blog/what-is-cyber-essentials"
                className="inline-flex items-center gap-2 font-semibold text-[#047857] underline hover:no-underline"
              >
                Read the Cyber Essentials guide
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <GlowLink href="/assessment/new" className={BTN_GLOW}>
                Start your assessment
              </GlowLink>
            </div>
          </div>
        </section>
      </main>

      <SignalFooter />
    </div>
  );
}
