import { getGeminiModel } from "./client";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts";
import type { GeminiAnalysisResult } from "@/types/assessment";
import { QUESTIONS, getSection } from "@/lib/questions";

type ResponseRow = {
  question_key: string;
  answer: string;
  section_id: number;
};

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
  const parsed = JSON.parse(text) as GeminiAnalysisResult;

  // Validate structure
  if (!parsed.controls || !Array.isArray(parsed.controls) || parsed.controls.length !== 5) {
    throw new Error("Invalid Gemini response: missing or incomplete controls array");
  }

  return parsed;
}
