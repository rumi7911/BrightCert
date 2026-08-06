import fs from "node:fs";
import path from "node:path";
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import {
  BRAND_COLORS,
  REPORT_FONTS,
} from "../brand-tokens";

const styles = StyleSheet.create({
  header: {
    minHeight: 48,
    marginBottom: 28,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: BRAND_COLORS.navy,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  logoTile: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: BRAND_COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 22,
    height: 22,
    objectFit: "contain",
  },
  wordmark: {
    fontFamily: REPORT_FONTS.headline,
    fontSize: 17,
    fontWeight: 600,
    letterSpacing: -0.5,
  },
  wordmarkBright: {
    color: BRAND_COLORS.white,
  },
  wordmarkCert: {
    color: BRAND_COLORS.emeraldLight,
  },
  metadata: {
    maxWidth: 210,
    fontFamily: REPORT_FONTS.metadata,
    fontSize: 7,
    fontWeight: 700,
    lineHeight: 1.45,
    letterSpacing: 0.7,
    textAlign: "right",
    textTransform: "uppercase",
    color: "#9AABC3",
  },
});

// Deliberately a separate, small asset rather than the 512px `logo-mark.png`
// the web UI uses. `@react-pdf` cannot share one image across pages: the
// decode cache keys on the src string and returns null for a Buffer
// (`@react-pdf/image` getCacheKey), and the renderer hands pdfkit
// `node.image.data`, a Buffer, so pdfkit's string-keyed `_imageRegistry`
// never matches either. Every page therefore embeds its own copy, and the
// only lever on report size is how big that copy is.
//
// 96px renders the 22pt logo at roughly 314 DPI. At 512px the header logo
// alone was 94.7% of a 3.86 MB report.
let logoMark: Buffer | null = null;

try {
  logoMark = fs.readFileSync(
    path.join(process.cwd(), "public", "logo-mark-report.png")
  );
} catch {
  logoMark = null;
}

type BrandHeaderProps = {
  reportLabel: string;
  generatedAt: string;
};

export function BrandHeader({
  reportLabel,
  generatedAt,
}: BrandHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <View style={styles.logoTile}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- PDF images have no DOM alt-text API */}
          {logoMark && <Image src={logoMark} style={styles.logo} />}
        </View>
        <Text style={styles.wordmark}>
          <Text style={styles.wordmarkBright}>Bright</Text>
          <Text style={styles.wordmarkCert}>Cert</Text>
        </Text>
      </View>
      <Text style={styles.metadata}>
        {reportLabel}
        {"\n"}
        {generatedAt}
      </Text>
    </View>
  );
}
