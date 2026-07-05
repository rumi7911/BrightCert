import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList,
  AlertTriangle,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreCircle } from "@/components/brightcert/score-circle";
import { createClient } from "@/lib/supabase/server";
import type { Gap } from "@/types/assessment";

export const metadata: Metadata = { title: "Dashboard" };

function StatusBadge({ status }: { status: string }) {
  const cfg = {
    draft: { label: "In progress", color: "#92400E", bg: "#FFFBEB", icon: Clock },
    submitted: { label: "Submitted", color: "#1E40AF", bg: "#EFF6FF", icon: Clock },
    analysed: { label: "Results ready", color: "#065F46", bg: "#ECFDF5", icon: CheckCircle2 },
    paid: { label: "Report unlocked", color: "#065F46", bg: "#ECFDF5", icon: CheckCircle2 },
  }[status] ?? { label: status, color: "#475569", bg: "#F1F5F9", icon: Clock };

  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <Icon className="h-3 w-3" strokeWidth={2} />
      {cfg.label}
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get current user's org
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) {
    return <EmptyState />;
  }

  // Fetch all assessments for this org
  const { data: assessments } = await supabase
    .from("assessments")
    .select("id, status, overall_score, overall_status, created_at, submitted_at")
    .eq("org_id", profile.org_id)
    .order("created_at", { ascending: false });

  if (!assessments || assessments.length === 0) {
    return <EmptyState />;
  }

  const latest = assessments[0];

  // P1 gap count from latest analysed/paid assessment
  let p1Count = 0;
  if (latest.status === "analysed" || latest.status === "paid") {
    const { data: scores } = await supabase
      .from("control_scores")
      .select("gaps")
      .eq("assessment_id", latest.id);

    if (scores) {
      p1Count = scores.flatMap((s) => (s.gaps as Gap[]) ?? []).filter((g) => g.priority === "P1").length;
    }
  }

  // Fetch reports for paid assessments
  const paidIds = assessments.filter((a) => a.status === "paid").map((a) => a.id);
  const { data: reports } = paidIds.length
    ? await supabase.from("reports").select("assessment_id, gcs_url").in("assessment_id", paidIds)
    : { data: [] };

  const reportMap = Object.fromEntries((reports ?? []).map((r) => [r.assessment_id, r.gcs_url]));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0F2044]">Dashboard</h1>
          <p className="text-sm text-[#64748B] mt-1">Your Cyber Essentials readiness overview</p>
        </div>
        <Button asChild size="sm">
          <Link href="/assessment/new">
            <Plus className="h-4 w-4 mr-1.5" />
            New Assessment
          </Link>
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Score */}
        <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 flex items-center gap-4 shadow-[0_1px_3px_rgba(15,32,68,0.05)] transition-all duration-200 hover:shadow-[0_8px_24px_-8px_rgba(15,32,68,0.15)]">
          <ScoreCircle score={latest.overall_score ?? 0} size="sm" />
          <div>
            <p className="text-xs text-[#64748B] mb-0.5">Current readiness</p>
            <p className="font-display text-3xl font-bold text-[#0F2044] tabular-nums">
              {latest.overall_score != null ? `${latest.overall_score}%` : "–"}
            </p>
            {latest.overall_status && (
              <p className="text-xs text-[#64748B] capitalize mt-0.5">
                {latest.overall_status.replace("_", " ")}
              </p>
            )}
          </div>
        </div>

        {/* P1 actions */}
        <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(15,32,68,0.05)] transition-all duration-200 hover:shadow-[0_8px_24px_-8px_rgba(15,32,68,0.15)]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-[#DC2626]" strokeWidth={1.5} />
            <span className="text-xs text-[#64748B]">Open P1 actions</span>
          </div>
          <p className="font-display text-3xl font-bold text-[#0F2044] tabular-nums">{p1Count > 0 ? p1Count : "–"}</p>
          {p1Count > 0 && (
            <p className="text-xs text-[#64748B] mt-0.5">Must fix before applying</p>
          )}
          {p1Count === 0 && latest.overall_score != null && (
            <p className="text-xs text-[#059669] mt-0.5">No critical issues</p>
          )}
        </div>

        {/* Reports */}
        <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(15,32,68,0.05)] transition-all duration-200 hover:shadow-[0_8px_24px_-8px_rgba(15,32,68,0.15)]">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-[#047857]" strokeWidth={1.5} />
            <span className="text-xs text-[#64748B]">Reports</span>
          </div>
          <p className="font-display text-3xl font-bold text-[#0F2044] tabular-nums">{paidIds.length}</p>
          <p className="text-xs text-[#64748B] mt-0.5">
            {paidIds.length === 0 ? "Unlock from results page" : `${paidIds.length} unlocked`}
          </p>
        </div>
      </div>

      {/* Assessment history */}
      <h2 className="text-lg font-semibold text-[#0F2044] mb-3">Assessment history</h2>
      <div className="rounded-[12px] border border-[#E2E8F0] bg-white divide-y divide-[#F1F5F9] shadow-[0_1px_3px_rgba(15,32,68,0.05)]">
        {assessments.map((a) => {
          const reportUrl = reportMap[a.id];
          const date = new Date(a.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <div key={a.id} className="flex items-center justify-between p-4 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                  {a.status === "paid" ? (
                    <CheckCircle2 className="h-4 w-4 text-[#059669]" strokeWidth={1.5} />
                  ) : a.status === "analysed" ? (
                    <CheckCircle2 className="h-4 w-4 text-[#047857]" strokeWidth={1.5} />
                  ) : a.status === "draft" ? (
                    <Clock className="h-4 w-4 text-[#94A3B8]" strokeWidth={1.5} />
                  ) : (
                    <XCircle className="h-4 w-4 text-[#94A3B8]" strokeWidth={1.5} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0F2044] truncate">Assessment · {date}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={a.status} />
                    {a.overall_score != null && (
                      <span className="text-xs text-[#64748B]">Score: {a.overall_score}%</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {a.status === "draft" && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/assessment/${a.id}/section/1?q=1`}>Continue</Link>
                  </Button>
                )}
                {a.status === "analysed" && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/assessment/${a.id}/results`}>View results</Link>
                  </Button>
                )}
                {a.status === "paid" && (
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/assessment/${a.id}/results`}>Results</Link>
                    </Button>
                    {reportUrl ? (
                      <Button asChild size="sm">
                        <a href={reportUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          PDF
                        </a>
                      </Button>
                    ) : (
                      <Button asChild size="sm">
                        <Link href={`/assessment/${a.id}/report`}>Report</Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F2044]">Dashboard</h1>
        <p className="text-sm text-[#64748B] mt-1">Your Cyber Essentials readiness overview</p>
      </div>
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-12 text-center">
        <div className="h-12 w-12 rounded-[12px] bg-[#ECFDF5] flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="h-6 w-6 text-[#047857]" strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-semibold text-[#0F2044] mb-2">Start your first assessment</h2>
        <p className="text-sm text-[#64748B] max-w-sm mx-auto mb-6">
          Complete a Cyber Essentials readiness assessment to see your score, identify gaps, and unlock a practical report.
        </p>
        <Button asChild>
          <Link href="/assessment/new">Start Assessment</Link>
        </Button>
      </div>
    </div>
  );
}
