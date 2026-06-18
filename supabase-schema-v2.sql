-- ============================================================
-- FIXA APP — Schema v2 (run after supabase-schema.sql)
-- ============================================================

-- ── 1. Trusted contact fields on profiles ────────────────
alter table profiles
  add column if not exists trusted_contact_name         text default '',
  add column if not exists trusted_contact_phone        text default '',
  add column if not exists trusted_contact_relationship text default '',
  add column if not exists price_from                   numeric default 0;

-- ── 2. Panic events log ───────────────────────────────────
create table if not exists panic_events (
  id                   uuid        primary key default gen_random_uuid(),
  user_id              uuid        not null,
  user_name            text        not null default '',
  location_area        text        not null default '',
  trusted_contact_name text        not null default '',
  trusted_contact_phone text       not null default '',
  job_id               uuid,
  created_at           timestamptz default now()
);

alter table panic_events enable row level security;

create policy "panic_insert" on panic_events
  for insert with check (user_id = auth.uid());

create policy "panic_select_own" on panic_events
  for select using (user_id = auth.uid());

-- ── 3. In-app notifications ───────────────────────────────
create table if not exists notifications (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null,
  title      text        not null,
  body       text        not null default '',
  type       text        not null default 'info',
  read       boolean     not null default false,
  job_id     uuid,
  created_at timestamptz default now()
);

alter table notifications enable row level security;

create policy "notif_select_own" on notifications
  for select using (user_id = auth.uid());

create policy "notif_update_own" on notifications
  for update using (user_id = auth.uid());

create policy "notif_insert" on notifications
  for insert with check (auth.uid() is not null);

-- ── 4. Trigger: auto-notify on job changes ────────────────
create or replace function notify_on_job_change()
returns trigger language plpgsql security definer as $$
begin
  -- New job created → notify provider
  if TG_OP = 'INSERT' then
    insert into notifications (user_id, title, body, type, job_id)
    values (
      NEW.provider_id,
      'New Job Request 🔔',
      NEW.consumer_name || ' needs help with: ' || NEW.title || ' in ' || NEW.location || '.',
      'info',
      NEW.id
    );
    return NEW;
  end if;

  -- Provider accepts → notify consumer
  if NEW.status = 'active' and OLD.status = 'pending' then
    insert into notifications (user_id, title, body, type, job_id)
    values (
      NEW.consumer_id,
      'Job Accepted! 🎉',
      NEW.provider_name || ' accepted your request for: ' || NEW.title || '.',
      'success',
      NEW.id
    );
  end if;

  -- Provider declines → notify consumer
  if NEW.status = 'declined' and OLD.status = 'pending' then
    insert into notifications (user_id, title, body, type, job_id)
    values (
      NEW.consumer_id,
      'Job Declined',
      NEW.provider_name || ' is unavailable. Try another provider.',
      'warning',
      NEW.id
    );
  end if;

  -- Job completed → notify consumer
  if NEW.status = 'completed' and OLD.status = 'active' then
    insert into notifications (user_id, title, body, type, job_id)
    values (
      NEW.consumer_id,
      'Job Complete ✅',
      NEW.title || ' is done. Please leave a review for ' || NEW.provider_name || '.',
      'info',
      NEW.id
    );
  end if;

  return NEW;
end;
$$;

drop trigger if exists on_job_change on jobs;
create trigger on_job_change
  after insert or update on jobs
  for each row execute procedure notify_on_job_change();
