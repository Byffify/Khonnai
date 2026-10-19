import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'
import type { ProviderTokens } from './auth-contract.ts'

type SessionPayload = { tokens: ProviderTokens; csrfToken: string }
type SessionContext = { sessionHash: Buffer; userId: string }
const version = Buffer.from([1])
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function validToken(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 16384 && !/\s/.test(value)
}

export function hashOpaque(value: string): Buffer { return createHash('sha256').update(value).digest() }
export function randomOpaque(): string { return randomBytes(32).toString('base64url') }

function payload(value: unknown): SessionPayload {
  if (!value || typeof value !== 'object' || !('tokens' in value) || !('csrfToken' in value)) throw new Error('Invalid session envelope.')
  const tokens = value.tokens
  if (!tokens || typeof tokens !== 'object'
    || !('accessToken' in tokens) || !validToken(tokens.accessToken)
    || !('refreshToken' in tokens) || !validToken(tokens.refreshToken)
    || !('expiresAt' in tokens) || typeof tokens.expiresAt !== 'number' || !Number.isSafeInteger(tokens.expiresAt) || tokens.expiresAt <= 0
    || !('userId' in tokens) || typeof tokens.userId !== 'string' || !uuid.test(tokens.userId)
    || !('providerSessionId' in tokens) || typeof tokens.providerSessionId !== 'string' || !uuid.test(tokens.providerSessionId)
    || typeof value.csrfToken !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(value.csrfToken)) throw new Error('Invalid session envelope.')
  return { tokens: { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, expiresAt: tokens.expiresAt, userId: tokens.userId, providerSessionId: tokens.providerSessionId }, csrfToken: value.csrfToken }
}

export function createSessionCrypto(inputKey: Buffer) {
  if (inputKey.length !== 32) throw new Error('Session encryption requires a 32-byte key.')
  const key = Buffer.from(inputKey)
  function aad(context: SessionContext): Buffer {
    if (context.sessionHash.length !== 32 || !uuid.test(context.userId)) throw new Error('Invalid session context.')
    return Buffer.concat([Buffer.from('khonnai-session'), version, context.sessionHash, Buffer.from(context.userId)])
  }
  return {
    seal(value: SessionPayload, context: SessionContext): Buffer {
      const data = payload(value)
      if (data.tokens.userId !== context.userId) throw new Error('Invalid session envelope.')
      const nonce = randomBytes(12)
      const cipher = createCipheriv('aes-256-gcm', key, nonce)
      cipher.setAAD(aad(context))
      const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()])
      return Buffer.concat([version, nonce, cipher.getAuthTag(), encrypted])
    },
    open(ciphertext: Buffer, context: SessionContext): SessionPayload {
      try {
        if (ciphertext.length < 30 || ciphertext.length > 65536 || ciphertext[0] !== 1) throw new Error()
        const decipher = createDecipheriv('aes-256-gcm', key, ciphertext.subarray(1, 13))
        decipher.setAAD(aad(context))
        decipher.setAuthTag(ciphertext.subarray(13, 29))
        const decoded = Buffer.concat([decipher.update(ciphertext.subarray(29)), decipher.final()]).toString('utf8')
        const data = payload(JSON.parse(decoded))
        if (data.tokens.userId !== context.userId) throw new Error()
        return data
      } catch { throw new Error('Invalid session envelope.') }
    },
  }
}
