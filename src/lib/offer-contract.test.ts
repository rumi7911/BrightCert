// @vitest-environment node

import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { describe, expect, test } from "vitest";

async function sourceFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(root, entry.name);
      if (entry.isDirectory()) return sourceFiles(path);
      return [path];
    })
  );
  return nested.flat();
}

describe("customer-facing founding offer contract", () => {
  test("contains no limited-cohort or first-customer scarcity copy", async () => {
    const files = [
      ...(await sourceFiles(join(process.cwd(), "src", "app"))),
      join(process.cwd(), "src", "lib", "resend", "emails.ts"),
      ...(await sourceFiles(join(process.cwd(), "public"))),
    ].filter((file) => [".ts", ".tsx", ".md", ".txt"].includes(extname(file)));
    const violations: string[] = [];

    for (const file of files) {
      const text = await readFile(file, "utf8");
      if (
        /first\s+(?:10|ten)\s+customers?|limited\s+(?:cohort|places?|offer)|places?\s+(?:left|remaining)/i.test(
          text
        )
      ) {
        violations.push(file.replace(`${process.cwd()}/`, ""));
      }
    }

    expect(violations).toEqual([]);
  });

  test.each([
    "src/lib/resend/emails.ts",
    "src/app/(marketing)/pricing/page.tsx",
    "src/app/(marketing)/page.tsx",
    "src/app/(app)/layout.tsx",
    "src/app/(app)/dashboard/page.tsx",
    "src/app/(app)/assessment/[id]/results/results-view.tsx",
    "public/llms.txt",
  ])("%s states the payable VAT-inclusive price and discount basis", async (file) => {
    const text = await readFile(join(process.cwd(), file), "utf8");

    expect(text).toContain("£99 including VAT");
    expect(text).toMatch(/£100[\s\S]{0,120}£199|£199[\s\S]{0,120}£100/);
  });

  test("does not abbreviate the VAT-inclusive founding price", async () => {
    const files = await sourceFiles(join(process.cwd(), "src", "app"));
    const violations: string[] = [];

    for (const file of files.filter((path) =>
      [".ts", ".tsx"].includes(extname(path))
    )) {
      if (/£99\s+incl\.\s+VAT/i.test(await readFile(file, "utf8"))) {
        violations.push(file.replace(`${process.cwd()}/`, ""));
      }
    }

    expect(violations).toEqual([]);
  });
});
