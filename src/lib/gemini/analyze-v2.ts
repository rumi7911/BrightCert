// Validator for the richer "analysis version 2" report payload.
//
// This is the parser half of the redesigned analysis, lifted out so the
// redesigned report can be typed and tested without changing the live Gemini
// path. It is deliberately NOT wired to `analyzeAssessment`: the v2 parser
// rejects anything whose `analysisVersion` is not 2, so pointing today's
// prompt at it would fail every real analysis.
//
// Nothing in the application produces v2 payloads yet. This module is reached
// only when a stored payload carries `analysis_version: 2` — currently just
// the report fixtures. When the prompt is upgraded to emit the v2 shape, move
// this back into `analyze.ts` (or have `analyzeAssessment` call it) and the
// redesigned report's fuller pages light up with no further change.
import type {
  ActionTimeframe,
  ControlScoreV2,
  ControlStatus,
  GeminiAnalysisV2Result,
  OverallStatus,
  RecommendedOwner,
} from "@/types/assessment";
import { getOverallStatus } from "@/types/assessment";

const ANALYSIS_LIMITS = {
  executiveSummary: 900,
  controlSummary: 600,
  gapsPerControl: 5,
  gapIssue: 240,
  gapWhy: 480,
  remediationPerControl: 5,
  remediationTitle: 200,
  remediationSteps: 6,
  remediationStep: 400,
  reportHeadline: 180,
  primaryDecision: 320,
  keyStrengths: 3,
  keyStrength: 240,
  controlHeadline: 180,
  managementImplication: 480,
  evidenceRequired: 4,
  evidenceItem: 220,
} as const;

function invalidResponse(path: string, reason: string): never {
  throw new Error(`Invalid Gemini response: ${path} ${reason}`);
}

function recordAt(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    invalidResponse(path, "must be an object");
  }
  return value as Record<string, unknown>;
}

function exactKeysAt(
  value: Record<string, unknown>,
  path: string,
  allowed: readonly string[]
): void {
  const unexpectedKey = Object.keys(value).find((key) => !allowed.includes(key));
  if (unexpectedKey) {
    invalidResponse(`${path}.${unexpectedKey}`, "is not supported");
  }
}

function arrayAt(value: unknown, path: string, maxLength: number): unknown[] {
  if (!Array.isArray(value) || value.length > maxLength) {
    invalidResponse(path, `must be an array with at most ${maxLength} items`);
  }
  return value;
}

function textAt(
  value: unknown,
  path: string,
  maxLength: number
): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > maxLength
  ) {
    invalidResponse(
      path,
      `must be non-empty text no longer than ${maxLength} characters`
    );
  }
  return value.trim();
}

function scoreAt(value: unknown, path: string): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 100
  ) {
    invalidResponse(path, "must be a number from 0 to 100");
  }
  return value;
}

function enumAt<T extends string>(
  value: unknown,
  path: string,
  allowed: readonly T[]
): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    invalidResponse(path, `must be one of ${allowed.join(", ")}`);
  }
  return value as T;
}

function controlStatusFor(score: number): ControlStatus {
  if (score >= 80) return "pass";
  if (score >= 60) return "warning";
  return "fail";
}

function controlAt(value: unknown, index: number): ControlScoreV2 {
  const path = `controls[${index}]`;
  const control = recordAt(value, path);
  exactKeysAt(control, path, [
    "sectionId",
    "score",
    "status",
    "headline",
    "managementImplication",
    "summary",
    "gaps",
    "remediation",
  ]);
  const sectionId = control.sectionId;
  if (
    typeof sectionId !== "number" ||
    ![1, 2, 3, 4, 5].includes(sectionId)
  ) {
    invalidResponse(`${path}.sectionId`, "must be 1, 2, 3, 4, or 5");
  }

  const gaps = arrayAt(
    control.gaps,
    `${path}.gaps`,
    ANALYSIS_LIMITS.gapsPerControl
  ).map((value, gapIndex) => {
    const gapPath = `${path}.gaps[${gapIndex}]`;
    const gap = recordAt(value, gapPath);
    exactKeysAt(gap, gapPath, ["issue", "why", "priority"]);
    return {
      issue: textAt(
        gap.issue,
        `${gapPath}.issue`,
        ANALYSIS_LIMITS.gapIssue
      ),
      why: textAt(gap.why, `${gapPath}.why`, ANALYSIS_LIMITS.gapWhy),
      priority: enumAt(gap.priority, `${gapPath}.priority`, [
        "P1",
        "P2",
        "P3",
      ] as const),
    };
  });
  const remediation = arrayAt(
    control.remediation,
    `${path}.remediation`,
    ANALYSIS_LIMITS.remediationPerControl
  ).map((value, remediationIndex) => {
    const remediationPath = `${path}.remediation[${remediationIndex}]`;
    const item = recordAt(value, remediationPath);
    exactKeysAt(item, remediationPath, [
      "title",
      "steps",
      "effort",
      "priority",
      "recommendedOwner",
      "timeframe",
      "evidenceRequired",
    ]);
    return {
      title: textAt(
        item.title,
        `${remediationPath}.title`,
        ANALYSIS_LIMITS.remediationTitle
      ),
      steps: (() => {
        const steps = arrayAt(
          item.steps,
          `${remediationPath}.steps`,
          ANALYSIS_LIMITS.remediationSteps
        );
        if (steps.length === 0) {
          invalidResponse(
            `${remediationPath}.steps`,
            "must contain at least 1 item"
          );
        }
        return steps.map((step, stepIndex) =>
          textAt(
            step,
            `${remediationPath}.steps[${stepIndex}]`,
            ANALYSIS_LIMITS.remediationStep
          )
        );
      })(),
      effort: enumAt(item.effort, `${remediationPath}.effort`, [
        "Low",
        "Medium",
        "High",
      ] as const),
      priority: enumAt(item.priority, `${remediationPath}.priority`, [
        "P1",
        "P2",
        "P3",
      ] as const),
      recommendedOwner: enumAt<RecommendedOwner>(
        item.recommendedOwner,
        `${remediationPath}.recommendedOwner`,
        [
          "business_owner_director",
          "internal_it_lead",
          "msp_it_provider",
          "operations_compliance",
          "hr_people",
          "shared_business_it",
        ]
      ),
      timeframe: enumAt<ActionTimeframe>(
        item.timeframe,
        `${remediationPath}.timeframe`,
        ["days_0_30", "days_31_60", "days_61_90", "ongoing"]
      ),
      evidenceRequired: (() => {
        const evidence = arrayAt(
          item.evidenceRequired,
          `${remediationPath}.evidenceRequired`,
          ANALYSIS_LIMITS.evidenceRequired
        );
        if (evidence.length === 0) {
          invalidResponse(
            `${remediationPath}.evidenceRequired`,
            "must contain at least 1 item"
          );
        }
        return evidence.map((evidenceItem, evidenceIndex) =>
          textAt(
            evidenceItem,
            `${remediationPath}.evidenceRequired[${evidenceIndex}]`,
            ANALYSIS_LIMITS.evidenceItem
          )
        );
      })(),
    };
  });

  const score = scoreAt(control.score, `${path}.score`);
  const status = enumAt<ControlStatus>(control.status, `${path}.status`, [
    "pass",
    "warning",
    "fail",
  ]);
  if (status !== controlStatusFor(score)) {
    invalidResponse(`${path}.status`, "must match the control score");
  }

  return {
    sectionId: sectionId as ControlScoreV2["sectionId"],
    score,
    status,
    headline: textAt(
      control.headline,
      `${path}.headline`,
      ANALYSIS_LIMITS.controlHeadline
    ),
    managementImplication: textAt(
      control.managementImplication,
      `${path}.managementImplication`,
      ANALYSIS_LIMITS.managementImplication
    ),
    summary: textAt(
      control.summary,
      `${path}.summary`,
      ANALYSIS_LIMITS.controlSummary
    ),
    gaps,
    remediation,
  };
}

export function parseGeminiAnalysisResult(
  value: unknown
): GeminiAnalysisV2Result {
  const result = recordAt(value, "response");
  exactKeysAt(result, "response", [
    "analysisVersion",
    "reportHeadline",
    "executiveSummary",
    "primaryDecision",
    "keyStrengths",
    "overallScore",
    "overallStatus",
    "controls",
  ]);
  if (result.analysisVersion !== 2) {
    invalidResponse("analysisVersion", "must be 2");
  }
  if (!Array.isArray(result.controls) || result.controls.length !== 5) {
    invalidResponse("controls", "must contain exactly five control areas");
  }
  const controls = result.controls.map(controlAt);
  if (new Set(controls.map((control) => control.sectionId)).size !== 5) {
    invalidResponse("controls", "must contain each control area exactly once");
  }

  const overallScore = scoreAt(result.overallScore, "overallScore");
  const overallStatus = enumAt<OverallStatus>(
    result.overallStatus,
    "overallStatus",
    ["ready", "nearly_ready", "needs_fixes", "not_ready"]
  );
  if (overallStatus !== getOverallStatus(overallScore)) {
    invalidResponse("overallStatus", "must match the overall score");
  }

  return {
    analysisVersion: 2,
    reportHeadline: textAt(
      result.reportHeadline,
      "reportHeadline",
      ANALYSIS_LIMITS.reportHeadline
    ),
    primaryDecision: textAt(
      result.primaryDecision,
      "primaryDecision",
      ANALYSIS_LIMITS.primaryDecision
    ),
    keyStrengths: arrayAt(
      result.keyStrengths,
      "keyStrengths",
      ANALYSIS_LIMITS.keyStrengths
    ).map((strength, index) =>
      textAt(strength, `keyStrengths[${index}]`, ANALYSIS_LIMITS.keyStrength)
    ),
    controls,
    overallScore,
    overallStatus,
    executiveSummary: textAt(
      result.executiveSummary,
      "executiveSummary",
      ANALYSIS_LIMITS.executiveSummary
    ),
  };
}
