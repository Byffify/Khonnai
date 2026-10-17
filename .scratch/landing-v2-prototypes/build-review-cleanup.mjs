import { readFile, writeFile } from 'node:fs/promises'
const file='.scratch/landing-v2-prototypes/d.html'
let html=await readFile(file,'utf8')
html=html.replace(/<details class="extra-demo"[\s\S]*?<\/details>/,'')
html=html.replace(/<p class="teaser-disclosure">[\s\S]*?<\/p>/,'')
html=html.replace('<p>หนึ่งรายการขาย เล่าให้เห็นทีละขั้น<br>ผ่านหน้าจอสาธิตของ Khonnai</p>','')
html=html.replace(/<div class="start-carousel-footer">[\s\S]*?<\/div>/,'<span class="sr" role="status" aria-live="polite" style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)"><span class="start-position"></span></span>')
html=html.replace(' aria-describedby="start-help"','')
html=html.replace(/<p[^>]*>Prototype D · Hero ตาม source และธีมคนใน · ข้อมูลสาธิต<\/p>/,'')
html=html.replace('<div class="prototype-note">Prototype D · Hero ตาม source และธีมคนใน · ข้อมูลสาธิต</div>','')
html=html.replaceAll("document.querySelector('.extra-demo').open=true","document.querySelector('.extra-demo')?.setAttribute('open','')")
html=html.replace('</body>',`<style>.closing{background:#fff0e4}.pricing-billing{max-width:310px;gap:0}.pricing-billing button{min-height:44px;padding:2px 8px;font-size:15px;line-height:20px;display:flex;align-items:center;justify-content:center;flex-direction:column}.pricing-billing small{line-height:16px;font-size:12px}</style></body>`)
html=html.replace('</body>',`<style>
/* Brand depth for pricing hover and keyboard focus. */
.pricing-card{position:relative;isolation:isolate}
.pricing-card::before,.pricing-card::after{content:"";position:absolute;pointer-events:none;border-radius:inherit}
.pricing-card::before{inset:8px 6px -10px;z-index:-2;background:linear-gradient(110deg,#193b5a 10%,#ed7c32 90%);filter:blur(20px);opacity:0;transition:opacity 220ms cubic-bezier(.24,1,.4,1)}
.pricing-card::after{inset:0;z-index:-1;background:#fff}
.pricing-card:focus-within::before{opacity:.32}
@media(hover:hover) and (pointer:fine){.pricing-card:hover::before{opacity:.32}}
@media(prefers-reduced-motion:reduce){.pricing-card::before{transition:none}}
@media(forced-colors:active){.pricing-card::before,.pricing-card::after{display:none}}
</style></body>`)
html=html.replace('<h3>Basic</h3>','<span class="pricing-recommended">แนะนำ</span><h3>Basic</h3>')
html=html.replace('</body>',`<style>
.pricing-recommended{position:absolute;top:-15px;right:20px;padding:4px 14px;border:2px solid #fff;border-radius:999px;background:#193b5a;color:#fff;font-size:14px;font-weight:600;line-height:22px;white-space:nowrap}
</style></body>`)
await writeFile(file,html)
