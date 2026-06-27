import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth protection — wired to Supabase session refresh in Phase 2
// For now, protected routes redirect to /login without a session cookie
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect all /app/* routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/assessment") ||
    pathname.startsWith("/settings")
  ) {
    // Phase 2: check Supabase session cookie here
    // const session = await getSupabaseSession(request)
    // if (!session) return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
