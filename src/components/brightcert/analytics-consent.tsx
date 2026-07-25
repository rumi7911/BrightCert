"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";

const CONSENT_COOKIE = "bc_consent";
const GA_ID = "G-YW9BG1DXPC";

type Consent = "granted" | "denied";

function readConsent(): Consent | null {
  const match = document.cookie.match(/(?:^|; )bc_consent=([^;]*)/);
  const value = match?.[1];
  return value === "granted" || value === "denied" ? value : null;
}

function writeConsent(value: Consent) {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=31536000; samesite=lax`;
}

// GA4 only ever loads after explicit accept — no script, no cookies, no
// tracking until then. See privacy policy "Cookies" section.
export function AnalyticsConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time cookie read on mount, not an ongoing sync
    setConsent(readConsent());
    setReady(true);
  }, []);

  if (!ready) return null;

  if (consent === null) {
    return (
      <div
        role="dialog"
        aria-label="Cookie consent"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E2E8F0] bg-white px-4 py-4 shadow-[0_-4px_16px_rgba(15,32,68,0.08)] sm:px-6"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] leading-relaxed text-[#33405C]">
            We use analytics cookies to understand how visitors use this site. See our{" "}
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
              }}
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={() => {
                writeConsent("granted");
                setConsent("granted");
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
