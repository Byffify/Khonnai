\set ON_ERROR_STOP on
begin;

do $test$
begin
  if current_setting('khonnai.test_database', true) is distinct from 'isolated' then
    raise exception 'Run only in an isolated disposable database with khonnai.test_database=isolated';
  end if;
  if not exists (
    select 1 from pg_catalog.pg_roles
    where rolname = current_user and (rolbypassrls or rolsuper)
  ) then
    raise exception 'Fixture connection needs BYPASSRLS or superuser; FORCE RLS blocks owner fixtures otherwise';
  end if;
  if exists (
    select 1 from pg_catalog.pg_roles
    where rolname in ('khonnai_app_runtime', 'khonnai_vault_runtime', 'khonnai_control_runtime')
      and (rolcanlogin or rolbypassrls or rolsuper or rolcreaterole or rolcreatedb or rolreplication)
  ) then raise exception 'Capability roles have excess attributes'; end if;
  if (select count(*) from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid = c.relnamespace
      where n.nspname in ('khonnai_app', 'khonnai_vault', 'khonnai_control')
        and c.relname in ('profiles','shops','shop_members','sessions','account_cohorts','report_admins')
        and c.relkind = 'r' and c.relrowsecurity and c.relforcerowsecurity) <> 6 then
    raise exception 'Every foundation table must enforce RLS';
  end if;
  if exists (
    select 1 from pg_catalog.pg_roles r
    cross join (values ('khonnai_app'), ('khonnai_vault'), ('khonnai_control')) s(name)
    where r.rolname in ('anon', 'authenticated', 'service_role')
      and has_schema_privilege(r.rolname, s.name, 'USAGE')
  ) then raise exception 'Data API roles can reach private schemas'; end if;
  if pg_has_role('khonnai_app_runtime', 'khonnai_vault_runtime', 'MEMBER')
    or pg_has_role('khonnai_app_runtime', 'khonnai_control_runtime', 'MEMBER')
    or pg_has_role('khonnai_vault_runtime', 'khonnai_app_runtime', 'MEMBER') then
    raise exception 'Capability roles must remain separate';
  end if;
end
$test$;

insert into auth.users (id, aud, role, email) values
  ('10000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'foundation-a@example.invalid'),
  ('10000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'foundation-b@example.invalid');
insert into khonnai_app.profiles (user_id, display_name) values
  ('10000000-0000-0000-0000-000000000001', 'A'),
  ('10000000-0000-0000-0000-000000000002', 'B');
insert into khonnai_app.shops (id, owner_user_id, name, generation) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Shop A', '30000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Shop B', '30000000-0000-0000-0000-000000000002');
insert into khonnai_app.shop_members (shop_id, user_id) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002');

do $test$
begin
  begin
    insert into khonnai_app.shop_members (shop_id, user_id) values
      ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002');
    raise exception 'Non-owner membership accepted';
  exception when foreign_key_violation then null; end;
end
$test$;

set local role khonnai_app_runtime;
select set_config('khonnai.user_id', '', true);
do $test$
begin
  if exists (select 1 from khonnai_app.shops) or exists (select 1 from khonnai_app.profiles)
    or exists (select 1 from khonnai_app.shop_members) then
    raise exception 'Missing identity can see records';
  end if;
end
$test$;

select set_config('khonnai.user_id', '10000000-0000-0000-0000-000000000001', true);
do $test$
declare affected integer;
begin
  if (select count(*) from khonnai_app.shops) <> 1
    or (select name from khonnai_app.shops) <> 'Shop A'
    or (select count(*) from khonnai_app.profiles) <> 1
    or (select count(*) from khonnai_app.shop_members) <> 1 then
    raise exception 'Identity A visibility is incorrect';
  end if;
  update khonnai_app.shops set name = 'A updated'
    where id = '20000000-0000-0000-0000-000000000001';
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Own shop update failed'; end if;
  update khonnai_app.shops set name = 'Stolen'
    where id = '20000000-0000-0000-0000-000000000002';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Cross-shop update succeeded'; end if;
  update khonnai_app.profiles set display_name = 'Changed', language = 'en';
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Profile update is not isolated'; end if;
  begin
    update khonnai_app.shops set owner_user_id = '10000000-0000-0000-0000-000000000001';
    raise exception 'Ownership column is writable';
  exception when insufficient_privilege then null; end;
  begin
    insert into khonnai_app.shop_members (shop_id, user_id) values
      ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001');
    raise exception 'App can create membership';
  exception when insufficient_privilege then null; end;
  begin
    delete from khonnai_app.shop_members;
    raise exception 'App can delete membership';
  exception when insufficient_privilege then null; end;
  begin
    perform 1 from khonnai_vault.sessions;
    raise exception 'App can read token vault';
  exception when insufficient_privilege then null; end;
  begin
    insert into khonnai_control.report_admins (user_id, grant_reason)
      values ('10000000-0000-0000-0000-000000000001', 'Self-promotion');
    raise exception 'App can promote itself';
  exception when insufficient_privilege then null; end;
  begin
    perform 1 from khonnai_control.account_cohorts;
    raise exception 'App can read cohort records';
  exception when insufficient_privilege then null; end;
end
$test$;

select set_config('khonnai.user_id', '10000000-0000-0000-0000-000000000002', true);
do $test$
begin
  if (select count(*) from khonnai_app.shops) <> 1
    or (select name from khonnai_app.shops) <> 'Shop B'
    or (select display_name from khonnai_app.profiles) <> 'B' then
    raise exception 'Identity B visibility is incorrect after switching transaction context';
  end if;
end
$test$;
reset role;

set local role khonnai_vault_runtime;
insert into khonnai_vault.sessions (
  session_hash, user_id, provider_session_id, csrf_hash, token_ciphertext,
  encryption_key_id, expires_at, token_expires_at
) values (
  decode(repeat('01', 32), 'hex'), '10000000-0000-0000-0000-000000000001',
  '40000000-0000-0000-0000-000000000001', decode(repeat('02', 32), 'hex'),
  decode(repeat('03', 40), 'hex'), 'test-envelope-only', now() + interval '1 day', now() + interval '1 hour'
);
do $test$
begin
  if not exists (select 1 from khonnai_vault.sessions where refresh_version = 0) then
    raise exception 'Vault role cannot manage sessions';
  end if;
  begin
    perform 1 from khonnai_app.shops;
    raise exception 'Vault role can read business records';
  exception when insufficient_privilege then null; end;
  begin
    perform 1 from khonnai_control.report_admins;
    raise exception 'Vault role can read administrators';
  exception when insufficient_privilege then null; end;
end
$test$;
reset role;

set local role khonnai_control_runtime;
insert into khonnai_control.account_cohorts (user_id, cohort, assignment_reason)
  values ('10000000-0000-0000-0000-000000000001', 'test', 'Isolated database fixture');
do $test$
begin
  if not exists (select 1 from khonnai_control.account_cohorts where cohort = 'test') then
    raise exception 'Control role cannot manage cohorts';
  end if;
  begin
    perform 1 from khonnai_app.shops;
    raise exception 'Control role can read business records';
  exception when insufficient_privilege then null; end;
  begin
    perform 1 from khonnai_vault.sessions;
    raise exception 'Control role can read token vault';
  exception when insufficient_privilege then null; end;
end
$test$;
reset role;

set local role authenticated;
do $test$
begin
  begin
    perform 1 from khonnai_app.shops;
    raise exception 'Data API authenticated role can read shops';
  exception when insufficient_privilege then null; end;
end
$test$;
reset role;

rollback;
select 'auth_foundation assertions completed; all fixtures rolled back' as result;
