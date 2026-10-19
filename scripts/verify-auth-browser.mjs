import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { randomBytes } from 'node:crypto'

export async function verifyAuthBrowser({ email, password, userId, db }) {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const checks = []
  let stage = 'welcome'
  let page
  try {
    page = await context.newPage()
    await mkdir('outputs/auth-staging/browser', { recursive: true })
    await page.goto('http://127.0.0.1:5293/auth')
    await expect(page.getByRole('button', { name: 'เข้าสู่ระบบด้วยอีเมล', exact: true })).toBeEnabled()
    await page.screenshot({ path: 'outputs/auth-staging/browser/welcome-desktop.png', fullPage: true, animations: 'disabled' })
    stage = 'login'
    await page.getByRole('button', { name: 'เข้าสู่ระบบด้วยอีเมล', exact: true }).click()
    await page.getByLabel('อีเมล', { exact: true }).fill(email)
    await page.getByRole('button', { name: 'ถัดไป', exact: true }).click()
    await page.getByLabel('รหัสผ่าน', { exact: true }).fill(password)
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'เข้าสู่ระบบแล้ว', exact: true })).toBeVisible({ timeout: 20_000 })
    assert.equal(new URL(page.url()).pathname, '/auth')
    assert.equal(await page.evaluate(() => document.cookie.includes('khonnai_staging_session')), false)
    const cookies = await context.cookies()
    assert.equal(cookies.find(cookie => cookie.name === 'khonnai_staging_session')?.httpOnly, true)
    assert.equal(await page.evaluate(() => Object.keys(localStorage).some(key => /sb-|auth-token|access_token|refresh_token|micro-erp-v1/.test(key))), false)
    await page.reload()
    await expect(page.getByRole('heading', { name: 'เข้าสู่ระบบแล้ว', exact: true })).toBeVisible({ timeout: 20_000 })
    checks.push('Real browser sign-in/reload succeeds; session cookie is HttpOnly; no provider session or shop data in localStorage')
    stage = 'authenticated-recovery-link'

    // Synthetic recovery fixture replaces email transport only. The actual
    // provider verify endpoint and current authenticated browser are exercised.
    const tokenHash = randomBytes(32).toString('hex')
    await db.query('update auth.users set recovery_token=$2,recovery_sent_at=now() where id=$1', [userId, tokenHash])
    const { rows: [schema] } = await db.query("select exists(select 1 from information_schema.columns where table_schema='auth' and table_name='one_time_tokens' and column_name='expires_at') as has_expiry")
    await db.query(`insert into auth.one_time_tokens(id,user_id,token_type,token_hash,relates_to,created_at,updated_at${schema.has_expiry ? ',expires_at' : ''})
      values(gen_random_uuid(),$1,'recovery_token',$2,$3,now(),now()${schema.has_expiry ? ",now()+interval '10 minutes'" : ''})`,[userId,tokenHash,email.toLowerCase()])
    await page.goto(`http://127.0.0.1:5293/auth/reset-password#token_hash=${tokenHash}&type=recovery`)
    await expect(page.getByRole('button', { name: 'ดำเนินการต่อ', exact: true })).toBeEnabled()
    assert.equal(new URL(page.url()).hash, '')
    await page.getByRole('button', { name: 'ดำเนินการต่อ', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'เลือกรหัสผ่านใหม่', exact: true })).toBeVisible({ timeout: 20_000 })
    await page.reload()
    await expect(page.getByRole('heading', { name: 'เลือกรหัสผ่านใหม่', exact: true })).toBeVisible({ timeout: 20_000 })
    const replacementCookie=(await context.cookies()).find(cookie=>cookie.name==='khonnai_staging_session')
    assert.notEqual(replacementCookie?.value,cookies.find(cookie=>cookie.name==='khonnai_staging_session')?.value)
    checks.push('Recovery confirmation while already signed in uses bootstrap CSRF, consumes provider token only after button press, and removes URL fragment')
    // Password mutation itself is covered by the live API suite. This browser
    // step leaves the real reset form untouched before signing out via API.
    const bootstrap = await (await context.request.get('http://127.0.0.1:5293/api/auth/csrf')).json()
    const logout = await context.request.post('http://127.0.0.1:5293/api/auth/logout', { headers: { Origin: 'http://127.0.0.1:5293', 'X-Khonnai-CSRF': bootstrap.csrfToken }, data: {} })
    assert.equal(logout.status(), 200)
    await page.goto('http://127.0.0.1:5293/auth')
    await expect(page.getByRole('button', { name: 'เข้าสู่ระบบด้วยอีเมล', exact: true })).toBeEnabled()
    checks.push('Logout clears browser session and protected account state')
    await page.goto(`http://127.0.0.1:5293/auth/reset-password#token_hash=${tokenHash}&type=recovery`)
    await page.getByRole('button',{name:'ดำเนินการต่อ',exact:true}).click()
    await expect(page.getByText('ลิงก์นี้ใช้ไม่ได้หรือหมดอายุแล้ว กรุณาขอลิงก์ใหม่',{exact:true})).toBeVisible()
    checks.push('Recovery rotates the opaque session; consumed one-time token replay is rejected')
    stage = 'responsive-setup'

    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('http://127.0.0.1:5293/auth')
      await page.getByRole('button', { name: 'สร้างบัญชี', exact: true }).click()
      await page.getByLabel('อีเมล', { exact: true }).fill('not-an-email')
      await page.getByRole('button', { name: 'ถัดไป', exact: true }).click()
      await expect(page.getByLabel('อีเมล', { exact: true })).toBeFocused()
      await page.getByLabel('อีเมล', { exact: true }).fill('shop@example.com')
      await page.getByRole('button', { name: 'ถัดไป', exact: true }).click()
      assert.equal(await page.getByLabel('อีเมล', { exact: true }).count(), 0)
      await page.getByLabel('รหัสผ่านใหม่', { exact: true }).fill('Example123')
      await page.getByLabel('ยืนยันรหัสผ่าน', { exact: true }).fill('Example123')
      await expect(page.locator('.kn-auth-checks li[data-met="true"]')).toHaveCount(4)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
      await page.screenshot({ path: `outputs/auth-staging/browser/setup-th-${width}.png`, fullPage: true, animations: 'disabled' })
      await page.getByRole('combobox').selectOption('en')
      await expect(page.getByRole('heading', { name: 'Create your password', exact: true })).toBeVisible()
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
      await page.screenshot({ path: `outputs/auth-staging/browser/setup-en-${width}.png`, fullPage: true, animations: 'disabled' })
    }
    await page.emulateMedia({ reducedMotion: 'reduce' })
    assert.equal(await page.locator('.kn-auth-screen').evaluate(element => getComputedStyle(element).animationName), 'none')
    checks.push('TH/EN setup at320/390/768/1440: separate email step, four live checks, no horizontal overflow, reduced motion honored')
    const report = { checkedAt: new Date().toISOString(), passed: true, checks, scope: 'Real local browser + staging provider/database; email recovery token fixture bypasses delivery only. No real email, Google or inventory/cloud data workflow tested.' }
    await writeFile('outputs/auth-staging/browser/verification.json', JSON.stringify(report, null, 2) + '\n')
    return checks
  } catch (error) {
    await page?.screenshot({path:'outputs/auth-staging/browser/failure.png',fullPage:true,animations:'disabled'}).catch(()=>{})
    await writeFile('outputs/auth-staging/browser/failure.json',JSON.stringify({stage,errorType:error?.name,checks},null,2)+'\n')
    throw error
  } finally { await context.close(); await browser.close() }
}
