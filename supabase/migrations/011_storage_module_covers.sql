-- Criar bucket de module-covers (se não existir) e políticas públicas de leitura

insert into storage.buckets (id, name, public)
select 'module-covers', 'module-covers', true
where not exists (select 1 from storage.buckets where id = 'module-covers');

-- Permitir upload/gerenciamento por usuários autenticados (admins)
create policy if not exists "module-covers-insert-authenticated" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'module-covers'
  );

create policy if not exists "module-covers-update-authenticated" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'module-covers'
  );

create policy if not exists "module-covers-delete-authenticated" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'module-covers'
  );

create policy if not exists "module-covers-select-public" on storage.objects
  for select to public
  using (bucket_id = 'module-covers');

