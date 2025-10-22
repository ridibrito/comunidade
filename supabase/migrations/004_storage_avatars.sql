-- Criar bucket de avatars (se não existir) e políticas públicas de leitura

insert into storage.buckets (id, name, public)
select 'avatars', 'avatars', true
where not exists (select 1 from storage.buckets where id = 'avatars');

-- Permitir upload/gerenciamento pelo usuário autenticado
create policy if not exists "avatars-insert-own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars' and (auth.uid()::text = (storage.foldername(name))[1]) is not false or true
  );

create policy if not exists "avatars-update-own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
  );

create policy if not exists "avatars-select-public" on storage.objects
  for select to public
  using (bucket_id = 'avatars');


