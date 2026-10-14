const { chromium } = require('playwright');
(async () => {
  const { emptyState, execute } = await import('../src/domain/inventory.ts');
  let state = emptyState();
  for (let i = 1; i <= 12; i++) {
    const id = 'p' + i;
    state.products.push({ id, code: 'TEST-' + String(i).padStart(2, '0'), unit: 'แพ็ก', photo: '' });
    for (const size of ['M', 'L', 'XL']) for (const color of ['ดำ', 'ขาว']) state.variants.push({ id: id + size + color, productId: id, size, color, contents: '', price: 10000, stock: 12 });
  }
  state = execute(state, { id: 'seed-bill', type: 'sale', customer: 'ลูกค้าทดสอบ', lines: [{ variantId: 'p1Mดำ', quantity: 1 }] });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(data => { if (!localStorage.getItem('micro-erp-v1')) localStorage.setItem('micro-erp-v1', JSON.stringify(data)); }, state);
  await page.goto('http://127.0.0.1:5180/');
  await page.getByLabel('ดูไซซ์ / สีและจัดการ TEST-01').click();
  await page.getByText('เพิ่มสต็อก / ปรับจำนวน', { exact: true }).first().click();
  await page.screenshot({ path: '.audit-qa/fixes-mobile-stock.png', fullPage: true });
  await page.getByRole('button', { name: 'บิล', exact: true }).click();
  await page.getByRole('button', { name: 'สร้างบิล', exact: true }).click();
  await page.getByRole('button', { name: 'เพิ่มรายการสินค้า', exact: true }).click();
  if (await page.getByLabel('สินค้า 1', { exact: true }).inputValue() !== '') throw new Error('Unexpected implicit selection');
  await page.getByLabel('ค้นหารหัสสินค้า', { exact: true }).fill('TEST-12');
  if (await page.getByLabel('สินค้า 1', { exact: true }).locator('option').count() !== 7) throw new Error('Filtering failed');
  await page.getByLabel('สินค้า 1', { exact: true }).selectOption('p12Mดำ');
  await page.getByLabel('จำนวน 1', { exact: true }).fill('13');
  await page.getByRole('button', { name: 'บันทึกการขาย', exact: true }).click();
  await page.getByRole('alert').waitFor();
  const error = await page.getByRole('alert').boundingBox();
  if (error.y < 0 || error.y + error.height > 740) throw new Error('Feedback outside safe viewport');
  await page.screenshot({ path: '.audit-qa/fixes-mobile-error.png' });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({ path: '.audit-qa/fixes-desktop-search.png', fullPage: true });
  await page.getByRole('button', { name: 'คืน/เปลี่ยน', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'ทิ้งข้อมูลที่ยังไม่บันทึก', exact: true }).click();
  await page.getByRole('button', { name: 'เพิ่มรายการสินค้า', exact: true }).click();
  await page.getByLabel('สินค้ารับคืน 1', { exact: true }).selectOption('p1Mดำ');
  await page.getByLabel('จำนวนรับคืน 1', { exact: true }).fill('7');
  await page.getByLabel('อ้างอิงบิลเดิม').selectOption({ label: 'B00001 ลูกค้าทดสอบ' });
  await page.screenshot({ path: '.audit-qa/fixes-return-confirm.png' });
  await page.keyboard.press('Escape');
  if (await page.getByLabel('จำนวนรับคืน 1', { exact: true }).inputValue() !== '7') throw new Error('Draft lost after cancel');
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    if (!await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)) throw new Error('Overflow ' + width);
  }
  console.log('72 variants; filtered selection; visible error; return draft; four widths passed');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
