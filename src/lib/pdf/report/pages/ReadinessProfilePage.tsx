import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { SECTIONS } from "@/lib/questions";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";
import { BrandHeader } from "../components/BrandHeader";
import { InsightHeadline } from "../components/InsightHeadline";
import { ReadinessProfileChart } from "../components/ReadinessProfileChart";
import { ReportFooter } from "../components/ReportFooter";
import type { ReportInput } from "../report-types";
import type { ControlRef, ReportViewModel } from "../report-view-model";

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
  comparison: {
    marginTop: 14,
    flexDirection: "row",
    gap: 12,
  },
  comparisonCard: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BRAND_COLORS.line,
    backgroundColor: BRAND_COLORS.paper,
  },
  comparisonLabel: {
    marginBottom: 5,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    color: BRAND_COLORS.emerald,
  },
  comparisonName: {
    marginBottom: 4,
    fontFamily: REPORT_FONTS.body,
    fontSize: 9,
    fontWeight: 600,
    lineHeight: 1.35,
    color: BRAND_COLORS.navy,
  },
  comparisonScore: {
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7.5,
    fontWeight: 700,
    color: BRAND_COLORS.slate,
  },
});

type ReadinessProfilePageProps = {
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

function ComparisonCard({
  label,
  control,
}: {
  label: string;
  control: ControlRef;
}) {
  return (
    <View style={styles.comparisonCard} wrap={false}>
      <Text style={styles.comparisonLabel}>{label}</Text>
      <Text style={styles.comparisonName}>
        {sectionName(control.sectionId)}
      </Text>
      <Text style={styles.comparisonScore}>{control.score} / 100</Text>
    </View>
  );
}

export function ReadinessProfilePage({
  input,
  viewModel,
}: ReadinessProfilePageProps) {
  const date = reportDate(input.generatedAt);

  return (
    <Page size="A4" wrap style={styles.page}>
      <View style={styles.repeatingHeader} fixed>
        <BrandHeader
          reportLabel={`Readiness profile / v${input.analysisVersion}`}
          generatedAt={date}
        />
      </View>
      <ReportFooter
        orgName={input.orgName}
        reportVersion={`v${input.analysisVersion}`}
      />
      <InsightHeadline
        eyebrow="Five-control readiness profile"
        headline="Readiness is visible by control, not hidden in an average."
      />
      <Text style={styles.intro}>
        Each control is shown on the same 100-point scale. Scores and statuses
        are printed directly so colour is never the only signal.
      </Text>

      <ReadinessProfileChart
        rows={viewModel.readinessProfile.rows}
        threshold={viewModel.readinessProfile.threshold}
      />

      <View style={styles.comparison} wrap={false}>
        <ComparisonCard
          label="Strongest control"
          control={viewModel.readinessProfile.strongest}
        />
        <ComparisonCard
          label="Weakest control"
          control={viewModel.readinessProfile.weakest}
        />
      </View>
    </Page>
  );
}
