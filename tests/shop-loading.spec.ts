import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { emptyState } from '../src/domain/inventory'

async function holdApp(page: Page) {
  let release: (() => void) | undefined
  const gate = new Promise<void>(resolve => { release = resolve })
  await page.route(url => url.pathname === '/src/App.tsx', async route => {
    await gate
    await route.continue().catch(() => undefined)
  })
  return () => release?.()
}

test('real Suspense shows the existing brand and completes as soon as the app is available', async ({ page }) => {
  const original = JSON.stringify(emptyState())
  await page.addInitScript(value => localStorage.setItem('micro-erp-v1', value), original)
  const release = await holdApp(page)
  try {
    await page.goto('/app', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('status')).toHaveText('กำลังเปิดคนใน…')
    await expect(page.locator('.shop-loading .brand-logo')).toBeVisible()
    const statusBox = await page.getByRole('status').boundingBox()
    expect(statusBox?.width).toBe(1)
    expect(statusBox?.height).toBe(1)
    await expect(page.locator('.shop-loading .brand')).toHaveText('Khonnai')
    expect(await page.evaluate(() => localStorage.getItem('micro-erp-v1'))).toBe(original)
    expect(await page.locator('.shop-loading').getByRole('button').count()).toBe(0)
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 960 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await page.screenshot({ path: 'outputs/shop-loading-motion/loading-' + width + '.png', animations: 'disabled' })
    }
  } finally { release() }
  await expect(page.getByRole('heading', { name: 'สินค้า', exact: true })).toBeVisible()
  await expect(page.locator('.shop-loading')).toHaveCount(0)
  expect(await page.evaluate(() => localStorage.getItem('micro-erp-v1'))).toBe(original)
})

test('motion moves the mascot while reduced motion keeps a static readable loading state', async ({ page }) => {
  const release = await holdApp(page)
  try {
    await page.goto('/app', { waitUntil: 'domcontentloaded' })
    const logo = page.locator('.shop-loading .brand-logo')
    await expect(logo).toBeVisible()
    const positions = await logo.evaluate(element => {
      const animation = element.getAnimations()[0]
      if (!animation) return []
      animation.pause()
      animation.currentTime = 0
      const first = getComputedStyle(element).transform
      animation.currentTime = 720
      const second = getComputedStyle(element).transform
      return [first, second]
    })
    expect(positions).toHaveLength(2)
    expect(positions[0]).not.toBe(positions[1])
    await page.emulateMedia({ reducedMotion: 'reduce' })
    expect(await logo.evaluate(element => getComputedStyle(element).animationName)).toBe('none')
    expect(await page.locator('.shop-loading-signals span').first().evaluate(element => getComputedStyle(element).animationName)).toBe('none')
    await expect(page.getByRole('status')).toHaveText('กำลังเปิดคนใน…')
    await page.screenshot({ path: 'outputs/shop-loading-motion/reduced-motion.png' })
  } finally { release() }
})

test('English loading uses the same brand without touching the stored shop', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('khonnai-language', 'en'))
  const release = await holdApp(page)
  try {
    await page.goto('/app', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('status')).toHaveText('Opening Khonnai…')
    expect(await page.evaluate(() => localStorage.getItem('micro-erp-v1'))).toBeNull()
    await page.screenshot({ path: 'outputs/shop-loading-motion/english.png' })
  } finally { release() }
})
