/**
 * Contracts Finder research helper.
 *
 * Produces *candidates for human triage*, never prospect rows. A notice
 * mentioning Cyber Essentials is not by itself a trigger: ICP.md rates
 * "company operates in a sector that sells to government" as Weak and requires
 * the notice to name Cyber Essentials in its requirements or scoring, with the
 * specific company linked to that specific notice. Only a human can make that
 * link, so nothing here writes to the prospect pipeline.
 *
 * The one thing this module does that matters: the Contracts Finder keyword
 * search is fuzzy. Searching `cyber essentials` unquoted returns notices with
 * no mention of it at all (observed: a Surrey County Council social-care
 * notice, score 1). Every result is therefore re-checked against the raw text
 * before it is emitted.
 */

import { extname, isAbsolute, relative, resolve, sep } from "node:path";

const SEARCH_ENDPOINT =
  "https://www.contractsfinder.service.gov.uk/api/rest/2/search_notices/json";

/** Notice pages 403 automated requests; open these in a browser. */
const NOTICE_URL_PREFIX = "https://www.contractsfinder.service.gov.uk/notice/";

export type NoticeStatus = "Open" | "Closed" | "Awarded" | "Cancelled";

export interface SearchOptions {
  readonly phrase: string;
  readonly statuses: readonly NoticeStatus[];
  readonly page?: number;
  readonly size?: number;
  readonly publishedFrom?: string;
  readonly publishedTo?: string;
}

export interface NoticeItem {
  readonly id?: string;
  readonly title?: string;
  readonly description?: string;
  readonly organisationName?: string;
  readonly awardedSupplier?: string | null;
  readonly awardedDate?: string | null;
  readonly awardedValue?: number | null;
  readonly publishedDate?: string;
  readonly deadlineDate?: string | null;
  readonly noticeType?: string;
  readonly noticeStatus?: string;
  readonly isSuitableForSme?: boolean;
  readonly region?: string;
  readonly postcode?: string | null;
}

export const CANDIDATE_COLUMNS = [
  "notice_id",
  "notice_url",
  "notice_status",
  "notice_type",
  "published_date",
  "deadline_date",
  "buyer_organisation",
  "awarded_supplier",
  "awarded_date",
  "awarded_value",
  "suitable_for_sme",
  "region",
  "postcode",
  "phrase_in_title",
  "phrase_in_description",
  "suggested_play",
  "evidence_snippet",
  "triage_decision",
  "triage_note",
] as const;

export function buildSearchBody(options: SearchOptions): Record<string, unknown> {
  const searchCriteria: Record<string, unknown> = {
    // Quoted so the API treats it as a phrase. It still returns loose matches,
    // which is why containsPhrase() re-checks every result.
    keyword: `"${options.phrase}"`,
    statuses: [...options.statuses],
  };
  if (options.publishedFrom) searchCriteria.publishedFrom = options.publishedFrom;
  if (options.publishedTo) searchCriteria.publishedTo = options.publishedTo;

  return {
    searchCriteria,
    size: options.size ?? 100,
    page: options.page ?? 1,
  };
}

export function searchEndpoint(): string {
  return SEARCH_ENDPOINT;
}

export function noticeUrl(id: string): string {
  return `${NOTICE_URL_PREFIX}${id}`;
}

export function resolveCandidateOutputPath(
  output: string,
  cwd = process.cwd()
): string {
  const runsDirectory = resolve(cwd, "outreach/runs");
  const resolvedOutput = resolve(cwd, output);
  const relativeOutput = relative(runsDirectory, resolvedOutput);
  const isInsideRuns =
    relativeOutput.length > 0 &&
    relativeOutput !== ".." &&
    !relativeOutput.startsWith(`..${sep}`) &&
    !isAbsolute(relativeOutput);

  if (!isInsideRuns || extname(resolvedOutput).toLowerCase() !== ".csv") {
    throw new Error("Output must be a CSV beneath outreach/runs/");
  }

  return resolvedOutput;
}

/**
 * Normalise for comparison: decode the numeric entities the API emits, flatten
 * CRLF and repeated whitespace, lower-case. Without the whitespace flattening a
 * phrase split across a line break is missed.
 */
export function normaliseText(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec: string) =>
      String.fromCodePoint(Number.parseInt(dec, 10))
    )
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function containsPhrase(
  text: string | null | undefined,
  phrase: string
): boolean {
  const haystack = normaliseText(text);
  const needle = normaliseText(phrase);
  return needle.length > 0 && haystack.includes(needle);
}

/**
 * A window of surrounding text so the operator can judge whether the notice
 * *requires* the certification or merely mentions it. That distinction is the
 * difference between a Strong and a Weak trigger under ICP.md.
 */
export function evidenceSnippet(
  text: string | null | undefined,
  phrase: string,
  radius = 160
): string {
  const haystack = normaliseText(text);
  const needle = normaliseText(phrase);
  const at = haystack.indexOf(needle);
  if (at < 0) return "";
  const start = Math.max(0, at - radius);
  const end = Math.min(haystack.length, at + needle.length + radius);
  return `${start > 0 ? "…" : ""}${haystack.slice(start, end)}${end < haystack.length ? "…" : ""}`;
}

/**
 * Which of the two plays in TRIGGER-RESEARCH-METHOD.md this notice could feed.
 * Deliberately descriptive, not a verdict — the human decides.
 */
export function suggestedPlay(item: NoticeItem): string {
  if (item.awardedSupplier && item.awardedSupplier.trim()) {
    return "awarded_supplier";
  }
  if ((item.noticeStatus ?? "").toLowerCase() === "open") {
    return "open_notice";
  }
  return "no_named_company";
}

export function toCandidateRow(
  item: NoticeItem,
  phrase: string
): Record<string, unknown> {
  const inTitle = containsPhrase(item.title, phrase);
  const inDescription = containsPhrase(item.description, phrase);
  return {
    notice_id: item.id ?? "",
    notice_url: item.id ? noticeUrl(item.id) : "",
    notice_status: item.noticeStatus ?? "",
    notice_type: item.noticeType ?? "",
    published_date: (item.publishedDate ?? "").slice(0, 10),
    deadline_date: (item.deadlineDate ?? "").slice(0, 10),
    buyer_organisation: item.organisationName ?? "",
    awarded_supplier: item.awardedSupplier ?? "",
    awarded_date: (item.awardedDate ?? "").slice(0, 10),
    awarded_value: item.awardedValue ?? "",
    suitable_for_sme: item.isSuitableForSme === true ? "yes" : "no",
    region: item.region ?? "",
    postcode: item.postcode ?? "",
    phrase_in_title: inTitle ? "yes" : "no",
    phrase_in_description: inDescription ? "yes" : "no",
    suggested_play: suggestedPlay(item),
    evidence_snippet:
      evidenceSnippet(item.description, phrase) ||
      evidenceSnippet(item.title, phrase),
    // Left blank on purpose. The operator fills these in; nothing downstream
    // reads them until a human has.
    triage_decision: "",
    triage_note: "",
  };
}

export interface FilterResult {
  readonly kept: Record<string, unknown>[];
  readonly returned: number;
  readonly rejectedNoPhrase: number;
}

/** Drops the API's loose matches and de-duplicates by notice id. */
export function filterCandidates(
  items: readonly NoticeItem[],
  phrase: string
): FilterResult {
  const seen = new Set<string>();
  const kept: Record<string, unknown>[] = [];
  let rejectedNoPhrase = 0;

  for (const item of items) {
    if (!containsPhrase(item.title, phrase) && !containsPhrase(item.description, phrase)) {
      rejectedNoPhrase += 1;
      continue;
    }
    const id = item.id ?? "";
    if (id && seen.has(id)) continue;
    if (id) seen.add(id);
    kept.push(toCandidateRow(item, phrase));
  }

  return { kept, returned: items.length, rejectedNoPhrase };
}

export function summarise(rows: readonly Record<string, unknown>[]): string {
  const named = rows.filter((r) => r.awarded_supplier).length;
  const sme = rows.filter((r) => r.suitable_for_sme === "yes").length;
  const open = rows.filter(
    (r) => String(r.notice_status).toLowerCase() === "open"
  ).length;
  return [
    `${rows.length} candidate(s) after phrase re-check`,
    `${named} with a named awarded supplier`,
    `${open} open`,
    `${sme} flagged suitable for SMEs`,
  ].join(" | ");
}
