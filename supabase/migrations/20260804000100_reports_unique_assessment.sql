-- One report per assessment.
--
-- Until now nothing enforced this. Every purchase triggers three concurrent
-- callers of /api/reports/generate (the Stripe webhook, the report page's
-- fire-and-forget trigger, and the page poller); the route's check-then-act
-- guard read before any of their inserts had landed, so all three passed it,
-- all three rendered, and all three inserted. The 3 August 2026 sandbox retest
-- observed exactly that: three rows, three renders, three uploads to one
-- deterministic GCS path.
--
-- This index is the mutex the application code claims against. It is a hard
-- prerequisite for src/lib/reports/claim.ts, not an optimisation: without a
-- unique constraint, `on conflict (assessment_id)` has nothing to match and
-- PostgREST rejects the upsert with 42P10.

begin;

-- Collapse any pre-existing duplicates before the index can reject them.
-- Keep the newest row per assessment, preferring one that actually has a
-- published gcs_url over an unfinished claim.
with ranked as (
  select
    id,
    row_number() over (
      partition by assessment_id
      order by
        (coalesce(gcs_url, '') <> '') desc,
        generated_at desc nulls last,
        id desc
    ) as rn
  from public.reports
)
delete from public.reports
where id in (select id from ranked where rn > 1);

create unique index if not exists reports_assessment_id_key
  on public.reports (assessment_id);

commit;
