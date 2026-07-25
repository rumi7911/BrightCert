import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { parseCsv, serializeCsv } from "./csv";
import {
  addSuppression,
  appendEvent,
  buildQueueRows,
  buildWeeklyFunnel,
  recordProspectEvent,
  seedSuppressionStore,
  validateProspectRows,
  verifyProspectRows,
} from "./workflow";

function approvedRow(overrides: Record<string, unknown> = {}) {
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
    personalisation_note: "Public procurement notice references Cyber Essentials.",
    lawful_basis: "legitimate_interests",
    lia_status: "approved",
    suppression_status: "clear",
    human_approved_at: "2026-07-24T12:00:00Z",
    existing_customer: "false",
    email_status: "verified",
    company_status: "active",
    companies_house_checked_at: "2026-07-24T11:00:00Z",
    sequence_status: "approved",
    ...overrides,
  };
}

describe("CSV protection", () => {
  test("parses BOM-prefixed RFC 4180 CSV including quoted commas and newlines", () => {
    const rows = parseCsv(
      "\ufeffprospect_id,trigger_evidence\r\nsme-001,\"Notice, dated\r\n20 July\"\r\n"
    );

    expect(rows).toEqual([
      {
        prospect_id: "sme-001",
        trigger_evidence: "Notice, dated\r\n20 July",
      },
    ]);
  });

  test("neutralizes spreadsheet formulas in every exported cell", () => {
    const csv = serializeCsv(
      [
        {
          name: "=HYPERLINK(\"https://attacker.test\")",
          note: " \t@SUM(1,1)",
          safe: "Example Ltd",
        },
      ],
      ["name", "note", "safe"]
    );

    expect(csv).toBe(
      'name,note,safe\r\n"\'=HYPERLINK(""https://attacker.test"")","\' \t@SUM(1,1)",Example Ltd\r\n'
    );
  });
});

describe("prospect workflows", () => {
  test("validation retains every row and writes explicit gate reasons", () => {
    const rows = validateProspectRows([
      approvedRow(),
      approvedRow({
        prospect_id: "sme-002",
        work_email: "info@gmail.com",
        human_approved_at: "",
      }),
    ]);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      prospect_id: "sme-001",
      gate_status: "eligible",
      gate_reasons: "",
    });
    expect(rows[1]).toMatchObject({
      prospect_id: "sme-002",
      gate_status: "blocked",
    });
    expect(rows[1]?.gate_reasons).toContain("free_mail_domain");
    expect(rows[1]?.gate_reasons).toContain("role_email");
    expect(rows[1]?.gate_reasons).toContain("human_approval_missing");
  });

  test("queue retains blocked rows but marks only approved transitions ready for manual send", async () => {
    const rows = await buildQueueRows(
      [
        approvedRow(),
        approvedRow({
          prospect_id: "sme-002",
          work_email: "pat@example-two.test",
          company_number: "00999999",
          domain: "example-two.test",
        }),
      ],
      [{ scope: "company", value: "00999999", reason: "existing customer" }],
      [],
      1,
      async (companyNumber) => ({
        kind: "active",
        companyNumber,
        companyStatus: "active",
        companyType: "ltd",
        checkedAt: "2026-07-25T12:00:00Z",
      })
    );

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      queue_status: "ready_manual_send",
      sequence_step: "1",
      gate_reasons: "",
    });
    expect(rows[1]).toMatchObject({
      queue_status: "blocked",
      gate_reasons: "suppressed_company",
    });
  });

  test("verification maps typed results onto rows without dropping failures", async () => {
    const rows = await verifyProspectRows(
      [approvedRow(), approvedRow({ prospect_id: "sme-002", company_number: "00999999" })],
      async (companyNumber) =>
        companyNumber === "00123456"
          ? {
              kind: "active" as const,
              companyNumber,
              companyStatus: "active" as const,
              companyType: "ltd",
              checkedAt: "2026-07-25T12:00:00.000Z",
            }
          : {
              kind: "not_found" as const,
              companyNumber,
            }
    );

    expect(rows[0]).toMatchObject({
      company_status: "active",
      legal_entity_type: "ltd",
      companies_house_checked_at: "2026-07-25T12:00:00.000Z",
      verification_result: "active",
      verification_reason: "",
    });
    expect(rows[1]).toMatchObject({
      company_status: "",
      legal_entity_type: "",
      companies_house_checked_at: "",
      verification_result: "not_found",
      verification_reason: "not_found",
    });
  });

  test("a prior opt-out event blocks every later queue attempt", async () => {
    const rows = await buildQueueRows(
      [approvedRow()],
      [],
      [
        {
          event_id: "event-1",
          prospect_id: "sme-001",
          type: "opt_out",
          campaign: "founding-2026",
          segment: "sme",
          trigger: "Cyber Essentials renewal",
          template_version: "sme-v1",
          occurred_at: "2026-07-25T10:00:00Z",
          amount_paid: "",
        },
      ],
      1,
      async (companyNumber) => ({
        kind: "active",
        companyNumber,
        companyStatus: "active",
        companyType: "ltd",
        checkedAt: "2026-07-25T12:00:00Z",
      })
    );

    expect(rows[0]).toMatchObject({
      queue_status: "blocked",
      gate_reasons: "terminal_event_opted_out",
    });
  });

  test("queue ignores self-asserted company data and requires a fresh active profile", async () => {
    const rows = await buildQueueRows(
      [approvedRow()],
      [],
      [],
      1,
      async (companyNumber) => ({
        kind: "inactive",
        companyNumber,
        companyStatus: "dissolved",
        companyType: "ltd",
        checkedAt: "2026-07-25T12:00:00Z",
      })
    );

    expect(rows[0]).toMatchObject({
      queue_status: "blocked",
      verification_result: "inactive",
      company_status: "dissolved",
      gate_reasons: "companies_house_inactive",
    });
  });
});

describe("operator stores and reporting", () => {
  test("seeding and adding a suppression are atomic and idempotent", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-outreach-"));
    const store = join(directory, "suppressions.csv");

    await seedSuppressionStore(store);
    await seedSuppressionStore(store);
    await addSuppression(store, {
      scope: "email",
      value: "ALEX.MORGAN@EXAMPLE-LTD.TEST",
      reason: "opt-out",
    });
    await addSuppression(store, {
      scope: "email",
      value: "alex.morgan@example-ltd.test",
      reason: "repeat should not duplicate",
    });
    await addSuppression(store, {
      scope: "company",
      value: "sc-123456",
      reason: "existing customer",
    });
    await addSuppression(store, {
      scope: "company",
      value: "SC123456",
      reason: "repeat should not duplicate",
    });

    expect(parseCsv(await readFile(store, "utf8"))).toEqual([
      {
        scope: "email",
        value: "alex.morgan@example-ltd.test",
        reason: "opt-out",
        created_at: expect.stringMatching(/^20/),
      },
      {
        scope: "company",
        value: "SC123456",
        reason: "existing customer",
        created_at: expect.stringMatching(/^20/),
      },
    ]);
    expect((await readdir(directory)).filter((name) => name.includes(".tmp-"))).toEqual([]);
  });

  test("appends outcome events and reports unique prospects per event and week", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-events-"));
    const store = join(directory, "events.csv");
    const baseEvent = {
      prospect_id: "sme-001",
      campaign: "founding-2026",
      segment: "sme",
      trigger: "renewal",
      template_version: "sme-v1",
      occurred_at: "2026-07-22T10:00:00Z",
    };

    await appendEvent(store, { ...baseEvent, type: "imported" });
    await appendEvent(store, { ...baseEvent, type: "imported" });
    await appendEvent(store, { ...baseEvent, type: "eligible" });
    await appendEvent(store, { ...baseEvent, type: "queued" });
    await appendEvent(store, { ...baseEvent, type: "paid", amount_paid: "99.00" });
    await appendEvent(store, { ...baseEvent, type: "paid", amount_paid: "99.00" });
    await appendEvent(store, {
      ...baseEvent,
      prospect_id: "sme-002",
      type: "paid",
      amount_paid: "99.00",
    });

    const report = buildWeeklyFunnel(parseCsv(await readFile(store, "utf8")));

    expect(report).toEqual([
      expect.objectContaining({
        week_start: "2026-07-20",
        campaign: "founding-2026",
        segment: "sme",
        trigger: "renewal",
        template_version: "sme-v1",
        imported: "1",
        eligible_queued: "1",
        sent: "0",
        delivered: "0",
        positive: "0",
        neutral: "0",
        objection: "0",
        opt_out: "0",
        bounced: "0",
        booked: "0",
        baseline_completed: "0",
        checkout_started: "0",
        paid: "2",
        refunded: "0",
        lost: "0",
        paid_revenue: "198.00",
      }),
    ]);
  });

  test("records an opt-out only for a canonical prospect and suppresses its email first", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-outcome-"));
    const events = join(directory, "events.csv");
    const suppressions = join(directory, "suppressions.csv");

    await recordProspectEvent(
      events,
      suppressions,
      [approvedRow()],
      {
        prospect_id: "sme-001",
        type: "opt_out",
        campaign: "founding-2026",
        segment: "sme",
        occurred_at: "2026-07-25T10:00:00Z",
      }
    );

    expect(parseCsv(await readFile(suppressions, "utf8"))[0]).toMatchObject({
      scope: "email",
      value: "alex.morgan@example-ltd.test",
      reason: "opt_out",
    });
    expect(parseCsv(await readFile(events, "utf8"))[0]).toMatchObject({
      prospect_id: "sme-001",
      type: "opt_out",
      campaign: "founding-2026",
      segment: "sme",
      trigger: "Cyber Essentials renewal",
      template_version: "sme-v1",
    });
  });

  test("refuses to append an event with dimensions unrelated to the canonical prospect", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-outcome-"));

    await expect(
      recordProspectEvent(
        join(directory, "events.csv"),
        join(directory, "suppressions.csv"),
        [approvedRow()],
        {
          prospect_id: "sme-001",
          type: "positive",
          campaign: "founding-2026",
          segment: "msp",
        }
      )
    ).rejects.toThrow("canonical prospect");

    await expect(readFile(join(directory, "events.csv"), "utf8")).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  test("concurrent event and suppression updates do not lose records", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-concurrency-"));
    const events = join(directory, "events.csv");
    const suppressions = join(directory, "suppressions.csv");

    await Promise.all([
      ...Array.from({ length: 20 }, (_, index) =>
        appendEvent(events, {
          prospect_id: `sme-${index}`,
          type: "imported",
          campaign: "founding-2026",
          segment: "sme",
          occurred_at: "2026-07-25T10:00:00Z",
        })
      ),
      ...Array.from({ length: 20 }, (_, index) =>
        addSuppression(suppressions, {
          scope: "email",
          value: `person-${index}@example.test`,
          reason: "test",
        })
      ),
    ]);

    expect(parseCsv(await readFile(events, "utf8"))).toHaveLength(20);
    expect(parseCsv(await readFile(suppressions, "utf8"))).toHaveLength(20);
    expect((await readdir(directory)).filter((name) => name.endsWith(".lock"))).toEqual([]);
  });
});
