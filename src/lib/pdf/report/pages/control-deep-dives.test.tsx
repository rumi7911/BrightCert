// @vitest-environment node

import { Document, renderToBuffer } from "@react-pdf/renderer";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { describe, expect, test, vi } from "vitest";
import type { ReportInput } from "../report-types";
import { buildReportViewModel } from "../report-view-model";
import { ControlDeepDivePages } from "./ControlDeepDivePages";

const controls = [
  { sectionId: 1, name: "Boundary Firewalls & Internet Gateways" },
  { sectionId: 2, name: "Secure Configuration" },
  { sectionId: 3, name: "User Access Control" },
  { sectionId: 4, name: "Malware Protection" },
  { sectionId: 5, name: "Security Update Management" },
] as const;

type ExtractedPage = {
  text: string;
};

function boundedText(length: number, marker: string): string {
  const prefixLength = length - marker.length - 1;
  const prefix = "bounded delivery content "
    .repeat(length)
    .slice(0, prefixLength)
    .replace(/\s$/, "x");
  return `${prefix} ${marker}`;
}

function maximumInput(): ReportInput {
  const statuses = ["pass", "warning", "fail", "pass", "warning"] as const;
  const scores = [91, 74, 48, 86, 67] as const;

  return {
    orgName: boundedText(160, "ORGANISATION END"),
    generatedAt: "2026-07-27T12:00:00.000Z",
    analysisVersion: 2,
    reportHeadline: "Maximum delivery fixture",
    executiveSummary: "Maximum delivery fixture",
    primaryDecision: "Maximum delivery fixture",
    keyStrengths: [],
    overallScore: 73,
    overallStatus: "nearly_ready",
    portfolioEligibility: "validated",
    controls: controls.map((control, controlIndex) => {
      const controlNumber = controlIndex + 1;
      return {
        sectionId: control.sectionId,
        score: scores[controlIndex],
        status: statuses[controlIndex],
        headline: boundedText(
          180,
          `CONTROL ${controlNumber} HEADLINE END`
        ),
        managementImplication: boundedText(
          480,
          `CONTROL ${controlNumber} MANAGEMENT END`
        ),
        summary: boundedText(600, `CONTROL ${controlNumber} SUMMARY END`),
        gaps: Array.from({ length: 5 }, (_, gapIndex) => {
          const gapNumber = gapIndex + 1;
          return {
            issue: boundedText(
              240,
              `FINDING ${controlNumber}-${gapNumber} TITLE END`
            ),
            why: boundedText(
              480,
              `FINDING ${controlNumber}-${gapNumber} SUPPORT END`
            ),
            priority: (["P1", "P2", "P3"] as const)[gapIndex % 3],
          };
        }),
        actions: Array.from({ length: 5 }, (_, actionIndex) => {
          const actionNumber = actionIndex + 1;
          const priority = (["P1", "P2", "P3"] as const)[actionIndex % 3];
          const timeframe = (
            [
              ["days_0_30", "0–30 days"],
              ["days_31_60", "31–60 days"],
              ["days_61_90", "61–90 days"],
              ["ongoing", "Ongoing"],
            ] as const
          )[actionIndex % 4];
          return {
            title: boundedText(
              200,
              `ACTION ${controlNumber}-${actionNumber} TITLE END`
            ),
            steps: Array.from({ length: 6 }, (_, stepIndex) =>
              boundedText(
                400,
                `ACTION ${controlNumber}-${actionNumber} STEP ${stepIndex + 1} END`
              )
            ),
            effort: (["Low", "Medium", "High"] as const)[actionIndex % 3],
            priority,
            priorityLabel: `${priority} — validated priority`,
            recommendedOwner: "shared_business_it" as const,
            ownerLabel: "Business owner and IT provider",
            timeframe: timeframe[0],
            timeframeLabel: timeframe[1],
            evidenceRequired: Array.from({ length: 4 }, (_, evidenceIndex) =>
              boundedText(
                220,
                `ACTION ${controlNumber}-${actionNumber} EVIDENCE ${evidenceIndex + 1} END`
              )
            ),
            evidenceLabel: "Evidence required",
            portfolioEligibility: "validated" as const,
          };
        }),
      };
    }),
  };
}

function legacyInput(): ReportInput {
  return {
    orgName: "Legacy Services Ltd",
    generatedAt: "2026-07-27T12:00:00.000Z",
    analysisVersion: 1,
    reportHeadline: "Legacy review fixture",
    executiveSummary: "Legacy review fixture",
    primaryDecision: "Review the recorded assessment.",
    keyStrengths: [],
    overallScore: 72,
    overallStatus: "nearly_ready",
    portfolioEligibility: "review_required",
    controls: controls.map((control, index) => ({
      sectionId: control.sectionId,
      score: 72,
      status: "warning" as const,
      headline: `Review needed — legacy control ${index + 1} records`,
      managementImplication:
        "Review the recorded assessment before making a certification decision.",
      summary: `Legacy summary ${index + 1}.`,
      gaps: [],
      actions:
        index === 0
          ? [
              {
                title: "Review the legacy firewall action",
                steps: ["Confirm the scope before work begins."],
                effort: "Medium" as const,
                priority: null,
                priorityLabel: "Priority to confirm",
                recommendedOwner: null,
                ownerLabel: "Business owner and IT provider to confirm",
                timeframe: null,
                timeframeLabel: "To confirm",
                evidenceRequired: [],
                evidenceLabel:
                  "Evidence to confirm during action review",
                portfolioEligibility: "review_required" as const,
              },
            ]
          : [],
    })),
  };
}

function normalizedText(items: Array<{ str: string }>): string {
  return items
    .map((item) => item.str)
    .join(" ")
    .replace(/\u001f/g, ".")
    .replace(/\s+/g, " ")
    .replace(/\s+([–—-])\s+/g, " $1 ");
}

async function extractPdf(pdf: Buffer): Promise<{
  pages: ExtractedPage[];
  text: string;
}> {
  const document = await getDocument({
    data: new Uint8Array(pdf),
    disableFontFace: true,
    isEvalSupported: false,
  }).promise;

  try {
    const pages: ExtractedPage[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const items = content.items.flatMap((item) =>
        "str" in item ? [{ str: item.str }] : []
      );
      pages.push({ text: normalizedText(items) });
    }
    return {
      pages,
      text: pages.map((page) => page.text).join(" "),
    };
  } finally {
    await document.destroy();
  }
}

function pageContaining(pages: ExtractedPage[], marker: string): number {
  return pages.findIndex((page) => page.text.includes(marker));
}

async function renderDeepDives(input: ReportInput) {
  const viewModel = buildReportViewModel(input);
  const pdf = await renderToBuffer(
    <Document title="Control deep dive fixture">
      <ControlDeepDivePages input={input} viewModel={viewModel} />
    </Document>
  );
  return extractPdf(pdf);
}

describe("control deep-dive pages", () => {
  test(
    "preserves every maximum-length finding, action step and evidence item with labelled continuations",
    async () => {
      const warnings: string[] = [];
      const warn = vi
        .spyOn(console, "warn")
        .mockImplementation((...args) => warnings.push(args.join(" ")));
      const error = vi
        .spyOn(console, "error")
        .mockImplementation((...args) => warnings.push(args.join(" ")));

      let extracted: Awaited<ReturnType<typeof renderDeepDives>>;
      try {
        extracted = await renderDeepDives(maximumInput());
      } finally {
        warn.mockRestore();
        error.mockRestore();
      }

      expect(warnings.join("\n")).not.toMatch(
        /cannot wrap|can't wrap|bigger than available page height/i
      );

      const statusLabels = [
        "Pass",
        "Review needed",
        "Needs work",
        "Pass",
        "Review needed",
      ] as const;
      const scores = [91, 74, 48, 86, 67] as const;

      for (const [controlIndex, control] of controls.entries()) {
        const controlNumber = controlIndex + 1;
        expect(extracted.text).toContain(
          `CONTROL ${controlNumber} HEADLINE END`
        );
        expect(extracted.text).toContain("Management implication");
        expect(extracted.text).toContain(
          `CONTROL ${controlNumber} MANAGEMENT END`
        );
        expect(extracted.text).toContain(
          `CONTROL ${controlNumber} SUMMARY END`
        );
        expect(extracted.text).toContain(
          `${scores[controlIndex]} / 100 · ${statusLabels[controlIndex]}`
        );
        expect(extracted.text).toContain(
          `Control area continuation — ${control.name}`
        );

        const continuationPages = extracted.pages.filter((page) =>
          page.text.includes(`Control area continuation — ${control.name}`)
        );
        expect(continuationPages.length).toBeGreaterThan(0);
        for (const page of continuationPages) {
          expect(page.text).toContain(control.name);
          expect(page.text).toMatch(/\bBright\s*Cert\b/);
          expect(page.text).toContain("Confidential");
          expect(page.text).toContain("Report v2");
        }

        for (let gapNumber = 1; gapNumber <= 5; gapNumber += 1) {
          const title = `FINDING ${controlNumber}-${gapNumber} TITLE END`;
          const support = `FINDING ${controlNumber}-${gapNumber} SUPPORT END`;
          expect(pageContaining(extracted.pages, title)).toBeGreaterThanOrEqual(0);
          expect(pageContaining(extracted.pages, title)).toBe(
            pageContaining(extracted.pages, support)
          );
        }

        for (let actionNumber = 1; actionNumber <= 5; actionNumber += 1) {
          const actionIndex = actionNumber - 1;
          const effort = (["Low", "Medium", "High"] as const)[
            actionIndex % 3
          ];
          const timeframe = (
            ["0–30 days", "31–60 days", "61–90 days", "Ongoing"] as const
          )[actionIndex % 4];
          const title =
            `ACTION ${controlNumber}-${actionNumber} TITLE END`;
          const firstStep =
            `ACTION ${controlNumber}-${actionNumber} STEP 1 END`;
          expect(pageContaining(extracted.pages, title)).toBeGreaterThanOrEqual(0);
          expect(pageContaining(extracted.pages, title)).toBe(
            pageContaining(extracted.pages, firstStep)
          );
          for (let stepNumber = 1; stepNumber <= 6; stepNumber += 1) {
            expect(extracted.text).toContain(
              `ACTION ${controlNumber}-${actionNumber} STEP ${stepNumber} END`
            );
          }
          expect(extracted.text).toContain(
            "Recommended owner: Business owner and IT provider"
          );
          expect(extracted.text).toContain(`Timeframe: ${timeframe}`);
          expect(extracted.text).toContain(`Effort: ${effort}`);
          expect(extracted.text).toContain("Evidence required:");

          for (
            let evidenceNumber = 1;
            evidenceNumber <= 4;
            evidenceNumber += 1
          ) {
            expect(extracted.text).toContain(
              `ACTION ${controlNumber}-${actionNumber} EVIDENCE ${evidenceNumber} END`
            );
          }
        }
      }
    },
    120_000
  );

  test(
    "renders conservative v1 review labels and valid no-gap/no-action states",
    async () => {
      const { text } = await renderDeepDives(legacyInput());

      expect(text).toContain("Review needed — legacy control 1 records");
      expect(text).toContain("Priority to confirm");
      expect(text).toContain(
        "Recommended owner: Business owner and IT provider to confirm"
      );
      expect(text).toContain("Timeframe: To confirm");
      expect(text).toContain("Effort: Medium");
      expect(text).toContain(
        "Evidence required: Evidence to confirm during action review"
      );
      expect(text).toContain(
        "No gap findings were recorded for this control area."
      );
      expect(text).toContain(
        "No recommended actions were recorded for this control area."
      );
    },
    30_000
  );
});
