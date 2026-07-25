"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";
import {
  type Consent,
  captureAttributionIfPresent,
  enableAnalyticsEvents,
  readConsent,
  writeConsent,
  onReopenConsent,
} from "@/lib/analytics/consent";

const GA_ID = "G-YW9BG1DXPC";

// GA4 only ever loads after explicit accept — no script, no cookies, no
// tracking until then. Accepting also captures first-touch UTM attribution
// (see captureAttributionIfPresent) — declining or not deciding means
// neither GA nor attribution runs. See privacy policy "Cookies" section.
// Reachable again any time via "Cookie Settings" (footer / /settings).
export function AnalyticsConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const existingConsent = readConsent();
    // One-time reads on mount, not an ongoing sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(existingConsent);
    setReady(true);
    if (existingConsent === "granted") {
      enableAnalyticsEvents();
      captureAttributionIfPresent();
    }

    return onReopenConsent(() => setOpen(true));
  }, []);

  if (!ready) return null;

  const showBanner = consent === null || open;

  if (showBanner) {
    return (
      <div
        role="dialog"
        aria-label="Cookie consent"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E2E8F0] bg-white px-4 py-4 shadow-[0_-4px_16px_rgba(15,32,68,0.08)] sm:px-6"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] leading-relaxed text-[#33405C]">
            We use cookies for analytics and to understand which campaign brought you here. See our{" "}
            <Link href="/privacy" className="bc-focus font-semibold text-[#047857] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex shrink-0 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                writeConsent("denied");
                setConsent("denied");
                setOpen(false);
              }}
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={() => {
                writeConsent("granted");
                captureAttributionIfPresent();
                setConsent("granted");
                setOpen(false);
              }}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return consent === "granted" ? <GoogleAnalytics gaId={GA_ID} /> : null;
}
