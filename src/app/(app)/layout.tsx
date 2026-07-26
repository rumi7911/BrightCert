import { AppSidebar, type SidebarLatest } from "@/components/brightcert/app-sidebar";
import { GatedGaEvent } from "@/components/brightcert/ga-event";
import { createClient } from "@/lib/supabase/server";
import { getOverallStatus, getScoreColor, type Gap, type OverallStatus } from "@/types/assessment";

const SIDEBAR_VERDICTS: Record<OverallStatus, string> = {
  ready: "Ready",
  nearly_ready: "Nearly ready",
  needs_fixes: "Not yet ready",
  not_ready: "Not ready",
};

// Signal & Paper app frame: dark collapsible rail + paper canvas, sections
// float as their own white cards (no wrapping canvas). Route protection
// lives in proxy.ts.
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
            body: "All findings and the remediation roadmap, as a PDF. £99 including VAT with code FOUNDING10 — a £100 founding discount from £199.",
            label: "Unlock · £99 including VAT",
            href: `/api/stripe/checkout?assessmentId=${assessment.id}`,
          };
        } else if (assessment.status === "paid") {
          // Always route through the report page rather than a stored GCS
          // URL — signed URLs expire after 7 days, and the report page
          // already regenerates a fresh one (and handles "still generating").
          cta = {
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
    <div className="flex min-h-screen flex-col bg-[#F3F4EC] md:flex-row">
      <GatedGaEvent param="signup" event="sign_up" />
      <AppSidebar orgName={orgName} email={user?.email ?? null} latest={latest} />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
