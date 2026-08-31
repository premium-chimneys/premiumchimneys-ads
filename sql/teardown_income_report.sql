-- Teardown for the income report + subcontractor submission feature.
--
-- NOT RUN AUTOMATICALLY. Review, take a backup, then execute in the Supabase
-- SQL editor when you're ready. The application code that read and wrote these
-- tables has already been deleted, so nothing in this repo depends on them:
--
--   app/sub/**                        subcontractor per-token pages + form
--   app/api/sub/submit/route.js       the parts/total/deposit submission endpoint
--   lib/jobber-invoices.js            invoice -> income_report sync
--   lib/jobber-backfill-classify.js   report_type backfill
--   lib/jobber-backfill-tech.js       technician_name backfill
--   app/api/jobber/{sync,backfill-classify,backfill-tech}
--   the income_report handlers inside lib/jobber-webhook.js
--
-- DO NOT drop `jobber_auth`. It holds the live Jobber OAuth tokens and is still
-- used by lib/jobber.js for the Reputation Manager review-campaign fan-out in
-- lib/jobber-webhook.js. Dropping it breaks that integration.

-- Recommended: eyeball what you're about to lose before dropping anything.
--   select count(*) from public.income_report;
--   select count(*) from public.subs;
--
-- Recommended: keep a copy. Snapshots the rows into a dated archive schema so
-- the data survives the drop; delete the schema later once you're sure.
--   create schema if not exists archive_2026_08_30;
--   create table archive_2026_08_30.income_report as select * from public.income_report;
--   create table archive_2026_08_30.subs        as select * from public.subs;

begin;

-- Subcontractor tokens: one row per sub, mapping their private link token to a
-- jobber_user_id. Only ever read by the deleted /sub/[token] page and submit route.
drop table if exists public.subs;

-- The income report itself: one row per request/invoice, carrying
-- customer_name, report_date, technician_name, sale_amount, parts, deposit,
-- notes, job_stage, payment, assigned_user_ids, report_type.
drop table if exists public.income_report;

commit;
