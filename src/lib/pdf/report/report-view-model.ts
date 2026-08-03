import type { ActionTimeframe, ControlStatus, RecommendedOwner } from "@/types/assessment";
import type {
  PortfolioEligibility,
  ReportEffort,
  ReportInput,
  ReportPriority,
} from "./report-types";

const READINESS_THRESHOLD = 80 as const;

const PRIORITY_RANK: Record<ReportPriority, number> = {
  P1: 0,
  P2: 1,
  P3: 2,
};

const TIMEFRAME_RANK: Record<ActionTimeframe, number> = {
  days_0_30: 0,
  days_31_60: 1,
  days_61_90: 2,
  ongoing: 3,
};

const EFFORT_RANK: Record<ReportEffort, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
};

export type ControlRef = {
  sectionId: 1 | 2 | 3 | 4 | 5;
  score: number;
  status: ControlStatus;
};

export type ReadinessRow = ControlRef & {
  thresholdDelta: number;
};

export type RiskConcentrationRow = ControlRef & {
  p1Count: number;
  p2Count: number;
  p3Count: number;
};

export type ActionRegisterRow = {
  sectionId: 1 | 2 | 3 | 4 | 5;
  title: string;
  steps: string[];
  effort: ReportEffort;
  priority: ReportPriority | null;
  priorityLabel: string;
  recommendedOwner: RecommendedOwner | null;
  ownerLabel: string;
  timeframe: ActionTimeframe | null;
  timeframeLabel: string;
  evidenceRequired: string[];
  evidenceLabel: string;
  portfolioEligibility: PortfolioEligibility;
};

export type ActionPoint = {
  sectionId: 1 | 2 | 3 | 4 | 5;
  title: string;
  priority: ReportPriority;
  effort: ReportEffort;
  priorityRank: number;
  effortRank: number;
};

export type RoadmapPhase = {
  timeframe: ActionTimeframe;
  actions: ActionRegisterRow[];
};

export type EvidenceGroup = {
  timeframe: ActionTimeframe;
  sectionId: 1 | 2 | 3 | 4 | 5;
  evidence: string[];
};

export type ReportViewModel = {
  metrics: {
    p1ActionCount: number;
    quickWinCount: number;
    findingCount: number;
    controlsAtThreshold: number;
  };
  readinessProfile: {
    threshold: 80;
    strongest: ControlRef;
    weakest: ControlRef;
    rows: ReadinessRow[];
  };
  riskConcentration: RiskConcentrationRow[];
  actionPortfolio: {
    eligibility: PortfolioEligibility;
    points: ActionPoint[];
  };
  roadmap: Record<ActionTimeframe, RoadmapPhase>;
  actionRegister: ActionRegisterRow[];
  evidenceGroups: EvidenceGroup[];
};

type FlattenedAction = ActionRegisterRow & {
  sourceIndex: number;
};

// sourceIndex only exists to keep the action sort stable. It is internal
// bookkeeping, so it is stripped before an action reaches the rendered
// register.
function omitSourceIndex({
  sourceIndex,
  ...action
}: FlattenedAction): ActionRegisterRow {
  void sourceIndex;
  return action;
}

type ValidatableAction = Pick<
  ActionRegisterRow,
  "priority" | "recommendedOwner" | "timeframe" | "portfolioEligibility"
>;

function controlRef(input: {
  sectionId: 1 | 2 | 3 | 4 | 5;
  score: number;
  status: ControlStatus;
}): ControlRef {
  return {
    sectionId: input.sectionId,
    score: input.score,
    status: input.status,
  };
}

function isValidatedAction<T extends ValidatableAction>(
  action: T,
  reportEligibility: PortfolioEligibility
): action is T & {
  priority: ReportPriority;
  recommendedOwner: RecommendedOwner;
  timeframe: ActionTimeframe;
  portfolioEligibility: "validated";
} {
  return (
    reportEligibility === "validated" &&
    action.portfolioEligibility === "validated" &&
    action.priority !== null &&
    action.recommendedOwner !== null &&
    action.timeframe !== null
  );
}

function compareText(left: string, right: string): number {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function compareActions(left: FlattenedAction, right: FlattenedAction): number {
  const priorityDifference =
    (left.priority === null ? 3 : PRIORITY_RANK[left.priority]) -
    (right.priority === null ? 3 : PRIORITY_RANK[right.priority]);
  if (priorityDifference !== 0) return priorityDifference;

  const timeframeDifference =
    (left.timeframe === null ? 4 : TIMEFRAME_RANK[left.timeframe]) -
    (right.timeframe === null ? 4 : TIMEFRAME_RANK[right.timeframe]);
  if (timeframeDifference !== 0) return timeframeDifference;

  const effortDifference = EFFORT_RANK[left.effort] - EFFORT_RANK[right.effort];
  if (effortDifference !== 0) return effortDifference;

  const titleDifference = compareText(left.title, right.title);
  if (titleDifference !== 0) return titleDifference;

  const sectionDifference = left.sectionId - right.sectionId;
  if (sectionDifference !== 0) return sectionDifference;

  return left.sourceIndex - right.sourceIndex;
}

function flattenActions(input: ReportInput): FlattenedAction[] {
  let sourceIndex = 0;

  return input.controls.flatMap((control) =>
    control.actions.map((action) => ({
      sectionId: control.sectionId,
      title: action.title,
      steps: [...action.steps],
      effort: action.effort,
      priority: action.priority,
      priorityLabel: action.priorityLabel,
      recommendedOwner: action.recommendedOwner,
      ownerLabel: action.ownerLabel,
      timeframe: action.timeframe,
      timeframeLabel: action.timeframeLabel,
      evidenceRequired: [...action.evidenceRequired],
      evidenceLabel: action.evidenceLabel,
      portfolioEligibility: action.portfolioEligibility,
      sourceIndex: sourceIndex++,
    }))
  );
}

function buildRoadmap(actions: ActionRegisterRow[]): Record<ActionTimeframe, RoadmapPhase> {
  return {
    days_0_30: {
      timeframe: "days_0_30",
      actions: actions.filter((action) => action.timeframe === "days_0_30"),
    },
    days_31_60: {
      timeframe: "days_31_60",
      actions: actions.filter((action) => action.timeframe === "days_31_60"),
    },
    days_61_90: {
      timeframe: "days_61_90",
      actions: actions.filter((action) => action.timeframe === "days_61_90"),
    },
    ongoing: {
      timeframe: "ongoing",
      actions: actions.filter((action) => action.timeframe === "ongoing"),
    },
  };
}

function buildEvidenceGroups(actions: ActionRegisterRow[]): EvidenceGroup[] {
  const groups = new Map<string, EvidenceGroup>();

  for (const action of actions) {
    if (action.timeframe === null || action.portfolioEligibility !== "validated") {
      continue;
    }

    const key = `${action.timeframe}:${action.sectionId}`;
    const group = groups.get(key) ?? {
      timeframe: action.timeframe,
      sectionId: action.sectionId,
      evidence: [],
    };

    for (const evidence of action.evidenceRequired) {
      if (!group.evidence.includes(evidence)) {
        group.evidence.push(evidence);
      }
    }

    groups.set(key, group);
  }

  return [...groups.values()].sort((left, right) => {
    const timeframeDifference = TIMEFRAME_RANK[left.timeframe] - TIMEFRAME_RANK[right.timeframe];
    return timeframeDifference !== 0
      ? timeframeDifference
      : left.sectionId - right.sectionId;
  });
}

export function buildReportViewModel(input: ReportInput): ReportViewModel {
  const controls = [...input.controls].sort(
    (left, right) => left.sectionId - right.sectionId
  );
  const readinessRows = controls.map((control) => ({
    ...controlRef(control),
    thresholdDelta: READINESS_THRESHOLD - control.score,
  }));
  const firstControl = controls[0];

  if (!firstControl) {
    throw new Error("ReportInput must contain at least one control");
  }

  const strongest = controls.reduce(
    (selected, control) => (control.score > selected.score ? control : selected),
    firstControl
  );
  const weakest = controls.reduce(
    (selected, control) => (control.score < selected.score ? control : selected),
    firstControl
  );
  const flattenedActions = flattenActions(input).sort(compareActions);
  // sourceIndex exists only to make the sort stable; it is dropped here.
  const actionRegister = flattenedActions.map((entry) => omitSourceIndex(entry));
  const validatedActions = flattenedActions.filter((action) =>
    isValidatedAction(action, input.portfolioEligibility)
  );
  const validatedRegister = validatedActions.map((entry) => omitSourceIndex(entry));

  return {
    metrics: {
      p1ActionCount: validatedActions.filter((action) => action.priority === "P1").length,
      quickWinCount: validatedActions.filter(
        (action) =>
          action.effort === "Low" &&
          (action.priority === "P1" || action.priority === "P2")
      ).length,
      findingCount: controls.reduce((count, control) => count + control.gaps.length, 0),
      controlsAtThreshold: controls.filter((control) => control.score >= READINESS_THRESHOLD)
        .length,
    },
    readinessProfile: {
      threshold: READINESS_THRESHOLD,
      strongest: controlRef(strongest),
      weakest: controlRef(weakest),
      rows: readinessRows,
    },
    riskConcentration: controls.map((control) => ({
      ...controlRef(control),
      p1Count: control.gaps.filter((gap) => gap.priority === "P1").length,
      p2Count: control.gaps.filter((gap) => gap.priority === "P2").length,
      p3Count: control.gaps.filter((gap) => gap.priority === "P3").length,
    })),
    actionPortfolio: {
      eligibility: input.portfolioEligibility,
      points: validatedActions.map((action) => ({
        sectionId: action.sectionId,
        title: action.title,
        priority: action.priority,
        effort: action.effort,
        priorityRank: PRIORITY_RANK[action.priority],
        effortRank: EFFORT_RANK[action.effort],
      })),
    },
    roadmap: buildRoadmap(validatedRegister),
    actionRegister,
    evidenceGroups: buildEvidenceGroups(validatedRegister),
  };
}
