import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brightcert.co.uk"),
  title: {
    default: "BrightCert — Cyber Essentials Readiness for UK SMEs",
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
    title: "BrightCert — Cyber Essentials Readiness for UK SMEs",
    description:
      "Guided Cyber Essentials readiness assessment, gap analysis, and remediation reports for UK businesses.",
    images: [{ url: "/logo.png", width: 1270, height: 630, alt: "BrightCert" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrightCert — Cyber Essentials Readiness for UK SMEs",
    description: "Guided Cyber Essentials readiness assessment for UK businesses.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={inter.className}>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
