# Khonnai · คนใน — localStorage MVP

เว็บภาษาไทยสำหรับเจ้าของร้าน: สินค้า/รูป → ไซซ์ → สีหรือคละสี, รับเข้าและปรับยอด, จองจาก LINE ด้วยมือ, บิลเงินสด, คืน/เปลี่ยนสินค้า ทุกการขายสร้างบิลและตัดสต็อกทันที ไม่มีปิดวัน

UI ใช้แบรนด์ Khonnai ตาม DESIGN.md: กรมท่าบันทึกและเมนู ส้มเพิ่มสินค้า/สต็อก เขียวสถานะ และพื้นครีม พร้อมช่องกรอกอ่านง่าย รายงานตรวจอยู่ใน docs/verification-khonnai-brand.md

## เปิดใช้งาน

ใช้ Node.js 24+ สำหรับชุดทดสอบ TypeScript แบบ native และ npm

~~~powershell
npm.cmd install
npm.cmd run dev
~~~

เปิด URL ที่ Vite แสดง (ปกติ http://localhost:5173/) หน้าแรกหัวข้อ “สินค้า” เริ่มด้วย “ยังไม่มีสินค้า” ไม่มีข้อมูลร้านปลอม เมนูล่างมีสินค้า บิล จอง และคืน/เปลี่ยน

1. กด “เพิ่มสินค้า” กรอกรหัส หน่วย ไซซ์ สีหรือคละสี ราคา และยอดเริ่มต้นที่ตรวจนับแล้ว
2. กด “สำรอง / ข้อมูลร้าน” ใส่ชื่อร้านและเบอร์ที่ต้องการแสดงบนบิล
3. ขายที่หน้า “บิล” แล้ว Export รูปบิล PNG ได้
4. กรอกจองที่หน้า “จอง” และสร้างบิลจากจองครบทั้งหมด
5. รับคืน/เปลี่ยนที่เมนูเดียวกัน เลือกของพร้อมขายหรือขายต่อไม่ได้
6. Export ข้อมูล JSON สม่ำเสมอ และใช้ไฟล์นั้นนำเข้าเมื่อย้าย browser/เครื่อง

## ข้อมูลและข้อจำกัด

localStorage ผูกกับ origin และ browser เครื่องนั้น รวมถึงพอร์ตของ localhost การเปลี่ยน URL/พอร์ตอาจเห็นชุดข้อมูลคนละชุด ไม่ใช่ข้อมูลหายจากชุดเดิม การล้าง site data หรือ private browsing อาจลบข้อมูลได้ รุ่นนี้ไม่มีล็อกอิน sync หรือสำรองออนไลน์

ข้อมูลจริงเริ่มว่าง รูปที่อัปโหลดถูกย่อก่อนเก็บ ข้อมูลมีขนาดจำกัดและระบบจะแจ้งเมื่อบันทึกไม่ได้ การนำเข้า JSON แทนที่ชุดปัจจุบันหลังยืนยัน ให้สำรองก่อน

บิลที่มีคืน/เปลี่ยนเชื่อมแล้วแก้ได้เฉพาะราคา เพื่อป้องกันการคืนสต็อกซ้ำ ยกเลิกบิลจากจองจะปล่อยสินค้า ไม่สร้างการจองใหม่อัตโนมัติ

## ตรวจระบบ

~~~powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npx.cmd playwright install chromium
npm.cmd run test:browser
npm.cmd run build
~~~

Browser tests ใช้ localhost พอร์ต 5199 และข้อมูลทดสอบใน context แยก ไม่แตะ localStorage ของ browser ที่ใช้งานจริง หลักฐานและขอบเขตการตรวจอยู่ใน docs/verification-local-mvp.md

## โครงสร้าง

Redesign ใช้ IBM Plex Sans Thai Looped พร้อมไอคอนและชื่อไทย มือถือเป็นเมนูล่าง ส่วนจอ 1024px ขึ้นไปเป็น sidebar กดการ์ดสินค้าเพื่อเปิดไซซ์/สีและจัดการสต็อก ผลตรวจล่าสุดอยู่ที่ [verification-redesign.md](docs/verification-redesign.md)

~~~text
DESIGN.md                         visual tokens และ component rules
UX-CONTRACT.md                    shared behavior และข้อจำกัด
src/domain/inventory.ts           stock/bill/reservation/return commands
src/data/storage.ts               validation และ localStorage commit
src/features/                    หน้าสินค้า บิล จอง คืน และสำรอง
src/ui.tsx                       Button, Field, Form, EmptyState, Notice
src/styles/tokens.css             CSS design tokens
public/fonts/                    ฟอนต์ภาษาไทยพร้อมใบอนุญาต
tests/                           service/persistence และ browser tests
.scratch/mvp/issues/              งานที่ปรับตามรุ่น local
.scratch/mvp/future-online.md      งานออนไลน์และล็อกอินภายหลัง
outputs/mockups/                  ภาพร่างประกอบการออกแบบ
~~~
