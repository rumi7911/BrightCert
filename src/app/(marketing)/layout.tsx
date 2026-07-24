// Every marketing route now supplies its own SignalNav/SignalFooter (see
// components/brightcert/signal-nav.tsx, signal-footer.tsx) as part of the
// "Signal & Paper" redesign, so this layout is just a pass-through. The
// previous shared Navbar/Footer/Eyebrow components they replaced have been
// removed. UTM attribution capture lives in proxy.ts (runs on every request,
// not just marketing pages) rather than here — see withAttributionCookie.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
