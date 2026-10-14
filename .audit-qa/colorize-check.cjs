const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const { emptyState } = await import('../src/domain/inventory.ts');
  const state = emptyState();
  for (const [code, stock] of [['READY', 12], ['EMPTY', 0], ['SHORT', 1]]) {
    state.products.push({ id: code, code, unit: 'แพ็ก', photo: '' });
    state.variants.push({ id: code, productId: code, size: 'M', color: 'ดำ', contents: '', price: 15000, stock });
  }
  state.variants.push({ id: 'READY-L', productId: 'READY', size: 'L', color: 'ขาว', contents: '', price: 15000, stock: 0 });
  state.reservations.push({ id: 'r', customer: 'ทดสอบ', status: 'active', date: new Date().toISOString(), lines: [{ variantId: 'SHORT', quantity: 2 }] });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', error => { throw error; });
  await page.addInitScript(data => localStorage.setItem('micro-erp-v1', JSON.stringify(data)), state);
  await page.goto('http://127.0.0.1:5180/');
  await page.evaluate(() => document.fonts.ready);
  const ready = page.locator('.product-card').filter({ has: page.getByRole('heading', { name: 'READY', exact: true }) });
  assert.equal(await ready.locator('.product-overview .stock-status').innerText(), 'พร้อมขาย');
  assert.equal(await page.locator('.product-overview .stock-status.unavailable').count(), 1);
  assert.equal(await page.locator('.product-overview .stock-status.shortage').count(), 1);
  const colors = await ready.evaluate(card => ({ fill: getComputedStyle(card.querySelector('.product-overview')).backgroundColor, badge: getComputedStyle(card.querySelector('.stock-status')).backgroundColor, ink: getComputedStyle(card.querySelector('.stock-status')).color }));
  assert.deepEqual(colors, { fill: 'rgba(0, 0, 0, 0)', badge: 'rgb(191, 220, 188)', ink: 'rgb(22, 101, 52)' });
  assert.equal(await ready.evaluate(card => getComputedStyle(card).backgroundColor), 'rgb(255, 255, 255)');
  assert.equal(await ready.locator('.stock-summary').evaluate(el => getComputedStyle(el).justifyContent), 'flex-start');
  assert.equal(await ready.locator('.product-overview > .icon').evaluate(el => getComputedStyle(el).alignSelf), 'center');
  function luminance(rgb) { return rgb.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0); }
  const contrast = (fg, bg) => { const a = luminance(fg), b = luminance(bg); return (Math.max(a, b) + .05) / (Math.min(a, b) + .05); };
  const pairs = [['ready', [22,101,52], [191,220,188]], ['empty', [146,64,14], [255,240,227]], ['shortage', [180,35,24], [255,241,240]], ['quantity', [22,101,52], [255,255,255]]];
  for (const [name, fg, bg] of pairs) { const ratio = contrast(fg, bg); assert.ok(ratio >= 4.5, `${name}: ${ratio}`); console.log(`${name} contrast: ${ratio.toFixed(2)}:1`); }
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if ([390,1280].includes(width)) await page.screenshot({ path: `.audit-qa/colorize-${width}.png`, fullPage: true });
  }
  await ready.locator('summary').first().click();
  assert.equal(await ready.locator('.variant .stock-status.ready').count(), 1);
  await ready.getByRole('button', { name: 'L', exact: true }).click();
  assert.equal(await ready.locator('.stock-status.unavailable').count(), 2);
  assert.ok(!(await ready.getAttribute('class')).includes('stock-ready'));
  assert.deepEqual(JSON.parse(await page.evaluate(() => localStorage.getItem('micro-erp-v1'))), state);
  console.log('Four widths, ready/empty/shortage, selected size, icons and unchanged storage passed.');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
