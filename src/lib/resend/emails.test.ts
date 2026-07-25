import { describe, expect, test } from "vitest";
import { throwIfResendError } from "./emails";

describe("Resend responses", () => {
  test("throws the API error returned alongside a successful transport response", () => {
    const error = { message: "Daily quota exceeded", name: "rate_limit_exceeded" };

    expect(() => throwIfResendError({ data: null, error })).toThrow("Daily quota exceeded");
  });

  test("accepts a successful API response", () => {
    expect(() => throwIfResendError({ data: { id: "email_123" }, error: null })).not.toThrow();
  });
});
