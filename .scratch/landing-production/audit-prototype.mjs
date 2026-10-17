import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
const out=process.argv[2]==='after'?'outputs/landing-parity/after':'outputs/landing-parity'
await mkdir(out,{recursive:true})
const browser=await chromium.launch({headless:true}),report=[]
const sections=['.hero-message','.capabilities','.fit-section','.scroll-demo','.start-carousel-section','.pricing-section','#faq','.closing']
for(const width of [1440,390]){
 for(const [name,url,nav] of [['prototype','http://127.0.0.1:5288/d.html','.nav'],['production','http://127.0.0.1:5291/landing/','.site-nav']]){
  const page=await browser.newPage({viewport:{width,height:1000}}),errors=[];page.on('pageerror',error=>errors.push(error.message))
  await page.goto(url);await page.locator('.ref-hero').waitFor();await page.evaluate(()=>document.fonts.ready)
  const metrics=await page.evaluate(({nav,sections})=>{function metric(selector){const e=document.querySelector(selector);if(!e)return null;const s=getComputedStyle(e),r=e.getBoundingClientRect();return{width:r.width,height:r.height,padding:s.padding,gap:s.gap,font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,background:s.backgroundColor,blur:s.backdropFilter}}return{nav:metric(nav),headline:metric('#hero-title'),toggle:metric('.pricing-billing'),toggleButton:metric('.pricing-billing button'),cards:metric('.start-card'),sections:sections.map(selector=>({selector,...metric(selector)})),sectionOrder:[...document.querySelector('main').children].map(e=>({tag:e.tagName,id:e.id,class:e.className,title:e.querySelector('h1,h2')?.textContent.slice(0,70)})),capabilityIcons:document.querySelectorAll('.capability-track svg,.capability-set svg').length}},{nav,sections})
  for(const selector of sections){
   await page.evaluate(selector=>{const element=document.querySelector(selector);scrollTo({top:element.getBoundingClientRect().top+scrollY-120,behavior:'instant'})},selector)
   await page.waitForTimeout(selector==='.hero-message'?850:100)
   await page.screenshot({path:`${out}/${name}-${selector.slice(1)}-${width}.png`})
  }
  report.push({name,width,errors,...metrics});await page.close()
 }
}
await browser.close();await writeFile(`${out}/metrics.json`,JSON.stringify(report,null,2))
console.log(JSON.stringify(report.map(({name,width,nav,headline,toggle,toggleButton,cards,capabilityIcons,sectionOrder})=>({name,width,nav,headline,toggle,toggleButton,cards,capabilityIcons,sectionOrder}))))
