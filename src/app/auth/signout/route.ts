import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);

  const supabase = await createClient();
  await supabase.auth.signOut();

  // 303 → browser follows the redirect as a GET. The signOut() call has
  // cleared the auth cookies on this response, so /login now sees no session.
  return NextResponse.redirect(`${origin}/login`, { status: 303 });
}
