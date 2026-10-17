import { chromium } from '@playwright/test';
import { mkdir,writeFile } from 'node:fs/promises';
const out='outputs/landing-pricing-hover';await mkdir(out,{recursive:true});const browser=await chromium.launch();const results=[];
for(const [name,url] of [['thai','http://127.0.0.1:5291/landing/#pricing'],['english','http://127.0.0.1:5291/en/landing/#pricing'],['prototype','http://127.0.0.1:5288/d.html#pricing']]){
 const page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto(url);await page.evaluate(()=>document.fonts.ready);const cards=page.locator('.pricing-card');
 for(let i=0;i<await cards.count();i++){
 const card=cards.nth(i);await card.hover();await page.waitForTimeout(250);const style=await card.evaluate(e=>({opacity:getComputedStyle(e,'::before').opacity,gradient:getComputedStyle(e,'::before').backgroundImage,surface:getComputedStyle(e,'::after').backgroundColor}));if(style.opacity!=='.32'&&style.opacity!=='0.32')throw Error(JSON.stringify(style));if(style.surface!=='rgb(255, 255, 255)')throw Error('Surface changed');results.push({name,card:i,...style});
 }
 await page.screenshot({path:`${out}/${name}-hover.png`});await page.mouse.move(0,0);await cards.first().getByRole('link').first().focus().catch(async()=>{await cards.first().locator('summary').focus()});await page.waitForTimeout(250);
 const focus=await cards.first().evaluate(e=>getComputedStyle(e,'::before').opacity);if(focus!=='0.32')throw Error('Focus shadow missing');
 await page.emulateMedia({reducedMotion:'reduce'});const transition=await cards.first().evaluate(e=>getComputedStyle(e,'::before').transitionDuration);if(transition!=='0s')throw Error('Reduced motion');await page.close();
}
await browser.close();await writeFile(`${out}/verification.json`,JSON.stringify(results,null,2));console.log('Verified all pricing cards: hover gradient, white surface, keyboard focus and reduced motion in Thai, English and prototype.');
