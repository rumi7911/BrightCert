import { getEmailDomain, isDisposableEmail } from "@/lib/auth/disposable-domains";

export const SUPPORTED_COMPANY_TYPES = [
  "ltd",
  "plc",
  "llp",
  "private-unlimited",
  "private-unlimited-nsc",
  "private-limited-guarant-nsc",
  "private-limited-guarant-nsc-limited-exemption",
  "private-limited-shares-section-30-exemption",
] as const;

export const SEQUENCE_STATES = [
  "candidate",
  "approved",
  "touch_1_sent",
  "touch_2_sent",
  "touch_3_sent",
  "replied",
  "opted_out",
  "bounced",
  "customer",
  "closed",
] as const;

export type SequenceState = (typeof SEQUENCE_STATES)[number];
export type SequenceStep = 1 | 2 | 3;

export interface Prospect {
  prospect_id: string;
  campaign: string;
  segment: string;
  template_version: string;
  company_name: string;
  company_number: string;
  domain: string;
  legal_entity_type: string;
  employee_band: string;
  sector: string;
  contact_name: string;
  role: string;
  work_email: string;
  source_url: string;
  source_date: string;
  trigger: string;
  trigger_evidence_url: string;
  personalisation_note: string;
  lawful_basis: string;
  lia_status: string;
  suppression_status: string;
  sequence_status: string;
  human_approved_at: string;
  existing_customer: boolean | null;
  email_status: string;
  company_status: string;
  companies_house_checked_at: string;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  email?: string;
  company_domain?: string;
  company_type?: string;
  trigger_evidence?: string;
  sequence_state?: string;
}

export interface Suppression {
  scope: "email" | "domain" | "company";
  value: string;
  reason: string;
  created_at?: string;
}

export interface GateContext {
  step?: SequenceStep;
  skipCompanyVerification?: boolean;
  suppressions: readonly Suppression[];
  seenProspectIds: ReadonlySet<string>;
  seenEmails: ReadonlySet<string>;
}

export interface GateResult {
  eligible: boolean;
  reasons: string[];
}

const FREE_MAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "hotmail.co.uk",
  "live.com",
  "icloud.com",
  "me.com",
  "yahoo.com",
  "yahoo.co.uk",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "mail.com",
  "fastmail.com",
  "fastmail.fm",
  "hey.com",
]);

const ROLE_PREFIXES = new Set([
  "info",
  "hello",
  "contact",
  "sales",
  "support",
  "admin",
  "office",
  "team",
  "enquiries",
  "marketing",
  "security",
  "privacy",
  "careers",
  "jobs",
  "billing",
  "accounts",
  "finance",
  "hr",
  "help",
  "service",
  "customer.service",
  "customerservice",
  "reception",
  "noreply",
  "no-reply",
  "compliance",
  "legal",
  "operations",
  "procurement",
]);

const STOPPED_STATES = new Set([
  "replied",
  "opted_out",
  "bounced",
  "customer",
  "closed",
]);

const REQUIRED_STATE_BY_STEP: Record<SequenceStep, SequenceState> = {
  1: "approved",
  2: "touch_1_sent",
  3: "touch_2_sent",
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function normalizeBoolean(value: unknown): boolean | null {
  if (value === true || value === false) return value;
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return null;
}

export function normalizeCompanyNumber(value: unknown): string {
  return text(value).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function normalizeDomain(value: unknown): string {
  const raw = text(value).toLowerCase();
  if (!raw) return "";

  try {
    const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
    return url.hostname.replace(/^www\./, "").replace(/\.$/, "");
  } catch {
    return raw.replace(/^https?:\/\//, "").split("/")[0]?.replace(/^www\./, "") ?? "";
  }
}

export function normalizeProspect(
  row: Record<string, unknown> | Prospect
): Prospect {
  const contactName =
    text(row.contact_name) ||
    [text(row.first_name), text(row.last_name)].filter(Boolean).join(" ");
  return {
    prospect_id: text(row.prospect_id),
    campaign: text(row.campaign),
    segment: text(row.segment).toLowerCase(),
    template_version: text(row.template_version),
    company_name: text(row.company_name),
    company_number: normalizeCompanyNumber(row.company_number),
    domain: normalizeDomain(row.domain || row.company_domain),
    legal_entity_type: text(row.legal_entity_type || row.company_type).toLowerCase(),
    employee_band: text(row.employee_band),
    sector: text(row.sector),
    contact_name: contactName,
    role: text(row.role || row.job_title),
    work_email: text(row.work_email || row.email).toLowerCase(),
    source_url: text(row.source_url),
    source_date: text(row.source_date),
    trigger: text(row.trigger),
    trigger_evidence_url: text(row.trigger_evidence_url || row.trigger_evidence),
    personalisation_note: text(row.personalisation_note),
    lawful_basis: text(row.lawful_basis).toLowerCase(),
    lia_status: text(row.lia_status).toLowerCase(),
    suppression_status: text(row.suppression_status).toLowerCase(),
    sequence_status: text(row.sequence_status || row.sequence_state).toLowerCase(),
    human_approved_at: text(row.human_approved_at),
    existing_customer: normalizeBoolean(row.existing_customer),
    email_status: text(row.email_status).toLowerCase(),
    company_status: text(row.company_status).toLowerCase(),
    companies_house_checked_at: text(row.companies_house_checked_at),
  };
}

function hasParentDomain(domain: string, expected: string): boolean {
  return domain === expected || domain.endsWith(`.${expected}`);
}

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validHttpUrl(value: string): boolean {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function validDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validTimestamp(value: string): boolean {
  return !Number.isNaN(new Date(value).getTime());
}

function addMissingCoreReasons(prospect: Prospect, reasons: string[]) {
  if (!prospect.prospect_id) reasons.push("prospect_id_missing");
  if (!prospect.campaign) reasons.push("campaign_missing");
  if (!prospect.segment) reasons.push("segment_missing");
  else if (!["sme", "msp"].includes(prospect.segment)) {
    reasons.push("unsupported_segment");
  }
  if (!prospect.template_version) reasons.push("template_version_missing");
  if (!prospect.company_name) reasons.push("company_name_missing");
  if (!prospect.company_number) reasons.push("company_number_missing");
  else if (!/^[A-Z0-9]{2,8}$/.test(prospect.company_number)) {
    reasons.push("invalid_company_number");
  }
  if (!prospect.employee_band) reasons.push("employee_band_missing");
  if (!prospect.sector) reasons.push("sector_missing");
  if (!prospect.contact_name) reasons.push("contact_name_missing");
  if (!prospect.role) reasons.push("role_missing");
}

export function gateProspect(
  input: Prospect,
  context: GateContext
): GateResult {
  const prospect = normalizeProspect(input);
  const reasons: string[] = [];
  const emailDomain = getEmailDomain(prospect.work_email);
  const emailPrefix = prospect.work_email.split("@")[0]?.split("+")[0] ?? "";

  addMissingCoreReasons(prospect, reasons);

  if (!validEmail(prospect.work_email)) reasons.push("invalid_email");
  if (
    [...FREE_MAIL_DOMAINS].some((freeMailDomain) =>
      hasParentDomain(emailDomain, freeMailDomain)
    )
  ) {
    reasons.push("free_mail_domain");
  }
  if (isDisposableEmail(prospect.work_email)) reasons.push("disposable_email_domain");
  if (ROLE_PREFIXES.has(emailPrefix)) reasons.push("role_email");
  if (prospect.email_status !== "verified") reasons.push("email_unverified");
  if (!prospect.domain) {
    reasons.push("company_domain_missing");
  } else if (
    validEmail(prospect.work_email) &&
    !hasParentDomain(emailDomain, prospect.domain)
  ) {
    reasons.push("email_company_domain_mismatch");
  }

  if (!prospect.legal_entity_type) reasons.push("company_unverified");
  if (!context.skipCompanyVerification) {
    if (!prospect.legal_entity_type || !prospect.companies_house_checked_at) {
      reasons.push("company_unverified");
    } else if (
      !SUPPORTED_COMPANY_TYPES.includes(
        prospect.legal_entity_type as (typeof SUPPORTED_COMPANY_TYPES)[number]
      )
    ) {
      reasons.push("unsupported_company_type");
    }
    if (
      prospect.companies_house_checked_at &&
      !validTimestamp(prospect.companies_house_checked_at)
    ) {
      reasons.push("company_verification_timestamp_invalid");
    }
    if (prospect.company_status !== "active") reasons.push("company_inactive");
  }

  if (!prospect.source_url) {
    reasons.push("source_url_missing");
  } else if (!validHttpUrl(prospect.source_url)) {
    reasons.push("source_url_invalid");
  }
  if (!prospect.source_date) {
    reasons.push("source_date_missing");
  } else if (!validDateOnly(prospect.source_date)) {
    reasons.push("source_date_invalid");
  }
  if (!prospect.trigger) reasons.push("trigger_missing");
  if (!prospect.trigger_evidence_url) {
    reasons.push("trigger_evidence_url_missing");
  } else if (!validHttpUrl(prospect.trigger_evidence_url)) {
    reasons.push("trigger_evidence_url_invalid");
  }
  if (!prospect.personalisation_note) {
    reasons.push("personalisation_note_missing");
  } else if (prospect.personalisation_note.length < 20) {
    reasons.push("personalisation_note_too_short");
  }
  if (prospect.lawful_basis !== "legitimate_interests") {
    reasons.push("lawful_basis_not_legitimate_interests");
  }
  if (prospect.lia_status !== "approved") reasons.push("lia_not_approved");
  if (!prospect.suppression_status) {
    reasons.push("suppression_status_missing");
  } else if (prospect.suppression_status !== "clear") {
    reasons.push("suppression_status_not_clear");
  }
  if (!prospect.human_approved_at) {
    reasons.push("human_approval_missing");
  } else if (!validTimestamp(prospect.human_approved_at)) {
    reasons.push("human_approval_invalid");
  }
  if (prospect.existing_customer === null) {
    reasons.push("existing_customer_unconfirmed");
  } else if (prospect.existing_customer) {
    reasons.push("existing_customer");
  }

  if (context.seenProspectIds.has(prospect.prospect_id)) {
    reasons.push("duplicate_prospect_id");
  }
  if (context.seenEmails.has(prospect.work_email)) reasons.push("duplicate_email");

  for (const suppression of context.suppressions) {
    const normalizedValue =
      suppression.scope === "email"
        ? suppression.value.trim().toLowerCase()
        : suppression.scope === "domain"
          ? normalizeDomain(suppression.value)
          : normalizeCompanyNumber(suppression.value);
    const matched =
      (suppression.scope === "email" && normalizedValue === prospect.work_email) ||
      (suppression.scope === "domain" &&
        hasParentDomain(emailDomain, normalizedValue)) ||
      (suppression.scope === "company" &&
        normalizedValue === prospect.company_number);
    if (matched) reasons.push(`suppressed_${suppression.scope}`);
  }

  if (
    !SEQUENCE_STATES.includes(
      prospect.sequence_status as (typeof SEQUENCE_STATES)[number]
    )
  ) {
    reasons.push("invalid_sequence_state");
  } else if (STOPPED_STATES.has(prospect.sequence_status)) {
    reasons.push("sequence_stopped");
  } else if (
    context.step &&
    prospect.sequence_status !== REQUIRED_STATE_BY_STEP[context.step]
  ) {
    reasons.push("invalid_sequence_transition");
  }

  const uniqueReasons = [...new Set(reasons)];
  return { eligible: uniqueReasons.length === 0, reasons: uniqueReasons };
}
