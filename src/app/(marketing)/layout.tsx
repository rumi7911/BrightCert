// Every marketing route now supplies its own SignalNav/SignalFooter (see
// components/brightcert/signal-nav.tsx, signal-footer.tsx) as part of the
// "Signal & Paper" redesign, so this layout is just a pass-through. The
// previous shared Navbar/Footer/Eyebrow components they replaced have been
// removed. UTM attribution capture is consent-gated client-side (see
// src/lib/analytics/consent.ts, mounted site-wide via AnalyticsConsent in
// the root layout) rather than done here or in proxy.ts.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
