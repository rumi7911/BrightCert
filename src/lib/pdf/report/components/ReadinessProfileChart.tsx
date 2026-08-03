import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ControlStatus } from "@/types/assessment";
import { SECTIONS } from "@/lib/questions";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";
import type { ReadinessRow } from "../report-view-model";

const STATUS_LABEL: Record<ControlStatus, string> = {
  pass: "Pass",
  warning: "Review needed",
  fail: "Needs work",
};

const STATUS_COLOR: Record<ControlStatus, string> = {
  pass: BRAND_COLORS.emerald,
  warning: BRAND_COLORS.warning,
  fail: BRAND_COLORS.risk,
};

const styles = StyleSheet.create({
  chart: {
    marginTop: 8,
  },
  thresholdLegend: {
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  thresholdKey: {
    width: 24,
    borderTopWidth: 1,
    borderTopStyle: "dashed",
    borderTopColor: BRAND_COLORS.navy,
  },
  thresholdLabel: {
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    color: BRAND_COLORS.slate,
  },
  row: {
    marginBottom: 16,
  },
  rowHeader: {
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
  },
  controlName: {
    flex: 1,
    fontFamily: REPORT_FONTS.body,
    fontSize: 9,
    fontWeight: 600,
    color: BRAND_COLORS.ink,
  },
  scoreLabel: {
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7.5,
    fontWeight: 700,
  },
  track: {
    position: "relative",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E9EDF2",
    overflow: "hidden",
  },
  fill: {
    height: 10,
    borderRadius: 5,
  },
  thresholdMarker: {
    position: "absolute",
    left: "80%",
    top: 0,
    bottom: 0,
    borderLeftWidth: 1,
    borderLeftStyle: "dashed",
    borderLeftColor: BRAND_COLORS.navy,
  },
});

type ReadinessProfileChartProps = {
  rows: ReadinessRow[];
  threshold: number;
};

function sectionName(sectionId: ReadinessRow["sectionId"]): string {
  return (
    SECTIONS.find((section) => section.id === sectionId)?.title ??
    `Control ${sectionId}`
  );
}

export function ReadinessProfileChart({
  rows,
  threshold,
}: ReadinessProfileChartProps) {
  return (
    <View style={styles.chart}>
      <View style={styles.thresholdLegend} wrap={false}>
        <View style={styles.thresholdKey} />
        <Text style={styles.thresholdLabel}>
          BrightCert internal {threshold}-point readiness threshold
        </Text>
      </View>
      {rows.map((row) => {
        const statusColor = STATUS_COLOR[row.status];

        return (
          <View key={row.sectionId} style={styles.row} wrap={false}>
            <View style={styles.rowHeader}>
              <Text style={styles.controlName}>{sectionName(row.sectionId)}</Text>
              <Text style={[styles.scoreLabel, { color: statusColor }]}>
                {row.score} / 100 - {STATUS_LABEL[row.status]}
              </Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${row.score}%`,
                    backgroundColor: statusColor,
                  },
                ]}
              />
              <View style={styles.thresholdMarker} />
            </View>
          </View>
        );
      })}
    </View>
  );
}
