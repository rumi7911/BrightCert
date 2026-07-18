"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/brightcert/navbar";
import { Footer } from "@/components/brightcert/footer";

// The homepage supplies its own bespoke nav + footer (see home/home-nav.tsx,
// home/home-footer.tsx) to match its distinct "Signal & Paper" design.
// Every other marketing route keeps the shared chrome unchanged.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/") return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
