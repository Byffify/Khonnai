import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { emptyState, execute } from '../../src/domain/inventory.ts'

const out = 'outputs/floating-dock-browser'
mkdirSync(out, { recursive: true })
let state = emptyState()
for (let i = 1; i <= 6; i++) {
  const image = i % 2 ? 'underwear-packs-480.webp' : 'products-480.webp'
  const photo = i <= 4 ? 'data:image/webp;base64,' + readFileSync(`public/landing/${image}`).toString('base64') : ''
  state.products.push({ id: `p${i}`, code: i === 6 ? 'KH-รหัสสินค้าที่ยาวเพื่อทดสอบการตัดบรรทัด-006' : `KH-00${i}`, unit: 'แพ็ก', photo })
  for (const size of ['M', 'L']) for (const color of ['ดำ', 'คละสี']) state.variants.push({ id: `v${i}-${size}-${color}`, productId: `p${i}`, size, color, contents: '', stock: 24, price: 12000 })
}
state = execute(state, { id: 'demo-sale', type: 'sale', customer: 'ลูกค้าตัวอย่าง', lines: [{ variantId: 'v1-M-ดำ', quantity: 2 }] })
state = execute(state, { id: 'demo-reserve', type: 'reserve', customer: 'ผู้จองตัวอย่าง', lines: [{ variantId: 'v2-L-คละสี', quantity: 2 }] })
const report = { provenance: 'Real app captures with synthetic browser-context shop data and existing AI landing photos; no actual shop records accessed', viewports: [], screenshots: [], consoleErrors: [] }
const base = 'http://127.0.0.1:5202'
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5202', '--strictPort'], { windowsHide: true, stdio: 'ignore' })
let browser
async function capture(page, name) {
  const path = `${out}/${name}.png`
  await page.screenshot({ path, fullPage: true, animations: 'disabled' })
  report.screenshots.push(path)
  if (/^th-catalog-(390|1440)$/.test(name)) {
    const viewportPath = `${out}/${name}-viewport.png`
    await page.screenshot({ path: viewportPath, animations: 'disabled' })
    report.screenshots.push(viewportPath)
    await page.evaluate(() => window.scrollTo(0, 200))
    const glassPath = `${out}/${name}-glass.png`
    await page.screenshot({ path: glassPath, animations: 'disabled' })
    report.screenshots.push(glassPath)
    await page.evaluate(() => window.scrollTo(0, 0))
  }
}
try {
  let ready = false
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(`${base}/app`)).ok) { ready = true; break } } catch { /* Server is still starting. */ }
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  assert.ok(ready, 'Vite did not become ready')
  browser = await chromium.launch()
  for (const language of ['th', 'en']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 900 } })
    await context.addInitScript(({ state, language }) => {
      localStorage.setItem('micro-erp-v1', JSON.stringify(state))
      localStorage.setItem('khonnai-language', language)
    }, { state, language })
    const page = await context.newPage()
    page.on('pageerror', error => report.consoleErrors.push(error.message))
    await page.goto(`${base}/app`)
    await page.locator('.catalog-tile').first().waitFor()
    await page.evaluate(() => document.fonts.ready)
    const labels = language === 'th' ? ['สินค้า', 'บิล', 'จอง', 'คืน/เปลี่ยน', 'ตั้งค่า'] : ['Products', 'Bills', 'Reservations', 'Returns / exchange', 'Settings']
    const names = ['catalog', 'bills', 'reservations', 'returns', 'settings']
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      const nav = page.getByRole('navigation')
      for (let i = 0; i < labels.length; i++) {
        await nav.getByRole('button', { name: labels[i], exact: true }).click()
        await page.evaluate(() => window.scrollTo(0, 0))
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${language}/${names[i]}/${width}: overflow`)
        const box = await nav.boundingBox()
        assert.ok(box.x >= 6 && box.x + box.width <= width - 6 && box.y + box.height <= 894, 'Dock must float inside viewport')
        for (const button of await nav.getByRole('button').all()) {
          const target = await button.boundingBox()
          assert.ok(target.height >= 48 && target.width >= 48, `Small navigation target at ${width}`)
        }
        if (width === 390 || width === 1440 || (language === 'en' && width === 320)) await capture(page, `${language}-${names[i]}-${width}`)
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
        const controls = page.locator('main button:visible')
        if (await controls.count()) {
          const last = await controls.last().boundingBox()
          assert.ok(last.y + last.height < box.y, `${names[i]} final control hidden by dock`)
        }
        report.viewports.push(`${language}/${names[i]}/${width}`)
      }
      await nav.getByRole('button', { name: labels[0], exact: true }).click()
      await page.locator('.catalog-tile').first().click()
      assert.equal(await page.locator('.variant').count(), 0, 'Size must not be preselected')
      await page.getByRole('button', { name: 'M', exact: true }).click()
      assert.equal(await page.locator('.variant').count(), 2)
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      if (width === 390 || width === 1440) await capture(page, `${language}-detail-${width}`)
      await page.getByRole('button', { name: language === 'th' ? 'กลับไปดูสินค้า' : 'Back to products', exact: true }).click()
    }
    await page.setViewportSize({ width: 320, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    assert.equal(await page.locator('.catalog-page').evaluate(element => getComputedStyle(element).animationName), 'none')
    await page.getByRole('navigation').getByRole('button').first().focus()
    await page.keyboard.press('Tab')
    assert.ok(await page.getByRole('navigation').getByRole('button').nth(1).evaluate(element => element.matches(':focus-visible')), JSON.stringify(await page.evaluate(() => ({ focused: document.activeElement?.getAttribute('aria-label'), tag: document.activeElement?.tagName, pageHasFocus: document.hasFocus(), nav: [...document.querySelectorAll('nav button')].map(element => ({ label: element.getAttribute('aria-label'), focused: element === document.activeElement, focusVisible: element.matches(':focus-visible') })) }))))
    await page.emulateMedia({ forcedColors: 'active' })
    assert.equal(await page.getByRole('navigation').evaluate(element => getComputedStyle(element).backdropFilter), 'none')
    await context.close()
  }
  assert.equal(report.consoleErrors.length, 0)
  writeFileSync(`${out}/verification.json`, JSON.stringify(report, null, 2))
  console.log(`Verified ${report.viewports.length} page/locale/viewport combinations, detail size selection, targets, final-action clearance, focus, reduced motion and forced colors; ${report.screenshots.length} captures.`)
} finally {
  if (browser) await browser.close()
  server.kill()
}
