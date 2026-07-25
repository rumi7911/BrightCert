import { describe, expect, test } from "vitest";
import { readSignupAttribution } from "./signup-attribution";

describe("signup attribution", () => {
  test("maps consented first and last touch values into organisation columns", () => {
    expect(
      readSignupAttribution(
        encodeURIComponent(
          JSON.stringify({
            first_touch: { utm_source: "email", utm_campaign: "launch" },
            last_touch: { utm_source: "linkedin", utm_content: "founder-post" },
            utm_source: "linkedin",
            utm_content: "founder-post",
          })
        )
      )
    ).toEqual({
      utm_source: "linkedin",
      utm_medium: null,
      utm_campaign: null,
      utm_content: "founder-post",
      first_utm_source: "email",
      first_utm_medium: null,
      first_utm_campaign: "launch",
      first_utm_content: null,
      last_utm_source: "linkedin",
      last_utm_medium: null,
      last_utm_campaign: null,
      last_utm_content: "founder-post",
    });
  });

  test("treats a valid legacy flat cookie as both first and last touch", () => {
    expect(readSignupAttribution(JSON.stringify({ utm_source: "newsletter" }))).toMatchObject({
      utm_source: "newsletter",
      first_utm_source: "newsletter",
      last_utm_source: "newsletter",
    });
  });
});
