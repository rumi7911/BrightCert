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

// Customer-facing copy may state the FOUNDING10 redemption cap, because that
// cap is real and verifiable in Stripe (coupon ZXdXak08, max_redemptions 10).
// Disclosing a limit that genuinely exists is the opposite of the artificial
// scarcity banned by SOP.md and EMAIL-SEQUENCES.md. What stays banned is
// urgency and countdown language we cannot substantiate — see those documents.
const ARTIFICIAL_SCARCITY =
  /limited\s+(?:cohort|places?|offer|time|availability)|(?:places?|spots?|spaces?|seats?)\s+(?:left|remaining)|only\s+\d+\s+(?:left|remaining|places?|spots?)|ending\s+soon|act\s+fast|hurry|while\s+stocks\s+last/i;

// Wherever the discounted price is quoted, the cap must be quoted with it.
// Without this, the site could advertise £99 indefinitely while the code has
// stopped working — the failure this contract exists to prevent.
const CAP_DISCLOSURE = /first\s+(?:10|ten)\s+customers?/i;

describe("customer-facing founding offer contract", () => {
  async function customerFacingFiles() {
    return [
      ...(await sourceFiles(join(process.cwd(), "src", "app"))),
      join(process.cwd(), "src", "lib", "resend", "emails.ts"),
      ...(await sourceFiles(join(process.cwd(), "public"))),
      join(process.cwd(), "README.md"),
    ].filter((file) => [".ts", ".tsx", ".md", ".txt"].includes(extname(file)));
  }

  test("contains no artificial scarcity or urgency copy", async () => {
    const violations: string[] = [];

    for (const file of await customerFacingFiles()) {
      if (ARTIFICIAL_SCARCITY.test(await readFile(file, "utf8"))) {
        violations.push(file.replace(`${process.cwd()}/`, ""));
      }
    }

    expect(violations).toEqual([]);
  });

  test("discloses the FOUNDING10 cap wherever the discounted price appears", async () => {
    const violations: string[] = [];

    for (const file of await customerFacingFiles()) {
      const text = await readFile(file, "utf8");
      if (!/FOUNDING10/.test(text)) continue;
      // Configuration and comments may name the code without quoting a price.
      if (!/£99/.test(text)) continue;
      if (!CAP_DISCLOSURE.test(text)) {
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
    "README.md",
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
