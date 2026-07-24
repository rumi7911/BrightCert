"use client";

import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";

// Fires begin_checkout before navigating to the Stripe checkout route. The
// pages that need this (results, dashboard) are server components, so this
// is split out rather than adding an onClick directly to a server-rendered
// Link — wrap it in <Button asChild> at the call site for styling, same as
// any other Link-as-child-of-Button usage in this codebase.
export function CheckoutLink({
  assessmentId,
  className,
  children,
}: {
  assessmentId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/api/stripe/checkout?assessmentId=${assessmentId}`}
      className={className}
      onClick={() => sendGAEvent("event", "begin_checkout")}
    >
      {children}
    </Link>
  );
}
