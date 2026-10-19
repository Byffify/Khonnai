import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { openStagingDatabase } from './staging-database.mjs'

const migrationPath = 'supabase/migrations/20261018090754_auth_foundation.sql'
let client
let stage = 'connection'
const installed = process.argv.length === 3 && process.argv[2] === '--installed'
try {
  if (process.argv.length !== (installed ? 3 : 2)) throw new Error('Unsupported invocation')
  client = await openStagingDatabase()
  const { rows: [state] } = await client.query(`select
    (select count(*)::int from auth.users) as users,
    exists(select 1 from pg_namespace where nspname='khonnai_app') as installed`)
  if (state.users !== 0 || state.installed !== installed) throw new Error('TARGET_NOT_EMPTY_OR_WRONG_MODE')
  const migration = await readFile(migrationPath, 'utf8')
  const body = migration.trim().replace(/^begin;/i, '').replace(/commit;$/i, '')
  // psql directives and transaction controls are removed only from our fixed,
  // reviewed fixture. The outer transaction always rolls back all its objects.
  const test = (await readFile('supabase/tests/auth_foundation.sql', 'utf8'))
    .replace(/^\\set ON_ERROR_STOP on\r?\n/, '')
    .replace(/^begin;/m, '').replace(/^rollback;/m, '')
  await client.query('begin')
  await client.query("select set_config('khonnai.test_database','isolated',true)")
  stage = 'migration-dry-run'
  if (!installed) await client.query(body)
  // Supabase's migration role is not a superuser. Grant SET ROLE capability
  // only inside this rolled-back test transaction; never to an app login.
  await client.query('grant khonnai_app_runtime, khonnai_vault_runtime, khonnai_control_runtime to current_user')
  stage = 'rls-fixtures'
  await client.query(test)
  await client.query('rollback')
  stage = 'rollback-verification'
  const { rows: [after] } = await client.query(`select
    (select count(*)::int from auth.users) as users,
    exists(select 1 from pg_namespace where nspname='khonnai_app') as installed,
    exists(select 1 from pg_roles where rolname='khonnai_app_runtime') as role_present`)
  if (after.users !== 0 || after.installed !== installed || after.role_present !== installed) throw new Error('ROLLBACK_CHECK_FAILED')
  const report = {
    checkedAt: new Date().toISOString(), project: 'brwkigtdecywivcfijvq',
    migrationPath, sha256: createHash('sha256').update(migration).digest('hex'),
    clientTlsVerified: client.connection.stream.authorized === true,
    sqlAssertionsPassed: true, installedSchema: installed, rolledBack: true, remainingAuthUsers: after.users,
    scope: 'Real staging SQL role/RLS fixtures in one rolled-back transaction. No browser login, email, encryption implementation or inventory tests.',
  }
  await mkdir('outputs/auth-staging', { recursive: true })
  await writeFile(`outputs/auth-staging/foundation-${installed ? 'installed-tests' : 'dry-run'}.json`, JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
} catch (error) {
  await client?.query('rollback').catch(() => {})
  const code = /^[0-9A-Z_]{5,32}$/.test(error.code ?? '') ? error.code : 'CHECK_FAILED'
  console.error(`Foundation verification failed at ${stage} (${code}). No migration committed.`)
  if (error.code === '42501' && /^permission denied (for|to) [a-z_ ."]+$/i.test(error.message)) console.error(error.message)
  process.exitCode = 1
} finally {
  await client?.end()
}
