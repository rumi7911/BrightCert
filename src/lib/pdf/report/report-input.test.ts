import { describe, expect, test } from "vitest";
import {
  PersistedReportPayloadError,
  parsePersistedReportInput,
} from "./report-input";

const generatedAt = "2026-07-27T12:00:00.000Z";

function completeV2PersistedRow() {
  return {
    org_name: "Boundary Example Ltd",
    analysis_version: 2,
    report_insights: {
      reportHeadline:
        "Good foundations, with access governance still blocking readiness",
      primaryDecision:
        "Fund access-control work before scheduling certification.",
      keyStrengths: [
        "Boundary firewalls are configured and reviewed.",
        "Security updates follow a documented cadence.",
      ],
    },
    executive_summary:
      "The organisation has a credible technical baseline, but should close its remaining evidence gaps.",
    overall_score: 68,
    overall_status: "nearly_ready",
    control_scores: [1, 2, 3, 4, 5].map((sectionId) => ({
      id: `stored-control-${sectionId}`,
      assessment_id: "stored-assessment",
      section_id: sectionId,
      score: sectionId === 1 ? 82 : 68,
      status: sectionId === 1 ? "pass" : "warning",
      headline: `Control ${sectionId} has a clear management outcome`,
      management_implication: `Management implication for control ${sectionId}.`,
      summary: `Control ${sectionId} summary.`,
      gaps:
        sectionId === 2
          ? [
              {
                issue: "Build records are incomplete",
                why: "The standard cannot be verified consistently.",
                priority: "P2",
              },
            ]
          : [],
      remediation:
        sectionId === 2
          ? [
              {
                title: "Standardise build records",
                steps: ["Adopt one checklist", "Review a monthly sample"],
                effort: "Low",
                priority: "P2",
                recommendedOwner: "internal_it_lead",
                timeframe: "days_31_60",
                evidenceRequired: [
                  "Approved checklist",
                  "Monthly sample record",
                ],
              },
            ]
          : [],
    })),
  };
}

function legacyPersistedRowWithEmptySteps() {
  return {
    org_name: "Legacy Boundary Ltd",
    analysis_version: 1,
    executive_summary:
      "This historical analysis predates explicit action metadata.",
    overall_score: 60,
    overall_status: "nearly_ready",
    control_scores: [1, 2, 3, 4, 5].map((sectionId) => ({
      section_id: sectionId,
      score: 60,
      status: "warning",
      summary: `Legacy control ${sectionId} summary.`,
      gaps: [],
      remediation:
        sectionId === 1
          ? [
              {
                title: "Confirm the historical action scope",
                steps: [],
                effort: "Low",
              },
            ]
          : [],
    })),
  };
}

describe("persisted report input parsing", () => {
  test("maps a complete explicit v2 row into renderer-safe canonical input", () => {
    const parsed = parsePersistedReportInput(
      completeV2PersistedRow(),
      generatedAt
    );

    expect(parsed).toEqual({
      orgName: "Boundary Example Ltd",
      generatedAt,
      analysisVersion: 2,
      reportHeadline:
        "Good foundations, with access governance still blocking readiness",
      executiveSummary:
        "The organisation has a credible technical baseline, but should close its remaining evidence gaps.",
      primaryDecision:
        "Fund access-control work before scheduling certification.",
      keyStrengths: [
        "Boundary firewalls are configured and reviewed.",
        "Security updates follow a documented cadence.",
      ],
      overallScore: 68,
      overallStatus: "nearly_ready",
      portfolioEligibility: "validated",
      controls: [
        {
          sectionId: 1,
          score: 82,
          status: "pass",
          headline: "Control 1 has a clear management outcome",
          managementImplication: "Management implication for control 1.",
          summary: "Control 1 summary.",
          gaps: [],
          actions: [],
        },
        {
          sectionId: 2,
          score: 68,
          status: "warning",
          headline: "Control 2 has a clear management outcome",
          managementImplication: "Management implication for control 2.",
          summary: "Control 2 summary.",
          gaps: [
            {
              issue: "Build records are incomplete",
              why: "The standard cannot be verified consistently.",
              priority: "P2",
            },
          ],
          actions: [
            {
              title: "Standardise build records",
              steps: ["Adopt one checklist", "Review a monthly sample"],
              effort: "Low",
              priority: "P2",
              priorityLabel: "P2 — Should fix soon",
              recommendedOwner: "internal_it_lead",
              ownerLabel: "Internal IT lead",
              timeframe: "days_31_60",
              timeframeLabel: "31–60 days",
              evidenceRequired: [
                "Approved checklist",
                "Monthly sample record",
              ],
              evidenceLabel: "Evidence required",
              portfolioEligibility: "validated",
            },
          ],
        },
        ...[3, 4, 5].map((sectionId) => ({
          sectionId,
          score: 68,
          status: "warning" as const,
          headline: `Control ${sectionId} has a clear management outcome`,
          managementImplication: `Management implication for control ${sectionId}.`,
          summary: `Control ${sectionId} summary.`,
          gaps: [],
          actions: [],
        })),
      ],
    });
  });

  test("fails closed when an explicit v2 row omits required action evidence", () => {
    const brokenV2 = completeV2PersistedRow();
    const action = brokenV2.control_scores[1]?.remediation[0];
    if (!action) {
      throw new Error("fixture action is required");
    }
    action.evidenceRequired = [];

    expect(() => parsePersistedReportInput(brokenV2, generatedAt)).toThrow(
      PersistedReportPayloadError
    );
  });

  test("preserves legacy v1 actions that did not record implementation steps", () => {
    const parsed = parsePersistedReportInput(
      legacyPersistedRowWithEmptySteps(),
      generatedAt
    );

    expect(parsed.controls[0]!.actions[0]).toMatchObject({
      title: "Confirm the historical action scope",
      steps: [],
      portfolioEligibility: "review_required",
    });
  });

  test("rejects a persisted null analysis version instead of treating it as v1", () => {
    const persisted = {
      ...completeV2PersistedRow(),
      analysis_version: null,
    };

    expect(() => parsePersistedReportInput(persisted, generatedAt)).toThrow(
      PersistedReportPayloadError
    );
  });
});
