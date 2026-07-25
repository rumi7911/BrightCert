import { randomUUID } from "node:crypto";
import { mkdir, rename, unlink, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { parse } from "csv-parse/sync";

export type CsvRow = Record<string, string>;

export function parseCsv(input: string): CsvRow[] {
  return parse(input, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    record_delimiter: ["\r\n", "\n", "\r"],
  }) as CsvRow[];
}

function protectSpreadsheetCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  return /^[\s\u0000-\u001f]*[=+\-@]/.test(text) ? `'${text}` : text;
}

function encodeCell(value: unknown): string {
  const protectedValue = protectSpreadsheetCell(value);
  return /[",\r\n]/.test(protectedValue)
    ? `"${protectedValue.replaceAll('"', '""')}"`
    : protectedValue;
}

export function serializeCsv(
  rows: readonly Record<string, unknown>[],
  columns?: readonly string[]
): string {
  const headers =
    columns ??
    [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const lines = [
    headers.map(encodeCell).join(","),
    ...rows.map((row) => headers.map((header) => encodeCell(row[header])).join(",")),
  ];
  return `${lines.join("\r\n")}\r\n`;
}

export async function atomicWriteText(path: string, contents: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const temporaryPath = `${path}.tmp-${process.pid}-${randomUUID()}`;
  try {
    await writeFile(temporaryPath, contents, { encoding: "utf8", mode: 0o600 });
    await rename(temporaryPath, path);
  } catch (error) {
    await unlink(temporaryPath).catch(() => undefined);
    throw error;
  }
}

export async function atomicWriteCsv(
  path: string,
  rows: readonly Record<string, unknown>[],
  columns?: readonly string[]
): Promise<void> {
  await atomicWriteText(path, serializeCsv(rows, columns));
}
