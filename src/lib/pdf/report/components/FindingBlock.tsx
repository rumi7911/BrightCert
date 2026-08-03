import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReportGapInput } from "../report-types";
import {
  BRAND_COLORS,
  PRIORITY_STYLE,
  REPORT_FONTS,
} from "../brand-tokens";

const styles = StyleSheet.create({
  finding: {
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
  priority: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 3,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
  },
  issue: {
    flex: 1,
    fontFamily: REPORT_FONTS.body,
    fontSize: 10.5,
    fontWeight: 600,
    lineHeight: 1.35,
    color: BRAND_COLORS.ink,
  },
  why: {
    marginTop: 7,
    fontFamily: REPORT_FONTS.body,
    fontSize: 9,
    lineHeight: 1.48,
    color: BRAND_COLORS.slate,
  },
});

type FindingBlockProps = {
  finding: ReportGapInput;
};

export function FindingBlock({ finding }: FindingBlockProps) {
  const priorityStyle = PRIORITY_STYLE[finding.priority];

  return (
    <View style={styles.finding}>
      <View wrap={false}>
        <View style={styles.heading}>
          <Text
            style={[
              styles.priority,
              {
                color: priorityStyle.color,
                backgroundColor: priorityStyle.backgroundColor,
              },
            ]}
          >
            {finding.priority}
          </Text>
          <Text style={styles.issue}>{finding.issue}</Text>
        </View>
        <Text style={styles.why}>{finding.why}</Text>
      </View>
    </View>
  );
}
