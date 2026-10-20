import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
const browser = await chromium.launch({ channel:'chrome',headless:true })
try {
  const page = await browser.newPage({viewport:{width:390,height:844}})
  await page.goto('http://127.0.0.1:5308/')
  await page.locator('.media-stage').scrollIntoViewIfNeeded()
  await page.waitForFunction(()=>document.querySelector('video').currentTime>.1)
  await page.evaluate(()=>{const spacer=document.createElement('div');spacer.style.height='2000px';document.body.append(spacer);scrollTo(0,document.body.scrollHeight)})
  await page.waitForFunction(()=>document.querySelector('video').paused)
  const time=await page.locator('video').evaluate(v=>v.currentTime)
  for(const hidden of [true,false]) await page.evaluate(hidden=>{Object.defineProperty(document,'hidden',{configurable:true,value:hidden});document.dispatchEvent(new Event('visibilitychange'))},hidden)
  assert(await page.locator('video').evaluate(v=>v.paused),'must stay paused while stage is offscreen')
  await page.locator('.media-stage').scrollIntoViewIfNeeded()
  await page.waitForFunction(()=>!document.querySelector('video').paused,undefined,{timeout:2500})
  assert(await page.locator('video').evaluate((v,t)=>v.currentTime>=t,time),'resume without restarting')
  await page.getByRole('button',{name:'หยุดวิดีโอ',exact:true}).click()
  await page.evaluate(()=>scrollTo(0,document.body.scrollHeight))
  for(const hidden of [true,false]) await page.evaluate(hidden=>{Object.defineProperty(document,'hidden',{configurable:true,value:hidden});document.dispatchEvent(new Event('visibilitychange'))},hidden)
  await page.locator('.media-stage').scrollIntoViewIfNeeded()
  await page.waitForTimeout(150)
  assert(await page.locator('video').evaluate(v=>v.paused),'explicit user pause must remain paused')
  console.log('PASS: offscreen + tab visibility resumes correctly; explicit pause stays paused')
} finally {await browser.close()}
