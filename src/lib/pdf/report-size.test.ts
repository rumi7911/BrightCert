import { describe, expect, it } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReportDocument } from "./ReportDocument";
import { legacyV1ReportFixture, mixedV2ReportFixture } from "./report/fixtures";

// The report shipped at 3,860,209 bytes on 4 August 2026 — 94.7% of it 24
// duplicate copies of a 512px header logo. Nothing failed: every other test
// passed, the document was correct, and the waste was invisible until someone
// counted bytes in the delivered PDF.
//
// These budgets exist to make that failure mode loud. They are ceilings with
// deliberate headroom, not targets: raise one only with a measurement showing
// the growth is content, not an asset regression.
const TOTAL_BUDGET_BYTES = 600_000;

// A correctly-sized logo still accounts for ~59% of the real 24-page report,
// because @react-pdf embeds one copy per page and the rest of the document is
// vector drawing and text. So this ceiling is set to catch an *asset*
// regression, not to police the ratio: the 512px logo drove it to 96.8%.
const IMAGE_SHARE_CEILING = 0.75;

type ImageStats = {
  bytes: number;
  objects: number;
  share: number;
};

function imageStats(pdf: Buffer): ImageStats {
  const latin = pdf.toString("latin1");
  const starts: number[] = [];

  for (const match of latin.matchAll(/^\d+ 0 obj/gm)) {
    starts.push(match.index ?? 0);
  }
  starts.push(pdf.length);

  let bytes = 0;
  let objects = 0;

  for (let i = 0; i < starts.length - 1; i += 1) {
    const start = starts[i];
    const end = starts[i + 1];
    if (!latin.slice(start, Math.min(start + 500, end)).includes("/Image")) {
      continue;
    }
    bytes += end - start;
    objects += 1;
  }

  return { bytes, objects, share: bytes / pdf.length };
}

describe("report PDF size", () => {
  it("keeps the v1 report within its byte budget", async () => {
    const pdf = await renderToBuffer(ReportDocument(legacyV1ReportFixture));
    const stats = imageStats(pdf);

    expect(
      pdf.length,
      `report is ${pdf.length.toLocaleString()} bytes; images account for ` +
        `${stats.bytes.toLocaleString()} across ${stats.objects} objects`
    ).toBeLessThan(TOTAL_BUDGET_BYTES);
  });

  it("does not let embedded images dominate the document", async () => {
    const pdf = await renderToBuffer(ReportDocument(legacyV1ReportFixture));
    const stats = imageStats(pdf);

    expect(
      stats.share,
      `images are ${(stats.share * 100).toFixed(1)}% of ${pdf.length.toLocaleString()} bytes ` +
        `across ${stats.objects} objects — check the header logo asset size, since ` +
        `@react-pdf embeds one copy per page`
    ).toBeLessThan(IMAGE_SHARE_CEILING);
  });

  it("keeps the richer v2 report within the same budget", async () => {
    const pdf = await renderToBuffer(ReportDocument(mixedV2ReportFixture));

    expect(pdf.length).toBeLessThan(TOTAL_BUDGET_BYTES);
  });
});
