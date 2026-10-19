import { createHmac } from 'node:crypto'
import type { Pool } from 'pg'

export function createRateLimit(pool: Pool, key: Buffer) {
  return async (scope: string, identity: string, periodMs: number, max: number) => {
    const hash = createHmac('sha256', key).update(scope).update('\0').update(identity).digest()
    // Database time makes limits consistent across backend instances and clocks.
    const { rows } = await pool.query<{ hits: number }>(`insert into khonnai_vault.auth_attempts(key_hash,window_start)
      values($1,to_timestamp(floor(extract(epoch from clock_timestamp()) / $2) * $2))
      on conflict(key_hash,window_start) do update set hits=least(khonnai_vault.auth_attempts.hits::bigint + 1,2147483647)::integer
      returning hits`, [hash, periodMs / 1000])
    return rows[0].hits <= max
  }
}
