import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { parseEnv } from 'node:util'
import { openStagingDatabase, parseDatabaseConfig } from './staging-database.mjs'

// No shell, no secrets in console output or report. CLI output is captured
// because provider errors can contain the full connection string.
const migrationPath = 'supabase/migrations/20261018090754_auth_foundation.sql'
const version = '20261018090754'
let client
try {
  if (process.argv.length !== 2 || process.platform !== 'win32') throw new Error('Unsupported invocation')
  const raw = await readFile('.env.staging.local', 'utf8')
  parseDatabaseConfig(raw)
  const proof = JSON.parse(await readFile('outputs/auth-staging/foundation-dry-run.json', 'utf8'))
  const sql = await readFile(migrationPath, 'utf8')
  const sha256 = createHash('sha256').update(sql).digest('hex')
  if (!proof.sqlAssertionsPassed || !proof.rolledBack || proof.sha256 !== sha256) throw new Error('Run SQL verification first')
  client = await openStagingDatabase()
  const { rows: [before] } = await client.query("select count(*)::int as users from auth.users")
  if (before.users !== 0) throw new Error('Expected empty staging account set')
  await client.end()
  client = undefined
  const uri = new URL(parseEnv(raw).SUPABASE_MIGRATION_DATABASE_URL)
  uri.searchParams.set('sslmode', 'verify-full')
  uri.searchParams.set('sslrootcert', resolve('supabase/certs/prod-ca-2021.crt'))
  const executable = resolve('node_modules/@supabase/cli-windows-x64/bin/supabase.exe')
  const args = ['db', 'push', '--db-url', uri.href, '--skip-vault', '--yes']
  await promisify(execFile)(executable, [...args, '--dry-run'], { timeout: 60_000, windowsHide: true })
  await promisify(execFile)(executable, args, { timeout: 60_000, windowsHide: true })
  client = await openStagingDatabase()
  const { rows: [after] } = await client.query(`select
    exists(select 1 from supabase_migrations.schema_migrations where version=$1) as recorded,
    (select count(*)::int from pg_class c join pg_namespace n on n.oid=c.relnamespace
     where n.nspname in ('khonnai_app','khonnai_vault','khonnai_control')
     and c.relname in ('profiles','shops','shop_members','sessions','account_cohorts','report_admins')
     and c.relkind='r' and c.relrowsecurity and c.relforcerowsecurity) as rls_tables,
    (select count(*)::int from auth.users) as auth_users`, [version])
  if (!after.recorded || after.rls_tables !== 6 || after.auth_users !== 0) throw new Error('Post migration verification failed')
  const report = { checkedAt: new Date().toISOString(), project: 'brwkigtdecywivcfijvq', version, sha256, ...after,
    scope: 'Foundation applied via pinned CLI with migration history. No runtime login, inventory import or production deployment.' }
  await writeFile('outputs/auth-staging/foundation-applied.json', JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
} catch {
  console.error('Staging migration did not complete verification. CLI details withheld to protect credentials. Check database state before retrying.')
  process.exitCode = 1
} finally {
  await client?.end()
}
