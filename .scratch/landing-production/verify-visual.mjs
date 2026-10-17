import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const out='outputs/landing-production'
await mkdir(out,{recursive:true})
const browser=await chromium.launch({headless:true})
const report=[]
for(const language of ['th','en']){
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[]
  page.on('pageerror',error=>errors.push(error.message))
  await page.goto(`http://127.0.0.1:5290/${language==='en'?'en/':''}landing/`)
  await page.locator('.ref-parallax-image').last().waitFor({state:'attached'})
  await page.evaluate(()=>document.fonts.ready)
  await page.locator('#hero-title').scrollIntoViewIfNeeded()
  const font=await page.locator('#hero-title').evaluate(element=>({family:getComputedStyle(element).fontFamily,size:getComputedStyle(element).fontSize}))
  assert(font.family.includes('Noto Sans'))
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  if([390,1440].includes(width))await page.screenshot({path:`${out}/${language}-headline-${width}.png`})
  await page.locator('#start-title').scrollIntoViewIfNeeded()
  const keyword=page.locator('#start-title .keyword-sweep')
  await page.waitForFunction(()=>document.querySelector('#start-title .keyword-sweep').dataset.active==='true')
  const motion=await keyword.evaluate(element=>{const s=getComputedStyle(element),r=element.getBoundingClientRect();return{timing:s.animationTimingFunction,iteration:s.animationIterationCount,nowrap:s.whiteSpace,width:r.width,container:element.closest('.start-heading').getBoundingClientRect().width,keyframes:element.getAnimations()[0]?.effect.getKeyframes().map(frame=>frame.backgroundPosition??(frame.backgroundPositionX+' '+frame.backgroundPositionY))}})
  assert.equal(motion.timing,'linear');assert.equal(motion.iteration,'infinite');assert.equal(motion.nowrap,'nowrap');assert(motion.width<=motion.container+1);assert.deepEqual(motion.keyframes,['0% 50%','-200% 50%'])
  if([390,1440].includes(width))await page.screenshot({path:`${out}/${language}-carousel-${width}.png`})
  await page.evaluate(()=>{document.documentElement.style.zoom='2'})
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${language} ${width}px zoom overflow`)
  assert.deepEqual(errors,[])
  report.push({language,width,font,motion,noOverflow:true,zoom200:true,errors})
  await context.close()
 }
}
const context=await browser.newContext({viewport:{width:390,height:960},reducedMotion:'reduce'}),page=await context.newPage()
await page.goto('http://127.0.0.1:5290/landing/')
await page.locator('#start-title').scrollIntoViewIfNeeded()
assert.equal(await page.locator('#start-title .keyword-sweep').evaluate(element=>getComputedStyle(element).animationName),'none')
await page.emulateMedia({forcedColors:'active'})
assert.equal(await page.locator('#start-title .keyword-sweep').evaluate(element=>getComputedStyle(element).backgroundImage),'none')
report.push({reducedMotion:true,forcedColors:true})
await context.close()
const videoContext=await browser.newContext({viewport:{width:1440,height:960},recordVideo:{dir:`${out}/recordings`,size:{width:1440,height:960}}}),videoPage=await videoContext.newPage()
await videoPage.goto('http://127.0.0.1:5290/landing/#data')
await videoPage.locator('#start-title').scrollIntoViewIfNeeded()
await videoPage.waitForTimeout(4000)
const video=videoPage.video();await videoContext.close();await video.saveAs(`${out}/keyword-motion.webm`)
await browser.close()
await writeFile(`${out}/verification.json`,JSON.stringify(report,null,2))
console.log('PASS TH/EN: Noto, large heading, continuous left-to-right keywords, nowrap, 320/390/768/1440px, 200% zoom, reduced motion, forced colors')
