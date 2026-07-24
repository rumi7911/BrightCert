"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

// Fires a GA4 event once on mount. Safe on a page that re-renders via
// router.refresh() (e.g. PdfPoller) — React keeps the client component
// instance alive across a server refresh, so the empty-deps effect only
// fires once per real navigation, not once per poll.
export function GaEvent({ event, params }: { event: string; params?: Record<string, string | number> }) {
  useEffect(() => {
    sendGAEvent("event", event, params ?? {});
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once on mount only, not on every params identity change
  }, []);

  return null;
}

// Same, but only fires if `?<param>=<value>` is present on the current URL —
// used for one-off lifecycle events (signup_completed, assessment_started,
// reminder_clicked) that a link or redirect flags with a query param on
// arrival, so re-visiting the destination page later doesn't refire it.
export function GatedGaEvent({ param, value = "1", event }: { param: string; value?: string; event: string }) {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get(param) !== value) return;
    sendGAEvent("event", event);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once on mount only
  }, []);

  return null;
}
