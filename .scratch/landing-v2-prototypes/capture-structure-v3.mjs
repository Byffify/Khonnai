import { chromium } from '@playwright/test'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
const out='outputs/landing-structure-v3'
await mkdir(out,{recursive:true})
const browser=await chromium.launch({headless:true})
const report=[]
for(const width of [1440,390,320,768]){
  const context=await browser.newContext({viewport:{width,height:width<500?844:1000}})
  const page=await context.newPage();const errors=[]
  page.on('pageerror',e=>errors.push(e.message))
  await page.goto('http://127.0.0.1:5288/d.html')
  await page.evaluate(()=>document.fonts.ready)
  await page.locator('.sme-float img').last().waitFor()
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('.sme-picture img')).every(i=>i.complete&&i.naturalWidth>0))
  assert.equal(await page.locator('[data-motion-toggle]').count(),0)
  assert.equal(await page.locator('[data-replay]').count(),0)
  assert.equal(await page.locator('.questions,.sale-story').count(),0)
  assert.equal(await page.locator('.fit-section,.getting-started').count(),2)
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  assert.equal(await page.locator('.sme-picture img').count(),4)
  if(width===1440||width===390){
    await page.screenshot({path:`${out}/hero-${width}.png`})
    await page.locator('.sme-picture-pin').scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    await page.screenshot({path:`${out}/gallery-${width}.png`})
  }
  const marquee=page.locator('[data-marquee]');await marquee.scrollIntoViewIfNeeded();await marquee.hover()
  assert.equal(await page.locator('[data-marquee-track]').evaluate(e=>getComputedStyle(e).animationPlayState),'paused')
  await page.locator('.cap-group:not(.cap-duplicate) .capability').first().focus()
  assert.equal(await page.locator('[data-marquee-track]').evaluate(e=>getComputedStyle(e).animationName),'none')
  await page.locator('[data-billing="annual"]').click()
  assert.equal(await page.locator('[data-price="basic"]').getAttribute('data-current'),'3,229.20')
  const motion=await page.locator('[data-price="basic"]').evaluate(e=>e.getAnimations({subtree:true}).map(a=>({playState:a.playState,frames:a.effect.getKeyframes().map(f=>({transform:f.transform,opacity:f.opacity}))})))
  assert(motion.length>=1,'price change has real spatial animation')
  if(width===1440)await page.screenshot({path:`${out}/price-transition.png`})
  await page.waitForTimeout(650)
  assert.equal(await page.locator('.price-outgoing').count(),0)
  assert.equal((await page.locator('[data-price="pro"]').innerText()).trim(),'7,549.20')
  if(width===1440||width===390){await page.locator('#pricing').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/pricing-${width}.png`})}
  await page.locator('[data-billing="monthly"]').click();await page.waitForTimeout(60);await page.locator('[data-billing="annual"]').click();await page.waitForTimeout(650)
  assert.equal((await page.locator('[data-price="basic"]').innerText()).trim(),'3,229.20')
  assert.equal(await page.locator('.price-outgoing').count(),0)
  await page.locator('[data-billing="monthly"]').focus();await page.keyboard.press('Tab')
  assert.equal(await page.locator('[data-billing="annual"]').evaluate(e=>e===document.activeElement),true)
  await page.locator('.extra-demo > summary').click();await page.locator('[data-size="L"]').click();await page.locator('[data-color="white"]').click()
  assert.equal((await page.locator('[data-result]').innerText()).trim(),'10')
  await page.locator('.extra-demo > summary').click()
  assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),[])
  assert.deepEqual(errors,[])
  if(width===1440||width===390){await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}scrollTo(0,0)});await page.waitForTimeout(750);await page.screenshot({path:`${out}/full-${width}.png`,fullPage:true})}
  report.push({width,heroImages:4,removedButtons:true,duplicateStoriesRemoved:true,priceAnimations:motion,rapidPriceSwitch:true,keyboardBilling:true,overflow:false,runtimeErrors:errors,storage:'empty',optionalSelection:10})
  console.log('Verified '+width+'px');await context.close()
}
const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'})
const page=await reduced.newPage();await page.goto('http://127.0.0.1:5288/d.html');await page.locator('[data-billing="annual"]').click()
assert.equal((await page.locator('[data-price="basic"]').innerText()).trim(),'3,229.20')
assert.equal(await page.locator('.price-outgoing').count(),0)
assert.equal(await page.locator('[data-marquee]').getAttribute('data-running'),'false')
report.push({reducedMotion:true,priceImmediate:true,activeAnimations:await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)})
await reduced.close()
const recording=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:`${out}/recordings`,size:{width:1440,height:900}}})
const movie=await recording.newPage();await movie.goto('http://127.0.0.1:5288/d.html');await movie.waitForTimeout(800)
for(let i=0;i<8;i++){await movie.mouse.wheel(0,200);await movie.waitForTimeout(180)}
await movie.locator('[data-billing="annual"]').click();await movie.waitForTimeout(800);await movie.locator('[data-billing="monthly"]').click();await movie.waitForTimeout(800);await movie.locator('[data-billing="annual"]').click();await movie.waitForTimeout(800)
const video=movie.video();await recording.close();await video.saveAs(`${out}/gallery-pricing-motion.webm`)
const before=JSON.parse(await readFile('.scratch/landing-v2-prototypes/production-source-before.json','utf8'))
for(const f of before)assert.equal(crypto.createHash('sha256').update(await readFile(f.Path)).digest('hex').toUpperCase(),f.Hash)
report.push({sourceHashesUnchanged:before.length})
await browser.close();await writeFile(`${out}/verification.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report.map(r=>({...r,priceAnimations:r.priceAnimations?'verified':undefined})),null,2))
