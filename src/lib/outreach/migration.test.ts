import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const INITIAL_MIGRATION = "20260725000100_outreach_operations.sql";
const FORWARD_MIGRATION =
  "20260726000100_outreach_sequence_step_reporting.sql";

async function migrationSql(name = INITIAL_MIGRATION) {
  try {
    return await readFile(
      join(process.cwd(), "supabase/migrations", name),
      "utf8"
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return "";
    throw error;
  }
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
    expect(
      sql.match(/foreign key\s*\(prospect_id,\s*campaign_id\)/gi)
    ).toHaveLength(2);
    expect(
      sql.match(
        /references\s+public\.outreach_prospects\s*\(id,\s*campaign_id\)/gi
      )
    ).toHaveLength(2);
  });

  test("keeps the initial migration historical and applies the step upgrade later", async () => {
    const names = (await readdir(join(process.cwd(), "supabase/migrations")))
      .filter((name) => name.endsWith(".sql"))
      .sort();
    const initial = await migrationSql(INITIAL_MIGRATION);
    const forward = await migrationSql(FORWARD_MIGRATION);
    const initialEvents =
      initial.match(
        /create table if not exists public\.outreach_events \(([\s\S]*?)\n\);\n\ncreate table if not exists public\.outreach_send_attempts/
      )?.[1] ?? "";

    expect(names.indexOf(INITIAL_MIGRATION)).toBeGreaterThanOrEqual(0);
    expect(names.indexOf(FORWARD_MIGRATION)).toBeGreaterThan(
      names.indexOf(INITIAL_MIGRATION)
    );
    expect(initialEvents).not.toMatch(/\n\s*sequence_step\s+/i);
    expect(initial).toMatch(
      /count\(distinct d\.prospect_id\) filter \(where d\.event_type = 'sent'\) as sent/i
    );
    expect(forward).toMatch(
      /alter table public\.outreach_events\s+add column if not exists sequence_step smallint/i
    );
  });

  test("forward migration enforces new message rows without rewriting legacy audit history", async () => {
    const sql = await migrationSql(FORWARD_MIGRATION);

    expect(sql).toMatch(
      /add constraint outreach_events_sequence_step_range[\s\S]*check \(sequence_step between 1 and 3\)[\s\S]*not valid/i
    );
    expect(sql).toMatch(
      /add constraint outreach_events_message_step_required[\s\S]*event_type not in \('sent', 'delivered', 'bounced'\)[\s\S]*sequence_step is not null[\s\S]*not valid/i
    );
    expect(
      sql.match(
        /if not exists\s*\(\s*select 1\s*from pg_constraint/gi
      )
    ).toHaveLength(2);
    expect(sql).not.toMatch(
      /(update|delete from)\s+public\.outreach_events/i
    );
  });

  test("forward migration fails clearly on duplicates and creates an idempotent unique index", async () => {
    const sql = await migrationSql(FORWARD_MIGRATION);

    expect(sql).toMatch(
      /group by\s+campaign_id,\s*prospect_id,\s*event_type,\s*sequence_step[\s\S]*having count\(\*\) > 1/i
    );
    expect(sql).toMatch(
      /raise exception 'Cannot enforce outreach message-event uniqueness:[^']*unreconciled duplicate/i
    );
    expect(sql).toMatch(
      /create unique index if not exists outreach_events_message_step_idx[\s\S]*campaign_id,\s*prospect_id,\s*event_type,\s*sequence_step[\s\S]*where event_type in \('sent', 'delivered', 'bounced'\)[\s\S]*sequence_step is not null/i
    );
  });

  test("forward migration replaces the funnel index and globally canonicalizes message events", async () => {
    const sql = await migrationSql(FORWARD_MIGRATION);

    expect(sql).toMatch(
      /drop index if exists public\.outreach_events_funnel_idx/i
    );
    expect(sql).toMatch(
      /create index if not exists outreach_events_funnel_idx[\s\S]*occurred_at,\s*campaign_id,\s*event_type,\s*sequence_step,\s*prospect_id/i
    );
    expect(sql).toMatch(
      /row_number\(\) over\s*\(\s*partition by e\.campaign_id,\s*e\.prospect_id,\s*e\.event_type,\s*e\.sequence_step\s*order by e\.occurred_at,\s*e\.id\s*\)/i
    );
    expect(sql).toMatch(/where ranked\.canonical_rank = 1/i);
    expect(sql).toMatch(
      /count\(\*\)\s+filter\s*\(\s*where d\.event_type = 'sent'\s*\)\s+as sent_messages/i
    );
    expect(sql).toMatch(
      /count\(distinct d\.prospect_id\)\s+filter\s*\(\s*where d\.event_type = 'sent'\s+and d\.sequence_step = 1\s*\)\s+as touch_1_sent/i
    );
  });

  test("forward view recreation restores security-invoker and grants", async () => {
    const sql = await migrationSql(FORWARD_MIGRATION);

    expect(sql).toMatch(/drop view if exists public\.outreach_weekly_funnel/i);
    expect(sql).toMatch(
      /create view public\.outreach_weekly_funnel\s+with \(security_invoker = true\)/i
    );
    expect(sql).toMatch(
      /revoke all on table public\.outreach_weekly_funnel\s+from public, anon, authenticated/i
    );
    expect(sql).toMatch(
      /grant select on table public\.outreach_weekly_funnel to service_role/i
    );
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
    expect(purgeFunction).not.toMatch(
      /digest\s*\(\s*(?:lower\s*\(\s*)?work_email/i
    );
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
