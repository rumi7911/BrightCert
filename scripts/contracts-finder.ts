/**
 * Contracts Finder candidate research.
 *
 *   npm run outreach:contracts-finder -- --output outreach/runs/cf-candidates.csv
 *
 * Writes candidates for human triage. It does NOT write prospect rows, does not
 * touch .outreach/prospects.csv, and does not send anything. See
 * docs/outreach/TRIGGER-RESEARCH-METHOD.md for what happens to the output.
 */

import { atomicWriteCsv } from "../src/lib/outreach/csv";
import {
  buildSearchBody,
  CANDIDATE_COLUMNS,
  filterCandidates,
  searchEndpoint,
  summarise,
  type NoticeItem,
  type NoticeStatus,
} from "../src/lib/outreach/contracts-finder";

const VALID_STATUSES: readonly NoticeStatus[] = [
  "Open",
  "Closed",
  "Awarded",
  "Cancelled",
];

interface Args {
  phrase: string;
  statuses: NoticeStatus[];
  output: string;
  maxPages: number;
  pageSize: number;
  publishedFrom?: string;
  publishedTo?: string;
}

function parseArgs(argv: readonly string[]): Args {
  const get = (name: string): string | undefined => {
    const at = argv.indexOf(`--${name}`);
    return at >= 0 ? argv[at + 1] : undefined;
  };

  const statusesRaw = get("statuses") ?? "Open,Awarded";
  const statuses = statusesRaw.split(",").map((s) => s.trim()) as NoticeStatus[];
  for (const status of statuses) {
    if (!VALID_STATUSES.includes(status)) {
      throw new Error(
        `Unknown status "${status}". Valid: ${VALID_STATUSES.join(", ")}`
      );
    }
  }

  const output = get("output");
  if (!output) throw new Error("--output is required");
  if (output.startsWith(".outreach/")) {
    // The canonical prospect file is human-owned; nothing automated writes there.
    throw new Error(
      "Refusing to write into .outreach/ — this tool produces triage candidates, not prospects"
    );
  }

  return {
    phrase: get("phrase") ?? "cyber essentials",
    statuses,
    output,
    maxPages: Number.parseInt(get("max-pages") ?? "10", 10),
    pageSize: Number.parseInt(get("page-size") ?? "100", 10),
    publishedFrom: get("published-from"),
    publishedTo: get("published-to"),
  };
}

async function fetchPage(
  args: Args,
  status: NoticeStatus,
  page: number
): Promise<{ items: NoticeItem[]; hitCount: number }> {
  const response = await fetch(searchEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(
      buildSearchBody({
        phrase: args.phrase,
        statuses: [status],
        page,
        size: args.pageSize,
        publishedFrom: args.publishedFrom,
        publishedTo: args.publishedTo,
      })
    ),
  });

  if (!response.ok) {
    throw new Error(
      `Contracts Finder returned HTTP ${response.status} for ${status} page ${page}`
    );
  }

  const body = (await response.json()) as {
    hitCount?: number;
    noticeList?: { item?: NoticeItem }[];
  };
  return {
    items: (body.noticeList ?? [])
      .map((entry) => entry.item)
      .filter((item): item is NoticeItem => !!item),
    hitCount: body.hitCount ?? 0,
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  console.log(`phrase   : "${args.phrase}"`);
  console.log(`statuses : ${args.statuses.join(", ")}`);

  const allItems: NoticeItem[] = [];
  let totalReturned = 0;

  for (const status of args.statuses) {
    let page = 1;
    let hitCount = 0;
    for (;;) {
      const result = await fetchPage(args, status, page);
      hitCount = result.hitCount;
      allItems.push(...result.items);
      totalReturned += result.items.length;

      const seen = page * args.pageSize;
      if (result.items.length === 0 || seen >= hitCount || page >= args.maxPages) {
        console.log(`  ${status}: hitCount ${hitCount}, pulled ${Math.min(seen, hitCount)}`);
        if (page >= args.maxPages && seen < hitCount) {
          console.log(`  ${status}: stopped at --max-pages ${args.maxPages}`);
        }
        break;
      }
      page += 1;
    }
  }

  const { kept, rejectedNoPhrase } = filterCandidates(allItems, args.phrase);

  console.log("");
  console.log(`API returned        : ${totalReturned}`);
  console.log(`Dropped, no phrase  : ${rejectedNoPhrase}`);
  console.log(summarise(kept));

  await atomicWriteCsv(args.output, kept, [...CANDIDATE_COLUMNS]);
  console.log("");
  console.log(`Wrote ${kept.length} candidate(s) to ${args.output} (mode 600)`);
  console.log("");
  console.log("These are candidates, not prospects. For each row:");
  console.log("  1. Open notice_url in a browser — the page 403s automated requests.");
  console.log("  2. Confirm the notice REQUIRES or SCORES Cyber Essentials.");
  console.log("     A passing mention is Weak under ICP.md. Block it.");
  console.log("  3. Link a specific company to that specific notice, or drop the row.");
  console.log("  4. Only then start the disqualifier order in TRIGGER-RESEARCH-METHOD.md.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
