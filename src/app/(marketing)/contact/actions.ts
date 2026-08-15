"use server";

import {
  INITIAL_CONTACT_STATE,
  parseContactForm,
  type ContactFormState,
} from "@/lib/contact/contact-form";
import { sendContactEmail } from "@/lib/resend/emails";

const SUCCESS_MESSAGE =
  "Thanks, your message has been sent. We will reply by email as soon as possible.";

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = parseContactForm(formData);

  if (!parsed.ok) return parsed.state;

  if (parsed.spam) {
    return {
      status: "success",
      message: SUCCESS_MESSAGE,
      fieldErrors: {},
      values: INITIAL_CONTACT_STATE.values,
    };
  }

  try {
    await sendContactEmail(parsed.data);
    return {
      status: "success",
      message: SUCCESS_MESSAGE,
      fieldErrors: {},
      values: INITIAL_CONTACT_STATE.values,
    };
  } catch {
    return {
      status: "error",
      message: "We could not send your message. Please try again or email hello@brightcert.co.uk.",
      fieldErrors: {},
      values: {
        name: parsed.data.name,
        email: parsed.data.email,
        organisation: parsed.data.organisation,
        enquiryType: parsed.data.enquiryType,
        message: parsed.data.message,
      },
    };
  }
}
