import { describe, expect, test } from "vitest";
import {
  gateProspect,
  normalizeCompanyNumber,
  normalizeProspect,
  type GateContext,
  type Prospect,
} from "./gate";

function approvedProspect(overrides: Partial<Prospect> = {}): Prospect {
  return {
    prospect_id: "sme-001",
    campaign: "founding-2026",
    segment: "sme",
    template_version: "sme-v1",
    contact_name: "Alex Morgan",
    role: "Operations Director",
    work_email: "alex.morgan@example-ltd.test",
    company_name: "Example Manufacturing Ltd",
    company_number: "00123456",
    domain: "example-ltd.test",
    legal_entity_type: "ltd",
    employee_band: "10-49",
    sector: "manufacturing",
    source_url: "https://example-ltd.test/about",
    source_date: "2026-07-20",
    trigger: "Cyber Essentials renewal",
    trigger_evidence_url: "https://example-ltd.test/evidence",
    personalisation_note: "Public procurement notice dated 2026-07-18",
    lawful_basis: "legitimate_interests",
    lia_status: "approved",
    suppression_status: "clear",
    human_approved_at: "2026-07-24T12:00:00Z",
    existing_customer: false,
    email_status: "verified",
    company_status: "active",
    companies_house_checked_at: "2026-07-24T11:00:00Z",
    sequence_status: "approved",
    ...overrides,
  };
}

function context(overrides: Partial<GateContext> = {}): GateContext {
  return {
    step: 1,
    suppressions: [],
    seenProspectIds: new Set(),
    seenEmails: new Set(),
    ...overrides,
  };
}

function canonicalProspect(overrides: Record<string, unknown> = {}) {
  return {
    prospect_id: "sme-canonical-001",
    campaign: "founding-2026",
    template_version: "sme-v2",
    segment: "sme",
    company_name: "Example Manufacturing Ltd",
    domain: "example-ltd.test",
    legal_entity_type: "ltd",
    company_number: "00123456",
    employee_band: "10-49",
    sector: "manufacturing",
    contact_name: "Alex Morgan",
    role: "Operations Director",
    work_email: "alex.morgan@example-ltd.test",
    source_url: "https://example-ltd.test/about",
    source_date: "2026-07-20",
    trigger: "Cyber Essentials renewal",
    trigger_evidence_url: "https://example-ltd.test/procurement-notice",
    personalisation_note: "Public procurement notice references Cyber Essentials.",
    lawful_basis: "legitimate_interests",
    lia_status: "approved",
    suppression_status: "clear",
    sequence_status: "approved",
    email_status: "verified",
    company_status: "active",
    companies_house_checked_at: "2026-07-24T11:00:00Z",
    human_approved_at: "2026-07-24T12:00:00Z",
    existing_customer: "false",
    ...overrides,
  };
}

describe("prospect normalization", () => {
  test("normalizes a company number without losing leading zeroes", () => {
    expect(normalizeCompanyNumber(" 00-12 ab 34 ")).toBe("0012AB34");
  });

  test("normalizes comparison fields while retaining evidence text", () => {
    const normalized = normalizeProspect({
      ...approvedProspect(),
      work_email: "  ALEX.MORGAN@EXAMPLE-LTD.TEST ",
      domain: "https://www.Example-Ltd.Test/about",
      company_number: " 00-123-456 ",
      existing_customer: "false",
      personalisation_note: "  Public procurement notice dated 2026-07-18  ",
    });

    expect(normalized).toMatchObject({
      work_email: "alex.morgan@example-ltd.test",
      domain: "example-ltd.test",
      company_number: "00123456",
      existing_customer: false,
      personalisation_note: "Public procurement notice dated 2026-07-18",
    });
  });

  test("uses the approved Clay field names as the canonical contract", () => {
    expect(normalizeProspect(canonicalProspect())).toMatchObject({
      domain: "example-ltd.test",
      legal_entity_type: "ltd",
      employee_band: "10-49",
      sector: "manufacturing",
      contact_name: "Alex Morgan",
      role: "Operations Director",
      work_email: "alex.morgan@example-ltd.test",
      trigger_evidence_url: "https://example-ltd.test/procurement-notice",
      lawful_basis: "legitimate_interests",
      suppression_status: "clear",
      sequence_status: "approved",
    });
  });
});

describe("prospect gate", () => {
  test("approves a verified corporate prospect for the matching sequence step", () => {
    expect(gateProspect(approvedProspect(), context())).toEqual({
      eligible: true,
      reasons: [],
    });
  });

  test("approves a complete canonical Clay prospect", () => {
    const result = gateProspect(
      canonicalProspect() as unknown as Prospect,
      context()
    );

    expect(result).toEqual({ eligible: true, reasons: [] });
  });

  test.each([
    ["employee_band", "", "employee_band_missing"],
    ["sector", "", "sector_missing"],
    ["contact_name", "", "contact_name_missing"],
    ["role", "", "role_missing"],
    ["trigger_evidence_url", "", "trigger_evidence_url_missing"],
    ["trigger_evidence_url", "not-a-url", "trigger_evidence_url_invalid"],
    ["personalisation_note", "", "personalisation_note_missing"],
    ["personalisation_note", "generic", "personalisation_note_too_short"],
    ["lawful_basis", "consent", "lawful_basis_not_legitimate_interests"],
    ["suppression_status", "", "suppression_status_missing"],
    ["suppression_status", "unknown", "suppression_status_not_clear"],
  ] as const)("gates canonical %s=%s with %s", (field, value, reason) => {
    const result = gateProspect(
      canonicalProspect({ [field]: value }) as unknown as Prospect,
      context()
    );

    expect(result.reasons).toContain(reason);
  });

  test.each([
    ["help@example-ltd.test", "role_email"],
    ["service@example-ltd.test", "role_email"],
    ["customer.service@example-ltd.test", "role_email"],
    ["customerservice@example-ltd.test", "role_email"],
    ["reception@example-ltd.test", "role_email"],
    ["noreply@example-ltd.test", "role_email"],
    ["no-reply@example-ltd.test", "role_email"],
    ["compliance@example-ltd.test", "role_email"],
    ["legal@example-ltd.test", "role_email"],
    ["operations@example-ltd.test", "role_email"],
    ["procurement@example-ltd.test", "role_email"],
    ["alex@fastmail.com", "free_mail_domain"],
    ["alex@hey.com", "free_mail_domain"],
  ] as const)("rejects %s as %s", (work_email, reason) => {
    const result = gateProspect(
      canonicalProspect({ work_email }) as unknown as Prospect,
      context()
    );

    expect(result.reasons).toContain(reason);
  });

  test.each([
    ["segment", "consumer", "unsupported_segment"],
    ["company_number", "123456789", "invalid_company_number"],
    ["legal_entity_type", "", "company_unverified"],
    ["legal_entity_type", "sole-trader", "unsupported_company_type"],
    ["company_status", "dissolved", "company_inactive"],
    ["companies_house_checked_at", "", "company_unverified"],
    ["companies_house_checked_at", "not-a-timestamp", "company_verification_timestamp_invalid"],
    ["work_email", "alex@gmail.com", "free_mail_domain"],
    ["work_email", "alex@sub.gmail.com", "free_mail_domain"],
    ["work_email", "alex@mailinator.com", "disposable_email_domain"],
    ["work_email", "info@example-ltd.test", "role_email"],
    ["work_email", "info+uk@example-ltd.test", "role_email"],
    ["work_email", "not-an-email", "invalid_email"],
    ["work_email", "alex@unrelated-agency.test", "email_company_domain_mismatch"],
    ["email_status", "unknown", "email_unverified"],
    ["domain", "", "company_domain_missing"],
    ["source_url", "", "source_url_missing"],
    ["source_url", "not-a-url", "source_url_invalid"],
    ["source_date", "", "source_date_missing"],
    ["source_date", "not-a-date", "source_date_invalid"],
    ["trigger", "", "trigger_missing"],
    ["trigger_evidence_url", "", "trigger_evidence_url_missing"],
    ["lia_status", "pending", "lia_not_approved"],
    ["human_approved_at", "", "human_approval_missing"],
    ["human_approved_at", "not-a-timestamp", "human_approval_invalid"],
    ["existing_customer", "", "existing_customer_unconfirmed"],
    ["existing_customer", true, "existing_customer"],
  ] as const)("rejects %s=%s with %s", (field, value, reason) => {
    const result = gateProspect(approvedProspect({ [field]: value }), context());

    expect(result.eligible).toBe(false);
    expect(result.reasons).toContain(reason);
  });

  test.each([
    [{ scope: "email", value: "alex.morgan@example-ltd.test", reason: "opt-out" }, "suppressed_email"],
    [{ scope: "domain", value: "example-ltd.test", reason: "complaint" }, "suppressed_domain"],
    [{ scope: "company", value: "00123456", reason: "customer" }, "suppressed_company"],
  ] as const)("blocks a matching %s suppression", (suppression, reason) => {
    const result = gateProspect(
      approvedProspect(),
      context({ suppressions: [suppression] })
    );

    expect(result.eligible).toBe(false);
    expect(result.reasons).toContain(reason);
  });

  test("rejects duplicate stable ids and email addresses", () => {
    const result = gateProspect(
      approvedProspect(),
      context({
        seenProspectIds: new Set(["sme-001"]),
        seenEmails: new Set(["alex.morgan@example-ltd.test"]),
      })
    );

    expect(result.reasons).toEqual(
      expect.arrayContaining(["duplicate_prospect_id", "duplicate_email"])
    );
  });

  test("rejects an unknown sequence state even when no queue step is requested", () => {
    const result = gateProspect(
      approvedProspect({ sequence_status: "paused" }),
      context({ step: undefined })
    );

    expect(result.reasons).toContain("invalid_sequence_state");
  });

  test.each([
    [1, "candidate", "invalid_sequence_transition"],
    [2, "approved", "invalid_sequence_transition"],
    [3, "touch_1_sent", "invalid_sequence_transition"],
    [1, "replied", "sequence_stopped"],
    [2, "opted_out", "sequence_stopped"],
    [3, "bounced", "sequence_stopped"],
    [1, "customer", "sequence_stopped"],
    [1, "closed", "sequence_stopped"],
  ] as const)("blocks step %i from %s", (step, sequence_status, reason) => {
    const result = gateProspect(
      approvedProspect({ sequence_status }),
      context({ step })
    );

    expect(result.eligible).toBe(false);
    expect(result.reasons).toContain(reason);
  });
});
