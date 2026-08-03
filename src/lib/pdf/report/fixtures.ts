import { parsePersistedReportInput } from "./report-input";

const GENERATED_AT = "2026-07-27T12:00:00.000Z";

function maximumLengthText(
  length: number,
  seed: string,
  marker?: string
): string {
  const suffix = marker ? ` ${marker}` : "";
  const bodyLength = length - suffix.length;
  const source = `${seed} synthetic verification content `;
  const body = source.repeat(Math.ceil(bodyLength / source.length)).slice(
    0,
    bodyLength
  );

  return `${body}${suffix}`;
}

function maximumRiskGap(
  sectionId: number,
  gapIndex: number,
  final = false
) {
  return {
    issue: maximumLengthText(
      240,
      `Control ${sectionId} finding ${gapIndex}`,
      final ? "FINAL FINDING MARKER SURVIVES" : undefined
    ),
    why: maximumLengthText(
      480,
      `Control ${sectionId} finding ${gapIndex} business impact`
    ),
    priority: gapIndex < 4 ? "P1" : gapIndex === 4 ? "P2" : "P3",
  };
}

function maximumRiskAction(
  sectionId: number,
  actionIndex: number,
  final = false
) {
  return {
    title: maximumLengthText(
      200,
      `Control ${sectionId} action ${actionIndex}`,
      final ? "FINAL ACTION MARKER SURVIVES" : undefined
    ),
    steps: [
      maximumLengthText(
        400,
        `Control ${sectionId} action ${actionIndex} delivery step 1`
      ),
      maximumLengthText(
        400,
        `Control ${sectionId} action ${actionIndex} delivery step 2`
      ),
      maximumLengthText(
        400,
        `Control ${sectionId} action ${actionIndex} delivery step 3`
      ),
      maximumLengthText(
        400,
        `Control ${sectionId} action ${actionIndex} delivery step 4`
      ),
      maximumLengthText(
        400,
        `Control ${sectionId} action ${actionIndex} delivery step 5`
      ),
      maximumLengthText(
        400,
        `Control ${sectionId} action ${actionIndex} delivery step 6`
      ),
    ],
    effort: actionIndex % 3 === 1
      ? "Low"
      : actionIndex % 3 === 2
        ? "Medium"
        : "High",
    priority: actionIndex < 4 ? "P1" : actionIndex === 4 ? "P2" : "P3",
    recommendedOwner: actionIndex === 1
      ? "business_owner_director"
      : actionIndex === 2
        ? "internal_it_lead"
        : actionIndex === 3
          ? "msp_it_provider"
          : actionIndex === 4
            ? "operations_compliance"
            : "shared_business_it",
    timeframe: actionIndex === 1
      ? "days_0_30"
      : actionIndex === 2
        ? "days_31_60"
        : actionIndex === 3
          ? "days_61_90"
          : "ongoing",
    evidenceRequired: [
      maximumLengthText(
        220,
        `Control ${sectionId} action ${actionIndex} evidence item 1`
      ),
      maximumLengthText(
        220,
        `Control ${sectionId} action ${actionIndex} evidence item 2`
      ),
      maximumLengthText(
        220,
        `Control ${sectionId} action ${actionIndex} evidence item 3`
      ),
      maximumLengthText(
        220,
        `Control ${sectionId} action ${actionIndex} evidence item 4`,
        final ? "FINAL EVIDENCE MARKER SURVIVES" : undefined
      ),
    ],
  };
}

function maximumRiskControl(sectionId: number) {
  return {
    section_id: sectionId,
    score: 12,
    status: "fail",
    headline: maximumLengthText(
      180,
      `Control ${sectionId} maximum-risk headline`
    ),
    management_implication: maximumLengthText(
      480,
      `Control ${sectionId} maximum-risk management implication`
    ),
    summary: maximumLengthText(
      600,
      `Control ${sectionId} maximum-risk assessment summary`
    ),
    gaps: [
      maximumRiskGap(sectionId, 1),
      maximumRiskGap(sectionId, 2),
      maximumRiskGap(sectionId, 3),
      maximumRiskGap(sectionId, 4),
      maximumRiskGap(sectionId, 5, sectionId === 5),
    ],
    remediation: [
      maximumRiskAction(sectionId, 1),
      maximumRiskAction(sectionId, 2),
      maximumRiskAction(sectionId, 3),
      maximumRiskAction(sectionId, 4),
      maximumRiskAction(sectionId, 5, sectionId === 5),
    ],
  };
}

export const mixedV2ReportFixture = parsePersistedReportInput(
  {
    org_name: "Mixed V2 Fixture Services Ltd",
    analysis_version: 2,
    report_insights: {
      reportHeadline:
        "MIXED V2 FIXTURE DECISION - close identity and patching gaps",
      primaryDecision:
        "Fund the immediate access and patch actions before scheduling certification.",
      keyStrengths: [
        "Boundary firewall rules are documented and reviewed.",
        "Malware protection is centrally managed.",
        "Security owners meet monthly to review control performance.",
      ],
    },
    executive_summary:
      "This synthetic mixed-status assessment has useful foundations, but access governance and update evidence need focused delivery before certification.",
    overall_score: 61,
    overall_status: "nearly_ready",
    control_scores: [
      {
        section_id: 1,
        score: 86,
        status: "pass",
        headline: "Boundary controls provide a sound baseline.",
        management_implication:
          "Maintain the review cadence and preserve approval records.",
        summary:
          "Firewall administration is controlled, with one evidence improvement identified.",
        gaps: [
          {
            issue: "Rule review minutes are stored inconsistently",
            why: "Review completion is harder to demonstrate during assurance.",
            priority: "P3",
          },
        ],
        remediation: [
          {
            title: "Centralise firewall review minutes",
            steps: [
              "Choose the approved repository.",
              "Move the latest signed review minutes into it.",
            ],
            effort: "Low",
            priority: "P3",
            recommendedOwner: "operations_compliance",
            timeframe: "days_61_90",
            evidenceRequired: ["Approved firewall review minutes"],
          },
        ],
      },
      {
        section_id: 2,
        score: 65,
        status: "warning",
        headline: "Secure configuration is partly standardised.",
        management_implication:
          "Approve one build baseline and verify exceptions before application.",
        summary:
          "Build standards exist, but approval and exception tracking are incomplete.",
        gaps: [
          {
            issue: "The secure build baseline lacks formal approval",
            why: "Teams can apply different settings without a controlled reference.",
            priority: "P2",
          },
        ],
        remediation: [
          {
            title: "Approve and publish the secure build baseline",
            steps: [
              "Review the current configuration standard.",
              "Record director approval and publish the controlled version.",
            ],
            effort: "Medium",
            priority: "P2",
            recommendedOwner: "shared_business_it",
            timeframe: "days_31_60",
            evidenceRequired: [
              "Approved secure build baseline",
              "Configuration exception register",
            ],
          },
        ],
      },
      {
        section_id: 3,
        score: 34,
        status: "fail",
        headline: "Access governance is the main readiness blocker.",
        management_implication:
          "Remove dormant access and establish recurring review evidence immediately.",
        summary:
          "Joiner, mover and leaver records do not consistently demonstrate timely access removal.",
        gaps: [
          {
            issue: "Dormant privileged accounts remain enabled",
            why: "Unneeded privileged access increases the likelihood and impact of misuse.",
            priority: "P1",
          },
          {
            issue: "Quarterly access reviews are not evidenced",
            why: "Management cannot demonstrate that account access remains justified.",
            priority: "P1",
          },
        ],
        remediation: [
          {
            title: "Disable dormant privileged accounts",
            steps: [
              "Export privileged accounts and confirm active owners.",
              "Disable accounts without a current business need.",
              "Record approval for every retained exception.",
            ],
            effort: "Low",
            priority: "P1",
            recommendedOwner: "internal_it_lead",
            timeframe: "days_0_30",
            evidenceRequired: [
              "Privileged account export",
              "MIXED V2 FIXTURE EVIDENCE",
            ],
          },
          {
            title: "Launch quarterly access certification",
            steps: [
              "Assign reviewers for every system.",
              "Complete and archive the first review.",
            ],
            effort: "High",
            priority: "P1",
            recommendedOwner: "business_owner_director",
            timeframe: "days_31_60",
            evidenceRequired: ["Signed quarterly access review"],
          },
        ],
      },
      {
        section_id: 4,
        score: 90,
        status: "pass",
        headline: "Malware protection is operating effectively.",
        management_implication:
          "Continue monitoring coverage and exception resolution.",
        summary:
          "Managed protection covers supported endpoints and alerts are reviewed.",
        gaps: [],
        remediation: [],
      },
      {
        section_id: 5,
        score: 48,
        status: "fail",
        headline: "Update evidence is incomplete for remote devices.",
        management_implication:
          "Restore full update visibility and document the exception process.",
        summary:
          "Server updates are controlled, but remote endpoint reporting is inconsistent.",
        gaps: [
          {
            issue: "Remote devices are absent from the update dashboard",
            why: "Missing devices may retain exploitable security updates.",
            priority: "P1",
          },
        ],
        remediation: [
          {
            title: "Re-enrol missing devices in update management",
            steps: [
              "Reconcile the asset list against the update dashboard.",
              "Re-enrol missing supported devices.",
              "Escalate unresolved exceptions to the business owner.",
            ],
            effort: "Medium",
            priority: "P1",
            recommendedOwner: "msp_it_provider",
            timeframe: "days_0_30",
            evidenceRequired: [
              "Complete update compliance export",
              "Approved update exception record",
            ],
          },
        ],
      },
    ],
  },
  GENERATED_AT
);

export const allPassV2ReportFixture = parsePersistedReportInput(
  {
    org_name: "All Pass V2 Fixture Ltd",
    analysis_version: 2,
    report_insights: {
      reportHeadline:
        "ALL PASS V2 FIXTURE - maintain the established control baseline",
      primaryDecision:
        "Confirm the certification schedule and retain the current evidence set.",
      keyStrengths: [
        "All five control areas meet the internal readiness threshold.",
      ],
    },
    executive_summary:
      "This synthetic low-content assessment records a strong operating baseline with no gap findings or remediation actions.",
    overall_score: 94,
    overall_status: "ready",
    control_scores: [
      {
        section_id: 1,
        score: 96,
        status: "pass",
        headline: "Boundary controls are established.",
        management_implication: "Maintain the current rule review cadence.",
        summary: "Firewall scope, ownership and review evidence are current.",
        gaps: [],
        remediation: [],
      },
      {
        section_id: 2,
        score: 92,
        status: "pass",
        headline: "Secure configuration is established.",
        management_implication: "Keep the approved baseline current.",
        summary: "Supported devices use the approved secure configuration.",
        gaps: [],
        remediation: [],
      },
      {
        section_id: 3,
        score: 94,
        status: "pass",
        headline: "Access governance is established.",
        management_implication: "Continue recurring access reviews.",
        summary: "Account approvals, removals and reviews are evidenced.",
        gaps: [],
        remediation: [],
      },
      {
        section_id: 4,
        score: 95,
        status: "pass",
        headline: "Malware protection is established.",
        management_implication: "Maintain monitoring and exception review.",
        summary: "Supported devices report to the managed protection service.",
        gaps: [],
        remediation: [],
      },
      {
        section_id: 5,
        score: 93,
        status: "pass",
        headline: "Security updates are established.",
        management_implication: "Retain update compliance evidence.",
        summary: "Update deployment and exception records are current.",
        gaps: [],
        remediation: [],
      },
    ],
  },
  GENERATED_AT
);

export const highRiskV2ReportFixture = parsePersistedReportInput(
  {
    org_name: maximumLengthText(
      160,
      "High Risk V2 Fixture Organisation"
    ),
    analysis_version: 2,
    report_insights: {
      reportHeadline: maximumLengthText(
        180,
        "HIGH RISK V2 FIXTURE maximum accepted headline"
      ),
      primaryDecision: maximumLengthText(
        320,
        "Do not schedule certification until the complete remediation programme is evidenced"
      ),
      keyStrengths: [
        maximumLengthText(
          240,
          "Synthetic strength one confirms a named management sponsor"
        ),
        maximumLengthText(
          240,
          "Synthetic strength two confirms a documented asset inventory"
        ),
        maximumLengthText(
          240,
          "Synthetic strength three confirms an established review forum"
        ),
      ],
    },
    executive_summary: maximumLengthText(
      900,
      "This synthetic maximum-risk report exercises every accepted content boundary"
    ),
    overall_score: 12,
    overall_status: "not_ready",
    control_scores: [
      maximumRiskControl(1),
      maximumRiskControl(2),
      maximumRiskControl(3),
      maximumRiskControl(4),
      maximumRiskControl(5),
    ],
  },
  GENERATED_AT
);

export const legacyV1ReportFixture = parsePersistedReportInput(
  {
    org_name: "LEGACY V1 FIXTURE LTD",
    analysis_version: 1,
    executive_summary:
      "This synthetic legacy report contains the historical fields only, so priority, ownership, timeframe and evidence metadata must remain conservative.",
    overall_score: 58,
    overall_status: "needs_fixes",
    control_scores: [
      {
        section_id: 1,
        score: 72,
        status: "warning",
        summary: "Boundary controls need an evidence review.",
        gaps: [
          {
            issue: "Firewall review evidence is incomplete",
            why: "The assessment record does not confirm the latest review.",
            priority: "P2",
          },
        ],
        remediation: [
          {
            title: "Review boundary control evidence",
            steps: ["Confirm scope.", "Record the latest review."],
            effort: "Low",
          },
        ],
      },
      {
        section_id: 2,
        score: 55,
        status: "fail",
        summary: "Secure configuration evidence needs review.",
        gaps: [
          {
            issue: "Configuration approval is not recorded",
            why: "The stored response does not identify an approved baseline.",
            priority: "P1",
          },
        ],
        remediation: [
          {
            title: "Review the secure configuration baseline",
            steps: ["Confirm the current baseline.", "Record approval."],
            effort: "Medium",
          },
        ],
      },
      {
        section_id: 3,
        score: 48,
        status: "fail",
        summary: "User access control records need review.",
        gaps: [
          {
            issue: "Access review completion is unclear",
            why: "The legacy response does not include review evidence.",
            priority: "P1",
          },
        ],
        remediation: [
          {
            title: "Review user access records",
            steps: ["Confirm account owners.", "Record review outcomes."],
            effort: "High",
          },
        ],
      },
      {
        section_id: 4,
        score: 63,
        status: "warning",
        summary: "Malware protection records need review.",
        gaps: [
          {
            issue: "Coverage evidence is incomplete",
            why: "The legacy response does not confirm current coverage.",
            priority: "P2",
          },
        ],
        remediation: [
          {
            title: "Review malware protection coverage",
            steps: ["Confirm supported devices.", "Record exceptions."],
            effort: "Medium",
          },
        ],
      },
      {
        section_id: 5,
        score: 52,
        status: "fail",
        summary: "Security update records need review.",
        gaps: [
          {
            issue: "Update compliance is not evidenced",
            why: "The stored response does not include a current compliance export.",
            priority: "P1",
          },
        ],
        remediation: [
          {
            title: "Review security update evidence",
            steps: ["Confirm supported devices.", "Record update status."],
            effort: "Medium",
          },
        ],
      },
    ],
  },
  GENERATED_AT
);
