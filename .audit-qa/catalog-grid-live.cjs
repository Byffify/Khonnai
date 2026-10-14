const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const { emptyState } = await import('../src/domain/inventory.ts');
  const state = emptyState();
  for (let i = 1; i <= 8; i++) {
    const code = `TEST-${String(i).padStart(3, '0')}`;
    state.products.push({ id: code, code, unit: 'แพ็ก', photo: '' });
    for (const size of ['M','L']) state.variants.push({ id: code+size, productId: code, size, color: 'คละสี', contents: 'ดำ 1 ขาว 2', price: 10000, stock: 12 });
    state.variants.push({ id: code+'M-black', productId: code, size: 'M', color: 'ดำ', contents: '', price: 10000, stock: 5 });
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => { throw e; });
  await page.addInitScript(data => localStorage.setItem('micro-erp-v1', JSON.stringify(data)), state);
  await page.goto('http://127.0.0.1:5180/');
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320,390,768,1280]) {
    await page.setViewportSize({width,height:900});
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.equal(await page.locator('.product-list').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), width <= 600 ? 2 : width <= 1150 ? 3 : 4);
    assert.equal(await page.locator('.stock-status').count(),0);
    if ([390,1280].includes(width)) await page.screenshot({path:`.audit-qa/catalog-grid-live-${width}.png`,fullPage:true});
  }
  await page.getByLabel('ดูไซซ์ / สีและจัดการ TEST-001').click();
  assert.equal(await page.locator('.variant').count(),0);
  await page.getByRole('button',{name:'M',exact:true}).click();
  assert.equal(await page.locator('.variant-quantity').first().innerText(),'12');
  assert.equal(await page.locator('.variant').count(),2);
  assert.equal(await page.locator('.variant').first().evaluate(el => getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
  for (const width of [320,390,768,1280]) {
    await page.setViewportSize({width,height:900});
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if ([390,1280].includes(width)) await page.screenshot({path:`.audit-qa/catalog-grid-detail-${width}.png`,fullPage:true});
  }
  await page.getByRole('button',{name:'กลับไปดูสินค้า',exact:true}).click();
  await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'ดูไซซ์ / สีและจัดการ TEST-001');
  assert.ok(await page.getByLabel('ดูไซซ์ / สีและจัดการ TEST-001').evaluate(el => el === document.activeElement));
  await page.getByLabel('ค้นหารหัสสินค้า').fill('008');
  assert.equal(await page.locator('.catalog-tile').count(),1);
  assert.deepEqual(JSON.parse(await page.evaluate(() => localStorage.getItem('micro-erp-v1'))),state);
  console.log('Production catalog: four widths, 2/3/4 columns, explicit size, detail, search, return focus and unchanged storage passed.');
  await browser.close();
})().catch(e => {console.error(e); process.exit(1)});
