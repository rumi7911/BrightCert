"use client";

import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";

// Fires checkout_started before navigating to the Stripe checkout route.
// results-view.tsx is a server component, so this is split out rather than
// adding an onClick directly to a server-rendered Link.
export function CheckoutLink({ assessmentId, children }: { assessmentId: string; children: React.ReactNode }) {
  return (
    <Button asChild size="lg" className="w-full sm:w-auto">
      <Link
        href={`/api/stripe/checkout?assessmentId=${assessmentId}`}
        onClick={() => sendGAEvent("event", "checkout_started")}
      >
        {children}
      </Link>
    </Button>
  );
}
