"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { Loader2, Send } from "lucide-react";
import { ENQUIRY_TYPES, INITIAL_CONTACT_STATE } from "@/lib/contact/contact-form";
import { submitContactForm } from "./actions";

const fieldClassName =
  "mt-2 min-h-11 w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3.5 text-[15px] text-[#0F172A] outline-none transition-colors placeholder:text-[#64748B] focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/25 aria-[invalid=true]:border-[#B91C1C] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#B91C1C]/15";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, INITIAL_CONTACT_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  const error = (field: keyof typeof state.fieldErrors) => state.fieldErrors[field];

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-semibold text-[#0F2044]">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          defaultValue={state.values.name}
          aria-invalid={Boolean(error("name"))}
          aria-describedby={error("name") ? "contact-name-error" : undefined}
          className={fieldClassName}
          placeholder="Your name"
        />
        {error("name") && (
          <p id="contact-name-error" className="mt-1.5 text-sm font-medium text-[#B91C1C]">
            {error("name")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-semibold text-[#0F2044]">
          Work email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          defaultValue={state.values.email}
          aria-invalid={Boolean(error("email"))}
          aria-describedby={error("email") ? "contact-email-error" : undefined}
          className={fieldClassName}
          placeholder="you@company.co.uk"
        />
        {error("email") && (
          <p id="contact-email-error" className="mt-1.5 text-sm font-medium text-[#B91C1C]">
            {error("email")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-organisation" className="block text-sm font-semibold text-[#0F2044]">
          Organisation <span className="font-normal text-[#64748B]">(optional)</span>
        </label>
        <input
          id="contact-organisation"
          name="organisation"
          type="text"
          autoComplete="organization"
          maxLength={120}
          defaultValue={state.values.organisation}
          aria-invalid={Boolean(error("organisation"))}
          aria-describedby={error("organisation") ? "contact-organisation-error" : undefined}
          className={fieldClassName}
          placeholder="Your organisation"
        />
        {error("organisation") && (
          <p id="contact-organisation-error" className="mt-1.5 text-sm font-medium text-[#B91C1C]">
            {error("organisation")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-enquiry" className="block text-sm font-semibold text-[#0F2044]">
          Enquiry type
        </label>
        <select
          id="contact-enquiry"
          name="enquiryType"
          required
          defaultValue={state.values.enquiryType}
          aria-invalid={Boolean(error("enquiryType"))}
          aria-describedby={error("enquiryType") ? "contact-enquiry-error" : undefined}
          className={fieldClassName}
        >
          <option value="">Choose a topic</option>
          {Object.entries(ENQUIRY_TYPES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {error("enquiryType") && (
          <p id="contact-enquiry-error" className="mt-1.5 text-sm font-medium text-[#B91C1C]">
            {error("enquiryType")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-[#0F2044]">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5_000}
          rows={7}
          defaultValue={state.values.message}
          aria-invalid={Boolean(error("message"))}
          aria-describedby={error("message") ? "contact-message-error" : "contact-message-help"}
          className={`${fieldClassName} resize-y py-3 leading-relaxed`}
          placeholder="Tell us what you need help with"
        />
        {error("message") ? (
          <p id="contact-message-error" className="mt-1.5 text-sm font-medium text-[#B91C1C]">
            {error("message")}
          </p>
        ) : (
          <p id="contact-message-help" className="mt-1.5 text-xs text-[#64748B]">
            Please do not include passwords or other sensitive information.
          </p>
        )}
      </div>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.message && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-[8px] border px-4 py-3 text-sm leading-relaxed ${
            state.status === "success"
              ? "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]"
              : "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]"
          }`}
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#047857] px-5 text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(4,120,87,0.65)] transition-colors hover:bg-[#065F46] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
        {pending ? "Sending..." : "Send message"}
      </button>

      <p className="text-xs leading-relaxed text-[#64748B]">
        Your details are used only to reply to your enquiry. Read our{" "}
        <Link href="/privacy" className="font-semibold text-[#047857] underline underline-offset-2 hover:text-[#065F46]">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
