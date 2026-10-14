const { chromium } = require('playwright');
(async () => {
  const { emptyState } = await import('../src/domain/inventory.ts');
  const state = emptyState();
  for (const [code, stock] of [['TEST-813', 12], ['TEST-814', 8]]) {
    state.products.push({ id: code, code, unit: 'แพ็ก', photo: '' });
    state.variants.push({ id: code + '-m', productId: code, size: 'M', color: 'ดำ', contents: '', price: 15000, stock });
  }
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', error => { throw error; });
  await page.addInitScript(data => { if (!localStorage.getItem('micro-erp-v1')) localStorage.setItem('micro-erp-v1', JSON.stringify(data)); }, state);
  await page.goto('http://127.0.0.1:5180/');
  await page.evaluate(() => document.fonts.ready);
  console.log('selected font loaded:', await page.evaluate(() => document.fonts.check('18px "IBM Plex Sans Thai Looped"')));
  await page.locator('.product-details > summary').first().hover();
  const hover = await page.locator('.product-card').first().evaluate(card => ({ shadow: getComputedStyle(card).boxShadow, fill: getComputedStyle(card.querySelector('summary')).backgroundColor }));
  if (hover.shadow === 'none' || hover.fill !== 'rgba(0, 0, 0, 0)') throw new Error('Product hover must keep a transparent summary and show an edge shadow');
  const navFill = await page.locator('.app-nav').evaluate(nav => getComputedStyle(nav).backgroundColor);
  if (navFill !== 'rgb(25, 59, 90)') throw new Error('Navigation surface is stale: ' + navFill);
  await page.screenshot({ path: '.audit-qa/hume-product-hover.png', fullPage: true });
  await page.mouse.move(0, 0);
  await page.screenshot({ path: '.audit-qa/redesign-mobile-catalog.png', fullPage: true });
  await page.getByLabel('ดูไซซ์ / สีและจัดการ TEST-813').click();
  await page.screenshot({ path: '.audit-qa/redesign-mobile-expanded.png', fullPage: true });
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const menu of ['สินค้า', 'บิล', 'จอง', 'คืน/เปลี่ยน', 'สำรอง / ข้อมูลร้าน']) {
      await page.getByRole('navigation').getByRole('button', { name: menu, exact: true }).click();
      if (!await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)) throw new Error(`Overflow: ${width} ${menu}`);
      if ([390, 1280].includes(width)) await page.screenshot({ path: `.audit-qa/operate-${width}-${['สินค้า', 'บิล', 'จอง', 'คืน/เปลี่ยน', 'สำรอง / ข้อมูลร้าน'].indexOf(menu)}.png`, fullPage: true });
    }
  }
  await page.getByRole('button', { name: 'สินค้า', exact: true }).click();
  await page.screenshot({ path: '.audit-qa/redesign-production-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'บิล', exact: true }).click();
  await page.getByRole('button', { name: 'สร้างบิล', exact: true }).click();
  await page.getByRole('button', { name: 'เพิ่มรายการสินค้า', exact: true }).click();
  await page.getByLabel('สินค้า 1', { exact: true }).selectOption({ index: 1 });
  await page.getByLabel('จำนวน 1', { exact: true }).fill('3');
  await page.screenshot({ path: '.audit-qa/redesign-production-bill.png', fullPage: true });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'บันทึกการขาย', exact: true }).click();
  await page.getByRole('tab', { name: /B00001/ }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export รูปบิล', exact: true }).click();
  const download = await downloadPromise;
  await download.saveAs('.audit-qa/redesign-production-bill.png-export.png');
  console.log('production pages: 5 pages × 4 widths; bill export; reduced motion save passed');
  await browser.close();
})();
