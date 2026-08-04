import { StyleSheet, Text, View } from "@react-pdf/renderer";
import {
  BRAND_COLORS,
  REPORT_LAYOUT,
} from "../brand-tokens";

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: REPORT_LAYOUT.footerBottom,
    left: REPORT_LAYOUT.pagePaddingHorizontal,
    right: REPORT_LAYOUT.pagePaddingHorizontal,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.line,
    paddingTop: 8,
    minHeight: 20,
    fontSize: 7,
    color: "#8B97AA",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: REPORT_LAYOUT.footerGap,
  },
  footerTextColumn: {
    flex: 1,
  },
  pageNumberColumn: {
    width: REPORT_LAYOUT.footerPageNumberWidth,
  },
  pageNumber: {
    textAlign: "right",
  },
});

type ReportFooterProps = {
  orgName: string;
  reportVersion: string;
};

function truncateOrganisationName(orgName: string): string {
  const maximumLength = REPORT_LAYOUT.maximumFooterOrganisationLength;
  return orgName.length > maximumLength
    ? `${orgName.slice(0, maximumLength - 1)}…`
    : orgName;
}

export function ReportFooter({
  orgName,
  reportVersion,
}: ReportFooterProps) {
  const displayOrgName = truncateOrganisationName(orgName);

  return (
    <View style={styles.footer} fixed>
      <View style={styles.row}>
        <View style={styles.footerTextColumn}>
          <Text>
            Confidential · {displayOrgName} · Report {reportVersion}
          </Text>
        </View>
        <View style={styles.pageNumberColumn}>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </View>
    </View>
  );
}
