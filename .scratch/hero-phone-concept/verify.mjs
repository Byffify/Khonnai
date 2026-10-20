import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { writeFile, mkdir, stat } from 'node:fs/promises'

const output = 'outputs/hero-phone-concept'
const url = 'http://127.0.0.1:5308/'
await mkdir(`${output}/verification`, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const results = []
try {
  for (const width of [320,390,768,1440]) {
    const context = await browser.newContext({ viewport: { width, height: 960 }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto(url)
    await page.evaluate(() => document.fonts.ready)
    await page.locator('.poster').evaluate(img => img.decode())
    const headingContrast=await page.locator('h1>span').evaluate(element=>{
      const rgb=getComputedStyle(element).color.match(/[\d.]+/g).slice(0,3).map(Number)
      const linear=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4})
      return 1.05/(linear[0]*.2126+linear[1]*.7152+linear[2]*.0722+.05)
    })
    assert(headingContrast>=3,'large heading contrast must remain readable on white')
    for (const zoom of [1,2]) {
      await page.evaluate(zoom => { document.documentElement.style.zoom = String(zoom) }, zoom)
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width} overflow at zoom ${zoom}`)
      const layout = await page.evaluate(() => {
        const copy = document.querySelector('.hero-copy').getBoundingClientRect()
        const stage = document.querySelector('.media-stage').getBoundingClientRect()
        const title = document.querySelector('h1')
        return { copy: { bottom: copy.bottom, right: copy.right }, stage: { top: stage.top, left: stage.left }, titleFits: title.scrollWidth <= title.clientWidth + 1 }
      })
      assert(layout.titleFits, `${width} title does not fit at zoom ${zoom}`)
      if (width/zoom <= 800) assert(layout.stage.top >= layout.copy.bottom - 17, 'mobile media overlaps text')
      await page.screenshot({ path: `${output}/verification/hero-${width}-${zoom * 100}.png`, fullPage: true })
      results.push({ width, zoom: zoom * 100, noOverflow: true, titleFits: true })
    }
    assert.equal(await page.locator('video source').count(),0,'reduced motion must not download the clip')
    assert(await page.locator('.poster').isVisible())
    assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), [])
    assert.deepEqual(errors, [])
    await context.close()
  }
  {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
    const page = await context.newPage(); await page.goto(url)
    assert(await page.locator('.poster').isVisible())
    assert(await page.getByRole('heading', {level:1}).isVisible())
    assert.equal(await page.locator('.playback').isVisible(),false)
    await page.screenshot({ path:`${output}/verification/no-js.png`,fullPage:true })
    results.push({ noJavaScript: true, posterAndActions: true })
    await context.close()
  }
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 } })
    const page = await context.newPage(); const errors=[]
    page.on('pageerror',e=>errors.push(e.message))
    await page.goto(url)
    await page.waitForFunction(() => document.querySelector('video').ended, { timeout:15000 })
    const metadata = await page.locator('video').evaluate(v => ({ duration:v.duration,width:v.videoWidth,height:v.videoHeight,muted:v.muted,loop:v.loop,playsInline:v.playsInline,audioTracks:v.audioTracks?.length??null }))
    assert(Math.abs(metadata.duration-6)<.05)
    assert.equal(metadata.width,1280); assert.equal(metadata.height,1280)
    assert.equal(metadata.loop,false); assert.equal(metadata.muted,true); assert.equal(metadata.playsInline,true)
    assert.equal(await page.locator('video').getAttribute('data-ready'),null)
    await page.screenshot({path:`${output}/verification/desktop-final.png`,fullPage:true})
    await page.getByRole('button',{name:'เล่นอีกครั้ง',exact:true}).focus()
    await page.keyboard.press('Enter')
    await page.waitForFunction(()=>!document.querySelector('video').paused&&document.querySelector('video').currentTime<2)
    await page.getByRole('button',{name:'หยุดวิดีโอ',exact:true}).click()
    const paused=await page.locator('video').evaluate(v=>v.currentTime)
    await page.getByRole('button',{name:'เล่นต่อ',exact:true}).click()
    assert(await page.locator('video').evaluate((v,t)=>v.currentTime>=t,paused))
    await page.emulateMedia({reducedMotion:'reduce'})
    assert(await page.locator('video').evaluate(v=>v.paused))
    assert.equal(await page.locator('video').isVisible(),false)
    assert.deepEqual(errors,[])
    results.push({ playback:metadata, finalPoster:true, keyboardReplay:true, pauseResume:true, dynamicReducedMotion:true, errors })
    await context.close()
  }
  for (const ext of ['mp4','webm']) {
    const context=await browser.newContext()
    const page=await context.newPage()
    await page.goto(url)
    const metadata=await page.evaluate(async ext=>{
      const v=document.createElement('video');v.muted=true;v.src=`hero-phone.${ext}`
      await new Promise((resolve,reject)=>{v.onloadeddata=resolve;v.onerror=()=>reject(new Error('Decode failed'));v.load()})
      v.currentTime=5.9
      await new Promise(resolve=>{v.onseeked=resolve})
      return {duration:v.duration,width:v.videoWidth,height:v.videoHeight,readyState:v.readyState}
    },ext)
    assert(Math.abs(metadata.duration-6)<.05);assert.equal(metadata.readyState,4)
    results.push({file:`hero-phone.${ext}`,bytes:(await stat(`${output}/hero-phone.${ext}`)).size,decode:metadata})
    await context.close()
  }
  {
    const context=await browser.newContext({viewport:{width:390,height:844}})
    const page=await context.newPage()
    await page.route('**/hero-phone.mp4',route=>route.abort())
    await page.route('**/hero-phone.webm',route=>route.abort())
    await page.goto(url)
    await page.waitForTimeout(1200)
    assert.equal(await page.locator('video').getAttribute('data-ready'),null)
    assert(await page.locator('.poster').isVisible())
    assert(await page.getByRole('link',{name:'เริ่มใช้งานคนใน',exact:true}).last().isVisible())
    results.push({failedMedia:true,posterAndCTA:true})
    await context.close()
  }
  await writeFile(`${output}/verification/report.json`,JSON.stringify(results,null,2))
  console.log(JSON.stringify(results,null,2))
} finally { await browser.close() }
