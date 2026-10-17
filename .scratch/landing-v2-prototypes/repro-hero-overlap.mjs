import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
const browser=await chromium.launch({headless:true})
const page=await browser.newPage({viewport:{width:1440,height:900}})
await page.goto('http://127.0.0.1:5288/d.html')
await page.evaluate(()=>document.fonts.ready)
await mkdir('outputs/landing-hero-fix',{recursive:true})
const findings=[]
const version=await page.locator('.ref-hero').count()?'after':'before'
for(const y of [0,300,600,900,1100,1250,1400,1600]){
  await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(100)
  const finding=await page.evaluate(()=>{const c=document.querySelector('.sme-caption,.ref-image-disclosure');if(!c)return null;const a=c.getBoundingClientRect();const hit=Array.from(document.querySelectorAll('.sme-picture img,.ref-parallax-image,.ref-hero-center')).find(i=>{const b=i.getBoundingClientRect();return Number(getComputedStyle(i).opacity)>.01&&a.top<b.bottom&&a.bottom>b.top&&a.left<b.right&&a.right>b.left});return hit?{scrollY,caption:{top:a.top,bottom:a.bottom},image:hit.getAttribute('src')||'ref-hero-center'}:null})
  if(finding){findings.push(finding);await page.screenshot({path:'outputs/landing-hero-fix/before-overlap.png'});break}
}
await writeFile(`outputs/landing-hero-fix/${version}-repro.json`,JSON.stringify(findings,null,2))
console.log(findings.length?'FAIL caption overlaps image: '+JSON.stringify(findings[0]):'PASS no caption/image overlap at sampled positions')
await browser.close()
