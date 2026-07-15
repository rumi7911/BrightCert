import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/brightcert/ledger";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  const { data: org } = profile?.org_id
    ? await supabase
        .from("organisations")
        .select("name, size, sector")
        .eq("id", profile.org_id)
        .single()
    : { data: null };

  return (
    <div className="max-w-xl">
      <PageHeader title="Settings" subtitle="Manage your account and organisation" />

      <SettingsForm
        orgName={org?.name ?? ""}
        orgSize={org?.size ?? null}
        orgSector={org?.sector ?? null}
        email={user.email ?? ""}
      />
    </div>
  );
}
