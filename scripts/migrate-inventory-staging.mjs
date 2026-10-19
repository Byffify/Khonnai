import assert from 'node:assert/strict'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash, randomUUID } from 'node:crypto'
import { execFile } from 'node:child_process'
import { promisify, parseEnv } from 'node:util'
import { resolve } from 'node:path'
import { openStagingDatabase, parseDatabaseConfig } from './staging-database.mjs'

const version = '20261018134456'
const path = `supabase/migrations/${version}_cloud_inventory.sql`
const tables = ['products','variants','bills','bill_lines','reservations','reservation_lines','returns','return_lines','movements','command_receipts']
let db
let stage = 'configuration'
try {
  assert.ok(process.argv.length === 2 || (process.argv.length === 3 && process.argv[2] === '--apply'))
  const sql = await readFile(path, 'utf8')
  const sha256 = createHash('sha256').update(sql).digest('hex')
  const raw = await readFile('.env.staging.local', 'utf8')
  parseDatabaseConfig(raw)
  db = await openStagingDatabase()
  await mkdir('outputs/inventory-staging', { recursive: true })
  const { rows: [recorded] } = await db.query('select exists(select 1 from supabase_migrations.schema_migrations where version=$1) as present', [version])
  if (process.argv.includes('--apply')) {
    stage = 'proof'
    const proof = JSON.parse(await readFile('outputs/inventory-staging/migration-dry-run.json', 'utf8'))
    assert.equal(proof.sha256, sha256); assert.equal(proof.passed, true); assert.equal(proof.rolledBack, true)
    if (!recorded.present) {
      await db.end(); db = undefined
      const uri = new URL(parseEnv(raw).SUPABASE_MIGRATION_DATABASE_URL)
      uri.searchParams.set('sslmode', 'verify-full')
      uri.searchParams.set('sslrootcert', resolve('supabase/certs/prod-ca-2021.crt'))
      const cli = resolve('node_modules/@supabase/cli-windows-x64/bin/supabase.exe')
      const args = ['db','push','--db-url',uri.href,'--skip-vault','--yes']
      stage = 'cli-dry-run'
      await promisify(execFile)(cli,[...args,'--dry-run'],{timeout:60_000,windowsHide:true})
      stage = 'cli-apply'
      await promisify(execFile)(cli,args,{timeout:60_000,windowsHide:true})
      db = await openStagingDatabase()
    }
    stage = 'installed-schema'
    const {rows:[check]}=await db.query(`select
      exists(select 1 from supabase_migrations.schema_migrations where version=$1) as recorded,
      (select count(*)::int from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='khonnai_app' and c.relname=any($2) and c.relrowsecurity and c.relforcerowsecurity) as rls_tables`,[version,tables])
    assert.equal(check.recorded,true); assert.equal(check.rls_tables,tables.length)
    const report={checkedAt:new Date().toISOString(),passed:true,version,sha256,...check,scope:'Additive staging migration only. No local import, existing account changes or production deployment.'}
    await writeFile('outputs/inventory-staging/migration-applied.json',JSON.stringify(report,null,2)+'\n')
    console.log(JSON.stringify(report,null,2))
  } else {
    stage = 'transactional-dry-run'
    assert.equal(recorded.present,false,'Migration already installed; use --apply for installed-schema check')
    await db.query('begin')
    await db.query(sql)
    const owners=[randomUUID(),randomUUID()], shops=[randomUUID(),randomUUID()]
    for(let i=0;i<owners.length;i++) {
      await db.query('insert into auth.users(id) values ($1)',[owners[i]])
      await db.query('insert into khonnai_app.profiles(user_id) values ($1)',[owners[i]])
      await db.query("insert into khonnai_app.shops(id,owner_user_id,name,generation) values($1,$2,'', $3)",[shops[i],owners[i],randomUUID()])
    }
    await db.query('grant khonnai_app_runtime to postgres')
    await db.query('set local role khonnai_app_runtime')
    await db.query("select set_config('khonnai.user_id',$1,true)",[owners[0]])
    await db.query("insert into khonnai_app.products(shop_id,id,position,code,unit) values($1,'fixture-product',0,'FIXTURE','แพ็ก')",[shops[0]])
    const denied=async(query,values,code)=>{
      await db.query('savepoint forbidden')
      try { await assert.rejects(db.query(query,values),error=>error.code===code) }
      finally { await db.query('rollback to savepoint forbidden') }
    }
    await denied("insert into khonnai_app.products(shop_id,id,position,code,unit) values($1,'forged',0,'FORGED','แพ็ก')",[shops[1]],'42501')
    await db.query("select set_config('khonnai.user_id',$1,true)",[owners[1]])
    assert.equal((await db.query('select * from khonnai_app.products')).rowCount,0)
    await denied("insert into khonnai_app.variants(shop_id,id,position,product_id,size,color,contents,price,stock) values($1,'v',0,'fixture-product','M','Blue','',0,0)",[shops[1]],'23503')
    await denied('delete from khonnai_app.command_receipts',[],'42501')
    await db.query('rollback')
    assert.equal((await db.query('select id from auth.users where id=any($1::uuid[])',[owners])).rowCount,0)
    const report={checkedAt:new Date().toISOString(),passed:true,rolledBack:true,version,sha256,checks:['DDL applied inside rollback-only transaction','Runtime RLS rejects foreign shop insert and hides rows','Composite FK rejects cross-shop product reference','Runtime cannot delete command receipts','Synthetic users and DDL rolled back'],scope:'Staging rollback-only SQL preflight. No original accounts changed.'}
    await writeFile('outputs/inventory-staging/migration-dry-run.json',JSON.stringify(report,null,2)+'\n')
    console.log(JSON.stringify(report,null,2))
  }
} catch(error) {
  await db?.query('rollback').catch(()=>{})
  console.error(`Inventory migration verification failed at ${stage}. Sensitive details withheld.`)
  if(typeof error?.code==='string'&&/^[a-z0-9_]{3,32}$/i.test(error.code)) console.error(`Safe error code: ${error.code}`)
  process.exitCode=1
} finally { await db?.end() }
