import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/resend/emails";

// Set by proxy.ts on first touch, on any request — works identically for
// email-OTP and Google-OAuth signups, since it's a plain cookie rather than
// something threaded through signInWithOtp's `data` field (which OAuth has
// no equivalent of).
function readAttributionCookie(raw: string | undefined) {
  const empty = { utm_source: null, utm_medium: null, utm_campaign: null };
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw);
    return {
      utm_source: parsed.utm_source ?? null,
      utm_medium: parsed.utm_medium ?? null,
      utm_campaign: parsed.utm_campaign ?? null,
    };
  } catch {
    return empty;
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Supabase can bounce back here with an error (expired/consumed link, etc.)
  const urlError =
    searchParams.get("error_description") || searchParams.get("error");
  if (urlError) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(urlError)}`
    );
  }

  const supabase = await createClient();

  // token_hash flow (robust, cross-device — no PKCE verifier cookie needed).
  // Falls back to the PKCE code flow if a `code` is present instead.
  let authError: { message: string } | null = null;
  let user = null;

  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash });
    authError = error;
    user = data?.user ?? null;
  } else if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    authError = error;
    user = data?.user ?? null;
  } else {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Missing sign-in token")}`
    );
  }

  if (authError || !user) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        authError?.message ?? "Sign-in failed"
      )}`
    );
  }

  // Provision org + profile on first sign-in. Use the admin (service-role)
  // client so RLS on organisations/profiles can't silently block creation.
  const admin = createAdminClient();

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  let isNewSignup = false;

  if (!existingProfile) {
    const orgName =
      (user.user_metadata?.org_name as string) || "My Organisation";
    const cookieStore = await cookies();
    const attribution = readAttributionCookie(cookieStore.get("bc_attribution")?.value);

    const { data: org, error: orgError } = await admin
      .from("organisations")
      .insert({
        name: orgName,
        utm_source: attribution.utm_source,
        utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign,
      })
      .select("id")
      .single();

    if (orgError || !org) {
      console.error("Org creation failed:", orgError);
    } else {
      const { error: profileError } = await admin.from("profiles").insert({
        id: user.id,
        org_id: org.id,
        role: "owner",
      });
      if (profileError) {
        console.error("Profile creation failed:", profileError);
      } else {
        isNewSignup = true;
      }
      // Fire-and-forget — don't block the redirect on email delivery
      sendWelcomeEmail(user.email!, orgName).catch((err) =>
        console.error("Welcome email failed:", err)
      );
    }
  }

  const redirectUrl = new URL(next, origin);
  // Flags a real new-account creation (not every login) so the destination
  // page can fire a one-off signup_completed GA4 event — see SignupCompletedEvent.
  if (isNewSignup) redirectUrl.searchParams.set("signup", "1");

  return NextResponse.redirect(redirectUrl);
}
