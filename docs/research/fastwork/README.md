# Fastwork UX/UI, design & motion → Khonnai redesign reference

วันที่สำรวจ: **17 ตุลาคม 2026 (Asia/Bangkok)**  
ต้นทางที่ผู้ใช้ระบุ: [fastwork.com](https://fastwork.com/) → browser และ web fetch พาไป [หน้า selling](https://fastwork.com/selling)  
ผลลัพธ์: เอกสารอ้างอิงเพื่อออกแบบต่อ ยังไม่ได้เปลี่ยนหน้าตาหรือพฤติกรรม Khonnai

**อัปเดตตามผู้ใช้ 17 ตุลาคม 2026:** ทิศทางใหม่คือ **พื้นขาว + brand orange `#ed7c32` และ brand blue `#193b5a` ของ Khonnai + ระบบดีไซน์ Fastwork สำหรับส่วนที่เหลือ** ใช้ [Khonnai adaptation](./khonnai-adaptation.md) เป็น brief ล่าสุดเหนือคำแนะนำเดิม และเก็บ [landing reference](./landing-reference.md) ไว้ออกแบบภายหลัง หลักฐาน Fastwork ในรายงานนี้ยังคงค่าต้นฉบับ ไม่ย้อมค่าสีต้นทางให้ดูเป็นผลสำรวจใหม่

## อ่านชุดนี้อย่างไร

1. ไฟล์นี้: ภาพรวม UX, visual language, ผลทดสอบ interaction และแนวทางแปลงมาใช้
2. [CSS & motion inventory](./css-motion-inventory.md): ค่าสี ฟอนต์ spacing, radius, shadows, breakpoints, timings/easing และรายการ keyframes ทั้งหมดที่สกัดจาก CSS สามไฟล์
3. [ข้อจำกัดและระบบเดิมของ Khonnai](../khonnai-redesign-constraints.md): current source/doc facts พร้อมตำแหน่งไฟล์
4. [Observation ledger](./observations.md): ขอบเขตการทดสอบและหลักฐาน runtime รายข้อ
5. [Evidence manifest](./assets/manifest.json): URL, SHA-256 และขนาดสำเนา HTML/CSS; [ข้อมูล CSS ที่สกัด](./assets/css-inventory.json) สำหรับค้นรายละเอียด
6. [ทิศทาง Khonnai ที่ผู้ใช้ยืนยัน](./khonnai-adaptation.md): สีใหม่สำหรับการประยุกต์, Fastwork foundation และ motion สำหรับแอป
7. [คลัง landing page](./landing-reference.md): composition และ choreography ต้นทางที่เก็บไว้ใช้ภายหลัง

**ข้อค้นพบหลัก:** Fastwork หน้านี้ใช้แนวทาง editorial/product storytelling: พื้น neutral, ตัวอักษรใหญ่, ภาพผลงานเป็นตัวเล่าเรื่อง, controls เรียบ และ motion เปลี่ยนองค์ประกอบตามการเลื่อน การนำมาใช้กับ Khonnai ควรแยกระหว่างหน้าแนะนำผลิตภัณฑ์กับเครื่องมือทำงานร้าน เพราะความต้องการด้านความเร็วและความชัดเจนต่างกัน

## 1. ขอบเขตและระดับความมั่นใจ

ใช้ป้ายหลักฐานสามแบบตลอดชุด:

- **Observed runtime:** เปิดเว็บจริง ดู screenshot/DOM/accessibility/computed styles และใช้ controls ที่ระบุ ผลใช้ได้กับสถานะและ viewport ที่ตรวจเท่านั้น
- **Static declaration:** พบใน public HTML/CSS ที่เว็บส่งมา มี selector/value จริง แต่ยังไม่พิสูจน์ว่าเอฟเฟ็กต์นั้นถูกเรียกหรือเล่นครบใน runtime
- **Proposal:** แนวทางสำหรับ Khonnai เป็นการตัดสินใจออกแบบใหม่ ไม่ใช่พฤติกรรมของ Fastwork

REA skill ใช้กำหนดวิธีแบ่งหลักฐานและความไม่แน่นอน แต่ **ไม่มี REA MCP tools ใน active session** ตรวจด้วย CLI `rea-agents@6.5.0 doctor --client codex --json` พบ registration aligned จึงไม่ได้ติดตั้งซ้ำหรือแก้ config การสำรวจเว็บใช้ browser tools และการเก็บ public CSS/HTML ผ่าน HTTP; รหัส F01–F15 ในชุดนี้เป็นรหัสบันทึกของรายงาน ไม่ใช่ REA Evidence IDs

| พื้นที่ | ความครอบคลุมครั้งนี้ |
|---|---|
| Public selling landing | ตรวจทุก section หลักที่พบ: hero, people/profile, pain notes, commission, platform illustrations |
| Profile showcase | เปิดครบ 6 occupation; ทดลอง Portfolio/Services/Reviews/About ใน Sound Composer |
| Explanation overlay | เปิด/ปิด desktop และ mobile; วัดขนาด/transition; ทดลอง Escape บน mobile |
| Login entry | เปิดจาก CTA; ดูตัวเลือก social/email และเปิดฟอร์ม email โดยไม่ส่งข้อมูล |
| Responsive | ตรวจ desktop 1440×900, mobile 390×844; มี snapshot เริ่มต้น 319×1724; อ่าน media rules เพิ่มเติม |
| Shared component system | สกัดจาก CSS ที่โหลด แต่หลาย component เช่น chat/spinner ไม่ได้ทดลองใช้ |
| หลังเข้าสู่ระบบ, onboarding, งานซื้อขายจริง | ยังไม่ตรวจ ไม่มีการใช้ credentials/OTP หรือสมัครบัญชี |
| Legacy Fastwork, external event, legal pages | ไม่ได้สำรวจต่อ; ไม่รวมกับ target หลักโดยอัตโนมัติ |
| Performance, screen reader, real touch device | ไม่ได้วัด; ไม่มีผลรับรอง WCAG, FPS, Core Web Vitals หรือ UX กับผู้ใช้จริง |

คำว่า “ทั้งหมด” ในชุดนี้หมายถึงรายการที่ค้นพบภายในขอบเขตข้างต้น โดยเฉพาะ CSS inventory ไม่ใช่การรับรองว่าครบทุกหน้า/ทุก state ของแพลตฟอร์ม

## 2. โครงเรื่องและ information architecture

**Observed runtime + DOM, F01–F07:** ลำดับการเล่าเรื่องเริ่มจากคุณค่าของพอร์ต → ตัวอย่างคนและผลงาน → ปัญหางานฟรีแลนซ์ → คำอธิบายประโยชน์/ค่าธรรมเนียม → ภาพจำลองเครื่องมือหลายงาน CTA ไปเส้นทางเดียวกันคือเริ่ม onboarding ผ่าน login ไม่พบเมนู marketplace แบบค้นหาบริการจาก landing นี้

| ส่วน | UX / visual ที่พบ | บทบาทในการสื่อสาร |
|---|---|---|
| Header | โลโก้ซ้าย, language popover, CTA ที่ปรากฏในสถานะเลื่อน; nav ลอยมีความโปร่ง/blur | รักษาทางเริ่มใช้งานขณะเล่าเรื่อง |
| Hero | heading กลาง, คำสรรพนามหลายภาษาเปลี่ยน, supporting copy, countdown 4 ช่อง, CTA หลัก/รอง, การ์ดผลงานล้อมกรอบ | ดึงความสนใจไปที่คนและตัวอย่างงาน |
| People | heading แทรก avatar stack, supporting copy, showcase | เชื่อมข้อความเรื่องคนกับหลักฐานภาพ |
| Profile | 6 หมวดอาชีพ, profile identity, stats, tags/location, 4 content tabs, รูปผลงานและบริการ | เปิดรายละเอียดเป็นชั้น ๆ โดยคงบริบทคนเดิม |
| Pain | sticky-note สี pastel วางซ้อน/เอียงบนพื้นเข้ม มีการเปลี่ยนฉากระหว่างเลื่อน | แสดงความยุ่งเหยิงก่อนเข้าสู่คำตอบ |
| Commission | section ขาว, heading สองระดับ, underline ลายมือ, ภาพตัวเลข/avatars, link เปิดรายละเอียด | อธิบายประโยชน์เชิงธุรกิจโดยไม่วางข้อความทั้งหมดบนจอแรก |
| Platform | พื้นเข้ม, ภาพประกอบเครื่องมือวางสลับซ้าย/ขวา, title สั้น, mock UI หลายชุด | สาธิตงานหลายแบบผ่านภาพมากกว่ารายการฟีเจอร์ยาว |

ข้อมูลราคา/รีวิว/ยอดผู้ใช้ใน showcase เป็น **ข้อความที่หน้าเว็บแสดง** ไม่ได้ตรวจสอบความจริงทางธุรกิจ และไม่ใช่ข้อมูลสำหรับนำไปอ้างเป็น traction ของ Khonnai

## 3. Visual design ที่สกัดได้

แหล่งหลัก: [selling CSS](https://fastwork.com/_app/immutable/assets/50.DuRXMnFW.css), [shared CSS](https://fastwork.com/_app/immutable/assets/0.0gKxBXBV.css), computed styles จาก F02/F08/F10–F12 รายการเต็มและ selector อยู่ใน inventory

### สีและพื้นผิว

- **Static:** selling canvas `#f5f5f3`, text หลัก `#2b313b`, supporting `#50555e`, muted `#8d9197`, dark scene `#131922`, content cards สีขาว
- **Static:** shared brand blue `#0074e2` แต่ shared accent light เป็น `#262626` จึงไม่ควรสรุปว่า CTA ทุกแห่งเป็นสีน้ำเงิน หน้า selling ใช้ CTA เข้มและให้ภาพผลงานเป็นแหล่งสีเด่น
- **Observed:** ภาพถ่าย/งานออกแบบหลากสีอยู่บนกรอบ neutral ส่วน pain section ใช้กระดาษ pastel และ platform section ใช้พื้นเข้มรองรับ illustration
- **Inference:** contrast ของ scene และรูปภาพสร้างจังหวะได้มากกว่าการใช้ brand color เต็มทุก section

### Typography

| ตำแหน่ง | ค่าที่ตรวจได้ | หลักฐาน |
|---|---|---|
| Body stack | `Google Sans` + system fallbacks | CSS และ computed; ไม่ยืนยัน rendered glyph ทุกภาษา |
| Hero desktop 1440 | 64px / 73.6px, weight500, letter spacing −1.6px | F02 computed |
| Hero mobile 390 และ snapshot319 | 40px / 46px, weight500, letter spacing −1.6px | F10 computed + mobile CSS |
| Future heading | clamp36–48px, line1.15, weight500, spacing −.02em | CSS |
| Commission heading | 48px, line1.15; subheading32/40; body16/24 | CSS |
| Login heading | 23px /29.9px | F09 computed |
| Login controls | label16/24px; CTA สูง48px | F09 computed |

**Adaptation ล่าสุด:** ใช้ typography และ hierarchy ของ Fastwork เป็นฐาน พร้อม Thai fallback ที่อ่านชัด ตัวอักษรงานร้าน/จำนวนสำคัญเริ่ม18/28เพื่อความอ่านง่าย ไม่คัด negative tracking ภาษาอังกฤษไปใช้กับไทยโดยอัตโนมัติ ฟอนต์เดิมทั้งหมดไม่ใช่เงื่อนไขที่ต้องคงไว้

### Shape, spacing, elevation

- **Static:** shared spacing ไม่ใช่ scale4px ล้วน เช่น token `spacing-1` =6px; มี 2,6,8,12,16,24,28,32,42,48,54,60,64,72px
- **Static:** shared radius element12px/container16px/page42px/full9999px; selling orbit card12px, explanation panel16px, floating nav32px
- **Observed:** primary/secondary CTA ของ hero เป็น capsule สูง48px; shared login button ก็48px ส่วน header mobile language36px
- **Static:** orbit border `#e4e8eff7`, shadow `0 2px 4px #00000014`; preview seller cardมีเงาลึกกว่าการ์ดปกติ
- **Inference:** ใช้ elevation ตามระยะขององค์ประกอบ เช่น preview/overlay ลอยเหนือหน้า ขณะที่ข้อมูลหลักใช้ border เบา ไม่ใช่ใส่เงาเท่ากันทั้งหมด

## 4. Components และ interaction ที่ตรวจจริง

### Navigation / language

**F03, F11:** language control เปิดรายการ English/ไทย/Bahasa Indonesia มี expanded state ไม่ได้เปลี่ยนภาษาของทั้งเว็บ จึงยังไม่ตรวจความยาวข้อความไทยของ layout นี้ ส่วนคำไทยที่เปลี่ยนใน hero เป็น animated content คนละระบบกับตัวเลือกภาษา

**F02/F07:** header CTA ปรากฏในสถานะเลื่อน ใช้ surface โปร่ง/blur อ่าน CSS พบ transition สำหรับ max-width/padding680ms และ opacity200ms การจับ screenshot ไม่ได้วัดระยะเวลาจริงเป็นเฟรม

### Profile showcase

**F04/F10:** มี occupation 6 รายการ เลือกบน mobile แล้วเปลี่ยน profile และ URL hash จริง ครอบคลุม sound composition, photography, video editing, graphic design, AI automation และ web development รายการ mobile เลื่อนแนวนอนได้ (`overflow-x:auto`) แสดงการ์ดกลางพร้อมขอบการ์ดเพื่อนบ้านเป็น affordance

**F05:** ใน profile ของ Sound Composer ทดลอง content tabs ครบ: portfolio แสดง gallery/service summary, services เปลี่ยนเป็นรายการบริการ, reviews เปลี่ยนเป็นคะแนน/สรุป/รีวิว, about เปลี่ยนเป็นประสบการณ์/การศึกษา/ทักษะ DOM ระบุ tab และ selected state จึงเป็น interaction จริงใน landing แต่ไม่ได้พิสูจน์การซื้อบริการหรือข้อมูลหลัง login

**F04:** desktop ระหว่างเลื่อนพบ hash/profile เปลี่ยนไปถึงหมวด web development ส่วน occupation rail ไม่ปรากฏในบางจังหวะ scroll จึงไม่ควรผูก logic ของหน้าทำงานร้านกับ scene progress แบบนี้

**ยังไม่ยืนยัน:** avatar preview พบ CSS recipe และ control ที่มี accessible label แต่การคลิกครั้งที่ทดสอบไม่เกิด preview ที่ยืนยันได้, keyboard Arrow/Home/End ของ Fastwork tabs ยังไม่ทดสอบ, ไม่ได้ตรวจ gallery lightbox หรือรายละเอียดบริการทุกใบ

### Explanation panel

**F08/F12:** desktop เป็น dialog ลอยด้านขวา กว้าง600px ขอบขว24px, radius16px; mobile390 เป็น bottom sheet กว้างเต็มจอ สูงประมาณ759.6px ที่ viewport844px, radius16px เฉพาะมุมบน มี backdrop black10% + blur16px

เปิดแล้ว focus อยู่ที่ปุ่มปิด มี `role=dialog`, `aria-modal=true` และชื่อหัวข้อ ปุ่มปิดทำงาน; mobile Escape ปิดได้หลัง transition ตรวจพบ panel หายจาก DOM แต่ยังไม่ได้ทดสอบ focus trap ครบวงหรือ focus restoration ทุกเส้นทาง

### Login / form

**F09:** CTA พาไป `/login?redirectTo=…selling/onboard…` มีทางเลือก Google/Facebook/Apple/email เปิด email แล้วเป็น form หนึ่งช่อง มี label และ input `type=email`, ปุ่ม Continue disabled เมื่อว่าง และปุ่มกลับ ไม่มีการส่ง email/OTP หรือยอมรับข้อตกลง

**Proposal:** สำหรับ Khonnai นำความเรียบของ form และ progressive disclosure มาใช้ได้ แต่ไม่เพิ่ม login เพียงเพราะ reference มี login ระบบปัจจุบันยังเป็น localStorage

## 5. Motion system: อะไรเห็นจริง อะไรอ่านจาก CSS

| Pattern | พฤติกรรม/ค่าที่พบ | ระดับหลักฐาน | แนวทางใช้ |
|---|---|---|---|
| คำหลายภาษาใน hero | คำเปลี่ยนระหว่าง snapshot เช่นไทย/ญี่ปุ่น/เกาหลี/อังกฤษ | Runtime | เหมาะกับ intro; ไม่ใช้กับ label ของงานร้าน |
| Cards orbit / entry | keyframes1.7s; copy700ms delay1.14s; blur16px + Y12px | CSS; รูปแบบการ์ดล้อม hero เห็นจริง | ใช้เฉพาะ marketing ที่มีเหตุผล |
| Hero exit | scroll snapshotเห็นข้อความ blur/scatter และเปลี่ยนไป people | Runtime + CSS custom properties | ไม่ใช้กับ stock totals/ฟอร์ม |
| Scroll cue | Y0↔−8px,2.2s infinite | CSS; ปุ่มนำเลื่อนได้ | CTA สำคัญของแอปไม่จำเป็นต้องลอยวน |
| CTA comet | หมุน−360deg ทุก3.333s | CSS recipe | optional ใน landing, ไม่ใช่ requirement |
| Future reveal | opacity700ms, transform900ms, blur1600ms | CSS + sectionปรากฏเมื่อเลื่อน | ลดเหลือ subtle reveal หากจำเป็น |
| Avatar morph | grid/height920ms, face opacity520ms/transform560ms | CSS; stackเห็นจริง | เป็น signature ของ storytelling |
| Profile content | panel opacity/Y8px320ms; profile body480ms | CSS + tabเปลี่ยนเนื้อหาจริง | ยืมหลักความต่อเนื่องของบริบทได้ |
| Hand-drawn accent | SVG stroke entry/out, idle3-frame600ms step-end | CSS | ใส่เฉพาะจุด ไม่แทรกข้อมูลตัวเลข |
| Notes | extra note560ms, rotationคงไว้ | CSS + notesซ้อนเห็นจริง | ไม่ใช้เป็นที่เก็บรายการขายจริง |
| Why panel | transform400ms ease-in-out; backdrop opacity400ms | Computed + open/closeจริง | ตัวอย่าง responsive overlay |
| Shared button |125ms cubic-bezier(.24,1,.4,1) | CSS + login computed | ใช้เป็น reference ของ feedback สั้น |
| Marquee / currency / mini-app |90s/56s และ sequenceเฉพาะภาพประกอบ | CSS; เห็น platform illustrations แต่ไม่จับครบทุก loop | จัดเป็นตัวเลือก landing |

ระยะเวลาในตารางคือ **declared timing** ไม่ใช่ผลวัด wall-clock/FPS ไม่มีหลักฐานระบุ JavaScript animation library, spring mass/stiffness, exact scroll thresholds หรือ event orchestration จึงไม่ควรเดาชื่อ GSAP/Framer Motion/อื่น ๆ จากหน้าตา

ดู [motion inventory](./css-motion-inventory.md) สำหรับ remaining families: network shield/flags, quotation, invoice, order cards, search typing/results, service layouts, drawn script, chat declarations และ appendix128 keyframe definitions (119 selling +5 global +4 controls) จำนวนนี้ไม่เท่ากับ128 animations ที่ยืนยันว่าเล่นจริง

## 6. Responsive behavior

**Observed + CSS:** desktop และ mobile ใช้ composition ต่างกัน ไม่ใช่แค่ย่อขนาด

| ประเด็น | Desktop1440 | Mobile390 |
|---|---|---|
| Hero heading |64px|40px สองบรรทัดใน snapshot|
| Cards |ชุด orbit ล้อมเนื้อหา|4การ์ดบางส่วนพ้นขอบ; desktop orbitถูกซ่อนที่≤600px|
| CTA stack |แนวนอน|คอลัมน์เดียว; CTA รองขึ้นก่อนด้วย order−1|
| Hero copy |max900px, gap40|width100%, max393px, padding20px, gap40|
| Profiles |profile + gallery/servicesกว้าง|การ์ดแนวนอน; metadataเรียงลง; occupation railเลื่อนได้|
| Why panel |600px ลอยขวา|เต็มความกว้าง,ยึดล่าง,มุมมนด้านบน|

CSS มีเงื่อนไข600/640/720/860/1000/1030/1200/1279/1511px รวมถึง `hover:none`, `pointer:coarse`, `device-width` บางกลุ่ม จึงไม่มี breakpoint เดียวที่แทนทุกส่วน ดู inventory สำหรับบริบทของแต่ละ selector ไม่ควรย้ายตัวเลขทั้งหมดมาเป็น breakpoint ของ Khonnai

ที่390px browserรายงาน innerWidth390 และ document width375px (มี scrollbar15px) ใน snapshotที่วัด จึงไม่พบ document overflowแนวนอน ณ จุดนั้น แต่ไม่ได้รับรองทุกหน้า/ทุกความกว้าง และภาพตกแต่งนอกขอบถูก clipโดยตั้งใจ

## 7. Accessibility และ resilience ที่ควรเก็บไปใช้

**พบจาก runtime:** tab selected state, labelของemail, disabled Continue เมื่อว่าง, ชื่อdialog/aria-modal, accessible namesของ avatar/language และปุ่มปิด ส่วน reduced-motion มีหลักฐาน **CSS** หลายชุด เช่นปิด orbit/copy loops, ยกเลิก movement, ใช้ภาพนิ่งของ drawing, ปิดmarquee/typingบางส่วน

**ยังไม่พิสูจน์:** reduced-motionใน OSจริง, contrastทุกsurface, screen reader, keyboardทุกcontrol, focus trap, touch gesture, form error/server failure, slow network, screen zoom200%, scene pauseจริงเมื่อออก viewport ไม่มีข้อสรุปว่าเว็บผ่าน/ไม่ผ่านมาตรฐานจากการมี CSS เพียงอย่างเดียว

**Proposal สำหรับ Khonnai:** รักษา controls52px และตัวอักษรไทยเดิม แม้บาง controlของFastworkเล็กกว่า; actionสำคัญต้องไม่พึ่งhover; dialogต้องคืนfocus; ห้ามเลื่อน/ซ่อนปุ่มบันทึกตามscroll scene; reduced-motionต้องยังอ่านข้อมูลครบ

## 8. นำไป redesign Khonnai อย่างไร

ทิศทางภาพได้รับการยืนยันจากผู้ใช้ให้ใช้พื้นขาว ส้ม–น้ำเงิน Khonnai และ Fastwork เป็นฐานสำหรับส่วนอื่น ดู [brief ล่าสุด](./khonnai-adaptation.md) ส่วน [constraints](../khonnai-redesign-constraints.md) และ [DESIGN.md](D:/Khonnai/DESIGN.md) บันทึกระบบเดิม ต้องแยก current state ออกจาก target ใหม่ รายละเอียดหน้าจอและการลงโค้ดยังไม่ได้ทำในรอบนี้

| Pattern Fastwork | แปลงเป็น Khonnai | ความสำคัญ |
|---|---|---|
| รูปเป็นตัวเล่าเรื่อง + neutral surface | การ์ดรูปสินค้า/รหัสเด่น, detailสีแยกใบ, ลดกรอบซ้อน | สูง |
| Selected rail/tabชัด | ทำไซซ์และแท็บบิลให้เห็นตำแหน่งที่เลือก คงการเลือกเองและkeyboardเดิม | สูง |
| Labelสั้น +เนื้อหารองเป็นชั้น | จำนวนพร้อมขายเด่น, คงเหลือ/จองรองลงมา แต่ทุกยอดมีหน่วย | สูง |
| Dialogแยกจากscene | ใช้การจัดกลุ่มและspacingกับconfirmationเดิม; ห้ามย้ายข้อมูลออกจากงานจนลืมยอด | สูง |
| Action hierarchy | ใช้brandnavy `#193b5a` และorange `#ed7c32`; neutral/semanticcolorsแบบFastwork; mintไม่ใช่สีหลักที่ต้องคง | สูง |
| Pill CTA/controls | ใช้shape/radiusและstateของFastworkเป็นฐาน; งานร้านยังต้องมีพื้นที่กด48–52px ไม่ผูกกับradius8เดิม | สูง |
| Storytellingภาพเครื่องมือ | หน้าแนะนำผลิตภัณฑ์สาธิตสินค้า→ไซซ์→สี→บิลด้วยข้อมูลตัวอย่างที่ติดป้าย | กลาง หากทำlanding |
| Orbit / sticky morph / marquee | ใช้ได้เฉพาะconcept landingที่อนุมัติ ไม่ใส่ในเครื่องมือขายประจำวัน | ต่ำ/เลือกใช้ |
| Social proof / payment protection | ใช้เฉพาะหลักฐานที่Khonnaiมีจริง ไม่คัดรีวิว/ตัวเลข/คำรับรองจากreference | ต้องมีหลักฐานก่อน |

### ทิศทางภาพที่เสนอ

**แอปทำงานร้าน:** white canvasและwhite/neutral surfacesแบบFastwork, ส้ม–น้ำเงินเป็นสีแบรนด์, typography/layout/spacing/shape/componentsจากFastworkปรับกับไทยและงานร้าน ใช้motionที่ตอบการกระทำจริงตาม [ตารางแอป](./khonnai-adaptation.md) คงสินค้า→ไซซ์→สี บิล/จอง/คืน/สำรอง และกติกาสต็อก

**Landing page ในอนาคต:** เก็บโครงหน้า hero/orbit/profile/pain/commission/platform รวมทั้งmotionทั้งหมดที่สำรวจไว้ใน [คลัง landing](./landing-reference.md) โดยใช้สีแบรนด์เดียวกันเมื่อนำมาทำของKhonnai การออกแบบlayout/copy/sceneสุดท้ายทำภายหลัง

### Motion สำหรับแอปและค่าตั้งต้น

นำ motion ของ Fastwork มาใช้เป็นฐานได้ทันทีในขั้นออกแบบแอป ตามที่ผู้ใช้ยืนยัน สูตรต้นทางและ adaptation แยกใน [Khonnai adaptation§4](./khonnai-adaptation.md) ค่าต่อไปนี้เป็นค่าตั้งต้นของเรา ไม่ใช่ผลวัด runtime:

- Button/chip feedback125–160ms; ใช้easing `.24,1,.4,1` ของsharedFastworkเป็นฐาน; focus ringชัดทันที
- Content/disclosure180–280ms, opacity +translate≤8px หรือgrid expansionตามงาน เป็นadaptationให้เร็วขึ้น
- Dialog240–320ms เริ่มจากresponsivepanelของFastwork; เข้าถึงactionได้โดยไม่รอanimationเสร็จ
- Loading indicatorหลังประมาณ225msเฉพาะเมื่องานยังไม่จบ; ป้องกันdouble-submitทันที ไม่หน่วงการบันทึกจริง
- บันทึกสำเร็จ:เปลี่ยนสถานะและยอดจริงทันที; feedbackสั้น ไม่ทำcount-upยอดเงิน/stock
- Reduced motion:ไม่มีtranslation/scale/loop; การบันทึกและfeedbackไม่ขึ้นกับanimationend

## 9. Brief พร้อมส่งต่อให้ผู้ออกแบบ

> ออกแบบ Khonnai ใหม่ด้วยพื้นขาว คงbrandorange #ed7c32 และbrandblue #193b5aจากไฟล์ปัจจุบัน ใช้Fastworkเป็นฐานสำหรับtypography/layout/spacing/shape/border/shadow/components/statesและmotionที่เหมาะกับแอป ไม่ต้องคงcream/mintหรือradius8ของแบบเก่า รักษาไทยอ่านง่าย พื้นที่กด48–52px จำนวนพร้อมหน่วย ลำดับสินค้า→ไซซ์→สี และflowบิล/จอง/คืน/สำรอง ใช้motionจากตารางแอปในKhonnaiadaptation เก็บlandingreferenceและchoreographyทั้งหมดไว้ออกแบบภายหลัง เริ่มภาพร่างสินค้ารวม รายละเอียดสินค้า และสร้างบิลพร้อมnormal/empty/error/saving/disabled/reduced-motion โดยไม่เปลี่ยนschemaหรือdomainrules

## 10. สิ่งที่ต้องตรวจเพิ่มก่อนยืนยันแบบ

1. ดูภาพร่าง320/390/768/1440และข้อความไทยยาว พร้อม200%zoom
2. ทดสอบเลือกไซซ์/สีโดยไม่preselect, ค้นรหัสและย้อนกลับคืนfocus/search
3. ทดสอบกรอกจำนวนผิด/ของไม่พอ/บันทึกซ้ำ/ร่างยังไม่บันทึก โดยไม่ทำข้อมูลหาย
4. ดูบิลหลายฉบับ, tabs keyboard, ยกเลิก/แก้บิล, คืนสินค้าและbackupตามกติกาปัจจุบัน
5. ทดสอบ keyboard, reduced motion, touchบนเครื่องจริง และเปรียบเทียบเวลาทำงานกับหน้าปัจจุบัน

ชุดนี้เป็นresearch handoff ไม่มีการแก้app source, tokens, DESIGN.md, PRODUCT.md หรือschema และไม่มีการอ้างว่าการredesignผ่านbuild/testsแล้ว
