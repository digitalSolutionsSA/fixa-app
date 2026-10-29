-- In-app chat between customer and provider, one conversation per job.
--  * Messages can only be SENT while the job is accepted (status = 'active').
--  * After the job closes (completed / cancelled / declined) the chat is read-only,
--    kept for 30 days, then deleted by a nightly job.

-- When did the job stop being active? Drives the 30-day retention.
alter table public.jobs add column if not exists closed_at timestamptz;

create or replace function public.set_job_closed_at()
returns trigger
language plpgsql
as $$
begin
  if NEW.status in ('completed', 'cancelled', 'declined') and OLD.status is distinct from NEW.status then
    NEW.closed_at := now();
  elsif NEW.status in ('pending', 'active') then
    NEW.closed_at := null;
  end if;
  return NEW;
end;
$$;

drop trigger if exists jobs_set_closed_at on public.jobs;
create trigger jobs_set_closed_at
  before update of status on public.jobs
  for each row execute procedure public.set_job_closed_at();

-- Backfill jobs that were already closed.
update public.jobs set closed_at = updated_at
where closed_at is null and status in ('completed', 'cancelled', 'declined');

-- Messages
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  job_id     uuid not null references public.jobs(id) on delete cascade,
  sender_id  uuid not null,
  body       text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists messages_job_created_idx on public.messages (job_id, created_at);

alter table public.messages enable row level security;

-- Only the job's customer and provider can read its messages.
drop policy if exists "messages_select_participants" on public.messages;
create policy "messages_select_participants" on public.messages
  for select to authenticated
  using (
    exists (
      select 1 from public.jobs j
      where j.id = messages.job_id
        and auth.uid() in (j.consumer_id, j.provider_id)
    )
  );

-- Only while the job is accepted, and only as yourself.
drop policy if exists "messages_insert_active_job" on public.messages;
create policy "messages_insert_active_job" on public.messages
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.jobs j
      where j.id = messages.job_id
        and j.status = 'active'
        and auth.uid() in (j.consumer_id, j.provider_id)
    )
  );
-- No update/delete policies: messages can't be edited or removed by users.

-- Notify the other person (one unread "New message" notification per job at a time).
create or replace function public.notify_on_new_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job       jobs%rowtype;
  v_recipient uuid;
  v_sender    text;
begin
  select * into v_job from jobs where id = NEW.job_id;
  if v_job.id is null then return NEW; end if;

  if NEW.sender_id = v_job.consumer_id then
    v_recipient := v_job.provider_id;
    v_sender    := v_job.consumer_name;
  else
    v_recipient := v_job.consumer_id;
    v_sender    := v_job.provider_name;
  end if;

  if not exists (
    select 1 from notifications
    where user_id = v_recipient and job_id = NEW.job_id and read = false and title = 'New message 💬'
  ) then
    insert into notifications (user_id, title, body, type, job_id)
    values (v_recipient, 'New message 💬', v_sender || ' sent you a message about: ' || v_job.title || '.', 'info', NEW.job_id);
  end if;

  return NEW;
end;
$$;

drop trigger if exists on_new_message on public.messages;
create trigger on_new_message
  after insert on public.messages
  for each row execute procedure public.notify_on_new_message();

-- Live updates for chat and for the notification badge.
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'notifications') then
    alter publication supabase_realtime add table public.notifications;
  end if;
end;
$$;

-- 30-day retention: delete chats of jobs closed more than 30 days ago, every night at 02:15.
create or replace function public.purge_old_job_messages()
returns void
language sql
security definer
set search_path = public
as $$
  delete from messages m
  using jobs j
  where m.job_id = j.id
    and j.closed_at is not null
    and j.closed_at < now() - interval '30 days';
$$;

revoke all on function public.purge_old_job_messages() from public, anon, authenticated;

create extension if not exists pg_cron;

select cron.unschedule(jobid) from cron.job where jobname = 'purge-old-job-messages';
select cron.schedule('purge-old-job-messages', '15 2 * * *', 'select public.purge_old_job_messages()');
