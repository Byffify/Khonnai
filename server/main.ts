import { createServer } from 'node:http'
import { loadRuntimeConfig } from './config.ts'
import { createAuthProvider } from './auth-provider.ts'
import { createSessionCrypto } from './session-crypto.ts'
import { createSessionStore } from './session-store.ts'
import { createRateLimit } from './rate-limit.ts'
import { createAccounts } from './accounts.ts'
import { createAuthHandler } from './auth-http.ts'
import { createInventoryStore } from './inventory-store.ts'
import { createInventoryHandler } from './inventory-http.ts'

try {
  const config = await loadRuntimeConfig()
  const provider = createAuthProvider(config.provider)
  const sessions = createSessionStore({ vaultPool: config.vaultPool, provider, crypto: createSessionCrypto(config.sessionKey), keyId: config.keyId })
  const rateLimit = createRateLimit(config.vaultPool, config.rateKey)
  const auth = createAuthHandler({ origin: config.origin, provider, sessions,
    accounts: createAccounts(config.appPool, config.controlPool), rateLimit })
  const inventory = createInventoryHandler({ origin: config.origin, sessions,
    inventory: createInventoryStore(config.appPool), rateLimit })
  const server = createServer((request, response) => {
    void (request.url?.startsWith('/api/inventory/') ? inventory(request, response) : auth(request, response))
  })
  server.requestTimeout = 30_000
  server.headersTimeout = 10_000
  server.on('error', (error: NodeJS.ErrnoException) => {
    console.error(error.code === 'EADDRINUSE'
      ? 'Auth API port 5294 is already in use. Open http://127.0.0.1:5293/auth if Khonnai is already running, or stop the original server before retrying.'
      : error.code === 'EACCES'
        ? 'Permission denied while opening Auth API port 5294.'
        : 'Local Auth API could not start on port 5294. No credentials were printed.')
    process.exitCode = 1
    void Promise.all([config.appPool.end(), config.vaultPool.end(), config.controlPool.end()])
  })
  server.listen(5294, '127.0.0.1', () => console.log('Local staging Auth API listening on 127.0.0.1:5294. No production deployment.'))
  const shutdown = () => server.close(() => { Promise.all([config.appPool.end(), config.vaultPool.end(), config.controlPool.end()]).finally(() => process.exit()) })
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
} catch {
  console.error('Auth server configuration unavailable. No credentials were printed.')
  process.exitCode = 1
}
