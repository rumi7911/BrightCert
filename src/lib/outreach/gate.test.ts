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
    first_name: "Alex",
    last_name: "Morgan",
    job_title: "Operations Director",
    email: "alex.morgan@example-ltd.test",
    company_name: "Example Manufacturing Ltd",
    company_number: "00123456",
    company_domain: "example-ltd.test",
    source_url: "https://example-ltd.test/about",
    source_date: "2026-07-20",
    trigger: "Cyber Essentials renewal",
    trigger_evidence: "Public procurement notice dated 2026-07-18",
    lia_status: "approved",
    human_approved_at: "2026-07-24T12:00:00Z",
    existing_customer: false,
    email_status: "verified",
    company_status: "active",
    company_type: "ltd",
    companies_house_checked_at: "2026-07-24T11:00:00Z",
    sequence_state: "approved",
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

describe("prospect normalization", () => {
  test("normalizes a company number without losing leading zeroes", () => {
    expect(normalizeCompanyNumber(" 00-12 ab 34 ")).toBe("0012AB34");
  });

  test("normalizes comparison fields while retaining evidence text", () => {
    const normalized = normalizeProspect({
      ...approvedProspect(),
      email: "  ALEX.MORGAN@EXAMPLE-LTD.TEST ",
      company_domain: "https://www.Example-Ltd.Test/about",
      company_number: " 00-123-456 ",
      existing_customer: "false",
      trigger_evidence: "  Public procurement notice dated 2026-07-18  ",
    });

    expect(normalized).toMatchObject({
      email: "alex.morgan@example-ltd.test",
      company_domain: "example-ltd.test",
      company_number: "00123456",
      existing_customer: false,
      trigger_evidence: "Public procurement notice dated 2026-07-18",
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

  test.each([
    ["segment", "consumer", "unsupported_segment"],
    ["company_number", "123456789", "invalid_company_number"],
    ["company_type", "", "company_unverified"],
    ["company_type", "sole-trader", "unsupported_company_type"],
    ["company_status", "dissolved", "company_inactive"],
    ["companies_house_checked_at", "", "company_unverified"],
    ["companies_house_checked_at", "not-a-timestamp", "company_verification_timestamp_invalid"],
    ["email", "alex@gmail.com", "free_mail_domain"],
    ["email", "alex@sub.gmail.com", "free_mail_domain"],
    ["email", "alex@mailinator.com", "disposable_email_domain"],
    ["email", "info@example-ltd.test", "role_email"],
    ["email", "info+uk@example-ltd.test", "role_email"],
    ["email", "not-an-email", "invalid_email"],
    ["email", "alex@unrelated-agency.test", "email_company_domain_mismatch"],
    ["email_status", "unknown", "email_unverified"],
    ["company_domain", "", "company_domain_missing"],
    ["source_url", "", "source_url_missing"],
    ["source_url", "not-a-url", "source_url_invalid"],
    ["source_date", "", "source_date_missing"],
    ["source_date", "not-a-date", "source_date_invalid"],
    ["trigger", "", "trigger_missing"],
    ["trigger_evidence", "", "trigger_evidence_missing"],
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
      approvedProspect({ sequence_state: "paused" }),
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
  ] as const)("blocks step %i from %s", (step, sequence_state, reason) => {
    const result = gateProspect(
      approvedProspect({ sequence_state }),
      context({ step })
    );

    expect(result.eligible).toBe(false);
    expect(result.reasons).toContain(reason);
  });
});
