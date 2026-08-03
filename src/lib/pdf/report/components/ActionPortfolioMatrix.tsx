import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { SECTIONS } from "@/lib/questions";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";
import type {
  ActionPoint,
  ReportViewModel,
} from "../report-view-model";

const PLOT_HEIGHT = 220;
const PRIORITY_POSITIONS = [16, 34, 75] as const;
const EFFORT_POSITIONS = [16, 66, 84] as const;

const styles = StyleSheet.create({
  reviewNotice: {
    marginTop: 18,
    padding: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BRAND_COLORS.warning,
    backgroundColor: BRAND_COLORS.warningBackground,
  },
  reviewTitle: {
    marginBottom: 8,
    fontFamily: REPORT_FONTS.headline,
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.25,
    color: BRAND_COLORS.navy,
  },
  reviewBody: {
    fontFamily: REPORT_FONTS.body,
    fontSize: 9,
    lineHeight: 1.5,
    color: BRAND_COLORS.slate,
  },
  emptyNotice: {
    marginTop: 18,
    padding: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BRAND_COLORS.line,
    backgroundColor: BRAND_COLORS.paper,
  },
  chart: {
    marginTop: 10,
  },
  priorityAxisTitle: {
    marginBottom: 6,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    color: BRAND_COLORS.slate,
  },
  plotRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  yTicks: {
    position: "relative",
    width: 26,
    height: PLOT_HEIGHT,
  },
  tick: {
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    color: BRAND_COLORS.slate,
  },
  yTick: {
    position: "absolute",
    right: 6,
    width: 20,
    marginTop: -4,
    textAlign: "right",
  },
  plot: {
    position: "relative",
    flex: 1,
    height: PLOT_HEIGHT,
    borderWidth: 1,
    borderColor: BRAND_COLORS.line,
    backgroundColor: BRAND_COLORS.white,
  },
  quadrant: {
    position: "absolute",
    width: "50%",
    height: "50%",
    padding: 8,
  },
  quadrantTopLeft: {
    top: 0,
    left: 0,
    backgroundColor: "#ECFDF5",
  },
  quadrantTopRight: {
    top: 0,
    right: 0,
    backgroundColor: BRAND_COLORS.riskBackground,
  },
  quadrantBottomLeft: {
    bottom: 0,
    left: 0,
    backgroundColor: BRAND_COLORS.paper,
  },
  quadrantBottomRight: {
    right: 0,
    bottom: 0,
    backgroundColor: BRAND_COLORS.warningBackground,
  },
  quadrantLabel: {
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 6.5,
    fontWeight: 700,
    color: BRAND_COLORS.navy,
  },
  verticalRule: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    borderLeftWidth: 1,
    borderLeftStyle: "dashed",
    borderLeftColor: "#AEB8C6",
  },
  horizontalRule: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopStyle: "dashed",
    borderTopColor: "#AEB8C6",
  },
  point: {
    position: "absolute",
    width: 42,
    height: 16,
    marginLeft: -21,
    marginTop: -8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BRAND_COLORS.white,
    backgroundColor: BRAND_COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  pointLabel: {
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 6,
    fontWeight: 700,
    color: BRAND_COLORS.white,
  },
  xTicks: {
    position: "relative",
    marginLeft: 26,
    paddingTop: 6,
    height: 18,
  },
  xTick: {
    position: "absolute",
    width: 54,
    marginLeft: -27,
    textAlign: "center",
  },
  axisCaption: {
    marginLeft: 26,
    marginTop: 6,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    textAlign: "right",
    color: BRAND_COLORS.slate,
  },
  key: {
    marginTop: 18,
  },
  clusterKey: {
    marginTop: 14,
    padding: 10,
    borderRadius: 6,
    backgroundColor: BRAND_COLORS.paper,
  },
  clusterRow: {
    marginBottom: 4,
  },
  clusterMetadata: {
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 6.5,
    lineHeight: 1.35,
    color: BRAND_COLORS.slate,
  },
  keyHeading: {
    marginBottom: 8,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    color: BRAND_COLORS.emerald,
  },
  keyRow: {
    marginBottom: 7,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.line,
    flexDirection: "row",
    gap: 10,
  },
  keyReference: {
    width: 28,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    color: BRAND_COLORS.emerald,
  },
  keyBody: {
    flex: 1,
  },
  keyTitle: {
    marginBottom: 2,
    fontFamily: REPORT_FONTS.body,
    fontSize: 8.5,
    fontWeight: 600,
    lineHeight: 1.3,
    color: BRAND_COLORS.ink,
  },
  keyMetadata: {
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 6.5,
    lineHeight: 1.35,
    color: BRAND_COLORS.slate,
  },
});

type ActionPortfolioMatrixProps = {
  portfolio: ReportViewModel["actionPortfolio"];
};

function actionReference(index: number): string {
  return `A${String(index + 1).padStart(2, "0")}`;
}

function clusterReference(index: number): string {
  return `C${String(index + 1).padStart(2, "0")}`;
}

function sectionName(sectionId: number): string {
  return (
    SECTIONS.find((section) => section.id === sectionId)?.title ??
    `Control ${sectionId}`
  );
}

type ReferencedActionPoint = {
  point: ActionPoint;
  reference: string;
};

type ActionCluster = {
  priorityRank: number;
  effortRank: number;
  points: ReferencedActionPoint[];
};

function buildClusters(points: ActionPoint[]): ActionCluster[] {
  const clusters = new Map<string, ActionCluster>();

  for (const [index, point] of points.entries()) {
    const key = `${point.priorityRank}:${point.effortRank}`;
    const cluster = clusters.get(key) ?? {
      priorityRank: point.priorityRank,
      effortRank: point.effortRank,
      points: [],
    };
    cluster.points.push({ point, reference: actionReference(index) });
    clusters.set(key, cluster);
  }

  return [...clusters.values()];
}

function quadrantLabel(cluster: ActionCluster): string {
  if (cluster.priorityRank < 2) {
    return cluster.effortRank === 0 ? "Quick wins" : "Major blockers";
  }
  return cluster.effortRank === 0
    ? "Scheduled improvements"
    : "Careful planning";
}

export function ActionPortfolioMatrix({
  portfolio,
}: ActionPortfolioMatrixProps) {
  if (portfolio.eligibility !== "validated") {
    return (
      <View style={styles.reviewNotice} wrap={false}>
        <Text style={styles.reviewTitle}>
          Action priorities require review before portfolio plotting
        </Text>
        <Text style={styles.reviewBody}>
          This legacy report does not contain validated action priorities,
          owners or timeframes. Review the action metadata before using a
          priority-by-effort matrix.
        </Text>
      </View>
    );
  }

  if (portfolio.points.length === 0) {
    return (
      <View style={styles.emptyNotice} wrap={false}>
        <Text style={styles.reviewTitle}>No validated actions to plot</Text>
        <Text style={styles.reviewBody}>
          This assessment contains no validated remediation actions, so no
          priority-by-effort matrix is shown.
        </Text>
      </View>
    );
  }

  const clusters = buildClusters(portfolio.points);

  return (
    <View style={styles.chart}>
      <View wrap={false}>
        <Text style={styles.priorityAxisTitle}>Priority — P1 highest</Text>
        <View style={styles.plotRow}>
          <View style={styles.yTicks}>
            {(["P1", "P2", "P3"] as const).map((priority, index) => (
              <Text
                key={priority}
                style={[
                  styles.tick,
                  styles.yTick,
                  { top: `${PRIORITY_POSITIONS[index]}%` },
                ]}
              >
                {priority}
              </Text>
            ))}
          </View>
          <View style={styles.plot}>
            <View style={[styles.quadrant, styles.quadrantTopLeft]}>
              <Text style={styles.quadrantLabel}>Quick wins</Text>
            </View>
            <View style={[styles.quadrant, styles.quadrantTopRight]}>
              <Text style={styles.quadrantLabel}>Major blockers</Text>
            </View>
            <View style={[styles.quadrant, styles.quadrantBottomLeft]}>
              <Text style={styles.quadrantLabel}>Scheduled improvements</Text>
            </View>
            <View style={[styles.quadrant, styles.quadrantBottomRight]}>
              <Text style={styles.quadrantLabel}>Careful planning</Text>
            </View>
            <View style={styles.verticalRule} />
            <View style={styles.horizontalRule} />
            {clusters.map((cluster, index) => (
              <View
                key={`${cluster.priorityRank}:${cluster.effortRank}`}
                style={[
                  styles.point,
                  {
                    left: `${EFFORT_POSITIONS[cluster.effortRank]}%`,
                    top: `${PRIORITY_POSITIONS[cluster.priorityRank]}%`,
                  },
                ]}
              >
                <Text style={styles.pointLabel}>
                  {clusterReference(index)} ({cluster.points.length})
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.xTicks}>
          {(["Low", "Medium", "High"] as const).map((effort, index) => (
            <Text
              key={effort}
              style={[
                styles.tick,
                styles.xTick,
                { left: `${EFFORT_POSITIONS[index]}%` },
              ]}
            >
              {effort}
            </Text>
          ))}
        </View>
        <Text style={styles.axisCaption}>Effort — low to high</Text>
      </View>

      <View style={styles.clusterKey} wrap={false}>
        <Text style={styles.keyHeading}>Matrix cluster key</Text>
        {clusters.map((cluster, index) => {
          const firstPoint = cluster.points[0]!.point;
          const actionLabel =
            cluster.points.length === 1 ? "action" : "actions";

          return (
            <View
              key={`${cluster.priorityRank}:${cluster.effortRank}:key`}
              style={styles.clusterRow}
            >
              <Text style={styles.clusterMetadata}>
                {clusterReference(index)} / {cluster.points.length} {actionLabel}{" "}
                / {firstPoint.priority} / {firstPoint.effort} effort /{" "}
                {quadrantLabel(cluster)}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.key}>
        <Text style={styles.keyHeading}>Direct action key</Text>
        {portfolio.points.map((point, index) => (
          <View
            key={`${point.sectionId}:${point.title}:key:${index}`}
            style={styles.keyRow}
            wrap={false}
          >
            <Text style={styles.keyReference}>{actionReference(index)}</Text>
            <View style={styles.keyBody}>
              <Text style={styles.keyTitle}>{point.title}</Text>
              <Text style={styles.keyMetadata}>
                {sectionName(point.sectionId)} · {point.priority} ·{" "}
                {point.effort} effort
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
