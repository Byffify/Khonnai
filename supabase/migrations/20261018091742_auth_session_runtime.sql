-- Single-owner onboarding is performed by the verified BFF transaction.
create policy profile_create on khonnai_app.profiles for insert to khonnai_app_runtime
  with check (user_id = nullif(current_setting('khonnai.user_id', true), '')::uuid);
drop policy shop_read on khonnai_app.shops;
create policy shop_read on khonnai_app.shops for select to khonnai_app_runtime
  using (owner_user_id = nullif(current_setting('khonnai.user_id', true), '')::uuid);
create policy shop_create on khonnai_app.shops for insert to khonnai_app_runtime
  with check (owner_user_id = nullif(current_setting('khonnai.user_id', true), '')::uuid);
create policy membership_create on khonnai_app.shop_members for insert to khonnai_app_runtime
  with check (
    user_id = nullif(current_setting('khonnai.user_id', true), '')::uuid
    and exists (select 1 from khonnai_app.shops s where s.id = shop_id and s.owner_user_id = user_id)
  );
grant insert (user_id) on khonnai_app.profiles to khonnai_app_runtime;
grant insert (id, owner_user_id, name, generation) on khonnai_app.shops to khonnai_app_runtime;
grant insert (shop_id, user_id) on khonnai_app.shop_members to khonnai_app_runtime;

-- Token validity is checked against actual provider sessions, not JWT age alone.
grant usage on schema auth to khonnai_vault_runtime;
grant select (id, user_id, not_after) on auth.sessions to khonnai_vault_runtime;

create table khonnai_vault.auth_attempts (
  key_hash bytea not null check (octet_length(key_hash) = 32),
  window_start timestamptz not null,
  hits integer not null default 1 check (hits > 0),
  primary key (key_hash, window_start)
);
alter table khonnai_vault.auth_attempts enable row level security;
alter table khonnai_vault.auth_attempts force row level security;
revoke all on khonnai_vault.auth_attempts from public, anon, authenticated, service_role;
create policy auth_attempt_server_access on khonnai_vault.auth_attempts for all to khonnai_vault_runtime
  using (true) with check (true);
grant select, insert, update, delete on khonnai_vault.auth_attempts to khonnai_vault_runtime;
