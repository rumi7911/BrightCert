import { getGeminiModel } from "./client";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts";
import type {
  ControlScore,
  ControlStatus,
  GeminiAnalysisResult,
  OverallStatus,
} from "@/types/assessment";
import { QUESTIONS, getSection } from "@/lib/questions";

type ResponseRow = {
  question_key: string;
  answer: string;
  section_id: number;
};

const ANALYSIS_LIMITS = {
  executiveSummary: 900,
  controlSummary: 600,
  gapsPerControl: 5,
  gapIssue: 240,
  gapWhy: 480,
  remediationPerControl: 5,
  remediationTitle: 200,
  remediationSteps: 6,
  remediationStep: 400,
} as const;

function invalidResponse(path: string, reason: string): never {
  throw new Error(`Invalid Gemini response: ${path} ${reason}`);
}

function recordAt(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    invalidResponse(path, "must be an object");
  }
  return value as Record<string, unknown>;
}

function arrayAt(value: unknown, path: string, maxLength: number): unknown[] {
  if (!Array.isArray(value) || value.length > maxLength) {
    invalidResponse(path, `must be an array with at most ${maxLength} items`);
  }
  return value;
}

function textAt(
  value: unknown,
  path: string,
  maxLength: number
): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > maxLength
  ) {
    invalidResponse(
      path,
      `must be non-empty text no longer than ${maxLength} characters`
    );
  }
  return value.trim();
}

function scoreAt(value: unknown, path: string): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 100
  ) {
    invalidResponse(path, "must be a number from 0 to 100");
  }
  return value;
}

function enumAt<T extends string>(
  value: unknown,
  path: string,
  allowed: readonly T[]
): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    invalidResponse(path, `must be one of ${allowed.join(", ")}`);
  }
  return value as T;
}

function controlAt(value: unknown, index: number): ControlScore {
  const path = `controls[${index}]`;
  const control = recordAt(value, path);
  const sectionId = control.sectionId;
  if (
    typeof sectionId !== "number" ||
    ![1, 2, 3, 4, 5].includes(sectionId)
  ) {
    invalidResponse(`${path}.sectionId`, "must be 1, 2, 3, 4, or 5");
  }

  const gaps = arrayAt(
    control.gaps,
    `${path}.gaps`,
    ANALYSIS_LIMITS.gapsPerControl
  ).map((value, gapIndex) => {
    const gapPath = `${path}.gaps[${gapIndex}]`;
    const gap = recordAt(value, gapPath);
    return {
      issue: textAt(
        gap.issue,
        `${gapPath}.issue`,
        ANALYSIS_LIMITS.gapIssue
      ),
      why: textAt(gap.why, `${gapPath}.why`, ANALYSIS_LIMITS.gapWhy),
      priority: enumAt(gap.priority, `${gapPath}.priority`, [
        "P1",
        "P2",
        "P3",
      ] as const),
    };
  });
  const remediation = arrayAt(
    control.remediation,
    `${path}.remediation`,
    ANALYSIS_LIMITS.remediationPerControl
  ).map((value, remediationIndex) => {
    const remediationPath = `${path}.remediation[${remediationIndex}]`;
    const item = recordAt(value, remediationPath);
    return {
      title: textAt(
        item.title,
        `${remediationPath}.title`,
        ANALYSIS_LIMITS.remediationTitle
      ),
      steps: arrayAt(
        item.steps,
        `${remediationPath}.steps`,
        ANALYSIS_LIMITS.remediationSteps
      ).map((step, stepIndex) =>
        textAt(
          step,
          `${remediationPath}.steps[${stepIndex}]`,
          ANALYSIS_LIMITS.remediationStep
        )
      ),
      effort: enumAt(item.effort, `${remediationPath}.effort`, [
        "Low",
        "Medium",
        "High",
      ] as const),
    };
  });

  return {
    sectionId: sectionId as ControlScore["sectionId"],
    score: scoreAt(control.score, `${path}.score`),
    status: enumAt<ControlStatus>(control.status, `${path}.status`, [
      "pass",
      "warning",
      "fail",
    ]),
    summary: textAt(
      control.summary,
      `${path}.summary`,
      ANALYSIS_LIMITS.controlSummary
    ),
    gaps,
    remediation,
  };
}

export function parseGeminiAnalysisResult(
  value: unknown
): GeminiAnalysisResult {
  const result = recordAt(value, "response");
  if (!Array.isArray(result.controls) || result.controls.length !== 5) {
    invalidResponse("controls", "must contain exactly five control areas");
  }
  const controls = result.controls.map(controlAt);
  if (new Set(controls.map((control) => control.sectionId)).size !== 5) {
    invalidResponse("controls", "must contain each control area exactly once");
  }

  return {
    controls,
    overallScore: scoreAt(result.overallScore, "overallScore"),
    overallStatus: enumAt<OverallStatus>(
      result.overallStatus,
      "overallStatus",
      ["ready", "nearly_ready", "needs_fixes", "not_ready"]
    ),
    executiveSummary: textAt(
      result.executiveSummary,
      "executiveSummary",
      ANALYSIS_LIMITS.executiveSummary
    ),
  };
}

export async function analyzeAssessment(
  orgName: string,
  responses: ResponseRow[]
): Promise<GeminiAnalysisResult> {
  const formattedResponses = responses.map((r) => {
    const question = QUESTIONS.find((q) => q.key === r.question_key);
    const section = getSection(r.section_id);
    const answerLabel = question?.options.find((o) => o.value === r.answer)?.label ?? r.answer;

    return {
      question: question?.text ?? r.question_key,
      answer: answerLabel,
      sectionId: r.section_id,
      sectionName: section?.title ?? `Section ${r.section_id}`,
    };
  });

  const model = getGeminiModel();
  const userPrompt = buildUserPrompt(orgName, formattedResponses);

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const text = result.response.text();
  return parseGeminiAnalysisResult(JSON.parse(text));
}
