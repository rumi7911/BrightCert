// @vitest-environment node

import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createAdminClient } from "@/lib/supabase/server";
import { POST } from "./route";

vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: vi.fn(),
}));

vi.mock("@/lib/auth/assessment-ownership", () => ({
  verifyAssessmentOwnership: vi.fn(),
}));

vi.mock("@/lib/gcs/upload", () => ({
  getReportSignedUrl: vi.fn(),
  uploadReport: vi.fn().mockResolvedValue("https://reports.test/report.pdf"),
}));

vi.mock("@/lib/resend/emails", () => ({
  sendReportReadyEmail: vi.fn(),
}));

vi.mock("@react-pdf/renderer", () => ({
  renderToBuffer: vi.fn().mockResolvedValue(Buffer.from("rendered pdf")),
}));

vi.mock("@/lib/pdf/ReportDocument", () => ({
  ReportDocument: () => null,
}));

type StoredControl = {
  section_id: number;
  score: number;
  status: string;
  summary: string;
  gaps: Array<{ issue: string; why: string; priority: string }>;
  remediation: Array<{ title: string; steps: string[]; effort: string }>;
};

function textAtLength(length: number): string {
  return "bounded persisted text ".repeat(length).slice(0, length);
}

function maximumStoredControls(): StoredControl[] {
  return [1, 2, 3, 4, 5].map((sectionId) => ({
    section_id: sectionId,
    score: 60,
    status: "warning",
    summary: textAtLength(600),
    gaps: Array.from({ length: 5 }, () => ({
      issue: textAtLength(240),
      why: textAtLength(480),
      priority: "P1",
    })),
    remediation: Array.from({ length: 5 }, () => ({
      title: textAtLength(200),
      steps: Array.from({ length: 6 }, () => textAtLength(400)),
      effort: "Medium",
    })),
  }));
}

function fakeAdminClient(
  executiveSummary: string,
  controls: StoredControl[],
  orgName = "Boundary Example Ltd"
) {
  const assessment = {
    id: "assessment-1",
    org_id: "org-1",
    status: "paid",
    overall_score: 60,
    overall_status: "nearly_ready",
    executive_summary: executiveSummary,
    organisations: { name: orgName },
  };

  const reportRows: Array<Record<string, unknown>> = [];

  return {
    from(table: string) {
      if (table === "assessments") {
        const query = {
          select: () => query,
          eq: () => query,
          single: async () => ({ data: assessment, error: null }),
        };
        return query;
      }

      if (table === "control_scores") {
        const query = {
          select: () => query,
          eq: () => query,
          order: async () => ({ data: controls, error: null }),
        };
        return query;
      }

      if (table === "reports") {
        // Stateful, because the route now claims before rendering and
        // publishes the gcs_url afterwards. A fake that always reports "no
        // row" would let a broken claim protocol pass.
        const query = {
          select: () => query,
          eq: () => query,
          order: () => query,
          limit: () => query,
          maybeSingle: async () => ({ data: reportRows[0] ?? null, error: null }),
          upsert: (values: Record<string, unknown>) => {
            if (reportRows.length === 0) {
              reportRows.push({ id: "report-1", ...values });
              return {
                select: () => ({
                  maybeSingle: async () => ({ data: { id: "report-1" }, error: null }),
                }),
              };
            }
            // ignoreDuplicates: the conflicting row is not returned.
            return {
              select: () => ({
                maybeSingle: async () => ({ data: null, error: null }),
              }),
            };
          },
          update: (values: Record<string, unknown>) => {
            Object.assign(reportRows[0] ?? {}, values);
            const chain = {
              eq: () => chain,
              lt: () => chain,
              select: () => ({
                maybeSingle: async () => ({ data: reportRows[0] ?? null, error: null }),
              }),
              then: (resolve: (value: { error: null }) => void) =>
                resolve({ error: null }),
            };
            return chain;
          },
          delete: () => ({
            eq: async () => {
              reportRows.length = 0;
              return { error: null };
            },
          }),
        };
        return query;
      }

      if (table === "profiles") {
        const query = {
          select: () => query,
          eq: () => query,
          limit: () => query,
          single: async () => ({ data: null, error: null }),
        };
        return query;
      }

      throw new Error(`Unexpected table: ${table}`);
    },
    auth: {
      admin: {
        getUserById: async () => ({ data: { user: null }, error: null }),
      },
    },
  };
}

function reportRequest() {
  return new NextRequest("http://localhost/api/reports/generate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-internal-secret": "route-test-secret",
    },
    body: JSON.stringify({ assessmentId: "assessment-1" }),
  });
}

describe("report generation persisted analysis boundary", () => {
  beforeEach(() => {
    process.env.INTERNAL_API_SECRET = "route-test-secret";
  });

  afterEach(() => {
    delete process.env.INTERNAL_API_SECRET;
  });

  test("rejects an oversized stored analysis before PDF rendering", async () => {
    vi.mocked(createAdminClient).mockReturnValue(
      fakeAdminClient(textAtLength(901), maximumStoredControls()) as never
    );

    const response = await POST(reportRequest());

    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({
      error:
        "Stored assessment analysis is invalid; re-run analysis before generating the report.",
    });
  });

  test("rejects an oversized stored organisation name before PDF rendering", async () => {
    vi.mocked(createAdminClient).mockReturnValue(
      fakeAdminClient(
        textAtLength(900),
        maximumStoredControls(),
        textAtLength(161)
      ) as never
    );

    const response = await POST(reportRequest());

    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({
      error:
        "Stored assessment analysis is invalid; re-run analysis before generating the report.",
    });
  });

  test("accepts a stored analysis at every report boundary", async () => {
    vi.mocked(createAdminClient).mockReturnValue(
      fakeAdminClient(
        textAtLength(900),
        maximumStoredControls(),
        textAtLength(160)
      ) as never
    );

    const response = await POST(reportRequest());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      url: "https://reports.test/report.pdf",
    });
  });
});
