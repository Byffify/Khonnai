import assert from 'node:assert/strict'
import { randomUUID, randomBytes } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { openStagingDatabase } from './staging-database.mjs'
import { loadRuntimeConfig } from '../server/config.ts'
import { createInventoryStore } from '../server/inventory-store.ts'
import { createAccounts } from '../server/accounts.ts'

const ids=[randomUUID(),randomUUID()]
const password=`Verify${randomBytes(24).toString('hex')}`
const emails=ids.map(id=>`inventory-${id}@example.invalid`)
const checks=[]
let db,config,created=false,stage='configuration'
try {
  assert.ok(process.argv.slice(2).every(flag=>['--browser','--browser-only'].includes(flag)))
  config=await loadRuntimeConfig()
  db=await openStagingDatabase()
  const originalIds=(await db.query('select id from auth.users')).rows.map(row=>row.id)
  stage='isolated-fixtures'
  await db.query('begin')
  for(let i=0;i<ids.length;i++) {
    await db.query(`insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,
      raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change_token_new,email_change,
      email_change_token_current,phone_change_token,phone_change,reauthentication_token,email_change_confirm_status)
      values($1,'00000000-0000-0000-0000-000000000000','authenticated','authenticated',$2,
      extensions.crypt($3,extensions.gen_salt('bf',10)),now(),'{"provider":"email","providers":["email"]}','{}',now(),now(),'','','','','','','','',0)`,[ids[i],emails[i],password])
    await db.query("insert into auth.identities(provider_id,user_id,identity_data,provider,created_at,updated_at) values($1::text,$1::uuid,jsonb_build_object('sub',$1::text,'email',$2::text,'email_verified',true),'email',now(),now())",[ids[i],emails[i]])
  }
  await db.query('commit');created=true
  const accounts=createAccounts(config.appPool,config.controlPool)
  for(const id of ids) await accounts.provision(id)
  const store=createInventoryStore(config.appPool)
  let state=await store.load(ids[0])
  assert.equal(state.products.length,0);assert.equal(state.revision,0)
  checks.push('Each new account opens an empty shop without importing local demo data')
  if(!process.argv.includes('--browser-only')) {
  const product={id:'product-a',code:'KH-VERIFY',unit:'แพ็ก',photo:''}
  const variant=(id,stock=10)=>({id,productId:product.id,size:id==='a'?'M':'L',color:'น้ำเงิน',contents:'',price:12000,stock})
  const command=async value=>{state=await store.commit(ids[0],state.revision,{id:randomUUID(),...value});return state}
  stage='domain-command-parity'
  await command({type:'shop',name:'ร้านทดสอบ',phone:'0800000000'})
  await command({type:'product',product,variants:[variant('a'),variant('b')]})
  await command({type:'receive',variantId:'a',quantity:2})
  await command({type:'adjust',variantId:'b',quantity:9})
  await command({type:'sale',customer:'ตัวอย่าง',lines:[{variantId:'a',quantity:2}]})
  const bill=state.bills[0].id
  await command({type:'edit-bill',billId:bill,expectedVersion:0,lines:[{variantId:'a',quantity:3,price:13000}]})
  await command({type:'return',billId:bill,lines:[{variantId:'a',quantity:1,sellable:true}]})
  await command({type:'reserve',customer:'จอง',lines:[{variantId:'b',quantity:2}]})
  await command({type:'convert',reservationId:state.reservations[0].id})
  await command({type:'reserve',customer:'ยกเลิก',lines:[{variantId:'b',quantity:1}]})
  await command({type:'cancel-reservation',reservationId:state.reservations[0].id})
  await command({type:'sale',customer:'ยกเลิกบิล',lines:[{variantId:'a',quantity:1}]})
  await command({type:'cancel-bill',billId:state.bills[0].id,expectedVersion:0})
  await command({type:'exchange',billId:bill,lines:[{variantId:'a',quantity:1,sellable:true}],replacements:[{variantId:'b',quantity:1}]})
  assert.deepEqual(await createInventoryStore(config.appPool).load(ids[0]),state)
  checks.push('All twelve command types survive real relational roundtrip with document snapshots and ordering intact')
  stage='atomic-rollback'
  const before=structuredClone(state)
  await assert.rejects(command({type:'exchange',billId:bill,lines:[{variantId:'a',quantity:1,sellable:true}],replacements:[{variantId:'b',quantity:999}]}),error=>error.code==='DOMAIN_INVALID')
  assert.deepEqual(await store.load(ids[0]),before)
  checks.push('Failed exchange rolls back returned stock, replacement sale, movement, revision and receipt')
  stage='tenant-boundaries'
  assert.equal((await store.load(ids[1])).products.length,0)
  await assert.rejects(store.commit(ids[1],0,{id:randomUUID(),type:'receive',variantId:'a',quantity:1}),error=>error.code==='DOMAIN_INVALID')
  assert.equal((await store.lookup(ids[1],bill)).committed,false)
  const other=createInventoryStore(config.appPool)
  const probe=await config.appPool.connect()
  try {
    await probe.query('begin');await probe.query("select set_config('khonnai.user_id',$1,true)",[ids[1]])
    assert.equal((await probe.query('select * from khonnai_app.products')).rowCount,0)
    assert.equal((await probe.query('update khonnai_app.variants set stock=999 where id=$1',['a'])).rowCount,0)
    await probe.query('commit')
    assert.equal((await probe.query('select * from khonnai_app.products')).rowCount,0)
  } finally {await probe.query('rollback').catch(()=>{});probe.release()}
  checks.push('Second account cannot read, mutate or reconcile first shop; transaction identity clears after commit')
  stage='race-and-retry'
  await command({type:'adjust',variantId:'a',quantity:1})
  const revision=state.revision
  const sales=[0,1].map(()=>({id:randomUUID(),type:'sale',customer:'แข่งขัน',lines:[{variantId:'a',quantity:1}]}))
  const raced=await Promise.allSettled(sales.map(sale=>other.commit(ids[0],revision,sale)))
  assert.equal(raced.filter(row=>row.status==='fulfilled').length,1)
  assert.equal(raced.filter(row=>row.status==='rejected'&&row.reason.code==='CONFLICT').length,1)
  const winner=sales[raced.findIndex(row=>row.status==='fulfilled')]
  state=await store.load(ids[0])
  assert.equal(state.variants.find(row=>row.id==='a').stock,0)
  const persisted=structuredClone(state)
  assert.deepEqual(await other.commit(ids[0],revision,winner),persisted)
  assert.equal((await store.lookup(ids[0],winner.id)).committed,true)
  await assert.rejects(other.commit(ids[0],revision,{...winner,customer:'changed'}),error=>error.code==='COMMAND_ID_REUSED')
  assert.deepEqual(await store.load(ids[0]),persisted)
  checks.push('Two database connections selling last pack yield one sale; lost-response retry returns receipt without duplicate writes; changed payload rejected')
  }
  if(process.argv.includes('--browser')||process.argv.includes('--browser-only')) {
    stage='browser'
    const {verifyInventoryBrowser}=await import('./verify-inventory-browser.mjs')
    checks.push(...await verifyInventoryBrowser({email:emails[1],password,db,userId:ids[1],store}))
  }
  stage='original-accounts'
  const remaining=(await db.query('select id from auth.users where id=any($1::uuid[])',[originalIds])).rows.map(row=>row.id)
  assert.deepEqual(remaining.sort(),originalIds.sort())
  checks.push('All pre-existing account IDs remain present; fixtures use only newly generated IDs')
} catch(error) {
  await db?.query('rollback').catch(()=>{})
  console.error(`Live inventory verification failed at ${stage}. Sensitive details withheld.`)
  if(typeof error?.code==='string'&&/^[a-z0-9_]{3,32}$/i.test(error.code)) console.error(`Safe error code: ${error.code}`)
  process.exitCode=1
} finally {
  if(db&&created) {
    try {
      await db.query('begin')
      for(const table of ['return_lines','returns','reservation_lines','reservations','bill_lines','bills','variants','products','movements','command_receipts']) await db.query(`delete from khonnai_app.${table} where shop_id in(select id from khonnai_app.shops where owner_user_id=any($1::uuid[]))`,[ids])
      for(const table of ['khonnai_vault.sessions','khonnai_control.account_cohorts','khonnai_app.shop_members']) await db.query(`delete from ${table} where user_id=any($1::uuid[])`,[ids])
      await db.query('delete from khonnai_app.shops where owner_user_id=any($1::uuid[])',[ids])
      await db.query('delete from khonnai_app.profiles where user_id=any($1::uuid[])',[ids])
      await db.query('delete from auth.users where id=any($1::uuid[])',[ids])
      await db.query('commit')
      assert.equal((await db.query('select id from auth.users where id=any($1::uuid[])',[ids])).rowCount,0)
      checks.push('Only accounts and shop records generated by this invocation were cleaned up')
    } catch {await db.query('rollback').catch(()=>{});console.error('Synthetic fixture cleanup needs review.');process.exitCode=1}
  }
  if(config) await Promise.all([config.appPool.end(),config.vaultPool.end(),config.controlPool.end()])
  await db?.end()
  const report={checkedAt:new Date().toISOString(),passed:process.exitCode!==1,stage,checks,scope:'Real staging DB with isolated synthetic accounts. Optional browser uses real provider login. Existing accounts are never used as fixtures. Email delivery, cloud restore, Storage buckets, real-user usage reporting and production are not covered.'}
  await mkdir('outputs/inventory-staging',{recursive:true})
  await writeFile('outputs/inventory-staging/live-verification.json',JSON.stringify(report,null,2)+'\n')
  console.log(JSON.stringify(report,null,2))
}
