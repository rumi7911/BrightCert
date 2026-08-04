import type {
  ActionTimeframe,
  ControlStatus,
  OverallStatus,
  RecommendedOwner,
} from "@/types/assessment";

export type ReportPriority = "P1" | "P2" | "P3";
export type ReportEffort = "Low" | "Medium" | "High";
export type PortfolioEligibility = "validated" | "review_required";

export type ReportGapInput = {
  issue: string;
  why: string;
  priority: ReportPriority;
};

type ReportActionBase = {
  title: string;
  steps: string[];
  effort: ReportEffort;
  priorityLabel: string;
  ownerLabel: string;
  timeframeLabel: string;
  evidenceRequired: string[];
  evidenceLabel: string;
};

export type ValidatedReportActionInput = ReportActionBase & {
  priority: ReportPriority;
  recommendedOwner: RecommendedOwner;
  timeframe: ActionTimeframe;
  portfolioEligibility: "validated";
};

export type ReviewRequiredReportActionInput = ReportActionBase & {
  priority: null;
  recommendedOwner: null;
  timeframe: null;
  portfolioEligibility: "review_required";
};

export type ReportActionInput =
  | ValidatedReportActionInput
  | ReviewRequiredReportActionInput;

export type ReportControlInput = {
  sectionId: 1 | 2 | 3 | 4 | 5;
  score: number;
  status: ControlStatus;
  headline: string;
  managementImplication: string;
  summary: string;
  gaps: ReportGapInput[];
  actions: ReportActionInput[];
};

export type ReportInput = {
  orgName: string;
  generatedAt: string;
  analysisVersion: 1 | 2;
  reportHeadline: string;
  executiveSummary: string;
  primaryDecision: string;
  keyStrengths: string[];
  overallScore: number;
  overallStatus: OverallStatus;
  portfolioEligibility: PortfolioEligibility;
  controls: ReportControlInput[];
};
