// @vitest-environment node

import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { Document, Page, View, renderToBuffer } from "@react-pdf/renderer";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { isValidElement, type ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";
import { ActionBlock } from "./ActionBlock";
import { BrandHeader } from "./BrandHeader";
import { FindingBlock } from "./FindingBlock";
import { InsightHeadline } from "./InsightHeadline";
import { ReportFooter } from "./ReportFooter";

const EXPECTED_FONT_FILES = [
  "BricolageGrotesque-Regular.woff",
  "BricolageGrotesque-SemiBold.woff",
  "Inter-Regular.woff",
  "Inter-SemiBold.woff",
  "JetBrainsMono-Regular.woff",
  "JetBrainsMono-Bold.woff",
] as const;

const EXPECTED_LICENSES = [
  {
    file: "LICENSE-Bricolage-Grotesque.txt",
    packageName: "@fontsource/bricolage-grotesque",
    sourcePath: "node_modules/@fontsource/bricolage-grotesque/LICENSE",
  },
  {
    file: "LICENSE-Inter.txt",
    packageName: "@fontsource/inter",
    sourcePath: "node_modules/@fontsource/inter/LICENSE",
  },
  {
    file: "LICENSE-JetBrains-Mono.txt",
    packageName: "@fontsource/jetbrains-mono",
    sourcePath: "node_modules/@fontsource/jetbrains-mono/LICENSE",
  },
] as const;

function boundedText(length: number, marker: string): string {
  const prefixLength = length - marker.length - 1;
  return `${"bounded report content ".repeat(length).slice(0, prefixLength)} ${marker}`;
}

type TextItem = {
  str: string;
  width: number;
  x: number;
};

async function extractPdf(pdf: Buffer) {
  const document = await getDocument({
    data: new Uint8Array(pdf),
    disableFontFace: true,
    isEvalSupported: false,
  }).promise;

  try {
    const pages: Array<{ text: string; items: TextItem[] }> = [];

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const items = content.items.flatMap((item) =>
        "str" in item
          ? [{ str: item.str, width: item.width, x: item.transform[4] }]
          : []
      );

      pages.push({
        text: items.map((item) => item.str).join(" ").replace(/\s+/g, " "),
        items,
      });
    }

    return {
      pages,
      text: pages.map((page) => page.text).join(" ").replace(/\s+/g, " "),
    };
  } finally {
    await document.destroy();
  }
}

function pageContaining(
  pages: Array<{ text: string }>,
  marker: string
): number {
  return pages.findIndex((page) => page.text.includes(marker));
}

function findTextRunStyle(node: ReactNode, text: string): unknown {
  if (!isValidElement<{ children?: ReactNode; style?: unknown }>(node)) {
    return undefined;
  }

  if (node.props.children === text) {
    return node.props.style;
  }

  for (const child of Array.isArray(node.props.children)
    ? node.props.children
    : [node.props.children]) {
    const style = findTextRunStyle(child, text);
    if (style !== undefined) {
      return style;
    }
  }

  return undefined;
}

describe("report PDF font bundle", () => {
  test("prepares the six pinned local fonts and licence provenance files", () => {
    const projectRoot = process.cwd();
    execFileSync(process.execPath, ["scripts/prepare-report-fonts.mjs"], {
      cwd: projectRoot,
      stdio: "pipe",
    });

    const fontDirectory = path.join(projectRoot, "public", "fonts");
    const missingBundledFontFiles = EXPECTED_FONT_FILES.filter(
      (file) => !fs.existsSync(path.join(fontDirectory, file))
    );

    expect(missingBundledFontFiles).toEqual([]);

    for (const expected of EXPECTED_LICENSES) {
      const licence = fs.readFileSync(
        path.join(fontDirectory, expected.file),
        "utf8"
      );

      expect(licence).toContain(`Package: ${expected.packageName}@5.3.0`);
      expect(licence).toContain(`Source: ${expected.sourcePath}`);
      expect(licence).toContain("SIL OPEN FONT LICENSE Version 1.1");
    }
  });
});

describe("shared report PDF primitives", () => {
  test("renders the BrightCert lock-up as separately coloured text runs", () => {
    const header = BrandHeader({
      reportLabel: "Readiness review / v2",
      generatedAt: "27 July 2026",
    });

    expect(findTextRunStyle(header, "Bright")).toMatchObject({
      color: "#FFFFFF",
    });
    expect(findTextRunStyle(header, "Cert")).toMatchObject({
      color: "#6EE7B7",
    });
  });

  test("fails closed if a validated action reaches the renderer without a supporting step", () => {
    expect(() =>
      ActionBlock({
        index: 1,
        action: {
          sectionId: 1,
          title: "Validated action without delivery detail",
          steps: [],
          effort: "Low",
          priority: "P1",
          priorityLabel: "P1 — Must fix",
          recommendedOwner: "internal_it_lead",
          ownerLabel: "Internal IT lead",
          timeframe: "days_0_30",
          timeframeLabel: "0–30 days",
          evidenceRequired: ["Approved review record"],
          evidenceLabel: "Evidence required",
          portfolioEligibility: "validated",
        },
      })
    ).toThrow("validated report action requires at least one implementation step");
  });

  test("preserves an empty historical step list for review-required v1 actions", () => {
    expect(() =>
      ActionBlock({
        index: 1,
        action: {
          sectionId: 1,
          title: "Historical action pending review",
          steps: [],
          effort: "Low",
          priority: null,
          priorityLabel: "Priority to confirm",
          recommendedOwner: null,
          ownerLabel: "Business owner and IT provider to confirm",
          timeframe: null,
          timeframeLabel: "To confirm",
          evidenceRequired: [],
          evidenceLabel: "Evidence to confirm during action review",
          portfolioEligibility: "review_required",
        },
      })
    ).not.toThrow();
  });

  test(
    "keeps first finding and action content together and reserves footer page-number space",
    async () => {
      const warnings: string[] = [];
      const warn = vi
        .spyOn(console, "warn")
        .mockImplementation((...args) => warnings.push(args.join(" ")));
      const error = vi
        .spyOn(console, "error")
        .mockImplementation((...args) => warnings.push(args.join(" ")));

      let pdf: Buffer;
      try {
        pdf = await renderToBuffer(
          <Document title="Primitive pagination fixture">
            <Page
              size="A4"
              style={{
                paddingTop: 40,
                paddingBottom: 64,
                paddingHorizontal: 40,
                fontFamily: "Inter",
                fontSize: 10,
              }}
            >
              <ReportFooter
                orgName={boundedText(
                  160,
                  "ORGANISATION FOOTER BOUNDARY"
                )}
                reportVersion="v2"
              />
              <BrandHeader
                reportLabel="Readiness review / v2"
                generatedAt="27 July 2026"
              />
              <InsightHeadline
                eyebrow="Control insight"
                headline="The first response line must travel with its conclusion."
              />
              <View style={{ height: 385 }} />
              <FindingBlock
                finding={{
                  priority: "P1",
                  issue: boundedText(240, "FINDING TITLE END"),
                  why: boundedText(480, "FINDING WHY END"),
                }}
              />
              <ActionBlock
                index={1}
                action={{
                  sectionId: 1,
                  title: boundedText(200, "ACTION HEADER END"),
                  steps: [
                    boundedText(400, "FIRST ACTION DETAIL END"),
                    boundedText(400, "SECOND ACTION DETAIL END"),
                  ],
                  effort: "Medium",
                  priority: "P1",
                  priorityLabel: "P1 — Must fix",
                  recommendedOwner: "msp_it_provider",
                  ownerLabel: "IT provider",
                  timeframe: "days_0_30",
                  timeframeLabel: "0–30 days",
                  evidenceRequired: ["Configuration export"],
                  evidenceLabel: "Configuration export",
                  portfolioEligibility: "validated",
                }}
              />
            </Page>
          </Document>
        );
      } finally {
        warn.mockRestore();
        error.mockRestore();
      }

      const extracted = await extractPdf(pdf);

      expect(warnings.join("\n")).not.toMatch(
        /cannot wrap|can't wrap|bigger than available page height/i
      );
      expect(extracted.text).toMatch(/\bBright\s*Cert\b/);

      const findingTitlePage = pageContaining(
        extracted.pages,
        "FINDING TITLE END"
      );
      const findingWhyPage = pageContaining(extracted.pages, "FINDING WHY END");
      const actionHeaderPage = pageContaining(
        extracted.pages,
        "ACTION HEADER END"
      );
      const firstActionDetailPage = pageContaining(
        extracted.pages,
        "FIRST ACTION DETAIL END"
      );

      expect(findingTitlePage).toBeGreaterThanOrEqual(0);
      expect(findingTitlePage).toBe(findingWhyPage);
      expect(actionHeaderPage).toBeGreaterThanOrEqual(0);
      expect(actionHeaderPage).toBe(firstActionDetailPage);
      expect(extracted.text).toContain("SECOND ACTION DETAIL END");

      for (const page of extracted.pages) {
        const footerText = page.items.find((item) =>
          item.str.startsWith("Confidential")
        );
        const pageNumber = page.items.find((item) =>
          /^Page \d+ of \d+$/.test(item.str)
        );

        expect(
          footerText,
          `Footer presence by page: ${extracted.pages.map((candidate) => candidate.text.includes("Confidential")).join(", ")}. Missing footer in: ${page.items.map((item) => item.str).join(" | ")}`
        ).toBeDefined();
        expect(pageNumber).toBeDefined();
        expect(footerText!.x + footerText!.width).toBeLessThanOrEqual(
          pageNumber!.x - 8
        );
      }
    },
    60_000
  );
});
