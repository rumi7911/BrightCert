import { parseGeminiAnalysisResult } from "@/lib/gemini/analyze-v2";
import type {
  ControlStatus,
  OverallStatus,
  RecommendedOwner,
  ActionTimeframe,
} from "@/types/assessment";
import type {
  ReportActionInput,
  ReportControlInput,
  ReportInput,
  ReportPriority,
} from "./report-types";

const MAX_ORGANISATION_NAME_LENGTH = 160;
const MAX_GENERATED_AT_LENGTH = 64;

const LEGACY_ANALYSIS_LIMITS = {
  executiveSummary: 900,
  controlSummary: 600,
  gapsPerControl: 5,
  gapIssue: 240,
  gapWhy: 480,
  remediationPerControl: 5,
  remediationTitle: 200,
  remediationSteps: 6,
  remediationStep: 400,
} as const;

const PRIORITY_LABELS: Record<ReportPriority, string> = {
  P1: "P1 — Must fix",
  P2: "P2 — Should fix soon",
  P3: "P3 — Worth addressing",
};

const OWNER_LABELS: Record<RecommendedOwner, string> = {
  business_owner_director: "Business owner / director",
  internal_it_lead: "Internal IT lead",
  msp_it_provider: "MSP / IT provider",
  operations_compliance: "Operations / compliance",
  hr_people: "HR / people",
  shared_business_it: "Business owner and IT provider",
};

const TIMEFRAME_LABELS: Record<ActionTimeframe, string> = {
  days_0_30: "0–30 days",
  days_31_60: "31–60 days",
  days_61_90: "61–90 days",
  ongoing: "Ongoing",
};

const OVERALL_STATUS_LABELS: Record<OverallStatus, string> = {
  ready: "Ready",
  nearly_ready: "Nearly ready",
  needs_fixes: "Needs fixes",
  not_ready: "Not ready",
};

const CONTROL_STATUS_LABELS: Record<ControlStatus, string> = {
  pass: "Pass",
  warning: "Review needed",
  fail: "Needs work",
};

export class PersistedReportPayloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PersistedReportPayloadError";
  }
}

function recordAt(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
  return value as Record<string, unknown>;
}

function exactKeysAt(
  value: Record<string, unknown>,
  path: string,
  allowed: readonly string[]
): void {
  const unexpectedKey = Object.keys(value).find(
    (key) => !allowed.includes(key)
  );
  if (unexpectedKey) {
    throw new Error(`${path}.${unexpectedKey} is not supported`);
  }
}

function organisationNameAt(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > MAX_ORGANISATION_NAME_LENGTH
  ) {
    throw new Error(
      `org_name must be non-empty text no longer than ${MAX_ORGANISATION_NAME_LENGTH} characters`
    );
  }
  return value.trim();
}

function generatedAtValue(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > MAX_GENERATED_AT_LENGTH
  ) {
    throw new Error(
      `generatedAt must be non-empty text no longer than ${MAX_GENERATED_AT_LENGTH} characters`
    );
  }
  return value.trim();
}

function arrayAt(value: unknown, path: string, maxLength: number): unknown[] {
  if (!Array.isArray(value) || value.length > maxLength) {
    throw new Error(`${path} must be an array with at most ${maxLength} items`);
  }
  return value;
}

function textAt(value: unknown, path: string, maxLength: number): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > maxLength
  ) {
    throw new Error(
      `${path} must be non-empty text no longer than ${maxLength} characters`
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
    throw new Error(`${path} must be a number from 0 to 100`);
  }
  return value;
}

function enumAt<T extends string>(
  value: unknown,
  path: string,
  allowed: readonly T[]
): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new Error(`${path} must be one of ${allowed.join(", ")}`);
  }
  return value as T;
}

function sectionIdAt(
  value: unknown,
  path: string
): ReportControlInput["sectionId"] {
  if (typeof value !== "number" || ![1, 2, 3, 4, 5].includes(value)) {
    throw new Error(`${path} must be 1, 2, 3, 4, or 5`);
  }
  return value as ReportControlInput["sectionId"];
}

function plural(count: number, singular: string): string {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

function recordedItem(count: number, singular: string): string {
  return count === 1 ? singular : plural(count, singular);
}

function recordedItems(findingCount: number, actionCount: number): string {
  const items = [
    findingCount > 0 ? recordedItem(findingCount, "finding") : null,
    actionCount > 0 ? recordedItem(actionCount, "action") : null,
  ].filter((item): item is string => item !== null);

  return items.length === 0 ? "assessment" : items.join(" and ");
}

function legacyActionAt(
  value: unknown,
  controlIndex: number,
  actionIndex: number
): ReportActionInput {
  const path = `control_scores[${controlIndex}].remediation[${actionIndex}]`;
  const action = recordAt(value, path);

  return {
    title: textAt(
      action.title,
      `${path}.title`,
      LEGACY_ANALYSIS_LIMITS.remediationTitle
    ),
    steps: arrayAt(
      action.steps,
      `${path}.steps`,
      LEGACY_ANALYSIS_LIMITS.remediationSteps
    ).map((step, stepIndex) =>
      textAt(
        step,
        `${path}.steps[${stepIndex}]`,
        LEGACY_ANALYSIS_LIMITS.remediationStep
      )
    ),
    effort: enumAt(action.effort, `${path}.effort`, [
      "Low",
      "Medium",
      "High",
    ] as const),
    priority: null,
    priorityLabel: "Priority to confirm",
    recommendedOwner: null,
    ownerLabel: "Business owner and IT provider to confirm",
    timeframe: null,
    timeframeLabel: "To confirm",
    evidenceRequired: [],
    evidenceLabel: "Evidence to confirm during action review",
    portfolioEligibility: "review_required",
  };
}

function legacyControlAt(value: unknown, index: number): ReportControlInput {
  const path = `control_scores[${index}]`;
  const control = recordAt(value, path);
  const gaps = arrayAt(
    control.gaps,
    `${path}.gaps`,
    LEGACY_ANALYSIS_LIMITS.gapsPerControl
  ).map((value, gapIndex) => {
    const gapPath = `${path}.gaps[${gapIndex}]`;
    const gap = recordAt(value, gapPath);
    return {
      issue: textAt(
        gap.issue,
        `${gapPath}.issue`,
        LEGACY_ANALYSIS_LIMITS.gapIssue
      ),
      why: textAt(gap.why, `${gapPath}.why`, LEGACY_ANALYSIS_LIMITS.gapWhy),
      priority: enumAt(gap.priority, `${gapPath}.priority`, [
        "P1",
        "P2",
        "P3",
      ] as const),
    };
  });
  const actions = arrayAt(
    control.remediation,
    `${path}.remediation`,
    LEGACY_ANALYSIS_LIMITS.remediationPerControl
  ).map((action, actionIndex) => legacyActionAt(action, index, actionIndex));
  const status = enumAt<ControlStatus>(control.status, `${path}.status`, [
    "pass",
    "warning",
    "fail",
  ]);

  return {
    sectionId: sectionIdAt(control.section_id, `${path}.section_id`),
    score: scoreAt(control.score, `${path}.score`),
    status,
    headline: `${CONTROL_STATUS_LABELS[status]} — ${plural(
      gaps.length,
      "finding"
    )} and ${plural(actions.length, "action")} recorded`,
    managementImplication: `Review the recorded ${recordedItems(
      gaps.length,
      actions.length
    )} before making a certification decision.`,
    summary: textAt(
      control.summary,
      `${path}.summary`,
      LEGACY_ANALYSIS_LIMITS.controlSummary
    ),
    gaps,
    actions,
  };
}

function validateFiveControls<T extends { sectionId: number }>(
  controls: T[]
): void {
  if (controls.length !== 5) {
    throw new Error("control_scores must contain exactly five control areas");
  }
  if (new Set(controls.map((control) => control.sectionId)).size !== 5) {
    throw new Error("control_scores must contain each control area exactly once");
  }
}

function parseLegacyPayload(
  payload: Record<string, unknown>
): Omit<ReportInput, "generatedAt"> {
  const storedControls = payload.control_scores;
  if (!Array.isArray(storedControls)) {
    throw new Error("control_scores must be an array");
  }
  const controls = storedControls.map(legacyControlAt);
  validateFiveControls(controls);

  const overallStatus = enumAt<OverallStatus>(
    payload.overall_status,
    "overall_status",
    ["ready", "nearly_ready", "needs_fixes", "not_ready"]
  );
  const totalFindings = controls.reduce(
    (count, control) => count + control.gaps.length,
    0
  );
  const totalActions = controls.reduce(
    (count, control) => count + control.actions.length,
    0
  );

  return {
    orgName: organisationNameAt(payload.org_name),
    analysisVersion: 1,
    reportHeadline: `${OVERALL_STATUS_LABELS[overallStatus]} — ${plural(
      totalFindings,
      "finding"
    )} and ${plural(totalActions, "action")} recorded`,
    executiveSummary: textAt(
      payload.executive_summary,
      "executive_summary",
      LEGACY_ANALYSIS_LIMITS.executiveSummary
    ),
    primaryDecision:
      totalActions === 0
        ? "Review the assessment findings before deciding when to apply for certification."
        : `Review ${plural(
            totalActions,
            "documented action"
          )} before deciding when to apply for certification.`,
    keyStrengths: [],
    overallScore: scoreAt(payload.overall_score, "overall_score"),
    overallStatus,
    portfolioEligibility: "review_required",
    controls,
  };
}

function parseV2Payload(
  payload: Record<string, unknown>
): Omit<ReportInput, "generatedAt"> {
  const insights = recordAt(payload.report_insights, "report_insights");
  exactKeysAt(insights, "report_insights", [
    "reportHeadline",
    "primaryDecision",
    "keyStrengths",
  ]);
  if (!Array.isArray(payload.control_scores)) {
    throw new Error("control_scores must be an array");
  }

  const parsed = parseGeminiAnalysisResult({
    analysisVersion: 2,
    reportHeadline: insights.reportHeadline,
    executiveSummary: payload.executive_summary,
    primaryDecision: insights.primaryDecision,
    keyStrengths: insights.keyStrengths,
    overallScore: payload.overall_score,
    overallStatus: payload.overall_status,
    controls: payload.control_scores.map((value, index) => {
      const path = `control_scores[${index}]`;
      const control = recordAt(value, path);
      return {
        sectionId: control.section_id,
        score: control.score,
        status: control.status,
        headline: control.headline,
        managementImplication: control.management_implication,
        summary: control.summary,
        gaps: control.gaps,
        remediation: control.remediation,
      };
    }),
  });

  return {
    orgName: organisationNameAt(payload.org_name),
    analysisVersion: 2,
    reportHeadline: parsed.reportHeadline,
    executiveSummary: parsed.executiveSummary,
    primaryDecision: parsed.primaryDecision,
    keyStrengths: parsed.keyStrengths,
    overallScore: parsed.overallScore,
    overallStatus: parsed.overallStatus,
    portfolioEligibility: "validated",
    controls: parsed.controls.map((control) => ({
      sectionId: control.sectionId,
      score: control.score,
      status: control.status,
      headline: control.headline,
      managementImplication: control.managementImplication,
      summary: control.summary,
      gaps: control.gaps,
      actions: control.remediation.map((action) => ({
        title: action.title,
        steps: action.steps,
        effort: action.effort,
        priority: action.priority,
        priorityLabel: PRIORITY_LABELS[action.priority],
        recommendedOwner: action.recommendedOwner,
        ownerLabel: OWNER_LABELS[action.recommendedOwner],
        timeframe: action.timeframe,
        timeframeLabel: TIMEFRAME_LABELS[action.timeframe],
        evidenceRequired: action.evidenceRequired,
        evidenceLabel: "Evidence required",
        portfolioEligibility: "validated",
      })),
    })),
  };
}

function parsePersistedReportPayloadValue(
  value: unknown
): Omit<ReportInput, "generatedAt"> {
  try {
    const payload = recordAt(value, "report payload");
    const analysisVersion = payload.analysis_version;
    if (
      analysisVersion !== undefined &&
      analysisVersion !== 1 &&
      analysisVersion !== 2
    ) {
      throw new Error("analysis_version must be 1 or 2");
    }
    return analysisVersion === 2
      ? parseV2Payload(payload)
      : parseLegacyPayload(payload);
  } catch (error) {
    if (error instanceof PersistedReportPayloadError) {
      throw error;
    }
    const reason = error instanceof Error ? error.message : "unknown error";
    throw new PersistedReportPayloadError(
      `Invalid persisted report payload: ${reason}`
    );
  }
}

export function parsePersistedReportPayload(
  value: unknown
): Omit<ReportInput, "generatedAt"> {
  return parsePersistedReportPayloadValue(value);
}

export function parsePersistedReportInput(
  value: unknown,
  generatedAt: string
): ReportInput {
  const payload = parsePersistedReportPayloadValue(value);
  try {
    return {
      ...payload,
      generatedAt: generatedAtValue(generatedAt),
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    throw new PersistedReportPayloadError(
      `Invalid persisted report payload: ${reason}`
    );
  }
}
