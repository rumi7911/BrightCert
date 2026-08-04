import { Document } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import "./report/brand-tokens";
import { ActionPortfolioPage } from "./report/pages/ActionPortfolioPage";
import { ActionRegisterPages } from "./report/pages/ActionRegisterPages";
import { ControlDeepDivePages } from "./report/pages/ControlDeepDivePages";
import { CoverPage } from "./report/pages/CoverPage";
import { EvidenceChecklistPage } from "./report/pages/EvidenceChecklistPage";
import { ExecutiveReadoutPage } from "./report/pages/ExecutiveReadoutPage";
import { MethodologyPage } from "./report/pages/MethodologyPage";
import { ReadinessProfilePage } from "./report/pages/ReadinessProfilePage";
import { RiskConcentrationPage } from "./report/pages/RiskConcentrationPage";
import { RoadmapPage } from "./report/pages/RoadmapPage";
import type { ReportInput } from "./report/report-types";
import { buildReportViewModel } from "./report/report-view-model";

export function ReportDocument(input: ReportInput): ReactElement<DocumentProps> {
  const viewModel = buildReportViewModel(input);

  return (
    <Document
      title={`BrightCert Readiness Report — ${input.orgName}`}
      author="BrightCert"
      subject="Cyber Essentials Readiness Assessment"
    >
      <CoverPage input={input} viewModel={viewModel} />
      <ExecutiveReadoutPage input={input} viewModel={viewModel} />
      <ReadinessProfilePage input={input} viewModel={viewModel} />
      <RiskConcentrationPage input={input} viewModel={viewModel} />
      <ActionPortfolioPage input={input} viewModel={viewModel} />
      <RoadmapPage input={input} viewModel={viewModel} />
      <ControlDeepDivePages input={input} viewModel={viewModel} />
      <ActionRegisterPages input={input} viewModel={viewModel} />
      <EvidenceChecklistPage input={input} viewModel={viewModel} />
      <MethodologyPage input={input} />
    </Document>
  );
}
