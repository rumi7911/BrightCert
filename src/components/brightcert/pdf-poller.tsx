"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Refreshes the server component every 5 seconds until the PDF is ready.
// Parent passes pdfReady=true once the GCS URL exists; this component stops polling.
//
// Also refreshes once immediately on mount, regardless of pdfReady: this
// page's own fallback payment-verification (see report/page.tsx) updates
// the assessment's status mid-render when a user arrives fresh from
// Stripe, but the sidebar's data comes from a separate parent layout that
// Next.js fetches concurrently — it can render from the still-"analysed"
// status a moment before this page's own update lands, showing a stale
// "Unlock" CTA next to an already-unlocked report. Refreshing right after
// mount corrects that within one round trip instead of waiting up to 5s
// (or never, if the PDF happened to already be ready on first render).
export function PdfPoller({ pdfReady }: { pdfReady: boolean }) {
  const router = useRouter();
  const refreshedOnMount = useRef(false);

  useEffect(() => {
    if (refreshedOnMount.current) return;
    refreshedOnMount.current = true;
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (pdfReady) return;
    const id = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(id);
  }, [pdfReady, router]);

  return null;
}
