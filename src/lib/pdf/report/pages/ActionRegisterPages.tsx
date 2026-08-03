import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { SECTIONS } from "@/lib/questions";
import { BRAND_COLORS, REPORT_FONTS } from "../brand-tokens";
import { BrandHeader } from "../components/BrandHeader";
import { ReportFooter } from "../components/ReportFooter";
import type { ReportInput } from "../report-types";
import type {
  ActionRegisterRow,
  ReportViewModel,
} from "../report-view-model";

const COLUMN_WIDTHS = {
  action: 109,
  control: 90,
  priority: 50,
  owner: 78,
  timeframe: 49,
  effort: 37,
  evidence: 90,
} as const;

const styles = StyleSheet.create({
  page: {
    paddingTop: 166,
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
  registerLabel: {
    position: "absolute",
    top: 102,
    left: 40,
    right: 40,
    fontFamily: REPORT_FONTS.headline,
    fontSize: 15,
    fontWeight: 600,
    color: BRAND_COLORS.navy,
  },
  columnHeader: {
    position: "absolute",
    top: 130,
    left: 40,
    right: 40,
    minHeight: 25,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: BRAND_COLORS.navy,
  },
  columnHeaderText: {
    paddingRight: 5,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 5.4,
    fontWeight: 700,
    lineHeight: 1.25,
    color: BRAND_COLORS.white,
  },
  compactRow: {
    minHeight: 40,
    paddingHorizontal: 6,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.line,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  compactText: {
    paddingRight: 5,
    fontFamily: REPORT_FONTS.body,
    fontSize: 6.3,
    lineHeight: 1.4,
    color: BRAND_COLORS.slate,
  },
  compactAction: {
    fontWeight: 600,
    color: BRAND_COLORS.ink,
  },
  actionBlock: {
    marginBottom: 10,
    padding: 11,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: BRAND_COLORS.line,
    borderLeftColor: BRAND_COLORS.emerald,
    borderRadius: 5,
    backgroundColor: BRAND_COLORS.white,
  },
  blockAction: {
    marginBottom: 9,
    fontFamily: REPORT_FONTS.headline,
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1.35,
    color: BRAND_COLORS.navy,
  },
  metadataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  metadataField: {
    width: "50%",
    marginBottom: 8,
    paddingRight: 12,
  },
  fullField: {
    width: "100%",
    marginBottom: 0,
    paddingRight: 0,
  },
  fieldLabel: {
    marginBottom: 2,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 5.7,
    fontWeight: 700,
    lineHeight: 1.3,
    color: BRAND_COLORS.emerald,
  },
  fieldValue: {
    fontFamily: REPORT_FONTS.body,
    fontSize: 7.3,
    lineHeight: 1.45,
    color: BRAND_COLORS.slate,
  },
  emptyState: {
    padding: 16,
    borderWidth: 1,
    borderColor: BRAND_COLORS.line,
    borderRadius: 5,
    fontSize: 9,
    lineHeight: 1.5,
    color: BRAND_COLORS.slate,
  },
});

type ActionRegisterPagesProps = {
  input: ReportInput;
  viewModel: ReportViewModel;
};

type RegisterColumnProps = {
  label: string;
  width: number;
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

function evidenceText(action: ActionRegisterRow): string {
  return action.evidenceRequired.length > 0
    ? action.evidenceRequired.join(" · ")
    : action.evidenceLabel;
}

function isCompact(action: ActionRegisterRow): boolean {
  return (
    action.title.length <= 64 &&
    action.ownerLabel.length <= 48 &&
    action.evidenceRequired.length <= 2 &&
    evidenceText(action).length <= 110
  );
}

function ColumnHeader({ label, width }: RegisterColumnProps) {
  return (
    <Text
      style={[styles.columnHeaderText, { width }]}
      hyphenationCallback={NO_HYPHENATION}
    >
      {label}
    </Text>
  );
}

function CompactCell({
  children,
  width,
  action = false,
}: {
  children: string;
  width: number;
  action?: boolean;
}) {
  return (
    <Text
      style={[
        styles.compactText,
        action ? styles.compactAction : {},
        { width },
      ]}
      hyphenationCallback={NO_HYPHENATION}
    >
      {children}
    </Text>
  );
}

function CompactActionRow({ action }: { action: ActionRegisterRow }) {
  return (
    <View style={styles.compactRow} wrap={false}>
      <CompactCell width={COLUMN_WIDTHS.action} action>
        {action.title}
      </CompactCell>
      <CompactCell width={COLUMN_WIDTHS.control}>
        {sectionName(action.sectionId)}
      </CompactCell>
      <CompactCell width={COLUMN_WIDTHS.priority}>
        {action.priorityLabel}
      </CompactCell>
      <CompactCell width={COLUMN_WIDTHS.owner}>{action.ownerLabel}</CompactCell>
      <CompactCell width={COLUMN_WIDTHS.timeframe}>
        {action.timeframeLabel}
      </CompactCell>
      <CompactCell width={COLUMN_WIDTHS.effort}>{action.effort}</CompactCell>
      <CompactCell width={COLUMN_WIDTHS.evidence}>
        {evidenceText(action)}
      </CompactCell>
    </View>
  );
}

function MetadataField({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <View style={[styles.metadataField, full ? styles.fullField : {}]}>
      <Text style={styles.fieldLabel} hyphenationCallback={NO_HYPHENATION}>
        {label}
      </Text>
      <Text style={styles.fieldValue} hyphenationCallback={NO_HYPHENATION}>
        {value}
      </Text>
    </View>
  );
}

function LongActionBlock({ action }: { action: ActionRegisterRow }) {
  return (
    <View style={styles.actionBlock} wrap={false}>
      <Text style={styles.fieldLabel} hyphenationCallback={NO_HYPHENATION}>
        Action
      </Text>
      <Text style={styles.blockAction} hyphenationCallback={NO_HYPHENATION}>
        {action.title}
      </Text>
      <View style={styles.metadataGrid}>
        <MetadataField
          label="Control area"
          value={sectionName(action.sectionId)}
        />
        <MetadataField label="Priority" value={action.priorityLabel} />
        <MetadataField
          label="Recommended owner"
          value={action.ownerLabel}
        />
        <MetadataField label="Timeframe" value={action.timeframeLabel} />
        <MetadataField label="Effort" value={action.effort} />
        <MetadataField
          label="Evidence required"
          value={evidenceText(action)}
          full
        />
      </View>
    </View>
  );
}

export function ActionRegisterPages({
  input,
  viewModel,
}: ActionRegisterPagesProps) {
  return (
    <Page size="A4" wrap style={styles.page}>
      <View style={styles.repeatingHeader} fixed>
        <BrandHeader
          reportLabel={`Action register / v${input.analysisVersion}`}
          generatedAt={reportDate(input.generatedAt)}
        />
      </View>
      <Text
        style={styles.registerLabel}
        fixed
        render={({ subPageNumber }) =>
          subPageNumber > 1
            ? "Action register continuation"
            : "Prioritised action register"
        }
      />
      <View style={styles.columnHeader} fixed>
        <ColumnHeader label="Action" width={COLUMN_WIDTHS.action} />
        <ColumnHeader label="Control area" width={COLUMN_WIDTHS.control} />
        <ColumnHeader label="Priority" width={COLUMN_WIDTHS.priority} />
        <ColumnHeader
          label="Recommended owner"
          width={COLUMN_WIDTHS.owner}
        />
        <ColumnHeader label="Timeframe" width={COLUMN_WIDTHS.timeframe} />
        <ColumnHeader label="Effort" width={COLUMN_WIDTHS.effort} />
        <ColumnHeader
          label="Evidence required"
          width={COLUMN_WIDTHS.evidence}
        />
      </View>
      <ReportFooter
        orgName={input.orgName}
        reportVersion={`v${input.analysisVersion}`}
      />

      {viewModel.actionRegister.length === 0 ? (
        <Text style={styles.emptyState}>
          No recommended actions were recorded for this assessment.
        </Text>
      ) : (
        viewModel.actionRegister.map((action, index) =>
          isCompact(action) ? (
            <CompactActionRow
              key={`${action.sectionId}-${index}-${action.title}`}
              action={action}
            />
          ) : (
            <LongActionBlock
              key={`${action.sectionId}-${index}-${action.title}`}
              action={action}
            />
          )
        )
      )}
    </Page>
  );
}
