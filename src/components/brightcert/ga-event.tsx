"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

// Fires a GA4 event once when a query param is present on arrival — used for
// one-off lifecycle events (sign_up, assessment_started, reminder_clicked,
// purchase) that a link or redirect flags with a query param, so re-visiting
// or refreshing the destination page later doesn't refire it.
//
// Pass `value` for an exact-match flag (e.g. `?signup=1`). Omit it to fire
// on any non-empty value (e.g. `?session_id=<the actual Stripe session id>`,
// which is only known at runtime).
//
// After firing, the param is stripped from the URL via history.replaceState
// — a plain refresh no longer has it, which is the real fix for the
// refire-on-refresh bug (transaction_id/session_id dedup in GA4 itself is a
// second, independent safety net for the purchase event specifically).
export function GatedGaEvent({
  param,
  value,
  event,
  params,
}: {
  param: string;
  value?: string;
  event: string;
  params?: Record<string, string | number>;
}) {
  useEffect(() => {
    const url = new URL(window.location.href);
    const actual = url.searchParams.get(param);
    if (actual === null) return;
    if (value !== undefined && actual !== value) return;

    sendGAEvent("event", event, params ?? {});

    url.searchParams.delete(param);
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once on mount only, not on every params identity change
  }, []);

  return null;
}
