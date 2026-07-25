"use client";

import { useEffect } from "react";
import { readConsent, onConsentChange, sendConsentedGAEvent, waitForDataLayer } from "@/lib/analytics/consent";

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
//
// GA4 only loads after the user accepts the cookie consent banner (see
// AnalyticsConsent), so this can't just fire+strip unconditionally on mount
// — sendGAEvent silently no-ops until window.dataLayer exists, and if we'd
// already stripped the flag, that conversion would be lost forever the
// moment consent isn't yet granted. Wait for a real decision (and, once
// granted, for dataLayer to actually exist) before firing or stripping.
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

    function strip() {
      const u = new URL(window.location.href);
      u.searchParams.delete(param);
      window.history.replaceState({}, "", u.pathname + u.search + u.hash);
    }

    async function fireAndStrip() {
      if (await waitForDataLayer()) sendConsentedGAEvent(event, params ?? {});
      strip();
    }

    const consent = readConsent();
    if (consent === "granted") {
      fireAndStrip();
      return;
    }
    if (consent === "denied") {
      strip();
      return;
    }

    // Not decided yet — hold the flag in the URL rather than stripping it
    // blind, and act once the user actually chooses.
    const unsubscribe = onConsentChange((next) => {
      unsubscribe();
      if (next === "granted") fireAndStrip();
      else strip();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once on mount + react to a single consent decision, not every params identity change
  }, []);

  return null;
}
