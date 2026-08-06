-- V2 hero images: image = f(service_group, metroplex).
--   chimney_core -> one row per metroplex
--   fireplace    -> a single row with metroplex NULL (shared everywhere)
-- Read-only public access, mirroring services/cities. V1 never reads this.

create table if not exists public.v2_hero_images (
  id            uuid primary key default gen_random_uuid(),
  service_group text not null check (service_group in ('chimney_core', 'fireplace')),
  metroplex     text,
  image_url     text not null,
  created_at    timestamptz not null default now()
);

-- One image per (group, metroplex). Guard the single fireplace row too
-- (Postgres treats NULLs as distinct in a normal UNIQUE, so use a partial index).
create unique index if not exists v2_hero_images_group_metroplex_idx
  on public.v2_hero_images (service_group, metroplex)
  where metroplex is not null;

create unique index if not exists v2_hero_images_group_null_metroplex_idx
  on public.v2_hero_images (service_group)
  where metroplex is null;

-- Public read (same posture as services/cities).
alter table public.v2_hero_images enable row level security;
drop policy if exists "public read v2_hero_images" on public.v2_hero_images;
create policy "public read v2_hero_images"
  on public.v2_hero_images for select using (true);

-- ── Seed template ─────────────────────────────────────────────────────────
-- Fireplace group: one shared image (all metroplexes, all 5 fireplace services)
insert into public.v2_hero_images (service_group, metroplex, image_url) values
  ('fireplace', null, 'REPLACE_WITH_FIREPLACE_IMAGE_URL')
on conflict do nothing;

-- Chimney-core group: one row per metroplex (add/remove to match cities.metroplex)
insert into public.v2_hero_images (service_group, metroplex, image_url) values
  ('chimney_core', 'chicago',        'REPLACE_ME'),
  ('chimney_core', 'dfw',            'REPLACE_ME'),
  ('chimney_core', 'atlanta',        'REPLACE_ME'),
  ('chimney_core', 'houston',        'REPLACE_ME'),
  ('chimney_core', 'san-francisco',  'REPLACE_ME'),
  ('chimney_core', 'seattle',        'REPLACE_ME'),
  ('chimney_core', 'washington-dc',  'REPLACE_ME'),
  ('chimney_core', 'st-louis',       'REPLACE_ME'),
  ('chimney_core', 'los-angeles',    'REPLACE_ME'),
  ('chimney_core', 'boston',         'REPLACE_ME'),
  ('chimney_core', 'sacramento',     'REPLACE_ME'),
  ('chimney_core', 'denver',         'REPLACE_ME')
on conflict do nothing;
