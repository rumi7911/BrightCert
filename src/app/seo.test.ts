// @vitest-environment node

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import nextConfig from "../../next.config";
import {
  ARTICLES,
  articleStructuredData,
  metadataFor,
  SEO_PAGES,
  SITE_PAGES,
} from "@/lib/seo/registry";
import sitemap from "./sitemap";
import robots from "./robots";

describe("indexing signals", () => {
  test("publishes only canonical, dated indexable URLs without ignored sitemap hints", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toHaveLength(new Set(urls).size);
    expect(urls).toContain("https://brightcert.co.uk/");
    expect(urls).toContain("https://brightcert.co.uk/about");
    expect(urls).toContain("https://brightcert.co.uk/contact");
    expect(urls).not.toContain("https://brightcert.co.uk/index");
    expect(urls).not.toContain("https://brightcert.co.uk/login");
    expect(urls).not.toContain("https://brightcert.co.uk/signup");
    expect(entries.every((entry) => Boolean(entry.lastModified))).toBe(true);
    expect(entries.every((entry) => entry.changeFrequency === undefined)).toBe(true);
    expect(entries.every((entry) => entry.priority === undefined)).toBe(true);
  });

  test("does not force the homepage canonical onto every route from the root layout", async () => {
    const source = await readFile(join(process.cwd(), "src", "app", "layout.tsx"), "utf8");

    expect(source).not.toContain('alternates: { canonical: "/" }');
  });

  test("permanently consolidates the index alias and www hostname", async () => {
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/index",
          destination: "/",
          permanent: true,
        }),
        expect.objectContaining({
          source: "/:path*",
          destination: "https://brightcert.co.uk/:path*",
          permanent: true,
        }),
      ])
    );
  });

  test("publishes registry metadata with a self-canonical on every public route", async () => {
    const routes = [
      [SITE_PAGES.home, () => import("./(marketing)/page")],
      [SITE_PAGES.pricing, () => import("./(marketing)/pricing/page")],
      [SITE_PAGES.howItWorks, () => import("./(marketing)/how-it-works/page")],
      [SITE_PAGES.faq, () => import("./(marketing)/faq/page")],
      [SITE_PAGES.blog, () => import("./(marketing)/blog/page")],
      [SITE_PAGES.about, () => import("./(marketing)/about/page")],
      [SITE_PAGES.contact, () => import("./(marketing)/contact/page")],
      [SITE_PAGES.privacy, () => import("./(marketing)/privacy/page")],
      [SITE_PAGES.terms, () => import("./(marketing)/terms/page")],
      [ARTICLES.whatIsCyberEssentials, () => import("./(marketing)/blog/what-is-cyber-essentials/page")],
      [ARTICLES.cyberEssentialsCost, () => import("./(marketing)/blog/cyber-essentials-cost/page")],
      [ARTICLES.iasmeToolVsBrightcert, () => import("./(marketing)/blog/iasme-tool-vs-brightcert/page")],
      [ARTICLES.ceVsCePlus, () => import("./(marketing)/blog/ce-vs-ce-plus/page")],
    ] as const;

    for (const [page, loadRoute] of routes) {
      const route = (await loadRoute()) as { metadata?: unknown };
      expect(route.metadata, page.path).toEqual(metadataFor(page));
    }
  });

  test("keeps auth and private application layouts out of search results", async () => {
    const layouts = await Promise.all([
      import("./(auth)/layout"),
      import("./(app)/layout"),
      import("./(assessment)/assessment/[id]/layout"),
    ]);

    for (const layout of layouts as { metadata?: { robots?: unknown } }[]) {
      expect(layout.metadata?.robots).toMatchObject({
        index: false,
        follow: false,
      });
    }
  });

  test("lets crawlers read login and signup noindex while blocking private routes", () => {
    const rules = robots().rules;
    const allRules = Array.isArray(rules) ? rules : [rules];
    const disallowed = allRules.flatMap((rule) =>
      Array.isArray(rule.disallow) ? rule.disallow : rule.disallow ? [rule.disallow] : []
    );

    expect(disallowed).toContain("/assessment/");
    expect(disallowed).toContain("/dashboard");
    expect(disallowed).not.toContain("/login");
    expect(disallowed).not.toContain("/signup");
  });

  test("publishes explicit noindex metadata for login and signup", async () => {
    const [login, signup] = await Promise.all([
      import("./(auth)/login/layout"),
      import("./(auth)/signup/layout"),
    ]);

    expect(login.metadata).toEqual(metadataFor(SITE_PAGES.login));
    expect(signup.metadata).toEqual(metadataFor(SITE_PAGES.signup));
  });

  test("keeps indexable paths, titles and descriptions unique", () => {
    const indexable = SEO_PAGES.filter((page) => page.indexable);

    expect(new Set(indexable.map((page) => page.path)).size).toBe(indexable.length);
    expect(new Set(indexable.map((page) => page.title)).size).toBe(indexable.length);
    expect(new Set(indexable.map((page) => page.description)).size).toBe(indexable.length);
  });

  test("publishes every current official fee band in the public pricing reference", async () => {
    const pricing = await readFile(join(process.cwd(), "public", "pricing.md"), "utf8");

    expect(pricing).toContain("£320 + VAT for 0–9 employees");
    expect(pricing).toContain("£440 + VAT for 10–49");
    expect(pricing).toContain("£500 + VAT for 50–249");
    expect(pricing).toContain("£600 + VAT for 250 or more");
    expect(pricing).not.toContain("typically ~£320+VAT");
  });

  test("describes article authorship, review dates, publisher, image and breadcrumbs", () => {
    const data = articleStructuredData(ARTICLES.cyberEssentialsCost);
    const [article, breadcrumbs] = data["@graph"];

    expect(article).toMatchObject({
      "@type": "Article",
      image: "https://brightcert.co.uk/og.jpg",
      datePublished: "2026-07-18",
      dateModified: "2026-07-28",
      author: {
        name: "Muhammad Sohaib Roomi",
        url: "https://brightcert.co.uk/about",
      },
      publisher: { "@id": "https://brightcert.co.uk/#organization" },
    });
    expect(breadcrumbs).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: expect.arrayContaining([
        expect.objectContaining({ position: 1, name: "Home" }),
        expect.objectContaining({ position: 2, name: "Cyber Essentials guides" }),
      ]),
    });
  });
});
