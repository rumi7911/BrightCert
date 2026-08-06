import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * A `reports` row whose `gcs_url` is empty is a *claim*: one caller has
 * announced it is rendering, and no PDF exists yet. Publishing the real signed
 * URL is what marks the report finished. Anything that decides whether a report
 * is ready must therefore test `gcs_url`, never mere row existence.
 */
export const CLAIM_MARKER = "";

/**
 * How long a claim is trusted before another caller may take it over.
 *
 * The generate route declares `maxDuration = 60`, so a function that is still
 * alive cannot have held a claim for longer than that. Ninety seconds clears
 * the ceiling with margin, so a takeover means the previous holder is genuinely
 * gone — killed mid-render, or lost to a deploy — rather than merely slow.
 */
export const CLAIM_STALE_MS = 90_000;

export type ClaimResult =
  | { outcome: "claimed"; reportId: string }
  | { outcome: "in-progress" }
  | { outcome: "already-complete" };

/**
 * Acquire the exclusive right to render the report for `assessmentId`.
 *
 * Correctness rests on the unique index on `reports.assessment_id`. Without it
 * the upsert cannot conflict, every caller believes it won, and the original
 * triple-render race returns — so the migration is a hard prerequisite for this
 * code, not an optimisation.
 */
export async function claimReportGeneration(
  supabase: SupabaseClient,
  assessmentId: string,
  claimedAt: string
): Promise<ClaimResult> {
  const { data: claimed } = await supabase
    .from("reports")
    .upsert(
      {
        assessment_id: assessmentId,
        gcs_url: CLAIM_MARKER,
        generated_at: claimedAt,
      },
      { onConflict: "assessment_id", ignoreDuplicates: true }
    )
    .select("id")
    .maybeSingle();

  if (claimed) {
    return { outcome: "claimed", reportId: claimed.id };
  }

  // We lost. Either a finished report exists, or another caller is rendering.
  const { data: existing } = await supabase
    .from("reports")
    .select("id, gcs_url, generated_at")
    .eq("assessment_id", assessmentId)
    .maybeSingle();

  if (!existing) {
    // The row vanished between the upsert and this read — a concurrent failure
    // path released its claim. Treat as in progress; the caller retries.
    return { outcome: "in-progress" };
  }

  if (existing.gcs_url) {
    return { outcome: "already-complete" };
  }

  const staleBefore = new Date(Date.parse(claimedAt) - CLAIM_STALE_MS).toISOString();

  if (!existing.generated_at || existing.generated_at > staleBefore) {
    return { outcome: "in-progress" };
  }

  // The claim is abandoned. Take it over, but only if nobody beat us to it:
  // the `lt` predicate makes this a compare-and-swap, so of several callers
  // finding the same stale claim exactly one update matches a row.
  const { data: takenOver } = await supabase
    .from("reports")
    .update({ generated_at: claimedAt })
    .eq("id", existing.id)
    .eq("gcs_url", CLAIM_MARKER)
    .lt("generated_at", staleBefore)
    .select("id")
    .maybeSingle();

  return takenOver
    ? { outcome: "claimed", reportId: takenOver.id }
    : { outcome: "in-progress" };
}
