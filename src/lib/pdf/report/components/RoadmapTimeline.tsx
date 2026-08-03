import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { SECTIONS } from "@/lib/questions";
import type { ActionTimeframe } from "@/types/assessment";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";
import type {
  ActionRegisterRow,
  ReportViewModel,
} from "../report-view-model";

const PHASES: Array<{
  timeframe: ActionTimeframe;
  label: string;
}> = [
  { timeframe: "days_0_30", label: "Now / 0–30 days" },
  { timeframe: "days_31_60", label: "Next / 31–60 days" },
  { timeframe: "days_61_90", label: "Then / 61–90 days" },
  { timeframe: "ongoing", label: "Ongoing" },
];

const styles = StyleSheet.create({
  timeline: {
    marginTop: 10,
  },
  recommendationNotice: {
    marginBottom: 16,
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: BRAND_COLORS.emerald,
    backgroundColor: BRAND_COLORS.paper,
    fontFamily: REPORT_FONTS.body,
    fontSize: 8,
    lineHeight: 1.4,
    color: BRAND_COLORS.slate,
  },
  phase: {
    marginBottom: 18,
  },
  phaseHeading: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  phaseMarker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BRAND_COLORS.emerald,
  },
  phaseLabel: {
    fontFamily: REPORT_FONTS.headline,
    fontSize: 13,
    fontWeight: 600,
    color: BRAND_COLORS.navy,
  },
  empty: {
    marginLeft: 17,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: BRAND_COLORS.paper,
    fontFamily: REPORT_FONTS.body,
    fontSize: 8,
    color: BRAND_COLORS.muted,
  },
  action: {
    marginLeft: 17,
    marginBottom: 8,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BRAND_COLORS.line,
    backgroundColor: BRAND_COLORS.white,
  },
  actionHeader: {
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
  },
  actionPriority: {
    width: 22,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: BRAND_COLORS.navy,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 6.5,
    fontWeight: 700,
    textAlign: "center",
    color: BRAND_COLORS.white,
  },
  actionTitle: {
    flex: 1,
    fontFamily: REPORT_FONTS.body,
    fontSize: 8.5,
    fontWeight: 600,
    lineHeight: 1.3,
    color: BRAND_COLORS.ink,
  },
  control: {
    marginBottom: 4,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 6.5,
    fontWeight: 700,
    color: BRAND_COLORS.emerald,
  },
  detail: {
    marginBottom: 2,
    fontFamily: REPORT_FONTS.body,
    fontSize: 7.5,
    lineHeight: 1.4,
    color: BRAND_COLORS.slate,
  },
});

type RoadmapTimelineProps = {
  roadmap: ReportViewModel["roadmap"];
};

function sectionName(sectionId: number): string {
  return (
    SECTIONS.find((section) => section.id === sectionId)?.title ??
    `Control ${sectionId}`
  );
}

function evidenceSummary(action: ActionRegisterRow): string {
  return action.evidenceRequired.length > 0
    ? action.evidenceRequired.join("; ")
    : "Not specified";
}

function RoadmapActionCard({ action }: { action: ActionRegisterRow }) {
  return (
    <View style={styles.action} wrap={false}>
      <View style={styles.actionHeader}>
        <Text style={styles.actionPriority}>{action.priority}</Text>
        <Text style={styles.actionTitle}>{action.title}</Text>
      </View>
      <Text style={styles.control}>{sectionName(action.sectionId)}</Text>
      <Text style={styles.detail}>Timeframe: {action.timeframeLabel}</Text>
      <Text style={styles.detail}>
        Recommended owner: {action.ownerLabel}
      </Text>
      <Text style={styles.detail}>Evidence: {evidenceSummary(action)}</Text>
    </View>
  );
}

export function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  return (
    <View style={styles.timeline}>
      <Text style={styles.recommendationNotice}>
        Owner labels are recommendations; accountability remains subject to
        confirmation.
      </Text>

      {PHASES.map(({ timeframe, label }) => {
        const actions = roadmap[timeframe].actions;
        const [firstAction, ...remainingActions] = actions;

        return (
          <View key={timeframe} style={styles.phase}>
            <View wrap={false}>
              <View style={styles.phaseHeading}>
                <View style={styles.phaseMarker} />
                <Text style={styles.phaseLabel}>{label}</Text>
              </View>

              {firstAction ? (
                <RoadmapActionCard action={firstAction} />
              ) : (
                <Text style={styles.empty}>
                  No validated actions scheduled.
                </Text>
              )}
            </View>

            {remainingActions.map((action, index) => (
              <RoadmapActionCard
                key={`${action.sectionId}:${action.title}:${index + 1}`}
                action={action}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}
