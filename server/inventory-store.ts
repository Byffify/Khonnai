import { createHash } from 'node:crypto'
import type { Pool, PoolClient } from 'pg'
import { emptyState, execute } from '../src/domain/inventory.ts'
import type { Command, State } from '../src/domain/inventory.ts'
import { parseBackup } from '../src/data/storage.ts'

export class InventoryFailure extends Error {
  readonly status: number
  readonly code: string
  constructor(status: number, code: string, message: string) { super(message); this.status = status; this.code = code }
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value && typeof value === 'object') return `{${Object.entries(value).filter(([, v]) => v !== undefined).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`
  return JSON.stringify(value)
}
export function commandDigest(command: Command) { return createHash('sha256').update(canonical(command)).digest('hex') }

type ShopRow = { id: string; name: string; phone: string; revision: string }

async function readState(db: PoolClient, shop: ShopRow): Promise<State> {
  const id = shop.id
  const { rows: [data] } = await db.query(`select
    coalesce((select jsonb_agg(jsonb_build_object('id',id,'code',code,'unit',unit,'photo',photo) order by position) from khonnai_app.products where shop_id=$1),'[]') as products,
    coalesce((select jsonb_agg(jsonb_build_object('id',id,'productId',product_id,'size',size,'color',color,'contents',contents,'price',price,'stock',stock) order by position) from khonnai_app.variants where shop_id=$1),'[]') as variants,
    coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'number',b.number,'customer',b.customer,'date',b.date,'status',b.status,'version',b.version,'history',b.history,'lines',coalesce((select jsonb_agg(snapshot order by position) from khonnai_app.bill_lines l where l.shop_id=b.shop_id and l.bill_id=b.id),'[]')) order by b.position) from khonnai_app.bills b where shop_id=$1),'[]') as bills,
    coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'customer',r.customer,'status',r.status,'lines',coalesce((select jsonb_agg(snapshot order by position) from khonnai_app.reservation_lines l where l.shop_id=r.shop_id and l.reservation_id=r.id),'[]')) order by r.position) from khonnai_app.reservations r where shop_id=$1),'[]') as reservations,
    coalesce((select jsonb_agg(jsonb_strip_nulls(jsonb_build_object('id',r.id,'billId',coalesce(r.bill_id,''),'date',r.date,'replacementBillId',r.replacement_bill_id,'lines',coalesce((select jsonb_agg(snapshot order by position) from khonnai_app.return_lines l where l.shop_id=r.shop_id and l.return_id=r.id),'[]'))) order by r.position) from khonnai_app.returns r where shop_id=$1),'[]') as returns,
    coalesce((select jsonb_agg(jsonb_build_object('id',id,'date',date,'text',text) order by position) from khonnai_app.movements where shop_id=$1),'[]') as movements,
    coalesce((select jsonb_agg(command_id order by revision) from khonnai_app.command_receipts where shop_id=$1),'[]') as commands`, [id])
  // Database JSON is an external boundary; use the existing complete graph parser.
  return parseBackup(JSON.stringify({ ...emptyState(), ...data, revision: Number(shop.revision), shop: { name: shop.name, phone: shop.phone } }))
}

async function persist(db: PoolClient, shopId: string, next: State) {
  const json = (value: unknown) => JSON.stringify(value)
  // A shop row lock serializes every writer. Replace children in dependency order
  // inside this transaction; readers see either complete committed version.
  for (const table of ['return_lines', 'returns', 'reservation_lines', 'reservations', 'bill_lines', 'bills', 'variants', 'products', 'movements']) {
    await db.query(`delete from khonnai_app.${table} where shop_id=$1`, [shopId])
  }
  await db.query(`insert into khonnai_app.products(shop_id,id,position,code,unit,photo)
    select $1,p.id,p.position,p.code,p.unit,p.photo from jsonb_to_recordset($2::jsonb) as p(id text,code text,unit text,photo text,position integer)`, [shopId, json(next.products.map((row, position) => ({ ...row, position })))])
  await db.query(`insert into khonnai_app.variants(shop_id,id,position,product_id,size,color,contents,price,stock)
    select $1,p.id,p.position,p."productId",p.size,p.color,p.contents,p.price,p.stock from jsonb_to_recordset($2::jsonb) as p(id text,"productId" text,size text,color text,contents text,price bigint,stock bigint,position integer)`, [shopId, json(next.variants.map((row, position) => ({ ...row, position })))])
  await db.query(`insert into khonnai_app.bills(shop_id,id,position,number,customer,date,status,version,history)
    select $1,p.id,p.position,p.number,p.customer,p.date,p.status,p.version,array(select jsonb_array_elements_text(p.history)) from jsonb_to_recordset($2::jsonb) as p(id text,number text,customer text,date text,status text,version bigint,history jsonb,position integer)`, [shopId, json(next.bills.map((row, position) => ({ ...row, position })))])
  await db.query(`insert into khonnai_app.reservations(shop_id,id,position,customer,status)
    select $1,p.id,p.position,p.customer,p.status from jsonb_to_recordset($2::jsonb) as p(id text,customer text,status text,position integer)`, [shopId, json(next.reservations.map((row, position) => ({ ...row, position })))])
  await db.query(`insert into khonnai_app.returns(shop_id,id,position,bill_id,date,replacement_bill_id)
    select $1,p.id,p.position,nullif(p."billId",''),p.date,p."replacementBillId" from jsonb_to_recordset($2::jsonb) as p(id text,"billId" text,date text,"replacementBillId" text,position integer)`, [shopId, json(next.returns.map((row, position) => ({ ...row, position })))])
  for (const [table, parentColumn, documents] of [
    ['bill_lines', 'bill_id', next.bills], ['reservation_lines', 'reservation_id', next.reservations], ['return_lines', 'return_id', next.returns],
  ] as const) {
    const lines = documents.flatMap(doc => doc.lines.map((snapshot, position) => ({ parent: doc.id, position, snapshot })))
    await db.query(`insert into khonnai_app.${table}(shop_id,${parentColumn},position,snapshot)
      select $1,p.parent,p.position,p.snapshot from jsonb_to_recordset($2::jsonb) as p(parent text,position integer,snapshot jsonb)`, [shopId, json(lines)])
  }
  await db.query(`insert into khonnai_app.movements(shop_id,id,position,date,text)
    select $1,p.id,p.position,p.date,p.text from jsonb_to_recordset($2::jsonb) as p(id text,date text,text text,position integer)`, [shopId, json(next.movements.map((row, position) => ({ ...row, position })))])
  await db.query('update khonnai_app.shops set name=$2,phone=$3,revision=$4 where id=$1', [shopId, next.shop.name, next.shop.phone, next.revision])
}

export function createInventoryStore(appPool: Pool) {
  async function transaction<T>(userId: string, operation: (db: PoolClient, shop: ShopRow) => Promise<T>) {
    let db: PoolClient
    try { db = await appPool.connect() }
    catch { throw new InventoryFailure(503, 'UNAVAILABLE', 'เชื่อมต่อข้อมูลร้านไม่ได้ กรุณาลองใหม่') }
    try {
      await db.query('begin')
      await db.query("select set_config('khonnai.user_id',$1,true)", [userId])
      const { rows: [shop] } = await db.query<ShopRow>('select id,name,phone,revision::text from khonnai_app.shops where owner_user_id=$1 for update', [userId])
      if (!shop) throw new InventoryFailure(403, 'UNAUTHORIZED', 'ไม่พบร้านที่คุณมีสิทธิ์ใช้งาน')
      const result = await operation(db, shop)
      await db.query('commit')
      return result
    } catch (error) {
      await db.query('rollback').catch(() => {})
      if (error instanceof InventoryFailure) throw error
      throw new InventoryFailure(503, 'UNAVAILABLE', 'เชื่อมต่อข้อมูลร้านไม่ได้ กรุณาลองใหม่')
    } finally { db.release() }
  }
  return {
    load(userId: string) { return transaction(userId, readState) },
    lookup(userId: string, commandId: string) {
      return transaction(userId, async (db, shop) => {
        const receipt = await db.query('select 1 from khonnai_app.command_receipts where shop_id=$1 and command_id=$2', [shop.id, commandId])
        return { committed: receipt.rowCount === 1, state: await readState(db, shop) }
      })
    },
    commit(userId: string, expectedRevision: number, command: Command) {
      return transaction(userId, async (db, shop) => {
        const digest = commandDigest(command)
        const { rows: [receipt] } = await db.query<{ digest: string }>('select digest from khonnai_app.command_receipts where shop_id=$1 and command_id=$2', [shop.id, command.id])
        if (receipt) {
          if (receipt.digest !== digest) throw new InventoryFailure(409, 'COMMAND_ID_REUSED', 'รายการนี้ใช้รหัสเดิมกับข้อมูลที่ต่างกัน กรุณาเปิดข้อมูลล่าสุด')
          return readState(db, shop)
        }
        if (Number(shop.revision) !== expectedRevision) throw new InventoryFailure(409, 'CONFLICT', 'ข้อมูลเปลี่ยนในอีกเครื่อง กรุณาโหลดข้อมูลล่าสุดก่อนบันทึก')
        const current = await readState(db, shop)
        let next: State
        try { next = parseBackup(JSON.stringify(execute(current, command))) }
        catch (error) { throw new InventoryFailure(400, 'DOMAIN_INVALID', error instanceof Error ? error.message : 'ข้อมูลรายการไม่ถูกต้อง') }
        await persist(db, shop.id, next)
        await db.query('insert into khonnai_app.command_receipts(shop_id,command_id,digest,revision) values ($1,$2,$3,$4)', [shop.id, command.id, digest, next.revision])
        return next
      })
    },
  }
}
