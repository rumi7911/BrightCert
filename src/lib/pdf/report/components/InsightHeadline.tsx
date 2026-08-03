import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  eyebrow: {
    marginBottom: 7,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: BRAND_COLORS.emerald,
  },
  headline: {
    maxWidth: 470,
    fontFamily: REPORT_FONTS.headline,
    fontSize: 25,
    fontWeight: 600,
    lineHeight: 1.08,
    letterSpacing: -0.6,
    color: BRAND_COLORS.navy,
  },
  rule: {
    width: 40,
    height: 3,
    marginTop: 12,
    backgroundColor: BRAND_COLORS.emerald,
  },
});

type InsightHeadlineProps = {
  eyebrow: string;
  headline: string;
};

export function InsightHeadline({
  eyebrow,
  headline,
}: InsightHeadlineProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.headline}>{headline}</Text>
      <View style={styles.rule} />
    </View>
  );
}
