"use client";

import { useEffect } from "react";

export const ATTRIBUTION_STORAGE_KEY = "bc_attribution";

// First-touch UTM capture: records where a visitor first arrived from and
// never overwrites it, so a later unrelated link click doesn't steal credit
// from the campaign that actually brought them here.
export function AttributionCapture() {
  useEffect(() => {
    if (localStorage.getItem(ATTRIBUTION_STORAGE_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const utm_source = params.get("utm_source");
    const utm_medium = params.get("utm_medium");
    const utm_campaign = params.get("utm_campaign");

    if (!utm_source && !utm_medium && !utm_campaign) return;

    localStorage.setItem(
      ATTRIBUTION_STORAGE_KEY,
      JSON.stringify({ utm_source, utm_medium, utm_campaign })
    );
  }, []);

  return null;
}
