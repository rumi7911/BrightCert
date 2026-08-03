import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";
import { BrandHeader } from "../components/BrandHeader";
import { InsightHeadline } from "../components/InsightHeadline";
import { ReportFooter } from "../components/ReportFooter";
import { RiskConcentrationChart } from "../components/RiskConcentrationChart";
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
  intro: {
    marginBottom: 10,
    fontFamily: REPORT_FONTS.body,
    fontSize: 9.5,
    lineHeight: 1.5,
    color: BRAND_COLORS.slate,
  },
  sourceNote: {
    marginTop: 12,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 6.5,
    lineHeight: 1.4,
    color: BRAND_COLORS.muted,
  },
  emptyState: {
    marginTop: 10,
    padding: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BRAND_COLORS.line,
    backgroundColor: BRAND_COLORS.paper,
  },
  emptyStateTitle: {
    marginBottom: 6,
    fontFamily: REPORT_FONTS.headline,
    fontSize: 14,
    fontWeight: 600,
    color: BRAND_COLORS.navy,
  },
  emptyStateBody: {
    fontFamily: REPORT_FONTS.body,
    fontSize: 9,
    lineHeight: 1.5,
    color: BRAND_COLORS.slate,
  },
});

type RiskConcentrationPageProps = {
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

export function RiskConcentrationPage({
  input,
  viewModel,
}: RiskConcentrationPageProps) {
  const hasAssessedGaps = viewModel.riskConcentration.some(
    (row) => row.p1Count + row.p2Count + row.p3Count > 0
  );

  return (
    <Page size="A4" wrap style={styles.page}>
      <View style={styles.repeatingHeader} fixed>
        <BrandHeader
          reportLabel={`Risk concentration / v${input.analysisVersion}`}
          generatedAt={reportDate(input.generatedAt)}
        />
      </View>
      <ReportFooter
        orgName={input.orgName}
        reportVersion={`v${input.analysisVersion}`}
      />
      <InsightHeadline
        eyebrow="Risk concentration"
        headline={
          hasAssessedGaps
            ? "Priority gaps are concentrated by control."
            : "No assessed gap findings were recorded for this assessment."
        }
      />
      {hasAssessedGaps ? (
        <>
          <Text style={styles.intro}>
            Counts show the assessed P1, P2 and P3 gaps for each control. Labels
            provide the exact values represented by each bar.
          </Text>
          <RiskConcentrationChart rows={viewModel.riskConcentration} />
          <Text style={styles.sourceNote}>
            Source: assessed gaps. These counts are separate from action
            priority and effort metadata.
          </Text>
        </>
      ) : (
        <View style={styles.emptyState} wrap={false}>
          <Text style={styles.emptyStateTitle}>No gap concentration to plot</Text>
          <Text style={styles.emptyStateBody}>
            All five controls recorded zero P1, P2 and P3 gap findings. Maintain
            the current control baseline and evidence-review cadence.
          </Text>
        </View>
      )}
    </Page>
  );
}
