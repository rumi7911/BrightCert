import { describe, expect, test } from "vitest";
import { parseContactForm } from "./contact-form";

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

describe("contact form validation", () => {
  test("normalises a valid submission without changing its meaning", () => {
    expect(
      parseContactForm(
        validForm({
          name: "  Aisha Rahman  ",
          email: "  aisha@example.co.uk  ",
          message: "  Please help us understand our latest readiness results.  ",
        })
      )
    ).toEqual({
      ok: true,
      spam: false,
      data: {
        name: "Aisha Rahman",
        email: "aisha@example.co.uk",
        organisation: "Northstar Services Ltd",
        enquiryType: "assessment-support",
        message: "Please help us understand our latest readiness results.",
      },
    });
  });

  test("accepts an omitted organisation", () => {
    expect(parseContactForm(validForm({ organisation: "" }))).toMatchObject({
      ok: true,
      data: { organisation: "" },
    });
  });

  test.each([
    ["name", "", "Enter your name."],
    ["name", "A", "Enter at least 2 characters."],
    ["email", "", "Enter your work email address."],
    ["email", "not-an-email", "Enter a valid work email address."],
    ["enquiryType", "", "Choose an enquiry type."],
    ["enquiryType", "unknown", "Choose an enquiry type."],
    ["message", "", "Enter a message."],
    ["message", "Too short", "Enter at least 10 characters."],
  ])("rejects invalid %s input", (field, value, message) => {
    const result = parseContactForm(validForm({ [field]: value }));

    expect(result).toMatchObject({
      ok: false,
      state: { fieldErrors: { [field]: message } },
    });
  });

  test.each([
    ["name", "N".repeat(101), "Keep your name to 100 characters or fewer."],
    ["email", `${"a".repeat(243)}@example.com`, "Keep your email address to 254 characters or fewer."],
    ["organisation", "O".repeat(121), "Keep the organisation name to 120 characters or fewer."],
    ["message", "M".repeat(5_001), "Keep your message to 5,000 characters or fewer."],
  ])("enforces the maximum length for %s", (field, value, message) => {
    const result = parseContactForm(validForm({ [field]: value }));

    expect(result).toMatchObject({
      ok: false,
      state: { fieldErrors: { [field]: message } },
    });
  });

  test.each(["name", "organisation"])("rejects control characters in %s", (field) => {
    const result = parseContactForm(validForm({ [field]: "Northstar\nBCC: victim@example.com" }));

    expect(result).toMatchObject({
      ok: false,
      state: { fieldErrors: { [field]: expect.any(String) } },
    });
  });

  test("preserves normalised values when validation fails", () => {
    const result = parseContactForm(
      validForm({
        name: "  Aisha Rahman  ",
        email: "not-an-email",
        organisation: "  Northstar Services Ltd  ",
      })
    );

    expect(result).toMatchObject({
      ok: false,
      state: {
        values: {
          name: "Aisha Rahman",
          email: "not-an-email",
          organisation: "Northstar Services Ltd",
        },
      },
    });
  });

  test("recognises the hidden website field as spam", () => {
    expect(parseContactForm(validForm({ website: "https://spam.example" }))).toMatchObject({
      ok: true,
      spam: true,
    });
  });
});
