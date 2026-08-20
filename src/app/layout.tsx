import type { Metadata } from "next";
import { JsonLd } from "@/components/brightcert/json-ld";
import { Inter, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { AnalyticsConsent } from "@/components/brightcert/analytics-consent";
import "./globals.css";

// Brand faces use `swap` (also the next/font default) so the brand typography
// is always eventually shown. `optional` gives the browser roughly 100ms and
// then keeps the fallback for the whole page view without ever swapping, so a
// first-time visitor on a slow connection would never see Inter or Bricolage —
// which DESIGN-SYSTEM.md specifies as brand tokens. The layout-shift cost is
// accepted here deliberately; see the mono face below for the other trade.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  weight: ["500", "600", "700", "800"],
});

// Homepage-only mono texture (eyebrows, badges, quiz meta) — loaded globally
// since fonts must be registered at the root, but only referenced via
// `font-mono` on the homepage today.
//
// Kept on `optional`: this face carries small decorative labels rather than
// brand identity or reading copy, so silently falling back costs little and
// avoids shifting the eyebrow/badge rows that sit above the fold.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brightcert.co.uk"),
  title: {
    default: "Cyber Essentials Readiness Assessment for UK SMEs | BrightCert",
    template: "%s | BrightCert",
  },
  description:
    "Assess your Cyber Essentials readiness in around two hours. Get a score, identify gaps and unlock a practical remediation report for your UK SME.",
  keywords: ["Cyber Essentials", "UK SME", "cyber security", "compliance", "NCSC", "readiness assessment"],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://brightcert.co.uk",
    siteName: "BrightCert",
    title: "Cyber Essentials Readiness Assessment for UK SMEs | BrightCert",
    description: "Find out how ready you are for Cyber Essentials in around two hours.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Find out how ready you are in around 2 hours." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber Essentials Readiness Assessment for UK SMEs | BrightCert",
    description: "Find out how ready you are for Cyber Essentials in around two hours.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${bricolage.variable} ${jetbrainsMono.variable} ${inter.className}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://brightcert.co.uk/#organization",
                name: "BrightCert",
                url: "https://brightcert.co.uk",
                logo: "https://brightcert.co.uk/logo.png",
                sameAs: [
                  "https://www.linkedin.com/company/brightcert",
                  "https://www.crunchbase.com/organization/brightcert",
                  "https://www.wikidata.org/wiki/Q141136710",
                ],
                description:
                  "BrightCert helps UK SMEs prepare for Cyber Essentials with guided assessments, readiness scoring, gap analysis, and practical remediation reports. BrightCert does not issue official Cyber Essentials certification.",
                email: "hello@brightcert.co.uk",
                foundingDate: "2026-06-06",
                founder: {
                  "@type": "Person",
                  "@id": "https://brightcert.co.uk/about#person",
                  name: "Muhammad Sohaib Roomi",
                  url: "https://brightcert.co.uk/about",
                  sameAs: [
                    "https://www.linkedin.com/in/muhammad-sohaib-roomi",
                    "https://www.crunchbase.com/person/muhammad-sohaib-roomi",
                  ],
                },
                parentOrganization: {
                  "@type": "Organization",
                  name: "Cognumi Ltd",
                  identifier: "17265250",
                  foundingDate: "2026-06-06",
                  sameAs: ["https://www.wikidata.org/wiki/Q141136710"],
                },
                areaServed: { "@type": "Country", name: "United Kingdom" },
              },
              {
                "@type": "WebSite",
                "@id": "https://brightcert.co.uk/#website",
                url: "https://brightcert.co.uk",
                name: "BrightCert",
                publisher: { "@id": "https://brightcert.co.uk/#organization" },
                inLanguage: "en-GB",
              },
            ],
          }}
        />
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
