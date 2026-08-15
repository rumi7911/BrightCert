// @vitest-environment node

import { beforeEach, describe, expect, test, vi } from "vitest";
import { INITIAL_CONTACT_STATE } from "@/lib/contact/contact-form";
import { sendContactEmail } from "@/lib/resend/emails";
import { submitContactForm } from "./actions";

vi.mock("@/lib/resend/emails", () => ({
  sendContactEmail: vi.fn(),
}));

function validForm(overrides: Record<string, string> = {}) {
  const form = new FormData();
  const values = {
    name: "Aisha Rahman",
    email: "aisha@example.co.uk",
    organisation: "Northstar Services Ltd",
    enquiryType: "assessment-support",
    message: "Please help us understand our latest readiness results.",
    website: "",
    ...overrides,
  };

  Object.entries(values).forEach(([key, value]) => form.set(key, value));
  return form;
}

describe("contact form Server Action", () => {
  beforeEach(() => {
    vi.mocked(sendContactEmail).mockReset();
  });

  test("returns field errors without attempting delivery", async () => {
    const result = await submitContactForm(
      INITIAL_CONTACT_STATE,
      validForm({ email: "not-an-email" })
    );

    expect(result).toMatchObject({
      status: "error",
      fieldErrors: { email: "Enter a valid work email address." },
    });
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  test("silently accepts honeypot submissions without attempting delivery", async () => {
    const result = await submitContactForm(
      INITIAL_CONTACT_STATE,
      validForm({ website: "https://spam.example" })
    );

    expect(result).toMatchObject({ status: "success" });
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  test("delivers a valid submission and returns a safe confirmation", async () => {
    vi.mocked(sendContactEmail).mockResolvedValue(undefined);

    const result = await submitContactForm(INITIAL_CONTACT_STATE, validForm());

    expect(result).toEqual({
      status: "success",
      message: "Thanks, your message has been sent. We will reply by email as soon as possible.",
      fieldErrors: {},
      values: INITIAL_CONTACT_STATE.values,
    });
    expect(sendContactEmail).toHaveBeenCalledWith({
      name: "Aisha Rahman",
      email: "aisha@example.co.uk",
      organisation: "Northstar Services Ltd",
      enquiryType: "assessment-support",
      message: "Please help us understand our latest readiness results.",
    });
  });

  test("returns a recoverable message without exposing provider details", async () => {
    vi.mocked(sendContactEmail).mockRejectedValue(new Error("Daily quota exceeded"));

    const result = await submitContactForm(INITIAL_CONTACT_STATE, validForm());

    expect(result).toEqual({
      status: "error",
      message: "We could not send your message. Please try again or email hello@brightcert.co.uk.",
      fieldErrors: {},
      values: {
        name: "Aisha Rahman",
        email: "aisha@example.co.uk",
        organisation: "Northstar Services Ltd",
        enquiryType: "assessment-support",
        message: "Please help us understand our latest readiness results.",
      },
    });
    expect(result.message).not.toContain("quota");
  });
});
