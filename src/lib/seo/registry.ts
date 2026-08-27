import type { Metadata } from "next";

export const SITE_URL = "https://brightcert.co.uk";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.jpg`;
export const AUTHOR_URL = `${SITE_URL}/about`;
export const AUTHOR_LINKEDIN_URL = "https://www.linkedin.com/in/muhammad-sohaib-roomi";
export const AUTHOR_CRUNCHBASE_URL = "https://www.crunchbase.com/person/muhammad-sohaib-roomi";
export const ORG_CRUNCHBASE_URL = "https://www.crunchbase.com/organization/brightcert";

type SeoPath = "/" | `/${string}`;

type SeoPageBase = {
  path: SeoPath;
  title: string;
  description: string;
  indexable: boolean;
  lastModified: `${number}-${number}-${number}`;
};

export type SeoPage = SeoPageBase & {
  kind?: "page";
};

export type ArticleMeta = SeoPageBase & {
  kind: "article";
  shortTitle: string;
  excerpt: string;
  datePublished: `${number}-${number}-${number}`;
};

export type SeoEntry = SeoPage | ArticleMeta;

export const SITE_PAGES = {
  home: {
    path: "/",
    title: "Cyber Essentials Readiness Assessment for UK SMEs | BrightCert",
    description:
      "Assess your Cyber Essentials readiness in around two hours. Get a score, identify gaps and unlock a practical remediation report for your UK SME.",
    indexable: true,
    lastModified: "2026-07-28",
  },
  pricing: {
    path: "/pricing",
    title: "Cyber Essentials Readiness Assessment Pricing | BrightCert",
    description:
      "Start your Cyber Essentials readiness assessment free, then unlock the full gap analysis and report for £99 including VAT with FOUNDING10 — first 10 customers.",
    indexable: true,
    lastModified: "2026-07-28",
  },
  howItWorks: {
    path: "/how-it-works",
    title: "How Our Cyber Essentials Readiness Assessment Works | BrightCert",
    description:
      "See how BrightCert guides UK SMEs through 60 plain-English questions, readiness scoring, gap analysis and a prioritised Cyber Essentials report.",
    indexable: true,
    lastModified: "2026-07-28",
  },
  faq: {
    path: "/faq",
    title: "Cyber Essentials Readiness Assessment FAQs | BrightCert",
    description:
      "Answers about BrightCert's Cyber Essentials readiness assessment, timing, pricing, reports, official certification and support for UK SMEs.",
    indexable: true,
    lastModified: "2026-07-28",
  },
  blog: {
    path: "/blog",
    title: "Cyber Essentials Guides for UK SMEs | BrightCert",
    description:
      "Current, sourced Cyber Essentials guides for UK SMEs covering 2026 costs, requirements, readiness tools and Cyber Essentials Plus.",
    indexable: true,
    lastModified: "2026-07-28",
  },
  about: {
    path: "/about",
    title: "About BrightCert and Muhammad Sohaib Roomi | BrightCert",
    description:
      "Meet BrightCert founder Muhammad Sohaib Roomi and learn how the Cyber Essentials readiness assessment is researched, reviewed and kept honest.",
    indexable: true,
    lastModified: "2026-07-28",
  },
  contact: {
    path: "/contact",
    title: "Contact BrightCert | Cyber Essentials Readiness Support",
    description:
      "Contact BrightCert about Cyber Essentials readiness assessments, reports, billing, privacy or partnerships.",
    indexable: true,
    lastModified: "2026-08-15",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy | BrightCert",
    description: "How BrightCert, operated by Cognumi Ltd, collects, uses and protects your personal data.",
    indexable: true,
    lastModified: "2026-07-28",
  },
  terms: {
    path: "/terms",
    title: "Terms of Service | BrightCert",
    description: "The terms governing your use of BrightCert, a Cyber Essentials readiness service operated by Cognumi Ltd.",
    indexable: true,
    lastModified: "2026-07-28",
  },
  login: {
    path: "/login",
    title: "Sign in | BrightCert",
    description: "Sign in to your BrightCert Cyber Essentials readiness workspace.",
    indexable: false,
    lastModified: "2026-07-28",
  },
  signup: {
    path: "/signup",
    title: "Start your assessment | BrightCert",
    description: "Create a BrightCert account and start your Cyber Essentials readiness assessment.",
    indexable: false,
    lastModified: "2026-07-28",
  },
} as const satisfies Record<string, SeoPage>;

export const ARTICLES = {
  whatIsCyberEssentials: {
    path: "/blog/what-is-cyber-essentials",
    title: "What Is Cyber Essentials? UK Guide for 2026 | BrightCert",
    shortTitle: "What is Cyber Essentials? A plain-English guide",
    description:
      "Cyber Essentials explained for UK SMEs: the five controls, v3.3 requirements, Danzell questions, official 2026 fees and how certification works.",
    excerpt:
      "The five controls, current v3.3 requirements, official fees and the path from preparation to certification.",
    indexable: true,
    lastModified: "2026-07-28",
    kind: "article",
    datePublished: "2026-07-19",
  },
  cyberEssentialsCost: {
    path: "/blog/cyber-essentials-cost",
    title: "Cyber Essentials Cost UK 2026: Official Fees Explained | BrightCert",
    shortTitle: "How much does Cyber Essentials cost in 2026?",
    description:
      "Calculate the official 2026 Cyber Essentials fee by organisation size and budget separately for certification, preparation and remediation.",
    excerpt:
      "Official IASME fee bands, a simple calculator and a clear split between certification, preparation and remediation costs.",
    indexable: true,
    lastModified: "2026-07-28",
    kind: "article",
    datePublished: "2026-07-18",
  },
  iasmeToolVsBrightcert: {
    path: "/blog/iasme-tool-vs-brightcert",
    title: "IASME Readiness Tool vs BrightCert: Honest Comparison | BrightCert",
    shortTitle: "IASME's Readiness Tool vs BrightCert",
    description:
      "An honest comparison of IASME's free Cyber Essentials Readiness Tool and BrightCert's scored, prioritised readiness assessment for UK SMEs.",
    excerpt:
      "A side-by-side comparison of the official free readiness tool and BrightCert's scored, prioritised report.",
    indexable: true,
    lastModified: "2026-07-28",
    kind: "article",
    datePublished: "2026-07-19",
  },
  ceVsCePlus: {
    path: "/blog/ce-vs-ce-plus",
    title: "Cyber Essentials vs Cyber Essentials Plus: 2026 Guide | BrightCert",
    shortTitle: "Cyber Essentials vs Cyber Essentials Plus",
    description:
      "Compare Cyber Essentials and Cyber Essentials Plus in 2026: verification, official standard fees, provider-specific Plus pricing and which you need.",
    excerpt:
      "How verification, pricing and timelines differ, and when a UK SME actually needs the technical audit.",
    indexable: true,
    lastModified: "2026-07-28",
    kind: "article",
    datePublished: "2026-07-19",
  },
  cyberEssentialsRequirements: {
    path: "/blog/cyber-essentials-requirements",
    title: "Cyber Essentials Requirements v3.3: What Changed in 2026 | BrightCert",
    shortTitle: "Cyber Essentials requirements v3.3: what changed",
    description:
      "Cyber Essentials requirements v3.3 took effect on 27 April 2026 with the Danzell question set. What changed for cloud, MFA, remote work and BYOD scope.",
    excerpt:
      "What v3.3 changed on 27 April 2026, plus the evidence to collect for each of the five controls.",
    indexable: true,
    lastModified: "2026-08-20",
    kind: "article",
    datePublished: "2026-08-20",
  },
  cyberEssentialsAssessmentQuestions: {
    path: "/blog/cyber-essentials-assessment-questions",
    title: "Cyber Essentials Self-Assessment Questions: What to Prepare | BrightCert",
    shortTitle: "Cyber Essentials self-assessment: what to prepare",
    description:
      "What the Cyber Essentials self-assessment questionnaire asks about in 2026, the information to gather before you start, and who in your business holds it.",
    excerpt:
      "What the Danzell question set asks about, the information to gather first, and who in the business actually holds it.",
    indexable: true,
    lastModified: "2026-08-27",
    kind: "article",
    datePublished: "2026-08-27",
  },
  cyberEssentialsChecklist: {
    path: "/blog/cyber-essentials-checklist",
    title: "Cyber Essentials Checklist for UK SMEs (2026) | BrightCert",
    shortTitle: "Cyber Essentials checklist for UK SMEs",
    description:
      "A printable Cyber Essentials checklist with owner, evidence and status columns. Scope first, then the five controls, evidence collection and final review.",
    excerpt:
      "A printable checklist with owner, evidence and status columns, covering scope, the five controls and the final review.",
    indexable: true,
    lastModified: "2026-08-20",
    kind: "article",
    datePublished: "2026-08-20",
  },
} as const satisfies Record<string, ArticleMeta>;

export const SEO_PAGES: readonly SeoEntry[] = [
  ...Object.values(SITE_PAGES),
  ...Object.values(ARTICLES),
];

export function absoluteUrl(path: SeoPath) {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

export function metadataFor(page: SeoEntry): Metadata {
  const canonical = absoluteUrl(page.path);
  const robots = page.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true };

  const shared = {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical },
    robots,
    openGraph: {
      type: "website" as const,
      locale: "en_GB",
      url: canonical,
      siteName: "BrightCert",
      title: page.title,
      description: page.description,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: page.title,
      description: page.description,
      images: [DEFAULT_OG_IMAGE],
    },
  } satisfies Metadata;

  if (page.kind !== "article") return shared;

  return {
    ...shared,
    authors: [{ name: "Muhammad Sohaib Roomi", url: AUTHOR_URL }],
    openGraph: {
      ...shared.openGraph,
      type: "article",
      publishedTime: page.datePublished,
      modifiedTime: page.lastModified,
      authors: [AUTHOR_URL],
    },
  };
}

export function articleStructuredData(article: ArticleMeta) {
  const url = absoluteUrl(article.path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: article.shortTitle,
        description: article.description,
        image: DEFAULT_OG_IMAGE,
        datePublished: article.datePublished,
        dateModified: article.lastModified,
        author: {
          "@type": "Person",
          "@id": `${AUTHOR_URL}#person`,
          name: "Muhammad Sohaib Roomi",
          url: AUTHOR_URL,
          sameAs: [AUTHOR_LINKEDIN_URL, AUTHOR_CRUNCHBASE_URL],
        },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: url,
        inLanguage: "en-GB",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Cyber Essentials guides",
            item: `${SITE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.shortTitle,
            item: url,
          },
        ],
      },
    ],
  };
}
