import { describe, expect, test } from "vitest";
import {
  PersistedReportPayloadError,
  parsePersistedReportPayload,
} from "./report-payload";

function legacyPersistedPayload() {
  return {
    org_name: "Legacy Example Ltd",
    executive_summary: "The business should address its remaining gaps before applying.",
    overall_score: 60,
    overall_status: "nearly_ready",
    control_scores: [1, 2, 3, 4, 5].map((sectionId) => ({
      section_id: sectionId,
      score: 60,
      status: "warning",
      summary: `Control ${sectionId} needs a documented review.`,
      gaps: [
        {
          issue: `Control ${sectionId} needs evidence.`,
          why: "Evidence demonstrates the control is operating.",
          priority: "P1",
        },
      ],
      remediation: [
        {
          title: `Document control ${sectionId}`,
          steps: ["Assign an owner", "Record the evidence"],
          effort: "Medium",
        },
      ],
    })),
  };
}

describe("persisted legacy report payload validation", () => {
  test("preserves v1 facts and exposes only explicit review-required action labels", () => {
    const parsed = parsePersistedReportPayload(legacyPersistedPayload());

    expect(parsed).toMatchObject({
      orgName: "Legacy Example Ltd",
      analysisVersion: 1,
      executiveSummary:
        "The business should address its remaining gaps before applying.",
      overallScore: 60,
      overallStatus: "nearly_ready",
      portfolioEligibility: "review_required",
    });
    expect(parsed.controls).toHaveLength(5);
    expect(parsed.controls[0]).toEqual({
      sectionId: 1,
      score: 60,
      status: "warning",
      headline: "Review needed — 1 finding and 1 action recorded",
      managementImplication:
        "Review the recorded finding and action before making a certification decision.",
      summary: "Control 1 needs a documented review.",
      gaps: [
        {
          issue: "Control 1 needs evidence.",
          why: "Evidence demonstrates the control is operating.",
          priority: "P1",
        },
      ],
      actions: [
        {
          title: "Document control 1",
          steps: ["Assign an owner", "Record the evidence"],
          effort: "Medium",
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
      ],
    });
    expect(parsed.controls[0]?.actions[0]?.priorityLabel).toBe(
      "Priority to confirm"
    );
    expect(parsed.controls[0]?.actions[0]?.title).toBe("Document control 1");
    expect(parsed.controls[0]?.actions[0]?.steps).toEqual([
      "Assign an owner",
      "Record the evidence",
    ]);
    expect(parsed.controls[0]?.actions[0]?.effort).toBe("Medium");
    expect(parsed.controls[0]?.actions[0]?.ownerLabel).toBe(
      "Business owner and IT provider to confirm"
    );
    expect(parsed.controls[0]?.actions[0]?.timeframeLabel).toBe("To confirm");
    expect(parsed.controls[0]?.actions[0]?.evidenceLabel).toBe(
      "Evidence to confirm during action review"
    );
  });

  test("keeps the public persistence error at the compatibility boundary", () => {
    expect(() =>
      parsePersistedReportPayload({
        ...legacyPersistedPayload(),
        overall_score: 101,
      })
    ).toThrow(PersistedReportPayloadError);
  });
});
