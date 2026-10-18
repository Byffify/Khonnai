import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

export async function verifyInventoryBrowser({ email, password, db, userId, store }) {
  const browser=await chromium.launch()
  const checks=[]
  let stage='login'
  let activePage
  try {
    await mkdir('outputs/inventory-staging/browser',{recursive:true})
    const login=async(context)=>{
      await context.addInitScript(()=>{localStorage.setItem('micro-erp-v1','LOCAL_DEMO_MUST_REMAIN_UNCHANGED');if(!localStorage.getItem('khonnai-language'))localStorage.setItem('khonnai-language','th')})
      const page=await context.newPage()
      activePage=page
      stage='login-open'
      await page.goto('http://127.0.0.1:5293/auth')
      await page.getByRole('button',{name:'เข้าสู่ระบบด้วยอีเมล',exact:true}).click()
      stage='login-email'
      await page.getByLabel('อีเมล',{exact:true}).fill(email)
      await page.getByRole('button',{name:'ถัดไป',exact:true}).click()
      await page.getByLabel('รหัสผ่าน',{exact:true}).fill(password)
      stage='login-submit'
      await page.getByRole('button',{name:'เข้าสู่ระบบ',exact:true}).click()
      await expect(page.getByRole('link',{name:'เปิดร้านของคุณ',exact:true})).toBeVisible({timeout:20_000})
      await page.evaluate(()=>document.fonts.ready)
      const openButton=await page.getByRole('link',{name:'เปิดร้านของคุณ',exact:true}).boundingBox()
      const logoutButton=await page.getByRole('button',{name:'ออกจากระบบ',exact:true}).boundingBox()
      assert.ok(openButton&&logoutButton&&logoutButton.y-(openButton.y+openButton.height)>=11.5)
      await page.screenshot({path:`outputs/inventory-staging/browser/signed-in-${page.viewportSize().width}.png`,fullPage:true,animations:'disabled'})
      stage='open-shop'
      await page.getByRole('link',{name:'เปิดร้านของคุณ',exact:true}).click()
      await expect(page.getByRole('heading',{name:'สินค้า',exact:true})).toBeVisible({timeout:20_000})
      return page
    }
    const context=await browser.newContext({viewport:{width:390,height:844}})
    const page=await login(context)
    assert.equal((await store.load(userId)).products.length,0)
    assert.equal(await page.evaluate(()=>localStorage.getItem('micro-erp-v1')),'LOCAL_DEMO_MUST_REMAIN_UNCHANGED')
    checks.push('Real provider login opens an empty account shop while corrupt local-demo sentinel remains unread and unchanged')
    stage='product-and-photo'
    await page.getByRole('button',{name:'เพิ่มสินค้า',exact:true}).click()
    await page.getByLabel('รหัสสินค้า',{exact:true}).fill('KH-CLOUD-BROWSER')
    await page.getByLabel('ไซซ์',{exact:true}).fill('M')
    await page.getByLabel('สี / คละสี',{exact:true}).fill('น้ำเงิน')
    await page.getByLabel('ยอดเริ่มต้น',{exact:true}).fill('10')
    await page.getByLabel('ราคาต่อหน่วย (บาท)',{exact:true}).fill('120')
    const png=await sharp({create:{width:32,height:32,channels:3,background:'#193b5a'}}).png().toBuffer()
    await page.locator('input[type="file"]').setInputFiles({name:'synthetic.png',mimeType:'image/png',buffer:png})
    await expect(page.getByRole('status').filter({hasText:'กำลังย่อรูป'})).toHaveCount(0)
    await page.getByRole('button',{name:'บันทึกสินค้า',exact:true}).click()
    await expect(page.getByRole('heading',{name:'สินค้า',exact:true})).toBeVisible({timeout:20_000})
    assert.match((await store.load(userId)).products[0].photo,/^data:image\//)
    await page.reload()
    await expect(page.getByRole('button',{name:'ดูไซซ์ / สีและจัดการ KH-CLOUD-BROWSER',exact:true})).toBeVisible({timeout:20_000})
    checks.push('Product and uploaded image persist on real database and survive reload without local business-data writes')
    stage='lost-response'
    let posts=0
    await page.route('**/api/inventory/commands',async route=>{
      posts++
      if(posts===1) { const response=await route.fetch();assert.equal(response.status(),200);await route.abort('failed') }
      else await route.continue()
    })
    await page.getByRole('navigation').getByRole('button',{name:'บิล',exact:true}).click()
    await page.getByRole('button',{name:'สร้างบิล',exact:true}).click()
    await page.getByRole('button',{name:'เพิ่มรายการสินค้า',exact:true}).click()
    await page.getByLabel('สินค้า 1',{exact:true}).selectOption({index:1})
    await page.getByLabel('จำนวน 1',{exact:true}).fill('2')
    await page.getByRole('button',{name:'บันทึกการขาย',exact:true}).click()
    await expect(page.getByRole('button',{name:'ตรวจสอบรายการเดิม',exact:true})).toBeVisible({timeout:20_000})
    await expect(page.getByRole('navigation').getByRole('button',{name:'บิล',exact:true})).toBeDisabled()
    let sessionUnavailable=true
    await page.route('**/api/auth/session',async route=>{
      if(sessionUnavailable) await route.fulfill({status:503,contentType:'application/json',body:'{"error":"UNAVAILABLE"}'})
      else await route.continue()
    })
    await page.getByRole('button',{name:'ตรวจสอบรายการเดิม',exact:true}).click()
    await expect(page.getByText('ยังตรวจสอบไม่ได้ กรุณาลองอีกครั้งเมื่อเชื่อมต่อได้',{exact:true})).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('button',{name:'บิล',exact:true})).toBeDisabled()
    sessionUnavailable=false
    await page.getByRole('button',{name:'ตรวจสอบรายการเดิม',exact:true}).click()
    await expect(page.getByRole('heading',{name:'สินค้า',exact:true})).toBeVisible({timeout:20_000})
    const saved=await store.load(userId)
    assert.equal(posts,1);assert.equal(saved.bills.length,1);assert.equal(saved.variants[0].stock,8)
    checks.push('Real sale commits before response loss; temporary Auth503 preserves pending command; receipt reconciliation confirms it without a second POST or duplicate sale')
    stage='second-device'
    const second=await browser.newContext({viewport:{width:1440,height:1000}})
    const other=await login(second)
    const remote=await other.evaluate(async()=>{const response=await fetch('/api/inventory/state');return response.json()})
    assert.equal(remote.state.bills.length,1);assert.equal(remote.state.variants[0].stock,8)
    checks.push('Separately signed-in browser context reads the same committed stock and bill')
    stage='responsive-and-receipt'
    for(const width of [320,390,768,1440]) {
      await page.setViewportSize({width,height:960})
      for(const name of ['สินค้า','บิล','จอง','คืน/เปลี่ยน','ตั้งค่า']) {
        await page.getByRole('navigation').getByRole('button',{name,exact:true}).click()
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)
      }
      await page.screenshot({path:`outputs/inventory-staging/browser/settings-${width}.png`,fullPage:true,animations:'disabled'})
    }
    const baseline=JSON.parse(await readFile('outputs/fastwork-preview/baseline.json','utf8'))
    const base64=await page.evaluate(async({fixture,shop})=>{
      const {billImage}=await import('/src/features/BillImage.ts')
      const blob=await billImage(fixture,shop)
      const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte)
      return btoa(binary)
    },baseline)
    assert.ok(Buffer.from(base64,'base64').equals(await readFile('outputs/fastwork-preview/receipt-baseline.png')))
    checks.push('All five cloud menus fit320/390/768/1440px; original fixed bill fixture produces byte-identical PNG')
    stage='account-settings'
    await page.getByRole('button',{name:'บัญชีและความปลอดภัย',exact:true}).click()
    await expect(page.getByRole('heading',{name:'บัญชีและความปลอดภัย',exact:true})).toBeFocused()
    await expect(page.locator('.settings-account-email dd')).toHaveText(email)
    let resetRequests=0,releaseReset
    const resetGate=new Promise(resolve=>{releaseReset=resolve})
    await page.route('**/api/auth/recover',async route=>{
      resetRequests++
      assert.deepEqual(route.request().postDataJSON(),{email})
      assert.ok(route.request().headers()['x-khonnai-csrf'])
      await resetGate
      await route.fulfill({status:202,contentType:'application/json',body:'{"accepted":true}'})
    })
    const resetButton=page.getByRole('button',{name:'ส่งลิงก์เปลี่ยนรหัสผ่าน',exact:true})
    await resetButton.click()
    await expect(page.getByRole('button',{name:'กำลังส่งลิงก์…',exact:true})).toBeDisabled()
    releaseReset()
    await expect(page.getByRole('status').filter({hasText:'ตรวจอีเมลของคุณ'})).toBeVisible()
    assert.equal(resetRequests,1)
    for(const width of [320,390,1440]) {
      await page.setViewportSize({width,height:960})
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)
      await page.screenshot({path:`outputs/inventory-staging/browser/account-${width}.png`,fullPage:true,animations:'disabled'})
    }
    checks.push('Signed-in actions have12px spacing; account Settings shows authenticated email and blocks duplicate reset requests. Recover request intercepted for UI assertion; no email delivery claimed')
    await page.getByRole('button',{name:'กลับไปตั้งค่า',exact:true}).click()
    stage='english-and-expiry'
    await page.getByRole('button',{name:'ภาษา / Language',exact:true}).click()
    await page.getByRole('combobox',{name:'ภาษา / Language',exact:true}).selectOption('en')
    await expect(page.locator('html')).toHaveAttribute('lang','en')
    await page.getByRole('button',{name:'Back to settings',exact:true}).click()
    await page.getByRole('button',{name:'Account and security',exact:true}).click()
    await expect(page.getByRole('button',{name:'Send password reset link',exact:true})).toBeVisible()
    await expect(page.locator('.settings-account-email dd')).toHaveText(email)
    await page.screenshot({path:'outputs/inventory-staging/browser/account-en-1440.png',fullPage:true,animations:'disabled'})
    assert.equal(await page.evaluate(()=>localStorage.getItem('micro-erp-v1')),'LOCAL_DEMO_MUST_REMAIN_UNCHANGED')
    await db.query('update khonnai_vault.sessions set revoked_at=now() where user_id=$1',[userId])
    await page.reload()
    await expect(page.getByRole('link',{name:'Sign in',exact:true})).toBeVisible({timeout:20_000})
    await expect(page.getByText('KH-CLOUD-BROWSER',{exact:true})).toHaveCount(0)
    checks.push('English account shell works; revoked session closes prior shop data on reload')
    return checks
  } catch(error) {
    await activePage?.screenshot({path:'outputs/inventory-staging/browser/failure.png',fullPage:true,animations:'disabled'}).catch(()=>{})
    console.error(`Inventory browser check failed at ${stage}. Details withheld to avoid fixture credentials.`)
    throw error
  } finally {
    await browser.close()
    await writeFile('outputs/inventory-staging/browser/verification.json',JSON.stringify({checkedAt:new Date().toISOString(),checks,stage},null,2)+'\n')
  }
}
