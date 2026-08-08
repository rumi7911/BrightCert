import { describe, expect, it } from "vitest";

import {
  buildSearchBody,
  containsPhrase,
  evidenceSnippet,
  filterCandidates,
  noticeUrl,
  normaliseText,
  suggestedPlay,
  summarise,
  toCandidateRow,
  type NoticeItem,
} from "./contracts-finder";

const PHRASE = "cyber essentials";

describe("normaliseText", () => {
  it("decodes the numeric entities the API emits", () => {
    // Observed in a real response: "£800million" arrives as "&#xA3;800million".
    expect(normaliseText("&#xA3;800million")).toBe("£800million");
    expect(normaliseText("&#163;50")).toBe("£50");
  });

  it("flattens CRLF so a phrase split across lines still matches", () => {
    expect(normaliseText("cyber\r\n      essentials")).toBe("cyber essentials");
  });
});

describe("containsPhrase", () => {
  it("matches case-insensitively", () => {
    expect(containsPhrase("Requires CYBER ESSENTIALS certification", PHRASE)).toBe(true);
  });

  it("matches across a line break", () => {
    expect(containsPhrase("holders of cyber\r\n essentials plus", PHRASE)).toBe(true);
  });

  it("rejects text that never mentions the phrase", () => {
    // The real false positive: this notice scored 1 on a keyword search.
    expect(
      containsPhrase(
        "Surrey County Council invites potential providers of Appropriate Adult Services",
        PHRASE
      )
    ).toBe(false);
  });

  it("does not match on a single shared word", () => {
    expect(containsPhrase("essentials of good cyber hygiene", PHRASE)).toBe(false);
  });

  it("treats an empty phrase as no match rather than matching everything", () => {
    expect(containsPhrase("anything at all", "")).toBe(false);
  });
});

describe("evidenceSnippet", () => {
  it("returns surrounding context so requirement can be told from mention", () => {
    const text = `${"x".repeat(400)} suppliers must hold Cyber Essentials certification ${"y".repeat(400)}`;
    const snippet = evidenceSnippet(text, PHRASE, 40);
    expect(snippet).toContain("cyber essentials");
    expect(snippet).toContain("must hold");
    expect(snippet.startsWith("…")).toBe(true);
    expect(snippet.endsWith("…")).toBe(true);
  });

  it("is empty when the phrase is absent", () => {
    expect(evidenceSnippet("nothing relevant here", PHRASE)).toBe("");
  });
});

describe("suggestedPlay", () => {
  it("names the awarded-supplier play when a supplier is present", () => {
    expect(suggestedPlay({ awardedSupplier: "Waterstons Limited" })).toBe(
      "awarded_supplier"
    );
  });

  it("falls back to the open-notice play", () => {
    expect(suggestedPlay({ noticeStatus: "Open" })).toBe("open_notice");
  });

  it("flags a closed notice with no named company", () => {
    expect(suggestedPlay({ noticeStatus: "Closed" })).toBe("no_named_company");
  });

  it("ignores a whitespace-only supplier", () => {
    expect(suggestedPlay({ awardedSupplier: "   ", noticeStatus: "Open" })).toBe(
      "open_notice"
    );
  });
});

describe("filterCandidates", () => {
  const matching: NoticeItem = {
    id: "a",
    title: "Security services",
    description: "Bidders must hold Cyber Essentials.",
    noticeStatus: "Open",
  };
  const looseMatch: NoticeItem = {
    id: "b",
    title: "Appropriate Adult Services",
    description: "Recommissioning an essential service.",
    noticeStatus: "Open",
  };

  it("drops results that do not actually contain the phrase", () => {
    const result = filterCandidates([matching, looseMatch], PHRASE);
    expect(result.kept).toHaveLength(1);
    expect(result.rejectedNoPhrase).toBe(1);
    expect(result.returned).toBe(2);
    expect(result.kept[0].notice_id).toBe("a");
  });

  it("de-duplicates by notice id across pages", () => {
    const result = filterCandidates([matching, { ...matching }], PHRASE);
    expect(result.kept).toHaveLength(1);
  });

  it("keeps a match found only in the title", () => {
    const result = filterCandidates(
      [{ id: "c", title: "Cyber Essentials audit", description: "No detail." }],
      PHRASE
    );
    expect(result.kept).toHaveLength(1);
    expect(result.kept[0].phrase_in_title).toBe("yes");
    expect(result.kept[0].phrase_in_description).toBe("no");
  });
});

describe("toCandidateRow", () => {
  it("leaves the triage columns blank for the human", () => {
    const row = toCandidateRow(
      { id: "x", description: "requires Cyber Essentials" },
      PHRASE
    );
    expect(row.triage_decision).toBe("");
    expect(row.triage_note).toBe("");
  });

  it("emits no prospect-pipeline columns", () => {
    const row = toCandidateRow({ id: "x", description: "Cyber Essentials" }, PHRASE);
    for (const forbidden of [
      "work_email",
      "contact_name",
      "lia_status",
      "human_approved_at",
      "trigger",
    ]) {
      expect(row).not.toHaveProperty(forbidden);
    }
  });

  it("truncates timestamps to dates", () => {
    const row = toCandidateRow(
      {
        id: "x",
        description: "Cyber Essentials",
        publishedDate: "2026-02-11T12:13:56Z",
        awardedDate: "2024-07-02T00:00:00+01:00",
      },
      PHRASE
    );
    expect(row.published_date).toBe("2026-02-11");
    expect(row.awarded_date).toBe("2024-07-02");
  });
});

describe("buildSearchBody", () => {
  it("quotes the phrase and defaults paging", () => {
    const body = buildSearchBody({ phrase: PHRASE, statuses: ["Awarded"] });
    const criteria = body.searchCriteria as Record<string, unknown>;
    expect(criteria.keyword).toBe('"cyber essentials"');
    expect(criteria.statuses).toEqual(["Awarded"]);
    expect(body.page).toBe(1);
    expect(body.size).toBe(100);
  });

  it("omits date bounds when not supplied", () => {
    const criteria = buildSearchBody({ phrase: PHRASE, statuses: ["Open"] })
      .searchCriteria as Record<string, unknown>;
    expect(criteria).not.toHaveProperty("publishedFrom");
    expect(criteria).not.toHaveProperty("publishedTo");
  });
});

describe("noticeUrl", () => {
  it("builds a browser-openable notice link", () => {
    expect(noticeUrl("abc-123")).toBe(
      "https://www.contractsfinder.service.gov.uk/notice/abc-123"
    );
  });
});

describe("summarise", () => {
  it("counts named suppliers, open notices and SME flags", () => {
    const line = summarise([
      { awarded_supplier: "A Ltd", suitable_for_sme: "yes", notice_status: "Awarded" },
      { awarded_supplier: "", suitable_for_sme: "no", notice_status: "Open" },
    ]);
    expect(line).toContain("2 candidate(s)");
    expect(line).toContain("1 with a named awarded supplier");
    expect(line).toContain("1 open");
    expect(line).toContain("1 flagged suitable for SMEs");
  });
});
