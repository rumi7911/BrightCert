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
        issue: textAtLength(240, `ISSUE ${sectionId}-${index} END`),
        why: textAtLength(
          480,
          sectionId === 1 && index === 0
            ? `WHY ${sectionId}-${index} END PDF BOUNDARY MARKER SURVIVES`
            : `WHY ${sectionId}-${index} END`
        ),
        priority: index % 2 === 0 ? "P1" : "P2",
      })),
      remediation: Array.from({ length: 5 }, (_, remediationIndex) => ({
        title: textAtLength(200),
        steps: Array.from({ length: 6 }, (_, stepIndex) =>
          textAtLength(
            400,
            sectionId === 5 &&
              remediationIndex === 4 &&
              stepIndex === 5
              ? "FINAL REMEDIATION STEP SURVIVES"
              : ""
          )
        ),
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
    const layouts: Array<
      Array<{ str: string; x: number; y: number; width: number }>
    > = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(
        content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ")
      );
      layouts.push(
        content.items.flatMap((item) =>
          "str" in item
            ? [
                {
                  str: item.str,
                  x: item.transform[4],
                  y: item.transform[5],
                  width: item.width,
                },
              ]
            : []
        )
      );
    }
    return {
      pageCount: document.numPages,
      layouts,
      pages: pages.map((page) => page.replace(/\s+/g, " ")),
      text: pages.join(" ").replace(/\s+/g, " "),
    };
  } finally {
    await document.destroy();
  }
}

describe("ReportDocument maximum response layout", () => {
  test(
    "uses a singular action label when a control has one remediation",
    async () => {
      const analysis = maximumAcceptedAnalysis();
      analysis.controls[0].remediation = [
        {
          title: "Review the firewall rules",
          steps: ["Document the review."],
          effort: "Low",
        },
      ];

      const pdf = await renderToBuffer(
        <ReportDocument
          orgName="Singular Action Example Ltd"
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
          generatedAt="2026-07-27T12:00:00Z"
        />
      );
      const extracted = await extractPdfText(pdf);

      expect(extracted.text).toMatch(/\b1 action\b/);
      expect(extracted.text).not.toMatch(/\b1 actions\b/);
    },
    60_000
  );

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
      expect(extracted.text).toContain("FINAL REMEDIATION STEP SURVIVES");
      expect(extracted.text).toContain(
        "Once gaps are addressed, apply for official Cyber Essentials"
      );
      const disclaimerHeading =
        "Readiness assessment — not official certification";
      const disclaimerBody =
        "This report is produced by BrightCert and provides a readiness assessment";
      const disclaimerHeadingPages = extracted.pages
        .map((page, index) => (page.includes(disclaimerHeading) ? index : -1))
        .filter((index) => index >= 0);
      const disclaimerBodyPages = extracted.pages
        .map((page, index) => (page.includes(disclaimerBody) ? index : -1))
        .filter((index) => index >= 0);
      expect(disclaimerHeadingPages).toEqual(disclaimerBodyPages);
      expect(disclaimerHeadingPages).toHaveLength(2);
      extracted.layouts.forEach((items, pageIndex) => {
        const pageNumber = items.find(
          (item) =>
            item.str ===
            `Page ${pageIndex + 1} of ${extracted.pageCount}`
        );
        expect(pageNumber).toBeDefined();
        if (!pageNumber) return;
        const sameLineLeftItems = items.filter(
          (item) =>
            item.x < pageNumber.x &&
            Math.abs(item.y - pageNumber.y) < 0.5 &&
            item.str.trim()
        );
        const leftEdge = Math.max(
          ...sameLineLeftItems.map((item) => item.x + item.width)
        );
        expect(leftEdge).toBeLessThanOrEqual(pageNumber.x - 8);
      });
      for (const sectionId of [1, 2, 3, 4, 5]) {
        for (const gapIndex of [0, 1, 2, 3, 4]) {
          const issueMarker = `ISSUE ${sectionId}-${gapIndex} END`;
          const whyMarker = `WHY ${sectionId}-${gapIndex} END`;
          const issuePage = extracted.pages.findIndex((page) =>
            page.includes(issueMarker)
          );
          const whyPage = extracted.pages.findIndex((page) =>
            page.includes(whyMarker)
          );
          expect(issuePage).toBeGreaterThanOrEqual(0);
          expect(whyPage).toBe(issuePage);
        }
      }
      expect(extracted.pageCount).toBeGreaterThan(0);
    },
    60_000
  );
});
