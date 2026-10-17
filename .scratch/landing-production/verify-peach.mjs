import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const out='outputs/landing-parity/peach-correction';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});const report=[];
for(const width of [1440,390])for(const [name,url] of [['prototype','http://127.0.0.1:5288/d.html'],['production','http://127.0.0.1:5291/landing/'],['english','http://127.0.0.1:5291/en/landing/']]){
const page=await browser.newPage({viewport:{width,height:900}});await page.goto(url);await page.evaluate(()=>document.fonts.ready);
const closing=page.locator('.closing');const color=await closing.evaluate(e=>getComputedStyle(e).backgroundColor);
if(color!=='rgb(255, 240, 228)')throw Error(name+': '+color);
if(await page.getByText('Prototype D · Hero',{exact:false}).count())throw Error('Prototype label restored');
await closing.screenshot({path:`${out}/${name}-${width}.png`});report.push({name,width,color});await page.close();}
await browser.close();await writeFile(`${out}/verification.json`,JSON.stringify(report,null,2));console.log(report);
