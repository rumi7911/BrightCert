import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { SECTIONS } from "@/lib/questions";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";
import { BrandHeader } from "../components/BrandHeader";
import { InsightHeadline } from "../components/InsightHeadline";
import { ReportFooter } from "../components/ReportFooter";
import type { ReportInput } from "../report-types";
import type { ReportViewModel } from "../report-view-model";

const styles = StyleSheet.create({
  page: {
    paddingTop: 116,
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
  summary: {
    marginBottom: 18,
    fontFamily: REPORT_FONTS.body,
    fontSize: 10,
    lineHeight: 1.55,
    color: BRAND_COLORS.slate,
  },
  decision: {
    marginBottom: 20,
    padding: 14,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: BRAND_COLORS.emerald,
    backgroundColor: BRAND_COLORS.paper,
  },
  sectionLabel: {
    marginBottom: 6,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: BRAND_COLORS.emerald,
  },
  decisionText: {
    fontFamily: REPORT_FONTS.headline,
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.25,
    color: BRAND_COLORS.navy,
  },
  readinessFact: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  readinessFactValue: {
    fontFamily: REPORT_FONTS.headline,
    fontSize: 18,
    fontWeight: 600,
    color: BRAND_COLORS.navy,
  },
  readinessFactLabel: {
    fontFamily: REPORT_FONTS.body,
    fontSize: 8.5,
    color: BRAND_COLORS.slate,
  },
  columns: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 22,
  },
  column: {
    flex: 1,
  },
  strength: {
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
  },
  strengthMarker: {
    width: 12,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 8,
    fontWeight: 700,
    color: BRAND_COLORS.emerald,
  },
  strengthText: {
    flex: 1,
    fontFamily: REPORT_FONTS.body,
    fontSize: 8.5,
    lineHeight: 1.45,
    color: BRAND_COLORS.slate,
  },
  implication: {
    marginBottom: 9,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.line,
    paddingTop: 7,
  },
  implicationControl: {
    marginBottom: 3,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 6.5,
    fontWeight: 700,
    color: BRAND_COLORS.muted,
  },
  implicationText: {
    fontFamily: REPORT_FONTS.body,
    fontSize: 8,
    lineHeight: 1.4,
    color: BRAND_COLORS.slate,
  },
});

type ExecutiveReadoutPageProps = {
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

export function ExecutiveReadoutPage({
  input,
  viewModel,
}: ExecutiveReadoutPageProps) {
  const date = reportDate(input.generatedAt);
  const orderedControls = [...input.controls].sort(
    (left, right) => left.sectionId - right.sectionId
  );

  return (
    <Page size="A4" wrap style={styles.page}>
      <View style={styles.repeatingHeader} fixed>
        <BrandHeader
          reportLabel={`Executive readout / v${input.analysisVersion}`}
          generatedAt={date}
        />
      </View>
      <ReportFooter
        orgName={input.orgName}
        reportVersion={`v${input.analysisVersion}`}
      />
      <InsightHeadline
        eyebrow="Executive readout"
        headline="The decision, evidence and management response."
      />

      <Text style={styles.summary}>{input.executiveSummary}</Text>

      <View style={styles.decision} wrap={false}>
        <Text style={styles.sectionLabel}>Primary decision</Text>
        <Text style={styles.decisionText}>{input.primaryDecision}</Text>
      </View>

      <View style={styles.readinessFact} wrap={false}>
        <Text style={styles.readinessFactValue}>
          {viewModel.metrics.controlsAtThreshold} of 5
        </Text>
        <Text style={styles.readinessFactLabel}>
          Controls at or above 80
        </Text>
      </View>

      <View style={styles.columns}>
        {input.keyStrengths.length > 0 && (
          <View style={styles.column}>
            <Text style={styles.sectionLabel}>Key strengths</Text>
            {input.keyStrengths.map((strength, index) => (
              <View key={strength} style={styles.strength} wrap={false}>
                <Text style={styles.strengthMarker}>
                  {String(index + 1).padStart(2, "0")}
                </Text>
                <Text style={styles.strengthText}>{strength}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.column}>
          <Text style={styles.sectionLabel}>Management implications</Text>
          {orderedControls.map((control) => (
            <View
              key={control.sectionId}
              style={styles.implication}
              wrap={false}
            >
              <Text style={styles.implicationControl}>
                {sectionName(control.sectionId)}
              </Text>
              <Text style={styles.implicationText}>
                {control.managementImplication}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
}
