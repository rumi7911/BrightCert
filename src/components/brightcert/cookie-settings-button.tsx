"use client";

import { Button } from "@/components/ui/button";
import { reopenConsent } from "@/lib/analytics/consent";

export function CookieSettingsButton() {
  return (
    <Button type="button" size="sm" variant="outline" onClick={reopenConsent}>
      Cookie settings
    </Button>
  );
}
