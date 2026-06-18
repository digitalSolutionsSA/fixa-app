-- ============================================================
-- FIXA APP — Supabase Schema
-- Run this in the Supabase SQL Editor (once)
-- ============================================================

-- ── 1. Extend profiles table ──────────────────────────────
alter table profiles
  add column if not exists available boolean default true,
  add column if not exists rating    numeric(3,1) default 0,
  add column if not exists job_count int default 0;

-- ── 2. Jobs table ─────────────────────────────────────────
create table if not exists jobs (
  id             uuid primary key default gen_random_uuid(),
  consumer_id    uuid not null,
  provider_id    uuid not null,
  consumer_name  text not null default '',
  provider_name  text not null default '',
  provider_trade text not null default '',
  title          text not null,
  description    text not null default '',
  location       text not null default '',
  price          numeric not null default 0,
  status         text not null default 'pending'
                   check (status in ('pending','active','completed','declined','cancelled')),
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

alter table jobs enable row level security;

-- Consumers see their own jobs; providers see theirs
create policy "jobs_consumer_select" on jobs
  for select using (consumer_id = auth.uid());

create policy "jobs_provider_select" on jobs
  for select using (provider_id = auth.uid());

-- Only the consumer can create a job for themselves
create policy "jobs_consumer_insert" on jobs
  for insert with check (consumer_id = auth.uid());

-- Either party can update (app-level logic controls what changes)
create policy "jobs_update" on jobs
  for update using (provider_id = auth.uid() or consumer_id = auth.uid());

-- ── 3. Reviews table ──────────────────────────────────────
create table if not exists reviews (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null unique,
  consumer_id uuid not null,
  provider_id uuid not null,
  rating      numeric(2,1) not null check (rating between 1 and 5),
  comment     text not null default '',
  created_at  timestamptz default now()
);

alter table reviews enable row level security;

create policy "reviews_consumer_insert" on reviews
  for insert with check (consumer_id = auth.uid());

create policy "reviews_select_all" on reviews
  for select using (true);

-- ── 4. Trigger: update provider rating + job_count after review ──
create or replace function update_provider_stats()
returns trigger language plpgsql security definer as $$
declare
  avg_rating numeric;
  total_jobs int;
begin
  select avg(rating) into avg_rating
    from reviews where provider_id = NEW.provider_id;

  select count(*) into total_jobs
    from jobs where provider_id = NEW.provider_id and status = 'completed';

  update profiles
    set rating    = round(avg_rating::numeric, 1),
        job_count = total_jobs
  where id = NEW.provider_id;

  return NEW;
end;
$$;

drop trigger if exists on_review_created on reviews;
create trigger on_review_created
  after insert on reviews
  for each row execute procedure update_provider_stats();
