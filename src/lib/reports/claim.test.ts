// @vitest-environment node

import { describe, expect, test } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CLAIM_MARKER, CLAIM_STALE_MS, claimReportGeneration } from "./claim";

type Row = {
  id: string;
  assessment_id: string;
  gcs_url: string;
  generated_at: string | null;
};

/**
 * Models the one guarantee the real table gives us: the unique index on
 * assessment_id, so a second insert for the same assessment cannot land.
 * Everything the claim protocol claims to do rests on that, so the fake
 * enforces it rather than assuming it.
 */
function fakeReportsTable(initial: Row[] = []) {
  const rows = [...initial];
  let nextId = initial.length + 1;

  const client = {
    from(table: string) {
      if (table !== "reports") throw new Error(`unexpected table ${table}`);

      const filters: Array<(row: Row) => boolean> = [];
      let pending: Partial<Row> | null = null;
      let mode: "select" | "update" | "upsert" = "select";
      let upsertReturned: Row | null = null;

      const chain = {
        select() {
          return chain;
        },
        eq(column: keyof Row, value: unknown) {
          filters.push((row) => row[column] === value);
          return chain;
        },
        lt(column: keyof Row, value: string) {
          filters.push((row) => (row[column] as string) < value);
          return chain;
        },
        upsert(values: Omit<Row, "id">) {
          mode = "upsert";
          const clash = rows.find(
            (row) => row.assessment_id === values.assessment_id
          );
          if (!clash) {
            const row = { id: `report-${nextId++}`, ...values };
            rows.push(row);
            upsertReturned = row;
          } else {
            upsertReturned = null; // ignoreDuplicates
          }
          return chain;
        },
        update(values: Partial<Row>) {
          mode = "update";
          pending = values;
          return chain;
        },
        async maybeSingle() {
          if (mode === "upsert") {
            return { data: upsertReturned, error: null };
          }
          const matched = rows.filter((row) => filters.every((f) => f(row)));
          if (mode === "update") {
            for (const row of matched) Object.assign(row, pending);
            return { data: matched[0] ?? null, error: null };
          }
          return { data: matched[0] ?? null, error: null };
        },
      };

      return chain;
    },
  };

  return { client: client as unknown as SupabaseClient, rows };
}

const NOW = "2026-08-04T21:00:00.000Z";

function ago(ms: number): string {
  return new Date(Date.parse(NOW) - ms).toISOString();
}

describe("claimReportGeneration", () => {
  test("the first caller wins and gets a claim row", async () => {
    const { client, rows } = fakeReportsTable();

    const result = await claimReportGeneration(client, "assessment-1", NOW);

    expect(result).toEqual({ outcome: "claimed", reportId: "report-1" });
    expect(rows).toHaveLength(1);
    expect(rows[0].gcs_url).toBe(CLAIM_MARKER);
  });

  test("only one of three concurrent callers may render", async () => {
    const { client, rows } = fakeReportsTable();

    // The exact scenario recorded on 3 August: three callers, all past the old
    // check-then-act guard, arriving within ~1.5s of each other.
    const results = [
      await claimReportGeneration(client, "assessment-1", NOW),
      await claimReportGeneration(client, "assessment-1", NOW),
      await claimReportGeneration(client, "assessment-1", NOW),
    ];

    expect(results.filter((r) => r.outcome === "claimed")).toHaveLength(1);
    expect(results.filter((r) => r.outcome === "in-progress")).toHaveLength(2);
    expect(rows).toHaveLength(1);
  });

  test("reports an already-published report as complete", async () => {
    const { client } = fakeReportsTable([
      {
        id: "report-9",
        assessment_id: "assessment-1",
        gcs_url: "https://storage.example/report.pdf",
        generated_at: ago(60_000),
      },
    ]);

    const result = await claimReportGeneration(client, "assessment-1", NOW);

    expect(result).toEqual({ outcome: "already-complete" });
  });

  test("a live claim is left alone", async () => {
    const { client } = fakeReportsTable([
      {
        id: "report-9",
        assessment_id: "assessment-1",
        gcs_url: CLAIM_MARKER,
        generated_at: ago(CLAIM_STALE_MS - 5_000),
      },
    ]);

    const result = await claimReportGeneration(client, "assessment-1", NOW);

    expect(result).toEqual({ outcome: "in-progress" });
  });

  test("an abandoned claim is taken over", async () => {
    // Older than maxDuration, so its holder cannot still be running.
    const { client, rows } = fakeReportsTable([
      {
        id: "report-9",
        assessment_id: "assessment-1",
        gcs_url: CLAIM_MARKER,
        generated_at: ago(CLAIM_STALE_MS + 5_000),
      },
    ]);

    const result = await claimReportGeneration(client, "assessment-1", NOW);

    expect(result).toEqual({ outcome: "claimed", reportId: "report-9" });
    expect(rows[0].generated_at).toBe(NOW);
  });

  test("only one caller can take over the same abandoned claim", async () => {
    const { client } = fakeReportsTable([
      {
        id: "report-9",
        assessment_id: "assessment-1",
        gcs_url: CLAIM_MARKER,
        generated_at: ago(CLAIM_STALE_MS + 5_000),
      },
    ]);

    const first = await claimReportGeneration(client, "assessment-1", NOW);
    const second = await claimReportGeneration(client, "assessment-1", NOW);

    expect(first.outcome).toBe("claimed");
    // The compare-and-swap moved generated_at, so the second caller's `lt`
    // predicate no longer matches.
    expect(second.outcome).toBe("in-progress");
  });

  test("a claim with no timestamp is treated as live, not stale", async () => {
    const { client } = fakeReportsTable([
      {
        id: "report-9",
        assessment_id: "assessment-1",
        gcs_url: CLAIM_MARKER,
        generated_at: null,
      },
    ]);

    const result = await claimReportGeneration(client, "assessment-1", NOW);

    expect(result).toEqual({ outcome: "in-progress" });
  });
});
