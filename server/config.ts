import { readFile } from 'node:fs/promises'
import { parseEnv } from 'node:util'
import pg from 'pg'

const ref = 'brwkigtdecywivcfijvq'
const roleNames = { app: 'khonnai_bff_app', vault: 'khonnai_bff_vault', control: 'khonnai_bff_control' }

export async function loadRuntimeConfig() {
  const env = parseEnv(await readFile('.env.staging.local', 'utf8'))
  const publishableKey = env.SUPABASE_PUBLISHABLE_KEY
  if (env.SUPABASE_URL !== `https://${ref}.supabase.co` || typeof publishableKey !== 'string' || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(publishableKey)) throw new Error('Invalid Auth configuration')
  const origin = env.AUTH_ORIGIN ?? 'http://127.0.0.1:5293'
  // This launcher is intentionally local/staging only. Deployment configuration
  // and HTTPS-only __Host cookies need their own verified release gate.
  if (origin !== 'http://127.0.0.1:5293') throw new Error('Only the approved local staging origin is supported')
  const ca = await readFile(new URL('../supabase/certs/prod-ca-2021.crt', import.meta.url), 'utf8')
  function pool(kind: keyof typeof roleNames, raw: string | undefined) {
    if (!raw) throw new Error('Runtime credentials are not provisioned')
    const uri = new URL(raw)
    const direct = uri.hostname === `db.${ref}.supabase.co` && uri.username === roleNames[kind]
    const pooled = /^aws-[0-9]+-[a-z0-9-]+\.pooler\.supabase\.com$/.test(uri.hostname) && uri.username === `${roleNames[kind]}.${ref}`
    if (!(direct || pooled) || !['postgres:', 'postgresql:'].includes(uri.protocol) || uri.port !== '5432' || uri.pathname !== '/postgres' || !uri.password || uri.search || uri.hash) throw new Error('Invalid scoped runtime connection')
    const result = new pg.Pool({ host: uri.hostname, port: 5432, user: decodeURIComponent(uri.username), password: decodeURIComponent(uri.password), database: 'postgres', ssl: { ca, rejectUnauthorized: true }, max: 3, connectionTimeoutMillis: 15_000, idleTimeoutMillis: 15_000, statement_timeout: 20_000, lock_timeout: 5_000, application_name: `khonnai-${kind}-staging` })
    result.on('error', () => {})
    return result
  }
  const sessionKey = env.AUTH_SESSION_KEY
  const rateKey = env.AUTH_RATE_KEY
  if (typeof sessionKey !== 'string' || typeof rateKey !== 'string' || !/^[a-f0-9]{64}$/.test(sessionKey) || !/^[a-f0-9]{64}$/.test(rateKey)) throw new Error('Invalid session encryption configuration')
  return {
    origin, provider: { url: env.SUPABASE_URL, publishableKey },
    sessionKey: Buffer.from(sessionKey, 'hex'), rateKey: Buffer.from(rateKey, 'hex'),
    keyId: 'local-staging-v1',
    appPool: pool('app', env.AUTH_APP_DATABASE_URL),
    vaultPool: pool('vault', env.AUTH_VAULT_DATABASE_URL),
    controlPool: pool('control', env.AUTH_CONTROL_DATABASE_URL),
  }
}
