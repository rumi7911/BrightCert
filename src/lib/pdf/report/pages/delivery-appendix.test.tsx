// @vitest-environment node

import { Document, renderToBuffer } from "@react-pdf/renderer";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { describe, expect, test, vi } from "vitest";
import type { ReportInput } from "../report-types";
import { buildReportViewModel } from "../report-view-model";
import { ActionRegisterPages } from "./ActionRegisterPages";
import { EvidenceChecklistPage } from "./EvidenceChecklistPage";
import { MethodologyPage } from "./MethodologyPage";

type ExtractedPage = {
  text: string;
};

const CONTROL_NAMES = [
  "Boundary Firewalls & Internet Gateways",
  "Secure Configuration",
  "User Access Control",
  "Malware Protection",
  "Security Update Management",
] as const;

function action({
  title,
  priority,
  effort,
  evidenceRequired,
}: {
  title: string;
  priority: "P1" | "P2" | "P3";
  effort: "Low" | "Medium" | "High";
  evidenceRequired: string[];
}): ReportInput["controls"][number]["actions"][number] {
  return {
    title,
    steps: ["Complete and record the assigned control activity."],
    effort,
    priority,
    priorityLabel: `${priority} — validated priority`,
    recommendedOwner: "shared_business_it",
    ownerLabel: "Business owner and IT provider",
    timeframe: "days_0_30",
    timeframeLabel: "0–30 days",
    evidenceRequired,
    evidenceLabel: "Evidence required",
    portfolioEligibility: "validated",
  };
}

const v2Input: ReportInput = {
  orgName: "Example Services Ltd",
  generatedAt: "2026-07-27T12:00:00.000Z",
  analysisVersion: 2,
  reportHeadline: "Address priority gaps before applying.",
  executiveSummary: "The assessment identifies focused remediation work.",
  primaryDecision: "Fund the documented remediation actions.",
  keyStrengths: ["Boundary controls are documented."],
  overallScore: 72,
  overallStatus: "nearly_ready",
  portfolioEligibility: "validated",
  controls: CONTROL_NAMES.map((_, index) => ({
    sectionId: (index + 1) as 1 | 2 | 3 | 4 | 5,
    score: 72,
    status: "warning" as const,
    headline: `Control ${index + 1} requires review.`,
    managementImplication: "Assign and complete the recorded actions.",
    summary: "The recorded answers identify preparation work.",
    gaps: [],
    actions:
      index === 0
        ? [
            action({
              title: "P2 low action",
              priority: "P2",
              effort: "Low",
              evidenceRequired: ["Shared evidence"],
            }),
            action({
              title: "P1 high action",
              priority: "P1",
              effort: "High",
              evidenceRequired: ["Firewall approval"],
            }),
            action({
              title: "P1 low action",
              priority: "P1",
              effort: "Low",
              evidenceRequired: [
                "Shared evidence",
                "shared evidence",
                "Shared evidence",
              ],
            }),
          ]
        : [],
  })),
};

const v1Input: ReportInput = {
  ...v2Input,
  analysisVersion: 1,
  portfolioEligibility: "review_required",
  controls: v2Input.controls.map((control) => ({
    ...control,
    actions: control.actions.map((item) => ({
      title: item.title,
      steps: item.steps,
      effort: item.effort,
      priority: null,
      priorityLabel: "Priority to confirm",
      recommendedOwner: null,
      ownerLabel: "Business owner and IT provider to confirm",
      timeframe: null,
      timeframeLabel: "To confirm",
      evidenceRequired: [],
      evidenceLabel: "Evidence to confirm during action review",
      portfolioEligibility: "review_required" as const,
    })),
  })),
};

function normalizedText(items: Array<{ str: string }>): string {
  return items
    .map((item) => item.str)
    .join(" ")
    .replace(/\u001f/g, ".")
    .replace(/[#$]/g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

async function extractPdf(pdf: Buffer): Promise<{
  pages: ExtractedPage[];
  text: string;
}> {
  const document = await getDocument({
    data: new Uint8Array(pdf),
    disableFontFace: true,
    isEvalSupported: false,
  }).promise;

  try {
    const pages: ExtractedPage[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const items = content.items.flatMap((item) =>
        "str" in item ? [{ str: item.str }] : []
      );
      pages.push({ text: normalizedText(items) });
    }
    return {
      pages,
      text: pages.map((page) => page.text).join(" "),
    };
  } finally {
    await document.destroy();
  }
}

async function renderRegister(input: ReportInput) {
  const viewModel = buildReportViewModel(input);
  return extractPdf(
    await renderToBuffer(
      <Document title="Action register fixture">
        <ActionRegisterPages input={input} viewModel={viewModel} />
      </Document>
    )
  );
}

async function renderEvidence(input: ReportInput) {
  const viewModel = buildReportViewModel(input);
  return extractPdf(
    await renderToBuffer(
      <Document title="Evidence checklist fixture">
        <EvidenceChecklistPage input={input} viewModel={viewModel} />
      </Document>
    )
  );
}

async function renderMethodology(input: ReportInput) {
  return extractPdf(
    await renderToBuffer(
      <Document title="Methodology fixture">
        <MethodologyPage input={input} />
      </Document>
    )
  );
}

function occurrences(text: string, marker: string): number {
  return text.split(marker).length - 1;
}

function denseInput(): ReportInput {
  const bounded = (length: number, marker: string) =>
    `${"bounded register content ".repeat(length).slice(0, length - marker.length - 1)} ${marker}`;
  const actions = Array.from({ length: 25 }, (_, index) =>
    action({
      title: bounded(
        200,
        `REGISTER ACTION ${String(index + 1).padStart(2, "0")} END`
      ),
      priority: (["P1", "P2", "P3"] as const)[index % 3],
      effort: (["Low", "Medium", "High"] as const)[index % 3],
      evidenceRequired: Array.from({ length: 4 }, (_, evidenceIndex) =>
        bounded(
          220,
          `REGISTER EVIDENCE ${String(index + 1).padStart(2, "0")}-${
            evidenceIndex + 1
          } END`
        )
      ),
    })
  );

  return {
    ...v2Input,
    controls: v2Input.controls.map((control) =>
      control.sectionId === 1
        ? { ...control, actions }
        : { ...control, actions: [] }
    ),
  };
}

describe("delivery and evidence appendix", () => {
  test("renders the exact register schema and deterministic action order", async () => {
    const { pages, text } = await renderRegister(v2Input);
    const firstPage = pages[0]?.text ?? "";
    const headers = [
      "Action",
      "Control area",
      "Priority",
      "Recommended owner",
      "Timeframe",
      "Effort",
      "Evidence required",
    ];

    expect(firstPage).toContain("Prioritised action register");
    for (const [index, header] of headers.entries()) {
      expect(firstPage.indexOf(header)).toBeGreaterThan(
        index === 0 ? -1 : firstPage.indexOf(headers[index - 1])
      );
    }
    expect(text.indexOf("P1 low action")).toBeLessThan(
      text.indexOf("P1 high action")
    );
    expect(text.indexOf("P1 high action")).toBeLessThan(
      text.indexOf("P2 low action")
    );
  });

  test(
    "keeps maximum bounded rows readable with labelled register continuations and control context",
    async () => {
      const warnings: string[] = [];
      const warn = vi
        .spyOn(console, "warn")
        .mockImplementation((...args) => warnings.push(args.join(" ")));
      const error = vi
        .spyOn(console, "error")
        .mockImplementation((...args) => warnings.push(args.join(" ")));

      let extracted: Awaited<ReturnType<typeof renderRegister>>;
      try {
        extracted = await renderRegister(denseInput());
      } finally {
        warn.mockRestore();
        error.mockRestore();
      }

      expect(warnings.join("\n")).not.toMatch(
        /cannot wrap|can't wrap|bigger than available page height/i
      );
      expect(extracted.pages.length).toBeGreaterThan(1);
      for (const page of extracted.pages.slice(1)) {
        expect(page.text).toContain("Action register continuation");
        expect(page.text).toContain("Control area");
      }
      for (let actionNumber = 1; actionNumber <= 25; actionNumber += 1) {
        const marker = `REGISTER ACTION ${String(actionNumber).padStart(
          2,
          "0"
        )} END`;
        const evidenceMarker = `REGISTER EVIDENCE ${String(
          actionNumber
        ).padStart(2, "0")}-4 END`;
        const markerPage = extracted.pages.findIndex((page) =>
          page.text.includes(marker)
        );
        expect(markerPage).toBeGreaterThanOrEqual(0);
        expect(extracted.pages[markerPage]?.text).toContain(
          "Boundary Firewalls & Internet Gateways"
        );
        expect(extracted.pages[markerPage]?.text).toContain(evidenceMarker);
      }
    },
    30_000
  );

  test("groups explicit v2 evidence exactly and keeps legacy evidence conservative", async () => {
    const v2 = await renderEvidence(v2Input);

    expect(v2.text).toContain("Evidence checklist");
    expect(v2.text).toContain("0–30 days");
    expect(v2.text).toContain("Boundary Firewalls & Internet Gateways");
    expect(occurrences(v2.text, "Shared evidence")).toBe(1);
    expect(occurrences(v2.text, "shared evidence")).toBe(1);
    expect(occurrences(v2.text, "Firewall approval")).toBe(1);
    expect(v2.text).toContain(
      "Evidence checklist is BrightCert preparation guidance, not an official Certification Body evidence request."
    );

    const v1 = await renderEvidence(v1Input);
    expect(v1.text).toContain("Evidence to confirm during action review");
    expect(v1.text).not.toContain("Firewall approval");
    expect(v1.text).not.toContain("Shared evidence");
  });

  test("states the assessment method, exact limitations and official next step", async () => {
    const { text } = await renderMethodology(v2Input);

    expect(text).toContain("Method, limitations and next steps");
    expect(text).toContain("self-reported");
    expect(text).toContain(
      "Control status: Pass at 80–100, Review needed at 60–79, and Needs work at 0–59."
    );
    expect(text).toContain(
      "Overall status: Ready at 80–100, Nearly ready at 60–79, Needs fixes at 40–59, and Not ready at 0–39."
    );
    expect(text).toContain("No technical audit");
    expect(text).toContain("Report generated 27 July 2026");
    expect(text).toContain("Analysis version 2");
    expect(text).toContain("IASME-licensed Certification Body");
    expect(text).toContain(
      "Evidence checklist is BrightCert preparation guidance, not an official Certification Body evidence request."
    );
    expect(text).toContain(
      "BrightCert does not issue official Cyber Essentials certification."
    );
    expect(text).toContain(
      "Official certification must be completed through an IASME-licensed Certification Body."
    );
    expect(text).toContain(
      "This report is for preparation and planning purposes only."
    );
  });
});
