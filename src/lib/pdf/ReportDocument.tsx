import fs from "fs";
import path from "path";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { OverallStatus, ControlStatus } from "@/types/assessment";
import { SCORE_STATUS_MAP, getScoreColor } from "@/types/assessment";
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
    {
      src: "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/files/inter-latin-800-normal.woff",
      fontWeight: 800,
    },
  ],
});

// Read once per cold start rather than per report — this module is only
// ever dynamically imported server-side (see reports/generate/route.ts),
// never bundled for the browser, so plain fs access here is safe.
let logoMark: Buffer | null = null;
try {
  logoMark = fs.readFileSync(path.join(process.cwd(), "public", "logo-mark.png"));
} catch {
  logoMark = null;
}

const NAVY = "#0F2044";
const EMERALD = "#047857";
const EMERALD_BRIGHT = "#6EE7B7";
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

const STATUS_BORDER: Record<ControlStatus, string> = {
  pass: "#A7F3D0",
  warning: "#FDE68A",
  fail: "#FECACA",
};

const STATUS_LABELS: Record<ControlStatus, string> = {
  pass: "Pass",
  warning: "Review needed",
  fail: "Needs work",
};

const PRIORITY_META = {
  P1: { color: "#B91C1C", bg: "#FEF2F2", border: "#FECACA", label: "P1 — Must fix" },
  P2: { color: "#92400E", bg: "#FFFBEB", border: "#FDE68A", label: "P2 — Should fix soon" },
  P3: { color: SLATE, bg: LIGHT, border: BORDER, label: "P3 — Worth addressing" },
} as const;

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    color: NAVY,
    backgroundColor: "#FFFFFF",
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 40,
  },
  // Full-bleed navy hero band on the cover — negative margins cancel the
  // page's own padding so this reaches the physical page edges.
  hero: {
    marginTop: -40,
    marginHorizontal: -40,
    paddingHorizontal: 40,
    paddingTop: 36,
    paddingBottom: 32,
    marginBottom: 28,
    backgroundColor: NAVY,
  },
  heroBrandRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 22 },
  heroWordmark: { fontSize: 11, color: EMERALD_BRIGHT, fontWeight: 700, letterSpacing: 1.5 },
  heroTitle: { fontSize: 26, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.15, marginBottom: 10 },
  heroSubtitle: { fontSize: 10.5, color: "#B9C5DC" },
  // Headings
  h1: { fontSize: 17, fontWeight: 800, color: NAVY, marginBottom: 4 },
  h1Rule: { width: 36, height: 3, backgroundColor: EMERALD, borderRadius: 2, marginBottom: 16, marginTop: 6 },
  h2: { fontSize: 12.5, fontWeight: 700, color: NAVY },
  eyebrow: { fontSize: 8.5, fontWeight: 700, color: EMERALD, letterSpacing: 1.2, marginBottom: 6 },
  // Body
  body: { fontSize: 9.5, color: SLATE, lineHeight: 1.55 },
  // Score card (cover)
  scoreSection: { flexDirection: "row", gap: 20, marginBottom: 26, alignItems: "center" },
  scoreCard: {
    width: 108,
    height: 108,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNumber: { fontSize: 32, fontWeight: 800 },
  scoreCaption: { fontSize: 9, color: SLATE, lineHeight: 1.55, flex: 1 },
  // Control-area summary bars (cover)
  areaRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  areaName: { width: 150, fontSize: 9, fontWeight: 600, color: NAVY },
  areaBarTrack: { flex: 1, height: 7, borderRadius: 4, backgroundColor: "#EEF1F6", overflow: "hidden" },
  areaBarFill: { height: 7, borderRadius: 4 },
  areaScore: { width: 30, fontSize: 9, fontWeight: 700, color: NAVY, textAlign: "right" },
  areaBadge: { width: 92, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, alignItems: "center" },
  areaBadgeText: { fontSize: 8, fontWeight: 700 },
  // Priority / gap callout cards
  gapCard: {
    borderWidth: 1,
    borderRadius: 8,
    borderLeftWidth: 3,
    padding: 10,
    marginBottom: 8,
  },
  gapIssue: { fontSize: 9.5, fontWeight: 700, marginBottom: 3 },
  gapWhy: { fontSize: 9, color: SLATE, lineHeight: 1.5 },
  priorityPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 8.5,
    fontWeight: 700,
    marginBottom: 12,
  },
  // Control area detail header band
  areaHeaderBand: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  areaHeaderTitle: { fontSize: 14, fontWeight: 800, color: NAVY },
  areaHeaderPill: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 5 },
  areaHeaderPillText: { fontSize: 9, fontWeight: 700 },
  gapPriorityTag: {
    fontSize: 8,
    fontWeight: 700,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 6,
  },
  // Next steps
  stepRow: { flexDirection: "row", gap: 12, alignItems: "flex-start", marginBottom: 14 },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: EMERALD,
    color: "#FFFFFF",
    fontSize: 10.5,
    fontWeight: 700,
    textAlign: "center",
    paddingTop: 5,
  },
  stepText: { fontSize: 10, color: SLATE, lineHeight: 1.55, flex: 1, paddingTop: 3 },
  // Footer
  footer: {
    position: "absolute",
    bottom: 22,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#94A3B8",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 8,
  },
  // Disclaimer box
  disclaimerBox: {
    borderWidth: 1,
    borderLeftWidth: 3,
    borderColor: BORDER,
    borderLeftColor: NAVY,
    backgroundColor: LIGHT,
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  disclaimerText: { fontSize: 8.5, color: SLATE, lineHeight: 1.5 },
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
  executiveSummary: string | null;
  overallScore: number;
  overallStatus: OverallStatus;
  controls: ControlScoreRow[];
  generatedAt: string;
};

const Disclaimer = () => (
  <View style={styles.disclaimerBox}>
    <Text style={[styles.disclaimerText, { fontWeight: 700, marginBottom: 4, color: NAVY }]}>
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

const SectionHeading = ({ title, break: pageBreak }: { title: string; break?: boolean }) => (
  <View break={pageBreak}>
    <Text style={styles.h1}>{title}</Text>
    <View style={styles.h1Rule} />
  </View>
);

const GapCard = ({ gap }: { gap: { issue: string; why: string; priority: "P1" | "P2" | "P3" } }) => {
  const meta = PRIORITY_META[gap.priority];
  return (
    <View style={[styles.gapCard, { backgroundColor: meta.bg, borderColor: meta.border, borderLeftColor: meta.color }]}>
      <Text style={[styles.gapIssue, { color: meta.color }]}>{gap.issue}</Text>
      <Text style={styles.gapWhy}>{gap.why}</Text>
    </View>
  );
};

export function ReportDocument({
  orgName,
  executiveSummary,
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

  const p1Items = controls.flatMap((c) => c.gaps.filter((g) => g.priority === "P1"));
  const p2Items = controls.flatMap((c) => c.gaps.filter((g) => g.priority === "P2"));
  const statusMeta = SCORE_STATUS_MAP[overallStatus];

  return (
    <Document
      title={`BrightCert Readiness Report — ${orgName}`}
      author="BrightCert"
      subject="Cyber Essentials Readiness Assessment"
    >
      {/* ── Cover Page ──────────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.hero}>
          <View style={styles.heroBrandRow}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image renders into a PDF, not the DOM; there's no alt-text concept here */}
            {logoMark && <Image src={logoMark} style={{ width: 20, height: 20 }} />}
            <Text style={styles.heroWordmark}>BRIGHTCERT</Text>
          </View>
          <Text style={styles.heroTitle}>Cyber Essentials{"\n"}Readiness Report</Text>
          <Text style={styles.heroSubtitle}>{orgName} · Generated {date}</Text>
        </View>

        <View style={styles.scoreSection}>
          <View style={[styles.scoreCard, { backgroundColor: statusMeta.bgColor, borderColor: statusMeta.borderColor }]}>
            <Text style={[styles.scoreNumber, { color: statusMeta.color }]}>{overallScore}%</Text>
            <Text style={{ fontSize: 9, fontWeight: 700, color: statusMeta.color, marginTop: 2 }}>
              {statusMeta.label}
            </Text>
          </View>
          <Text style={styles.scoreCaption}>
            Overall Cyber Essentials readiness across all five control areas, based on your assessment
            answers. This score reflects preparation for certification, not a pass or fail result.
          </Text>
        </View>

        {executiveSummary && (
          <View style={{ marginBottom: 22 }}>
            <Text style={styles.eyebrow}>EXECUTIVE SUMMARY</Text>
            <Text style={styles.body}>{executiveSummary}</Text>
          </View>
        )}

        <Text style={styles.eyebrow}>CONTROL AREA SUMMARY</Text>
        <View style={{ marginBottom: 20 }}>
          {controls.map((control) => {
            const section = SECTIONS.find((s) => s.id === control.section_id);
            return (
              <View key={control.section_id} style={styles.areaRow}>
                <Text style={styles.areaName}>{section?.title ?? `Area ${control.section_id}`}</Text>
                <View style={styles.areaBarTrack}>
                  <View
                    style={[
                      styles.areaBarFill,
                      { width: `${Math.max(4, control.score)}%`, backgroundColor: getScoreColor(control.score) },
                    ]}
                  />
                </View>
                <Text style={styles.areaScore}>{control.score}%</Text>
                <View style={[styles.areaBadge, { backgroundColor: STATUS_BG[control.status] }]}>
                  <Text style={[styles.areaBadgeText, { color: STATUS_COLORS[control.status] }]}>
                    {STATUS_LABELS[control.status]}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <Disclaimer />
        <Footer orgName={orgName} date={date} />
      </Page>

      {/* ── Priority Action Plan ──────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <SectionHeading title="Priority Action Plan" />

        {p1Items.length > 0 && (
          <View style={{ marginBottom: 18 }}>
            <Text style={[styles.priorityPill, { backgroundColor: PRIORITY_META.P1.bg, color: PRIORITY_META.P1.color }]}>
              {PRIORITY_META.P1.label} — before applying
            </Text>
            {p1Items.map((item, i) => (
              <GapCard key={i} gap={item} />
            ))}
          </View>
        )}

        {p2Items.length > 0 && (
          <View>
            <Text style={[styles.priorityPill, { backgroundColor: PRIORITY_META.P2.bg, color: PRIORITY_META.P2.color }]}>
              {PRIORITY_META.P2.label}
            </Text>
            {p2Items.map((item, i) => (
              <GapCard key={i} gap={item} />
            ))}
          </View>
        )}

        <Footer orgName={orgName} date={date} />
      </Page>

      {/* ── Control Area Findings — always starts its own page, so the
          heading never gets orphaned at the bottom of the priority page ── */}
      <Page size="A4" style={styles.page}>
        <SectionHeading title="Control Area Findings" />

        {controls.map((control) => {
          const section = SECTIONS.find((s) => s.id === control.section_id);
          return (
            <View key={control.section_id} style={{ marginBottom: 18 }}>
              {/* Only the header + summary are kept atomic (never split across
                  a page break) — the gap rows below flow freely, same as the
                  Priority Action Plan page, so a control area doesn't jump as
                  one rigid block and leave trailing whitespace behind it. */}
              <View wrap={false}>
                <View
                  style={[
                    styles.areaHeaderBand,
                    { backgroundColor: STATUS_BG[control.status], borderWidth: 1, borderColor: STATUS_BORDER[control.status] },
                  ]}
                >
                  <Text style={styles.areaHeaderTitle}>{section?.title ?? `Area ${control.section_id}`}</Text>
                  <View style={[styles.areaHeaderPill, { backgroundColor: "#FFFFFF" }]}>
                    <Text style={[styles.areaHeaderPillText, { color: STATUS_COLORS[control.status] }]}>
                      {STATUS_LABELS[control.status]} — {control.score}%
                    </Text>
                  </View>
                </View>
                <Text style={[styles.body, { marginBottom: 8 }]}>{control.summary}</Text>
              </View>
              {control.gaps.map((gap, i) => {
                const meta = PRIORITY_META[gap.priority];
                return (
                  <View key={i} wrap={false} style={{ flexDirection: "row", gap: 6, marginTop: 6, alignItems: "flex-start" }}>
                    <Text style={[styles.gapPriorityTag, { backgroundColor: meta.bg, color: meta.color }]}>
                      {gap.priority}
                    </Text>
                    <Text style={[styles.body, { flex: 1 }]}>{gap.issue} — {gap.why}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}

        <Footer orgName={orgName} date={date} />
      </Page>

      {/* ── Next Steps — own closing page ─────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <SectionHeading title="Next Steps" />

        <View style={{ marginBottom: 8 }}>
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>
              Address all P1 priority actions listed earlier — these are the most critical gaps that
              must be resolved before applying for Cyber Essentials certification.
            </Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>
              Work through P2 actions in parallel where possible. These are important but not
              immediate blockers.
            </Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>
              Once gaps are addressed, apply for official Cyber Essentials through an IASME-licensed
              Certification Body at iasme.co.uk/cyber-essentials/certified-assessors
            </Text>
          </View>
        </View>

        <Disclaimer />
        <Footer orgName={orgName} date={date} />
      </Page>
    </Document>
  );
}
