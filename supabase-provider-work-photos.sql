-- Up to 5 "previous work" photos per provider, shown to customers.
-- Public bucket (portfolio photos are meant to be seen); providers can only write their own folder.
-- Objects live at "<provider_id>/<uuid>.jpg"; profiles.work_photos holds those paths.

alter table public.profiles add column if not exists work_photos text[] not null default '{}';
alter table public.profiles drop constraint if exists profiles_work_photos_max_5;
alter table public.profiles add constraint profiles_work_photos_max_5 check (cardinality(work_photos) <= 5);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('provider-work', 'provider-work', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "provider_work_insert_own" on storage.objects;
create policy "provider_work_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'provider-work' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "provider_work_delete_own" on storage.objects;
create policy "provider_work_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'provider-work' and (storage.foldername(name))[1] = auth.uid()::text);
