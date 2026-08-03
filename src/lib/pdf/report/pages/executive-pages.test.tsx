// @vitest-environment node

import { Document, renderToBuffer } from "@react-pdf/renderer";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { describe, expect, test } from "vitest";
import type { ReportInput } from "../report-types";
import { buildReportViewModel } from "../report-view-model";
import { CoverPage } from "./CoverPage";
import { ExecutiveReadoutPage } from "./ExecutiveReadoutPage";
import { ReadinessProfilePage } from "./ReadinessProfilePage";

const controlNames = [
  "Boundary Firewalls & Internet Gateways",
  "Secure Configuration",
  "User Access Control",
  "Malware Protection",
  "Security Update Management",
] as const;

const mixedV2Input: ReportInput = {
  orgName: "Example Services Ltd",
  generatedAt: "2026-07-27T12:00:00.000Z",
  analysisVersion: 2,
  reportHeadline: "Address access-control blockers before applying.",
  executiveSummary: "The assessment identifies focused remediation work.",
  primaryDecision: "Fund the documented remediation actions.",
  keyStrengths: [
    "Boundary controls are documented.",
    "Malware protection is established.",
  ],
  overallScore: 77,
  overallStatus: "nearly_ready",
  portfolioEligibility: "validated",
  controls: [
    {
      sectionId: 5,
      score: 82,
      status: "pass",
      headline: "Updates are controlled.",
      managementImplication: "Maintain the update process.",
      summary: "Update management is established.",
      gaps: [{ issue: "Update proof", why: "Evidence is limited.", priority: "P2" }],
      actions: [],
    },
    {
      sectionId: 3,
      score: 64,
      status: "warning",
      headline: "Access needs review.",
      managementImplication: "Review access governance.",
      summary: "Access control needs attention.",
      gaps: [{ issue: "Dormant accounts", why: "Access can persist.", priority: "P1" }],
      actions: [
        {
          title: "Review dormant accounts",
          steps: ["Remove access that is no longer required."],
          effort: "Low",
          priority: "P2",
          priorityLabel: "P2 - Should fix soon",
          recommendedOwner: "internal_it_lead",
          ownerLabel: "Internal IT lead",
          timeframe: "days_0_30",
          timeframeLabel: "0-30 days",
          evidenceRequired: ["Access review record"],
          evidenceLabel: "Evidence required",
          portfolioEligibility: "validated",
        },
      ],
    },
    {
      sectionId: 2,
      score: 64,
      status: "warning",
      headline: "Configuration needs review.",
      managementImplication: "Standardise configuration work.",
      summary: "Configuration evidence needs attention.",
      gaps: [{ issue: "Build records", why: "Settings are not evidenced.", priority: "P2" }],
      actions: [
        {
          title: "Approve the secure baseline",
          steps: ["Record the approved baseline."],
          effort: "Low",
          priority: "P1",
          priorityLabel: "P1 - Must fix",
          recommendedOwner: "internal_it_lead",
          ownerLabel: "Internal IT lead",
          timeframe: "days_0_30",
          timeframeLabel: "0-30 days",
          evidenceRequired: ["Baseline approval"],
          evidenceLabel: "Evidence required",
          portfolioEligibility: "validated",
        },
        {
          title: "Schedule hardening work",
          steps: ["Schedule the hardening work."],
          effort: "High",
          priority: "P1",
          priorityLabel: "P1 - Must fix",
          recommendedOwner: "msp_it_provider",
          ownerLabel: "IT provider",
          timeframe: "days_0_30",
          timeframeLabel: "0-30 days",
          evidenceRequired: ["Configuration export"],
          evidenceLabel: "Evidence required",
          portfolioEligibility: "validated",
        },
      ],
    },
    {
      sectionId: 1,
      score: 88,
      status: "pass",
      headline: "Boundary controls are sound.",
      managementImplication: "Keep reviewing firewall rules.",
      summary: "Boundary controls are established.",
      gaps: [{ issue: "Firewall review", why: "Review proof is dated.", priority: "P3" }],
      actions: [],
    },
    {
      sectionId: 4,
      score: 88,
      status: "pass",
      headline: "Malware control is sound.",
      managementImplication: "Maintain malware protection.",
      summary: "Malware protection is established.",
      gaps: [{ issue: "Protection review", why: "Review proof is dated.", priority: "P3" }],
      actions: [
        {
          title: "Record the protection review",
          steps: ["Store the latest review record."],
          effort: "Low",
          priority: "P2",
          priorityLabel: "P2 - Should fix soon",
          recommendedOwner: "operations_compliance",
          ownerLabel: "Operations / compliance",
          timeframe: "days_31_60",
          timeframeLabel: "31-60 days",
          evidenceRequired: ["Protection review record"],
          evidenceLabel: "Evidence required",
          portfolioEligibility: "validated",
        },
      ],
    },
  ],
};

const legacyV1Input: ReportInput = {
  ...mixedV2Input,
  analysisVersion: 1,
  reportHeadline: "Nearly Ready - 5 findings and 4 actions recorded",
  primaryDecision:
    "Review 4 documented actions before deciding when to apply for certification.",
  keyStrengths: [],
  portfolioEligibility: "review_required",
  controls: mixedV2Input.controls.map((control) => ({
    ...control,
    actions: control.actions.map((action) => ({
      title: action.title,
      steps: action.steps,
      effort: action.effort,
      priority: null,
      priorityLabel: "Priority to confirm",
      recommendedOwner: null,
      ownerLabel: "Business owner and IT provider to confirm",
      timeframe: null,
      timeframeLabel: "To confirm",
      evidenceRequired: [],
      evidenceLabel: "Evidence to confirm during action review",
      portfolioEligibility: "review_required" as const,
    })),
  })),
};

type ExtractedTextItem = {
  str: string;
  width: number;
  x: number;
};

type ExtractedPage = {
  text: string;
  items: ExtractedTextItem[];
};

function boundedText(length: number, marker: string): string {
  const prefixLength = length - marker.length - 1;
  const prefix = "bounded executive content "
    .repeat(length)
    .slice(0, prefixLength)
    .replace(/\s$/, "x");
  return `${prefix} ${marker}`;
}

function maximumExecutiveInput(): ReportInput {
  return {
    ...mixedV2Input,
    executiveSummary: boundedText(900, "EXECUTIVE SUMMARY END"),
    primaryDecision: boundedText(320, "PRIMARY DECISION END"),
    keyStrengths: [
      boundedText(240, "STRENGTH ONE END"),
      boundedText(240, "STRENGTH TWO END"),
      boundedText(240, "STRENGTH THREE END"),
    ],
    controls: mixedV2Input.controls.map((control) => ({
      ...control,
      managementImplication: boundedText(
        480,
        `MANAGEMENT IMPLICATION ${control.sectionId} END`
      ),
    })),
  };
}

function normalizedText(items: ExtractedTextItem[]): string {
  return items
    .map((item) => item.str)
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/\s+-([A-Za-z])/g, "-$1");
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
        "str" in item
          ? [{ str: item.str, width: item.width, x: item.transform[4] }]
          : []
      );
      pages.push({ items, text: normalizedText(items) });
    }
    return {
      pages,
      text: pages.map((page) => page.text).join(" "),
    };
  } finally {
    await document.destroy();
  }
}

async function extractExecutiveText(input: ReportInput): Promise<string> {
  const viewModel = buildReportViewModel(input);
  const pdf = await renderToBuffer(
    <Document title="Executive pages fixture">
      <CoverPage input={input} viewModel={viewModel} />
      <ExecutiveReadoutPage input={input} viewModel={viewModel} />
      <ReadinessProfilePage input={input} viewModel={viewModel} />
    </Document>
  );
  return (await extractPdf(pdf)).text;
}

describe("executive report pages", () => {
  test(
    "renders canonical v2 conclusions, validated metrics and the direct-labelled readiness profile",
    async () => {
      const text = await extractExecutiveText(mixedV2Input);

      expect(text).toContain("Address access-control blockers before applying.");
      expect(text).toContain("Example Services Ltd");
      expect(text).toContain("27 July 2026");
      expect(text).toContain("Confidential");
      expect(text).toContain("Report v2");
      expect(text).toContain("77 / 100");
      expect(text).toContain("Nearly Ready");
      expect(text).toContain("2 P1 actions requiring attention");
      expect(text).toContain("3 Quick wins");
      expect(text).toContain("Fund the documented remediation actions.");
      expect(text).toContain("The assessment identifies focused remediation work.");
      expect(text).toContain("Open findings");
      expect(text).toContain("Controls at or above 80");
      expect(text).toContain("Boundary controls are documented.");
      expect(text).toContain("Review access governance.");

      for (const controlName of controlNames) {
        expect(text).toContain(controlName);
      }
      expect(text).toContain("88 / 100 - Pass");
      expect(text).toContain("64 / 100 - Review needed");
      expect(text).toContain("82 / 100 - Pass");
      expect(text).toContain("BrightCert internal 80-point readiness threshold");
      expect(text).toContain("Strongest control");
      expect(text).toContain("Weakest control");
    },
    30_000
  );

  test(
    "keeps the v1 generic conclusion and suppresses unvalidated action metadata",
    async () => {
      const text = await extractExecutiveText(legacyV1Input);

      expect(text).toContain("Nearly Ready - 5 findings and 4 actions recorded");
      expect(text).toContain(
        "Review 4 documented actions before deciding when to apply for certification."
      );
      expect(text).not.toContain("P1 actions requiring attention");
      expect(text).not.toContain("Quick wins");
      expect(text).not.toContain("Priority to confirm");
      expect(text).not.toContain("Business owner and IT provider to confirm");
      expect(text).not.toContain("Evidence to confirm during action review");
    },
    30_000
  );

  test(
    "repeats branding and collision-safe footers on every maximum-length executive page",
    async () => {
      const input = maximumExecutiveInput();
      const viewModel = buildReportViewModel(input);
      const pdf = await renderToBuffer(
        <Document title="Maximum executive readout fixture">
          <ExecutiveReadoutPage input={input} viewModel={viewModel} />
        </Document>
      );
      const extracted = await extractPdf(pdf);

      expect(extracted.pages.length).toBeGreaterThan(1);
      expect(extracted.text).toContain("EXECUTIVE SUMMARY END");
      expect(extracted.text).toContain("PRIMARY DECISION END");
      expect(extracted.text).toContain("STRENGTH THREE END");
      expect(extracted.text).toContain("MANAGEMENT IMPLICATION 5 END");

      for (const page of extracted.pages) {
        expect(page.text).toMatch(/\bBright\s*Cert\b/);

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
    },
    30_000
  );
});
