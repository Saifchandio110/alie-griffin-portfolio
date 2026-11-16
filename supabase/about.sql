-- =====================================================================
-- About section: editable from the admin panel
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Needs schema.sql to have been run first. Safe to re-run.
-- =====================================================================

create table if not exists public.about_content (
  id integer primary key default 1 check (id = 1),
  tagline text not null default 'Digital illustrations and paintings'
    check (char_length(tagline) <= 120),
  intro text not null default '' check (char_length(intro) <= 4000),
  photo_path text,
  photo_url text,
  socials jsonb not null default '[]'::jsonb
    check (jsonb_typeof(socials) = 'array' and jsonb_array_length(socials) <= 8),
  updated_at timestamptz not null default now()
);

insert into public.about_content (id) values (1) on conflict (id) do nothing;

alter table public.about_content enable row level security;

drop policy if exists "anyone can read about" on public.about_content;
create policy "anyone can read about"
  on public.about_content for select to anon, authenticated
  using (true);

drop policy if exists "admins can update about" on public.about_content;
create policy "admins can update about"
  on public.about_content for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists about_touch on public.about_content;
create trigger about_touch before update on public.about_content
  for each row execute function public.touch_updated_at();

grant select on public.about_content to anon, authenticated;
grant update on public.about_content to authenticated;

-- The profile photo is stored in the existing "artworks" bucket under about/,
-- which the existing admin-only storage policies already cover.
