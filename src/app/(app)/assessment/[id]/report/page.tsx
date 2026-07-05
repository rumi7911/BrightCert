import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificationDisclaimer } from "@/components/brightcert/certification-disclaimer";
import { ScoreCircle } from "@/components/brightcert/score-circle";
import { PdfPoller } from "@/components/brightcert/pdf-poller";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";

export const metadata: Metadata = { title: "Your Report" };

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { id: assessmentId } = await params;
  const { session_id } = await searchParams;
  const supabase = await createClient();

  // Fetch assessment + org name
  const { data: assessment } = await supabase
    .from("assessments")
    .select("id, status, overall_score, overall_status, organisations(name)")
    .eq("id", assessmentId)
    .single();

  if (!assessment) redirect("/dashboard");

  // Handle webhook timing: if user arrives from Stripe before webhook fires,
  // verify payment directly using the Stripe session_id
  if (assessment.status !== "paid" && session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (
        session.payment_status === "paid" &&
        session.metadata?.assessmentId === assessmentId
      ) {
        await supabase
          .from("assessments")
          .update({ status: "paid" })
          .eq("id", assessmentId);
        assessment.status = "paid";
      }
    } catch {
      // Stripe verification failed — fall through to redirect below
    }
  }

  if (assessment.status !== "paid") {
    redirect(`/assessment/${assessmentId}/results`);
  }

  // Fetch report URL
  const { data: report } = await supabase
    .from("reports")
    .select("gcs_url")
    .eq("assessment_id", assessmentId)
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // If no report yet, kick off generation (idempotent — route checks for existing report)
  if (!report) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    fetch(`${appUrl}/api/reports/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assessmentId }),
    }).catch(() => {});
  }

  const orgData = assessment.organisations as unknown as { name: string } | null;
  const orgName = orgData?.name ?? "Your Organisation";
  const overallScore = assessment.overall_score ?? 0;
  const reportUrl = report?.gcs_url ?? null;

  return (
    <div className="max-w-3xl">
      {/* Silent poller — refreshes page every 5s until PDF is ready */}
      <PdfPoller pdfReady={!!reportUrl} />

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="h-12 w-12 rounded-[12px] bg-[#ECFDF5] flex items-center justify-center shrink-0">
          <ShieldCheck className="h-6 w-6 text-[#047857]" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0F2044]">
            Your Cyber Essentials Readiness Report
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            {orgName} ·{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Score summary */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 mb-5 flex flex-col sm:flex-row gap-6 items-center">
        <ScoreCircle score={overallScore} size="lg" />
        <div>
          <h2 className="text-base font-semibold text-[#0F2044] mb-1">
            Overall readiness score
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            Your full report is ready. It includes your control-area breakdown, gap
            analysis, and prioritised remediation steps.
          </p>
        </div>
      </div>

      {/* PDF download */}
      <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#047857]" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-semibold text-[#0F2044]">
                BrightCert Readiness Report · {orgName}
              </p>
              <p className="text-xs text-[#64748B]">
                Full report with gap analysis and remediation roadmap
              </p>
            </div>
          </div>
          {reportUrl ? (
            <Button asChild size="sm">
              <a href={reportUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-1.5" />
                Download PDF
              </a>
            </Button>
          ) : (
            <div className="text-sm text-[#64748B] flex items-center gap-2 whitespace-nowrap">
              <div className="h-4 w-4 border-2 border-[#047857] border-t-transparent rounded-full animate-spin shrink-0" />
              Generating PDF…
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
            "Work through the P1 priority actions in your report. These must be resolved before applying.",
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
        <Button asChild variant="outline" size="sm">
          <Link href={`/assessment/${assessmentId}/results`}>View results</Link>
        </Button>
      </div>
    </div>
  );
}
