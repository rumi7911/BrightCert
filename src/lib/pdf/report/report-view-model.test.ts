import { describe, expect, test } from "vitest";
import type { ReportInput } from "./report-types";
import { buildReportViewModel } from "./report-view-model";

const mixedV2Input: ReportInput = {
  orgName: "Example Services Ltd",
  generatedAt: "2026-07-27T12:00:00.000Z",
  analysisVersion: 2,
  reportHeadline: "Address access-control blockers before applying.",
  executiveSummary: "The assessment identifies focused remediation work.",
  primaryDecision: "Fund the documented remediation actions.",
  keyStrengths: ["Boundary controls are documented."],
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
      actions: [
        {
          title: "Later quick win",
          steps: ["Confirm the review cadence."],
          effort: "Low",
          priority: "P2",
          priorityLabel: "P2 — Should fix soon",
          recommendedOwner: "operations_compliance",
          ownerLabel: "Operations / compliance",
          timeframe: "days_31_60",
          timeframeLabel: "31–60 days",
          evidenceRequired: ["Review schedule"],
          evidenceLabel: "Evidence required",
          portfolioEligibility: "validated",
        },
      ],
    },
    {
      sectionId: 3,
      score: 64,
      status: "warning",
      headline: "Access needs review.",
      managementImplication: "Review access governance.",
      summary: "Access control needs attention.",
      gaps: [
        { issue: "Dormant accounts", why: "Access can persist.", priority: "P1" },
        { issue: "Access review", why: "Reviews are incomplete.", priority: "P3" },
      ],
      actions: [],
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
          title: "Blocker high",
          steps: ["Schedule the hardening work."],
          effort: "High",
          priority: "P1",
          priorityLabel: "P1 — Must fix",
          recommendedOwner: "internal_it_lead",
          ownerLabel: "Internal IT lead",
          timeframe: "days_0_30",
          timeframeLabel: "0–30 days",
          evidenceRequired: ["Shared configuration record"],
          evidenceLabel: "Evidence required",
          portfolioEligibility: "validated",
        },
        {
          title: "Scheduled low",
          steps: ["Record the approved baseline."],
          effort: "Low",
          priority: "P2",
          priorityLabel: "P2 — Should fix soon",
          recommendedOwner: "operations_compliance",
          ownerLabel: "Operations / compliance",
          timeframe: "days_31_60",
          timeframeLabel: "31–60 days",
          evidenceRequired: [
            "Shared configuration record",
            "shared configuration record",
          ],
          evidenceLabel: "Evidence required",
          portfolioEligibility: "validated",
        },
        {
          title: "Blocker low",
          steps: ["Approve the baseline."],
          effort: "Low",
          priority: "P1",
          priorityLabel: "P1 — Must fix",
          recommendedOwner: "internal_it_lead",
          ownerLabel: "Internal IT lead",
          timeframe: "days_0_30",
          timeframeLabel: "0–30 days",
          evidenceRequired: [
            "Baseline approval",
            "Shared configuration record",
          ],
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
      gaps: [{ issue: "Firewall review", why: "Review proof is dated.", priority: "P1" }],
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
      actions: [],
    },
  ],
};

const legacyV1Input: ReportInput = {
  ...mixedV2Input,
  analysisVersion: 1,
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

describe("buildReportViewModel", () => {
  test("derives decision metrics and readiness ties from canonical v2 input", () => {
    const model = buildReportViewModel(mixedV2Input);

    expect(model.metrics).toEqual({
      p1ActionCount: 2,
      quickWinCount: 3,
      findingCount: 6,
      controlsAtThreshold: 3,
    });
    expect(model.readinessProfile.strongest.sectionId).toBe(1);
    expect(model.readinessProfile.weakest.sectionId).toBe(2);
    expect(model.readinessProfile.rows).toEqual([
      expect.objectContaining({ sectionId: 1, score: 88, thresholdDelta: -8 }),
      expect.objectContaining({ sectionId: 2, score: 64, thresholdDelta: 16 }),
      expect.objectContaining({ sectionId: 3, score: 64, thresholdDelta: 16 }),
      expect.objectContaining({ sectionId: 4, score: 88, thresholdDelta: -8 }),
      expect.objectContaining({ sectionId: 5, score: 82, thresholdDelta: -2 }),
    ]);
  });

  test("derives risk, validated portfolio coordinates, roadmap, register and evidence deterministically", () => {
    const model = buildReportViewModel(mixedV2Input);

    expect(model.riskConcentration).toEqual([
      expect.objectContaining({ sectionId: 1, p1Count: 1, p2Count: 0, p3Count: 0 }),
      expect.objectContaining({ sectionId: 2, p1Count: 0, p2Count: 1, p3Count: 0 }),
      expect.objectContaining({ sectionId: 3, p1Count: 1, p2Count: 0, p3Count: 1 }),
      expect.objectContaining({ sectionId: 4, p1Count: 0, p2Count: 0, p3Count: 1 }),
      expect.objectContaining({ sectionId: 5, p1Count: 0, p2Count: 1, p3Count: 0 }),
    ]);
    expect(model.actionPortfolio).toEqual({
      eligibility: "validated",
      points: [
        expect.objectContaining({ title: "Blocker low", priority: "P1", effort: "Low" }),
        expect.objectContaining({ title: "Blocker high", priority: "P1", effort: "High" }),
        expect.objectContaining({ title: "Later quick win", priority: "P2", effort: "Low" }),
        expect.objectContaining({ title: "Scheduled low", priority: "P2", effort: "Low" }),
      ],
    });
    expect(model.roadmap.days_0_30.actions.map((action) => action.title)).toEqual([
      "Blocker low",
      "Blocker high",
    ]);
    expect(model.roadmap.days_31_60.actions.map((action) => action.title)).toEqual([
      "Later quick win",
      "Scheduled low",
    ]);
    expect(model.roadmap.days_61_90.actions).toEqual([]);
    expect(model.roadmap.ongoing.actions).toEqual([]);
    expect(model.actionRegister.map((row) => row.title)).toEqual([
      "Blocker low",
      "Blocker high",
      "Later quick win",
      "Scheduled low",
    ]);
    expect(model.evidenceGroups).toEqual([
      expect.objectContaining({
        timeframe: "days_0_30",
        sectionId: 2,
        evidence: ["Baseline approval", "Shared configuration record"],
      }),
      expect.objectContaining({
        timeframe: "days_31_60",
        sectionId: 2,
        evidence: ["Shared configuration record", "shared configuration record"],
      }),
      expect.objectContaining({
        timeframe: "days_31_60",
        sectionId: 5,
        evidence: ["Review schedule"],
      }),
    ]);
  });

  test("keeps legacy action metadata in review and does not plot unvalidated actions", () => {
    const model = buildReportViewModel(legacyV1Input);

    expect(model.actionPortfolio).toEqual({ eligibility: "review_required", points: [] });
    expect(model.roadmap.days_0_30.actions).toEqual([]);
    expect(model.actionRegister.map((row) => row.priority)).toEqual([
      null,
      null,
      null,
      null,
    ]);
    expect(model.evidenceGroups).toEqual([]);
  });
});
