import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, AlertTriangle, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Dashboard" };

// Placeholder dashboard — wired to Supabase in Phase 2
export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F2044]">Dashboard</h1>
        <p className="text-sm text-[#64748B] mt-1">Your Cyber Essentials readiness overview</p>
      </div>

      {/* Empty state — no assessments yet */}
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

      {/* Cards — shown once assessment exists (wired in Phase 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 opacity-40 pointer-events-none">
        {[
          { icon: TrendingUp, label: "Current readiness", value: "–" },
          { icon: AlertTriangle, label: "Open P1 actions", value: "–" },
          { icon: FileText, label: "Reports", value: "–" },
          { icon: TrendingUp, label: "Monitor status", value: "Not active" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-[12px] border border-[#E2E8F0] bg-white p-5">
            <div className="flex items-center gap-3 mb-2">
              <Icon className="h-5 w-5 text-[#64748B]" strokeWidth={1.5} />
              <span className="text-sm text-[#64748B]">{label}</span>
            </div>
            <p className="text-2xl font-bold text-[#0F2044]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
