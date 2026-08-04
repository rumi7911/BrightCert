import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { SECTIONS } from "@/lib/questions";
import type { ControlStatus } from "@/types/assessment";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";
import { ActionBlock } from "../components/ActionBlock";
import { BrandHeader } from "../components/BrandHeader";
import { FindingBlock } from "../components/FindingBlock";
import { InsightHeadline } from "../components/InsightHeadline";
import { ReportFooter } from "../components/ReportFooter";
import type { ReportActionInput, ReportInput } from "../report-types";
import type {
  ActionRegisterRow,
  ReportViewModel,
} from "../report-view-model";

const CONTROL_STATUS: Record<
  ControlStatus,
  {
    label: string;
    color: string;
    backgroundColor: string;
    borderColor: string;
  }
> = {
  pass: {
    label: "Pass",
    color: "#065F46",
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  warning: {
    label: "Review needed",
    color: BRAND_COLORS.warning,
    backgroundColor: BRAND_COLORS.warningBackground,
    borderColor: "#FDE68A",
  },
  fail: {
    label: "Needs work",
    color: BRAND_COLORS.risk,
    backgroundColor: BRAND_COLORS.riskBackground,
    borderColor: "#FECACA",
  },
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 145,
    paddingBottom: 64,
    paddingHorizontal: 40,
    backgroundColor: BRAND_COLORS.white,
    fontFamily: REPORT_FONTS.body,
    color: BRAND_COLORS.ink,
  },
  repeatingHeader: {
    position: "absolute",
    top: 40,
    left: 40,
    right: 40,
  },
  continuation: {
    position: "absolute",
    top: 101,
    left: 40,
    right: 40,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    lineHeight: 1.45,
    color: BRAND_COLORS.emerald,
  },
  scorePanel: {
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
  },
  controlName: {
    flex: 1,
    fontFamily: REPORT_FONTS.body,
    fontSize: 10,
    fontWeight: 600,
    color: BRAND_COLORS.ink,
  },
  scoreStatus: {
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 8,
    fontWeight: 700,
    textAlign: "right",
  },
  implication: {
    marginBottom: 16,
    padding: 13,
    borderLeftWidth: 4,
    borderLeftColor: BRAND_COLORS.emerald,
    backgroundColor: BRAND_COLORS.paper,
  },
  sectionLabel: {
    marginBottom: 5,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    color: BRAND_COLORS.emerald,
  },
  implicationText: {
    fontFamily: REPORT_FONTS.body,
    fontSize: 9.5,
    lineHeight: 1.5,
    color: BRAND_COLORS.slate,
  },
  summary: {
    marginBottom: 18,
    fontFamily: REPORT_FONTS.body,
    fontSize: 9,
    lineHeight: 1.5,
    color: BRAND_COLORS.slate,
  },
  contentSection: {
    marginTop: 3,
  },
  contentHeading: {
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 16,
  },
  contentTitle: {
    fontFamily: REPORT_FONTS.headline,
    fontSize: 15,
    fontWeight: 600,
    color: BRAND_COLORS.navy,
  },
  contentMetric: {
    maxWidth: 260,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 6.5,
    fontWeight: 700,
    lineHeight: 1.4,
    textAlign: "right",
    color: BRAND_COLORS.muted,
  },
  emptyState: {
    marginBottom: 16,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.line,
    fontFamily: REPORT_FONTS.body,
    fontSize: 9,
    lineHeight: 1.45,
    color: BRAND_COLORS.slate,
  },
});

type ControlDeepDivePagesProps = {
  input: ReportInput;
  viewModel: ReportViewModel;
};

function reportDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function sectionName(sectionId: number): string {
  return (
    SECTIONS.find((section) => section.id === sectionId)?.title ??
    `Control ${sectionId}`
  );
}

function displayAction(
  action: ReportActionInput,
  sectionId: ReportInput["controls"][number]["sectionId"]
): ActionRegisterRow {
  const evidence =
    action.evidenceRequired.length > 0
      ? action.evidenceRequired.join(" · ")
      : action.evidenceLabel;

  return {
    sectionId,
    title: action.title,
    steps: action.steps,
    effort: action.effort,
    priority: action.priority,
    priorityLabel: action.priorityLabel,
    recommendedOwner: action.recommendedOwner,
    ownerLabel: `Recommended owner: ${action.ownerLabel}`,
    timeframe: action.timeframe,
    timeframeLabel: `Timeframe: ${action.timeframeLabel} · Effort: ${action.effort}`,
    evidenceRequired: action.evidenceRequired,
    evidenceLabel: `Evidence required: ${evidence}`,
    portfolioEligibility: action.portfolioEligibility,
  };
}

function plural(count: number, singular: string): string {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

export function ControlDeepDivePages({
  input,
  viewModel,
}: ControlDeepDivePagesProps) {
  const date = reportDate(input.generatedAt);
  const controls = [...input.controls].sort(
    (left, right) => left.sectionId - right.sectionId
  );

  return (
    <>
      {controls.map((control) => {
        const name = sectionName(control.sectionId);
        const status = CONTROL_STATUS[control.status];
        const findingMetrics = viewModel.riskConcentration.find(
          (row) => row.sectionId === control.sectionId
        );
        const actionCount = viewModel.actionRegister.filter(
          (action) => action.sectionId === control.sectionId
        ).length;

        return (
          <Page key={control.sectionId} size="A4" wrap style={styles.page}>
            <View style={styles.repeatingHeader} fixed>
              <BrandHeader
                reportLabel={`Control deep dive / ${String(
                  control.sectionId
                ).padStart(2, "0")} / ${name} / v${input.analysisVersion}`}
                generatedAt={date}
              />
            </View>
            <Text
              style={styles.continuation}
              fixed
              render={({ subPageNumber }) =>
                subPageNumber > 1
                  ? `Control area continuation — ${name}`
                  : ""
              }
            />
            <ReportFooter
              orgName={input.orgName}
              reportVersion={`v${input.analysisVersion}`}
            />

            <InsightHeadline
              eyebrow={`Control area ${String(control.sectionId).padStart(
                2,
                "0"
              )}`}
              headline={control.headline}
            />

            <View
              style={[
                styles.scorePanel,
                {
                  borderColor: status.borderColor,
                  backgroundColor: status.backgroundColor,
                },
              ]}
              wrap={false}
            >
              <Text style={styles.controlName}>{name}</Text>
              <Text style={[styles.scoreStatus, { color: status.color }]}>
                {control.score} / 100 · {status.label}
              </Text>
            </View>

            <View style={styles.implication} wrap={false}>
              <Text style={styles.sectionLabel}>Management implication</Text>
              <Text style={styles.implicationText}>
                {control.managementImplication}
              </Text>
            </View>

            <Text style={styles.sectionLabel}>Assessment summary</Text>
            <Text style={styles.summary}>{control.summary}</Text>

            <View style={styles.contentSection}>
              <View style={styles.contentHeading} wrap={false}>
                <Text style={styles.contentTitle}>Findings</Text>
                <Text style={styles.contentMetric}>
                  {plural(control.gaps.length, "finding")} · P1{" "}
                  {findingMetrics?.p1Count ?? 0} · P2{" "}
                  {findingMetrics?.p2Count ?? 0} · P3{" "}
                  {findingMetrics?.p3Count ?? 0}
                </Text>
              </View>
              {control.gaps.length === 0 ? (
                <Text style={styles.emptyState}>
                  No gap findings were recorded for this control area.
                </Text>
              ) : (
                control.gaps.map((finding, index) => (
                  <FindingBlock
                    key={`${control.sectionId}-finding-${index}`}
                    finding={finding}
                  />
                ))
              )}
            </View>

            <View style={styles.contentSection}>
              <View style={styles.contentHeading} wrap={false}>
                <Text style={styles.contentTitle}>Recommended actions</Text>
                <Text style={styles.contentMetric}>
                  {plural(actionCount, "action")}
                </Text>
              </View>
              {control.actions.length === 0 ? (
                <Text style={styles.emptyState}>
                  No recommended actions were recorded for this control area.
                </Text>
              ) : (
                control.actions.map((action, index) => (
                  <ActionBlock
                    key={`${control.sectionId}-action-${index}`}
                    action={displayAction(action, control.sectionId)}
                    index={index + 1}
                  />
                ))
              )}
            </View>
          </Page>
        );
      })}
    </>
  );
}
