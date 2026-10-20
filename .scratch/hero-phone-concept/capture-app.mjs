import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const out = 'outputs/hero-phone-concept'
await mkdir(`${out}/assets`, { recursive: true })
const source = await readFile('public/landing/underwear-packs-960.webp')
const photo = 'data:image/jpeg;base64,' + (await sharp(source).resize(650, 500, { fit: 'cover' }).jpeg({ quality: 90 }).toBuffer()).toString('base64')
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:5307/app')
  await page.evaluate(async photo => {
    const { emptyState } = await import('/src/domain/inventory.ts')
    const state = emptyState()
    state.shop = { name: 'ร้านตัวอย่าง', phone: '' }
    state.products = [{ id: 'hero-product', code: 'UW-001', unit: 'แพ็ก', photo }]
    state.variants = [
      { id: 'hero-m-mixed', productId: 'hero-product', size: 'M', color: 'คละสี', contents: '6 ตัว / แพ็ก', price: 15000, stock: 12 },
      { id: 'hero-l-mixed', productId: 'hero-product', size: 'L', color: 'คละสี', contents: '6 ตัว / แพ็ก', price: 15000, stock: 18 },
      { id: 'hero-xl-mixed', productId: 'hero-product', size: 'XL', color: 'คละสี', contents: '6 ตัว / แพ็ก', price: 15000, stock: 9 },
    ]
    localStorage.setItem('micro-erp-v1', JSON.stringify(state))
    localStorage.setItem('khonnai-language', 'th')
  }, photo)
  await page.reload()
  await page.locator('.catalog-tile').first().click()
  await page.getByRole('button', { name: 'M', exact: true }).click()
  await page.evaluate(() => document.fonts.ready)
  await page.locator('.photo').first().evaluate(img => img.decode())
  await page.screenshot({ path: `${out}/assets/app-screen.png` })
  const text = await page.locator('body').innerText()
  if (!text.includes('12') || !text.includes('UW-001')) throw new Error('Expected synthetic product was not rendered')
  await writeFile(`${out}/assets/capture-provenance.json`, JSON.stringify({ route: '/app', viewport: { width: 430, height: 932 }, scale: 2, product: 'UW-001', size: 'M', stock: 12, unit: 'แพ็ก', syntheticData: true, capturedAt: new Date().toISOString(), text }, null, 2))
  await context.close()
  const logoPage = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 })
  await logoPage.goto('http://127.0.0.1:5307/landing/')
  await logoPage.setContent(`<!doctype html><html lang="th"><meta charset="utf-8"><style>
    @font-face{font-family:Noto;src:url(http://127.0.0.1:5307/landing/fonts/noto-sans-thai.woff2)}
    *{box-sizing:border-box}body{margin:0;width:430px;height:932px;background:#fff;display:grid;place-content:center;text-align:center;font-family:Noto,sans-serif;color:#193b5a}
    img{width:116px;height:116px;object-fit:contain;margin:0 auto 22px}strong{font-size:39px;letter-spacing:-1.4px;font-weight:700}span{font-size:20px;margin-top:2px}
    </style><img src="http://127.0.0.1:5307/brand/khonnai-mark.png" alt=""><strong>Khonnai</strong><span>คนใน</span></html>`)
  await logoPage.evaluate(() => document.fonts.ready)
  await logoPage.locator('img').evaluate(img => img.decode())
  await logoPage.screenshot({ path: `${out}/assets/logo-screen.png` })
  await logoPage.close()
  console.log('Captured real product detail: UW-001 / M / 12 packs, isolated synthetic store')
} finally { await browser.close() }
