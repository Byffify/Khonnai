import { randomUUID } from 'node:crypto'
import type { Pool } from 'pg'

export function createAccounts(appPool: Pool, controlPool: Pool) {
  return {
    async provision(userId: string) {
      const db = await appPool.connect()
      try {
        await db.query('begin')
        await db.query("select set_config('khonnai.user_id',$1,true)", [userId])
        await db.query('insert into khonnai_app.profiles(user_id) values ($1) on conflict do nothing', [userId])
        await db.query("insert into khonnai_app.shops(id,owner_user_id,name,generation) values ($1,$2,'ร้านของคุณ',$3) on conflict(owner_user_id) do nothing", [randomUUID(), userId, randomUUID()])
        await db.query('insert into khonnai_app.shop_members(shop_id,user_id) select id,owner_user_id from khonnai_app.shops where owner_user_id=$1 on conflict do nothing', [userId])
        await db.query('commit')
      } catch {
        await db.query('rollback').catch(() => {})
        throw new Error('Account setup unavailable')
      } finally { db.release() }
      // Every account in this staging-only release is excluded from real-user
      // metrics. The browser can never choose its cohort or administrator role.
      await controlPool.query("insert into khonnai_control.account_cohorts(user_id,cohort,assignment_reason) values ($1,'team','Local staging verification') on conflict do nothing", [userId])
    },
  }
}
