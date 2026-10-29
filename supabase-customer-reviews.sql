-- Providers rate customers after a completed job, so problem customers stand out.
-- Plus a safe customer summary for providers (no direct read access to customer profiles).

create table if not exists public.customer_reviews (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null unique references public.jobs(id) on delete cascade,
  provider_id uuid not null,
  consumer_id uuid not null,
  rating      int  not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now()
);

alter table public.customer_reviews enable row level security;

-- A provider can rate the customer once per job, only for their own completed jobs.
drop policy if exists "customer_reviews_provider_insert" on public.customer_reviews;
create policy "customer_reviews_provider_insert" on public.customer_reviews
  for insert to authenticated
  with check (
    provider_id = auth.uid()
    and exists (
      select 1 from public.jobs j
      where j.id = customer_reviews.job_id
        and j.provider_id = auth.uid()
        and j.consumer_id = customer_reviews.consumer_id
        and j.status = 'completed'
    )
  );

-- Providers see the reviews they wrote; customers see reviews about themselves.
-- Other providers see a customer's ratings through get_customer_summary() below.
drop policy if exists "customer_reviews_select_own" on public.customer_reviews;
create policy "customer_reviews_select_own" on public.customer_reviews
  for select to authenticated
  using (provider_id = auth.uid() or consumer_id = auth.uid());

-- Customer details for a provider who has (or had) a job with that customer.
-- Phone number is only shared once the provider has accepted a job from them.
create or replace function public.get_customer_summary(p_consumer_id uuid)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_has_job  boolean;
  v_accepted boolean;
  v_result   json;
begin
  select
    exists (select 1 from jobs where consumer_id = p_consumer_id and provider_id = auth.uid()),
    exists (select 1 from jobs where consumer_id = p_consumer_id and provider_id = auth.uid()
              and status in ('active', 'completed'))
  into v_has_job, v_accepted;

  if not v_has_job then
    return null;
  end if;

  select json_build_object(
    'full_name',      p.full_name,
    'area',           p.area,
    'avatar_url',     p.avatar_url,
    'member_since',   p.created_at,
    'phone',          case when v_accepted then p.phone end,
    'completed_jobs', (select count(*) from jobs where consumer_id = p_consumer_id and status = 'completed'),
    'rating',         (select round(avg(rating)::numeric, 1) from customer_reviews where consumer_id = p_consumer_id),
    'rating_count',   (select count(*) from customer_reviews where consumer_id = p_consumer_id),
    'recent_reviews', coalesce((
      select json_agg(r) from (
        select rating, comment, created_at from customer_reviews
        where consumer_id = p_consumer_id
        order by created_at desc
        limit 3
      ) r
    ), '[]'::json)
  )
  into v_result
  from profiles p
  where p.id = p_consumer_id;

  return v_result;
end;
$$;

revoke all on function public.get_customer_summary(uuid) from public, anon;
grant execute on function public.get_customer_summary(uuid) to authenticated;
