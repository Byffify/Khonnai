# Khonnai × Fastwork — ทิศทางดีไซน์ที่ผู้ใช้ยืนยัน

อัปเดต 17 ตุลาคม 2026 จากคำสั่งผู้ใช้ในแชต ใช้กำกับการตีความรายงาน Fastwork ทั้งชุด รอบนี้ปรับเอกสาร ยังไม่ได้แก้หน้าจอหรือโค้ดแอป

## 1. หลักการตัดสินใจ

**พื้นขาว + ส้ม–น้ำเงิน Khonnai + ระบบภาพและ interaction ของ Fastwork**

ผู้ใช้ยืนยันให้รักษาเฉพาะสีประจำแบรนด์ส้มและน้ำเงิน และให้ใช้ Fastwork เป็นฐานสำหรับส่วนที่เหลือของดีไซน์ เช่น typography, layout, spacing, shape, border, shadow, components, states และ motion ที่เหมาะกับงานแอป ไม่จำเป็นต้องรักษารัศมี ฟอนต์ พื้นครีม หรือสี mint ของแบบเก่าเพียงเพื่อให้เหมือนแบบเดิม

“ใช้ของ Fastwork” ในที่นี้หมายถึงนำระบบดีไซน์ที่สำรวจพบมาประยุกต์กับข้อมูลและงานของ Khonnai: สินค้า สต็อก บิล จอง คืน/เปลี่ยน และสำรองข้อมูล ฟังก์ชัน marketplace ของ Fastwork ไม่ได้กลายเป็น requirement ใหม่ของร้าน

ลำดับอ้างอิง: คำสั่งผู้ใช้ล่าสุดและไฟล์นี้ → ข้อมูล Fastwork ที่สังเกต/สกัดไว้ → กติกางานและ accessibility ของ Khonnai ส่วนค่าหน้าตาปัจจุบันใน DESIGN.md/โค้ดเป็น baseline ก่อน redesign

## 2. สีแบรนด์ที่ตรวจจากไฟล์จริง

ตรวจตรงกันจาก [DESIGN.md](D:/Khonnai/DESIGN.md:4) และ [tokens.css](D:/Khonnai/src/styles/tokens.css:1)

| บทบาท | สีที่ใช้ | วิธีใช้ในแบบใหม่ |
|---|---|---|
| Brand orange | `#ed7c32` | accent สำคัญ, เพิ่มสินค้า/เพิ่มรายการ, selected accent และรายละเอียดแบรนด์ |
| Orange hover | `#f58a43` | hover ของ action ส้ม |
| Brand blue / navy | `#193b5a` | primary action, จุดยึดแบรนด์, selected control ที่ต้องการความเด่น |
| Blue hover / ink on orange | `#102d47` | hover ของปุ่มน้ำเงิน และข้อความเข้มบนปุ่มส้ม |
| Main canvas / surfaces | `#ffffff` | พื้นหลักขาว การ์ดและฟอร์มขาว |
| Secondary neutral | `#f5f5f5` | แยกบริเวณรองหรือพื้นภาพ ตาม shared system ของ Fastwork |
| Primary / secondary text | `#171717` / `#737373` | ใช้ neutral แบบ Fastwork; ไม่ต้องเปลี่ยนข้อความทุกชิ้นเป็นน้ำเงิน |
| Border / emphasized | `#ebebeb` / `#d4d4d4` | เส้นแบ่งเบา; ขอบ input/focus ต้องตรวจความชัดแยกตามการใช้งาน |

น้ำเงินหลักของแบรนด์อ้าง `primary/action` ใน DESIGN.md คือ `#193b5a` ส่วน `--ds-blue:#7fb8ef` ใน CSS ปัจจุบันเป็นอีก token หนึ่ง ไม่ใช้แทนน้ำเงินหลักโดยอัตโนมัติ

พื้นครีม `#faf8ee` และ mint `#bfdcbc` เป็นค่าของแบบปัจจุบัน ไม่ใช่ข้อบังคับของแบบใหม่ตามคำสั่งล่าสุด Green/red/yellow ยังใช้ได้ในฐานะ semantic success/error/warning แบบ Fastwork พร้อมข้อความ/ไอคอน ไม่ถือเป็นสีประจำแบรนด์เพิ่ม และไม่ใช้ mint เป็นสีหลักของปุ่ม stock อีกต่อไป

ข้อเสนอการ map: ปุ่มหลักใช้ navy/ข้อความขาว, ปุ่มเพิ่มใช้ส้ม/ข้อความ `#102d47`, secondary ใช้ขาว/ขอบ neutral, selected chips ใช้ navy หรือ orange ตามระดับความเด่นที่กำหนดเหมือนกันทุกหน้า ตรวจ contrast ใน state จริงก่อนยืนยัน ไม่ตั้งข้อความขาวบนส้มโดยอัตโนมัติ

## 3. ส่วนที่ใช้ Fastwork เป็นฐาน

| ส่วน | ทิศทางใหม่ | ข้อปรับให้เข้ากับ Khonnai |
|---|---|---|
| Typography | ใช้ Google Sans/system sans stack และ weight/hierarchy จาก Fastwork เป็นจุดเริ่ม | ต้องมี Thai fallback ที่อ่านชัด เช่น IBM Plex Sans Thai Looped; ตรวจสิทธิ์และวิธีจัดหาฟอนต์เมื่อ implement ไม่ดึงไฟล์ฟอนต์ของเว็บมาวางโดยอัตโนมัติ |
| Type size | body ของ Fastwork 16/24, labels/supporting ตาม scale ที่สกัด | ข้อความงานร้าน/จำนวนสำคัญเริ่มที่18/28ตามความต้องการอ่านง่าย; ไม่ลดทุกอย่างตาม header36px control ของ reference |
| Spacing | ใช้ scale และ rhythm ของ Fastwork เช่น8/12/16/24/32/48 | เลือก subset สำหรับแอป ไม่ต้องนำทุก marketing gap มาใช้ |
| Shape | capsule สำหรับ CTA/chips ที่เหมาะสม, radius12/16/24สำหรับ card/overlay ตาม reference | ไม่ผูกกับ control radius8px ของแบบเก่า; ต้องมี state และกลุ่มข้อมูลที่อ่านออก |
| Border / shadow | neutral border และ elevation ตามระดับ surface ของ Fastwork | ไม่เพิ่มกรอบหรือเงาซ้ำในทุกช่องกรอก |
| Navigation | white/neutral shell, selected states และ rail treatment ตาม Fastwork | จัดกับเมนูงานเดิมและมือถือ ไม่ต้องมี orbit/floating scene เพื่อเปลี่ยนเมนู |
| Forms / lists | visual grammar ของ controls, labels, tabs, feedback และ overlays จาก Fastwork | ใช้จำนวน/หน่วยและ validation ของ Khonnai; บิลกระดาษยังเป็นเอกสารร้าน |
| Responsive | ใช้วิธีเปลี่ยน composition ตามขนาดแบบ Fastwork | เลือก breakpoint ตามหน้าจองานของเรา; controls งานหลักแตะได้อย่างน้อย48–52px |

การคง body18, หน่วย, focus, validation และขนาดพื้นที่กดเป็นข้อกำหนดความใช้งาน ไม่ใช่คำสั่งให้รักษาดีไซน์เก่าทั้งชุด

## 4. Motion ที่เลือกสำหรับแอปปัจจุบัน

ตารางนี้เป็นแนวทาง redesign ที่เตรียมไว้ ไม่ได้อ้างว่ามี animation เหล่านี้ในแอปแล้ว ระยะเวลาที่สั้น/ยาวกว่าต้นทางระบุเป็น adaptation ชัดเจน

| ตำแหน่งใน Khonnai | สูตรจาก Fastwork | แนวทางใช้ตอน redesign |
|---|---|---|
| Button / chip / selection | shared feedback125ms, easing `.24,1,.4,1` | ใช้สี/opacity/press feedback สั้นเหมือนกันทั้งแอป; disabled ทันทีเมื่อเริ่มบันทึก |
| ไซซ์ / แท็บบิล | tab color160ms; profile panel320ms +Y8px | ใช้ selected transition160ms; เนื้อหาใหม่ fade/translate4–8px 180–240ms เป็น adaptation ที่เร็วขึ้น |
| รายละเอียดสี / stock disclosure | point accordion grid rows520ms +opacity420ms | ยืมกลไก expand/collapse แต่ใช้200–280msสำหรับงานร้าน; field/focus ต้องพร้อมใช้งานและไม่ถูกตัด |
| Dialog ยืนยัน / ข้อมูลช่วยเหลือ | why panel400ms, mobile bottom sheet | ใช้ responsive overlay ตามงาน; เริ่มที่240–320msเพื่อลดเวลารอ เป็น adaptation; รักษา Escape/focus/confirmation เดิม |
| บันทึกสำเร็จ / error message | shared field status / toast / panel entry | ใช้ entryครั้งเดียวประมาณ160–220ms; แสดงผลจริงทันทีและระบุข้อความ ไม่ทำยอดเงินหรือstockวิ่ง |
| Hover รูปสินค้า | image transform320ms easing `.22,1,.36,1` | ใช้ subtle lift/ภาพขยายเล็กน้อยเฉพาะอุปกรณ์ที่ hover ได้; มือถือไม่พึ่ง hover |
| Loading | shared delayed loading225ms; spinner recipe | ถ้างานยังไม่เสร็จค่อยแสดง indicatorหลังประมาณ225ms แต่ lock/retry/idempotencyเริ่มทันที; ไม่ใส่ delayให้local saveช้าลง |
| เปลี่ยนหน้า | content reveal opacity+Yระยะสั้นของ profile | ใช้ได้แบบเบาและไม่เลื่อนหน้าจอทั้งใบ ไม่รอ intro ก่อนเปิดฟอร์ม |

รายละเอียดต้นทางและระดับหลักฐานอยู่ใน [CSS inventory](./css-motion-inventory.md) ยังต้องทดสอบกับจริงก่อนสรุป duration สุดท้าย

หลักการทุก motion: ไม่เปลี่ยนลำดับธุรกรรม ไม่ commit ข้อมูลที่ animationend, ตัวเลขและ action สำคัญไม่ blur/เคลื่อนขณะอ่าน, รองรับ reduced motion ด้วย final state ทันที, มี keyboard/touch/focus ที่ใช้งานได้ครบ

## 5. Landing page เก็บไว้ใช้ภายหลัง

เก็บรายละเอียดเดิมทั้งหมดไว้ใน [landing reference](./landing-reference.md), รายงานหลัก, motion inventory และ assets การกำหนดแอปเป็นพื้นขาวไม่ได้ลบ dark scenes, orbit, hand-drawn accent หรือ choreography ต้นทางออกจากหลักฐาน

ตอนนี้ยังไม่ออกแบบหรือ implement landing ของ Khonnai เมื่อเริ่มงานภายหลังให้ใช้สีส้ม–น้ำเงินเดียวกัน แล้วเลือก composition/motion จากคลังที่เก็บไว้ได้เต็มที่ตามเนื้อหาแบรนด์ของเรา

## 6. ความเห็นต่อการรวมเป็นระบบเดียว

ทิศทางนี้เหมาะ เพราะช่วยให้ component, spacing, state และ motion ไปในภาษาเดียวกัน ขณะที่ส้ม–น้ำเงินยังระบุ Khonnai ได้ชัด ผลที่ต้องการคือระบบของเราเองที่มี visual foundation จาก Fastwork ไม่ใช่เพียงเปลี่ยนสีปุ่มบนหน้าตาเดิม

จุดที่ควรตัดสินด้วยงานจริงคือความหนาแน่นของข้อมูล ภาษาไทยและตัวเลข: ความโปร่งของหน้าแนะนำผลิตภัณฑ์ใช้ได้กับการเล่าเรื่อง แต่หน้าขายต้องอ่านยอดและบันทึกได้รวดเร็ว จึงยืม motion/shape ของ reference พร้อมปรับสเกลและจังหวะให้เข้ากับเจ้าของร้าน40+

## 7. Brief สำหรับออกแบบขั้นถัดไป

> Redesign Khonnai ด้วย white theme และ Fastwork visual system เป็นฐานของ typography, layout, spacing, shape, border, shadow, components และ interaction คง brand orange #ed7c32 และ brand blue #193b5a จากไฟล์ปัจจุบัน ใช้ neutral surfaces/text แบบ Fastwork สีสถานะมีความหมายเฉพาะ ไม่คง cream/mint เป็นเงื่อนไขแบรนด์ ใช้ motion ที่เลือกในตารางแอป รักษาภาษาไทยอ่านง่าย พื้นที่กด48–52px หน่วยสินค้า domain rules และการกู้คืนงานเดิม เริ่มภาพร่างสินค้ารวม รายละเอียดสินค้า และสร้างบิลพร้อม interaction states ส่วน landing page เก็บ reference ทั้งชุดไว้และออกแบบภายหลัง

ก่อน implement ให้ปรับ DESIGN.md และ generator/tokens ตามแบบที่ได้ข้อสรุปแล้ว ค่าของแอปปัจจุบันยังไม่ได้เปลี่ยนในการอัปเดตเอกสารครั้งนี้
