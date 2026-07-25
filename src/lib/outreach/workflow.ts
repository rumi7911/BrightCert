import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  atomicWriteCsv,
  parseCsv,
  type CsvRow,
} from "./csv";
import {
  gateProspect,
  normalizeCompanyNumber,
  normalizeDomain,
  normalizeProspect,
  type Prospect,
  type SequenceStep,
  type Suppression,
} from "./gate";
import type { CompanyVerificationResult } from "./companies-house";

export const PROSPECT_COLUMNS = [
  "prospect_id",
  "campaign",
  "segment",
  "template_version",
  "first_name",
  "last_name",
  "job_title",
  "email",
  "company_name",
  "company_number",
  "company_domain",
  "source_url",
  "source_date",
  "trigger",
  "trigger_evidence",
  "lia_status",
  "human_approved_at",
  "existing_customer",
  "email_status",
  "company_status",
  "company_type",
  "companies_house_checked_at",
  "sequence_state",
] as const;

export const SUPPRESSION_COLUMNS = [
  "scope",
  "value",
  "reason",
  "created_at",
] as const;

export const EVENT_TYPES = [
  "imported",
  "eligible",
  "queued",
  "sent",
  "delivered",
  "positive",
  "neutral",
  "objection",
  "opt_out",
  "bounced",
  "booked",
  "baseline_completed",
  "checkout_started",
  "paid",
  "refunded",
  "lost",
] as const;

export type OutreachEventType = (typeof EVENT_TYPES)[number];

export const EVENT_COLUMNS = [
  "event_id",
  "prospect_id",
  "type",
  "campaign",
  "segment",
  "trigger",
  "template_version",
  "occurred_at",
  "amount_paid",
] as const;

export const REPORT_COLUMNS = [
  "week_start",
  "campaign",
  "segment",
  "trigger",
  "template_version",
  "imported",
  "eligible_queued",
  "sent",
  "delivered",
  "positive",
  "neutral",
  "objection",
  "opt_out",
  "bounced",
  "booked",
  "baseline_completed",
  "checkout_started",
  "paid",
  "refunded",
  "lost",
  "paid_revenue",
] as const;

function prospectToRow(prospect: Prospect): CsvRow {
  return {
    ...prospect,
    existing_customer:
      prospect.existing_customer === null
        ? ""
        : prospect.existing_customer
          ? "true"
          : "false",
  };
}

function gateRows(
  rows: readonly Record<string, unknown>[],
  suppressions: readonly Suppression[],
  step?: SequenceStep
): Array<CsvRow & { gate_reasons: string }> {
  const seenProspectIds = new Set<string>();
  const seenEmails = new Set<string>();

  return rows.map((row) => {
    const prospect = normalizeProspect(row);
    const gate = gateProspect(prospect, {
      step,
      suppressions,
      seenProspectIds,
      seenEmails,
    });
    if (prospect.prospect_id) seenProspectIds.add(prospect.prospect_id);
    if (prospect.email) seenEmails.add(prospect.email);
    return {
      ...prospectToRow(prospect),
      gate_reasons: gate.reasons.join(";"),
    };
  });
}

export function validateProspectRows(
  rows: readonly Record<string, unknown>[]
): Array<CsvRow & { gate_status: string; gate_reasons: string }> {
  return gateRows(rows, []).map((row) => ({
    ...row,
    gate_status: row.gate_reasons ? "blocked" : "eligible",
  }));
}

export function buildQueueRows(
  rows: readonly Record<string, unknown>[],
  suppressions: readonly Suppression[],
  step: SequenceStep
): Array<
  CsvRow & {
    sequence_step: string;
    queue_status: string;
    gate_reasons: string;
  }
> {
  return gateRows(rows, suppressions, step).map((row) => ({
    ...row,
    sequence_step: String(step),
    queue_status: row.gate_reasons ? "blocked" : "ready_manual_send",
  }));
}

export async function verifyProspectRows(
  rows: readonly Record<string, unknown>[],
  verifier: (companyNumber: string) => Promise<CompanyVerificationResult>
): Promise<Array<CsvRow & { verification_result: string; verification_reason: string }>> {
  const output: Array<
    CsvRow & { verification_result: string; verification_reason: string }
  > = [];

  for (const input of rows) {
    const prospect = normalizeProspect(input);
    const result = await verifier(prospect.company_number);
    const row = prospectToRow(prospect);
    if (
      result.kind === "active" ||
      result.kind === "inactive" ||
      result.kind === "unsupported"
    ) {
      row.company_status = result.companyStatus;
      row.company_type = result.companyType;
      row.companies_house_checked_at = result.checkedAt;
    } else {
      row.company_status = "";
      row.company_type = "";
      row.companies_house_checked_at = "";
    }
    output.push({
      ...row,
      verification_result: result.kind,
      verification_reason:
        result.kind === "active"
          ? ""
          : result.kind === "error"
            ? result.code
            : result.kind,
    });
  }

  return output;
}

async function readRowsIfPresent(path: string): Promise<CsvRow[]> {
  try {
    return parseCsv(await readFile(path, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function seedSuppressionStore(path: string): Promise<void> {
  try {
    await readFile(path, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    await atomicWriteCsv(path, [], SUPPRESSION_COLUMNS);
  }
}

function normalizedSuppressionValue(
  scope: Suppression["scope"],
  value: string
): string {
  return scope === "email"
    ? value.trim().toLowerCase()
    : scope === "domain"
      ? normalizeDomain(value)
      : normalizeCompanyNumber(value);
}

export async function addSuppression(
  path: string,
  suppression: Omit<Suppression, "created_at">,
  now: () => Date = () => new Date()
): Promise<void> {
  const rows = await readRowsIfPresent(path);
  const value = normalizedSuppressionValue(
    suppression.scope,
    suppression.value
  );
  if (
    rows.some(
      (row) =>
        row.scope === suppression.scope &&
        normalizedSuppressionValue(suppression.scope, row.value) === value
    )
  ) {
    return;
  }
  rows.push({
    scope: suppression.scope,
    value,
    reason: suppression.reason.trim(),
    created_at: now().toISOString(),
  });
  await atomicWriteCsv(path, rows, SUPPRESSION_COLUMNS);
}

export interface NewOutreachEvent {
  prospect_id: string;
  type: OutreachEventType;
  campaign: string;
  segment: string;
  trigger?: string;
  template_version?: string;
  occurred_at?: string;
  amount_paid?: string;
}

export async function appendEvent(
  path: string,
  event: NewOutreachEvent,
  now: () => Date = () => new Date()
): Promise<void> {
  if (!EVENT_TYPES.includes(event.type)) {
    throw new Error(`Unsupported outreach event type: ${event.type}`);
  }
  if (!event.prospect_id.trim() || !event.campaign.trim() || !event.segment.trim()) {
    throw new Error("Event requires prospect_id, campaign, and segment");
  }
  if (
    event.amount_paid &&
    (!Number.isFinite(Number(event.amount_paid)) || Number(event.amount_paid) < 0)
  ) {
    throw new Error("amount_paid must be a non-negative number");
  }
  const occurredAt = event.occurred_at
    ? new Date(event.occurred_at)
    : now();
  if (Number.isNaN(occurredAt.getTime())) {
    throw new Error("occurred_at must be a valid timestamp");
  }
  const rows = await readRowsIfPresent(path);
  rows.push({
    event_id: randomUUID(),
    prospect_id: event.prospect_id.trim(),
    type: event.type,
    campaign: event.campaign.trim(),
    segment: event.segment.trim().toLowerCase(),
    trigger: event.trigger?.trim() ?? "",
    template_version: event.template_version?.trim() ?? "",
    occurred_at: occurredAt.toISOString(),
    amount_paid: event.amount_paid?.trim() ?? "",
  });
  await atomicWriteCsv(path, rows, EVENT_COLUMNS);
}

interface FunnelAccumulator {
  dimensions: Record<string, string>;
  metrics: Map<string, Set<string>>;
  paidByProspect: Map<string, number>;
}

function mondayUtc(date: Date): string {
  const monday = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const day = monday.getUTCDay();
  monday.setUTCDate(monday.getUTCDate() - (day === 0 ? 6 : day - 1));
  return monday.toISOString().slice(0, 10);
}

export function buildWeeklyFunnel(
  events: readonly Record<string, string>[]
): CsvRow[] {
  const groups = new Map<string, FunnelAccumulator>();

  for (const event of events) {
    if (!EVENT_TYPES.includes(event.type as OutreachEventType)) continue;
    const occurredAt = new Date(event.occurred_at);
    if (Number.isNaN(occurredAt.getTime()) || !event.prospect_id) continue;
    const dimensions = {
      week_start: mondayUtc(occurredAt),
      campaign: event.campaign ?? "",
      segment: event.segment ?? "",
      trigger: event.trigger ?? "",
      template_version: event.template_version ?? "",
    };
    const key = Object.values(dimensions).join("\u001f");
    const group =
      groups.get(key) ??
      {
        dimensions,
        metrics: new Map<string, Set<string>>(),
        paidByProspect: new Map<string, number>(),
      };
    groups.set(key, group);

    const metric =
      event.type === "eligible" || event.type === "queued"
        ? "eligible_queued"
        : event.type;
    const prospects = group.metrics.get(metric) ?? new Set<string>();
    prospects.add(event.prospect_id);
    group.metrics.set(metric, prospects);
    if (event.type === "paid") {
      const amount = Number(event.amount_paid || 0);
      if (Number.isFinite(amount)) {
        group.paidByProspect.set(
          event.prospect_id,
          Math.max(group.paidByProspect.get(event.prospect_id) ?? 0, amount)
        );
      }
    }
  }

  return [...groups.values()]
    .sort((left, right) =>
      Object.values(left.dimensions)
        .join("\u001f")
        .localeCompare(Object.values(right.dimensions).join("\u001f"))
    )
    .map((group) => ({
      ...group.dimensions,
      imported: String(group.metrics.get("imported")?.size ?? 0),
      eligible_queued: String(group.metrics.get("eligible_queued")?.size ?? 0),
      sent: String(group.metrics.get("sent")?.size ?? 0),
      delivered: String(group.metrics.get("delivered")?.size ?? 0),
      positive: String(group.metrics.get("positive")?.size ?? 0),
      neutral: String(group.metrics.get("neutral")?.size ?? 0),
      objection: String(group.metrics.get("objection")?.size ?? 0),
      opt_out: String(group.metrics.get("opt_out")?.size ?? 0),
      bounced: String(group.metrics.get("bounced")?.size ?? 0),
      booked: String(group.metrics.get("booked")?.size ?? 0),
      baseline_completed: String(
        group.metrics.get("baseline_completed")?.size ?? 0
      ),
      checkout_started: String(
        group.metrics.get("checkout_started")?.size ?? 0
      ),
      paid: String(group.metrics.get("paid")?.size ?? 0),
      refunded: String(group.metrics.get("refunded")?.size ?? 0),
      lost: String(group.metrics.get("lost")?.size ?? 0),
      paid_revenue: [...group.paidByProspect.values()]
        .reduce((sum, amount) => sum + amount, 0)
        .toFixed(2),
    }));
}
