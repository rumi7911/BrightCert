import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificationDisclaimer } from "@/components/brightcert/certification-disclaimer";
import { ScoreCircle } from "@/components/brightcert/score-circle";

export const metadata: Metadata = { title: "Your Report" };

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: assessmentId } = await params;

  // Phase 5: fetch assessment from Supabase
  // const supabase = await createClient()
  // const { data: assessment } = await supabase.from('assessments').select('*').eq('id', assessmentId).single()
  // if (!assessment || assessment.status !== 'paid') redirect(`/assessment/${assessmentId}/results`)
  // const { data: report } = await supabase.from('reports').select('gcs_url').eq('assessment_id', assessmentId).single()

  // Mock — replace with Supabase fetch in Phase 5
  const score = 71;
  const orgName = "Acme Ltd";
  const reportUrl = null; // GCS URL once generated

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="h-12 w-12 rounded-[12px] bg-[#ECFDF5] flex items-center justify-center shrink-0">
          <ShieldCheck className="h-6 w-6 text-[#047857]" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0F2044]">Your Cyber Essentials Readiness Report</h1>
          <p className="text-sm text-[#64748B] mt-1">{orgName} — {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>

      {/* Score summary */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 mb-5 flex flex-col sm:flex-row gap-6 items-center">
        <ScoreCircle score={score} size="lg" />
        <div>
          <h2 className="text-base font-semibold text-[#0F2044] mb-1">Overall readiness score</h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            Your assessment is complete. The full report below includes your control-area breakdown, gap analysis, and prioritised remediation steps.
          </p>
        </div>
      </div>

      {/* PDF download */}
      <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#047857]" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-semibold text-[#0F2044]">BrightCert Readiness Report — {orgName}</p>
              <p className="text-xs text-[#64748B]">Full report with gap analysis and remediation roadmap</p>
            </div>
          </div>
          {reportUrl ? (
            <Button asChild size="sm">
              <a href={reportUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </Button>
          ) : (
            <div className="text-sm text-[#64748B] flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-[#047857] border-t-transparent rounded-full animate-spin" />
              Generating PDF...
            </div>
          )}
        </div>
      </div>

      {/* Certification disclaimer — mandatory */}
      <div className="mb-6">
        <CertificationDisclaimer />
      </div>

      {/* Next steps */}
      <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-5">
        <h3 className="text-sm font-semibold text-[#0F2044] mb-3">Next steps</h3>
        <ol className="space-y-2">
          {[
            "Work through the P1 priority actions in your report — these must be resolved before applying.",
            "Share the report PDF with your IT provider or internal team to begin remediation.",
            "Once gaps are addressed, apply for official Cyber Essentials through an IASME Certification Body.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#475569]">
              <span className="h-5 w-5 rounded-full bg-[#ECFDF5] text-[#047857] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <p className="text-xs text-[#64748B] mt-4">
          Find an IASME Certification Body at{" "}
          <a
            href="https://iasme.co.uk/cyber-essentials/certified-assessors/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#047857] hover:underline"
          >
            iasme.co.uk/cyber-essentials/certified-assessors
          </a>
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
