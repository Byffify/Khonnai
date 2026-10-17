const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const stage = process.argv[2];
assert.ok(['before', 'after'].includes(stage));
(async () => {
  const base = 'http://127.0.0.1:5198';
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5198', '--strictPort'], { windowsHide: true, stdio: 'ignore' });
  let browser;
  try {
    let ready = false;
    for (let i = 0; i < 60; i++) {
      try { if ((await fetch(base)).ok) { ready = true; break; } } catch { /* starting */ }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(ready);
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(base);
    await page.evaluate(async () => {
      const { emptyState } = await import('/src/domain/inventory.ts');
      const state = emptyState();
      for (let i = 1; i <= 8; i++) {
        state.products.push({ id: 'p' + i, code: 'KH-00' + i, unit: 'แพ็ก', photo: '' });
        for (const color of ['ดำ', 'คละสี']) state.variants.push({ id: 'v' + i + color, productId: 'p' + i, size: 'M', color, contents: '', price: 12000, stock: 20 });
      }
      localStorage.setItem('micro-erp-v1', JSON.stringify(state));
    });
    const metrics = [];
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      for (const screen of ['catalog', 'detail', 'sale', 'settings']) {
        await page.reload();
        await page.evaluate(() => document.fonts.ready);
        if (screen === 'detail') {
          await page.getByRole('button', { name: 'ดูไซซ์ / สีและจัดการ KH-001', exact: true }).click();
          await page.getByRole('button', { name: 'M', exact: true }).click();
        }
        if (screen === 'sale') {
          await page.getByRole('navigation').getByRole('button', { name: 'บิล', exact: true }).click();
          await page.getByRole('button', { name: 'สร้างบิล', exact: true }).click();
          await page.getByRole('button', { name: 'เพิ่มรายการสินค้า', exact: true }).click();
          await page.getByLabel('สินค้า 1', { exact: true }).selectOption({ index: 1 });
          await page.getByLabel('จำนวน 1', { exact: true }).fill('3');
        }
        if (screen === 'settings') await page.getByRole('button', { name: 'สำรอง / ข้อมูลร้าน', exact: true }).click();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${screen} overflows ${width}`);
        await page.screenshot({ path: `outputs/premium-refinement/${stage}-${screen}-${width}.png`, fullPage: true, animations: 'disabled' });
      }
      metrics.push(await page.locator('.app-nav button').evaluateAll(buttons => buttons.map(button => ({ text: button.textContent, width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height, labelWidth: button.querySelector('span').getBoundingClientRect().width, labelHeight: button.querySelector('span').getBoundingClientRect().height }))));
    }
    fs.writeFileSync(`outputs/premium-refinement/${stage}-metrics.json`, JSON.stringify(metrics, null, 2));
    if (stage === 'after') {
      await page.setViewportSize({ width: 1440, height: 960 });
      await page.goto(base + '/outputs/premium-refinement/index.html');
      await page.locator('#after').evaluate(image => image.decode());
      await page.locator('#before').evaluate(image => image.decode());
      await page.screenshot({ path: 'outputs/premium-refinement/comparison.png', animations: 'disabled' });
    }
    console.log(`${stage}: 4 live-app screens at390/1440, synthetic isolated data, no overflow.`);
  } finally { if (browser) await browser.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
