"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrganisation(_prevState: unknown, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const size = formData.get("size") as string;
  const sector = (formData.get("sector") as string)?.trim();

  if (!name) return { error: "Organisation name is required" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) return { error: "Organisation not found" };

  const { error } = await supabase
    .from("organisations")
    .update({ name, size: size || null, sector: sector || null })
    .eq("id", profile.org_id);

  if (error) return { error: "Failed to save. Please try again." };

  revalidatePath("/settings");
  return { success: true };
}
