import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { OverallStatus, ControlStatus } from "@/types/assessment";
import { SECTIONS } from "@/lib/questions";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/files/inter-latin-400-normal.woff",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/files/inter-latin-600-normal.woff",
      fontWeight: 600,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/files/inter-latin-700-normal.woff",
      fontWeight: 700,
    },
  ],
});

const NAVY = "#0F2044";
const EMERALD = "#047857";
const SLATE = "#475569";
const LIGHT = "#F8FAFC";
const BORDER = "#E2E8F0";

const STATUS_COLORS: Record<ControlStatus, string> = {
  pass: "#065F46",
  warning: "#92400E",
  fail: "#B91C1C",
};

const STATUS_BG: Record<ControlStatus, string> = {
  pass: "#ECFDF5",
  warning: "#FFFBEB",
  fail: "#FEF2F2",
};

const STATUS_LABELS: Record<ControlStatus, string> = {
  pass: "Pass",
  warning: "Review needed",
  fail: "Needs work",
};

const OVERALL_LABELS: Record<OverallStatus, string> = {
  ready: "Ready",
  nearly_ready: "Nearly Ready",
  needs_fixes: "Needs Fixes",
  not_ready: "Not Ready",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    color: NAVY,
    backgroundColor: "#FFFFFF",
    padding: 40,
  },
  // Cover
  coverTitle: { fontSize: 28, fontWeight: 700, color: NAVY, marginBottom: 8 },
  coverSubtitle: { fontSize: 14, color: SLATE, marginBottom: 24 },
  coverScore: { fontSize: 48, fontWeight: 700, color: EMERALD },
  coverStatus: { fontSize: 14, color: SLATE, marginTop: 4, marginBottom: 32 },
  // Headings
  h1: { fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 12, marginTop: 20 },
  h2: { fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 8, marginTop: 16 },
  h3: { fontSize: 11, fontWeight: 600, color: NAVY, marginBottom: 4, marginTop: 12 },
  // Body
  body: { fontSize: 10, color: SLATE, lineHeight: 1.6, marginBottom: 8 },
  // Divider
  divider: { borderBottomWidth: 1, borderBottomColor: BORDER, marginVertical: 12 },
  // Badges
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontSize: 9, fontWeight: 600 },
  // Table
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: BORDER, paddingVertical: 6 },
  tableHeader: { backgroundColor: LIGHT, borderTopWidth: 1, borderTopColor: BORDER },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: "center" },
  col3: { flex: 1.5, textAlign: "center" },
  // Priority
  p1: { color: "#B91C1C", fontWeight: 600 },
  p2: { color: "#92400E", fontWeight: 600 },
  p3: { color: "#475569", fontWeight: 600 },
  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#94A3B8",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 8,
  },
  pageNumber: { textAlign: "right" },
  // Disclaimer box
  disclaimerBox: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: LIGHT,
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  disclaimerText: { fontSize: 9, color: SLATE, lineHeight: 1.5 },
});

type ControlScoreRow = {
  section_id: number;
  score: number;
  status: ControlStatus;
  summary: string;
  gaps: Array<{ issue: string; why: string; priority: "P1" | "P2" | "P3" }>;
  remediation: Array<{ title: string; steps: string[]; effort: string }>;
};

type ReportDocumentProps = {
  orgName: string;
  assessmentId: string;
  overallScore: number;
  overallStatus: OverallStatus;
  controls: ControlScoreRow[];
  generatedAt: string;
};

const Disclaimer = () => (
  <View style={styles.disclaimerBox}>
    <Text style={[styles.disclaimerText, { fontWeight: 600, marginBottom: 4 }]}>
      Readiness assessment — not official certification
    </Text>
    <Text style={styles.disclaimerText}>
      This report is produced by BrightCert and provides a readiness assessment against Cyber Essentials requirements. BrightCert does not issue official Cyber Essentials certification. Official certification must be completed through an IASME-licensed Certification Body. This report is for preparation and planning purposes only.
    </Text>
  </View>
);

const Footer = ({ orgName, date }: { orgName: string; date: string }) => (
  <View style={styles.footer} fixed>
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text>BrightCert Readiness Report — {orgName} — {date}</Text>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  </View>
);

export function ReportDocument({
  orgName,
  assessmentId,
  overallScore,
  overallStatus,
  controls,
  generatedAt,
}: ReportDocumentProps) {
  const date = new Date(generatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const p1Items = controls.flatMap((c) =>
    c.gaps.filter((g) => g.priority === "P1").map((g) => ({ ...g, sectionId: c.section_id }))
  );
  const p2Items = controls.flatMap((c) =>
    c.gaps.filter((g) => g.priority === "P2").map((g) => ({ ...g, sectionId: c.section_id }))
  );

  return (
    <Document
      title={`BrightCert Readiness Report — ${orgName}`}
      author="BrightCert"
      subject="Cyber Essentials Readiness Assessment"
    >
      {/* ── Cover Page ──────────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <View style={{ marginBottom: 32, paddingBottom: 24, borderBottomWidth: 2, borderBottomColor: EMERALD }}>
          <Text style={{ fontSize: 10, color: EMERALD, fontWeight: 600, letterSpacing: 1, marginBottom: 16 }}>BRIGHTCERT</Text>
          <Text style={styles.coverTitle}>Cyber Essentials{"\n"}Readiness Report</Text>
          <Text style={styles.coverSubtitle}>{orgName}</Text>
          <Text style={{ fontSize: 10, color: SLATE }}>Generated {date}</Text>
        </View>

        <Text style={styles.coverScore}>{overallScore}%</Text>
        <Text style={styles.coverStatus}>Overall readiness — {OVERALL_LABELS[overallStatus]}</Text>

        {/* Control summary table on cover */}
        <View style={{ marginTop: 16 }}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.col1, { fontWeight: 600, fontSize: 9 }]}>Control Area</Text>
            <Text style={[styles.col2, { fontWeight: 600, fontSize: 9 }]}>Score</Text>
            <Text style={[styles.col3, { fontWeight: 600, fontSize: 9 }]}>Status</Text>
          </View>
          {controls.map((control) => {
            const section = SECTIONS.find((s) => s.id === control.section_id);
            return (
              <View key={control.section_id} style={styles.tableRow}>
                <Text style={[styles.col1, { fontSize: 9 }]}>{section?.title ?? `Area ${control.section_id}`}</Text>
                <Text style={[styles.col2, { fontSize: 9 }]}>{control.score}%</Text>
                <Text style={[styles.col3, { fontSize: 9, color: STATUS_COLORS[control.status] }]}>
                  {STATUS_LABELS[control.status]}
                </Text>
              </View>
            );
          })}
        </View>

        <Disclaimer />
        <Footer orgName={orgName} date={date} />
      </Page>

      {/* ── Detailed Findings ─────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Priority Action Plan</Text>

        {p1Items.length > 0 && (
          <View>
            <Text style={styles.h2}>P1 — Must fix before applying</Text>
            {p1Items.map((item, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={[styles.body, { fontWeight: 600, color: "#B91C1C" }]}>{item.issue}</Text>
                <Text style={styles.body}>{item.why}</Text>
              </View>
            ))}
          </View>
        )}

        {p2Items.length > 0 && (
          <View>
            <Text style={styles.h2}>P2 — Should fix soon</Text>
            {p2Items.map((item, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={[styles.body, { fontWeight: 600, color: "#92400E" }]}>{item.issue}</Text>
                <Text style={styles.body}>{item.why}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.divider} />
        <Text style={styles.h1}>Control Area Findings</Text>

        {controls.map((control) => {
          const section = SECTIONS.find((s) => s.id === control.section_id);
          return (
            <View key={control.section_id} wrap={false} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Text style={styles.h2}>{section?.title ?? `Area ${control.section_id}`}</Text>
                <View style={[styles.badge, { backgroundColor: STATUS_BG[control.status] }]}>
                  <Text style={{ color: STATUS_COLORS[control.status] }}>{STATUS_LABELS[control.status]} — {control.score}%</Text>
                </View>
              </View>
              <Text style={styles.body}>{control.summary}</Text>
              {control.gaps.map((gap, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                  <Text style={[styles.body, gap.priority === "P1" ? styles.p1 : gap.priority === "P2" ? styles.p2 : styles.p3]}>
                    [{gap.priority}]
                  </Text>
                  <Text style={styles.body}>{gap.issue} — {gap.why}</Text>
                </View>
              ))}
            </View>
          );
        })}

        <View style={styles.divider} />
        <Text style={styles.h1}>Next Steps</Text>
        <Text style={styles.body}>
          1. Address all P1 priority actions listed above — these are the most critical gaps that must be resolved before applying for Cyber Essentials certification.
        </Text>
        <Text style={styles.body}>
          2. Work through P2 actions in parallel where possible. These are important but not immediate blockers.
        </Text>
        <Text style={styles.body}>
          3. Once gaps are addressed, apply for official Cyber Essentials through an IASME-licensed Certification Body at iasme.co.uk/cyber-essentials/certified-assessors
        </Text>

        <Disclaimer />
        <Footer orgName={orgName} date={date} />
      </Page>
    </Document>
  );
}
