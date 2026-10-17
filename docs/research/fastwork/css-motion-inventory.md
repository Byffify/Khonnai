# Fastwork: CSS design และ motion inventory

วันที่ตรวจ: 17 ตุลาคม 2026 — ขอบเขตคือ public shipped CSS ที่เก็บมาจากหน้า Fastwork selling และ shared assets 3 ไฟล์ ไม่ใช่ source repository ของ Fastwork และไม่ใช่การรับรองว่าทุก selector ทำงานจริงในหน้าที่เปิด

**การใช้กับ Khonnai ล่าสุด:** ผู้ใช้ยืนยัน white theme +brandorange `#ed7c32` +brandblue `#193b5a`; ส่วนอื่นใช้Fastworkเป็นฐาน ดู [adaptation และ motion สำหรับแอป](./khonnai-adaptation.md) และ [landing reference ที่เก็บไว้ใช้ภายหลัง](./landing-reference.md) ค่าของFastworkในinventoryด้านล่างยังคงต้นฉบับเพื่อแยกหลักฐานจากการประยุกต์

## หลักฐานและวิธีอ่าน

| รหัส | First-party source | สำเนาในชุดวิจัย |
|---|---|---|
| S-CSS | [selling bundle 50.DuRXMnFW.css](https://fastwork.com/_app/immutable/assets/50.DuRXMnFW.css) | `assets/selling.css` |
| G-CSS | [global bundle 0.0gKxBXBV.css](https://fastwork.com/_app/immutable/assets/0.0gKxBXBV.css) | `assets/global.css` |
| C-CSS | [control bundle IconButton.C70IQO1T.css](https://fastwork.com/_app/immutable/assets/IconButton.C70IQO1T.css) | `assets/controls.css` |

ทุกค่าด้านล่างเป็น **static observation** จาก declaration หรือ keyframe ในไฟล์ข้างต้น เว้นแต่ระบุว่าเป็นข้อเสนอสำหรับ Khonnai การมี `@keyframes` ไม่ได้ยืนยันว่ามี element ใช้งาน การมี class เช่น `.is-play` ไม่ได้ยืนยันว่าเข้า state นั้นตอนไหน และ CSS ไม่มีข้อมูล scroll threshold, timer orchestration หรือการตัดสินใจของ JavaScript

`assets/css-inventory.json` เก็บ selector, media/support context, keyframes, motion declarations และ root tokens ที่สกัดได้ด้วย `assets/extract-css-inventory.cjs` เพื่อไล่ตรวจต่อ มี 119 keyframe definitions ใน selling, 5 ใน global และ 4 ใน controls ตัวเลขนี้นับ definitions ที่อยู่ในไฟล์ ไม่ใช่จำนวนเอฟเฟกต์ที่เห็นบนจอ หรือจำนวน CSSOM top-level rules ซึ่งนับต่างกัน

## 1. Foundations ของ shared system

อ้างอิง G-CSS: `:where(:root), :where([data-sb-theme=default])` มีหลายบล็อกที่ override กัน ดังนั้นค่าที่เห็นไม่ควรนำไปใช้โดยละเลย cascade และ theme

### 1.1 สีที่ประกาศ

| Semantic token | Light | Dark | หน้าที่ตามชื่อ token |
|---|---|---|---|
| `--color-fastwork` | `#0074e2` | `#6d9cfe` | สีแบรนด์ |
| `--color-accent` | `#262626` | `#ebebeb` | accent ของระบบ ไม่ได้บังคับว่า CTA ต้องน้ำเงิน |
| `--color-on-accent` | `#fff` | `#171717` | สีบน accent |
| `--color-background-body` | บล็อกท้าย `#f5f5f5` | `#1b1b1b` | body ของ shared shell; selling override เป็น `#f5f5f3` |
| `--color-background-surface` | `#fff` | `#262626` | surface |
| `--color-background-card`, `--color-background-popover` | `#fff` | `#1b1b1b` | card/popover |
| `--color-text-primary` | `#171717` | `#fafafa` | primary text |
| `--color-text-secondary` | `#737373` | `#a3a3a3` | secondary text |
| `--color-text-disabled` | `#a3a3a3` | `#525252` | disabled |
| `--color-border` | `#ebebeb` | `#ffffff1a` | border |
| `--color-border-emphasized` | `#d4d4d4` | `#525252` | stronger border |
| `--color-success` | `#007004` | `#9fe59b` | success |
| `--color-error` | `#a50c25` | `#ffc6c1` | error |
| `--color-warning` | `#745b00` | `#fdcf4f` | warning |
| `--color-overlay` | `#00000080` | `#000c` | overlay |
| `--color-overlay-hover`, `--color-overlay-pressed` | `#0000000d`, `#0000001a` | `#ffffff0d`, `#ffffff1a` | state layers |

มี semantic palettes สำหรับ blue, cyan, gray, green, orange, pink, purple, red, teal, yellow แยก `background`, `border`, `icon`, `text` ไม่ใช่ใช้ saturated color เดียวกับทุกชั้น เช่น light orange ใช้พื้น `#fad0b5`, border `#e6bda2`, icon/text `#6e3500`

ข้อควรระวัง: shared badge overrides เปลี่ยนสี info/success/warning/error อีกชั้นหนึ่ง เช่น `.sb-badge[data-variant=error]` ใช้ `#e33f4a` ใน light mode; อย่าอนุมานสี component จาก root token อย่างเดียว

### 1.2 Spacing, radius, controls

| กลุ่ม | ค่า exact ที่พบ |
|---|---|
| Spacing | `0:0`, `0-5:2`, `1:6`, `1-5:8`, `2:12`, `3:16`, `4:24`, `5:28`, `6:32`, `7:42`, `8:48`, `9:54`, `10:60`, `11:64`, `12:72` px |
| Radius | none `0`, inner `6`, element `12`, container `16`, page `42`, chat `24`, full `9999` px |
| Element sizes | xs `28`, sm `36`, md `40`, lg `48`, xl `56` px |
| Border | `1px` |
| Low shadow (light) | `0 2px 4px` black 5% + `0 4px 8px` black 10% |
| Medium shadow (light) | `0 2px 4px` black 5% + `0 4px 12px` black 10% |
| High shadow (light) | `0 4px 6px` black 10% + `0 12px 24px` black 15% |

ชื่อ `spacing-1` หมายถึง 6px ในระบบนี้ ไม่ใช่ 4px แบบที่อาจคุ้นจาก utility frameworks

### 1.3 Typography

- `--font-family-body`: `Google Sans` ตามด้วย system fallbacks เช่น Avenir Next, Segoe UI, Helvetica Neue, Roboto, Noto, Arial; `--font-family-heading` อ้าง body
- `--font-family-code`: system monospace stack; selling ใช้ `JetBrains Mono, monospace` โดยตรงใน `.commission-kicker` ขนาด 12/16px, uppercase
- Shared size scale: `.5`, `.5625`, `.6875`, `.8125`, `1`, `1.1875`, `1.4375`, `1.75`, `2.0625`, `2.5`, `3` rem; weights 400/500/600/700
- Shared body = 1rem, weight 400, line-height 1.5; label = 1rem, weight 500, line-height 1.5; supporting override ท้าย root เป็น `.875rem`
- Display 1 = 3rem / 1.25; Display 2 = 2.5rem / 1.3; Display 3 = 2.0625rem / 1.2121
- นี่เป็น font declaration ไม่ยืนยันว่าฟอนต์โหลดสำเร็จหรือ Thai glyph ใช้ฟอนต์ใดจริง ต้องตรวจ computed/rendered fonts แยก

## 2. Selling visual language ที่แยกจาก shared tokens

อ้างอิง S-CSS

| จุด | Declaration ที่พบ | ความหมายสำหรับการอ่าน reference |
|---|---|---|
| Page | `.start-selling`, `body`: `#f5f5f3`, `min-width:320px`, `overflow-x:clip` | warm off-white canvas และกันภาพตกแต่งล้นแนวนอน |
| Main selling text | `#2b313b`; supporting `#50555e`; muted `#8d9197` ในหลาย section | neutral ออก blue-gray มากกว่า shared neutral |
| Dark surface | `#131922` | dark showcase/platform และ morph panel |
| Commission card | `.commission-card`: white, padding `104px 56px 80px`, shrink radius `32px` | การ์ดขาวขนาด section |
| Commission content | `.commission-inner` max `1136px`, gap `104px`; rows max `1120px`, gap `56px`; row gap `80px` | พื้นที่หายใจมากแบบ marketing |
| Commission text | h2 `48px`, weight500, line-height1.15, letter-spacing `-.96px`; h3 `32/40px`; p `16/24px` | contrast ของ scale โดยใช้ sans เดียว |
| Orbit/profile card | `.orbit-card`: radius12px, white, border `#e4e8eff7`, shadow `0 2px 4px #00000014` | ลด visual weight ของกรอบเมื่อมีรูปจำนวนมาก |
| Hero buttons | `.hero-cta`, `.hero-cta-rsvp`: min/height48px, pill; secondary border `#d4d4d4`; label16/24px weight500 | CTA capsule |
| Top navigation | `.start-selling-top-nav`: fixed center, max984px, height64px, radius32px, backdrop blur20px | floating nav ที่เป็นส่วนหนึ่งของ scene |
| Mobile navigation | width<=640px: width `100vw - 32px`, height52px; buttons height36px label14/20px; logo scale `.75` | mobile เปลี่ยน proportions ไม่ใช่แค่ย่อทุกอย่าง |
| Language control | height48px, radius999px, blur12px, fill `#ffffffb8`, border `#7f7f7f2e` | glass capsule |
| Language menu | min-width198px, radius24px, padding8px, offset8px, two shadows | popover แยกจาก nav |
| Why panel | `.why-bring-panel`: max600px, radius16px, max-height `100vh - 48px`, padding `32px 56px 48px` | explanation drawer |
| Why backdrop | `.why-bring-backdrop`: black10%, blur16px | modal depth |

## 3. Motion language และ exact timing

### 3.1 Shared timing tokens

G-CSS ประกาศ `--duration-fast-min:95ms`, fast125ms, fast-max165ms; medium-min225ms, medium300ms, medium-max400ms; slow-min525ms, slow700ms, slow-max935ms; `--ease-standard:cubic-bezier(.24,1,.4,1)`

S-CSS ใช้ bespoke easing จำนวนมาก จึงไม่ใช่ว่าทั้งเว็บไซต์ใช้ duration token เดียว: reveal หลักมัก `cubic-bezier(.16,1,.3,1)`, UI บางกลุ่ม `.22,1,.36,1`, settle `.33,1,.68,1`, nav expansion `.33,0,.2,1`, drawn strokes `.4,0,.2,1`

### 3.2 Hero / orbit / copy

| Selector / keyframe | Timing และ movement จาก CSS | ขอบเขต |
|---|---|---|
| `.orbit-card.svelte-1p2vpne` / `*-ring-appear` | opacity entry120ms ease-out backwards | CSS binding มีจริง |
| same / `*-card-from-ring` | 1.7s, ease `.2,.9,.2,1`, delay `--orbit-enter-delay`; `--entered` ค้าง0ถึง68% แล้วไป1 | รอบวงกลายเป็นการ์ดโดยสูตร custom properties; ยังไม่ทราบ delay ของแต่ละใบ |
| `.hero-copy` / `*-copy-from-ring` | 700ms `.16,1,.3,1`, delay1.14s; `--copy-in`0→1 | formula รวม opacity, blur16px, translateY12px |
| `.scroll-cue` | copy-in ถูก override ภายหลังเป็น 700ms delay1.14s | ต้องอ่าน cascade |
| `.scroll-float` | 2.2s ease-in-out infinite; Y0→-8px→0 | loop ช้า |
| `.hero-cta-comet` | 3.333s linear infinite; rotate -360deg | highlight orbit รอบ CTA |
| `.hero-cta` | transform600ms `.44,0,.56,1` | interactive transition declaration |
| `.hero-cta-comet` fill |450ms `.33,1,.68,1` | custom property transition |

Orbit ตำแหน่ง, scale, rotation, exit scatter และ blur ผูกตัวแปร `--entered`, `--exit-scatter`, `--orbit-rot`, `--scatter-x/y`, `--ring-scale`, `--orbit-fit-scale` CSS แสดงวิธี render แต่ไม่เปิดเผย mapping scroll→ตัวแปรจาก JavaScript

Mobile rule ทำ hero copy ขนาด max393px ตำแหน่ง top20.6573% และใช้ `.mobile-deck` ตั้ง `--entered:1`, `animation:none` บางส่วน แสดงเจตนาสร้าง composition ใหม่แทน splash desktop เดิม

### 3.3 Reveal, notes, avatars และ profile

| Selector | Exact timing | Motion ที่ประกาศ |
|---|---|---|
| `.pain-note.extra` |560ms `.33,1,.68,1` | scale1.14→1, opacity0→1, เก็บ rotation `--note-rotate` |
| `.start-selling-future-card` toggle `.is-visible` |opacity700ms, blur1600ms, transform900ms `.16,1,.3,1` | hidden + blur14px + Y48px → visible |
| `.start-selling-future-people-o` |920ms `.22,1,.36,1` | grid-column และ height morph |
| avatar faces |opacity520ms, transform560ms, width/max-width/margin400ms, border200ms | scale.72→1 พร้อม layout change |
| `.start-selling-people-o-preview` |160ms `.22,1,.36,1` | opacity0→1, Y6px→0 |
| `.start-selling-avatars … .is-exit/.is-enter` |220ms | exit width32→0/scale1→.35, entry .35→1 |
| `.start-selling-profile-tab` |color/font-size280ms, opacity480ms, transform520ms `.22,1,.36,1` | tab rail reveal |
| `.start-selling-profile-body` |480ms `.22,1,.36,1` | opacity0→1, Y12px→0 |
| `.filters … button` |160ms | background, color, border-color |
| `.card.svelte-157elx8 img` |320ms `.22,1,.36,1` | image transform; CSS declaration aloneไม่ยืนยัน hover ถูกใช้งานจริง |
| `.tabs … button` |160ms | color |
| `.panel.svelte-ty4hd7` |320ms `.22,1,.36,1` | opacity0→1, Y8px→0 |

### 3.4 Platform illustration system

| Family / selector | Timings ที่ผูกใน CSS | หน้าที่ของ keyframes |
|---|---|---|
| Text accent `*-row-title-*` |4s linear infinite | gradient sweep; มี overrides และ reduced-motion fallback ต้องตรวจ matched rule ณ viewport จริง |
| Point accordion `*-row-point-panel` |grid rows520ms + opacity420ms `.33,1,.68,1`; desc transform520ms | 0fr→expanded และ copy Y-4px→0 |
| Credibility marquee `*-cred-track` |90s linear infinite สวนทิศสองแถว | translateX0↔-50% |
| `*-cred-card` |420ms `.16,1,.3,1`, delay `--cred-enter-delay` | blur8px, Y18px, scale.96→clear |
| Secure currencies track |56s linear infinite | translateX0→-528px; `.is-driven` ปิด CSS animation เพื่อให้ตัวขับอื่นทำงาน |
| Currency swap / character |280ms `.16,1,.3,1` | opacity + Y6px |
| Network rings |480ms `.16,1,.3,1` | opacity, scale1.04→1 |
| Network faces |320ms | X±8px→0 |
| Network dash |260ms delay60ms | scaleX0→1 |
| Network shield |420ms delay180ms | scale.88→1 |
| Shield logo |280ms delay680ms | scale.7→1 |
| Network flags |280ms delay `--secure-network-flag-delay` default520ms | scale.82→1 |
| Profile phone |620ms | blur8px, Y18px, scale.96→1 |
| Quote card/client/seller/sent |520/560/520/620ms | cardY14; clientX-14 + scale.96; sellerX14 + scale.96; sentY10 |
| Invoice doc/card |620ms /560ms delay180ms | doc blur8/Y18/scale.96; cardY22/scale.94 |
| Invoice illustration rows |620ms + `--orders-card-delay` | X20→0; card entry override delay620ms |
| Orders cards |620ms + `--orders-card-delay` | Y18/scale.96→1 |
| Search ask / results |560ms, stagger `index * 140ms` | Y10→0; leaving returnsY10 and fades |
| Search caret |1s step-end infinite | blink |
| Service cards |420ms + `--service-enter-delay`; layout500ms | Y18/scale.96/blur8→clear; top,width,padding,gap transition |
| Service details |opacity360ms / size500ms | description/book area change |
| Agent bubble/reply/cards |520/560/620ms; cards `--agents-card-delay` | bubbleX18/scale.96; replyY6/blur2; cardsY28/scale.96 |
| Agent dissolve |800ms | blur4, Y4, scale.98, fade |

ตารางนี้เป็น **recipes ที่ shipped**; `.is-static`, `.is-play`, `.is-enter`, reduced-motion media และ cascade สามารถปิด animation ได้ Appendix จึงเก็บชื่อ keyframe แม้ไม่พบ static selector binding — บางส่วนอาจถูกผูกผ่าน inline JavaScript หรือเป็น code ที่ไม่ใช้งาน ยังสรุปไม่ได้จาก CSS

### 3.5 Commission hand-drawn และ conversation illustration

- `.commission-underline.enter`:640ms `.16,1,.3,1`, rotateX82deg/scale.94→0deg/1, opacityเข้าเต็มที่55%
- Underline path draw:720ms `.4,0,.2,1`, delay120ms, stroke-dashoffset1→0
- Idle ของเส้น/เลขใช้ 3 frames สลับ opacity ทุกประมาณหนึ่งในสามรอบ 600ms `step-end infinite` จึงมีอารมณ์เส้นวาดมือที่ขยับ ไม่ใช่ smooth morph
- `.script-accent.is-drawing-in`: widthและstroke900ms `.4,0,.2,1`; fillเริ่มมองเห็นหลัง55%; drawing-out stroke900ms และfill450ms
- Commission strong accent sweep:4.5s linear infinite, background-size300% และ background-position100%→0
- `.fee-avatar.is-large.shown`:420ms `.16,1,.3,1`, scale.35→1
- `.fee-message.shown`:opacity/transform280ms ease-out, Y6→0
- `.referral-fee.shown`:opacity480ms ease-out และfilter480ms `.16,1,.3,1`
- `.fee-visual-beat.scrolling-out`:opacity/transform900ms `.33,1,.68,1`, Yไป-112%
- `.typing-caret`:900ms step-end infinite; `.fee-visual.resetting` ปิด animation/transition และ reset state สำหรับเริ่มรอบใหม่
- `.why-bring-backdrop` และ panel ใช้400ms ease-in-out; panelเริ่ม X=`100% + 48px` แล้วเข้ามาตาม open class rules

### 3.6 Paid/success illustration

S-CSS มี paid animation vocabulary ที่ละเอียดกว่าปุ่ม success ทั่วไป:

- Amount/credit character:320ms `.16,1,.3,1`, translateY100%→0
- Dissolve:900ms fade และ blur5px + Y4 + scale.96
- Check→glyph:900ms, blur0↔3px และscale1↔.9
- Transfer spin:1.1s `.45,.05,.85,.4`, delay500ms, rotate0→1080deg, scale1→1.08
- Done:320ms `.16,1,.3,1`, opacity + scale.72→1
- มี confetti-fall keyframe (Y-16→280pxพร้อม drift/rotation), border trace cw/ccw และ rail-run/out variants สี peach/violet/sky/glow โดยใช้ stroke-dashoffset และ fadeท้าย แต่ **ไม่พบ CSS animation binding ของทุก variant** ในไฟล์ที่เก็บมา จึงยังไม่กำหนดเวลาหรือยืนยันการเล่นจริง
- Reduced-motion ปิดเส้น border/railด้วย `display:none!important` และหยุด motion ของ transfer, chars, confetti

### 3.7 Navigation / morph / locale

| Selector | Timing / geometry | หลักฐาน |
|---|---|---|
| `.start-selling-top-nav:not(.is-morphing)` |background700ms `.33,0,.2,1`; width680ms same; opacity280ms, transform320ms `.16,1,.3,1` | S-CSS |
| `.is-scroll-hidden` |fade280ms, transform320ms; visibility delay320ms; Y=`-100% - 24px` | class name บอก state; ไม่พิสูจน์ scroll direction threshold |
| `.is-hero-chrome-ready` |opacity700ms แทน280ms | desktop hero chrome reveal |
| `.start-selling-top-nav` morph geometry |radius32→20px, height64→min820px/100vh-40px, width984→1398px bounded | ตัวแปร `--morph`0→1; durationการขับตัวแปรไม่ปรากฏในสูตร |
| Earn CTA disappearing |max-width/padding680ms; opacity320ms delay120ms; blurถึง10px, Y-8px | width/gapลดตาม `--nav-expand`, `--earn-out` |
| Earn unmask/sheen |980ms `.33,0,.2,1`, delay520ms | mask position100%→0 และ sheenX-130%→130% |
| `.start-selling-morph` |opacity/filter420ms (active320ms), transform420ms | bottom pill max489x46→panel max1398x820; radius24→20px |
| Morph gallery columns |16s ease-in-out infinite alternate | oddY56→-56px, evenสวนทาง |
| Locale button |background/border/color240ms `.4,0,.2,1` | glass control |
| Locale chevron |200ms `.4,0,.2,1` | transform |
| Locale menu open/close |180ms `.22,1,.36,1` /140ms `.4,0,.2,1` | openY-6/scale.96→1; closeY-4/scale.98 |

## 4. Shared interaction CSS: loaded แต่ยังไม่ยืนยันการใช้งานทุก flow

G-CSS / C-CSS มี component styles ที่อาจใช้ทั่วแอป ไม่ควรสรุปว่า selling page แสดง chat หรือส่งเงินจริง

| Component / selector | Exact static observation |
|---|---|
| `.sb-button` |transition background-image/background-color/color/opacity/transform125ms `--ease-standard`; reduced-motion duration0 |
| `.sb-button.is-delayed-loading` content/spinner |ซ่อน content/โชว์ spinnerด้วย1ms animationหลัง225ms; reduced-motion delay0 |
| `.ring.svelte-eeb5xk` |rotate360deg525ms linear infinite; reduced-motionช้าลงเป็น3s **ยังหมุนอยู่** |
| `.sb-tooltip.svelte-4y3cg0` |125ms `.24,1,.4,1`, opacity0 scale.96→underlying target; เฉพาะ no-preference |
| `.menu-rail .fw-rail-item` |background/color220ms `.22,1,.36,1` |
| `.fw-chat-row [data-sending]` |pulse1s ease-in-out infinite opacity.45→1→.45 |
| `.fw-chat-row.is-entering` |220ms ease-out, Y8→0, opacity0→1 |
| `.anchor-highlight` row/gallery |shake550ms `.36,.07,.19,.97`, X±6pxลดแรงลงพร้อมrotate±.8deg |
| Chat swipe return |transform160ms `.22,1,.36,1`; reply affordance opacity80ms |
| `.fw-chat-sheet.is-open` |transform480ms, opacity300ms `.22,1,.36,1`; child delay70ms |
| Chat view transitions |room open280ms `.32,.72,0,1`; close300ms `.4,0,.2,1`; root/list animations explicitly none |
| Document border |`--duration-fast`125ms / `--ease-standard`; reduced0 |

## 5. Responsive และ performance

S-CSS มี breakpoint declarations ที่ 400, 461, 480, 600, 640, 720, 860, 960, 1000, 1030, 1100, 1200, 1279, 1511px และ min641/861/1001px รวมถึง compound conditions ไม่ควรเอาทั้งหมดไปสร้าง breakpoint API ของ Khonnai: หลายจุดเป็นการแก้ composition เฉพาะ scene

สิ่งที่ต่างจากการเช็ก viewport width อย่างเดียวคือ query เช่น `width<=1000px OR device-width<=500px OR (hover:none AND pointer:coarse AND width<=1200px)` แสดงว่า touch tablet บางขนาดได้รับ compact/static layout แม้ viewportค่อนข้างกว้าง

- `.commission-sticky`: desktop width>=1001 และ no-preference ใช้ sticky top-48px, min-height `100vh + 48px`
- `.commission-card`: scale=`1 - .083333 * max(--commission-enter-shrink,--commission-shrink)` หรือประมาณ91.6667%เมื่อprogress=1; radius32pxคูณprogress, originบน/ล่างเปลี่ยนตาม entering/shrinking
- `.start-selling-platform-card`:มี scale(`--platform-shrink-scale`) และ originล่าง, explicit overridesปิด revealtransitionทั่วไป
- `.start-selling [data-start-selling-scene=paused]` และลูก: `animation-play-state:paused!important`, `will-change:auto!important`
- `[data-start-selling-render=deferred]`: `content-visibility:auto`, `contain-intrinsic-block-size:auto var(--start-selling-intrinsic-block-size,100vh)`
- Uses `will-change`, transform/translate/scale แยก properties, container units `cqw`, clipping และ aspect-ratio ช่วยคุม scene; ข้อสังเกตนี้ไม่เท่ากับผลวัด performance/FPS

## 6. Reduced motion ไม่ใช่เพียงลด duration

S-CSS ปิด splash/scroll-float/comet, ใช้ copyและcardsใน final state, ลด/ปิดblur, ปิด continuous marqueesและnetwork choreography, หยุด drawn accentแต่คงเส้นแรกที่อ่านออก, เอา caretออก, ปิดpaneltransition, ปิดmorphcolumns และตั้ง `html{scroll-behavior:auto}` แทน smooth

G-CSS ปิด chatpulse/entry/shake/swipe/sheettransition ภายใต้ reduced-motion ส่วน C-CSS ลดspinnerเป็น3s และปิดbuttontransition พร้อมเอาloadingdelayออก ต้องเก็บรายละเอียดนี้หากทำ motion specification: คำว่า “รองรับ reduced motion” อย่างเดียวไม่บอกว่าคอนเทนต์ยังอ่านได้หรือspinnerยังสื่อ waiting ได้อย่างไร

## 7. แนวทางนำไปตีความสำหรับ Khonnai (ข้อเสนอ ไม่ใช่พฤติกรรมของ Fastwork)

1. ใช้whitecanvasและneutral surfaces/textแบบFastwork คงbrandorange `#ed7c32` และbrandblue `#193b5a` ของKhonnai; ใช้typography/shape/spacing/componentsของFastworkเป็นฐาน พร้อมThai fallbackและขนาดอ่านง่าย ไม่บังคับcream/mintหรือradius8เดิม
2. Motionแอปที่เลือกไว้: button125–160ms, tab/content/disclosure180–280ms, dialog240–320ms, feedback160–220ms และloadingindicatorหลัง225msเมื่องานยังไม่จบ เป็นadaptationตาม [ตารางแอป](./khonnai-adaptation.md) ไม่ใช่ผลวัดruntime
3. Landing pageเก็บhand-drawn accent, orbit, product illustration reveal, floating capsule nav, marqueesและstorytelling scenesทั้งหมดไว้ใน [คลังlanding](./landing-reference.md) เพื่อออกแบบภายหลัง ยังไม่ลงมือทำlandingตอนนี้
4. ถ้าเป็นหน้าสต็อก/บิลที่ทำงานทุกวัน ควรให้ค้นหา เลือกแพ็ก อ่านคงเหลือ ยืนยัน และrecoverเข้าใจเร็วเป็นหลัก หลีกเลี่ยงscroll shrink, blurreveal, infinite gradients, confettiใหญ่ หรือscreen morphในขั้นตอนกรอกข้อมูล
5. ใช้loadingdelayเพื่อไม่ให้spinnerกระพริบกับงานที่เสร็จเร็ว โดยไม่ชะลอการป้องกันdouble-submit; CSSของFastworkไม่ได้บอกlogicป้องกันการทำรายการซ้ำ
6. ทุกmotionต้องมีfinal stateที่อ่านได้ทันทีเมื่อreduced-motion และต้องตรวจtouch/keyboardจริงก่อนกำหนดเป็นมาตรฐาน

## 8. สิ่งที่ยังไม่ทราบจากชุด CSS นี้

- หน้าอื่นหรือauthenticated flowsใช้token/animationเหล่านี้ครบหรือไม่
- Exact scroll progress curves, scene activation points, stagger valuesที่setผ่านJS, lifecycleของnetwork/paidillustrations
- Actual computedfont, imageassets, keyboard/focusmanagement, ARIA, browsercompatibility, FPS/CPU/memory
- Keyframesที่ไม่มีstaticbindingเป็นinlineanimationที่ใช้จริงหรือdeadcode
- หากหลายdeclarationsชนกัน ต้องตรวจcomputedstyleในviewport/stateนั้น ไม่ควรเลือกค่าจากชื่อselectorเพียงครั้งแรก

## 9. Appendix: ทุก keyframe definition ที่ค้นพบ

ตารางด้านล่างสร้างจากหลักฐานที่เก็บไว้ โดยคอลัมน์ binding แสดง animation declaration ที่อ้างชื่อนั้นนอก keyframe และนอก reduced-motion block; `ไม่พบ binding ใน CSS` หมายถึงต้องตาม JavaScript/inline styles หรือ runtimeต่อ ไม่ใช่ยืนยันว่าไม่ใช้งาน ค่าเวลาใน inline stylesอาจต่างจาก staticbindingนี้ได้


### selling.css

| Keyframe | Properties ที่เปลี่ยน | Static animation bindings |
|---|---|---|
| `commission-underline-draw` | stroke-dashoffset | `.72s cubic-bezier(.4,0,.2,1) .12s forwards commission-underline-draw` |
| `commission-underline-enter` | opacity, transform | `.64s cubic-bezier(.16,1,.3,1) forwards commission-underline-enter` |
| `three-frame-zero` | opacity | `.6s step-end infinite three-frame-zero` |
| `three-frame-one` | opacity | `.6s step-end infinite three-frame-one` |
| `three-frame-two` | opacity | `.6s step-end infinite three-frame-two` |
| `commission-accent-sweep` | background-position | `4.5s linear infinite commission-accent-sweep` (@media (prefers-reduced-motion:no-preference)) |
| `fee-avatar-pop` | opacity, transform | `.42s cubic-bezier(.16,1,.3,1) forwards fee-avatar-pop` |
| `typing-caret` | opacity | `.9s step-end infinite typing-caret` |
| `svelte-1fn2go6-stroke-in` | stroke-dashoffset | `.9s cubic-bezier(.4,0,.2,1) forwards svelte-1fn2go6-stroke-in` |
| `svelte-1fn2go6-stroke-out` | stroke-dashoffset | `.9s cubic-bezier(.4,0,.2,1) forwards svelte-1fn2go6-stroke-out` |
| `svelte-1fn2go6-fill-in` | opacity | `.9s cubic-bezier(.4,0,.2,1) forwards svelte-1fn2go6-fill-in` |
| `svelte-1fn2go6-fill-out` | opacity | `.45s forwards svelte-1fn2go6-fill-out` |
| `svelte-1fn2go6-idle-0` | opacity | `.6s step-end infinite svelte-1fn2go6-idle-0` |
| `svelte-1fn2go6-idle-1` | opacity | `.6s step-end infinite svelte-1fn2go6-idle-1` |
| `svelte-1fn2go6-idle-2` | opacity | `.6s step-end infinite svelte-1fn2go6-idle-2` |
| `svelte-1p2vpne-hero-cta-orbit` | transform | `3.333s linear infinite svelte-1p2vpne-hero-cta-orbit` |
| `svelte-1p2vpne-card-from-ring` | --entered | `svelte-1p2vpne-ring-appear .12s ease-out backwards, svelte-1p2vpne-card-from-ring 1.7s cubic-bezier(.2, .9, .2, 1) var(--orbit-enter-delay) both` |
| `svelte-1p2vpne-ring-appear` | opacity | `svelte-1p2vpne-ring-appear .12s ease-out backwards, svelte-1p2vpne-card-from-ring 1.7s cubic-bezier(.2, .9, .2, 1) var(--orbit-enter-delay) both` |
| `svelte-1p2vpne-copy-from-ring` | --copy-in | `.7s cubic-bezier(.16,1,.3,1) 1.14s forwards svelte-1p2vpne-copy-from-ring`<br>`.7s cubic-bezier(.16,1,.3,1) 1.14s forwards svelte-1p2vpne-copy-from-ring` (@media (width>600px)) |
| `svelte-1p2vpne-copy-in` | --copy-in | `.7s cubic-bezier(.16,1,.3,1) .2s forwards svelte-1p2vpne-copy-in` |
| `svelte-1p2vpne-scroll-float` | transform | `2.2s ease-in-out infinite svelte-1p2vpne-scroll-float` |
| `pain-note-stick` | opacity, transform | `.56s cubic-bezier(.33,1,.68,1) forwards pain-note-stick` |
| `people-preview-in` | opacity, transform | `.16s cubic-bezier(.22,1,.36,1) both people-preview-in` |
| `avatars-exit` | opacity, flex-basis, width, margin-right, transform, border-width | `.22s cubic-bezier(.33,1,.68,1) forwards avatars-exit` |
| `avatars-pop` | opacity, transform | `.22s cubic-bezier(.16,1,.3,1) forwards avatars-pop` |
| `profile-fade` | opacity, transform | `.48s cubic-bezier(.22,1,.36,1) profile-fade` |
| `svelte-ty4hd7-feed-panel-in` | opacity, transform | `.32s cubic-bezier(.22,1,.36,1) svelte-ty4hd7-feed-panel-in` |
| `start-selling-carousel-cinema` | transform | ไม่พบ binding ใน CSS |
| `start-selling-to-image` | filter, transform | ไม่พบ binding ใน CSS |
| `start-selling-nav-earn-unmask` | -webkit-mask-position, mask-position | ไม่พบ binding ใน CSS |
| `start-selling-nav-earn-sheen` | transform | ไม่พบ binding ใน CSS |
| `start-selling-orbit-card-in` | --entered | ไม่พบ binding ใน CSS |
| `start-selling-orbit-swap-out` | opacity, transform | ไม่พบ binding ใน CSS |
| `start-selling-orbit-swap-in` | opacity, transform | ไม่พบ binding ใน CSS |
| `start-selling-hero-copy-in` | --copy-in | ไม่พบ binding ใน CSS |
| `start-selling-hero-scroll-float` | transform | ไม่พบ binding ใน CSS |
| `start-selling-people-o-peel` | opacity, border-width, width, max-width, margin-right, transform, min-width, padding | ไม่พบ binding ใน CSS |
| `start-selling-people-o-seed-out` | filter, opacity, transform | ไม่พบ binding ใน CSS |
| `start-selling-people-o-vector-in` | filter, opacity, transform | ไม่พบ binding ใน CSS |
| `start-selling-people-o-preview-in` | opacity, transform | ไม่พบ binding ใน CSS |
| `start-selling-pain-stick` | opacity, transform | ไม่พบ binding ใน CSS |
| `start-selling-platform-i-doc-sweep` | background-position | `4s linear infinite start-selling-platform-i-doc-sweep` (@media (width<=860px),(device-width<=500px),(hover:none) and (pointer:coarse) and (width<=1200px))<br>`4s linear infinite start-selling-platform-i-doc-sweep` (@media (width>=861px))<br>`4s linear infinite start-selling-platform-i-doc-sweep` (@media (prefers-reduced-motion:no-preference)) |
| `start-selling-platform-cred-marquee-left` | transform | `90s linear infinite start-selling-platform-cred-marquee-left` |
| `start-selling-platform-cred-marquee-right` | transform | `90s linear infinite start-selling-platform-cred-marquee-right` |
| `start-selling-cred-card-in` | filter, opacity, transform | `start-selling-cred-card-in .42s cubic-bezier(.16, 1, .3, 1) var(--cred-enter-delay,0s) both` |
| `start-selling-secure-fx-marquee` | transform | `56s linear infinite start-selling-secure-fx-marquee` |
| `start-selling-secure-ccy-in` | opacity, transform | `.28s cubic-bezier(.16,1,.3,1) both start-selling-secure-ccy-in` |
| `start-selling-secure-network-rings-in` | opacity, transform | `.48s cubic-bezier(.16,1,.3,1) both start-selling-secure-network-rings-in` |
| `start-selling-secure-network-face-left-in` | opacity, transform | `.32s cubic-bezier(.16,1,.3,1) both start-selling-secure-network-face-left-in` |
| `start-selling-secure-network-face-right-in` | opacity, transform | `.32s cubic-bezier(.16,1,.3,1) both start-selling-secure-network-face-right-in` |
| `start-selling-secure-network-dash-in` | opacity, transform | `.26s cubic-bezier(.16,1,.3,1) 60ms both start-selling-secure-network-dash-in` |
| `start-selling-secure-network-shield-in` | opacity, transform | `.42s cubic-bezier(.16,1,.3,1) .18s both start-selling-secure-network-shield-in` |
| `start-selling-secure-network-logo-in` | opacity, transform | `.28s cubic-bezier(.16,1,.3,1) .68s both start-selling-secure-network-logo-in` |
| `start-selling-secure-network-flag-in` | opacity, transform | `start-selling-secure-network-flag-in .28s cubic-bezier(.16, 1, .3, 1) var(--secure-network-flag-delay,.52s) both` |
| `start-selling-profile-phone-in` | filter, opacity, transform | `.62s cubic-bezier(.16,1,.3,1) both start-selling-profile-phone-in` |
| `start-selling-commission-accent-sweep` | background-position | ไม่พบ binding ใน CSS |
| `start-selling-commission-h-zero-idle-0` | opacity | ไม่พบ binding ใน CSS |
| `start-selling-commission-h-zero-idle-1` | opacity | ไม่พบ binding ใน CSS |
| `start-selling-commission-h-zero-idle-2` | opacity | ไม่พบ binding ใน CSS |
| `start-selling-commission-f-underline-draw` | stroke-dashoffset | ไม่พบ binding ใน CSS |
| `start-selling-commission-f-underline-flip-in` | opacity, transform | ไม่พบ binding ใน CSS |
| `start-selling-commission-f-underline-idle-0` | opacity | ไม่พบ binding ใน CSS |
| `start-selling-commission-f-underline-idle-1` | opacity | ไม่พบ binding ใน CSS |
| `start-selling-commission-f-underline-idle-2` | opacity | ไม่พบ binding ใน CSS |
| `start-selling-commission-avatar-pop` | opacity, transform | ไม่พบ binding ใน CSS |
| `start-selling-commission-caret` | opacity | ไม่พบ binding ใน CSS |
| `start-selling-quote-card-in` | opacity, transform | `.52s cubic-bezier(.16,1,.3,1) both start-selling-quote-card-in` |
| `start-selling-quote-client-in` | opacity, transform | `.56s cubic-bezier(.16,1,.3,1) both start-selling-quote-client-in` |
| `start-selling-quote-seller-in` | opacity, transform | `.52s cubic-bezier(.16,1,.3,1) both start-selling-quote-seller-in` |
| `start-selling-quote-sent-in` | opacity, transform | `.62s cubic-bezier(.16,1,.3,1) both start-selling-quote-sent-in` |
| `start-selling-invoice-doc-in` | filter, opacity, transform | `.62s cubic-bezier(.16,1,.3,1) both start-selling-invoice-doc-in` |
| `start-selling-invoice-card-in` | opacity, transform | `.56s cubic-bezier(.16,1,.3,1) .18s both start-selling-invoice-card-in`<br>`.56s cubic-bezier(.16,1,.3,1) .62s both start-selling-invoice-card-in` |
| `start-selling-invoice-i-row-in` | opacity, transform | `.62s cubic-bezier(.16,1,.3,1) both start-selling-invoice-i-row-in` |
| `start-selling-orders-card-in` | opacity, transform | `.62s cubic-bezier(.16,1,.3,1) both start-selling-orders-card-in` |
| `start-selling-agents-ask-in` | opacity, transform | `start-selling-agents-ask-in .56s cubic-bezier(.16, 1, .3, 1) calc(var(--ask-cascade-i,0) * .14s) both`<br>`start-selling-agents-ask-in .56s cubic-bezier(.16, 1, .3, 1) calc(var(--ask-service-index,0) * .14s) both` |
| `start-selling-agents-ask-caret` | opacity | `1s step-end infinite start-selling-agents-ask-caret` |
| `start-selling-agents-ask-out` | opacity, transform | `start-selling-agents-ask-out .56s cubic-bezier(.16, 1, .3, 1) calc(var(--ask-service-index,0) * .14s) both` |
| `start-selling-service-card-in` | filter, opacity, transform | `start-selling-service-card-in .42s cubic-bezier(.16, 1, .3, 1) var(--service-enter-delay,0s) both` |
| `start-selling-paid-confetti-fall` | opacity, transform | ไม่พบ binding ใน CSS |
| `start-selling-paid-border-cw` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-border-cw-peach` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-border-cw-violet` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-border-cw-sky` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-border-cw-glow` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-border-ccw` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-border-ccw-peach` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-border-ccw-violet` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-border-ccw-sky` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-border-ccw-glow` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-amount-char` | opacity, transform | `.32s cubic-bezier(.16,1,.3,1) both start-selling-paid-amount-char` |
| `start-selling-paid-dissolve-fade` | opacity | `.9s both start-selling-paid-dissolve-fade` |
| `start-selling-paid-dissolve-blur` | filter, opacity, transform | `.9s both start-selling-paid-dissolve-blur` |
| `start-selling-paid-rail-run` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-rail-run-peach` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-rail-run-violet` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-rail-run-sky` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-rail-run-glow` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-rail-out` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-rail-out-peach` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-rail-out-violet` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-rail-out-sky` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-rail-out-glow` | opacity, stroke-dashoffset, animation-timing-function | ไม่พบ binding ใน CSS |
| `start-selling-paid-morph-check-out` | filter, opacity, transform | `.9s both start-selling-paid-morph-check-out` |
| `start-selling-paid-morph-glyph-in` | filter, opacity, transform | `.9s both start-selling-paid-morph-glyph-in` |
| `start-selling-paid-transfer-spin` | transform | `1.1s cubic-bezier(.45,.05,.85,.4) .5s both start-selling-paid-transfer-spin` |
| `start-selling-paid-transfer-done` | opacity, transform | `.32s cubic-bezier(.16,1,.3,1) both start-selling-paid-transfer-done` |
| `start-selling-agents-bubble-in` | opacity, transform | `.52s cubic-bezier(.16,1,.3,1) both start-selling-agents-bubble-in` |
| `start-selling-agents-reply-in` | filter, opacity, transform | `.56s cubic-bezier(.16,1,.3,1) both start-selling-agents-reply-in` |
| `start-selling-agents-card-in` | opacity, transform | `.62s cubic-bezier(.16,1,.3,1) both start-selling-agents-card-in` |
| `start-selling-agents-dissolve` | filter, opacity, transform | `.8s both start-selling-agents-dissolve` |
| `start-selling-avatars-exit` | opacity, flex-basis, width, margin-right, transform, border-width | ไม่พบ binding ใน CSS |
| `start-selling-avatars-pop` | opacity, transform | ไม่พบ binding ใน CSS |
| `start-selling-morph-col-up` | transform | `16s ease-in-out infinite alternate start-selling-morph-col-up` |
| `start-selling-morph-col-down` | transform | `16s ease-in-out infinite alternate start-selling-morph-col-down` |
| `start-selling-profile-fade` | opacity, transform | ไม่พบ binding ใน CSS |
| `svelte-1lc7nmb-start-selling-locale-menu-in` | opacity, transform | `svelte-1lc7nmb-start-selling-locale-menu-in .18s var(--locale-menu-ease) both` |
| `svelte-1lc7nmb-start-selling-locale-menu-out` | opacity, transform | `.14s cubic-bezier(.4,0,.2,1) both svelte-1lc7nmb-start-selling-locale-menu-out` |
| `svelte-1dcozpm-start-selling-nav-earn-unmask` | -webkit-mask-position, mask-position | `.98s cubic-bezier(.33,0,.2,1) .52s both svelte-1dcozpm-start-selling-nav-earn-unmask` (@media (prefers-reduced-motion:no-preference)) |
| `svelte-1dcozpm-start-selling-nav-earn-sheen` | transform | `.98s cubic-bezier(.33,0,.2,1) .52s both svelte-1dcozpm-start-selling-nav-earn-sheen` (@media (prefers-reduced-motion:no-preference)) |

### global.css

| Keyframe | Properties ที่เปลี่ยน | Static animation bindings |
|---|---|---|
| `fw-chat-sending-pulse` | opacity | `1s ease-in-out infinite fw-chat-sending-pulse` |
| `fw-chat-message-in` | opacity, transform | `.22s ease-out both fw-chat-message-in` |
| `fw-chat-shake` | transform | `.55s cubic-bezier(.36,.07,.19,.97) fw-chat-shake` |
| `fw-chat-room-in` | transform | `.28s cubic-bezier(.32,.72,0,1) both fw-chat-room-in` |
| `fw-chat-room-out` | transform | `.3s cubic-bezier(.4,0,.2,1) both fw-chat-room-out` |

### controls.css

| Keyframe | Properties ที่เปลี่ยน | Static animation bindings |
|---|---|---|
| `svelte-4y3cg0-sb-tooltip-in` | opacity, transform | `svelte-4y3cg0-sb-tooltip-in var(--duration-fast) var(--ease-standard)` (@media (prefers-reduced-motion:no-preference)) |
| `svelte-eeb5xk-sb-spinner-rotate` | transform | `svelte-eeb5xk-sb-spinner-rotate var(--duration-slow-min) linear infinite` |
| `svelte-f0417y-hide-content` | opacity | `1ms forwards svelte-f0417y-hide-content` |
| `svelte-f0417y-show-spinner` | opacity | `1ms forwards svelte-f0417y-show-spinner` |
