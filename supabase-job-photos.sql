-- Up to 3 photos per job request, stored in a private bucket.
-- Objects live at "<consumer_id>/<uuid>.jpg"; jobs.photos holds those paths.

alter table public.jobs add column if not exists photos text[] not null default '{}';
alter table public.jobs drop constraint if exists jobs_photos_max_3;
alter table public.jobs add constraint jobs_photos_max_3 check (cardinality(photos) <= 3);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('job-photos', 'job-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Customers upload into their own folder only.
drop policy if exists "job_photos_insert_own" on storage.objects;
create policy "job_photos_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'job-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Customers can remove their own uploads (e.g. after a failed request).
drop policy if exists "job_photos_delete_own" on storage.objects;
create policy "job_photos_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'job-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Readable by the uploader, and by the provider of any job that references the photo.
drop policy if exists "job_photos_select" on storage.objects;
create policy "job_photos_select" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'job-photos' and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1 from public.jobs j
        where storage.objects.name = any (j.photos)
          and (j.provider_id = auth.uid() or j.consumer_id = auth.uid())
      )
    )
  );
