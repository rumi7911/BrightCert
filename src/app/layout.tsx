import type { Metadata } from "next";
import { JsonLd } from "@/components/brightcert/json-ld";
import { Inter, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brightcert.co.uk"),
  alternates: { canonical: "./" },
  title: {
    default: "BrightCert | Cyber Essentials Readiness for UK SMEs",
    template: "%s | BrightCert",
  },
  description:
    "AI-powered Cyber Essentials readiness assessment for UK small and medium businesses. Understand your gaps, get a score, unlock a practical remediation report.",
  keywords: ["Cyber Essentials", "UK SME", "cyber security", "compliance", "NCSC", "readiness assessment"],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://brightcert.co.uk",
    siteName: "BrightCert",
    title: "BrightCert | Cyber Essentials Readiness for UK SMEs",
    description:
      "Guided Cyber Essentials readiness assessment, gap analysis, and remediation reports for UK businesses.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "BrightCert | Get Cyber Essentials ready in 2 hours" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrightCert | Cyber Essentials Readiness for UK SMEs",
    description: "Guided Cyber Essentials readiness assessment for UK businesses.",
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
                sameAs: ["https://www.linkedin.com/company/brightcert"],
                description:
                  "BrightCert helps UK SMEs prepare for Cyber Essentials with guided assessments, readiness scoring, gap analysis, and practical remediation reports. BrightCert does not issue official Cyber Essentials certification.",
                email: "hello@brightcert.co.uk",
                foundingDate: "2026",
                founder: { "@type": "Person", name: "Muhammad Sohaib Roomi" },
                parentOrganization: { "@type": "Organization", name: "Cognumi Ltd" },
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
      </body>
    </html>
  );
}
