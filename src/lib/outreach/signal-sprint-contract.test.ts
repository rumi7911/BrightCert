// @vitest-environment node

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { parseCsv } from "./csv";

const ALIGNMENT_HEADERS = [
  "cohort_id",
  "prospect_id",
  "content_theme",
  "content_item_id",
  "content_published_at",
  "linkedin_engagement_status",
  "linkedin_engagement_at",
  "first_touch_target_date",
  "operator_notes",
] as const;

const ALLOWED_THEMES = new Set([
  "requirement_urgency",
  "evidence_before_action",
  "readiness_before_certification",
]);

const ALLOWED_ENGAGEMENT_STATES = new Set([
  "not_reviewed",
  "no_natural_action",
  "useful_comment",
  "connection_existing",
  "connection_requested",
]);

const TRIGGER_MAP = new Map([
  ["tender_requirement", "requirement_urgency"],
  ["customer_assurance", "requirement_urgency"],
  ["supply_chain", "requirement_urgency"],
  ["renewal", "readiness_before_certification"],
  ["msp_client_service", "evidence_before_action"],
]);

const root = process.cwd();

describe("integrated signal sprint contract", () => {
  test("alignment example uses the exact private planning schema", async () => {
    const path = join(
      root,
      "outreach/templates/signal-sprint-alignment.example.csv"
    );
    const input = await readFile(path, "utf8");
    expect(input.split(/\r?\n/, 1)[0]?.split(",")).toEqual(ALIGNMENT_HEADERS);

    const rows = parseCsv(input);
    expect(rows).toHaveLength(5);
    expect(new Set(rows.map((row) => row.prospect_id)).size).toBe(rows.length);

    for (const row of rows) {
      expect(row.cohort_id).toBe("signal_sprint_01");
      expect(ALLOWED_THEMES.has(row.content_theme)).toBe(true);
      expect(ALLOWED_ENGAGEMENT_STATES.has(row.linkedin_engagement_status)).toBe(
        true
      );
      expect(row.prospect_id).toMatch(/^(sme|msp)-example-/);
    }
  });

  test("operator playbook preserves the approved trigger mapping", async () => {
    const text = await readFile(
      join(root, "docs/outreach/INTEGRATED-SIGNAL-SPRINT.md"),
      "utf8"
    );

    for (const [trigger, theme] of TRIGGER_MAP) {
      expect(text).toContain(`| \`${trigger}\` | \`${theme}\` |`);
    }

    expect(text).toContain("does not authorise T0");
    expect(text).toContain("24 direct SMEs");
    expect(text).toContain("6 MSPs");
    expect(text).toContain("not an eligibility authority");
    expect(text).toContain("72 hours");
    expect(text).toContain("seven days");
  });
});
