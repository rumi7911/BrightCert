export const ENQUIRY_TYPES = {
  "product-question": "Product question",
  "assessment-support": "Assessment support",
  "billing-reports": "Billing and reports",
  partnerships: "Partnerships",
  privacy: "Privacy",
  other: "Something else",
} as const;

export type EnquiryType = keyof typeof ENQUIRY_TYPES;
export type ContactField = "name" | "email" | "organisation" | "enquiryType" | "message";

export type ContactSubmission = {
  name: string;
  email: string;
  organisation: string;
  enquiryType: EnquiryType;
  message: string;
};

export type ContactFormValues = Record<ContactField, string>;

export type ContactFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: Partial<Record<ContactField, string>>;
  values: ContactFormValues;
};

export type ContactParseResult =
  | { ok: true; spam: boolean; data: ContactSubmission }
  | { ok: false; state: ContactFormState };

export const INITIAL_CONTACT_STATE: ContactFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: {
    name: "",
    email: "",
    organisation: "",
    enquiryType: "",
    message: "",
  },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/;

function text(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function isEnquiryType(value: string): value is EnquiryType {
  return Object.hasOwn(ENQUIRY_TYPES, value);
}

export function parseContactForm(formData: FormData): ContactParseResult {
  const values: ContactFormValues = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    organisation: text(formData, "organisation"),
    enquiryType: text(formData, "enquiryType"),
    message: text(formData, "message"),
  };

  if (text(formData, "website")) {
    return {
      ok: true,
      spam: true,
      data: {
        name: values.name,
        email: values.email,
        organisation: values.organisation,
        enquiryType: isEnquiryType(values.enquiryType) ? values.enquiryType : "other",
        message: values.message,
      },
    };
  }

  const fieldErrors: ContactFormState["fieldErrors"] = {};

  if (!values.name) fieldErrors.name = "Enter your name.";
  else if (values.name.length < 2) fieldErrors.name = "Enter at least 2 characters.";
  else if (values.name.length > 100) fieldErrors.name = "Keep your name to 100 characters or fewer.";
  else if (CONTROL_CHARACTER_PATTERN.test(values.name)) fieldErrors.name = "Enter your name on one line.";

  if (!values.email) fieldErrors.email = "Enter your work email address.";
  else if (values.email.length > 254) fieldErrors.email = "Keep your email address to 254 characters or fewer.";
  else if (!EMAIL_PATTERN.test(values.email)) fieldErrors.email = "Enter a valid work email address.";

  if (values.organisation.length > 120) {
    fieldErrors.organisation = "Keep the organisation name to 120 characters or fewer.";
  } else if (CONTROL_CHARACTER_PATTERN.test(values.organisation)) {
    fieldErrors.organisation = "Enter the organisation name on one line.";
  }

  if (!isEnquiryType(values.enquiryType)) fieldErrors.enquiryType = "Choose an enquiry type.";

  if (!values.message) fieldErrors.message = "Enter a message.";
  else if (values.message.length < 10) fieldErrors.message = "Enter at least 10 characters.";
  else if (values.message.length > 5_000) fieldErrors.message = "Keep your message to 5,000 characters or fewer.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      state: {
        status: "error",
        message: "Please check the highlighted fields.",
        fieldErrors,
        values,
      },
    };
  }

  return {
    ok: true,
    spam: false,
    data: {
      name: values.name,
      email: values.email,
      organisation: values.organisation,
      enquiryType: values.enquiryType as EnquiryType,
      message: values.message,
    },
  };
}
