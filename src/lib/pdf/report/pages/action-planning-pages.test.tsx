// @vitest-environment node

import { Document, renderToBuffer } from "@react-pdf/renderer";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import {
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { describe, expect, test } from "vitest";
import { ActionPortfolioMatrix } from "../components/ActionPortfolioMatrix";
import {
  allPassV2ReportFixture,
  highRiskV2ReportFixture,
} from "../fixtures";
import type { ReportInput } from "../report-types";
import {
  buildReportViewModel,
  type ActionPoint,
  type ReportViewModel,
} from "../report-view-model";
import { ActionPortfolioPage } from "./ActionPortfolioPage";
import { RiskConcentrationPage } from "./RiskConcentrationPage";
import { RoadmapPage } from "./RoadmapPage";

const validatedActions: ReportInput["controls"][number]["actions"] = [
  {
    title: "Validated action 01",
    steps: ["Approve the firewall review."],
    effort: "Low",
    priority: "P1",
    priorityLabel: "P1 — Must fix",
    recommendedOwner: "internal_it_lead",
    ownerLabel: "Internal IT lead",
    timeframe: "days_0_30",
    timeframeLabel: "0–30 days",
    evidenceRequired: ["Firewall review record"],
    evidenceLabel: "Evidence required",
    portfolioEligibility: "validated",
  },
  {
    title: "Validated action 02",
    steps: ["Plan the secure configuration work."],
    effort: "High",
    priority: "P1",
    priorityLabel: "P1 — Must fix",
    recommendedOwner: "msp_it_provider",
    ownerLabel: "IT provider",
    timeframe: "days_31_60",
    timeframeLabel: "31–60 days",
    evidenceRequired: ["Approved configuration export"],
    evidenceLabel: "Evidence required",
    portfolioEligibility: "validated",
  },
  {
    title: "Validated action 03",
    steps: ["Complete the account review."],
    effort: "Medium",
    priority: "P2",
    priorityLabel: "P2 — Should fix soon",
    recommendedOwner: "operations_compliance",
    ownerLabel: "Operations / compliance",
    timeframe: "days_61_90",
    timeframeLabel: "61–90 days",
    evidenceRequired: ["Account review record"],
    evidenceLabel: "Evidence required",
    portfolioEligibility: "validated",
  },
  {
    title: "Validated action 04",
    steps: ["Maintain the malware review cadence."],
    effort: "High",
    priority: "P3",
    priorityLabel: "P3 — Improvement",
    recommendedOwner: "shared_business_it",
    ownerLabel: "Business owner and IT provider",
    timeframe: "ongoing",
    timeframeLabel: "Ongoing",
    evidenceRequired: ["Monthly protection report"],
    evidenceLabel: "Evidence required",
    portfolioEligibility: "validated",
  },
];

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
  controls: [
    {
      sectionId: 1,
      score: 81,
      status: "pass",
      headline: "Boundary controls are established.",
      managementImplication: "Maintain firewall governance.",
      summary: "Firewall governance is mostly established.",
      gaps: [
        { issue: "Firewall owner", why: "Ownership is unclear.", priority: "P1" },
        { issue: "Firewall review", why: "Review is overdue.", priority: "P1" },
        { issue: "Rule notes", why: "Notes are incomplete.", priority: "P3" },
      ],
      actions: validatedActions.slice(0, 1),
    },
    {
      sectionId: 2,
      score: 65,
      status: "warning",
      headline: "Configuration needs work.",
      managementImplication: "Approve a secure baseline.",
      summary: "Configuration evidence is incomplete.",
      gaps: [
        { issue: "Baseline", why: "No baseline is approved.", priority: "P2" },
      ],
      actions: validatedActions.slice(1, 2),
    },
    {
      sectionId: 3,
      score: 59,
      status: "fail",
      headline: "Access needs work.",
      managementImplication: "Review privileged accounts.",
      summary: "Account reviews are incomplete.",
      gaps: [
        { issue: "Dormant users", why: "Accounts persist.", priority: "P1" },
        { issue: "Review notes", why: "Notes are missing.", priority: "P2" },
      ],
      actions: validatedActions.slice(2, 3),
    },
    {
      sectionId: 4,
      score: 88,
      status: "pass",
      headline: "Protection is active.",
      managementImplication: "Maintain the review cadence.",
      summary: "Malware protection is established.",
      gaps: [
        { issue: "Monthly report", why: "Reports are not retained.", priority: "P3" },
      ],
      actions: validatedActions.slice(3),
    },
    {
      sectionId: 5,
      score: 67,
      status: "warning",
      headline: "Updates need work.",
      managementImplication: "Document the update exception process.",
      summary: "Update evidence is incomplete.",
      gaps: [
        { issue: "Exceptions", why: "Exceptions are not tracked.", priority: "P2" },
        { issue: "Archive", why: "Old reports are missing.", priority: "P3" },
      ],
      actions: [],
    },
  ],
};

const v1Input: ReportInput = {
  ...v2Input,
  analysisVersion: 1,
  portfolioEligibility: "review_required",
  controls: v2Input.controls.map((control) => ({
    ...control,
    actions: control.actions.map((action) => ({
      title: action.title,
      steps: action.steps,
      effort: action.effort,
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

type ExtractedTextItem = {
  str: string;
  width: number;
  x: number;
};

type ExtractedPage = {
  text: string;
  items: ExtractedTextItem[];
};

function normalizedText(items: ExtractedTextItem[]): string {
  return items
    .map((item) => item.str)
    .join(" ")
    .replace(/\s+/g, " ");
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
        "str" in item
          ? [{ str: item.str, width: item.width, x: item.transform[4] }]
          : []
      );
      pages.push({ items, text: normalizedText(items) });
    }
    return {
      pages,
      text: pages.map((page) => page.text).join(" "),
    };
  } finally {
    await document.destroy();
  }
}

async function extractPlanningPdf(input: ReportInput) {
  const viewModel = buildReportViewModel(input);
  const pdf = await renderToBuffer(
    <Document title="Action planning pages fixture">
      <RiskConcentrationPage input={input} viewModel={viewModel} />
      <ActionPortfolioPage input={input} viewModel={viewModel} />
      <RoadmapPage input={input} viewModel={viewModel} />
    </Document>
  );
  return extractPdf(pdf);
}

function maximumPlanningInput(): ReportInput {
  const actions = Array.from({ length: 28 }, (_, index) => {
    const phase = [
      ["days_0_30", "0–30 days"],
      ["days_31_60", "31–60 days"],
      ["days_61_90", "61–90 days"],
      ["ongoing", "Ongoing"],
    ][index % 4] as [
      "days_0_30" | "days_31_60" | "days_61_90" | "ongoing",
      string,
    ];

    return {
      title: `Overflow action ${String(index + 1).padStart(2, "0")}`,
      steps: ["Complete and document the assigned control activity."],
      effort: (["Low", "Medium", "High"] as const)[index % 3],
      priority: (["P1", "P2", "P3"] as const)[index % 3],
      priorityLabel: `${(["P1", "P2", "P3"] as const)[index % 3]} priority`,
      recommendedOwner: "shared_business_it" as const,
      ownerLabel: "Business owner and IT provider",
      timeframe: phase[0],
      timeframeLabel: phase[1],
      evidenceRequired: [
        `Evidence record ${String(index + 1).padStart(2, "0")} with retained approval`,
      ],
      evidenceLabel: "Evidence required",
      portfolioEligibility: "validated" as const,
    };
  });

  return {
    ...v2Input,
    controls: v2Input.controls.map((control) =>
      control.sectionId === 1 ? { ...control, actions } : { ...control, actions: [] }
    ),
  };
}

type PositionedMarker = {
  label: string;
  left: number;
  top: number;
};

type InspectableProps = {
  children?: ReactNode;
  style?: unknown;
};

function renderedText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(renderedText).join("");
  }
  if (!isValidElement<InspectableProps>(node)) {
    return "";
  }
  return renderedText(node.props.children);
}

function positionedMarkers(node: ReactNode): PositionedMarker[] {
  if (!isValidElement<InspectableProps>(node)) {
    return Array.isArray(node) ? node.flatMap(positionedMarkers) : [];
  }

  const children = positionedMarkers(node.props.children);
  const label = renderedText(node.props.children);
  const positionedStyle = Array.isArray(node.props.style)
    ? node.props.style.find(
        (candidate): candidate is { left: string; top: string } =>
          typeof candidate === "object" &&
          candidate !== null &&
          "left" in candidate &&
          "top" in candidate &&
          typeof candidate.left === "string" &&
          typeof candidate.top === "string"
      )
    : null;

  if (
    positionedStyle &&
    /^(?:A\d{2}|C\d{2} \(\d+\))$/.test(label)
  ) {
    return [
      {
        label,
        left: Number.parseFloat(positionedStyle.left),
        top: Number.parseFloat(positionedStyle.top),
      },
      ...children,
    ];
  }

  return children;
}

function portfolioWithEveryRankCombination(): ReportViewModel["actionPortfolio"] {
  const priorities = ["P1", "P2", "P3"] as const;
  const efforts = ["Low", "Medium", "High"] as const;
  const points: ActionPoint[] = [];

  for (const [priorityRank, priority] of priorities.entries()) {
    for (const [effortRank, effort] of efforts.entries()) {
      points.push({
        sectionId: 1,
        title: `${priority} / ${effort}`,
        priority,
        effort,
        priorityRank,
        effortRank,
      });
    }
  }

  return { eligibility: "validated", points };
}

type ExpectedPlacement = PositionedMarker & {
  quadrant:
    | "Quick wins"
    | "Major blockers"
    | "Scheduled improvements"
    | "Careful planning";
};

const expectedPlacements: ExpectedPlacement[] = [
  { label: "C01 (1)", left: 16, top: 16, quadrant: "Quick wins" },
  { label: "C02 (1)", left: 66, top: 16, quadrant: "Major blockers" },
  { label: "C03 (1)", left: 84, top: 16, quadrant: "Major blockers" },
  { label: "C04 (1)", left: 16, top: 34, quadrant: "Quick wins" },
  { label: "C05 (1)", left: 66, top: 34, quadrant: "Major blockers" },
  { label: "C06 (1)", left: 84, top: 34, quadrant: "Major blockers" },
  {
    label: "C07 (1)",
    left: 16,
    top: 75,
    quadrant: "Scheduled improvements",
  },
  { label: "C08 (1)", left: 66, top: 75, quadrant: "Careful planning" },
  { label: "C09 (1)", left: 84, top: 75, quadrant: "Careful planning" },
];

function quadrantAt(left: number, top: number): ExpectedPlacement["quadrant"] {
  if (top < 50) {
    return left < 50 ? "Quick wins" : "Major blockers";
  }
  return left < 50 ? "Scheduled improvements" : "Careful planning";
}

describe("action planning report pages", () => {
  test(
    "renders five controls with direct gap-priority counts and every labelled validated portfolio point",
    async () => {
      const { pages, text } = await extractPlanningPdf(v2Input);
      const riskPage = pages.find((page) =>
        page.text.includes("Boundary Firewalls & Internet Gateways")
      );

      expect(riskPage?.text).toContain("Boundary Firewalls & Internet Gateways");
      expect(riskPage?.text).toContain("Secure Configuration");
      expect(riskPage?.text).toContain("User Access Control");
      expect(riskPage?.text).toContain("Malware Protection");
      expect(riskPage?.text).toContain("Security Update Management");
      expect(riskPage?.text).toContain("P1 2 · P2 0 · P3 1");
      expect(riskPage?.text).toContain("P1 0 · P2 1 · P3 0");
      expect(riskPage?.text).toContain("P1 1 · P2 1 · P3 0");
      expect(riskPage?.text).toContain("P1 0 · P2 0 · P3 1");
      expect(riskPage?.text).toContain("P1 0 · P2 1 · P3 1");

      expect(text).toContain("Quick wins");
      expect(text).toContain("Major blockers");
      expect(text).toContain("Scheduled improvements");
      expect(text).toContain("Careful planning");
      for (const [index, action] of validatedActions.entries()) {
        expect(text).toContain(`A${String(index + 1).padStart(2, "0")}`);
        expect(text).toContain(action.title);
      }
    },
    30_000
  );

  test(
    "replaces the legacy portfolio matrix with an explicit review notice",
    async () => {
      const { text } = await extractPlanningPdf(v1Input);

      expect(text).toContain(
        "Action priorities require review before portfolio plotting"
      );
      expect(text).toContain("Legacy action metadata requires review.");
      expect(text).not.toContain("Validated actions form a decision portfolio.");
      expect(text).not.toContain("Validated action 03");
      expect(text).not.toContain("A03");
    },
    30_000
  );

  test(
    "groups validated actions only by explicit timeframe with recommendation and evidence labels",
    async () => {
      const { text } = await extractPlanningPdf(v2Input);

      expect(text).toContain("Now / 0–30 days");
      expect(text).toContain("Next / 31–60 days");
      expect(text).toContain("Then / 61–90 days");
      expect(text).toContain("Ongoing");
      expect(text).toContain("Recommended owner: Internal IT lead");
      expect(text).toContain("Recommended owner: IT provider");
      expect(text).toContain("Recommended owner: Operations / compliance");
      expect(text).toContain(
        "Recommended owner: Business owner and IT provider"
      );
      expect(text).toContain("Evidence: Firewall review record");
      expect(text).toContain("Evidence: Approved configuration export");
      expect(text).toContain("Evidence: Account review record");
      expect(text).toContain("Evidence: Monthly protection report");
      expect(text).toContain(
        "Owner labels are recommendations; accountability remains subject to confirmation."
      );
    },
    30_000
  );

  test(
    "cell-centres all nine priority and effort combinations in an unambiguous quadrant",
    () => {
      const rendered = ActionPortfolioMatrix({
        portfolio: portfolioWithEveryRankCombination(),
      }) as ReactElement;
      const markers = positionedMarkers(rendered);

      expect(markers).toHaveLength(9);
      for (const [index, expected] of expectedPlacements.entries()) {
        const marker = markers[index];

        expect(marker).toEqual({
          label: expected.label,
          left: expected.left,
          top: expected.top,
        });
        expect(marker.left).not.toBe(50);
        expect(marker.top).not.toBe(50);
        expect(quadrantAt(marker.left, marker.top)).toBe(expected.quadrant);
      }
    }
  );

  test(
    "clusters 28 coincident actions without hiding or duplicating their references",
    async () => {
      const { text } = await extractPlanningPdf(maximumPlanningInput());
      const references = text.match(/\bA\d{2}\b/g) ?? [];

      expect(references).toEqual(
        Array.from(
          { length: 28 },
          (_, index) => `A${String(index + 1).padStart(2, "0")}`
        )
      );
      const actionKeyRows = [
        ...text.matchAll(/\b(A\d{2}) (Overflow action \d{2})\b/g),
      ];
      expect(actionKeyRows).toHaveLength(28);
      expect(new Set(actionKeyRows.map((match) => match[1])).size).toBe(28);
      expect(new Set(actionKeyRows.map((match) => match[2])).size).toBe(28);
      expect(text).toContain("MATRIX CLUSTER KEY");
      expect(text).toMatch(/C01\s*\(\s*10\s*\)/);
      expect(text).toContain("C01 / 10 actions / P1 / Low effort");
      expect(text).toMatch(/C02\s*\(\s*9\s*\)/);
      expect(text).toContain("C02 / 9 actions / P2 / Medium effort");
      expect(text).toMatch(/C03\s*\(\s*9\s*\)/);
      expect(text).toContain("C03 / 9 actions / P3 / High effort");
    },
    30_000
  );

  test(
    "keeps every roadmap phase heading with its first action on wrapped pages",
    async () => {
      const { pages } = await extractPlanningPdf(highRiskV2ReportFixture);
      const phaseExpectations = [
        {
          heading: "Now / 0–30 days",
          actionPattern: /Control [1-5] action 1/,
        },
        {
          heading: "Next / 31–60 days",
          actionPattern: /Control [1-5] action 2/,
        },
        {
          heading: "Then / 61–90 days",
          actionPattern: /Control [1-5] action 3/,
        },
        {
          heading: "Ongoing",
          actionPattern: /Control [1-5] action [45]/,
        },
      ];

      for (const { heading, actionPattern } of phaseExpectations) {
        const headingPage = pages.find((page) => page.text.includes(heading));

        expect(headingPage, `missing roadmap phase heading: ${heading}`).toBeDefined();
        expect(headingPage!.text).toMatch(actionPattern);
      }
    },
    30_000
  );

  test(
    "identifies the active timeframe on every dense roadmap page containing action cards",
    async () => {
      const { pages } = await extractPlanningPdf(highRiskV2ReportFixture);
      const roadmapPagesWithActions = pages.filter(
        (page) =>
          page.text.includes("REMEDIATION ROADMAP / V2") &&
          /Control [1-5] action [1-5]/.test(page.text)
      );

      expect(roadmapPagesWithActions.length).toBeGreaterThan(4);
      for (const [index, page] of roadmapPagesWithActions.entries()) {
        expect(
          page.text,
          `roadmap physical page ${index + 1} lacks timeframe context`
        ).toMatch(
          /Timeframe: (?:0–30 days|31–60 days|61–90 days|Ongoing)/
        );
      }
    },
    30_000
  );

  test(
    "renders truthful no-gap and no-action states for an all-pass v2 assessment",
    async () => {
      const { pages } = await extractPlanningPdf(allPassV2ReportFixture);
      const riskPage = pages.find((page) =>
        page.text.includes("RISK CONCENTRATION / V2")
      );
      const portfolioPage = pages.find((page) =>
        page.text.includes("ACTION PORTFOLIO / V2")
      );

      expect(riskPage?.text).toContain(
        "No assessed gap findings were recorded for this assessment."
      );
      expect(riskPage?.text).not.toContain(
        "Priority gaps are concentrated by control."
      );
      expect(portfolioPage?.text).toContain(
        "No validated actions were recorded for this assessment."
      );
      expect(portfolioPage?.text).not.toContain(
        "Validated actions form a decision portfolio."
      );
      expect(portfolioPage?.text).not.toContain("Quick wins");
      expect(portfolioPage?.text).not.toContain("Major blockers");
    },
    30_000
  );

  test(
    "repeats brand and collision-safe footer on every wrapped A4 planning page",
    async () => {
      const { pages, text } = await extractPlanningPdf(maximumPlanningInput());

      expect(pages.length).toBeGreaterThan(3);
      expect(text).toContain("Overflow action 01");
      expect(text).toContain("Overflow action 28");

      for (const page of pages) {
        expect(page.text).toMatch(/\bBright\s*Cert\b/);

        const footerText = page.items.find((item) =>
          item.str.startsWith("Confidential")
        );
        const pageNumber = page.items.find((item) =>
          /^Page \d+ of \d+$/.test(item.str)
        );

        expect(footerText).toBeDefined();
        expect(pageNumber).toBeDefined();
        expect(footerText!.x + footerText!.width).toBeLessThanOrEqual(
          pageNumber!.x - 8
        );
      }
    },
    30_000
  );
});
