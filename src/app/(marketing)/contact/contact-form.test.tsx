import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { INITIAL_CONTACT_STATE } from "@/lib/contact/contact-form";
import { submitContactForm } from "./actions";
import { ContactForm } from "./contact-form";

vi.mock("./actions", () => ({
  submitContactForm: vi.fn(),
}));

afterEach(cleanup);

describe("ContactForm", () => {
  beforeEach(() => {
    vi.mocked(submitContactForm).mockReset();
  });

  test("provides labelled fields, enquiry choices, privacy context and a submit action", () => {
    render(<ContactForm />);

    expect(screen.getByRole("textbox", { name: "Name" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Work email" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Organisation (optional)" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Enquiry type" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Message" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Send message" })).toBeTruthy();
    expect(screen.getByText(/used only to reply/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Privacy Policy" }).getAttribute("href")).toBe("/privacy");
    expect(screen.getByRole("button", { name: "Send message" }).closest("form")?.noValidate).toBe(false);
  });

  test("shows field errors and retains visitor input after validation fails", async () => {
    vi.mocked(submitContactForm).mockResolvedValue({
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: { email: "Enter a valid work email address." },
      values: {
        name: "Aisha Rahman",
        email: "not-an-email",
        organisation: "Northstar Services Ltd",
        enquiryType: "assessment-support",
        message: "Please help us understand our latest readiness results.",
      },
    });
    render(<ContactForm />);

    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "Aisha Rahman" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Work email" }), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Message" }), {
      target: { value: "Please help us understand our latest readiness results." },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Send message" }).closest("form")!);

    await waitFor(() => expect(screen.getByText("Enter a valid work email address.")).toBeTruthy());
    expect(screen.getByRole("textbox", { name: "Work email" }).getAttribute("aria-invalid")).toBe("true");
    expect((screen.getByRole("textbox", { name: "Name" }) as HTMLInputElement).value).toBe("Aisha Rahman");
  });

  test("announces success and resets the fields after delivery", async () => {
    vi.mocked(submitContactForm).mockResolvedValue({
      ...INITIAL_CONTACT_STATE,
      status: "success",
      message: "Thanks, your message has been sent. We will reply by email as soon as possible.",
    });
    render(<ContactForm />);

    const name = screen.getByRole("textbox", { name: "Name" }) as HTMLInputElement;
    const email = screen.getByRole("textbox", { name: "Work email" }) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Aisha Rahman" } });
    fireEvent.change(email, { target: { value: "aisha@example.co.uk" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Message" }), {
      target: { value: "Please help us understand our latest readiness results." },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Send message" }).closest("form")!);

    const status = await screen.findByRole("status");
    expect(status.textContent).toContain("Thanks, your message has been sent.");
    await waitFor(() => expect(name.value).toBe(""));
    expect(email.value).toBe("");
  });
});
