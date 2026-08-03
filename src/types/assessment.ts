export type AssessmentStatus = "draft" | "submitted" | "analysed" | "paid";

export type OverallStatus = "ready" | "nearly_ready" | "needs_fixes" | "not_ready";

export type ControlStatus = "pass" | "warning" | "fail";

export type Gap = {
  issue: string;
  why: string;
  priority: "P1" | "P2" | "P3";
};

export type RemediationStep = {
  title: string;
  steps: string[];
  effort: "Low" | "Medium" | "High";
};

export type RecommendedOwner =
  | "business_owner_director"
  | "internal_it_lead"
  | "msp_it_provider"
  | "operations_compliance"
  | "hr_people"
  | "shared_business_it";

export type ActionTimeframe =
  | "days_0_30"
  | "days_31_60"
  | "days_61_90"
  | "ongoing";

export type V2RemediationAction = RemediationStep & {
  priority: "P1" | "P2" | "P3";
  recommendedOwner: RecommendedOwner;
  timeframe: ActionTimeframe;
  evidenceRequired: string[];
};

export type ControlScore = {
  sectionId: 1 | 2 | 3 | 4 | 5;
  score: number;
  status: ControlStatus;
  summary: string;
  gaps: Gap[];
  remediation: RemediationStep[];
};

export type ControlScoreV2 = Omit<ControlScore, "remediation"> & {
  headline: string;
  managementImplication: string;
  remediation: V2RemediationAction[];
};

export type GeminiAnalysisResult = {
  controls: ControlScore[];
  overallScore: number;
  overallStatus: OverallStatus;
  executiveSummary: string;
};

export type GeminiAnalysisV2Result = {
  analysisVersion: 2;
  reportHeadline: string;
  executiveSummary: string;
  primaryDecision: string;
  keyStrengths: string[];
  overallScore: number;
  overallStatus: OverallStatus;
  controls: ControlScoreV2[];
};

export const SCORE_STATUS_MAP: Record<OverallStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  ready: {
    label: "Ready",
    color: "#065F46",
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  nearly_ready: {
    label: "Nearly Ready",
    color: "#92400E",
    bgColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  needs_fixes: {
    label: "Needs Fixes",
    color: "#9A3412",
    bgColor: "#FFF7ED",
    borderColor: "#FED7AA",
  },
  not_ready: {
    label: "Not Ready",
    color: "#B91C1C",
    bgColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
};

export function getOverallStatus(score: number): OverallStatus {
  if (score >= 80) return "ready";
  if (score >= 60) return "nearly_ready";
  if (score >= 40) return "needs_fixes";
  return "not_ready";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#059669";
  if (score >= 60) return "#D97706";
  if (score >= 40) return "#EA580C";
  return "#DC2626";
}
