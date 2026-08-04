import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";

const styles = StyleSheet.create({
  strip: {
    flexDirection: "row",
    gap: 10,
  },
  metric: {
    flex: 1,
    minHeight: 70,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderTopWidth: 3,
    borderTopColor: BRAND_COLORS.emerald,
    borderRadius: 5,
    backgroundColor: BRAND_COLORS.paper,
  },
  value: {
    marginBottom: 5,
    fontFamily: REPORT_FONTS.headline,
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 1,
    color: BRAND_COLORS.navy,
  },
  label: {
    fontFamily: REPORT_FONTS.body,
    fontSize: 8,
    fontWeight: 600,
    lineHeight: 1.35,
    color: BRAND_COLORS.slate,
  },
});

export type MetricStripItem = {
  label: string;
  value: string | number;
};

type MetricStripProps = {
  items: MetricStripItem[];
};

export function MetricStrip({ items }: MetricStripProps) {
  return (
    <View style={styles.strip} wrap={false}>
      {items.map((item) => (
        <View key={item.label} style={styles.metric}>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}
