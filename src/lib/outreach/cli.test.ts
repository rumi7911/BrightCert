import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { runCli } from "./cli";
import { atomicWriteCsv, parseCsv } from "./csv";
import { EVENT_COLUMNS, PROSPECT_COLUMNS } from "./workflow";

function approvedRow() {
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
    trigger: "renewal",
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
  };
}

describe("outreach operator CLI", () => {
  test("validate writes every normalized row with an explicit decision", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-cli-"));
    const input = join(directory, "input.csv");
    const output = join(directory, "validated.csv");
    await atomicWriteCsv(input, [approvedRow()], PROSPECT_COLUMNS);

    await runCli(["validate", "--input", input, "--output", output]);

    expect(parseCsv(await readFile(output, "utf8"))).toEqual([
      expect.objectContaining({
        prospect_id: "sme-001",
        gate_status: "eligible",
        gate_reasons: "",
      }),
    ]);
  });

  test("verify requires the Companies House key before writing output", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-cli-"));
    const input = join(directory, "input.csv");
    const output = join(directory, "verified.csv");
    await atomicWriteCsv(input, [approvedRow()], PROSPECT_COLUMNS);

    await expect(
      runCli(["verify", "--input", input, "--output", output], {
        env: {},
      })
    ).rejects.toThrow("COMPANIES_HOUSE_API_KEY");
    await expect(readFile(output, "utf8")).rejects.toMatchObject({ code: "ENOENT" });
  });

  test("verify uses exact-number results and emits a protected review file", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-cli-"));
    const input = join(directory, "input.csv");
    const output = join(directory, "verified.csv");
    await atomicWriteCsv(input, [approvedRow()], PROSPECT_COLUMNS);

    await runCli(["verify", "--input", input, "--output", output], {
      env: { COMPANIES_HOUSE_API_KEY: "operator-test-key" },
      verifier: async (companyNumber) => ({
        kind: "active",
        companyNumber,
        companyStatus: "active",
        companyType: "ltd",
        checkedAt: "2026-07-25T12:00:00.000Z",
      }),
    });

    const contents = await readFile(output, "utf8");
    expect(parseCsv(contents)[0]).toMatchObject({
      company_number: "00123456",
      verification_result: "active",
    });
    expect(contents).not.toContain("operator-test-key");
  });

  test("seed, suppress, and queue wire all suppression scopes into manual-send decisions", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-cli-"));
    const input = join(directory, "input.csv");
    const suppressions = join(directory, "suppressions.csv");
    const events = join(directory, "events.csv");
    const output = join(directory, "queue.csv");
    await atomicWriteCsv(input, [approvedRow()], PROSPECT_COLUMNS);
    await atomicWriteCsv(
      events,
      [
        {
          event_id: "event-imported",
          prospect_id: "sme-001",
          type: "imported",
          campaign: "founding-2026",
          segment: "sme",
          trigger: "renewal",
          template_version: "sme-v1",
          sequence_step: "",
          occurred_at: "2026-07-25T09:00:00Z",
          amount_paid: "",
        },
      ],
      EVENT_COLUMNS
    );

    await runCli(["seed-suppressions", "--store", suppressions]);
    await runCli([
      "suppress",
      "--store",
      suppressions,
      "--scope",
      "company",
      "--value",
      "00-123-456",
      "--reason",
      "existing customer",
    ]);
    await runCli([
      "queue",
      "--input",
      input,
      "--suppressions",
      suppressions,
      "--events",
      events,
      "--step",
      "1",
      "--output",
      output,
    ], {
      env: { COMPANIES_HOUSE_API_KEY: "operator-test-key" },
      verifier: async (companyNumber) => ({
        kind: "active",
        companyNumber,
        companyStatus: "active",
        companyType: "ltd",
        checkedAt: "2026-07-25T12:00:00Z",
      }),
    });

    expect(parseCsv(await readFile(output, "utf8"))[0]).toMatchObject({
      queue_status: "blocked",
      gate_reasons: "suppressed_company",
    });
  });

  test("queue refuses to write without a Companies House key", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-cli-"));
    const input = join(directory, "input.csv");
    const suppressions = join(directory, "suppressions.csv");
    const events = join(directory, "events.csv");
    const output = join(directory, "queue.csv");
    await atomicWriteCsv(input, [approvedRow()], PROSPECT_COLUMNS);
    await runCli(["seed-suppressions", "--store", suppressions]);

    await expect(
      runCli([
        "queue",
        "--input",
        input,
        "--suppressions",
        suppressions,
        "--events",
        events,
        "--step",
        "1",
        "--output",
        output,
      ], { env: {} })
    ).rejects.toThrow("COMPANIES_HOUSE_API_KEY");
    await expect(readFile(output, "utf8")).rejects.toMatchObject({ code: "ENOENT" });
  });

  test("queue refuses to treat a missing event store as an empty history", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-cli-"));
    const input = join(directory, "input.csv");
    const suppressions = join(directory, "suppressions.csv");
    const events = join(directory, "missing-events.csv");
    await atomicWriteCsv(input, [approvedRow()], PROSPECT_COLUMNS);
    await runCli(["seed-suppressions", "--store", suppressions]);

    await expect(
      runCli([
        "queue",
        "--input",
        input,
        "--suppressions",
        suppressions,
        "--events",
        events,
        "--step",
        "1",
        "--output",
        join(directory, "queue.csv"),
      ], {
        env: { COMPANIES_HOUSE_API_KEY: "operator-test-key" },
        verifier: async (companyNumber) => ({
          kind: "active",
          companyNumber,
          companyStatus: "active",
          companyType: "ltd",
          checkedAt: "2026-07-25T12:00:00Z",
        }),
      })
    ).rejects.toMatchObject({ code: "ENOENT" });
  });

  test("event and report create the required weekly funnel without an open metric", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-cli-"));
    const events = join(directory, "events.csv");
    const prospects = join(directory, "prospects.csv");
    const suppressions = join(directory, "suppressions.csv");
    const output = join(directory, "report.csv");
    await atomicWriteCsv(prospects, [approvedRow()], PROSPECT_COLUMNS);

    await runCli([
      "event",
      "--store",
      events,
      "--prospects",
      prospects,
      "--suppressions",
      suppressions,
      "--prospect-id",
      "sme-001",
      "--type",
      "paid",
      "--campaign",
      "founding-2026",
      "--segment",
      "sme",
      "--trigger",
      "renewal",
      "--template-version",
      "sme-v1",
      "--occurred-at",
      "2026-07-22T10:00:00Z",
      "--amount-paid",
      "99.00",
    ]);
    await runCli(["report", "--events", events, "--output", output]);

    const report = parseCsv(await readFile(output, "utf8"))[0];
    expect(report).toMatchObject({ paid: "1", paid_revenue: "99.00" });
    expect(report).not.toHaveProperty("opened");
    expect(report).not.toHaveProperty("open_rate");
  });

  test.each(["sent", "delivered", "bounced"])(
    "event requires --sequence-step for %s and persists valid evidence",
    async (type) => {
      const directory = await mkdtemp(join(tmpdir(), "brightcert-cli-"));
      const events = join(directory, "events.csv");
      const prospects = join(directory, "prospects.csv");
      const suppressions = join(directory, "suppressions.csv");
      await atomicWriteCsv(prospects, [approvedRow()], PROSPECT_COLUMNS);

      const args = [
        "event",
        "--store",
        events,
        "--prospects",
        prospects,
        "--suppressions",
        suppressions,
        "--prospect-id",
        "sme-001",
        "--type",
        type,
        "--campaign",
        "founding-2026",
        "--segment",
        "sme",
      ];

      await expect(runCli(args)).rejects.toThrow(
        "Missing required option: --sequence-step"
      );

      if (type !== "sent") {
        const sentArgs = [...args];
        sentArgs[sentArgs.indexOf("--type") + 1] = "sent";
        await runCli([...sentArgs, "--sequence-step", "1"]);
      }

      await runCli([...args, "--sequence-step", "1"]);

      expect(
        parseCsv(await readFile(events, "utf8")).find(
          (event) => event.type === type
        )
      ).toMatchObject({
        type,
        sequence_step: "1",
      });
    }
  );

  test.each(["0", "4", ""])(
    "event rejects invalid --sequence-step %j for every event type",
    async (invalidStep) => {
      const directory = await mkdtemp(join(tmpdir(), "brightcert-cli-"));
      const prospects = join(directory, "prospects.csv");
      await atomicWriteCsv(prospects, [approvedRow()], PROSPECT_COLUMNS);

      await expect(
        runCli([
          "event",
          "--store",
          join(directory, "events.csv"),
          "--prospects",
          prospects,
          "--suppressions",
          join(directory, "suppressions.csv"),
          "--prospect-id",
          "sme-001",
          "--type",
          "positive",
          "--campaign",
          "founding-2026",
          "--segment",
          "sme",
          "--sequence-step",
          invalidStep,
        ])
      ).rejects.toThrow("--sequence-step must be 1, 2, or 3");
    }
  );

  test("event rejects a duplicate cross-week message key without changing the store", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-cli-"));
    const events = join(directory, "events.csv");
    const prospects = join(directory, "prospects.csv");
    const suppressions = join(directory, "suppressions.csv");
    await atomicWriteCsv(prospects, [approvedRow()], PROSPECT_COLUMNS);
    const baseArgs = [
      "event",
      "--store",
      events,
      "--prospects",
      prospects,
      "--suppressions",
      suppressions,
      "--prospect-id",
      "sme-001",
      "--type",
      "sent",
      "--campaign",
      "founding-2026",
      "--segment",
      "sme",
      "--sequence-step",
      "1",
    ];

    await runCli([
      ...baseArgs,
      "--occurred-at",
      "2026-07-24T10:00:00Z",
    ]);
    const beforeDuplicate = await readFile(events, "utf8");

    await expect(
      runCli([
        ...baseArgs,
        "--occurred-at",
        "2026-07-27T10:00:00Z",
      ])
    ).rejects.toThrow("Duplicate message event");
    expect(await readFile(events, "utf8")).toBe(beforeDuplicate);
  });

  test("an opt-out event suppresses the canonical email and blocks a later queue", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-cli-"));
    const prospects = join(directory, "prospects.csv");
    const suppressions = join(directory, "suppressions.csv");
    const events = join(directory, "events.csv");
    const output = join(directory, "queue.csv");
    await atomicWriteCsv(prospects, [approvedRow()], PROSPECT_COLUMNS);

    await runCli([
      "event",
      "--store",
      events,
      "--prospects",
      prospects,
      "--suppressions",
      suppressions,
      "--prospect-id",
      "sme-001",
      "--type",
      "opt_out",
      "--campaign",
      "founding-2026",
      "--segment",
      "sme",
    ]);
    await runCli([
      "queue",
      "--input",
      prospects,
      "--suppressions",
      suppressions,
      "--events",
      events,
      "--step",
      "1",
      "--output",
      output,
    ], {
      env: { COMPANIES_HOUSE_API_KEY: "operator-test-key" },
      verifier: async (companyNumber) => ({
        kind: "active",
        companyNumber,
        companyStatus: "active",
        companyType: "ltd",
        checkedAt: "2026-07-25T12:00:00Z",
      }),
    });

    expect(parseCsv(await readFile(output, "utf8"))[0]).toMatchObject({
      queue_status: "blocked",
      gate_reasons: expect.stringContaining("terminal_event_opted_out"),
    });
    expect(parseCsv(await readFile(suppressions, "utf8"))[0]).toMatchObject({
      scope: "email",
      value: "alex.morgan@example-ltd.test",
    });
  });
});
