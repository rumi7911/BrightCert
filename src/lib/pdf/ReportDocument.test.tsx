// @vitest-environment node

import { renderToBuffer } from "@react-pdf/renderer";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { describe, expect, test, vi } from "vitest";
import {
  allPassV2ReportFixture,
  highRiskV2ReportFixture,
  legacyV1ReportFixture,
  mixedV2ReportFixture,
} from "./report/fixtures";
import { parsePersistedReportInput } from "./report/report-input";
import type { ReportInput } from "./report/report-types";
import { ReportDocument } from "./ReportDocument";

const GENERATED_AT = "2026-07-27T12:00:00.000Z";

const CONTROL_NAMES = [
  "Boundary Firewalls & Internet Gateways",
  "Secure Configuration",
  "User Access Control",
  "Malware Protection",
  "Security Update Management",
] as const;

function completeV2Input(): ReportInput {
  return parsePersistedReportInput(
    {
      org_name: "Decision Delivery Ltd",
      analysis_version: 2,
      report_insights: {
        reportHeadline: "Close the evidence gap before applying.",
        primaryDecision: "Fund the documented control work.",
        keyStrengths: ["Boundary controls are operating effectively."],
      },
      executive_summary:
        "The organisation has a credible baseline with focused work remaining.",
      overall_score: 68,
      overall_status: "nearly_ready",
      control_scores: [1, 2, 3, 4, 5].map((sectionId) => ({
        section_id: sectionId,
        score: sectionId === 1 ? 82 : 68,
        status: sectionId === 1 ? "pass" : "warning",
        headline: `Control ${sectionId} has a clear management outcome`,
        management_implication: `Management implication for control ${sectionId}.`,
        summary: `Control ${sectionId} summary.`,
        gaps: [
          {
            issue: `Control ${sectionId} evidence is incomplete`,
            why: "The control cannot be verified consistently.",
            priority: sectionId === 1 ? "P1" : "P2",
          },
        ],
        remediation: [
          {
            title: `Complete control ${sectionId} evidence`,
            steps: ["Adopt one checklist", "Review a monthly sample"],
            effort: sectionId === 1 ? "Low" : "Medium",
            priority: sectionId === 1 ? "P1" : "P2",
            recommendedOwner: "internal_it_lead",
            timeframe: sectionId === 1 ? "days_0_30" : "days_31_60",
            evidenceRequired: [`Approved control ${sectionId} checklist`],
          },
        ],
      })),
    },
    GENERATED_AT
  );
}

function legacyV1Input(): ReportInput {
  return parsePersistedReportInput(
    {
      org_name: "Legacy Delivery Ltd",
      executive_summary:
        "The organisation should review its recorded work before applying.",
      overall_score: 60,
      overall_status: "nearly_ready",
      control_scores: [1, 2, 3, 4, 5].map((sectionId) => ({
        section_id: sectionId,
        score: 60,
        status: "warning",
        summary: `Legacy control ${sectionId} summary.`,
        gaps: [
          {
            issue: `Legacy control ${sectionId} evidence needs review`,
            why: "The recorded evidence is incomplete.",
            priority: "P1",
          },
        ],
        remediation: [
          {
            title: `Review legacy control ${sectionId}`,
            steps: ["Confirm the scope", "Record the evidence"],
            effort: "Medium",
          },
        ],
      })),
    },
    GENERATED_AT
  );
}

function textAtLength(length: number, marker = ""): string {
  const separatorLength = marker ? 1 : 0;
  const prefixLength = length - marker.length - separatorLength;
  const prefix = "bounded response "
    .repeat(length)
    .slice(0, prefixLength)
    .replace(/\s$/, "x");
  return marker ? `${prefix} ${marker}` : prefix;
}

function maximumAcceptedInput(): ReportInput {
  return {
    orgName: textAtLength(160, "ORGANISATION BOUNDARY MARKER"),
    generatedAt: GENERATED_AT,
    analysisVersion: 2,
    reportHeadline: "Maximum accepted report response",
    executiveSummary: textAtLength(900, "EXECUTIVE SUMMARY END"),
    primaryDecision: "Complete the recorded remediation programme.",
    keyStrengths: [],
    overallScore: 60,
    overallStatus: "nearly_ready",
    portfolioEligibility: "validated",
    controls: [1, 2, 3, 4, 5].map((sectionId) => ({
      sectionId: sectionId as 1 | 2 | 3 | 4 | 5,
      score: 60,
      status: "warning" as const,
      headline: `Control ${sectionId} requires focused delivery`,
      managementImplication: `Management implication for control ${sectionId}.`,
      summary: textAtLength(600),
      gaps: Array.from({ length: 5 }, (_, index) => ({
        issue: textAtLength(240, `ISSUE ${sectionId}-${index} END`),
        why: textAtLength(480, `WHY ${sectionId}-${index} END`),
        priority: (index % 2 === 0 ? "P1" : "P2") as "P1" | "P2",
      })),
      actions: Array.from(
        { length: sectionId === 5 ? 1 : 5 },
        (_, index) => ({
          title: textAtLength(200),
          steps: Array.from({ length: 6 }, (_, stepIndex) =>
            textAtLength(
              400,
              sectionId === 5 && index === 0 && stepIndex === 5
                ? "FINAL REMEDIATION STEP SURVIVES"
                : ""
            )
          ),
          effort: "Medium" as const,
          priority: (index % 2 === 0 ? "P1" : "P2") as "P1" | "P2",
          priorityLabel:
            index % 2 === 0 ? "P1 — Must fix" : "P2 — Should fix soon",
          recommendedOwner: "internal_it_lead" as const,
          ownerLabel: "Internal IT lead",
          timeframe: "days_31_60" as const,
          timeframeLabel: "31–60 days",
          evidenceRequired: [
            `Control ${sectionId} delivery ${index + 1} record`,
          ],
          evidenceLabel: "Evidence required",
          portfolioEligibility: "validated" as const,
        })
      ),
    })),
  };
}

type ExtractedTextItem = {
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
    const pages: Array<{ text: string; items: ExtractedTextItem[] }> = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const items = content.items.flatMap((item) =>
        "str" in item
          ? [{ str: item.str, width: item.width, x: item.transform[4] }]
          : []
      );
      pages.push({
        text: items
          .map((item) => item.str)
          .join(" ")
          .replace(/\s+/g, " "),
        items,
      });
    }
    return {
      pageCount: document.numPages,
      pages,
      text: pages
        .map((page) => page.text)
        .join(" ")
        .replace(/\s+/g, " "),
    };
  } finally {
    await document.destroy();
  }
}

describe("ReportDocument acceptance fixtures", () => {
  test(
    "renders the realistic mixed-v2 fixture with every report family",
    async () => {
      const extracted = await extractPdf(
        await renderToBuffer(<ReportDocument {...mixedV2ReportFixture} />)
      );

      expect(extracted.pageCount).toBeGreaterThan(0);
      expect(extracted.text).toContain("MIXED V2 FIXTURE DECISION");
      expect(extracted.text).toContain("READINESS PROFILE / V2");
      expect(extracted.text).toContain("RISK CONCENTRATION / V2");
      expect(extracted.text).toContain("ACTION PORTFOLIO / V2");
      expect(extracted.text).toContain("REMEDIATION ROADMAP / V2");
      expect(extracted.text).toContain("MIXED V2 FIXTURE EVIDENCE");
    },
    60_000
  );

  test(
    "renders the all-pass low-content fixture with its empty delivery states",
    async () => {
      const extracted = await extractPdf(
        await renderToBuffer(<ReportDocument {...allPassV2ReportFixture} />)
      );

      expect(extracted.pageCount).toBeGreaterThan(0);
      expect(extracted.text).toContain("ALL PASS V2 FIXTURE");
      expect(extracted.text).toContain(
        "No recommended actions were recorded for this assessment."
      );
      expect(extracted.text).toContain(
        "No explicit evidence items were recorded for this assessment."
      );
    },
    60_000
  );

  test(
    "renders the maximum-risk fixture without overflow and preserves final content",
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
          <ReportDocument {...highRiskV2ReportFixture} />
        );
      } finally {
        warn.mockRestore();
        error.mockRestore();
      }

      const extracted = await extractPdf(pdf);

      expect(extracted.pageCount).toBeGreaterThan(0);
      expect(warnings.join("\n")).not.toMatch(
        /cannot wrap|can't wrap|bigger than available page height/i
      );
      expect(extracted.text).toContain("FINAL FINDING MARKER SURVIVES");
      expect(extracted.text).toContain("FINAL ACTION MARKER SURVIVES");
      expect(extracted.text).toContain("FINAL EVIDENCE MARKER SURVIVES");
    },
    120_000
  );

  test(
    "renders the legacy-v1 fixture with conservative labels and no matrix",
    async () => {
      const extracted = await extractPdf(
        await renderToBuffer(<ReportDocument {...legacyV1ReportFixture} />)
      );

      expect(extracted.pageCount).toBeGreaterThan(0);
      expect(extracted.text).toContain("LEGACY V1 FIXTURE");
      expect(extracted.text).toContain("Priority to confirm");
      expect(extracted.text).toContain(
        "Evidence to confirm during action review"
      );
      expect(extracted.text).toContain(
        "Action priorities require review before portfolio plotting"
      );
      expect(extracted.text).not.toContain("Quick wins");
      expect(extracted.text).not.toContain("Major blockers");
    },
    60_000
  );
});

describe("ReportDocument composition", () => {
  test(
    "renders every decision, delivery and evidence page family for validated v2 input",
    async () => {
      const extracted = await extractPdf(
        await renderToBuffer(<ReportDocument {...completeV2Input()} />)
      );

      expect(extracted.text).toMatch(/EXECUTIVE READOUT \/ V2/i);
      expect(extracted.text).toMatch(/READINESS PROFILE \/ V2/i);
      expect(extracted.text).toMatch(/RISK CONCENTRATION \/ V2/i);
      expect(extracted.text).toMatch(/ACTION PORTFOLIO \/ V2/i);
      expect(extracted.text).toMatch(/REMEDIATION ROADMAP \/ V2/i);
      expect(extracted.text).toContain("Prioritised action register");
      expect(extracted.text).toContain("Evidence checklist");
      expect(extracted.text).toContain("Method, limitations and next steps");
      for (const [index, controlName] of CONTROL_NAMES.entries()) {
        expect(extracted.text).toContain(
          `CONTROL DEEP DIVE / ${String(index + 1).padStart(
            2,
            "0"
          )} / ${controlName.toUpperCase()} / V2`
        );
      }
    },
    60_000
  );

  test(
    "renders legacy v1 input with the conservative no-matrix notice",
    async () => {
      const extracted = await extractPdf(
        await renderToBuffer(<ReportDocument {...legacyV1Input()} />)
      );

      expect(extracted.text).toContain(
        "Action priorities require review before portfolio plotting"
      );
      expect(extracted.text).toContain(
        "Evidence to confirm during action review"
      );
      expect(extracted.text).toContain("Analysis version 1");
    },
    60_000
  );
});

describe("ReportDocument maximum response layout", () => {
  test(
    "preserves complete long-report blocks and footer separation",
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
          <ReportDocument {...maximumAcceptedInput()} />
        );
      } finally {
        warn.mockRestore();
        error.mockRestore();
      }

      const extracted = await extractPdf(pdf);

      expect(warnings.join("\n")).not.toMatch(
        /cannot wrap|can't wrap|bigger than available page height/i
      );
      expect(extracted.text).toContain("ORGANISATION BOUNDARY MARKER");
      expect(extracted.text).toContain("FINAL REMEDIATION STEP SURVIVES");
      expect(extracted.text).toContain(
        "After addressing the recorded preparation actions, apply for official Cyber Essentials certification"
      );
      expect(extracted.text.match(/\b1 action\b/g)).toHaveLength(1);
      expect(extracted.text).not.toMatch(/\b1 actions\b/);

      const disclaimerHeading =
        "Readiness assessment — not official certification";
      const disclaimerBody = "This report is produced by BrightCert";
      const disclaimerHeadingPages = extracted.pages.flatMap((page, index) =>
        page.text.includes(disclaimerHeading) ? [index] : []
      );
      const disclaimerBodyPages = extracted.pages.flatMap((page, index) =>
        page.text.includes(disclaimerBody) ? [index] : []
      );

      // The disclaimer is printed exactly twice: on the cover, because that is
      // the page a reader sees first and the one most likely to be shared or
      // screenshotted alone, and again on the methodology page. Heading and
      // body must always travel together — a heading without its body would
      // assert the limitation without explaining it.
      expect(disclaimerHeadingPages).toEqual(disclaimerBodyPages);
      expect(disclaimerHeadingPages).toHaveLength(2);
      expect(disclaimerHeadingPages[0]).toBe(0);
      expect(disclaimerHeadingPages[1]).toBe(extracted.pages.length - 1);

      for (let sectionId = 1; sectionId <= 5; sectionId += 1) {
        for (let index = 0; index < 5; index += 1) {
          const issuePage = extracted.pages.findIndex((page) =>
            page.text.includes(`ISSUE ${sectionId}-${index} END`)
          );
          const whyPage = extracted.pages.findIndex((page) =>
            page.text.includes(`WHY ${sectionId}-${index} END`)
          );

          expect(issuePage).toBeGreaterThanOrEqual(0);
          expect(whyPage).toBe(issuePage);
        }
      }

      for (const page of extracted.pages) {
        const footerText = page.items.find((item) =>
          item.str.startsWith("Confidential")
        );
        const pageNumber = page.items.find((item) =>
          /^Page \d+ of \d+$/.test(item.str)
        );

        expect(footerText).toBeDefined();
        expect(pageNumber).toBeDefined();
        expect(footerText!.x + footerText!.width).toBeLessThanOrEqual(
          pageNumber!.x - 8
        );
      }
      expect(extracted.pageCount).toBeGreaterThan(0);
    },
    120_000
  );
});
