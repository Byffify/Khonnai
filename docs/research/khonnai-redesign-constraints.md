# ขอบเขต Khonnai สำหรับนำ Fastwork มาเป็นแรงบันดาลใจ

ตรวจเมื่อ 17 ตุลาคม 2026 จากไฟล์ใน `D:\Khonnai` โดยตรง รายงานนี้เป็นส่วนประกอบของการวิจัย Fastwork ไม่ใช่ผลการตรวจเว็บ Fastwork และไม่ใช่แผนที่ได้รับอนุมัติให้เปลี่ยนโปรแกรม

**อัปเดตทิศทางจากผู้ใช้:** แบบใหม่ใช้พื้นขาว คงส้ม `#ed7c32` และน้ำเงิน `#193b5a` เป็นสีแบรนด์ ส่วน typography/layout/shape/components/motion ใช้ Fastwork เป็นฐาน ดู [brief ล่าสุด](./fastwork/khonnai-adaptation.md) ค่าครีม/mint/radius/ฟอนต์ด้านล่างเป็น **current baseline** ไม่ใช่ข้อกำหนดให้รักษาหน้าตาเดิม คงข้อกำหนดอ่านง่าย หน่วย domain rules และ recovery ตามเดิม

สถานะหลักฐาน: **ปัจจุบันจากเอกสาร** คือข้อกำหนดที่อ่านพบ, **ปัจจุบันจากโค้ด** คือพฤติกรรมที่โค้ดระบุ, **ข้อเสนอ** คือแนวทางประยุกต์ในอนาคต การตรวจครั้งนี้ไม่ได้เปิด Khonnai ในเบราว์เซอร์หรือรันทดสอบ จึงไม่ยืนยันผลการใช้งานจริงหรือความผ่าน WCAG

## 1. ผู้ใช้และงานหลักที่ดีไซน์ต้องรับใช้

- **ปัจจุบันจากเอกสาร:** ผู้ใช้หลักเป็นเจ้าของร้านขายส่งชุดชั้นในอายุ 40 ปีขึ้นไป ไม่คุ้นเทคโนโลยี ใช้มือถือและทำงานหลักคนเดียว จึงให้ความสำคัญกับภาษาไทย จำนวนและหน่วยที่อ่านง่าย และขั้นตอนสั้น [PRODUCT.md:11](D:/Khonnai/PRODUCT.md:11), [PRODUCT.md:39](D:/Khonnai/PRODUCT.md:39), [PRODUCT.md:46](D:/Khonnai/PRODUCT.md:46)
- **ปัจจุบันจากเอกสารและโค้ด:** ใช้ localStorage บนเบราว์เซอร์เครื่องนั้น มีคำว่า “ข้อมูลบนเครื่องนี้” ใน shell ไม่ใช่บริการออนไลน์หลายเครื่อง [PRODUCT.md:24](D:/Khonnai/PRODUCT.md:24), [src/App.tsx:93](D:/Khonnai/src/App.tsx:93), [src/data/storage.ts:74](D:/Khonnai/src/data/storage.ts:74)
- **ปัจจุบันจากโค้ด:** เมนูหลักมี สินค้า, บิล, จอง, คืน/เปลี่ยน, ร้าน/สำรอง [src/App.tsx:16](D:/Khonnai/src/App.tsx:16)
- **ปัจจุบันจากเอกสาร:** ใน checkout นี้มีการจองจาก LINE โดยเจ้าของร้านกรอกเอง ไม่ควรนำขอบเขตจาก checkout อื่นมาใช้แทน การมีคำว่า LINE ในผลิตภัณฑ์ไม่ใช่หลักฐานว่ามี LINE API [PRODUCT.md:15](D:/Khonnai/PRODUCT.md:15), [PRODUCT.md:19](D:/Khonnai/PRODUCT.md:19)

## 2. ลำดับงานที่ต้องรักษา

| งาน | ปัจจุบันที่ตรวจพบ | ข้อเสนอสำหรับ redesign |
|---|---|---|
| ค้นสินค้า | ค้นด้วยรหัสสินค้าและเก็บ search state; เปิดรายละเอียดแล้วย้อนกลับคืน focus ให้การ์ดเดิม [Catalog.tsx:20](D:/Khonnai/src/features/Catalog.tsx:20), [Catalog.tsx:56](D:/Khonnai/src/features/Catalog.tsx:56) | ศึกษารูปแบบ search จาก Fastwork ได้ แต่ไม่เพิ่มคำแนะนำอัตโนมัติหรือเลือกสินค้าแทนผู้ใช้โดยปริยาย |
| ดูสินค้า | กริดแสดงรูปกับรหัส; เข้า detail แล้วเลือกไซซ์เอง ไม่มีไซซ์ preselect ก่อนแสดงสี [DESIGN.md:194](D:/Khonnai/DESIGN.md:194), [Catalog.tsx:105](D:/Khonnai/src/features/Catalog.tsx:105) | ใช้ความชัดเจนของ card hierarchy/spacing ได้ แต่ไม่ยัดราคา จำนวน และ metadata ตลาดลงหน้ากริด |
| ดู stock variant | แยกการ์ดขาวแต่ละสี/คละสี มีจำนวนพร้อมขาย คงเหลือ จอง และหน่วย; พร้อมปุ่มเพิ่มสต็อก/ปรับจำนวน [DESIGN.md:192](D:/Khonnai/DESIGN.md:192), [Catalog.tsx:139](D:/Khonnai/src/features/Catalog.tsx:139) | รักษา progressive disclosure และให้จำนวนเป็นข้อมูลสำคัญกว่าภาพประกอบ |
| รับเข้า/ปรับยอด | แสดงก่อน → หลัง และการปรับยอดจริงมีคำถามยืนยัน [Catalog.tsx:179](D:/Khonnai/src/features/Catalog.tsx:179) | จัด hierarchy ของคำเตือนและ preview ให้ชัด ห้ามทำยอดตัวอย่างดูเหมือนบันทึกแล้ว |
| สร้าง/แก้บิล | ตรวจยอดรวม บันทึกการขายแล้วตัด stock; มีตัวอย่างกระดาษบิลและ Export [Transactions.tsx:48](D:/Khonnai/src/features/Transactions.tsx:48) | ใช้โครงสร้างสรุปข้อมูลได้ แต่คงปุ่มบันทึกที่ชัด และแยกบันทึกกับ Export |
| ดูบิลเก่า | จัดวัน Asia/Bangkok; เลือกแท็บบิลและใช้ Arrow/Home/End [BillArchive.tsx:7](D:/Khonnai/src/features/BillArchive.tsx:7), [BillArchive.tsx:19](D:/Khonnai/src/features/BillArchive.tsx:19) | ประยุกต์ selected/hover state ได้ แต่คงกระดาษเต็มและ keyboard model |
| จอง | กรอกลูกค้าและรายการเอง มีคำอธิบายว่าลดจำนวนพร้อมขายและต้องซื้อครบ [Transactions.tsx:55](D:/Khonnai/src/features/Transactions.tsx:55) | ไม่เพิ่ม chat, payment, freelancer profile หรือ marketplace order status |
| คืน/เปลี่ยน | แยกรับคืนกับส่งสินค้าใหม่ เลือกของขายต่อได้/ไม่ได้ และสรุปผลต่อ stock ก่อนบันทึก [Transactions.tsx:73](D:/Khonnai/src/features/Transactions.tsx:73) | รักษาลำดับและข้อความหน่วย ไม่ยุบเป็น action เดียวที่ไม่เห็นผลกระทบ |
| สำรอง/กู้คืน | ตรวจรูปแบบ backup; ถ้าเปิดข้อมูลเดิมไม่ได้ให้กู้ ไม่เขียนทับอัตโนมัติ [storage.ts:25](D:/Khonnai/src/data/storage.ts:25), [App.tsx:37](D:/Khonnai/src/App.tsx:37) | ทำทางเข้าชัดโดยยังคง native file picker และ confirmation |

## 3. Design tokens ปัจจุบัน

ค่าด้านล่างตรวจจากทั้ง DESIGN.md และ CSS tokens เป็นค่าของ Khonnai ไม่ใช่ค่าที่สกัดจาก Fastwork [DESIGN.md:1](D:/Khonnai/DESIGN.md:1), [tokens.css:1](D:/Khonnai/src/styles/tokens.css:1)

| บทบาท | ค่าปัจจุบัน |
|---|---|
| Primary / ink / action | `#193b5a`; hover `#102d47` |
| เพิ่มสินค้า / selected nav | `#ed7c32`; hover `#f58a43`; text `#102d47` |
| พื้นร้าน / กระดาษ | cream `#faf8ee`; white `#ffffff` |
| พร้อมขาย / stock action | surface `#e9f4eb`; action `#bfdcbc`; success text `#166534` |
| ขอบ / ขอบ control | `#d4cec7` / `#79736d` |
| Danger / warning | `#b42318` / `#92400e` |
| Disabled / muted | `#e7e5e2` / `#555555` |
| Radius | chip 6px; control 8px; card/dialog 12px; photo 16px; badge pill |
| Spacing scale ในเอกสาร | 4, 8, 12, 16, 24, 32px |
| Typography | Plus Jakarta Sans + IBM Plex Sans Thai Looped; body 18/28, label 16/24, caption 14/22, headings 28/36, 24/32, 20/28 |

แหล่ง typography/radius/spacing: [DESIGN.md:30](D:/Khonnai/DESIGN.md:30), [DESIGN.md:66](D:/Khonnai/DESIGN.md:66) ฟอนต์โหลดผ่าน CSS ใน entry ของแอป [src/main.tsx:3](D:/Khonnai/src/main.tsx:3), [src/index.css:1](D:/Khonnai/src/index.css:1)

**ข้อจำกัดจากเอกสาร:** สีเดิมประมาณจากภาพอ้างอิง ไม่ใช่ brand master values ที่ยืนยันจากต้นฉบับ [DESIGN.md:138](D:/Khonnai/DESIGN.md:138)

**ทิศทางที่ผู้ใช้ยืนยัน:** ใช้ white theme และ neutral surfaces/text แบบ Fastwork พร้อมคงเฉพาะส้ม–น้ำเงินเป็นสีประจำแบรนด์ เปลี่ยน typography/shape/spacing/components ได้ตาม foundation ของ Fastwork ไม่จำกัดเฉพาะ hierarchy/whitespace; mintและcreamไม่ได้บังคับใช้ในแบบใหม่ สีsuccess/error/warningยังใช้ตามความหมายได้

## 4. Layout และ component ปัจจุบัน

- **ปัจจุบันจากโค้ด:** shell กว้างสูงสุด 1440px; มี bottom nav และเปลี่ยนเป็น sidebar ที่ 1024px [index.css:32](D:/Khonnai/src/index.css:32), [index.css:93](D:/Khonnai/src/index.css:93), [index.css:149](D:/Khonnai/src/index.css:149)
- **ปัจจุบันจากโค้ด:** กริด 2 คอลัมน์บนมือถือ, 3 ที่ 601px, 4 ที่ 1151px; gap 12/20px; รูป square contain-fit [index.css:320](D:/Khonnai/src/index.css:320), [index.css:334](D:/Khonnai/src/index.css:334)
- **ปัจจุบันจากเอกสาร/โค้ด:** ปุ่ม/input สูงอย่างน้อย 52px, size chip 48px, back button 48px; ฟอร์มสองคอลัมน์ยุบเหลือหนึ่งที่จอเล็ก [DESIGN.md:150](D:/Khonnai/DESIGN.md:150), [index.css:37](D:/Khonnai/src/index.css:37), [index.css:86](D:/Khonnai/src/index.css:86), [index.css:238](D:/Khonnai/src/index.css:238), [index.css:330](D:/Khonnai/src/index.css:330)
- **ปัจจุบันจากเอกสาร:** ไม่ใช้ pill ทุก control; ใช้เงาอ่อนกับ product hover ไม่ใส่เงาทุก field [DESIGN.md:156](D:/Khonnai/DESIGN.md:156), [DESIGN.md:160](D:/Khonnai/DESIGN.md:160)
- **ข้อเสนอ:** ถ้ารูปแบบ Fastwork มีการ์ด dense หรือ navbar หลายชั้น ให้แปลงเป็นการจัดกลุ่มงานประจำร้านแทนการเพิ่ม navigation ใหม่ และตรวจที่ 320px ก่อนยืนยันแบบ

## 5. Accessibility และ feedback ที่ต้องไม่สูญหาย

| หลักฐานปัจจุบัน | เกณฑ์เมื่อเปลี่ยนหน้าตา |
|---|---|
| Shared Field ผูก label/id และ `aria-describedby` สำหรับ hint/suffix [ui.tsx:17](D:/Khonnai/src/ui.tsx:17) | label ยังแสดงเสมอ หน่วยไม่ทับตัวเลขและยังอ่านด้วย assistive technology ได้ |
| Form ตั้ง `aria-invalid` และ focus ไป field ผิด [ui.tsx:42](D:/Khonnai/src/ui.tsx:42) | อย่าเปลี่ยนเป็น toast ที่บอกเพียง “เกิดข้อผิดพลาด” โดยไม่ระบุช่อง |
| Form failure ย้าย focus ไปข้อความในงานเดิม; Notice ใช้ alert/status [ui.tsx:11](D:/Khonnai/src/ui.tsx:11), [ui.tsx:26](D:/Khonnai/src/ui.tsx:26) | ข้อมูลที่กรอกยังอยู่ ผู้ใช้แก้แล้วลองใหม่ได้ |
| ConfirmDialog ใช้ native dialog, ชื่อ/description และเริ่ม focus ที่ปุ่มกลับ [ConfirmDialog.tsx:4](D:/Khonnai/src/ConfirmDialog.tsx:4) | dialog ต้องปิดด้วย Escape ได้และไม่ทำ action โดยอัตโนมัติ |
| Focus-visible, forced-colors และ nav focus เป็นสีที่อ่านบนกรมท่า [index.css:27](D:/Khonnai/src/index.css:27), [index.css:84](D:/Khonnai/src/index.css:84), [index.css:311](D:/Khonnai/src/index.css:311) | hover styling ต้องไม่กลบ keyboard focus |
| Disabled hover/active คง disabled color; invalid border เป็น danger [index.css:312](D:/Khonnai/src/index.css:312) | ระหว่างบันทึกต้องไม่ดูเหมือนปุ่มยังใช้ได้ |
| Guard ก่อนออกจากงานและ beforeunload [App.tsx:50](D:/Khonnai/src/App.tsx:50), [App.tsx:62](D:/Khonnai/src/App.tsx:62) | เปลี่ยนหน้า/ไซซ์แล้วห้ามทำร่างหายเงียบ ๆ |

**ข้อเสนอ:** ใช้ 200% zoom, keyboard-only, long Thai names, empty/filled/error/saving/disabled states, 320px overflow และ reduced motion เป็น acceptance checklist ของ redesign การมี accessibility attributes ใน source ยังไม่เท่ากับผ่าน accessibility audit

## 6. Motion ปัจจุบันและขอบเขตการประยุกต์

**ปัจจุบันจาก CSS:** ปุ่มใช้ transition สี/background 150ms; มี hover shadow ของ product tile; เมื่อ `prefers-reduced-motion: reduce` ปิด transition และใช้ scroll-behavior auto [index.css:183](D:/Khonnai/src/index.css:183), [index.css:326](D:/Khonnai/src/index.css:326), [index.css:87](D:/Khonnai/src/index.css:87) การอ่านนี้ไม่ใช่การวัด frame timing ใน runtime

**ข้อเสนอใหม่ ไม่ใช่ค่าที่สกัดจาก Fastwork:**

1. ใช้ motion เพื่อยืนยัน press/selection และการเปิด disclosure ที่ผู้ใช้สั่งเองเท่านั้น
2. ให้จำนวน stock/ยอดรวมปรากฏตรงค่าจริงทันที ไม่ทำ count-up ที่อาจถูกอ่านระหว่างเปลี่ยนค่า
3. หลีกเลี่ยง carousel อัตโนมัติ, parallax, hover-only actions และ animation วนในหน้าขาย/คืนสินค้า
4. ถ้าทดลอง expand/collapse หรือ page transition ให้แยก animation ออกจาก commit ข้อมูล และเมื่อ reduced motion ให้ข้าม movement ได้
5. ค่าระยะเวลา/easing ที่จะนำจาก Fastwork ต้องมี runtime/CSS evidence ในรายงานหลัก หากยังไม่มี ให้เรียกว่า proposal ห้ามเรียกว่า “ค่าของ Fastwork”

## 7. Domain invariants ที่ visual redesign ต้องคงเดิม

- **ปัจจุบันจากโค้ด:** available = stock − active reservations; การขายและจองต้องไม่เกินยอด available [inventory.ts:31](D:/Khonnai/src/domain/inventory.ts:31), [inventory.ts:146](D:/Khonnai/src/domain/inventory.ts:146)
- **ปัจจุบันจากโค้ด:** reserve เพิ่มรายการจองแต่ไม่หัก stock; convert เปลี่ยนสถานะจองแล้วสร้างบิล [inventory.ts:75](D:/Khonnai/src/domain/inventory.ts:75)
- **ปัจจุบันจากโค้ด:** บันทึกบิลหัก stock; command ID เดิมคืน state เดิม ไม่ทำซ้ำ [inventory.ts:36](D:/Khonnai/src/domain/inventory.ts:36), [inventory.ts:155](D:/Khonnai/src/domain/inventory.ts:155)
- **ปัจจุบันจากโค้ด:** แก้บิลใช้ส่วนต่าง; ยกเลิกบิลคืน stock; มี version check และข้อจำกัดเมื่อเกี่ยวกับคืน/เปลี่ยน [inventory.ts:91](D:/Khonnai/src/domain/inventory.ts:91)
- **ปัจจุบันจากโค้ด:** คืนเฉพาะของ sellable จึงเพิ่ม stock; อ้างบิลแล้วห้ามคืนสะสมเกินที่ซื้อ [inventory.ts:160](D:/Khonnai/src/domain/inventory.ts:160)
- **ปัจจุบันจากโค้ด:** บันทึกตรวจ revision กันข้อมูลอีกแท็บเปลี่ยน มี validation ก่อนเขียน localStorage และ error เมื่อพื้นที่เต็ม [storage.ts:78](D:/Khonnai/src/data/storage.ts:78)
- **ปัจจุบันจากเอกสาร:** ห้ามเปลี่ยน localStorage key/schema และ flow บิล/จอง/คืนเพราะ reference visual; ไม่เพิ่ม Dashboard/กราฟ/Chat/แจ้งเตือนจากภาพ [DESIGN.md:180](D:/Khonnai/DESIGN.md:180)

## 8. เกณฑ์คัดรูปแบบ Fastwork มาใช้

ตารางนี้เป็น **ข้อเสนอสำหรับตัดสินใจหลังอ่านหลักฐาน Fastwork ในรายงานหลัก** ไม่ได้อ้างว่า Fastwork มีทุก pattern ในตาราง

| สิ่งที่พบจาก Fastwork หากมีหลักฐาน | แปลงมาใช้ใน Khonnai ได้อย่างไร | สิ่งที่ไม่ควรพ่วงเข้ามา |
|---|---|---|
| Search ที่เด่นและอ่านง่าย | ค้นรหัสสินค้า มี clear control และ focus ชัด | ระบบค้นหาบริการหลายหมวดหรือ AI search ที่ยังไม่มี |
| Card ภาพและข้อความมีลำดับชัด | รูปสินค้า square และรหัสเด่น; detail แยกไซซ์/สี | ดาวรีวิว, seller badge, จำนวนผู้ซื้อ |
| Navigation แบ่งหมวดเข้าใจง่าย | ทำ 5 งานเดิมอ่านออกและเห็น selected state | เมนูตลาด, ผู้รับงาน, โปรไฟล์ผู้ขาย, inbox |
| Spacing, border, elevation | ลดกรอบซ้อนและแยกกลุ่มข้อมูลร้าน | เปลี่ยนกระดาษบิลให้เป็น promo card |
| Hover/focus/pressed ที่สม่ำเสมอ | ทำ state ของ Button/Field/chip ให้ครบ | ข้อมูลหรือ action ที่เข้าถึงได้เฉพาะ hover |
| Motion ของ menu/disclosure | ให้ผู้ใช้เห็นเหตุและผลเมื่อเปิดรายละเอียด | auto motion ที่แย่งความสนใจจากจำนวนหรือบิล |
| Footer/help/trust pattern | อธิบาย “ข้อมูลบนเครื่องนี้” และ backup ตามจริง | รับรองความปลอดภัย/ออนไลน์/การชำระเงินที่ไม่ได้ทำ |

## 9. สิ่งที่ยังไม่ได้พิสูจน์

- ไม่ได้ตรวจเว็บ Khonnai ใน runtime ครั้งนี้ จึงยังไม่ยืนยัน layout/contrast/keyboard/reduced-motion จากการใช้จริง
- ไม่ได้รัน build, lint หรือ tests; การเปลี่ยนเพียงเอกสารนี้ไม่ใช่หลักฐานว่าระบบผ่าน regression
- ไม่มี `docs/adr/` ในการสำรวจครั้งนี้ จึงไม่มี ADR เพิ่มเติมที่นำมาใช้ประกอบรายงาน
- ผู้ใช้ยืนยันทิศทาง white theme +ส้ม–น้ำเงินKhonnai +Fastwork foundationแล้วตามbriefล่าสุด รายละเอียดหน้าจอ/navigationและการimplementยังไม่ได้ดำเนินการในการแก้MDครั้งนี้
- ต้องใช้ภาพและ runtime evidence ของ Fastwork จากรายงานหลักเพื่อตัดสินใจรายละเอียดจริง รายงานนี้ยืนยันเฉพาะขอบเขตและ source ของ Khonnai
