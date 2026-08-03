import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { SECTIONS } from "@/lib/questions";
import type { ActionTimeframe } from "@/types/assessment";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";
import { BrandHeader } from "../components/BrandHeader";
import { ReportFooter } from "../components/ReportFooter";
import type { ReportInput } from "../report-types";
import type {
  EvidenceGroup,
  ReportViewModel,
} from "../report-view-model";

const EVIDENCE_CHUNK_SIZE = 5;

const TIMEFRAME_LABELS: Record<ActionTimeframe, string> = {
  days_0_30: "0–30 days",
  days_31_60: "31–60 days",
  days_61_90: "61–90 days",
  ongoing: "Ongoing",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 132,
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
  continuation: {
    position: "absolute",
    top: 101,
    left: 40,
    right: 40,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    lineHeight: 1.45,
    color: BRAND_COLORS.emerald,
  },
  title: {
    marginBottom: 8,
    fontFamily: REPORT_FONTS.headline,
    fontSize: 23,
    fontWeight: 600,
    lineHeight: 1.15,
    color: BRAND_COLORS.navy,
  },
  intro: {
    marginBottom: 18,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: BRAND_COLORS.emerald,
    backgroundColor: BRAND_COLORS.paper,
    fontSize: 8.5,
    lineHeight: 1.5,
    color: BRAND_COLORS.slate,
  },
  group: {
    marginBottom: 11,
    borderWidth: 1,
    borderColor: BRAND_COLORS.line,
    borderRadius: 5,
  },
  groupHeader: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.line,
    backgroundColor: BRAND_COLORS.paper,
  },
  timeframe: {
    marginBottom: 2,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 6,
    fontWeight: 700,
    color: BRAND_COLORS.emerald,
  },
  controlName: {
    fontFamily: REPORT_FONTS.body,
    fontSize: 9,
    fontWeight: 600,
    lineHeight: 1.35,
    color: BRAND_COLORS.navy,
  },
  evidenceRow: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.line,
    flexDirection: "row",
    gap: 8,
  },
  evidenceNumber: {
    width: 24,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 6,
    fontWeight: 700,
    lineHeight: 1.45,
    color: BRAND_COLORS.emerald,
  },
  evidenceText: {
    flex: 1,
    fontSize: 8,
    lineHeight: 1.45,
    color: BRAND_COLORS.slate,
  },
  legacyPanel: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 5,
    backgroundColor: BRAND_COLORS.warningBackground,
  },
  legacyLabel: {
    marginBottom: 5,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 6.5,
    fontWeight: 700,
    textTransform: "uppercase",
    color: BRAND_COLORS.warning,
  },
  legacyText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: BRAND_COLORS.slate,
  },
  emptyState: {
    padding: 14,
    borderWidth: 1,
    borderColor: BRAND_COLORS.line,
    borderRadius: 5,
    fontSize: 9,
    lineHeight: 1.5,
    color: BRAND_COLORS.slate,
  },
});

type EvidenceChecklistPageProps = {
  input: ReportInput;
  viewModel: ReportViewModel;
};

type EvidenceChunk = {
  group: EvidenceGroup;
  evidence: string[];
  chunkIndex: number;
  firstEvidenceIndex: number;
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

function sectionName(sectionId: number): string {
  return (
    SECTIONS.find((section) => section.id === sectionId)?.title ??
    `Control ${sectionId}`
  );
}

function chunks(groups: EvidenceGroup[]): EvidenceChunk[] {
  return groups.flatMap((group) => {
    const result: EvidenceChunk[] = [];
    for (
      let evidenceIndex = 0;
      evidenceIndex < group.evidence.length;
      evidenceIndex += EVIDENCE_CHUNK_SIZE
    ) {
      result.push({
        group,
        evidence: group.evidence.slice(
          evidenceIndex,
          evidenceIndex + EVIDENCE_CHUNK_SIZE
        ),
        chunkIndex: evidenceIndex / EVIDENCE_CHUNK_SIZE,
        firstEvidenceIndex: evidenceIndex,
      });
    }
    return result;
  });
}

function legacyEvidenceLabels(viewModel: ReportViewModel): string[] {
  const labels = viewModel.actionRegister.map((action) => action.evidenceLabel);
  return [...new Set(labels.length > 0 ? labels : [
    "Evidence to confirm during action review",
  ])];
}

function EvidenceChunkBlock({ chunk }: { chunk: EvidenceChunk }) {
  const control = sectionName(chunk.group.sectionId);

  return (
    <View style={styles.group} wrap={false}>
      <View style={styles.groupHeader}>
        <Text style={styles.timeframe} hyphenationCallback={NO_HYPHENATION}>
          {TIMEFRAME_LABELS[chunk.group.timeframe]}
        </Text>
        <Text style={styles.controlName} hyphenationCallback={NO_HYPHENATION}>
          {control}
          {chunk.chunkIndex > 0 ? " (continued)" : ""}
        </Text>
      </View>
      {chunk.evidence.map((evidence, index) => (
        <View
          key={`${chunk.group.timeframe}-${chunk.group.sectionId}-${
            chunk.firstEvidenceIndex + index
          }`}
          style={styles.evidenceRow}
        >
          <Text style={styles.evidenceNumber}>
            E{String(chunk.firstEvidenceIndex + index + 1).padStart(2, "0")}
          </Text>
          <Text
            style={styles.evidenceText}
            hyphenationCallback={NO_HYPHENATION}
          >
            {evidence}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function EvidenceChecklistPage({
  input,
  viewModel,
}: EvidenceChecklistPageProps) {
  const isLegacy =
    input.analysisVersion === 1 ||
    viewModel.actionPortfolio.eligibility === "review_required";

  return (
    <Page size="A4" wrap style={styles.page}>
      <View style={styles.repeatingHeader} fixed>
        <BrandHeader
          reportLabel={`Evidence checklist / v${input.analysisVersion}`}
          generatedAt={reportDate(input.generatedAt)}
        />
      </View>
      <Text
        style={styles.continuation}
        fixed
        render={({ subPageNumber }) =>
          subPageNumber > 1 ? "Evidence checklist continuation" : ""
        }
      />
      <ReportFooter
        orgName={input.orgName}
        reportVersion={`v${input.analysisVersion}`}
      />

      <Text style={styles.title}>Evidence checklist</Text>
      <Text style={styles.intro} hyphenationCallback={NO_HYPHENATION}>
        Evidence checklist is BrightCert preparation guidance, not an official
        Certification Body evidence request.
      </Text>

      {isLegacy ? (
        <View style={styles.legacyPanel} wrap={false}>
          <Text style={styles.legacyLabel}>Legacy action evidence</Text>
          {legacyEvidenceLabels(viewModel).map((label) => (
            <Text
              key={label}
              style={styles.legacyText}
              hyphenationCallback={NO_HYPHENATION}
            >
              {label}
            </Text>
          ))}
        </View>
      ) : viewModel.evidenceGroups.length === 0 ? (
        <Text style={styles.emptyState}>
          No explicit evidence items were recorded for this assessment.
        </Text>
      ) : (
        chunks(viewModel.evidenceGroups).map((chunk) => (
          <EvidenceChunkBlock
            key={`${chunk.group.timeframe}-${chunk.group.sectionId}-${chunk.chunkIndex}`}
            chunk={chunk}
          />
        ))
      )}
    </Page>
  );
}
