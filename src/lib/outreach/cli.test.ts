import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { runCli } from "./cli";
import { atomicWriteCsv, parseCsv } from "./csv";
import { PROSPECT_COLUMNS } from "./workflow";

function approvedRow() {
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
    trigger: "renewal",
    trigger_evidence: "Public procurement notice",
    lia_status: "approved",
    human_approved_at: "2026-07-24T12:00:00Z",
    existing_customer: "false",
    email_status: "verified",
    company_status: "active",
    company_type: "ltd",
    companies_house_checked_at: "2026-07-24T11:00:00Z",
    sequence_state: "approved",
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
    const output = join(directory, "queue.csv");
    await atomicWriteCsv(input, [approvedRow()], PROSPECT_COLUMNS);

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
      "--step",
      "1",
      "--output",
      output,
    ]);

    expect(parseCsv(await readFile(output, "utf8"))[0]).toMatchObject({
      queue_status: "blocked",
      gate_reasons: "suppressed_company",
    });
  });

  test("event and report create the required weekly funnel without an open metric", async () => {
    const directory = await mkdtemp(join(tmpdir(), "brightcert-cli-"));
    const events = join(directory, "events.csv");
    const output = join(directory, "report.csv");

    await runCli([
      "event",
      "--store",
      events,
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
});
