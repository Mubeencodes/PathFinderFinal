-- Enable required extensions
create extension if not exists pgcrypto;

-- Profiles table linked to Supabase Auth users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  email text unique,
  fullname text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reports table
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sessions table
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_profiles_updated_at'
  ) then
    create trigger trg_profiles_updated_at
    before update on public.profiles
    for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'trg_reports_updated_at'
  ) then
    create trigger trg_reports_updated_at
    before update on public.reports
    for each row execute function public.set_updated_at();
  end if;
end $$;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.sessions enable row level security;

-- Policies: profiles
create policy if not exists "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy if not exists "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy if not exists "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Policies: reports
create policy if not exists "reports_select_own" on public.reports
  for select using (auth.uid() = user_id);

create policy if not exists "reports_insert_own" on public.reports
  for insert with check (auth.uid() = user_id);

create policy if not exists "reports_update_own" on public.reports
  for update using (auth.uid() = user_id);

create policy if not exists "reports_delete_own" on public.reports
  for delete using (auth.uid() = user_id);

-- Policies: sessions
create policy if not exists "sessions_select_own" on public.sessions
  for select using (auth.uid() = user_id);

create policy if not exists "sessions_insert_own" on public.sessions
  for insert with check (auth.uid() = user_id);

create policy if not exists "sessions_update_own" on public.sessions
  for update using (auth.uid() = user_id);

create policy if not exists "sessions_delete_own" on public.sessions
  for delete using (auth.uid() = user_id);

-- Realtime publication
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.reports;
alter publication supabase_realtime add table public.sessions;


