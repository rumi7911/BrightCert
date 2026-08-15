import { describe, expect, test } from "vitest";
import type { ContactSubmission } from "@/lib/contact/contact-form";
import { FROM_EMAIL } from "./client";
import { buildContactEmail, throwIfResendError } from "./emails";

const submission: ContactSubmission = {
  name: "Aisha Rahman",
  email: "aisha@example.co.uk",
  organisation: "Northstar Services Ltd",
  enquiryType: "assessment-support",
  message: "Please help us understand our latest readiness results.",
};

describe("Resend responses", () => {
  test("throws the API error returned alongside a successful transport response", () => {
    const error = { message: "Daily quota exceeded", name: "rate_limit_exceeded" };

    expect(() => throwIfResendError({ data: null, error })).toThrow("Daily quota exceeded");
  });

  test("accepts a successful API response", () => {
    expect(() => throwIfResendError({ data: { id: "email_123" }, error: null })).not.toThrow();
  });
});

describe("contact enquiry email", () => {
  test("uses BrightCert-owned delivery addresses and the visitor only as reply-to", () => {
    expect(buildContactEmail(submission)).toMatchObject({
      from: FROM_EMAIL,
      to: "hello@brightcert.co.uk",
      replyTo: "aisha@example.co.uk",
      subject: "Assessment support enquiry from Aisha Rahman",
    });
  });

  test("escapes visitor HTML before adding it to the message body", () => {
    const email = buildContactEmail({
      ...submission,
      name: "Aisha <Admin>",
      organisation: "Northstar & Partners",
      message: "<script>alert('bad')</script>\nSecond line",
    });

    expect(email.html).toContain("Aisha &lt;Admin&gt;");
    expect(email.html).toContain("Northstar &amp; Partners");
    expect(email.html).toContain("&lt;script&gt;alert(&#39;bad&#39;)&lt;/script&gt;<br>Second line");
    expect(email.html).not.toContain("<script>");
  });

  test("omits an empty organisation rather than inventing a value", () => {
    const email = buildContactEmail({ ...submission, organisation: "" });

    expect(email.html).not.toContain("Organisation</td>");
  });
});
