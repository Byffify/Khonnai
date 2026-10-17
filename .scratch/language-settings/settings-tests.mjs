import fs from 'node:fs';
const p='tests/browser.spec.ts';let s=fs.readFileSync(p,'utf8');
// Existing workflows now enter the relevant settings subpage.
s=s.replace("await page.getByLabel('ชื่อร้านบนบิล', { exact: true }).fill('ร้านจริง ไม่แปลข้อมูล')", "await page.getByRole('button', { name: 'ข้อมูลร้าน', exact: true }).click()\n  await page.getByLabel('ชื่อร้านบนบิล', { exact: true }).fill('ร้านจริง ไม่แปลข้อมูล')");
s=s.replace("const before = await page.evaluate(() => localStorage.getItem('micro-erp-v1'))", "const before = await page.evaluate(() => localStorage.getItem('micro-erp-v1'))\n  await page.getByRole('button', { name: 'กลับไปตั้งค่า', exact: true }).click()\n  await page.getByRole('button', { name: 'ภาษา / Language', exact: true }).click()");
s=s.replaceAll("await expect(page.getByRole('heading', { name: 'Shop details and backup', exact: true })).toBeVisible()", "await expect(page.getByRole('heading', { name: 'ภาษา / Language', exact: true })).toBeVisible()");
s=s.replace("await page.getByRole('button', { name: 'Save shop details', exact: true }).click()", "await page.getByRole('button', { name: 'Back to settings', exact: true }).click()\n  await page.getByRole('button', { name: 'Shop details', exact: true }).click()\n  await expect(page.getByLabel('Shop name on bills', { exact: true })).toBeVisible()\n  await page.getByRole('button', { name: 'Save shop details', exact: true }).click()");
s=s.replace("await page.evaluate(() => { const original = Storage.prototype.setItem", "await page.getByRole('button', { name: 'ภาษา / Language', exact: true }).click()\n  await page.evaluate(() => { const original = Storage.prototype.setItem");
s=s.replace("const backupDownload = page.waitForEvent('download')", "await page.getByRole('button', { name: 'สำรองและกู้ข้อมูล', exact: true }).click()\n  const backupDownload = page.waitForEvent('download')");
s=s.replace("await first.getByLabel('ชื่อร้านบนบิล'", "await first.getByRole('button', { name: 'ข้อมูลร้าน', exact: true }).click()\n    await first.getByLabel('ชื่อร้านบนบิล'");
s=s.replace("await second.getByLabel('ภาษา / Language'", "await second.getByRole('button', { name: 'ภาษา / Language', exact: true }).click()\n    await second.getByLabel('ภาษา / Language'");
fs.writeFileSync(p,s);
