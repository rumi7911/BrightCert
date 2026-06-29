"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Refreshes the server component every 5 seconds until the PDF is ready.
// Parent passes pdfReady=true once the GCS URL exists; this component stops polling.
export function PdfPoller({ pdfReady }: { pdfReady: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (pdfReady) return;
    const id = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(id);
  }, [pdfReady, router]);

  return null;
}
