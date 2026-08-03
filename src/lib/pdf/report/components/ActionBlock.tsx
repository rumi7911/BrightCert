import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ActionRegisterRow } from "../report-view-model";
import {
  BRAND_COLORS,
  PRIORITY_STYLE,
  REPORT_FONTS,
} from "../brand-tokens";

const styles = StyleSheet.create({
  action: {
    marginBottom: 14,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.line,
    paddingTop: 10,
  },
  heading: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  index: {
    width: 24,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 8,
    fontWeight: 700,
    color: BRAND_COLORS.emerald,
  },
  title: {
    flex: 1,
    fontFamily: REPORT_FONTS.body,
    fontSize: 10.5,
    fontWeight: 600,
    lineHeight: 1.35,
    color: BRAND_COLORS.ink,
  },
  tag: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 3,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
  },
  detail: {
    marginLeft: 32,
    marginTop: 7,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
  },
  detailNumber: {
    width: 13,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    color: BRAND_COLORS.emerald,
  },
  detailText: {
    flex: 1,
    fontFamily: REPORT_FONTS.body,
    fontSize: 9,
    lineHeight: 1.48,
    color: BRAND_COLORS.slate,
  },
  metadata: {
    marginLeft: 32,
    marginTop: 8,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    lineHeight: 1.45,
    color: BRAND_COLORS.muted,
  },
});

type ActionBlockProps = {
  action: ActionRegisterRow;
  index: number;
};

function ActionDetail({
  detail,
  detailIndex,
}: {
  detail: string;
  detailIndex: number;
}) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailNumber}>
        {String(detailIndex).padStart(2, "0")}
      </Text>
      <Text style={styles.detailText}>{detail}</Text>
    </View>
  );
}

export function ActionBlock({ action, index }: ActionBlockProps) {
  const [firstStep, ...remainingSteps] = action.steps;
  if (action.portfolioEligibility === "validated" && !firstStep) {
    throw new Error(
      "validated report action requires at least one implementation step"
    );
  }
  const priorityStyle = action.priority
    ? PRIORITY_STYLE[action.priority]
    : {
        color: BRAND_COLORS.slate,
        backgroundColor: "#F0F2F5",
      };

  return (
    <View style={styles.action}>
      <View wrap={false}>
        <View style={styles.heading}>
          <Text style={styles.index}>{String(index).padStart(2, "0")}</Text>
          <Text style={styles.title}>{action.title}</Text>
          <Text
            style={[
              styles.tag,
              {
                color: priorityStyle.color,
                backgroundColor: priorityStyle.backgroundColor,
              },
            ]}
          >
            {action.priorityLabel}
          </Text>
          <Text
            style={[
              styles.tag,
              {
                color: BRAND_COLORS.slate,
                backgroundColor: BRAND_COLORS.paper,
              },
            ]}
          >
            {action.effort}
          </Text>
        </View>
        {firstStep && <ActionDetail detail={firstStep} detailIndex={1} />}
      </View>
      {remainingSteps.map((step, stepIndex) => (
        <ActionDetail
          key={`${stepIndex + 2}-${step}`}
          detail={step}
          detailIndex={stepIndex + 2}
        />
      ))}
      <Text style={styles.metadata}>
        {action.ownerLabel} · {action.timeframeLabel} · {action.evidenceLabel}
      </Text>
    </View>
  );
}
