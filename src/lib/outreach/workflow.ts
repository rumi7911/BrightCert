import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  atomicWriteCsv,
  parseCsv,
  withExclusiveFileLock,
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
  "template_version",
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
  "source_url",
  "source_date",
  "trigger",
  "trigger_evidence_url",
  "personalisation_note",
  "lawful_basis",
  "lia_status",
  "suppression_status",
  "sequence_status",
  "human_approved_at",
  "existing_customer",
  "email_status",
  "company_status",
  "companies_house_checked_at",
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
  "reply",
  "opt_out",
  "bounced",
  "booked",
  "baseline_completed",
  "checkout_started",
  "paid",
  "customer",
  "refunded",
  "lost",
  "closed",
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
  "sequence_step",
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
  "sent_messages",
  "touch_1_sent",
  "delivered_messages",
  "delivery_rate",
  "positive",
  "neutral",
  "objection",
  "opt_out",
  "bounced_messages",
  "hard_bounce_rate",
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
    if (prospect.work_email) seenEmails.add(prospect.work_email);
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

function terminalEventReasons(
  events: readonly Record<string, string>[],
  prospect: Prospect
): string[] {
  const reasons = new Set<string>();
  for (const event of events) {
    if (!eventMatchesProspect(event, prospect)) continue;
    if (["positive", "neutral", "objection", "reply"].includes(event.type)) {
      reasons.add("terminal_event_replied");
    } else if (event.type === "opt_out") {
      reasons.add("terminal_event_opted_out");
    } else if (event.type === "bounced") {
      reasons.add("terminal_event_bounced");
    } else if (["paid", "customer"].includes(event.type)) {
      reasons.add("terminal_event_customer");
    } else if (["lost", "closed"].includes(event.type)) {
      reasons.add("terminal_event_closed");
    }
  }
  return [...reasons];
}

function eventMatchesProspect(
  event: Readonly<Record<string, string>>,
  prospect: Prospect
): boolean {
  return (
    event.prospect_id?.trim() === prospect.prospect_id &&
    event.campaign?.trim() === prospect.campaign &&
    event.segment?.trim().toLowerCase() === prospect.segment
  );
}

function canonicalHistoryReasons(
  events: readonly Record<string, string>[],
  prospect: Prospect,
  step: SequenceStep
): string[] {
  const matchingEvents = events.filter((event) =>
    eventMatchesProspect(event, prospect)
  );
  const reasons: string[] = [];
  if (!matchingEvents.some((event) => event.type === "imported")) {
    reasons.push("missing_imported_event");
  }
  if (
    step > 1 &&
    !matchingEvents.some(
      (event) =>
        event.type === "sent" &&
        event.sequence_step?.trim() === String(step - 1)
    )
  ) {
    reasons.push("missing_prior_step_sent_event");
  }
  return reasons;
}

function verificationReason(result: CompanyVerificationResult): string {
  return result.kind === "error"
    ? `companies_house_${result.code}`
    : `companies_house_${result.kind}`;
}

export async function buildQueueRows(
  rows: readonly Record<string, unknown>[],
  suppressions: readonly Suppression[],
  events: readonly Record<string, string>[],
  step: SequenceStep,
  verifier: (companyNumber: string) => Promise<CompanyVerificationResult>
): Promise<Array<
  CsvRow & {
    sequence_step: string;
    queue_status: string;
    gate_reasons: string;
    verification_result: string;
    verification_reason: string;
  }
>> {
  const seenProspectIds = new Set<string>();
  const seenEmails = new Set<string>();
  const output: Array<
    CsvRow & {
      sequence_step: string;
      queue_status: string;
      gate_reasons: string;
      verification_result: string;
      verification_reason: string;
    }
  > = [];

  for (const input of rows) {
    const prospect = normalizeProspect(input);
    const gate = gateProspect(prospect, {
      step,
      skipCompanyVerification: true,
      suppressions,
      seenProspectIds,
      seenEmails,
    });
    const reasons = [
      ...gate.reasons,
      ...canonicalHistoryReasons(events, prospect, step),
      ...terminalEventReasons(events, prospect),
    ];
    if (prospect.prospect_id) seenProspectIds.add(prospect.prospect_id);
    if (prospect.work_email) seenEmails.add(prospect.work_email);

    const row = prospectToRow(prospect);
    row.company_status = "";
    row.companies_house_checked_at = "";
    let verificationResult = "not_attempted";
    let verificationResultReason = "";

    if (reasons.length === 0) {
      const result = await verifier(prospect.company_number);
      verificationResult = result.kind;
      if (
        result.kind === "active" ||
        result.kind === "inactive" ||
        result.kind === "unsupported"
      ) {
        row.company_status = result.companyStatus;
        row.legal_entity_type = result.companyType;
        row.companies_house_checked_at = result.checkedAt;
      } else {
        row.legal_entity_type = "";
      }
      if (result.kind !== "active") {
        verificationResultReason = verificationReason(result);
        reasons.push(verificationResultReason);
      }
    }

    const uniqueReasons = [...new Set(reasons)];
    output.push({
      ...row,
      sequence_step: String(step),
      queue_status:
        uniqueReasons.length === 0 ? "ready_manual_send" : "blocked",
      gate_reasons: uniqueReasons.join(";"),
      verification_result: verificationResult,
      verification_reason: verificationResultReason,
    });
  }

  return output;
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
      row.legal_entity_type = result.companyType;
      row.companies_house_checked_at = result.checkedAt;
    } else {
      row.company_status = "";
      row.legal_entity_type = "";
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
  await withExclusiveFileLock(path, async () => {
    try {
      await readFile(path, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      await atomicWriteCsv(path, [], SUPPRESSION_COLUMNS);
    }
  });
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
  await withExclusiveFileLock(path, async () => {
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
  });
}

export interface NewOutreachEvent {
  prospect_id: string;
  type: OutreachEventType;
  campaign: string;
  segment: string;
  trigger?: string;
  template_version?: string;
  sequence_step?: SequenceStep;
  occurred_at?: string;
  amount_paid?: string;
}

const MESSAGE_EVENT_TYPES = new Set<OutreachEventType>([
  "sent",
  "delivered",
  "bounced",
]);

function validateEvent(event: NewOutreachEvent): void {
  if (!EVENT_TYPES.includes(event.type)) {
    throw new Error(`Unsupported outreach event type: ${event.type}`);
  }
  if (!event.prospect_id.trim() || !event.campaign.trim() || !event.segment.trim()) {
    throw new Error("Event requires prospect_id, campaign, and segment");
  }
  if (
    event.sequence_step !== undefined &&
    ![1, 2, 3].includes(event.sequence_step)
  ) {
    throw new Error("sequence_step must be 1, 2, or 3");
  }
  if (MESSAGE_EVENT_TYPES.has(event.type) && event.sequence_step === undefined) {
    throw new Error(`sequence_step is required for ${event.type} events`);
  }
  if (
    event.amount_paid &&
    (!Number.isFinite(Number(event.amount_paid)) || Number(event.amount_paid) < 0)
  ) {
    throw new Error("amount_paid must be a non-negative number");
  }
  if (
    event.occurred_at &&
    Number.isNaN(new Date(event.occurred_at).getTime())
  ) {
    throw new Error("occurred_at must be a valid timestamp");
  }
}

export async function appendEvent(
  path: string,
  event: NewOutreachEvent,
  now: () => Date = () => new Date()
): Promise<void> {
  validateEvent(event);
  const occurredAt = event.occurred_at
    ? new Date(event.occurred_at)
    : now();
  await withExclusiveFileLock(path, async () => {
    const rows = await readRowsIfPresent(path);
    rows.push({
      event_id: randomUUID(),
      prospect_id: event.prospect_id.trim(),
      type: event.type,
      campaign: event.campaign.trim(),
      segment: event.segment.trim().toLowerCase(),
      trigger: event.trigger?.trim() ?? "",
      template_version: event.template_version?.trim() ?? "",
      sequence_step: event.sequence_step?.toString() ?? "",
      occurred_at: occurredAt.toISOString(),
      amount_paid: event.amount_paid?.trim() ?? "",
    });
    await atomicWriteCsv(path, rows, EVENT_COLUMNS);
  });
}

export async function recordProspectEvent(
  eventStore: string,
  suppressionStore: string,
  prospectRows: readonly Record<string, unknown>[],
  event: NewOutreachEvent,
  now: () => Date = () => new Date()
): Promise<void> {
  validateEvent(event);
  const matches = prospectRows
    .map((row) => normalizeProspect(row))
    .filter((prospect) => prospect.prospect_id === event.prospect_id.trim());
  const prospect = matches.length === 1 ? matches[0] : undefined;
  if (
    !prospect ||
    prospect.campaign !== event.campaign.trim() ||
    prospect.segment !== event.segment.trim().toLowerCase()
  ) {
    throw new Error(
      "Event prospect, campaign, and segment must match one canonical prospect"
    );
  }

  if (event.type === "opt_out" || event.type === "bounced") {
    await addSuppression(
      suppressionStore,
      {
        scope: "email",
        value: prospect.work_email,
        reason: event.type,
      },
      now
    );
  }

  await appendEvent(
    eventStore,
    {
      ...event,
      campaign: prospect.campaign,
      segment: prospect.segment,
      trigger: prospect.trigger,
      template_version: prospect.template_version,
    },
    now
  );
}

interface FunnelAccumulator {
  dimensions: Record<string, string>;
  metrics: Map<string, Set<string>>;
  paidByProspect: Map<string, number>;
}

function percentage(numerator: number, denominator: number): string {
  return denominator === 0
    ? "n/a"
    : `${((numerator / denominator) * 100).toFixed(2)}%`;
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
    if (
      MESSAGE_EVENT_TYPES.has(event.type as OutreachEventType) &&
      !["1", "2", "3"].includes(event.sequence_step)
    ) {
      continue;
    }
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
    const metricIdentity = MESSAGE_EVENT_TYPES.has(
      event.type as OutreachEventType
    )
      ? `${event.prospect_id}\u001f${event.sequence_step}`
      : event.prospect_id;
    prospects.add(metricIdentity);
    group.metrics.set(metric, prospects);
    if (event.type === "sent" && event.sequence_step === "1") {
      const touchOneProspects =
        group.metrics.get("touch_1_sent") ?? new Set<string>();
      touchOneProspects.add(event.prospect_id);
      group.metrics.set("touch_1_sent", touchOneProspects);
    }
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
    .map((group) => {
      const sentMessages = group.metrics.get("sent")?.size ?? 0;
      const deliveredMessages = group.metrics.get("delivered")?.size ?? 0;
      const bouncedMessages = group.metrics.get("bounced")?.size ?? 0;
      return {
        ...group.dimensions,
        imported: String(group.metrics.get("imported")?.size ?? 0),
        eligible_queued: String(
          group.metrics.get("eligible_queued")?.size ?? 0
        ),
        sent_messages: String(sentMessages),
        touch_1_sent: String(group.metrics.get("touch_1_sent")?.size ?? 0),
        delivered_messages: String(deliveredMessages),
        delivery_rate: percentage(deliveredMessages, sentMessages),
        positive: String(group.metrics.get("positive")?.size ?? 0),
        neutral: String(group.metrics.get("neutral")?.size ?? 0),
        objection: String(group.metrics.get("objection")?.size ?? 0),
        opt_out: String(group.metrics.get("opt_out")?.size ?? 0),
        bounced_messages: String(bouncedMessages),
        hard_bounce_rate: percentage(bouncedMessages, sentMessages),
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
      };
    });
}
