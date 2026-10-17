# Fastwork landing reference — เก็บสำหรับ Khonnai ในอนาคต

เก็บจากการสำรวจ17ตุลาคม2026 ต้นทาง [Fastwork selling](https://fastwork.com/selling) เอกสารนี้เป็นคลังอ้างอิง ไม่ใช่แบบ landing ของ Khonnai ที่ออกแบบเสร็จแล้ว

ทิศทางแบรนด์สำหรับการใช้ภายหลัง: ส้ม `#ed7c32`, น้ำเงิน `#193b5a`, white theme ตาม [Khonnai adaptation](./khonnai-adaptation.md) ส่วนสี/พื้นเข้มที่กล่าวต่อไปเป็นรายละเอียดของต้นทาง เก็บไว้เพื่ออ่าน choreography และเลือกดัดแปลงภายหลัง

## โครงสร้างที่เก็บไว้

| Scene | Composition / UX | Motion ที่เก็บไว้ | แหล่งรายละเอียด |
|---|---|---|---|
| Hero | headingกลาง, copyรอง, countdown4ช่อง, CTAคู่, การ์ดผลงานล้อมเนื้อหา | ring→card1.7s, copy700ms delay1.14s, blur/scatter exit, คำหลายภาษา, CTAcomet3.333s, cuefloat2.2s | [Inventory§3.2](./css-motion-inventory.md), [RuntimeF02–F04](./observations.md) |
| Floating navigation | logo/language/CTA, glass capsule | expand680ms, scroll/morph geometry, CTAreveal/exit | Inventory§3.6–3.7และselector `start-selling-top-nav` |
| People / avatars | titleแทรกavatarstack, supportingcopy | grid/heightmorph920ms, faceentry520/560ms, preview160ms | Inventory§3.3; previewruntimeยังไม่ยืนยัน |
| Occupation / profile | 6occupation, identity/stats/tags, portfolio/services/reviews/about | railreveal, profilebody480ms, contentpanel320ms,Y8px, responsivecardrail | [รายงานหลัก§4](./README.md), Inventory§3.3 |
| Pain notes | pastelกระดาษเอียงซ้อนบนพื้นเข้ม | stickysection, noteentry560ms, การเปลี่ยนscene | Inventory§3.3และ§5; dragphysicsยังไม่ตรวจ |
| Commission | sectionขาว, headingสองระดับ, underlineลายมือ, ภาพตัวเลข/avatars | SVGstroke, 3frameidle600ms, accent sweep4.5s, sticky/shrinkประมาณ91.67% | Inventory§3และ§5 |
| Explanation | dialog600pxด้านขวา / bottomsheetมือถือ | panel/backdrop400ms, blur16px | [RuntimeF08/F12](./observations.md) |
| Platform | พื้นเข้ม, mockUIสลับซ้ายขวา, featurestory | reviewmarquee90s, currency56s, networkshield/flags, searchtyping, quote/invoice/orders/servicechoreography | Inventory§3.4และappendix |
| Conversion | CTAเข้าonboardingผ่านlogin | sharedbuttonfeedback125ms, formprogressivedisclosure | [RuntimeF09](./observations.md) |

หัวข้อ section บางกลุ่มใช้คำอธิบายในภาษาไทยแทนคำโฆษณาต้นฉบับ รายละเอียด selector และ keyframe เก็บครบตามที่สกัดไว้ใน inventory

## Responsive / accessibility / performance recipes

- Mobile≤600pxใช้ `.mobile-deck` แทนdesktoporbit, hero40px, maxcopy393px, CTAคอลัมน์และปุ่มรองขึ้นก่อน
- Profileบนmobileใช้horizontalrailและการ์ดที่เห็นขอบเพื่อนบ้าน; sceneอื่นมีbreakpointเฉพาะหลายค่า ไม่ใช้thresholdเดียวทั้งหน้า
- Reduced motionคงfinal content, ปิดloops/morph/blurบางส่วน และแสดงdrawingframeที่อ่านได้
- CSSมีpausedscenesและdeferredrenderingด้วยcontent-visibility; ยังไม่มีผลวัดFPSหรือCPUจริง

## หลักฐานที่เก็บไว้และขอบเขต

- [HTMLที่หน้าเว็บส่งมา](./assets/selling.html)
- [Selling CSS](./assets/selling.css), [shared CSS](./assets/global.css), [controls CSS](./assets/controls.css)
- [รายการCSSและmotionที่สกัด](./assets/css-inventory.json), [keyframe appendix](./assets/keyframe-appendix.md)
- [Manifest พร้อมต้นทางและSHA-256](./assets/manifest.json)
- [รายงาน CSS/motion เต็ม](./css-motion-inventory.md) และ [browser ledger](./observations.md)

สำเนานี้เป็นหลักฐานHTML/CSS ไม่ใช่offlinecloneที่รันได้ครบ ยังไม่ได้เก็บJS,image/font/videoทุกไฟล์หรือวิดีโอบันทึกmotion และยังไม่ทราบexactscrollcurves/JSorchestrationทั้งหมด คงข้อจำกัดนี้ไว้เมื่อใช้briefต่อ

## เมื่อนำมาทำ landing ของแบรนด์เรา

คงแนวคิดscene/composition/timingเป็นตัวเลือก แล้วแทนเนื้อหาด้วยงานร้านและภาพKhonnaiเอง เช่นสินค้า→ไซซ์→สี→บิล เลือกว่าจะใช้darksectionหรือเปลี่ยนเป็นwhite/neutralภายหลัง ทุกsceneยังมีให้เลือกในคลังนี้ แม้บางmotionจะไม่ใช้ในแอปทำงานปัจจุบัน

รอบนี้ยังไม่ตัดสินlayout, copy, CTAปลายทาง หรือchoreographyสุดท้ายของlanding การออกแบบส่วนนั้นทำภายหลังตามที่ผู้ใช้ระบุ
