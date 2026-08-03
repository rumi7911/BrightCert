import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";
import { BrandHeader } from "../components/BrandHeader";
import { ReportFooter } from "../components/ReportFooter";
import type { ReportInput } from "../report-types";

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
  title: {
    marginBottom: 18,
    fontFamily: REPORT_FONTS.headline,
    fontSize: 23,
    fontWeight: 600,
    lineHeight: 1.15,
    color: BRAND_COLORS.navy,
  },
  section: {
    marginBottom: 12,
    paddingBottom: 11,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.line,
  },
  sectionTitle: {
    marginBottom: 4,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 6.5,
    fontWeight: 700,
    lineHeight: 1.4,
    textTransform: "uppercase",
    color: BRAND_COLORS.emerald,
  },
  body: {
    fontSize: 8.3,
    lineHeight: 1.5,
    color: BRAND_COLORS.slate,
  },
  metadata: {
    flexDirection: "row",
    gap: 12,
  },
  metadataItem: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: BRAND_COLORS.line,
    borderRadius: 5,
    backgroundColor: BRAND_COLORS.paper,
  },
  metadataLabel: {
    marginBottom: 3,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 5.8,
    fontWeight: 700,
    textTransform: "uppercase",
    color: BRAND_COLORS.muted,
  },
  metadataValue: {
    fontFamily: REPORT_FONTS.body,
    fontSize: 8,
    fontWeight: 600,
    color: BRAND_COLORS.navy,
  },
  disclaimer: {
    marginTop: 15,
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
});

type MethodologyPageProps = {
  input: ReportInput;
};

const NO_HYPHENATION = (word: string) => [word];

function reportDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function MethodSection({
  title,
  children,
}: {
  title: string;
  children: string;
}) {
  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.body} hyphenationCallback={NO_HYPHENATION}>
        {children}
      </Text>
    </View>
  );
}

export function MethodologyPage({ input }: MethodologyPageProps) {
  const date = reportDate(input.generatedAt);

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.repeatingHeader} fixed>
        <BrandHeader
          reportLabel={`Method and limitations / v${input.analysisVersion}`}
          generatedAt={date}
        />
      </View>
      <ReportFooter
        orgName={input.orgName}
        reportVersion={`v${input.analysisVersion}`}
      />

      <Text style={styles.title}>Method, limitations and next steps</Text>

      <MethodSection title="Assessment basis">
        This readiness report is based on the organisation&apos;s self-reported
        questionnaire responses and the analysis recorded at the report
        generation date. BrightCert has not independently verified those
        responses or the implementation of the reported controls.
      </MethodSection>

      <MethodSection title="Scoring and status method">
        {"Control scores are generated from the recorded assessment responses.\nControl status: Pass at 80–100, Review needed at 60–79, and Needs work at 0–59.\nThe overall score determines the overall status.\nOverall status: Ready at 80–100, Nearly ready at 60–79, Needs fixes at 40–59, and Not ready at 0–39.\nThese are BrightCert readiness measures, not an external benchmark or certification result."}
      </MethodSection>

      <MethodSection title="No technical audit">
        No technical audit, vulnerability scan, penetration test or evidence
        verification has been performed by BrightCert. This report is not a
        certification decision and does not guarantee certification.
      </MethodSection>

      <MethodSection title="Evidence limitation">
        Evidence checklist is BrightCert preparation guidance, not an official
        Certification Body evidence request.
      </MethodSection>

      <MethodSection title="Official next step">
        After addressing the recorded preparation actions, apply for official
        Cyber Essentials certification through an IASME-licensed Certification
        Body.
      </MethodSection>

      <View style={styles.metadata} wrap={false}>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Report generation date</Text>
          <Text style={styles.metadataValue}>Report generated {date}</Text>
        </View>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Analysis contract</Text>
          <Text style={styles.metadataValue}>
            Analysis version {input.analysisVersion}
          </Text>
        </View>
      </View>

      <View style={styles.disclaimer} wrap={false}>
        <Text style={styles.disclaimerTitle}>
          Readiness assessment — not official certification
        </Text>
        <Text
          style={styles.disclaimerText}
          hyphenationCallback={NO_HYPHENATION}
        >
          {"This report is produced by BrightCert and provides a readiness assessment against Cyber Essentials requirements.\nBrightCert does not issue official Cyber Essentials certification.\nOfficial certification must be completed through an IASME-licensed Certification Body.\nThis report is for preparation and planning purposes only."}
        </Text>
      </View>
    </Page>
  );
}
