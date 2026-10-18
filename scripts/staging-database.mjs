import { readFile } from 'node:fs/promises'
import { parseEnv } from 'node:util'
import pg from 'pg'

const projectRef = 'brwkigtdecywivcfijvq'

export function parseDatabaseConfig(raw) {
  const env = parseEnv(raw)
  let uri
  try { uri = new URL(env.SUPABASE_MIGRATION_DATABASE_URL) } catch {
    throw new Error('Invalid staging database URI in local configuration.')
  }
  const direct = uri.hostname === `db.${projectRef}.supabase.co` && uri.username === 'postgres'
  const pooler = /^aws-[0-9]+-[a-z0-9-]+\.pooler\.supabase\.com$/.test(uri.hostname)
    && uri.username === `postgres.${projectRef}`
  if (!['postgres:', 'postgresql:'].includes(uri.protocol) || !(direct || pooler)
    || !['', '5432'].includes(uri.port) || uri.pathname !== '/postgres'
    || !uri.password || uri.search || uri.hash) {
    throw new Error('Expected the approved staging project direct or session-pooler URI on port 5432, without URL options.')
  }
  return {
    host: uri.hostname,
    port: 5432,
    user: decodeURIComponent(uri.username),
    password: decodeURIComponent(uri.password),
    database: 'postgres',
    ssl: { rejectUnauthorized: true },
    connectionTimeoutMillis: 15_000,
    statement_timeout: 30_000,
    application_name: 'khonnai-staging-migration',
  }
}

export async function openStagingDatabase() {
  const config = parseDatabaseConfig(await readFile('.env.staging.local', 'utf8'))
  config.ssl.ca = await readFile(new URL('../supabase/certs/prod-ca-2021.crt', import.meta.url), 'utf8')
  const client = new pg.Client(config)
  // Never forward provider error messages: they may contain connection details.
  client.on('error', () => {})
  try { await client.connect() } catch (error) {
    await client.end().catch(() => {})
    const safeCodes = new Set(['28P01', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNREFUSED', 'SELF_SIGNED_CERT_IN_CHAIN', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE'])
    const code = safeCodes.has(error.code) ? error.code : 'CONNECTION_FAILED'
    throw new Error(`Staging database connection failed (${code}).`)
  }
  return client
}
