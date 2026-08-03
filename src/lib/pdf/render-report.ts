import type { ReportInput } from "./report/report-types";

export async function renderValidatedReport(
  input: ReportInput
): Promise<Buffer> {
  const [{ renderToBuffer }, { ReportDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./ReportDocument"),
  ]);

  return renderToBuffer(ReportDocument(input));
}
