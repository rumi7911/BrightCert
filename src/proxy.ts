import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";

const PROTECTED = ["/dashboard", "/assessment", "/settings"];
const AUTH_ROUTES = ["/login", "/signup"];
const ATTRIBUTION_COOKIE = "bc_attribution";

// First-touch UTM capture, done here rather than client-side, because this
// runs on every request regardless of entry URL (a Clay link straight into
// /assessment/new or /signup) or auth method (Google OAuth has no client-side
// hook to piggyback on the way email-OTP's signInWithOtp `data` field does).
function withAttributionCookie(request: NextRequest, response: NextResponse) {
  if (request.cookies.get(ATTRIBUTION_COOKIE)) return response;

  const { searchParams } = request.nextUrl;
  const utm_source = searchParams.get("utm_source");
  const utm_medium = searchParams.get("utm_medium");
  const utm_campaign = searchParams.get("utm_campaign");
  if (!utm_source && !utm_medium && !utm_campaign) return response;

  response.cookies.set(
    ATTRIBUTION_COOKIE,
    JSON.stringify({ utm_source, utm_medium, utm_campaign }),
    { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 30 }
  );
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next({ request });

  const supabase = createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    // Cold prospects clicking "Start assessment" have no account yet — send
    // them to signup, not a "sign in" screen, and preserve where they were
    // headed (including any query string, e.g. UTMs) so they land back on it
    // after the magic-link round trip.
    const url = new URL("/signup", request.url);
    url.searchParams.set("next", pathname + request.nextUrl.search);
    return withAttributionCookie(request, NextResponse.redirect(url));
  }

  if (isAuthRoute && user) {
    return withAttributionCookie(request, NextResponse.redirect(new URL("/dashboard", request.url)));
  }

  return withAttributionCookie(request, response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
