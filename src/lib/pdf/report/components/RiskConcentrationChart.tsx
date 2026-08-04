import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { SECTIONS } from "@/lib/questions";
import {
  BRAND_COLORS,
  PRIORITY_STYLE,
  REPORT_FONTS,
} from "../brand-tokens";
import type { RiskConcentrationRow } from "../report-view-model";

const styles = StyleSheet.create({
  chart: {
    marginTop: 10,
  },
  legend: {
    marginBottom: 14,
    flexDirection: "row",
    gap: 14,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendSwatch: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    color: BRAND_COLORS.slate,
  },
  row: {
    marginBottom: 17,
  },
  rowHeader: {
    marginBottom: 7,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  controlName: {
    flex: 1,
    fontFamily: REPORT_FONTS.body,
    fontSize: 9,
    fontWeight: 600,
    color: BRAND_COLORS.ink,
  },
  counts: {
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    color: BRAND_COLORS.slate,
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E9EDF2",
    flexDirection: "row",
    overflow: "hidden",
  },
  segment: {
    height: 10,
  },
  noFindings: {
    flex: 1,
    backgroundColor: "#E9EDF2",
  },
});

type RiskConcentrationChartProps = {
  rows: RiskConcentrationRow[];
};

function sectionName(sectionId: RiskConcentrationRow["sectionId"]): string {
  return (
    SECTIONS.find((section) => section.id === sectionId)?.title ??
    `Control ${sectionId}`
  );
}

export function RiskConcentrationChart({
  rows,
}: RiskConcentrationChartProps) {
  const maximumFindings = Math.max(
    1,
    ...rows.map((row) => row.p1Count + row.p2Count + row.p3Count)
  );

  return (
    <View style={styles.chart}>
      <View style={styles.legend} wrap={false}>
        {(["P1", "P2", "P3"] as const).map((priority) => (
          <View key={priority} style={styles.legendItem}>
            <View
              style={[
                styles.legendSwatch,
                { backgroundColor: PRIORITY_STYLE[priority].color },
              ]}
            />
            <Text style={styles.legendText}>{priority} gap count</Text>
          </View>
        ))}
      </View>

      {rows.map((row) => {
        const total = row.p1Count + row.p2Count + row.p3Count;

        return (
          <View key={row.sectionId} style={styles.row} wrap={false}>
            <View style={styles.rowHeader}>
              <Text style={styles.controlName}>{sectionName(row.sectionId)}</Text>
              <Text style={styles.counts}>
                P1 {row.p1Count} · P2 {row.p2Count} · P3 {row.p3Count}
              </Text>
            </View>
            <View style={styles.track}>
              {total === 0 ? (
                <View style={styles.noFindings} />
              ) : (
                <>
                  {(["P1", "P2", "P3"] as const).map((priority) => {
                    const count =
                      priority === "P1"
                        ? row.p1Count
                        : priority === "P2"
                          ? row.p2Count
                          : row.p3Count;

                    return count > 0 ? (
                      <View
                        key={priority}
                        style={[
                          styles.segment,
                          {
                            width: `${(count / maximumFindings) * 100}%`,
                            backgroundColor: PRIORITY_STYLE[priority].color,
                          },
                        ]}
                      />
                    ) : null;
                  })}
                </>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
