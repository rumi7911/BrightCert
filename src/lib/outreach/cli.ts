import { readFile } from "node:fs/promises";
import { verifyCompanyNumber, type CompanyVerificationResult } from "./companies-house";
import { atomicWriteCsv, parseCsv } from "./csv";
import type { SequenceStep, Suppression } from "./gate";
import {
  EVENT_TYPES,
  PROSPECT_COLUMNS,
  REPORT_COLUMNS,
  addSuppression,
  appendEvent,
  buildQueueRows,
  buildWeeklyFunnel,
  seedSuppressionStore,
  validateProspectRows,
  verifyProspectRows,
  type OutreachEventType,
} from "./workflow";

type Environment = Record<string, string | undefined>;

export interface CliDependencies {
  env?: Environment;
  verifier?: (companyNumber: string) => Promise<CompanyVerificationResult>;
}

function parseOptions(args: readonly string[]): Map<string, string> {
  const options = new Map<string, string>();
  for (let index = 0; index < args.length; index += 2) {
    const option = args[index];
    const value = args[index + 1];
    if (!option?.startsWith("--") || value == null || value.startsWith("--")) {
      throw new Error(`Invalid or missing value for ${option ?? "option"}`);
    }
    if (options.has(option)) throw new Error(`Duplicate option: ${option}`);
    options.set(option, value);
  }
  return options;
}

function required(options: Map<string, string>, name: string): string {
  const value = options.get(name)?.trim();
  if (!value) throw new Error(`Missing required option: ${name}`);
  return value;
}

function ensureOnly(
  options: Map<string, string>,
  allowed: readonly string[]
): void {
  for (const name of options.keys()) {
    if (!allowed.includes(name)) throw new Error(`Unknown option: ${name}`);
  }
}

async function readCsv(path: string): Promise<Record<string, string>[]> {
  return parseCsv(await readFile(path, "utf8"));
}

function readSuppressions(rows: readonly Record<string, string>[]): Suppression[] {
  return rows.map((row, index) => {
    if (!["email", "domain", "company"].includes(row.scope)) {
      throw new Error(`Invalid suppression scope on row ${index + 2}`);
    }
    if (!row.value?.trim() || !row.reason?.trim()) {
      throw new Error(`Incomplete suppression on row ${index + 2}`);
    }
    return {
      scope: row.scope as Suppression["scope"],
      value: row.value,
      reason: row.reason,
      created_at: row.created_at,
    };
  });
}

async function validateCommand(options: Map<string, string>) {
  ensureOnly(options, ["--input", "--output"]);
  const input = required(options, "--input");
  const output = required(options, "--output");
  const rows = validateProspectRows(await readCsv(input));
  await atomicWriteCsv(output, rows, [
    ...PROSPECT_COLUMNS,
    "gate_status",
    "gate_reasons",
  ]);
}

async function verifyCommand(
  options: Map<string, string>,
  dependencies: CliDependencies
) {
  ensureOnly(options, ["--input", "--output"]);
  const input = required(options, "--input");
  const output = required(options, "--output");
  const apiKey =
    (dependencies.env ?? process.env).COMPANIES_HOUSE_API_KEY?.trim() ?? "";
  if (!apiKey) {
    throw new Error(
      "COMPANIES_HOUSE_API_KEY is required for Companies House verification"
    );
  }
  const verifier =
    dependencies.verifier ??
    ((companyNumber: string) =>
      verifyCompanyNumber(companyNumber, { apiKey }));
  const rows = await verifyProspectRows(await readCsv(input), verifier);
  await atomicWriteCsv(output, rows, [
    ...PROSPECT_COLUMNS,
    "verification_result",
    "verification_reason",
  ]);
}

async function queueCommand(options: Map<string, string>) {
  ensureOnly(options, [
    "--input",
    "--suppressions",
    "--step",
    "--output",
  ]);
  const input = required(options, "--input");
  const suppressions = required(options, "--suppressions");
  const output = required(options, "--output");
  const rawStep = required(options, "--step");
  if (!["1", "2", "3"].includes(rawStep)) {
    throw new Error("--step must be 1, 2, or 3");
  }
  const rows = buildQueueRows(
    await readCsv(input),
    readSuppressions(await readCsv(suppressions)),
    Number(rawStep) as SequenceStep
  );
  await atomicWriteCsv(output, rows, [
    ...PROSPECT_COLUMNS,
    "sequence_step",
    "queue_status",
    "gate_reasons",
  ]);
}

async function suppressCommand(options: Map<string, string>) {
  ensureOnly(options, ["--store", "--scope", "--value", "--reason"]);
  const scope = required(options, "--scope");
  if (!["email", "domain", "company"].includes(scope)) {
    throw new Error("--scope must be email, domain, or company");
  }
  await addSuppression(required(options, "--store"), {
    scope: scope as Suppression["scope"],
    value: required(options, "--value"),
    reason: required(options, "--reason"),
  });
}

async function eventCommand(options: Map<string, string>) {
  ensureOnly(options, [
    "--store",
    "--prospect-id",
    "--type",
    "--campaign",
    "--segment",
    "--trigger",
    "--template-version",
    "--occurred-at",
    "--amount-paid",
  ]);
  const type = required(options, "--type");
  if (!EVENT_TYPES.includes(type as OutreachEventType)) {
    throw new Error(`Unsupported outreach event type: ${type}`);
  }
  await appendEvent(required(options, "--store"), {
    prospect_id: required(options, "--prospect-id"),
    type: type as OutreachEventType,
    campaign: required(options, "--campaign"),
    segment: required(options, "--segment"),
    trigger: options.get("--trigger"),
    template_version: options.get("--template-version"),
    occurred_at: options.get("--occurred-at"),
    amount_paid: options.get("--amount-paid"),
  });
}

async function reportCommand(options: Map<string, string>) {
  ensureOnly(options, ["--events", "--output"]);
  const events = await readCsv(required(options, "--events"));
  await atomicWriteCsv(
    required(options, "--output"),
    buildWeeklyFunnel(events),
    REPORT_COLUMNS
  );
}

async function seedCommand(options: Map<string, string>) {
  ensureOnly(options, ["--store"]);
  await seedSuppressionStore(required(options, "--store"));
}

export async function runCli(
  args: readonly string[],
  dependencies: CliDependencies = {}
): Promise<void> {
  const [command, ...optionArgs] = args;
  if (!command) throw new Error("An outreach command is required");
  const options = parseOptions(optionArgs);

  switch (command) {
    case "validate":
      await validateCommand(options);
      return;
    case "verify":
      await verifyCommand(options, dependencies);
      return;
    case "queue":
      await queueCommand(options);
      return;
    case "suppress":
      await suppressCommand(options);
      return;
    case "event":
      await eventCommand(options);
      return;
    case "report":
      await reportCommand(options);
      return;
    case "seed-suppressions":
      await seedCommand(options);
      return;
    default:
      throw new Error(`Unknown outreach command: ${command}`);
  }
}
