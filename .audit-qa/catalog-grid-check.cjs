const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///D:/Micro-ERP-Inventory/outputs/catalog-grid/index.html');
  await page.evaluate(() => document.fonts.ready);
  assert.ok(await page.evaluate(() => document.fonts.check('18px Thai')));
  for (const width of [320,390,768,1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if ([390,1280].includes(width)) {
      assert.equal(await page.locator('.grid').evaluate(e => getComputedStyle(e).gridTemplateColumns.split(' ').length), width === 390 ? 2 : 4);
      await page.screenshot({ path: `outputs/catalog-grid/${width}.png`, fullPage: true });
    }
  }
  await page.getByRole('button',{name:'เลือกสินค้า TEST-001',exact:true}).click();
  assert.ok(await page.locator('#colors').isHidden());
  await page.getByRole('button',{name:'M',exact:true}).click();
  assert.ok(await page.locator('#colors').isVisible());
  await page.screenshot({path:'outputs/catalog-grid/detail-1280.png',fullPage:true});
  await page.getByRole('button',{name:'กลับไปดูสินค้า'}).click();
  assert.ok(await page.getByRole('button',{name:'เลือกสินค้า TEST-001',exact:true}).evaluate(el=>el===document.activeElement));
  await page.locator('#search').fill('008');
  assert.equal(await page.locator('.product:visible').count(),1);
  console.log('Mockup passed: 4 widths, desktop 4 columns / mobile 2, explicit size reveals details, return focus and search.');
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
