"use client";

import Link from "next/link";
import { useMagnetic } from "./motion-hooks";

// Generic magnetic CTA wrapper used across the homepage (hero, solution,
// report, pricing, final CTA). Internal routes use next/link for client-side
// nav; in-page "#anchor" links stay as plain anchors.
export function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useMagnetic<HTMLAnchorElement>();

  if (href.startsWith("#")) {
    return (
      <a ref={ref} href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link ref={ref} href={href} className={className}>
      {children}
    </Link>
  );
}
