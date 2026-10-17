import { readFile, writeFile } from 'node:fs/promises'
const file='.scratch/landing-v2-prototypes/d.html'
let html=await readFile(file,'utf8')
html=html.replace('ที่คุณดูแลด้วยตัวเอง</h2>','ที่คุณดูแล<span class="keyword-sweep">ด้วยตัวเอง</span></h2>')
html=html.replace('แล้วลองกับร้านคุณ</span>','แล้ว<span class="keyword-sweep">ลองกับร้านคุณ</span></span>')
html=html.replace('เตรียมแค่งานของร้านคุณ</h2>','เตรียมแค่<span class="keyword-sweep">งานของร้านคุณ</span></h2>')
const css=await readFile('src/landing/keyword.css','utf8')
html=html.replace('</body>',`<style>${css}</style><script>(()=>{const words=[...document.querySelectorAll('.keyword-sweep')],visible=new Set();function sync(){for(const word of words)word.dataset.active=String(visible.has(word)&&!document.hidden)}const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target)}sync()});words.forEach(word=>observer.observe(word));document.addEventListener('visibilitychange',sync)})();</script></body>`)
await writeFile(file,html)
