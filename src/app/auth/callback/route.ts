import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const user = data.user;

  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existingProfile) {
    // First sign-in — create org and profile
    const orgName = (user.user_metadata?.org_name as string) || "My Organisation";

    const { data: org } = await supabase
      .from("organisations")
      .insert({ name: orgName })
      .select("id")
      .single();

    if (org) {
      await supabase.from("profiles").insert({
        id: user.id,
        org_id: org.id,
        role: "owner",
      });
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
