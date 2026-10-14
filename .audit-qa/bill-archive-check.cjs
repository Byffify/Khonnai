const { chromium } = require('playwright');
(async () => {
  const { emptyState, execute } = await import('../src/domain/inventory.ts');
  let state = emptyState();
  state.products.push({ id: 'p', code: 'TEST-DAILY', unit: 'แพ็ก', photo: '' });
  state.variants.push({ id: 'v', productId: 'p', size: 'M', color: 'ดำ', contents: '', price: 10000, stock: 50 });
  for (let i = 0; i < 12; i++) {
    state = execute(state, { id: 'sale-' + i, type: 'sale', customer: i === 2 ? '' : 'ลูกค้าทดสอบ ' + (i + 1), lines: [{ variantId: 'v', quantity: 1 }] });
    state.bills[0].date = i < 2 ? '2026-10-13T05:00:00Z' : '2026-10-14T05:00:00Z';
  }
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(data => { if (!localStorage.getItem('micro-erp-v1')) localStorage.setItem('micro-erp-v1', JSON.stringify(data)); }, state);
  await page.goto('http://127.0.0.1:5180/');
  await page.getByLabel('ดูไซซ์ / สีและจัดการ TEST-DAILY').click();
  const color = await page.locator('.stock-toggle').evaluate(e => getComputedStyle(e).backgroundColor);
  if (color !== 'rgb(191, 220, 188)') throw new Error('Stock control not green');
  await page.screenshot({ path: '.audit-qa/stock-green-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'บิล', exact: true }).click();
  if (await page.getByRole('img', { name: /บิลเงินสด/ }).count()) throw new Error('Unselected receipts must not render');
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    if (!await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)) throw new Error('Archive overflow ' + width);
    if ([390, 1280].includes(width)) await page.screenshot({ path: `.audit-qa/bill-archive-${width}.png`, fullPage: true });
  }
  await page.getByRole('tab', { name: /B00012/ }).click();
  await page.getByRole('img', { name: 'บิลเงินสด B00012', exact: true }).waitFor();
  if (await page.getByRole('img', { name: /บิลเงินสด/ }).count() !== 1) throw new Error('Only selected receipt should render');
  await page.screenshot({ path: '.audit-qa/bill-archive-selected.png', fullPage: true });
  console.log('12 bills / 2 days; one selected receipt; green stock; four widths passed');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
