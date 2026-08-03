import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";
import { BrandHeader } from "../components/BrandHeader";
import { InsightHeadline } from "../components/InsightHeadline";
import { ReportFooter } from "../components/ReportFooter";
import { RoadmapTimeline } from "../components/RoadmapTimeline";
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
    marginBottom: 8,
    fontFamily: REPORT_FONTS.body,
    fontSize: 9.5,
    lineHeight: 1.5,
    color: BRAND_COLORS.slate,
  },
});

type RoadmapPageProps = {
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

export function RoadmapPage({ input, viewModel }: RoadmapPageProps) {
  return (
    <Page size="A4" wrap style={styles.page}>
      <View style={styles.repeatingHeader} fixed>
        <BrandHeader
          reportLabel={`Remediation roadmap / v${input.analysisVersion}`}
          generatedAt={reportDate(input.generatedAt)}
        />
      </View>
      <ReportFooter
        orgName={input.orgName}
        reportVersion={`v${input.analysisVersion}`}
      />
      <InsightHeadline
        eyebrow="Four-phase remediation roadmap"
        headline="Actions are sequenced only by their validated timeframes."
      />
      <Text style={styles.intro}>
        Recommended ownership and required evidence remain visible beside
        every scheduled action.
      </Text>
      <RoadmapTimeline roadmap={viewModel.roadmap} />
    </Page>
  );
}
