import path from "node:path";
import { Font } from "@react-pdf/renderer";

export const BRAND_COLORS = {
  navy: "#0F2044",
  navyDark: "#08152E",
  emerald: "#047857",
  emeraldLight: "#6EE7B7",
  paper: "#F4F6F3",
  white: "#FFFFFF",
  ink: "#16223A",
  slate: "#475569",
  muted: "#778398",
  line: "#D8DEE7",
  risk: "#B91C1C",
  riskBackground: "#FEF2F2",
  warning: "#B45309",
  warningBackground: "#FFFBEB",
} as const;

export const REPORT_FONTS = {
  headline: "Bricolage Grotesque",
  body: "Inter",
  metadata: "JetBrains Mono",
} as const;

export const REPORT_LAYOUT = {
  pagePaddingHorizontal: 40,
  footerBottom: 22,
  footerGap: 12,
  footerPageNumberWidth: 64,
  maximumFooterOrganisationLength: 72,
} as const;

export const PRIORITY_STYLE = {
  P1: {
    color: BRAND_COLORS.risk,
    backgroundColor: BRAND_COLORS.riskBackground,
  },
  P2: {
    color: BRAND_COLORS.warning,
    backgroundColor: BRAND_COLORS.warningBackground,
  },
  P3: {
    color: BRAND_COLORS.slate,
    backgroundColor: "#F0F2F5",
  },
} as const;

const fontDirectory = path.join(process.cwd(), "public", "fonts");

Font.register({
  family: REPORT_FONTS.headline,
  fonts: [
    {
      src: path.join(fontDirectory, "BricolageGrotesque-Regular.woff"),
      fontWeight: 400,
    },
    {
      src: path.join(fontDirectory, "BricolageGrotesque-SemiBold.woff"),
      fontWeight: 600,
    },
  ],
});

Font.register({
  family: REPORT_FONTS.body,
  fonts: [
    {
      src: path.join(fontDirectory, "Inter-Regular.woff"),
      fontWeight: 400,
    },
    {
      src: path.join(fontDirectory, "Inter-SemiBold.woff"),
      fontWeight: 600,
    },
  ],
});

Font.register({
  family: REPORT_FONTS.metadata,
  fonts: [
    {
      src: path.join(fontDirectory, "JetBrainsMono-Regular.woff"),
      fontWeight: 400,
    },
    {
      src: path.join(fontDirectory, "JetBrainsMono-Bold.woff"),
      fontWeight: 700,
    },
  ],
});
