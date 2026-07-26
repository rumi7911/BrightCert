import { parseGeminiAnalysisResult } from "@/lib/gemini/analyze";
import type {
  ControlStatus,
  OverallStatus,
} from "@/types/assessment";

const MAX_ORGANISATION_NAME_LENGTH = 160;

export class PersistedReportPayloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PersistedReportPayloadError";
  }
}

type PersistedControlScore = {
  section_id: number;
  score: number;
  status: ControlStatus;
  summary: string;
  gaps: Array<{
    issue: string;
    why: string;
    priority: "P1" | "P2" | "P3";
  }>;
  remediation: Array<{
    title: string;
    steps: string[];
    effort: "Low" | "Medium" | "High";
  }>;
};

export type PersistedReportPayload = {
  orgName: string;
  executiveSummary: string;
  overallScore: number;
  overallStatus: OverallStatus;
  controls: PersistedControlScore[];
};

function recordAt(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
  return value as Record<string, unknown>;
}

function organisationNameAt(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > MAX_ORGANISATION_NAME_LENGTH
  ) {
    throw new Error(
      `org_name must be non-empty text no longer than ${MAX_ORGANISATION_NAME_LENGTH} characters`
    );
  }
  return value.trim();
}

export function parsePersistedReportPayload(
  value: unknown
): PersistedReportPayload {
  try {
    const payload = recordAt(value, "report payload");
    const controls = payload.control_scores;
    if (!Array.isArray(controls)) {
      throw new Error("control_scores must be an array");
    }

    const analysis = parseGeminiAnalysisResult({
      executiveSummary: payload.executive_summary,
      overallScore: payload.overall_score,
      overallStatus: payload.overall_status,
      controls: controls.map((rawControl, index) => {
        const control = recordAt(
          rawControl,
          `control_scores[${index}]`
        );
        return {
          sectionId: control.section_id,
          score: control.score,
          status: control.status,
          summary: control.summary,
          gaps: control.gaps,
          remediation: control.remediation,
        };
      }),
    });

    return {
      orgName: organisationNameAt(payload.org_name),
      executiveSummary: analysis.executiveSummary,
      overallScore: analysis.overallScore,
      overallStatus: analysis.overallStatus,
      controls: analysis.controls.map((control) => ({
        section_id: control.sectionId,
        score: control.score,
        status: control.status,
        summary: control.summary,
        gaps: control.gaps,
        remediation: control.remediation,
      })),
    };
  } catch (error) {
    if (error instanceof PersistedReportPayloadError) {
      throw error;
    }
    const reason = error instanceof Error ? error.message : "unknown error";
    throw new PersistedReportPayloadError(
      `Invalid persisted report payload: ${reason}`
    );
  }
}
