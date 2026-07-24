"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

// Fires a one-off GA4 event when this mounts. Safe to use on a page that
// re-renders via router.refresh() (e.g. PdfPoller) — React keeps the client
// component instance alive across a server refresh, so the empty-deps effect
// only fires once per real navigation, not once per poll.
export function GaEvent({ event, params }: { event: string; params?: Record<string, string | number> }) {
  useEffect(() => {
    sendGAEvent("event", event, params ?? {});
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once on mount only, not on every params identity change
  }, []);

  return null;
}
