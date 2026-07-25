import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

async function migrationSql() {
  return readFile(
    join(
      process.cwd(),
      "supabase/migrations/20260725000100_outreach_operations.sql"
    ),
    "utf8"
  );
}

describe("outreach migration invariants", () => {
  test("stores the approved Clay contract as first-class prospect columns", async () => {
    const sql = await migrationSql();
    const prospectTable =
      sql.match(
        /create table if not exists public\.outreach_prospects \(([\s\S]*?)\n\);\n\ncreate table if not exists public\.outreach_suppressions/
      )?.[1] ?? "";

    for (const column of [
      "segment",
      "company_name",
      "domain",
      "legal_entity_type",
      "company_number",
      "employee_band",
      "sector",
      "contact_name",
      "role",
      "work_email",
      "trigger_evidence_url",
      "personalisation_note",
      "lawful_basis",
      "suppression_status",
      "sequence_status",
    ]) {
      expect(prospectTable).toMatch(new RegExp(`\\n\\s*${column}\\s+`));
    }
  });

  test("events and send attempts enforce campaign membership through the prospect", async () => {
    const sql = await migrationSql();

    expect(sql).toMatch(/unique\s*\(id,\s*campaign_id\)/i);
    expect(sql.match(/foreign key\s*\(prospect_id,\s*campaign_id\)/gi)).toHaveLength(2);
    expect(sql.match(/references\s+public\.outreach_prospects\s*\(id,\s*campaign_id\)/gi)).toHaveLength(2);
  });

  test("suppression evidence rejects updates and deletes", async () => {
    const sql = await migrationSql();

    expect(sql).toContain("reject_outreach_suppression_mutation");
    expect(sql).toMatch(
      /before update or delete on public\.outreach_suppressions/i
    );
  });

  test("expiry anonymisation irreversibly removes personal fields without deleting audit events", async () => {
    const sql = await migrationSql();

    expect(sql).toContain("purge_expired_outreach_prospect_personal_data");
    expect(sql).toMatch(/work_email_hash\s*=\s*encode\s*\(\s*digest/i);
    expect(sql).toMatch(/work_email\s*=\s*null/i);
    for (const column of [
      "contact_name",
      "role",
      "source_url",
      "trigger_evidence_url",
      "personalisation_note",
    ]) {
      expect(sql).toMatch(new RegExp(`${column}\\s*=\\s*null`, "i"));
    }
    expect(sql).not.toMatch(/delete\s+from\s+public\.outreach_events/i);
  });
});
