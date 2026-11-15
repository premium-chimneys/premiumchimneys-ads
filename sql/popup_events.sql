-- Timed popup stats: what visitors do with the popup on the service pages.
-- Written by /api/popup-event, read by the /popup page. Run once in the
-- Supabase SQL editor.
--
-- The table itself is closed to the public (RLS on, no policies). The site's
-- anon key can only call the two functions below: one adds a single event,
-- the other returns totals. Nobody can read or change individual rows.

create table if not exists public.popup_events (
  id         bigint generated always as identity primary key,
  sid        text not null,             -- random id for one browser tab
  event      text not null check (event in ('shown', 'claim', 'dismiss', 'converted')),
  kind       text,                      -- converted only: booking | form | call | chat
  service    text,
  variant    text,                      -- v1 | v2
  path       text,
  created_at timestamptz not null default now()
);

create index if not exists popup_events_sid_idx on public.popup_events (sid, event, created_at);

alter table public.popup_events enable row level security;

create or replace function public.log_popup_event(
  p_sid text, p_event text, p_kind text, p_service text, p_variant text, p_path text
) returns void
language sql security definer set search_path = public as $$
  insert into public.popup_events (sid, event, kind, service, variant, path)
  select left(p_sid, 64), p_event, left(p_kind, 20), left(p_service, 60), left(p_variant, 10), left(p_path, 200)
  where p_sid is not null and length(p_sid) between 8 and 64
    and p_event in ('shown', 'claim', 'dismiss', 'converted');
$$;

-- Counts are of tabs (sid), not raw events, so a double-fired event never
-- counts twice. "Left" is a tab that saw the popup and neither claimed nor
-- closed it. A conversion counts for a group only if it came after the
-- claim / close.
create or replace function public.popup_stats(p_days integer default null)
returns json
language sql stable security definer set search_path = public as $$
  with ev as (
    select * from public.popup_events where p_days is null or created_at >= now() - make_interval(days => p_days)
  ),
  per as (
    select sid,
      bool_or(event = 'shown')                     as saw,
      min(created_at) filter (where event = 'claim')   as claimed_at,
      min(created_at) filter (where event = 'dismiss') as dismissed_at,
      min(created_at) filter (where event = 'converted') as converted_at,
      min(kind)       filter (where event = 'converted') as converted_kind
    from ev group by sid
  )
  select json_build_object(
    'saw',                count(*) filter (where saw),
    'claimed',            count(*) filter (where saw and claimed_at is not null),
    'claimed_converted',  count(*) filter (where saw and claimed_at is not null and converted_at >= claimed_at),
    'dismissed',          count(*) filter (where saw and dismissed_at is not null and claimed_at is null),
    'dismissed_converted',count(*) filter (where saw and dismissed_at is not null and claimed_at is null and converted_at >= dismissed_at),
    'left',               count(*) filter (where saw and claimed_at is null and dismissed_at is null),
    'converted_by_kind',  (select coalesce(json_object_agg(k, n), '{}'::json) from (
                             select converted_kind as k, count(*) as n from per
                             where saw and dismissed_at is not null and claimed_at is null and converted_at >= dismissed_at
                             group by converted_kind) x),
    'first_event',        (select min(created_at) from ev)
  ) from per;
$$;

revoke all on function public.log_popup_event(text, text, text, text, text, text) from public;
revoke all on function public.popup_stats(integer) from public;
grant execute on function public.log_popup_event(text, text, text, text, text, text) to anon;
grant execute on function public.popup_stats(integer) to anon;
