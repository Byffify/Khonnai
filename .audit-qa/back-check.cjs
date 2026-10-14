const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
  const {emptyState,execute}=await import('../src/domain/inventory.ts');
  let state=emptyState();
  state.products.push({id:'p',code:'TEST-BACK',unit:'แพ็ก',photo:''});
  state.variants.push({id:'v',productId:'p',size:'M',color:'ดำ',contents:'',stock:10,price:10000});
  state=execute(state,{id:'sale',type:'sale',customer:'ทดสอบ',lines:[{variantId:'v',quantity:1}]});
  const browser=await chromium.launch();const page=await browser.newPage();
  await page.addInitScript(data=>localStorage.setItem('micro-erp-v1',JSON.stringify(data)),state);
  await page.goto('http://127.0.0.1:5180/');
  async function check(name,width){
    const back=page.locator('.back-button');assert.equal(await back.count(),1);
    const b=await back.boundingBox(),h=await page.locator('.page-header h1').boundingBox();
    assert.ok(b.height>=48&&b.y+b.height<=h.y&&Math.abs(b.x-h.x)<=12);
    assert.equal(await back.innerText(),'กลับ');assert.ok(await back.locator('svg').count());
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if(width===390)await page.screenshot({path:`.audit-qa/back-${name}.png`,fullPage:true});
  }
  for(const width of [320,390,1280]){
    await page.setViewportSize({width,height:900});
    await page.getByRole('navigation').getByRole('button',{name:'สินค้า',exact:true}).click();
    assert.equal(await page.locator('.back-button').count(),0);
    await page.getByLabel('ดูไซซ์ / สีและจัดการ TEST-BACK').click();await check('detail',width);
    await page.getByRole('button',{name:'แก้สินค้า',exact:true}).click();await check('edit-product',width);
    await page.locator('.back-button').click();
    await page.getByRole('button',{name:'เพิ่มสินค้า',exact:true}).click();await check('add-product',width);
    await page.locator('.back-button').click();
    await page.getByRole('navigation').getByRole('button',{name:'บิล',exact:true}).click();
    await page.getByRole('button',{name:'สร้างบิล',exact:true}).click();await check('add-bill',width);
    await page.locator('.back-button').click();
    await page.getByRole('tab',{name:/B00001/}).click();
    await page.getByRole('button',{name:'แก้บิล',exact:true}).click();await check('edit-bill',width);
    await page.locator('.back-button').click();
    await page.getByRole('navigation').getByRole('button',{name:'จอง',exact:true}).click();
    await page.getByRole('button',{name:'จองสินค้า',exact:true}).click();await check('reserve',width);
    await page.locator('.back-button').click();
  }
  assert.deepEqual(JSON.parse(await page.evaluate(()=>localStorage.getItem('micro-erp-v1'))),state);
  await browser.close();console.log('Six secondary screens × three widths: arrow/text above title, 48px hit area, no overflow; primary has no back, stored data unchanged.');
})().catch(e=>{console.error(e);process.exit(1)});
