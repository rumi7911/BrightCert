// @vitest-environment node

import { describe, expect, test } from "vitest";
import { parsePersistedReportInput } from "./report/report-input";
import { renderValidatedReport } from "./render-report";

const GENERATED_AT = "2026-07-27T12:00:00.000Z";

function persistedControls(analysisVersion: 1 | 2) {
  return [1, 2, 3, 4, 5].map((sectionId) => ({
    section_id: sectionId,
    score: 68,
    status: "warning",
    ...(analysisVersion === 2
      ? {
          headline: `Control ${sectionId} requires delivery`,
          management_implication: `Management implication for control ${sectionId}.`,
        }
      : {}),
    summary: `Control ${sectionId} summary.`,
    gaps: [
      {
        issue: `Control ${sectionId} evidence is incomplete`,
        why: "The control cannot be verified consistently.",
        priority: "P2",
      },
    ],
    remediation: [
      {
        title: `Complete control ${sectionId} evidence`,
        steps: ["Adopt one checklist"],
        effort: "Low",
        ...(analysisVersion === 2
          ? {
              priority: "P2",
              recommendedOwner: "internal_it_lead",
              timeframe: "days_31_60",
              evidenceRequired: [`Approved control ${sectionId} checklist`],
            }
          : {}),
      },
    ],
  }));
}

function parserProducedV2Input() {
  return parsePersistedReportInput(
    {
      org_name: "Validated Boundary Ltd",
      analysis_version: 2,
      report_insights: {
        reportHeadline: "Complete evidence before applying.",
        primaryDecision: "Fund the documented work.",
        keyStrengths: ["Boundary controls are established."],
      },
      executive_summary:
        "The organisation has focused readiness work remaining.",
      overall_score: 68,
      overall_status: "nearly_ready",
      control_scores: persistedControls(2),
    },
    GENERATED_AT
  );
}

function parserProducedV1Input() {
  return parsePersistedReportInput(
    {
      org_name: "Legacy Boundary Ltd",
      executive_summary:
        "The organisation should review the recorded actions.",
      overall_score: 68,
      overall_status: "nearly_ready",
      control_scores: persistedControls(1),
    },
    GENERATED_AT
  );
}

describe("renderValidatedReport", () => {
  test(
    "renders a complete parser-produced v2 ReportInput to a Buffer",
    async () => {
      await expect(
        renderValidatedReport(parserProducedV2Input())
      ).resolves.toBeInstanceOf(Buffer);
    },
    60_000
  );

  test(
    "renders a legacy parser-produced v1 ReportInput to a Buffer",
    async () => {
      await expect(
        renderValidatedReport(parserProducedV1Input())
      ).resolves.toBeInstanceOf(Buffer);
    },
    60_000
  );
});
