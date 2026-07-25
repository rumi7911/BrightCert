import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendDraftReminderEmail } from "@/lib/resend/emails";
import { SECTIONS, getQuestionsBySection } from "@/lib/questions";

const HOUR_MS = 60 * 60 * 1000;
const SPACING_MS = 48 * HOUR_MS;

type Tier = "24h" | "72h";

// Mirrors the section-completion logic in the questionnaire task-list page
// (src/app/(app)/assessment/[id]/page.tsx) — kept as a separate small copy
// here rather than a shared import, since this cron only needs the
// completed-count and continue-link, not that page's full render state.
function computeProgress(responses: { section_id: number }[], assessmentId: string) {
  const answeredBySection: Record<number, number> = {};
  responses.forEach((r) => {
    answeredBySection[r.section_id] = (answeredBySection[r.section_id] ?? 0) + 1;
  });

  let completedCount = 0;
  SECTIONS.forEach((section) => {
    const total = getQuestionsBySection(section.id).length;
    if ((answeredBySection[section.id] ?? 0) >= total) completedCount++;
  });

  if (completedCount === SECTIONS.length) {
    return { completedCount, continueHref: `/assessment/${assessmentId}/check-answers` };
  }

  const firstIncomplete = SECTIONS.find((section) => {
    const total = getQuestionsBySection(section.id).length;
    return (answeredBySection[section.id] ?? 0) < total;
  })!;
  const continueQuestion = Math.min(
    (answeredBySection[firstIncomplete.id] ?? 0) + 1,
    getQuestionsBySection(firstIncomplete.id).length
  );

  return {
    completedCount,
    continueHref: `/assessment/${assessmentId}/section/${firstIncomplete.id}?q=${continueQuestion}`,
  };
}

// Daily cron (see vercel.json): nudges anyone who started but never finished
// the assessment ("draft" status) at 24h and again at 72h, each tracked by
// its own sent-at column so the two nudges don't interfere with each other.
// Auth via a shared secret rather than a user session, since this has no
// browser caller. Pass ?dryRun=true to see what would be sent without
// actually emailing or stamping anything — used to sanity-check the
// recipient list before this brand-new send path goes live for real.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get("dryRun") === "true";
  const admin = createAdminClient();
  const now = Date.now();

  let sent = 0;
  let failed = 0;
  let processed = 0;
  const dryRunPreview: Array<{
    assessmentId: string;
    tier: Tier;
    email: string;
    orgName: string;
    completedCount: number;
    continueHref: string;
  }> = [];

  // Coarse prefilter only — the real eligibility window (24-72h vs 72h+,
  // and the 24h/72h sequencing) is decided per-assessment below, based on
  // actual last-answered-question activity rather than this raw column.
  const { data: candidates, error } = await admin
    .from("assessments")
    .select("id, org_id, created_at, draft_reminder_24h_sent_at, draft_reminder_72h_sent_at")
    .eq("status", "draft");

  if (error) {
    console.error("draft-reminders: failed to query draft assessments:", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  for (const assessment of candidates ?? []) {
    if (assessment.draft_reminder_24h_sent_at && assessment.draft_reminder_72h_sent_at) continue;

    const { data: responses } = await admin
      .from("responses")
      .select("section_id, created_at")
      .eq("assessment_id", assessment.id);

    const lastActivityMs = (responses ?? []).reduce(
      (latest, r) => Math.max(latest, new Date(r.created_at).getTime()),
      new Date(assessment.created_at).getTime()
    );
    const ageMs = now - lastActivityMs;

    // Exactly one tier can be eligible per run: 24h only inside its own
    // window (so a draft that ages past 72h without ever getting a 24h
    // send permanently drops out of that tier, rather than firing late and
    // colliding with 72h), 72h only once real activity is 72h+ stale AND
    // either no 24h reminder was ever sent (historical/backlog draft —
    // gets exactly one message, not zero and not two) or it was sent at
    // least 48h ago (proper sequencing, never back-to-back).
    let tier: Tier | null = null;
    if (
      !assessment.draft_reminder_24h_sent_at &&
      ageMs >= 24 * HOUR_MS &&
      ageMs < 72 * HOUR_MS
    ) {
      tier = "24h";
    } else if (
      !assessment.draft_reminder_72h_sent_at &&
      ageMs >= 72 * HOUR_MS &&
      (!assessment.draft_reminder_24h_sent_at ||
        now - new Date(assessment.draft_reminder_24h_sent_at).getTime() >= SPACING_MS)
    ) {
      tier = "72h";
    }

    if (!tier) continue;
    processed++;

    const sentColumn = tier === "24h" ? "draft_reminder_24h_sent_at" : "draft_reminder_72h_sent_at";

    // Resolve the recipient first. A lookup failure here is permanent —
    // it won't resolve itself on tomorrow's run — so stamp the sent
    // column to stop retrying identically forever.
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
      console.error(`draft-reminders: recipient lookup failed for assessment ${assessment.id} (${tier}), marking as attempted (won't retry):`, err);
      if (!dryRun) {
        await admin
          .from("assessments")
          .update({ [sentColumn]: new Date().toISOString() })
          .eq("id", assessment.id);
      }
      continue;
    }

    const { completedCount, continueHref } = computeProgress(responses ?? [], assessment.id);

    if (dryRun) {
      dryRunPreview.push({
        assessmentId: assessment.id,
        tier,
        email: recipient.email,
        orgName: recipient.orgName,
        completedCount,
        continueHref,
      });
      continue;
    }

    // Sending can fail transiently (Resend hiccup, rate limit) — don't
    // stamp the sent column in that case, so it's retried on tomorrow's run.
    try {
      await sendDraftReminderEmail(recipient.email, recipient.orgName, assessment.id, tier, completedCount, continueHref);
      sent++;
      await admin
        .from("assessments")
        .update({ [sentColumn]: new Date().toISOString() })
        .eq("id", assessment.id);
    } catch (err) {
      failed++;
      console.error(`draft-reminders: send failed for assessment ${assessment.id} (${tier}), will retry next run:`, err);
    }
  }

  if (dryRun) {
    return NextResponse.json({ dryRun: true, wouldSend: dryRunPreview.length, recipients: dryRunPreview });
  }

  return NextResponse.json({ processed, sent, failed });
}
