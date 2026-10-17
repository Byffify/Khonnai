# เปรียบเทียบ Khonnai landing v2

ต้นแบบสองแบบสำหรับเลือก composition ยังไม่ใช่ implementation ที่จะเผยแพร่จริง ทั้งคู่ใช้ brief ใน docs/research/fastwork/live-review-and-khonnai-v2.md.

เปิด http://127.0.0.1:5288/index.html เพื่อสลับแบบ A/B แล้วลองไซซ์ สี แท็บงาน FAQ และปุ่มเล่น motion อีกครั้ง ภาษาของ prototype รอบนี้เป็นไทย ยังไม่เชื่อม LanguageProvider ของแอปจริง.

## ความแตกต่างและคำแนะนำ

**A** เปิดด้วยข้อความกลางและการ์ดสินค้าโอบล้อม เมื่อเลื่อนการ์ดจะเคลื่อนเข้าหากันและจางลง ก่อนเข้าพื้นที่ทดลอง เหมาะกับจุดมุ่งหมายเรื่องภาพจำแบรนด์และ Fastwork reference มากที่สุด แต่ต้องเลื่อนหนึ่งช่วงก่อนถึงตัวอย่างที่กดได้ การเคลื่อนนี้ยังไม่ใช่ shared-element handoff ที่การ์ดเดียวกันกลายเป็นแถวจริงใน workbench.

**B** เปิดด้วยหัวเรื่องแบบ editorial และพื้นที่ทดลองเต็มความกว้าง เห็นกลไกของสินค้าได้เร็วกว่า มี navigation งานด้านข้างบน desktop และแนวนอนบนมือถือ Motion เน้น entry และการเปลี่ยนแผง เหมาะกับการอธิบายผลิตภัณฑ์มากกว่าฉากเปิดแบรนด์.

แนะนำ **A** สำหรับโจทย์ล่าสุด เก็บข้อดีของ B เรื่องเข้าถึง demo เร็วไว้พิจารณาหลังเลือกทิศทาง ยังไม่ผสมทั้งสองแบบหรือแก้หน้า production.

## หลักฐานที่ตรวจ

- Browser จริง1440×1000 และ390×844 ไม่มี horizontal overflow และไม่มี pageerror.
- M/ดำ24−2=22 และ L/ขาว12−2=10 ถูกต้องทั้งสองขนาด.
- คลิกแท็บทั้งสี่ และใช้ ArrowRight/Home เพื่อเปลี่ยนแท็บได้.
- localStorage และ sessionStorage ยังคงว่างหลังลอง demo ใน browser context ใหม่.
- Reduced motion บนมือถือยังเลือกตัวเลือกได้และไม่มี active animation ในจุดตรวจ.
- เก็บ screenshot hero, demo และเต็มหน้า พร้อมวิดีโอ desktop ของทั้งสองแบบ.
- SHA256 ของไฟล์ src ทั้ง33ไฟล์เทียบกับ snapshot ก่อนตรวจ ยังคงเหมือนเดิม รวมไฟล์ renderer บิลและธีม production.
- ตรวจภาพหนึ่งรอบ แก้ navbar CTA/ความเข้มข้อความส้ม/caption/placeholder ของ B แล้ว capture ยืนยันอีกหนึ่งรอบ.

แผงบิล/จอง/คืนเป็นตัวอย่างคงที่แต่ละงาน ไม่ใช่การทำรายการจริงต่อจาก selection ของสินค้า ไม่มีการทดสอบว่า prototype เป็นแอป stock ที่ใช้งานจริง.

ไม่ได้รัน build หรือ regression suite ของ production เพราะไม่ได้เปลี่ยน source แอป ไม่ได้ตรวจอุปกรณ์จริง screen reader หรือประสิทธิภาพ ไม่อ้างว่ารองรับภาษาอังกฤษใน prototype นี้.

## เปิดใหม่

รันจาก D:\Khonnai ใน terminal สองหน้าต่าง:

```powershell
node .scratch/landing-v2-prototypes/server.mjs
```

```powershell
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5198 --strictPort
```

server5288ให้บริการต้นแบบและ fonts/brand เดิม ปุ่มเริ่มใช้งานส่งไปแอปจริง5198 ปิดสอง server เมื่อเลิก review ได้.

หากต้องเก็บหลักฐานใหม่ ใช้ capture.mjs ซึ่งต้องมี Playwright browser ที่ติดตั้งและสิทธิ์เข้า localhost. verification.jsonเป็นผลล่าสุด ไม่ใช่ผล build แอป.

Exhaust the Design Space ทำให้เปรียบเทียบโครงหน้าสองแบบก่อนเลือก. Model the Domain ใช้ lookupไซซ์/สี/ยอดในหน่วยความจำแทนการเรียก domain แอป. Prove It Works ทำให้ตรวจจาก browserจริงและเก็บไฟล์ผลที่ตรวจซ้ำได้.
