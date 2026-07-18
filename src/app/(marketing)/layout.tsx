"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/brightcert/navbar";
import { Footer } from "@/components/brightcert/footer";

// Routes already migrated to the "Signal & Paper" design supply their own
// SignalNav/SignalFooter (see components/brightcert/signal-nav.tsx,
// signal-footer.tsx) and skip the old shared chrome here. Add a route to
// this list as each page gets migrated; once every route is covered, this
// whole pathname check — and the old Navbar/Footer — can be retired.
const SIGNAL_ROUTES = [
  "/",
  "/pricing",
  "/how-it-works",
  "/faq",
  "/blog",
  "/blog/what-is-cyber-essentials",
  "/blog/ce-vs-ce-plus",
  "/blog/iasme-tool-vs-brightcert",
  "/blog/cyber-essentials-cost",
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (SIGNAL_ROUTES.includes(pathname)) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
