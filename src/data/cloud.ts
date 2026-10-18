import type { Command, State } from '../domain/inventory.ts'
import { parseBackup } from './storage.ts'

type Fetcher = typeof fetch
type Session = { user: { id: string; email: string }; csrfToken: string }
type Pending = { expectedRevision: number; command: Command }
export class CloudFailure extends Error {
  readonly kind: 'session' | 'conflict' | 'uncertain' | 'rejected'
  constructor(kind: CloudFailure['kind'], message: string) { super(message); this.kind = kind }
}
const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

export function createCloudInventory(transport: Fetcher = fetch) {
  const fetcher: Fetcher = (input, init) => transport(input, { ...init, redirect: 'error', signal: AbortSignal.timeout(15_000) })
  let account: Session | null = null
  let pending: Pending | null = null
  async function session(): Promise<Session> {
    let response: Response
    try { response = await fetcher('/api/auth/session', { credentials: 'same-origin', cache: 'no-store' }) }
    catch { throw new CloudFailure('uncertain', 'SESSION_UNAVAILABLE') }
    if (response.status === 401 || response.status === 403) {
      account = null; pending = null
      throw new CloudFailure('session', 'SESSION_REQUIRED')
    }
    if (!response.ok) throw new CloudFailure('uncertain', 'SESSION_UNAVAILABLE')
    let value: unknown
    try { value = await response.json() }
    catch { throw new CloudFailure('uncertain', 'SESSION_UNAVAILABLE') }
    if (object(value) && value.user === null) {
      account = null; pending = null
      throw new CloudFailure('session', 'SESSION_REQUIRED')
    }
    if (!object(value) || !object(value.user) || typeof value.user.id !== 'string' || typeof value.user.email !== 'string' || typeof value.csrfToken !== 'string') throw new CloudFailure('uncertain', 'SESSION_UNAVAILABLE')
    if (account && account.user.id !== value.user.id) {
      account = null; pending = null
      throw new CloudFailure('session', 'ACCOUNT_CHANGED')
    }
    account = { user: { id: value.user.id, email: value.user.email }, csrfToken: value.csrfToken }
    return account
  }
  async function data(response: Response): Promise<State> {
    if (response.status === 401 || response.status === 403) {
      account = null; pending = null
      throw new CloudFailure('session', 'SESSION_REQUIRED')
    }
    if (response.status === 400) {
      const value: unknown = await response.json().catch(() => null)
      if (object(value) && value.error === 'DOMAIN_INVALID' && typeof value.message === 'string' && value.message.length <= 500) throw new CloudFailure('rejected', value.message)
    }
    if (!response.ok) throw new CloudFailure(response.status === 409 ? 'conflict' : response.status >= 500 ? 'uncertain' : 'rejected', 'SAVE_FAILED')
    let value: unknown
    try { value = await response.json() }
    catch { throw new CloudFailure('uncertain', 'SAVE_UNCONFIRMED') }
    if (!object(value) || typeof value.userId !== 'string') throw new CloudFailure('uncertain', 'SAVE_UNCONFIRMED')
    if (value.userId !== account?.user.id) {
      account = null; pending = null
      throw new CloudFailure('session', 'ACCOUNT_CHANGED')
    }
    return parseBackup(JSON.stringify(value.state))
  }
  async function load(): Promise<State> {
    await session()
    return data(await fetcher('/api/inventory/state', { credentials: 'same-origin', cache: 'no-store' }))
  }
  async function send(): Promise<State> {
    if (!pending) throw new CloudFailure('rejected', 'NO_PENDING_COMMAND')
    try {
      const identity = await session()
      const response = await fetcher('/api/inventory/commands', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'X-Khonnai-CSRF': identity.csrfToken },
        body: JSON.stringify(pending),
      })
      const state = await data(response)
      pending = null
      return state
    } catch (error) {
      if (error instanceof CloudFailure) {
        if (error.kind !== 'uncertain') pending = null
        throw error
      }
      throw new CloudFailure('uncertain', 'SAVE_UNCONFIRMED')
    }
  }
  return {
    load,
    checkSession: session,
    get user() { return account?.user ?? null },
    get uncertain() { return pending !== null },
    async sendPasswordReset() {
      if (pending) throw new CloudFailure('uncertain', 'RESOLVE_PENDING_FIRST')
      if (!account) throw new CloudFailure('session', 'SESSION_REQUIRED')
      const identity = await session()
      try {
        const bootstrap = await fetcher('/api/auth/csrf', { credentials: 'same-origin', cache: 'no-store' })
        const value: unknown = await bootstrap.json()
        if (!bootstrap.ok || !object(value) || typeof value.csrfToken !== 'string' || !value.csrfToken) throw new CloudFailure('rejected', 'RESET_UNAVAILABLE')
        await session()
        const response = await fetcher('/api/auth/recover', {
          method: 'POST', credentials: 'same-origin', cache: 'no-store',
          headers: { 'Content-Type': 'application/json', 'X-Khonnai-CSRF': value.csrfToken },
          body: JSON.stringify({ email: identity.user.email }),
        })
        if (!response.ok) throw new CloudFailure('rejected', response.status === 429 ? 'RESET_RATE_LIMITED' : 'RESET_UNAVAILABLE')
        const result: unknown = await response.json()
        if (!object(result) || result.accepted !== true) throw new CloudFailure('rejected', 'RESET_UNAVAILABLE')
      } catch (error) {
        if (error instanceof CloudFailure) throw error
        throw new CloudFailure('rejected', 'RESET_UNAVAILABLE')
      }
    },
    async commit(state: State, command: Command) {
      if (pending) throw new CloudFailure('uncertain', 'RESOLVE_PENDING_FIRST')
      pending = { expectedRevision: state.revision, command: structuredClone(command) }
      return send()
    },
    async retry() {
      if (!pending) throw new CloudFailure('rejected', 'NO_PENDING_COMMAND')
      const identity = await session()
      const response = await fetcher(`/api/inventory/commands/${encodeURIComponent(pending.command.id)}`, { credentials: 'same-origin', cache: 'no-store', headers: { 'X-Khonnai-CSRF': identity.csrfToken } })
      if (response.status !== 404) {
        const state = await data(response)
        pending = null
        return state
      }
      return send()
    },
    clear() { account = null; pending = null },
  }
}
export type CloudInventory = ReturnType<typeof createCloudInventory>
