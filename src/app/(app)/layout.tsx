import Link from "next/link";
import { LogOut } from "lucide-react";
import { AppSidebar, type SidebarLatest } from "@/components/brightcert/app-sidebar";
import { Logo } from "@/components/brightcert/logo";
import { createClient } from "@/lib/supabase/server";
import { getOverallStatus, getScoreColor, type Gap, type OverallStatus } from "@/types/assessment";

const SIDEBAR_VERDICTS: Record<OverallStatus, string> = {
  ready: "Ready",
  nearly_ready: "Nearly ready",
  needs_fixes: "Not yet ready",
  not_ready: "Not ready",
};

// Inset-canvas app frame: grey shell, collapsible rail, content floats as a
// white rounded panel. Route protection lives in proxy.ts.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let orgName: string | null = null;
  let latest: SidebarLatest | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("id", user.id)
      .single();

    if (profile?.org_id) {
      const { data: org } = await supabase
        .from("organisations")
        .select("name")
        .eq("id", profile.org_id)
        .single();
      orgName = org?.name ?? null;

      const { data: assessment } = await supabase
        .from("assessments")
        .select("id, status, overall_score, overall_status")
        .eq("org_id", profile.org_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (assessment) {
        const resultsReady = assessment.status === "analysed" || assessment.status === "paid";
        const score = assessment.overall_score;

        let p1Count = 0;
        if (resultsReady) {
          const { data: scores } = await supabase
            .from("control_scores")
            .select("gaps")
            .eq("assessment_id", assessment.id);
          p1Count = (scores ?? [])
            .flatMap((row) => (Array.isArray(row.gaps) ? (row.gaps as Gap[]) : []))
            .filter((gap) => gap.priority === "P1").length;
        }

        let cta: SidebarLatest["cta"] = null;
        if (assessment.status === "analysed") {
          cta = {
            title: "Your report is ready",
            body: "All findings and the remediation roadmap, as a PDF.",
            label: "Unlock · £199",
            href: `/api/stripe/checkout?assessmentId=${assessment.id}`,
          };
        } else if (assessment.status === "paid") {
          const { data: report } = await supabase
            .from("reports")
            .select("gcs_url")
            .eq("assessment_id", assessment.id)
            .limit(1)
            .maybeSingle();
          cta = report?.gcs_url
            ? {
                title: "Report unlocked",
                body: "Your full readiness report is ready to share.",
                label: "Download PDF",
                href: report.gcs_url,
                external: true,
              }
            : {
                title: "Report unlocked",
                body: "Your full readiness report is ready to view.",
                label: "View report",
                href: `/assessment/${assessment.id}/report`,
              };
        }

        const status = (assessment.overall_status ?? (score != null ? getOverallStatus(score) : null)) as OverallStatus | null;

        latest = {
          id: assessment.id,
          score: resultsReady ? score : null,
          scoreColor: score != null ? getScoreColor(score) : "#CBD5E1",
          verdict: status ? SIDEBAR_VERDICTS[status] ?? "" : "",
          p1Count,
          resultsReady,
          cta,
        };
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#EEF2F7] flex flex-col">
      {/* Mobile top bar — the rail is hidden below md */}
      <header className="md:hidden sticky top-0 z-40 h-14 bg-white border-b border-[#E5EAF2] flex items-center justify-between px-4">
        <Link href="/dashboard" aria-label="BrightCert dashboard">
          <Logo markClassName="h-7 w-7" textClassName="text-lg" />
        </Link>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F2044] cursor-pointer"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Sign out
          </button>
        </form>
      </header>

      <div className="flex flex-1">
        <AppSidebar orgName={orgName} email={user?.email ?? null} latest={latest} />

        {/* Content canvas */}
        <main className="flex-1 min-w-0 m-2 md:my-3 md:mr-3 md:ml-0 rounded-[14px] border border-[#E5EAF2] bg-white shadow-[0_1px_3px_rgba(15,32,68,0.05)] px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
