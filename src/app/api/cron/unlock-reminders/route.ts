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
    // submitted_at (set in analyze/route.ts when status flips to "analysed")
    // is when the assessment was actually finished — created_at is when the
    // draft row was first inserted, which can be days earlier.
    .select("id, org_id, overall_score, submitted_at")
    .eq("status", "analysed")
    .lt("submitted_at", cutoff)
    .is("reminder_sent_at", null);

  if (error) {
    console.error("unlock-reminders: failed to query assessments:", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  let sent = 0;
  let failed = 0;

  for (const assessment of assessments ?? []) {
    // Resolve the recipient first. A lookup failure here (no owner profile,
    // no auth user) is permanent — it won't resolve itself on tomorrow's run
    // — so stamp reminder_sent_at to stop retrying identically forever.
    let recipient: { email: string; orgName: string } | null = null;
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

      recipient = { email: userData.user.email, orgName: org?.name ?? "Your Organisation" };
    } catch (err) {
      failed++;
      console.error(`unlock-reminders: recipient lookup failed for assessment ${assessment.id}, marking as attempted (won't retry):`, err);
      await admin
        .from("assessments")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", assessment.id);
      continue;
    }

    // Sending can fail transiently (Resend hiccup, rate limit) — don't stamp
    // reminder_sent_at in that case, so it's retried on tomorrow's run.
    try {
      await sendUnlockReminderEmail(recipient.email, recipient.orgName, assessment.id, assessment.overall_score ?? 0);
      sent++;
      await admin
        .from("assessments")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", assessment.id);
    } catch (err) {
      failed++;
      console.error(`unlock-reminders: send failed for assessment ${assessment.id}, will retry next run:`, err);
    }
  }

  return NextResponse.json({ processed: assessments?.length ?? 0, sent, failed });
}
