import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'

const out = 'outputs/landing-smb-hero'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true })
const results = []
for (const width of [1440, 390, 320, 768]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://127.0.0.1:5288/d.html')
  await page.locator('.ref-parallax-image').last().waitFor({ state: 'attached' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => [...document.querySelectorAll('.ref-parallax-image')].every(image => image.complete && image.naturalWidth > 0))
  const sources = await page.locator('.ref-parallax-image').evaluateAll(images => images.map(image => image.getAttribute('src')))
  assert.equal(sources.length, 4)
  assert(sources.every(src => src.startsWith('sme-')))
  assert(sources.includes('sme-underwear-shop.png'))
  assert(sources.includes('sme-underwear-packs.png'))
  assert.equal(await page.locator('.teaser-window img').count(), 4)
  await page.evaluate(() => scrollTo({ top: 1200, behavior: 'instant' }))
  await page.waitForTimeout(200)
  if ([1440, 390].includes(width)) await page.screenshot({ path: `${out}/gallery-${width}.png` })
  await page.locator('#hero-title').scrollIntoViewIfNeeded()
  await page.waitForTimeout(850)
  assert.match(await page.locator('#hero-title').innerText(), /ระบบจัดการสต็อก/)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  const titleFits = await page.locator('#hero-title').evaluate(element => element.scrollWidth <= element.clientWidth)
  assert(titleFits)
  if ([1440, 390].includes(width)) await page.screenshot({ path: `${out}/message-${width}.png` })
  assert.deepEqual(errors, [])
  results.push({ width, sources, titleFits, noHorizontalOverflow: true, errors })
  await context.close()
}
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
const page = await context.newPage()
await page.goto('http://127.0.0.1:5288/d.html')
await page.locator('.ref-static-gallery img').last().waitFor()
assert.equal(await page.locator('.ref-static-gallery img').count(), 4)
await page.locator('#hero-title').scrollIntoViewIfNeeded()
assert.equal(await page.locator('#hero-title').evaluate(element => getComputedStyle(element).opacity), '1')
results.push({ reducedMotion: true, staticGallery: 4, titleVisible: true })
await browser.close()
await writeFile(`${out}/verification.json`, JSON.stringify(results, null, 2))
console.log('PASS SMB hero imagery and inventory heading at 320/390/768/1440px; reduced motion')
