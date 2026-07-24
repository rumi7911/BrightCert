"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";

// Wraps the "Begin Assessment" submit button so the click fires a GA4 event
// before the server action (createAssessment) runs. Doesn't intercept the
// submit — just a side-effect alongside the native form POST.
export function StartAssessmentButton() {
  return (
    <Button
      type="submit"
      size="lg"
      className="w-full"
      onClick={() => sendGAEvent("event", "assessment_started")}
    >
      Begin Assessment
    </Button>
  );
}
