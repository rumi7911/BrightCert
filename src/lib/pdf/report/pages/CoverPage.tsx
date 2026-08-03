import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { SCORE_STATUS_MAP } from "@/types/assessment";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";
import { BrandHeader } from "../components/BrandHeader";
import {
  MetricStrip,
  type MetricStripItem,
} from "../components/MetricStrip";
import { ReportFooter } from "../components/ReportFooter";
import type { ReportInput } from "../report-types";
import type { ReportViewModel } from "../report-view-model";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 64,
    paddingHorizontal: 40,
    backgroundColor: BRAND_COLORS.white,
    fontFamily: REPORT_FONTS.body,
    color: BRAND_COLORS.ink,
  },
  // The certification disclaimer also appears on the methodology page. It is
  // repeated here because the cover is the page a reader sees first and the
  // one most likely to be shared or screenshotted on its own, and because
  // BrightCert must never be mistaken for a Certification Body.
  disclaimer: {
    marginTop: 18,
    padding: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: BRAND_COLORS.line,
    borderLeftColor: BRAND_COLORS.navy,
    borderRadius: 5,
    backgroundColor: BRAND_COLORS.paper,
  },
  disclaimerTitle: {
    marginBottom: 4,
    fontFamily: REPORT_FONTS.body,
    fontSize: 8.5,
    fontWeight: 600,
    color: BRAND_COLORS.navy,
  },
  disclaimerText: {
    fontSize: 8,
    lineHeight: 1.5,
    color: BRAND_COLORS.slate,
  },
  metadata: {
    marginBottom: 16,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: BRAND_COLORS.emerald,
  },
  headline: {
    maxWidth: 490,
    marginBottom: 18,
    fontFamily: REPORT_FONTS.headline,
    fontSize: 30,
    fontWeight: 600,
    lineHeight: 1.07,
    letterSpacing: -0.8,
    color: BRAND_COLORS.navy,
  },
  organisation: {
    marginBottom: 25,
    fontFamily: REPORT_FONTS.body,
    fontSize: 10,
    lineHeight: 1.45,
    color: BRAND_COLORS.slate,
  },
  scorePanel: {
    marginBottom: 26,
    padding: 18,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  score: {
    fontFamily: REPORT_FONTS.headline,
    fontSize: 34,
    fontWeight: 600,
    letterSpacing: -0.8,
  },
  scoreDetail: {
    flex: 1,
  },
  scoreEyebrow: {
    marginBottom: 5,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  status: {
    marginBottom: 4,
    fontFamily: REPORT_FONTS.headline,
    fontSize: 18,
    fontWeight: 600,
  },
  scoreContext: {
    fontFamily: REPORT_FONTS.body,
    fontSize: 8.5,
    lineHeight: 1.45,
    color: BRAND_COLORS.slate,
  },
});

type CoverPageProps = {
  input: ReportInput;
  viewModel: ReportViewModel;
};

function keepWordWhole(word: string): string[] {
  return [word];
}

function reportDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function CoverPage({ input, viewModel }: CoverPageProps) {
  const date = reportDate(input.generatedAt);
  const status = SCORE_STATUS_MAP[input.overallStatus];
  const metrics: MetricStripItem[] =
    input.portfolioEligibility === "validated"
      ? [
          {
            value: viewModel.metrics.p1ActionCount,
            label: "P1 actions requiring attention",
          },
          {
            value: viewModel.metrics.quickWinCount,
            label: "Quick wins",
          },
          {
            value: viewModel.metrics.findingCount,
            label: "Open findings",
          },
        ]
      : [
          {
            value: viewModel.metrics.findingCount,
            label: "Open findings",
          },
          {
            value: `${viewModel.metrics.controlsAtThreshold} of 5`,
            label: "Controls at or above 80",
          },
        ];

  return (
    <Page size="A4" wrap style={styles.page}>
      <BrandHeader
        reportLabel={`Cyber Essentials readiness / v${input.analysisVersion}`}
        generatedAt={date}
      />
      <ReportFooter
        orgName={input.orgName}
        reportVersion={`v${input.analysisVersion}`}
      />

      <Text style={styles.metadata}>
        Confidential readiness report / Analysis v{input.analysisVersion}
      </Text>
      <Text style={styles.headline} hyphenationCallback={keepWordWhole}>
        {input.reportHeadline}
      </Text>
      <Text style={styles.organisation}>
        Prepared for {input.orgName}
        {"\n"}
        {date}
      </Text>

      <View
        style={[
          styles.scorePanel,
          {
            borderColor: status.borderColor,
            backgroundColor: status.bgColor,
          },
        ]}
        wrap={false}
      >
        <Text style={[styles.score, { color: status.color }]}>
          {input.overallScore} / 100
        </Text>
        <View style={styles.scoreDetail}>
          <Text style={[styles.scoreEyebrow, { color: status.color }]}>
            Overall readiness
          </Text>
          <Text style={[styles.status, { color: status.color }]}>
            {status.label}
          </Text>
          <Text style={styles.scoreContext} hyphenationCallback={keepWordWhole}>
            BrightCert readiness assessment conclusion based on the recorded
            assessment response.
          </Text>
        </View>
      </View>

      <MetricStrip items={metrics} />

      <View style={styles.disclaimer} wrap={false}>
        <Text style={styles.disclaimerTitle}>
          Readiness assessment — not official certification
        </Text>
        <Text style={styles.disclaimerText}>
          {"This report is produced by BrightCert and provides a readiness assessment against Cyber Essentials requirements.\nBrightCert does not issue official Cyber Essentials certification.\nOfficial certification must be completed through an IASME-licensed Certification Body.\nThis report is for preparation and planning purposes only."}
        </Text>
      </View>
    </Page>
  );
}
