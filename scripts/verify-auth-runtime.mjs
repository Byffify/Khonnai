import assert from 'node:assert/strict'
import { randomUUID, randomBytes } from 'node:crypto'
import { requireEmptyStaging, StagingNotEmptyError, saveVerificationReport } from './auth-verification-report.mjs'
import { openStagingDatabase } from './staging-database.mjs'
import { loadRuntimeConfig } from '../server/config.ts'
import { createAuthProvider } from '../server/auth-provider.ts'
import { createSessionCrypto, hashOpaque } from '../server/session-crypto.ts'
import { createSessionStore } from '../server/session-store.ts'
import { createAccounts } from '../server/accounts.ts'
import { createRateLimit } from '../server/rate-limit.ts'
import { verifyAuthBrowser } from './verify-auth-browser.mjs'

let db, config
let stage = 'configuration'
const ids = [randomUUID(), randomUUID()]
const checks = []
let fixturesCreated = false
let notRun = false
try {
  config = await loadRuntimeConfig()
  db = await openStagingDatabase()
  stage = 'staging-precondition'
  const { rows: [initial] } = await db.query('select count(*)::int as count from auth.users')
  requireEmptyStaging(initial.count)
  const password = `Test${randomBytes(24).toString('hex')}`
  const emails = ids.map(id => `session-${id}@example.invalid`)
  stage = 'temporary-auth-fixtures'
  await db.query('begin')
  for (let i = 0; i < ids.length; i++) {
    await db.query(`insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,
      raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change_token_new,email_change,
      email_change_token_current,phone_change_token,phone_change,reauthentication_token,email_change_confirm_status)
      values($1,'00000000-0000-0000-0000-000000000000','authenticated','authenticated',$2,
      extensions.crypt($3,extensions.gen_salt('bf',10)),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','','','','','',0)`, [ids[i], emails[i], password])
    await db.query("insert into auth.identities(provider_id,user_id,identity_data,provider,created_at,updated_at) values($1::text,$1::uuid,jsonb_build_object('sub',$1::text,'email',$2::text,'email_verified',true),'email',now(),now())", [ids[i], emails[i]])
  }
  await db.query('commit')
  fixturesCreated = true
  const provider = createAuthProvider(config.provider, async (...args) => {
    const response = await fetch(...args)
    if (!response.ok && response.status >= 500) {
      const value = await response.clone().json().catch(() => ({}))
      console.error(`Provider HTTP ${response.status}; database-schema-error=${typeof value.msg === 'string' && value.msg.includes('Database error') || typeof value.message === 'string' && value.message.includes('Database error')}`)
    }
    return response
  })
  const crypto = createSessionCrypto(config.sessionKey)
  const makeStore = () => createSessionStore({ vaultPool: config.vaultPool, provider, crypto, keyId: config.keyId })
  const sessions = makeStore()
  const accounts = createAccounts(config.appPool, config.controlPool)
  stage = 'real-provider-login'
  const tokens = []
  for (let i = 0; i < ids.length; i++) {
    const token = await provider.signIn(emails[i], password)
    assert.equal(token.userId, ids[i])
    tokens.push(token)
    await accounts.provision(token.userId)
  }
  checks.push('Two synthetic confirmed fixtures signed in through real Supabase Auth; no email sent')
  stage = 'provider-revocation-boundary'
  const probe = await provider.signIn(emails[0], password)
  await provider.revoke(probe.accessToken)
  await assert.rejects(provider.verifyAccess(probe.accessToken))
  checks.push('Remote /user rejects a token after its provider session is revoked')
  stage = 'session-vault'
  const [a, b] = await Promise.all(tokens.map(token => sessions.create(token)))
  assert.equal((await sessions.authenticate(a.sessionId)).userId, ids[0])
  assert.equal((await sessions.authenticate(b.sessionId)).userId, ids[1])
  const { rows: [row] } = await config.vaultPool.query('select token_ciphertext,csrf_hash from khonnai_vault.sessions where session_hash=$1', [hashOpaque(a.sessionId)])
  assert.equal(row.token_ciphertext.includes(Buffer.from(tokens[0].accessToken)), false)
  assert.equal(row.token_ciphertext.includes(Buffer.from(tokens[0].refreshToken)), false)
  assert.ok(row.csrf_hash.equals(hashOpaque(a.csrfToken)))
  checks.push('Opaque sessions authenticate separate identities; provider tokens stored as ciphertext')
  stage = 'runtime-privileges'
  for (const pool of [config.appPool, config.vaultPool, config.controlPool]) {
    const { rows: [role] } = await pool.query('select rolsuper,rolbypassrls,rolcreaterole,rolcreatedb from pg_roles where rolname=current_user')
    assert.deepEqual(Object.values(role), [false,false,false,false])
  }
  await assert.rejects(config.appPool.query('select * from khonnai_vault.sessions'))
  await assert.rejects(config.appPool.query('select * from khonnai_control.report_admins'))
  await assert.rejects(config.vaultPool.query('select * from khonnai_app.shops'))
  for (const id of ids) {
    const client = await config.appPool.connect()
    try {
      await client.query('begin')
      await client.query("select set_config('khonnai.user_id',$1,true)", [id])
      const { rows } = await client.query('select owner_user_id from khonnai_app.shops')
      assert.deepEqual(rows.map(row => row.owner_user_id), [id])
      await client.query('commit')
      const noContext = await client.query('select * from khonnai_app.shops')
      assert.equal(noContext.rowCount, 0)
    } finally { await client.query('rollback').catch(() => {}); client.release() }
  }
  checks.push('Scoped runtime logins cannot bypass RLS or cross vault/control boundaries; transaction identity does not leak')
  stage = 'cross-instance-refresh'
  const sessionHash = hashOpaque(a.sessionId)
  const envelope = crypto.seal({tokens:{...tokens[0],expiresAt:Date.now()-1000},csrfToken:a.csrfToken}, {sessionHash,userId:ids[0]})
  await config.vaultPool.query('update khonnai_vault.sessions set token_ciphertext=$2 where session_hash=$1', [sessionHash,envelope])
  const refreshed = await Promise.all([makeStore().authenticate(a.sessionId), makeStore().authenticate(a.sessionId)])
  assert.ok(refreshed.every(session => session?.userId === ids[0]))
  const { rows: [version] } = await config.vaultPool.query('select refresh_version from khonnai_vault.sessions where session_hash=$1', [sessionHash])
  assert.equal(Number(version.refresh_version), 1)
  checks.push('Two independent session-store instances concurrently refresh under real PostgreSQL row lock; one version increment')
  stage = 'revocation'
  await sessions.revoke(a.sessionId)
  assert.equal(await makeStore().authenticate(a.sessionId), null)
  const anotherB = await sessions.create(await provider.signIn(emails[1],password))
  const newPassword = `Changed${randomBytes(24).toString('hex')}`
  await sessions.changePassword(b.sessionId,newPassword)
  assert.equal(await sessions.authenticate(b.sessionId),null)
  assert.equal(await makeStore().authenticate(anotherB.sessionId),null)
  await assert.rejects(provider.signIn(emails[1],password))
  const changedTokens = await provider.signIn(emails[1],newPassword)
  await provider.revoke(changedTokens.accessToken)
  checks.push('Logout rejects replay; password change invalidates both local device sessions; old password rejected by provider')
  stage = 'durable-throttle'
  const rate = createRateLimit(config.vaultPool,config.rateKey)
  const marker = randomUUID()
  assert.deepEqual(await Promise.all([rate('fixture',marker,60_000,2),rate('fixture',marker,60_000,2),rate('fixture',marker,60_000,2)]),[true,true,false])
  checks.push('Atomic database rate counter rejects attempt exceeding limit')
  if (process.argv.includes('--browser')) {
    stage = 'browser-integration'
    checks.push(...await verifyAuthBrowser({email:emails[0],password,userId:ids[0],db}))
  }
} catch (error) {
  if (error instanceof StagingNotEmptyError) {
    notRun = true
    console.error(`Live Auth verification NOT RUN [${error.code}]. ${error.message}`)
  } else {
    await db?.query('rollback').catch(() => {})
    console.error(`Live Auth verification failed at ${stage}. Sensitive error details withheld.`)
    if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string' && /^[a-z_0-9]{3,32}$/i.test(error.code)) console.error(`Safe error code: ${error.code}`)
    if (error?.code === '42501' && /^permission denied (for|to) [a-z_ ."]+$/i.test(error.message)) console.error(error.message)
  }
  process.exitCode = 1
} finally {
  if (db && fixturesCreated) {
    try {
      await db.query('begin')
      for (const table of ['khonnai_vault.sessions','khonnai_control.account_cohorts','khonnai_app.shop_members']) await db.query(`delete from ${table} where user_id=any($1::uuid[])`, [ids])
      await db.query('delete from khonnai_app.shops where owner_user_id=any($1::uuid[])',[ids])
      await db.query('delete from khonnai_app.profiles where user_id=any($1::uuid[])',[ids])
      await db.query('delete from auth.users where id=any($1::uuid[])',[ids])
      await db.query('commit')
      const {rows:[left]}=await db.query('select count(*)::int as count from auth.users where id=any($1::uuid[])',[ids])
      assert.equal(left.count,0)
      checks.push('Only generated test fixtures cleaned up; no original local data read or changed')
    } catch { console.error('Fixture cleanup needs review. No unrelated records targeted.'); process.exitCode=1 }
  }
  if (config) await Promise.all([config.appPool.end(),config.vaultPool.end(),config.controlPool.end()])
  await db?.end()
  const report={checkedAt:new Date().toISOString(),status:notRun?'not_run':process.exitCode===1?'failed':'passed',passed:notRun?null:process.exitCode!==1,stage,...(notRun?{reason:'STAGING_NOT_EMPTY'}:{}),checks,scope:notRun
    ? 'Preflight only. Existing accounts prevented fixture creation. No Auth, database isolation or browser tests executed; previous verification artifact preserved.'
    : process.argv.includes('--browser')
    ? 'Real staging Auth/database and local browser using generated synthetic confirmed fixtures. Recovery token fixture bypasses email delivery only. Real email, Google, cloud inventory and production are not covered.'
    : 'Real staging Auth and database using generated synthetic confirmed fixtures. Email confirmation delivery, Google, browser login, inventory writes and production are not covered.'}
  await saveVerificationReport('outputs/auth-staging', report)
  console.log(JSON.stringify(report,null,2))
}
