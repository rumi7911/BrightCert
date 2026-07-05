import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ClipboardList,
  Clock,
  Wifi,
  Settings,
  Users,
  Bug,
  RefreshCw,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Start Assessment" };

const controlAreas = [
  { icon: Wifi, label: "Boundary Firewalls & Internet Gateways" },
  { icon: Settings, label: "Secure Configuration" },
  { icon: Users, label: "User Access Control" },
  { icon: Bug, label: "Malware Protection" },
  { icon: RefreshCw, label: "Security Update Management" },
];

const prepItems = [
  "Your company devices and operating systems",
  "Cloud services used by your team",
  "Admin accounts and user permissions",
  "Firewall or router settings",
  "Anti-malware tools",
  "Software update processes",
];

async function createAssessment() {
  "use server";
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) redirect("/login");

  const { data: assessment, error } = await supabase
    .from("assessments")
    .insert({ org_id: profile.org_id, status: "draft" })
    .select("id")
    .single();

  if (error || !assessment) redirect("/dashboard");

  redirect(`/assessment/${assessment.id}/section/1?q=1`);
}

export default function AssessmentNewPage() {
  return (
    <div className="max-w-2xl">
      <Link href="/dashboard" className="text-sm text-[#64748B] hover:text-[#0F2044] mb-6 inline-flex items-center gap-1">
        ← Back to dashboard
      </Link>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-8 mt-4 shadow-[0_1px_3px_rgba(15,32,68,0.06),0_16px_48px_-16px_rgba(15,32,68,0.1)]">
        <div className="flex items-start gap-4 mb-6">
          <div className="h-12 w-12 rounded-[12px] bg-[#ECFDF5] flex items-center justify-center shrink-0">
            <ClipboardList className="h-6 w-6 text-[#047857]" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F2044] leading-tight">
              Start your Cyber Essentials readiness assessment
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              This assessment helps you understand how prepared your organisation is for Cyber Essentials.
            </p>
          </div>
        </div>

        <p className="text-sm text-[#475569] leading-relaxed mb-6">
          You will answer questions across five areas: firewalls, secure configuration, user access, malware protection, and security updates.
        </p>

        <div className="flex items-center gap-2 text-sm text-[#475569] mb-6 p-3 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0]">
          <Clock className="h-4 w-4 text-[#64748B]" strokeWidth={1.5} />
          <span><strong className="text-[#0F2044]">Time estimate:</strong> Most businesses can complete the assessment in around 2 hours.</span>
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-[#0F2044] mb-3">The assessment covers five control areas:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {controlAreas.map(({ icon: Icon, label }, idx) => (
              <div key={label} className="flex items-center gap-2 text-sm text-[#475569]">
                <div className="h-6 w-6 rounded-[6px] bg-[#ECFDF5] flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-[#047857]" strokeWidth={1.5} />
                </div>
                <span>{idx + 1}. {label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm font-semibold text-[#0F2044] mb-3">Before you start — you may find it helpful to have:</p>
          <ul className="space-y-1.5">
            {prepItems.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#475569]">
                <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" strokeWidth={1.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[8px] bg-[#ECFDF5] border border-[#A7F3D0] p-4 mb-8">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-sm text-[#065F46]">
              <strong>Complete the assessment first. Pay only when you are ready to unlock the full report.</strong> You will be able to save your progress and return at any time.
            </p>
          </div>
        </div>

        <form action={createAssessment}>
          <Button type="submit" size="lg" className="w-full">
            Begin Assessment
          </Button>
        </form>
      </div>
    </div>
  );
}
