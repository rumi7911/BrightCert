import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificationDisclaimer } from "@/components/brightcert/certification-disclaimer";
import { ScoreCircle } from "@/components/brightcert/score-circle";
import { PdfPoller } from "@/components/brightcert/pdf-poller";
import { GatedGaEvent } from "@/components/brightcert/ga-event";
import { PageHeader, SectionHeader } from "@/components/brightcert/ledger";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { getReportSignedUrl } from "@/lib/gcs/upload";

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
    .select("id, status, overall_score, overall_status, stripe_session_id, amount_paid, currency, organisations(name)")
    .eq("id", assessmentId)
    .single();

  if (!assessment) redirect("/dashboard");

  // Handle webhook timing: if user arrives from Stripe before webhook fires,
  // verify payment directly using the Stripe session_id
  if (assessment.status !== "paid" && session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["payment_intent.latest_charge"],
      });
      const paymentIntent =
        typeof session.payment_intent === "object"
          ? session.payment_intent
          : null;
      const latestCharge =
        paymentIntent && typeof paymentIntent.latest_charge === "object"
          ? paymentIntent.latest_charge
          : null;
      if (
        session.payment_status === "paid" &&
        session.metadata?.assessmentId === assessmentId &&
        latestCharge?.refunded === false
      ) {
        await supabase
          .from("assessments")
          .update({
            status: "paid",
            stripe_session_id: session.id,
            amount_paid: session.amount_total,
            currency: session.currency,
            paid_at: new Date().toISOString(),
          })
          .eq("id", assessmentId);
        assessment.status = "paid";
        assessment.stripe_session_id = session.id;
        assessment.amount_paid = session.amount_total;
        assessment.currency = session.currency;
      }
    } catch {
      // Stripe verification failed — fall through to redirect below
    }
  }

  if (assessment.status !== "paid") {
    redirect(`/assessment/${assessmentId}/results`);
  }

  // A report row existing just means the PDF was generated at some point —
  // the stored gcs_url is a 7-day signed URL that goes stale, so it's never
  // read directly. A fresh one is generated below on every load instead.
  // An empty gcs_url is a generation claim, not a finished report
  // (src/lib/reports/claim.ts). getReportSignedUrl signs the deterministic
  // object path without checking that the object exists, so treating a claim
  // as ready would hand the customer a live-looking download link to nothing.
  const { data: reportRow } = await supabase
    .from("reports")
    .select("id, gcs_url")
    .eq("assessment_id", assessmentId)
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const report = reportRow?.gcs_url ? reportRow : null;

  // If no report yet, kick off generation (idempotent — route checks for existing report).
  // Internal secret marks this as a trusted server-to-server call — this is a
  // server-side fetch with no forwarded session cookie, so without it
  // /api/reports/generate's ownership check would reject it.
  if (!report) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    fetch(`${appUrl}/api/reports/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
      },
      body: JSON.stringify({ assessmentId }),
    }).catch(() => {});
  }

  const orgData = assessment.organisations as unknown as { name: string } | null;
  const orgName = orgData?.name ?? "Your Organisation";
  const overallScore = assessment.overall_score ?? 0;
  const reportUrl = report ? await getReportSignedUrl(assessmentId).catch(() => null) : null;

  return (
    <div className="max-w-3xl">
      {/* Silent poller — refreshes page every 5s until PDF is ready */}
      <PdfPoller pdfReady={!!reportUrl} />
      {/* Stripe only appends session_id on the immediate post-checkout
          redirect, never on a later organic visit — GatedGaEvent fires once
          then strips the param, and transaction_id gives GA4 itself a
          second, independent way to dedupe an accidental repeat hit. Only
          renders/fires when the URL's session_id matches the assessment's
          own stored one, so a stale or fabricated param can't fire it. */}
      {assessment.stripe_session_id && (
        <GatedGaEvent
          param="session_id"
          value={assessment.stripe_session_id}
          event="purchase"
          params={{
            transaction_id: assessment.stripe_session_id,
            value: (assessment.amount_paid ?? 0) / 100,
            currency: (assessment.currency ?? "GBP").toUpperCase(),
          }}
        />
      )}

      {/* Header */}
      <PageHeader
        title="Your Cyber Essentials Readiness Report"
        subtitle={`${orgName} · ${new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`}
      />

      {/* Score summary */}
      <div className="mb-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <ScoreCircle score={overallScore} size="lg" />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h2 className="mb-2 text-[13px] font-semibold text-[#0F2044]">Overall readiness</h2>
          <p className="text-sm leading-relaxed text-[#47536B]">
            Your full report is ready. It includes your control-area breakdown, gap
            analysis, and prioritised remediation steps.
          </p>
        </div>
      </div>

      {/* PDF download */}
      <div className="mb-8">
        <SectionHeader title="Your report" />
        <div className="flex items-center justify-between gap-4 border-t border-[#EEF1F6] py-3">
          <div className="flex min-w-0 items-center gap-3">
            <FileText className="h-4 w-4 shrink-0 text-[#047857]" strokeWidth={1.5} />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-[#0F2044]">
                BrightCert Readiness Report · {orgName}
              </p>
              <p className="text-xs text-[#77829A]">
                Full report with gap analysis and remediation roadmap
              </p>
            </div>
          </div>
          {reportUrl ? (
            <Button asChild size="sm" className="shrink-0">
              <a href={reportUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-1.5" />
                Download PDF
              </a>
            </Button>
          ) : (
            <div className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[13px] text-[#64748B]">
              <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#047857] border-t-transparent" />
              Generating PDF…
            </div>
          )}
        </div>
      </div>

      {/* Certification disclaimer — mandatory */}
      <div className="mb-8">
        <CertificationDisclaimer />
      </div>

      {/* Next steps */}
      <div>
        <SectionHeader title="Next steps" />
        <ol className="border-t border-[#EEF1F6]">
          {[
            "Work through the P1 priority actions in your report. These must be resolved before applying.",
            "Share the report PDF with your IT provider or internal team to begin remediation.",
            "Once gaps are addressed, apply for official Cyber Essentials through an IASME Certification Body.",
          ].map((step, i) => (
            <li
              key={i}
              className="flex items-baseline gap-3 border-b border-[#F4F6FA] py-2.5 text-[13px] text-[#33405C]"
            >
              <span className="shrink-0 font-bold tabular-nums text-[#047857]">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
        <p className="text-xs text-[#64748B] mt-4">
          Find an IASME Certification Body at{" "}
          <a
            href="https://iasme.co.uk/cyber-essentials/find-a-certification-body/"
            target="_blank"
            rel="noopener noreferrer"
            className="bc-focus text-[#047857] hover:underline"
          >
            iasme.co.uk/cyber-essentials/find-a-certification-body
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
