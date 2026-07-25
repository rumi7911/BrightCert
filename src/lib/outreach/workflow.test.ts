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

function importedEvent(overrides: Record<string, string> = {}) {
  return {
    event_id: "event-imported",
    prospect_id: "sme-001",
    type: "imported",
    campaign: "founding-2026",
    segment: "sme",
    trigger: "Cyber Essentials renewal",
    template_version: "sme-v1",
    sequence_step: "",
    occurred_at: "2026-07-25T09:00:00Z",
    amount_paid: "",
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
      [
        importedEvent(),
        importedEvent({
          event_id: "event-imported-2",
          prospect_id: "sme-002",
        }),
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
        importedEvent(),
        {
          event_id: "event-1",
          prospect_id: "sme-001",
          type: "opt_out",
          campaign: "founding-2026",
          segment: "sme",
          trigger: "Cyber Essentials renewal",
          template_version: "sme-v1",
          sequence_step: "",
          occurred_at: "2026-07-25T10:00:00Z",
          amount_paid: "",
        },
      ],
      1,
      async () => {
        throw new Error("terminal history must block before verification");
      }
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
      [importedEvent()],
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

  test.each([
    {
      name: "header-only",
      events: [],
    },
    {
      name: "unrelated campaign",
      events: [importedEvent({ campaign: "other-campaign" })],
    },
    {
      name: "unrelated segment",
      events: [importedEvent({ segment: "msp" })],
    },
  ])(
    "queue blocks $name event history before Companies House verification",
    async ({ events }) => {
      let verificationCalls = 0;

      const rows = await buildQueueRows(
        [approvedRow()],
        [],
        events,
        1,
        async (companyNumber) => {
          verificationCalls += 1;
          return {
            kind: "active",
            companyNumber,
            companyStatus: "active",
            companyType: "ltd",
            checkedAt: "2026-07-25T12:00:00Z",
          };
        }
      );

      expect(rows[0]).toMatchObject({
        queue_status: "blocked",
        gate_reasons: "missing_imported_event",
        verification_result: "not_attempted",
      });
      expect(verificationCalls).toBe(0);
    }
  );

  test.each([
    {
      step: 2 as const,
      sequenceStatus: "touch_1_sent",
      priorStep: "1",
    },
    {
      step: 3 as const,
      sequenceStatus: "touch_2_sent",
      priorStep: "2",
    },
  ])(
    "queue step $step requires matching sent evidence for step $priorStep",
    async ({ step, sequenceStatus }) => {
      let verificationCalls = 0;
      const rows = await buildQueueRows(
        [approvedRow({ sequence_status: sequenceStatus })],
        [],
        [importedEvent()],
        step,
        async (companyNumber) => {
          verificationCalls += 1;
          return {
            kind: "active",
            companyNumber,
            companyStatus: "active",
            companyType: "ltd",
            checkedAt: "2026-07-25T12:00:00Z",
          };
        }
      );

      expect(rows[0]).toMatchObject({
        queue_status: "blocked",
        gate_reasons: "missing_prior_step_sent_event",
        verification_result: "not_attempted",
      });
      expect(verificationCalls).toBe(0);
    }
  );

  test("queue accepts corroborating canonical state and prior-step sent evidence", async () => {
    const rows = await buildQueueRows(
      [approvedRow({ sequence_status: "touch_1_sent" })],
      [],
      [
        importedEvent(),
        importedEvent({
          event_id: "event-sent-1",
          type: "sent",
          sequence_step: "1",
          occurred_at: "2026-07-25T10:00:00Z",
        }),
      ],
      2,
      async (companyNumber) => ({
        kind: "active",
        companyNumber,
        companyStatus: "active",
        companyType: "ltd",
        checkedAt: "2026-07-25T12:00:00Z",
      })
    );

    expect(rows[0]).toMatchObject({
      queue_status: "ready_manual_send",
      sequence_step: "2",
      gate_reasons: "",
      verification_result: "active",
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
        sent_messages: "0",
        touch_1_sent: "0",
        delivered_messages: "0",
        delivery_rate: "n/a",
        positive: "0",
        neutral: "0",
        objection: "0",
        opt_out: "0",
        bounced_messages: "0",
        hard_bounce_rate: "n/a",
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

  test.each(["sent", "delivered", "bounced"] as const)(
    "requires sequence_step for %s events before writing",
    async (type) => {
      const directory = await mkdtemp(join(tmpdir(), "brightcert-events-"));
      const store = join(directory, "events.csv");

      await expect(
        appendEvent(store, {
          prospect_id: "sme-001",
          type,
          campaign: "founding-2026",
          segment: "sme",
        })
      ).rejects.toThrow("sequence_step");
      await expect(readFile(store, "utf8")).rejects.toMatchObject({
        code: "ENOENT",
      });
    }
  );

  test("rejects an invalid sequence_step and persists valid step evidence", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-events-"));
    const store = join(directory, "events.csv");

    await expect(
      appendEvent(store, {
        prospect_id: "sme-001",
        type: "sent",
        campaign: "founding-2026",
        segment: "sme",
        sequence_step: 4 as 1,
      })
    ).rejects.toThrow("sequence_step must be 1, 2, or 3");

    await appendEvent(store, {
      prospect_id: "sme-001",
      type: "sent",
      campaign: "founding-2026",
      segment: "sme",
      sequence_step: 1,
    });

    expect(parseCsv(await readFile(store, "utf8"))[0]).toMatchObject({
      type: "sent",
      sequence_step: "1",
    });
  });

  test("validates bounced step evidence before adding a suppression", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-events-"));
    const events = join(directory, "events.csv");
    const suppressions = join(directory, "suppressions.csv");

    await expect(
      recordProspectEvent(
        events,
        suppressions,
        [approvedRow()],
        {
          prospect_id: "sme-001",
          type: "bounced",
          campaign: "founding-2026",
          segment: "sme",
        }
      )
    ).rejects.toThrow("sequence_step");
    await expect(readFile(events, "utf8")).rejects.toMatchObject({
      code: "ENOENT",
    });
    await expect(readFile(suppressions, "utf8")).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  test("reports separate messages and a distinct Touch 1 denominator across weeks", () => {
    const baseEvent = {
      event_id: "event",
      prospect_id: "sme-001",
      campaign: "founding-2026",
      segment: "sme",
      trigger: "renewal",
      template_version: "sme-v1",
      amount_paid: "",
    };
    const report = buildWeeklyFunnel([
      {
        ...baseEvent,
        event_id: "sent-1",
        type: "sent",
        sequence_step: "1",
        occurred_at: "2026-07-24T10:00:00Z",
      },
      {
        ...baseEvent,
        event_id: "delivered-1",
        type: "delivered",
        sequence_step: "1",
        occurred_at: "2026-07-24T10:01:00Z",
      },
      {
        ...baseEvent,
        event_id: "sent-2",
        type: "sent",
        sequence_step: "2",
        occurred_at: "2026-07-27T10:00:00Z",
      },
      {
        ...baseEvent,
        event_id: "sent-2-duplicate",
        type: "sent",
        sequence_step: "2",
        occurred_at: "2026-07-27T10:00:30Z",
      },
      {
        ...baseEvent,
        event_id: "bounce-2",
        type: "bounced",
        sequence_step: "2",
        occurred_at: "2026-07-27T10:01:00Z",
      },
    ]);

    expect(report).toEqual([
      expect.objectContaining({
        week_start: "2026-07-20",
        sent_messages: "1",
        touch_1_sent: "1",
        delivered_messages: "1",
        bounced_messages: "0",
        delivery_rate: "100.00%",
        hard_bounce_rate: "0.00%",
      }),
      expect.objectContaining({
        week_start: "2026-07-27",
        sent_messages: "1",
        touch_1_sent: "0",
        delivered_messages: "0",
        bounced_messages: "1",
        delivery_rate: "0.00%",
        hard_bounce_rate: "100.00%",
      }),
    ]);
  });

  test("counts two different sequence steps as two messages in the same week", () => {
    const report = buildWeeklyFunnel([
      {
        ...importedEvent({
          event_id: "sent-1",
          type: "sent",
          sequence_step: "1",
        }),
      },
      {
        ...importedEvent({
          event_id: "sent-2",
          type: "sent",
          sequence_step: "2",
        }),
      },
    ]);

    expect(report[0]).toMatchObject({
      sent_messages: "2",
      touch_1_sent: "1",
    });
  });

  test("excludes legacy message events that lack valid sequence-step evidence", () => {
    expect(
      buildWeeklyFunnel([
        {
          ...importedEvent({
            event_id: "legacy-sent",
            type: "sent",
            sequence_step: "",
          }),
        },
      ])
    ).toEqual([]);
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
