import { chromium } from '@playwright/test'
const browser=await chromium.launch({headless:true})
const page=await browser.newPage({viewport:{width:320,height:960},reducedMotion:'reduce'})
await page.goto('http://127.0.0.1:5290/en/landing/')
await page.evaluate(()=>{document.documentElement.style.zoom='2'})
console.log(await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,elements:[...document.querySelectorAll('body *')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.right>innerWidth+1&&getComputedStyle(e).position!=='absolute'}).map(e=>({tag:e.tagName,class:e.className,text:e.textContent.slice(0,45),width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right})).slice(0,25)})))
await page.screenshot({path:'outputs/landing-page/zoom-diagnosis.png',fullPage:true})
await browser.close()
