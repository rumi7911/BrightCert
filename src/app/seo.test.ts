// @vitest-environment node

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import nextConfig from "../../next.config";
import sitemap from "./sitemap";

describe("indexing signals", () => {
  test("publishes only canonical, dated marketing URLs in the sitemap", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toHaveLength(new Set(urls).size);
    expect(urls).toContain("https://brightcert.co.uk/");
    expect(urls).not.toContain("https://brightcert.co.uk/index");
    expect(entries.every((entry) => Boolean(entry.lastModified))).toBe(true);
  });

  test("keeps the homepage canonical aligned with its sitemap URL", async () => {
    const source = await readFile(join(process.cwd(), "src", "app", "layout.tsx"), "utf8");

    expect(source).toContain('alternates: { canonical: "/" }');
    expect(source).not.toContain('alternates: { canonical: "./" }');
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
});
