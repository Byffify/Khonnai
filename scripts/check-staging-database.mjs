import { openStagingDatabase } from './staging-database.mjs'

let client
try {
  client = await openStagingDatabase()
  const { rows } = await client.query(`select
    current_database() = 'postgres' as expected_database,
    (select ssl from pg_stat_ssl where pid = pg_backend_pid()) as database_observed_tls,
    (select rolcreaterole from pg_roles where rolname=current_user) as can_create_roles,
    (select rolbypassrls from pg_roles where rolname=current_user) as bypassrls,
    exists(select 1 from pg_namespace where nspname='khonnai_app') as foundation_present,
    (select count(*)::int from auth.users) as auth_user_count`)
  console.log(JSON.stringify({ project: 'brwkigtdecywivcfijvq', client_tls_verified: client.connection.stream.encrypted === true && client.connection.stream.authorized === true, ...rows[0], scope: 'Read-only database preflight; database TLS describes pooler-to-database hop, not client-to-pooler TLS' }, null, 2))
} catch (error) {
  console.error(error.message.startsWith('Staging database connection failed') ? error.message : 'Staging database preflight failed. No migration applied.')
  process.exitCode = 1
} finally {
  await client?.end()
}
