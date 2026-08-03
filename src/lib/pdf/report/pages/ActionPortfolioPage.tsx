import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";
import { ActionPortfolioMatrix } from "../components/ActionPortfolioMatrix";
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
  intro: {
    marginBottom: 8,
    fontFamily: REPORT_FONTS.body,
    fontSize: 9.5,
    lineHeight: 1.5,
    color: BRAND_COLORS.slate,
  },
});

type ActionPortfolioPageProps = {
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

export function ActionPortfolioPage({
  input,
  viewModel,
}: ActionPortfolioPageProps) {
  const isValidated = viewModel.actionPortfolio.eligibility === "validated";
  const hasValidatedActions =
    isValidated && viewModel.actionPortfolio.points.length > 0;

  return (
    <Page size="A4" wrap style={styles.page}>
      <View style={styles.repeatingHeader} fixed>
        <BrandHeader
          reportLabel={`Action portfolio / v${input.analysisVersion}`}
          generatedAt={reportDate(input.generatedAt)}
        />
      </View>
      <ReportFooter
        orgName={input.orgName}
        reportVersion={`v${input.analysisVersion}`}
      />
      <InsightHeadline
        eyebrow="Priority by effort"
        headline={
          hasValidatedActions
            ? "Validated actions form a decision portfolio."
            : isValidated
              ? "No validated actions were recorded for this assessment."
            : "Legacy action metadata requires review."
        }
      />
      <Text style={styles.intro}>
        {hasValidatedActions
          ? "Each reference uses the action's explicit priority and effort. The direct action key preserves the title, control and coordinates."
          : isValidated
            ? "There is no priority-by-effort portfolio to plot. Maintain the current control baseline and continue evidence reviews."
          : "Validated priority and ownership metadata is required before these actions can be positioned."}
      </Text>
      <ActionPortfolioMatrix portfolio={viewModel.actionPortfolio} />
    </Page>
  );
}
