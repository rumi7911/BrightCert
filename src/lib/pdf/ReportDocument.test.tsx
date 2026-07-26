// @vitest-environment node

import { renderToBuffer } from "@react-pdf/renderer";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { describe, expect, test, vi } from "vitest";
import { parseGeminiAnalysisResult } from "@/lib/gemini/analyze";
import type { GeminiAnalysisResult } from "@/types/assessment";
import { ReportDocument } from "./ReportDocument";

function textAtLength(length: number, marker = ""): string {
  const separatorLength = marker ? 1 : 0;
  const prefixLength = length - marker.length - separatorLength;
  const prefix = "bounded response "
    .repeat(length)
    .slice(0, prefixLength)
    .replace(/\s$/, "x");
  return marker ? `${prefix} ${marker}` : prefix;
}

function maximumAcceptedAnalysis(): GeminiAnalysisResult {
  return parseGeminiAnalysisResult({
    controls: [1, 2, 3, 4, 5].map((sectionId) => ({
      sectionId,
      score: 60,
      status: "warning",
      summary: textAtLength(600),
      gaps: Array.from({ length: 5 }, (_, index) => ({
        issue: textAtLength(240),
        why: textAtLength(
          480,
          sectionId === 1 && index === 0
            ? "PDF BOUNDARY MARKER SURVIVES"
            : ""
        ),
        priority: index % 2 === 0 ? "P1" : "P2",
      })),
      remediation: Array.from({ length: 5 }, () => ({
        title: textAtLength(200),
        steps: Array.from({ length: 6 }, () => textAtLength(400)),
        effort: "Medium",
      })),
    })),
    overallScore: 60,
    overallStatus: "nearly_ready",
    executiveSummary: textAtLength(900),
  });
}

async function extractPdfText(pdf: Buffer) {
  const document = await getDocument({
    data: new Uint8Array(pdf),
    disableFontFace: true,
    isEvalSupported: false,
  }).promise;

  try {
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(
        content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ")
      );
    }
    return {
      pageCount: document.numPages,
      text: pages.join(" ").replace(/\s+/g, " "),
    };
  } finally {
    await document.destroy();
  }
}

describe("ReportDocument maximum response layout", () => {
  test(
    "renders accepted boundary content without an unbreakable overflow warning",
    async () => {
      const analysis = maximumAcceptedAnalysis();
      const warnings: string[] = [];
      const warn = vi
        .spyOn(console, "warn")
        .mockImplementation((...args) => warnings.push(args.join(" ")));
      const error = vi
        .spyOn(console, "error")
        .mockImplementation((...args) => warnings.push(args.join(" ")));

      let pdf: Buffer;
      try {
        pdf = await renderToBuffer(
          <ReportDocument
            orgName={textAtLength(160, "ORGANISATION BOUNDARY MARKER")}
            executiveSummary={analysis.executiveSummary}
            overallScore={analysis.overallScore}
            overallStatus={analysis.overallStatus}
            controls={analysis.controls.map((control) => ({
              section_id: control.sectionId,
              score: control.score,
              status: control.status,
              summary: control.summary,
              gaps: control.gaps,
              remediation: control.remediation,
            }))}
            generatedAt="2026-07-26T12:00:00Z"
          />
        );
      } finally {
        warn.mockRestore();
        error.mockRestore();
      }

      const extracted = await extractPdfText(pdf);

      expect(warnings.join("\n")).not.toMatch(
        /cannot wrap|can't wrap|bigger than available page height/i
      );
      expect(extracted.text).toContain("PDF BOUNDARY MARKER SURVIVES");
      expect(extracted.text).toContain("ORGANISATION BOUNDARY MARKER");
      expect(extracted.text).toContain(
        "Once gaps are addressed, apply for official Cyber Essentials"
      );
      expect(extracted.pageCount).toBeGreaterThan(0);
    },
    60_000
  );
});
