import { afterEach, expect, test, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { AnalyticsConsent } from "./analytics-consent";

vi.mock("@next/third-parties/google", () => ({
  GoogleAnalytics: () => <div data-testid="google-analytics" />,
  sendGAEvent: vi.fn(),
}));

afterEach(() => {
  document.cookie = "bc_consent=; path=/; max-age=0";
  document.cookie = "bc_attribution=; path=/; max-age=0";
  window.history.replaceState({}, "", "/");
});

test("captures a new campaign for a previously consented visitor", async () => {
  document.cookie = "bc_consent=granted; path=/";
  window.history.replaceState({}, "", "/?utm_source=linkedin&utm_campaign=august");

  render(<AnalyticsConsent />);

  await waitFor(() => expect(document.cookie).toContain("bc_attribution="));
});
