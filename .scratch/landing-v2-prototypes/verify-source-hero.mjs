import { chromium } from '@playwright/test'
import {mkdir,writeFile,readFile} from 'node:fs/promises'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
const out='outputs/landing-hero-fix';await mkdir(out,{recursive:true})
const browser=await chromium.launch({headless:true});const report=[]
for(const width of [1440,390,320,768]){
 const height=width<500?844:900,context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[]
 page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5288/d.html');await page.locator('.ref-hero-center').waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250)
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 const initial=await page.locator('.ref-hero-center').evaluate(e=>({clip:getComputedStyle(e).clipPath,size:getComputedStyle(e).backgroundSize,opacity:getComputedStyle(e).opacity,height:e.getBoundingClientRect().height}))
 assert.match(initial.clip,/25% 25%, 75% 25%, 75% 75%, 25% 75%/);assert.equal(initial.height,height)
 const heading=await page.locator('#hero-title').boundingBox();assert(heading.y>=height,'headline absent from initial frame')
 assert.equal(await page.locator('.ref-parallax-image').count(),4)
 if(width===1440||width===390)await page.screenshot({path:`${out}/initial-${width}.png`})
 const phases=[]
 for(const y of [300,700,900,1100,1500,1800,2000,2350]){
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(150)
  const state=await page.evaluate(()=>{const c=document.querySelector('.ref-image-disclosure'),r=c.getBoundingClientRect(),center=document.querySelector('.ref-hero-center');const images=[center,...document.querySelectorAll('.ref-parallax-image')];const overlap=images.some(e=>{const s=getComputedStyle(e),b=e.getBoundingClientRect();return Number(s.opacity)>.01&&r.top<b.bottom&&r.bottom>b.top&&r.left<b.right&&r.right>b.left});return{scrollY,clip:getComputedStyle(center).clipPath,size:getComputedStyle(center).backgroundSize,opacity:getComputedStyle(center).opacity,overlap}})
  assert.equal(state.overlap,false,'caption never intersects a visible image');phases.push(state)
  if((width===1440||width===390)&&[700,1500,2350].includes(y))await page.screenshot({path:`${out}/scroll-${y}-${width}.png`})
 }
 assert.match(phases.find(s=>s.scrollY===1500).clip,/0% 0%, 100% 0%, 100% 100%, 0% 100%/)
 assert.equal(Number(phases.find(s=>s.scrollY===2000).opacity),0)
 const borders=await page.locator('.pricing-card').evaluateAll(es=>es.map(e=>({border:getComputedStyle(e).borderTopWidth,background:getComputedStyle(e).backgroundColor,shadow:getComputedStyle(e).boxShadow})))
 assert(borders.every(b=>parseFloat(b.border)>=1));assert(borders.every(b=>b.background==='rgb(255, 255, 255)'));assert(borders.every(b=>b.shadow==='none'))
 const nav=await page.locator('.nav').evaluate(e=>({blur:getComputedStyle(e).backdropFilter,background:getComputedStyle(e).backgroundColor}))
 assert(nav.blur.includes('blur(24px)'))
 await page.locator('[data-billing="annual"]').click();await page.waitForTimeout(600);assert.equal((await page.locator('[data-price="basic"]').innerText()).trim(),'3,229.20')
 if(width===1440||width===390){await page.locator('#pricing').scrollIntoViewIfNeeded();await page.waitForTimeout(250);await page.screenshot({path:`${out}/pricing-${width}.png`})}
 await page.locator('[data-billing="monthly"]').click();await page.waitForTimeout(60);await page.locator('[data-billing="annual"]').click();await page.waitForTimeout(600);assert.equal((await page.locator('[data-price="pro"]').innerText()).trim(),'7,549.20')
 assert.equal(await page.locator('[data-motion-toggle],[data-replay]').count(),0)
 await page.locator('.extra-demo > summary').click();await page.locator('[data-size="L"]').click();await page.locator('[data-color="white"]').click();assert.equal((await page.locator('[data-result]').innerText()).trim(),'10')
 assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),[]);assert.deepEqual(errors,[])
 report.push({width,initial,headingBelowFold:true,phases,borders,nav,priceSwitch:true,optionalDemo:10,errors,storage:'empty'});console.log('Verified '+width+'px');await context.close()
}
const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),rp=await reduced.newPage();await rp.goto('http://127.0.0.1:5288/d.html');await rp.locator('.ref-static-shop').waitFor();assert.equal(await rp.locator('.ref-parallax-image').count(),0);assert.equal(await rp.locator('.ref-static-gallery img').count(),4);await rp.locator('#hero-title').scrollIntoViewIfNeeded();assert.equal(await rp.locator('#hero-title').evaluate(e=>getComputedStyle(e).opacity),'1');report.push({reducedMotion:true,staticGallery:4,headingVisible:true});await reduced.close()
const recording=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:`${out}/recordings`,size:{width:1440,height:900}}}),movie=await recording.newPage();await movie.goto('http://127.0.0.1:5288/d.html');await movie.locator('.ref-hero-center').waitFor();await movie.waitForTimeout(800)
for(let i=0;i<12;i++){await movie.mouse.wheel(0,220);await movie.waitForTimeout(300)}await movie.waitForTimeout(1000);const video=movie.video();await recording.close();await video.saveAs(`${out}/source-hero-motion.webm`)
const before=JSON.parse(await readFile('.scratch/landing-v2-prototypes/production-source-before.json','utf8'));for(const f of before)assert.equal(crypto.createHash('sha256').update(await readFile(f.Path)).digest('hex').toUpperCase(),f.Hash);report.push({productionSourceUnchanged:before.length})
await browser.close();await writeFile(`${out}/verification.json`,JSON.stringify(report,null,2));console.log('PASS source hero, no caption/image overlap, all pricing borders, glass nav, reduced motion, unchanged app source')
