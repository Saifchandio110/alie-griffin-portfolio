-- =====================================================================
-- Alie Griffin portfolio: database, storage and Row Level Security
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Safe to re-run.
-- =====================================================================

-- 1. Admins ------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;

drop policy if exists "admins can read their own row" on public.admins;
create policy "admins can read their own row"
  on public.admins for select to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 2. Portfolio settings (exactly one row) ------------------------------
create table if not exists public.portfolio_settings (
  id integer primary key default 1 check (id = 1),
  portfolio_name text not null default 'Alie Griffin'
    check (char_length(btrim(portfolio_name)) between 1 and 60),
  updated_at timestamptz not null default now()
);
insert into public.portfolio_settings (id, portfolio_name)
values (1, 'Alie Griffin')
on conflict (id) do nothing;

alter table public.portfolio_settings enable row level security;

drop policy if exists "anyone can read settings" on public.portfolio_settings;
create policy "anyone can read settings"
  on public.portfolio_settings for select to anon, authenticated
  using (true);

drop policy if exists "admins can update settings" on public.portfolio_settings;
create policy "admins can update settings"
  on public.portfolio_settings for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 3. Artworks ----------------------------------------------------------
create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  description text not null default '' check (char_length(description) <= 2000),
  category text not null default 'illustration'
    check (category in ('illustration', 'painting', 'character', 'sketch', 'other')),
  image_path text not null,
  image_url text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists artworks_published_created_idx
  on public.artworks (is_published, created_at desc);

alter table public.artworks enable row level security;

drop policy if exists "public can read published artworks" on public.artworks;
create policy "public can read published artworks"
  on public.artworks for select to anon, authenticated
  using (is_published = true);

drop policy if exists "admins can read all artworks" on public.artworks;
create policy "admins can read all artworks"
  on public.artworks for select to authenticated
  using (public.is_admin());

drop policy if exists "admins can insert artworks" on public.artworks;
create policy "admins can insert artworks"
  on public.artworks for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admins can update artworks" on public.artworks;
create policy "admins can update artworks"
  on public.artworks for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins can delete artworks" on public.artworks;
create policy "admins can delete artworks"
  on public.artworks for delete to authenticated
  using (public.is_admin());

-- 4. Keep updated_at fresh ---------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists artworks_touch on public.artworks;
create trigger artworks_touch before update on public.artworks
  for each row execute function public.touch_updated_at();

drop trigger if exists settings_touch on public.portfolio_settings;
create trigger settings_touch before update on public.portfolio_settings
  for each row execute function public.touch_updated_at();

-- 5. Table permissions (RLS above decides which rows) -------------------
grant select on public.portfolio_settings to anon, authenticated;
grant update on public.portfolio_settings to authenticated;
grant select on public.artworks to anon, authenticated;
grant insert, update, delete on public.artworks to authenticated;
grant select on public.admins to authenticated;

-- 6. Storage bucket for artwork images ---------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'artworks', 'artworks', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admins can read artwork files" on storage.objects;
create policy "admins can read artwork files"
  on storage.objects for select to authenticated
  using (bucket_id = 'artworks' and public.is_admin());

drop policy if exists "admins can upload artwork files" on storage.objects;
create policy "admins can upload artwork files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'artworks' and public.is_admin());

drop policy if exists "admins can update artwork files" on storage.objects;
create policy "admins can update artwork files"
  on storage.objects for update to authenticated
  using (bucket_id = 'artworks' and public.is_admin())
  with check (bucket_id = 'artworks' and public.is_admin());

drop policy if exists "admins can delete artwork files" on storage.objects;
create policy "admins can delete artwork files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'artworks' and public.is_admin());
