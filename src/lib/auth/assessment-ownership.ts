import { createClient, createAdminClient } from "@/lib/supabase/server";

export type OwnershipResult =
  | { authorized: true; orgId: string; assessmentStatus: string }
  | { authorized: false; status: 401 | 403 };

// Verifies the currently-signed-in caller (via the session cookie) owns the
// given assessment, i.e. belongs to the same org it was created under.
// 401 = no session at all, 403 = signed in but not the owner.
export async function verifyAssessmentOwnership(assessmentId: string): Promise<OwnershipResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { authorized: false, status: 401 };

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();
  if (!profile?.org_id) return { authorized: false, status: 403 };

  const { data: assessment } = await admin
    .from("assessments")
    .select("org_id, status")
    .eq("id", assessmentId)
    .single();
  if (!assessment || assessment.org_id !== profile.org_id) return { authorized: false, status: 403 };

  return { authorized: true, orgId: profile.org_id, assessmentStatus: assessment.status };
}
