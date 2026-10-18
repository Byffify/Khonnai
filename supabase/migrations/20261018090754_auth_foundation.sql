-- Never adopt a pre-existing capability role whose grants or members are unknown.
do $migration$
begin
  if exists (
    select 1 from pg_catalog.pg_roles
    where rolname in ('khonnai_app_runtime', 'khonnai_vault_runtime', 'khonnai_control_runtime')
  ) then
    raise exception 'Khonnai capability role already exists; inspect its privileges before migrating';
  end if;
  if exists (
    select 1 from pg_catalog.pg_namespace
    where nspname in ('khonnai_app', 'khonnai_vault', 'khonnai_control')
  ) then
    raise exception 'Khonnai private schema already exists; inspect migration history';
  end if;
end
$migration$;

create role khonnai_app_runtime nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;
create role khonnai_vault_runtime nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;
create role khonnai_control_runtime nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls;

create schema khonnai_app;
create schema khonnai_vault;
create schema khonnai_control;

revoke all on schema khonnai_app, khonnai_vault, khonnai_control
  from public, anon, authenticated, service_role,
       khonnai_app_runtime, khonnai_vault_runtime, khonnai_control_runtime;

-- Defaults apply to objects created by this migration owner, not every future owner.
-- Do not change the shared migration owner's defaults in unrelated schemas.
-- Schema-local revokes cannot cancel global PUBLIC EXECUTE. Future functions
-- require an explicit revoke before a grant; these schemas have no functions.
alter default privileges in schema khonnai_app, khonnai_vault, khonnai_control
  revoke all on tables from public, anon, authenticated, service_role;
alter default privileges in schema khonnai_app, khonnai_vault, khonnai_control
  revoke all on sequences from public, anon, authenticated, service_role;
alter default privileges in schema khonnai_app, khonnai_vault, khonnai_control
  revoke execute on functions from public, anon, authenticated, service_role;

create table khonnai_app.profiles (
  user_id uuid primary key references auth.users (id),
  display_name text not null default '' check (char_length(display_name) <= 120),
  language text not null default 'th' check (language in ('th', 'en')),
  created_at timestamptz not null default now()
);

create table khonnai_app.shops (
  id uuid primary key,
  owner_user_id uuid not null unique references khonnai_app.profiles (user_id),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  revision bigint not null default 0 check (revision >= 0),
  generation uuid not null,
  created_at timestamptz not null default now(),
  unique (id, owner_user_id)
);

create table khonnai_app.shop_members (
  shop_id uuid not null,
  user_id uuid not null references khonnai_app.profiles (user_id),
  member_role text not null default 'owner' check (member_role = 'owner'),
  created_at timestamptz not null default now(),
  primary key (shop_id, user_id),
  foreign key (shop_id, user_id) references khonnai_app.shops (id, owner_user_id)
);
create index shop_members_user_id_idx on khonnai_app.shop_members (user_id, shop_id);

create table khonnai_vault.sessions (
  session_hash bytea primary key check (octet_length(session_hash) = 32),
  user_id uuid not null references auth.users (id),
  provider_session_id uuid not null,
  csrf_hash bytea not null check (octet_length(csrf_hash) = 32),
  token_ciphertext bytea not null check (octet_length(token_ciphertext) >= 29),
  encryption_key_id text not null check (char_length(encryption_key_id) between 1 and 80),
  refresh_version bigint not null default 0 check (refresh_version >= 0),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  token_expires_at timestamptz not null,
  revoked_at timestamptz,
  check (expires_at > created_at),
  check (token_expires_at > created_at),
  check (revoked_at is null or revoked_at >= created_at)
);
create index sessions_user_id_idx on khonnai_vault.sessions (user_id);
create index sessions_expiry_idx on khonnai_vault.sessions (expires_at);

create table khonnai_control.account_cohorts (
  user_id uuid primary key references auth.users (id),
  cohort text not null check (cohort in ('real', 'demo', 'team', 'test')),
  assigned_at timestamptz not null default now(),
  assignment_reason text not null check (char_length(btrim(assignment_reason)) between 1 and 300)
);
create table khonnai_control.report_admins (
  user_id uuid primary key references auth.users (id),
  granted_at timestamptz not null default now(),
  grant_reason text not null check (char_length(btrim(grant_reason)) between 1 and 300)
);

alter table khonnai_app.profiles enable row level security;
alter table khonnai_app.profiles force row level security;
alter table khonnai_app.shops enable row level security;
alter table khonnai_app.shops force row level security;
alter table khonnai_app.shop_members enable row level security;
alter table khonnai_app.shop_members force row level security;
alter table khonnai_vault.sessions enable row level security;
alter table khonnai_vault.sessions force row level security;
alter table khonnai_control.account_cohorts enable row level security;
alter table khonnai_control.account_cohorts force row level security;
alter table khonnai_control.report_admins enable row level security;
alter table khonnai_control.report_admins force row level security;

-- This claim is installed only by a trusted BFF inside its database transaction.
create policy profile_read on khonnai_app.profiles for select to khonnai_app_runtime
  using (user_id = nullif(current_setting('khonnai.user_id', true), '')::uuid);
create policy profile_update on khonnai_app.profiles for update to khonnai_app_runtime
  using (user_id = nullif(current_setting('khonnai.user_id', true), '')::uuid)
  with check (user_id = nullif(current_setting('khonnai.user_id', true), '')::uuid);
create policy membership_read on khonnai_app.shop_members for select to khonnai_app_runtime
  using (user_id = nullif(current_setting('khonnai.user_id', true), '')::uuid);
create policy shop_read on khonnai_app.shops for select to khonnai_app_runtime
  using (
    owner_user_id = nullif(current_setting('khonnai.user_id', true), '')::uuid
    and exists (select 1 from khonnai_app.shop_members m where m.shop_id = shops.id)
  );
create policy shop_update on khonnai_app.shops for update to khonnai_app_runtime
  using (
    owner_user_id = nullif(current_setting('khonnai.user_id', true), '')::uuid
    and exists (select 1 from khonnai_app.shop_members m where m.shop_id = shops.id)
  )
  with check (
    owner_user_id = nullif(current_setting('khonnai.user_id', true), '')::uuid
    and exists (select 1 from khonnai_app.shop_members m where m.shop_id = shops.id)
  );

create policy vault_server_access on khonnai_vault.sessions for all to khonnai_vault_runtime
  using (true) with check (true);
create policy cohort_server_access on khonnai_control.account_cohorts for all to khonnai_control_runtime
  using (true) with check (true);
create policy report_admin_server_access on khonnai_control.report_admins for all to khonnai_control_runtime
  using (true) with check (true);

revoke all on all tables in schema khonnai_app, khonnai_vault, khonnai_control
  from public, anon, authenticated, service_role,
       khonnai_app_runtime, khonnai_vault_runtime, khonnai_control_runtime;
revoke all on all sequences in schema khonnai_app, khonnai_vault, khonnai_control
  from public, anon, authenticated, service_role,
       khonnai_app_runtime, khonnai_vault_runtime, khonnai_control_runtime;
revoke all on all functions in schema khonnai_app, khonnai_vault, khonnai_control
  from public, anon, authenticated, service_role,
       khonnai_app_runtime, khonnai_vault_runtime, khonnai_control_runtime;

grant usage on schema khonnai_app to khonnai_app_runtime;
grant select on khonnai_app.profiles, khonnai_app.shops, khonnai_app.shop_members to khonnai_app_runtime;
grant update (display_name, language) on khonnai_app.profiles to khonnai_app_runtime;
grant update (name) on khonnai_app.shops to khonnai_app_runtime;
grant usage on schema khonnai_vault to khonnai_vault_runtime;
grant select, insert, update, delete on khonnai_vault.sessions to khonnai_vault_runtime;
grant usage on schema khonnai_control to khonnai_control_runtime;
grant select, insert, update, delete on khonnai_control.account_cohorts, khonnai_control.report_admins
  to khonnai_control_runtime;

