-- Live tracking: the provider taps "I'm on my way", their location is shared with the
-- job's customer until they tap "I've arrived" (or the job closes), then it's deleted.

alter table public.jobs add column if not exists en_route_at timestamptz;
alter table public.jobs add column if not exists arrived_at  timestamptz;

-- One row per job: the provider's latest position. Never kept after arrival.
create table if not exists public.provider_locations (
  job_id      uuid primary key references public.jobs(id) on delete cascade,
  provider_id uuid not null,
  latitude    double precision not null,
  longitude   double precision not null,
  heading     double precision,
  accuracy    double precision,
  updated_at  timestamptz not null default now()
);

alter table public.provider_locations enable row level security;

-- The provider can write their position only while on the way to an accepted job.
drop policy if exists "provider_locations_insert" on public.provider_locations;
create policy "provider_locations_insert" on public.provider_locations
  for insert to authenticated
  with check (
    provider_id = auth.uid()
    and exists (
      select 1 from public.jobs j
      where j.id = provider_locations.job_id
        and j.provider_id = auth.uid()
        and j.status = 'active'
        and j.en_route_at is not null
        and j.arrived_at is null
    )
  );

drop policy if exists "provider_locations_update" on public.provider_locations;
create policy "provider_locations_update" on public.provider_locations
  for update to authenticated
  using (provider_id = auth.uid())
  with check (
    provider_id = auth.uid()
    and exists (
      select 1 from public.jobs j
      where j.id = provider_locations.job_id
        and j.provider_id = auth.uid()
        and j.status = 'active'
        and j.en_route_at is not null
        and j.arrived_at is null
    )
  );

drop policy if exists "provider_locations_delete" on public.provider_locations;
create policy "provider_locations_delete" on public.provider_locations
  for delete to authenticated
  using (provider_id = auth.uid());

-- Only that job's customer (and the provider) can see it, and only while the job is active.
drop policy if exists "provider_locations_select" on public.provider_locations;
create policy "provider_locations_select" on public.provider_locations
  for select to authenticated
  using (
    exists (
      select 1 from public.jobs j
      where j.id = provider_locations.job_id
        and j.status = 'active'
        and auth.uid() in (j.consumer_id, j.provider_id)
    )
  );

-- Notify the customer, and wipe the location as soon as tracking ends.
create or replace function public.on_job_tracking_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.en_route_at is not null and OLD.en_route_at is null then
    insert into notifications (user_id, title, body, type, job_id)
    values (NEW.consumer_id, 'On the way 🚗', NEW.provider_name || ' is on the way for: ' || NEW.title || '. Tap Track to follow them.', 'info', NEW.id);
  end if;

  if NEW.arrived_at is not null and OLD.arrived_at is null then
    insert into notifications (user_id, title, body, type, job_id)
    values (NEW.consumer_id, 'Provider arrived 📍', NEW.provider_name || ' has arrived for: ' || NEW.title || '.', 'success', NEW.id);
  end if;

  if NEW.arrived_at is not null or NEW.status <> 'active' then
    delete from provider_locations where job_id = NEW.id;
  end if;

  return NEW;
end;
$$;

drop trigger if exists on_job_tracking_change on public.jobs;
create trigger on_job_tracking_change
  after update of en_route_at, arrived_at, status on public.jobs
  for each row execute procedure public.on_job_tracking_change();

-- Live position updates for the customer's map.
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'provider_locations') then
    alter publication supabase_realtime add table public.provider_locations;
  end if;
end;
$$;
