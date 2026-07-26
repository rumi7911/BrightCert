import { describe, expect, test } from "vitest";
import * as analysisModule from "./analyze";
import type { GeminiAnalysisResult } from "@/types/assessment";

const parseGeminiAnalysisResult = (
  analysisModule as typeof analysisModule & {
    parseGeminiAnalysisResult: (value: unknown) => GeminiAnalysisResult;
  }
).parseGeminiAnalysisResult;

function textAtLength(length: number, marker = ""): string {
  const separatorLength = marker ? 1 : 0;
  const prefixLength = length - marker.length - separatorLength;
  const prefix = "bounded response "
    .repeat(length)
    .slice(0, prefixLength)
    .replace(/\s$/, "x");
  return marker ? `${prefix} ${marker}` : prefix;
}

function validResult(): GeminiAnalysisResult {
  return {
    controls: [1, 2, 3, 4, 5].map((sectionId) => ({
      sectionId: sectionId as 1 | 2 | 3 | 4 | 5,
      score: 60,
      status: "warning" as const,
      summary: textAtLength(600),
      gaps: Array.from({ length: 5 }, (_, index) => ({
        issue: textAtLength(240),
        why: textAtLength(
          480,
          index === 0 && sectionId === 1
            ? "PDF BOUNDARY MARKER SURVIVES"
            : ""
        ),
        priority: "P1" as const,
      })),
      remediation: Array.from({ length: 5 }, () => ({
        title: textAtLength(200),
        steps: Array.from({ length: 6 }, () => textAtLength(400)),
        effort: "Medium" as const,
      })),
    })),
    overallScore: 60,
    overallStatus: "nearly_ready",
    executiveSummary: textAtLength(900),
  };
}

describe("Gemini analysis response validation", () => {
  test("accepts the maximum bounded response used by report rendering", () => {
    expect(parseGeminiAnalysisResult).toBeTypeOf("function");
    expect(parseGeminiAnalysisResult(validResult())).toEqual(validResult());
  });

  test.each([
    {
      name: "executive summary length",
      mutate: (result: GeminiAnalysisResult) => {
        result.executiveSummary = textAtLength(901);
      },
    },
    {
      name: "control summary length",
      mutate: (result: GeminiAnalysisResult) => {
        result.controls[0]!.summary = textAtLength(601);
      },
    },
    {
      name: "gap count",
      mutate: (result: GeminiAnalysisResult) => {
        result.controls[0]!.gaps.push(result.controls[0]!.gaps[0]!);
      },
    },
    {
      name: "gap explanation length",
      mutate: (result: GeminiAnalysisResult) => {
        result.controls[0]!.gaps[0]!.why = textAtLength(481);
      },
    },
    {
      name: "remediation step count",
      mutate: (result: GeminiAnalysisResult) => {
        result.controls[0]!.remediation[0]!.steps.push("one too many");
      },
    },
  ])("rejects a response beyond the $name boundary", ({ mutate }) => {
    const result = validResult();
    mutate(result);

    expect(() => parseGeminiAnalysisResult(result)).toThrow(
      "Invalid Gemini response"
    );
  });
});
