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

  test("message events require a bounded sequence step and deduplicate by message", async () => {
    const sql = await migrationSql();
    const eventsTable =
      sql.match(
        /create table if not exists public\.outreach_events \(([\s\S]*?)\n\);\n\ncreate table if not exists public\.outreach_send_attempts/
      )?.[1] ?? "";

    expect(eventsTable).toMatch(
      /sequence_step\s+smallint\s+check\s*\(\s*sequence_step between 1 and 3\s*\)/i
    );
    expect(eventsTable).toMatch(
      /check\s*\(\s*event_type not in\s*\(\s*'sent',\s*'delivered',\s*'bounced'\s*\)\s*or\s*sequence_step is not null\s*\)/i
    );
    expect(sql).toMatch(
      /create unique index if not exists outreach_events_message_step_idx[\s\S]*campaign_id,\s*prospect_id,\s*event_type,\s*sequence_step[\s\S]*where event_type in\s*\(\s*'sent',\s*'delivered',\s*'bounced'\s*\)/i
    );
  });

  test("weekly reporting preserves distinct message steps and Touch 1 denominators", async () => {
    const sql = await migrationSql();
    const view =
      sql.match(
        /create or replace view public\.outreach_weekly_funnel[\s\S]*?;\n\nrevoke all on table public\.outreach_campaigns/
      )?.[0] ?? "";

    expect(view).toMatch(/e\.sequence_step/i);
    expect(view).toMatch(
      /count\(\*\)\s+filter\s*\(\s*where d\.event_type = 'sent'\s*\)\s+as sent_messages/i
    );
    expect(view).toMatch(
      /count\(distinct d\.prospect_id\)\s+filter\s*\(\s*where d\.event_type = 'sent'\s+and d\.sequence_step = 1\s*\)\s+as touch_1_sent/i
    );
    expect(view).toContain("delivery_rate");
    expect(view).toContain("hard_bounce_rate");
  });

  test("a prospect company number must match its referenced company row", async () => {
    const sql = await migrationSql();
    const companyTable =
      sql.match(
        /create table if not exists public\.outreach_companies \(([\s\S]*?)\n\);\n\ncreate table if not exists public\.outreach_prospects/
      )?.[1] ?? "";
    const prospectTable =
      sql.match(
        /create table if not exists public\.outreach_prospects \(([\s\S]*?)\n\);\n\ncreate table if not exists public\.outreach_suppressions/
      )?.[1] ?? "";

    expect(companyTable).toMatch(/unique\s*\(id,\s*company_number\)/i);
    expect(prospectTable).toMatch(
      /foreign key\s*\(company_id,\s*company_number\)\s*references\s+public\.outreach_companies\s*\(id,\s*company_number\)/i
    );
  });

  test("suppression evidence rejects updates and deletes", async () => {
    const sql = await migrationSql();

    expect(sql).toContain("reject_outreach_suppression_mutation");
    expect(sql).toMatch(
      /before update or delete on public\.outreach_suppressions/i
    );
  });

  test("expiry anonymisation removes email and every prospect-level email fingerprint", async () => {
    const sql = await migrationSql();
    const purgeFunction =
      sql.match(
        /create or replace function public\.purge_expired_outreach_prospect_personal_data[\s\S]*?\$\$;/
      )?.[0] ?? "";

    expect(purgeFunction).toContain(
      "purge_expired_outreach_prospect_personal_data"
    );
    expect(purgeFunction).toMatch(/work_email\s*=\s*null/i);
    expect(purgeFunction).toMatch(/work_email_hash\s*=\s*null/i);
    expect(purgeFunction).not.toMatch(/digest\s*\(\s*(?:lower\s*\(\s*)?work_email/i);
  });

  test("expiry anonymisation removes personal fields without deleting audit events", async () => {
    const sql = await migrationSql();

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
