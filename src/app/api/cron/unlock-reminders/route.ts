import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendUnlockReminderEmail } from "@/lib/resend/emails";

const REMINDER_DELAY_MS = 24 * 60 * 60 * 1000;

// Daily cron (see vercel.json): nudges anyone who finished the assessment
// (status "analysed") but never paid to unlock the report. Auth via a shared
// secret rather than a user session, since this has no browser caller.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - REMINDER_DELAY_MS).toISOString();

  const { data: assessments, error } = await admin
    .from("assessments")
    .select("id, org_id, overall_score, created_at")
    .eq("status", "analysed")
    .lt("created_at", cutoff)
    .is("reminder_sent_at", null);

  if (error) {
    console.error("unlock-reminders: failed to query assessments:", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  let sent = 0;
  let failed = 0;

  for (const assessment of assessments ?? []) {
    try {
      const { data: org } = await admin
        .from("organisations")
        .select("name")
        .eq("id", assessment.org_id)
        .single();

      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .eq("org_id", assessment.org_id)
        .eq("role", "owner")
        .single();

      if (!profile) throw new Error(`No owner profile for org ${assessment.org_id}`);

      const { data: userData, error: userError } = await admin.auth.admin.getUserById(profile.id);
      if (userError || !userData?.user?.email) {
        throw new Error(`No email for profile ${profile.id}: ${userError?.message}`);
      }

      await sendUnlockReminderEmail(
        userData.user.email,
        org?.name ?? "Your Organisation",
        assessment.id,
        assessment.overall_score ?? 0
      );

      sent++;
    } catch (err) {
      failed++;
      console.error(`unlock-reminders: failed for assessment ${assessment.id}:`, err);
    } finally {
      // Mark attempted either way — a permanent failure (e.g. no profile)
      // would otherwise retry and fail identically every day.
      await admin
        .from("assessments")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", assessment.id);
    }
  }

  return NextResponse.json({ processed: assessments?.length ?? 0, sent, failed });
}
