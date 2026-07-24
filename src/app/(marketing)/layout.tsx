// Every marketing route now supplies its own SignalNav/SignalFooter (see
// components/brightcert/signal-nav.tsx, signal-footer.tsx) as part of the
// "Signal & Paper" redesign, so this layout is just a pass-through. The
// previous shared Navbar/Footer/Eyebrow components they replaced have been
// removed.
import { AttributionCapture } from "@/components/brightcert/attribution-capture";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AttributionCapture />
      {children}
    </>
  );
}
