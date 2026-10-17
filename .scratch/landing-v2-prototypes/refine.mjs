import { readFile, writeFile } from 'node:fs/promises'
const base = '.scratch/landing-v2-prototypes/'
let a = await readFile(base + 'a.html', 'utf8')
let b = await readFile(base + 'b.html', 'utf8')
const common = `@media(max-width:700px){.mini-label,.compare,.replay,.product-code,.quantity small,.quantity .unit,.demo-foot,.intro-footer{font-size:14px!important}}`
a = a.replace('</style>', common + '</style>')
b = b.replace('</style>', common + `
.compare{position:absolute;top:104px;bottom:auto}
.hero h1 span{color:#c95a14}
.product-image .garment{width:160px;height:155px;color:#193b5a;fill:currentColor}
@media(max-width:1000px){.navlinks>a.button{display:inline-flex}}
@media(max-width:700px){.navlinks>a.button{min-height:44px;padding:9px 12px;font-size:13px}.compare{top:78px;font-size:14px}.stage-head{flex-wrap:wrap;gap:8px}.stage-head>span{flex-basis:100%}.replay{white-space:nowrap;padding:6px 0}.product-image .garment{width:88px;height:110px}.product-image small{font-size:14px}.product-code{font-size:14px}}
</style>`)
const productPhoto = '<svg class="icon" aria-hidden="true"><use href="#photo"/></svg>'
b = b.replace(productPhoto, '<svg class="garment" viewBox="0 0 200 180" aria-label="เสื้อยืดตัวอย่าง"><path d="M64 17 32 31 9 63 38 83 52 66 60 165 140 165 148 66 162 83 191 63 168 31 136 17Q100 46 64 17Z"/><path d="M72 21Q100 46 128 21M65 155H135" fill="none" stroke="#6d879a" stroke-width="2"/></svg>')
await writeFile(base + 'a.html', a)
await writeFile(base + 'b.html', b)
