"use client";

import Link from "next/link";
import { sendConsentedGAEvent } from "@/lib/analytics/consent";

// Fires begin_checkout before navigating to the Stripe checkout route. The
// pages that need this (results, dashboard) are server components, so this
// is split out rather than adding an onClick directly to a server-rendered
// Link — wrap it in <Button asChild> at the call site for styling, same as
// any other Link-as-child-of-Button usage in this codebase.
export function CheckoutLink({
  assessmentId,
  className,
  title,
  children,
}: {
  assessmentId: string;
  className?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/api/stripe/checkout?assessmentId=${assessmentId}`}
      className={className}
      title={title}
      onClick={() => sendConsentedGAEvent("begin_checkout")}
    >
      {children}
    </Link>
  );
}
