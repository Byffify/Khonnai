import { readFile, writeFile } from 'node:fs/promises'
import { randomBytes } from 'node:crypto'
import { promisify, parseEnv } from 'node:util'
import { execFile } from 'node:child_process'
import { resolve } from 'node:path'
import { openStagingDatabase, parseDatabaseConfig } from './staging-database.mjs'

let db
let stage = 'configuration'
try {
  if (process.argv.length !== 2) throw new Error('Unsupported invocation')
  let raw = await readFile('.env.staging.local', 'utf8')
  parseDatabaseConfig(raw)
  let env = parseEnv(raw)
  const credentials = [
    ['khonnai_bff_app', 'khonnai_app_runtime', 'AUTH_APP_DATABASE_URL'],
    ['khonnai_bff_vault', 'khonnai_vault_runtime', 'AUTH_VAULT_DATABASE_URL'],
    ['khonnai_bff_control', 'khonnai_control_runtime', 'AUTH_CONTROL_DATABASE_URL'],
  ]
  let additions = '\n# Scoped local staging BFF credentials. Never expose through VITE_.\n'
  for (const [login, , name] of credentials) {
    if (env[name]) continue
    const uri = new URL(env.SUPABASE_MIGRATION_DATABASE_URL)
    uri.username = uri.hostname.includes('.pooler.') ? `${login}.brwkigtdecywivcfijvq` : login
    uri.password = randomBytes(32).toString('hex')
    additions += `${name}=${uri.href}\n`
  }
  for (const name of ['AUTH_SESSION_KEY', 'AUTH_RATE_KEY']) if (!env[name]) additions += `${name}=${randomBytes(32).toString('hex')}\n`
  if (!env.AUTH_ORIGIN) additions += 'AUTH_ORIGIN=http://127.0.0.1:5293\n'
  raw += additions
  // Persist generated credentials BEFORE provisioning so an interrupted process
  // can retry without rotating or losing an already-created database password.
  await writeFile('.env.staging.local', raw)
  env = parseEnv(raw)
  db = await openStagingDatabase()
  const migration = await readFile('supabase/migrations/20261018091742_auth_session_runtime.sql', 'utf8')
  const { rows: [exists] } = await db.query("select exists(select 1 from supabase_migrations.schema_migrations where version='20261018091742') as installed")
  if (!exists.installed) {
    stage = 'sql-dry-run'
    await db.query('begin')
    await db.query(migration)
    await db.query('rollback')
    const uri = new URL(env.SUPABASE_MIGRATION_DATABASE_URL)
    uri.searchParams.set('sslmode', 'verify-full')
    uri.searchParams.set('sslrootcert', resolve('supabase/certs/prod-ca-2021.crt'))
    stage = 'migration'
    await promisify(execFile)(resolve('node_modules/@supabase/cli-windows-x64/bin/supabase.exe'), ['db', 'push', '--db-url', uri.href, '--skip-vault', '--yes'], { windowsHide: true, timeout: 60_000 })
  }
  const { rows: [boundary] } = await db.query("select exists(select 1 from supabase_migrations.schema_migrations where version='20261018092721') as installed")
  if (!boundary.installed) {
    stage = 'provider-boundary-dry-run'
    await db.query('begin')
    await db.query(await readFile('supabase/migrations/20261018092721_auth_provider_session_boundary.sql', 'utf8'))
    await db.query('rollback')
    const uri = new URL(env.SUPABASE_MIGRATION_DATABASE_URL)
    uri.searchParams.set('sslmode', 'verify-full')
    uri.searchParams.set('sslrootcert', resolve('supabase/certs/prod-ca-2021.crt'))
    await promisify(execFile)(resolve('node_modules/@supabase/cli-windows-x64/bin/supabase.exe'), ['db', 'push', '--db-url', uri.href, '--skip-vault', '--yes'], { windowsHide: true, timeout: 60_000 })
  }
  stage = 'scoped-login-provisioning'
  await db.query('begin')
  for (const [login, capability, name] of credentials) {
    const uri = new URL(env[name])
    const password = decodeURIComponent(uri.password)
    if (!/^[a-f0-9]{64}$/.test(password)) throw new Error('Expected generated runtime password')
    const { rows } = await db.query('select rolcanlogin,rolsuper,rolbypassrls,rolcreaterole,rolcreatedb,rolreplication from pg_roles where rolname=$1', [login])
    if (rows.length === 0) {
      // Both identifiers are fixed above; password is generated hex, never input SQL.
      await db.query(`create role ${login} login inherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls password '${password}'`)
      await db.query(`grant ${capability} to ${login}`)
    } else if (!rows[0].rolcanlogin || rows[0].rolsuper || rows[0].rolbypassrls || rows[0].rolcreaterole || rows[0].rolcreatedb || rows[0].rolreplication) throw new Error('Unsafe existing runtime role')
  }
  await db.query('commit')
  console.log('Staging session migration and three scoped logins provisioned. Generated secrets stored only in ignored .env.staging.local. Runtime checks are next.')
} catch {
  await db?.query('rollback').catch(() => {})
  console.error(`Staging runtime preparation failed at ${stage}. Details withheld to protect credentials. Inspect state before retrying.`)
  process.exitCode = 1
} finally { await db?.end() }
