# Landing reference gap

อ่าน source ปัจจุบันและคลัง Fastwork เมื่อ 17 ตุลาคม 2026 เอกสารนี้เป็นการเทียบ source กับ archive ไม่ได้เปิดหรือยืนยันหน้า Fastwork สด การตรวจสดอยู่ในงานของ root agent ไม่มีการเปลี่ยน UI หรือรัน browser tests ในงานย่อยนี้

## สิ่งที่มีอยู่จริง

Landing ปัจจุบันเป็นหัวเรื่องซ้ายกับตัวอย่างสินค้าขวา ข้อมูลตัวอย่างมี M/L และดำ/ขาว ยอดเริ่ม 24/18/16/12 แพ็ก ขายจำลองคงที่ 2 แพ็ก ผลลัพธ์คำนวณทันทีใน React state ไม่มีคำสั่งบันทึกสต็อกใน component นี้ ดู `src/Landing.tsx:9-21,34-45`.

Navbar อยู่ใน document flow สูงอย่างน้อย112px มี anchor links วิธีใช้งาน/สิ่งที่ทำได้/FAQ และ native language select ปุ่มเข้าแอปชี้ `/` ดู `src/Landing.tsx:25-30`; `src/landing.css:13-23`. หัวเรื่องและ workbench เข้า600/700ms ด้วย easing token ระยะ8/16px ส่วนผลลัพธ์ใช้ content token220ms ระยะ3px ดู `src/landing.css:24,34,60,122-124`; `DESIGN.md:110,128`.

หน้าต่อด้วยขั้นตอน3ข้อ บิลจำลอง ความสามารถจอง/คืน/ประวัติ สำรอง FAQ แบบ native details และ CTAปิดท้าย ดู `src/Landing.tsx:48-59`; ข้อความไทยและอังกฤษอยู่ `src/landingCopy.ts:6-39`. Layout สูงสุด1240px พื้นขาว มี navy workbench และ neutral sections เปลี่ยนเป็นคอลัมน์เดียวที่800px ส่วน motion reducedปิด transition/animation ดู `src/landing.css:1-2,137-155,220-222`.

## Fastwork ใน archive ต่างอย่างไร

Archive บันทึก hero กลางที่มีการ์ดล้อม copy, floating capsule navbar, people/profile selectors, sticky pain notes, commission explanation และภาพ UIประกอบที่เคลื่อนไหวตามเรื่อง ดู `docs/research/fastwork/landing-reference.md:9-19`.

CSSที่เก็บมี navbarสูง64px/max984px/radius32px/blur20px, hero CTA48px และข้อความ16/24px ดู `docs/research/fastwork/css-motion-inventory.md:83-87`. Hero card-from-ring1.7s, copy700ms/delay1.14s/blur16px/Y12px, comet3.333s และ cuefloat2.2s อยู่ใน `:100-115`. Profile panel320ms/Y8px และ body480ms/Y12px อยู่ `:117-132`. Navbarขยาย680ms และ morph max1398×820 อยู่ `:192-204`.

Archive runtime ยืนยัน desktop hero64/73.6px และ mobile40/46px, profile/hashเปลี่ยนตามการเลือก, dialogและCTAไปlogin แต่ไม่ได้จับ timer/scroll orchestrationครบ ดู `docs/research/fastwork/observations.md:8-19`. ค่า CSSจึงเป็น declaration ไม่ใช่หลักฐานว่าทุก effectเล่นจริงตอนนี้ คลังเองระบุข้อจำกัดนี้ใน `landing-reference.md:30-38`.

## ข้อเสนอที่น่าทำที่สุด8ข้อ

ทุกข้อเป็นข้อเสนอสำหรับ Khonnai ไม่ใช่ข้อเท็จจริงเรื่อง conversion หรือผลทดสอบใหม่

1. ทำ hero เป็น sceneกลางที่อ่านหัวเรื่องได้ทันที ใช้ headlineเดิม "รู้ของในร้าน ก่อนขายทุกครั้ง" และวางการ์ดสินค้าของเรา3–4ใบรอบขอบ ตัวอย่างเลือกไซซ์/สียังอยู่ใต้copyให้ลองจริง ยืม compositionจากarchive ไม่ใช้รูปผลงานหรือข้อความ Fastwork. `landing-reference.md:11`; ปัจจุบัน `Landing.tsx:34-45`.

2. เปลี่ยน navbarเป็น floating capsuleที่เลื่อนตามหน้า เก็บ Brand/ภาษา/เข้าแอปตลอด desktop และจัด mobileใหม่ให้เหลือสิ่งจำเป็น ต้นแบบ64px/max984pxเป็นจุดเริ่ม ไม่ล็อกไทยยาวให้ชนขอบ ให้ปุ่มลิงก์ `/` เหมือนเดิม. `css-motion-inventory.md:85-87,192-204`.

3. ให้การ์ดสินค้าเข้ารวมเป็น workbench แทนorbitที่เล่นตลอด ใช้เข้า600–900msแบบครั้งเดียว ข้อความกับCTAมองเห็นตั้งแต่ต้น ให้เลือกก่อนmotionจบได้ ลดจากrecipe1.7sตามเป้าหมายลองงานเร็วของKhonnai. `css-motion-inventory.md:104-115`; `DESIGN.md:128`.

4. ใช้ tabsเล่าเรื่อง "สินค้า / ขาย / จอง / คืน" แทนoccupation/profile แต่ละtabแสดงข้อมูลจำลองของงานนั้นและคำอธิบายสั้น ใช้320ms/Y8pxเพื่อเปลี่ยนภาพ คงkeyboard/focusและประกาศสถานะ อย่าอ้างว่าเป็นหน้าจอจริงหากยังเป็นmock. `css-motion-inventory.md:127-132`; ปัจจุบันcapabilitiesเป็นข้อความนิ่ง `Landing.tsx:52`.

5. ทำpain sectionเป็นโน้ตของเจ้าของร้าน เช่น "ไซซ์นี้เหลือเท่าไร" กับ "จองไว้แล้วหรือยัง" แล้วเชื่อมเข้าภาพเลือกสินค้า→ไซซ์→สี ยืมโน้ตเอียงและentry560ms แต่ใช้พื้นขาว/เทาและaccentส้ม ไม่เพิ่มเรื่องที่ไม่มีหลักฐานสัมภาษณ์เป็นclaim. `landing-reference.md:15`; `css-motion-inventory.md:121`.

6. ทำproduct storytellingสลับซ้ายขวาด้วยภาพKhonnaiเอง เช่น ตัวเลือกสินค้า→รายการขาย→บิล ให้cardเข้า420–620msตามrecipe แต่ยอดจริงหรือยอดจำลองเปลี่ยนทันที ไม่count-upสต็อกหรือแก้receipt renderer. `css-motion-inventory.md:140-159`; ปัจจุบันบิลนิ่ง `Landing.tsx:50`.

7. ยกระดับCTAเป็นคู่ "เริ่มใช้งานคนใน" และ "ลองดูวิธีทำงาน" ที่นำทางชัด เพิ่มขอบaccentหรือsheenครั้งเดียวแทนcometไม่จบ คงเส้นทาง `/` และ `#demo` ไม่ยืมcountdown รายได้ ผู้ใช้ หรือรีวิวที่Khonnaiไม่มีหลักฐาน. `Landing.tsx:35`; `css-motion-inventory.md:108-111`; `observations.md:15`.

8. สร้างmobile sceneเฉพาะด้วยการ์ดเรียงหรือrailที่เห็นขอบถัดไป แทนย่อorbitdesktop ใช้จังหวะช้าบางsectionแต่ปิดloops/blur/morphเมื่อreduced motion ข้อเสนอการตรวจคือ320/390/768/1440,200%zoom,ไทยยาว,keyboardและผลdemoก่อน/หลัง ไม่อ้างว่ารอบนี้ตรวจผ่าน. `landing-reference.md:23-28`; `DESIGN.md:114`.

Experience First เปลี่ยนการเลือกจากคัดลอกทุกเอฟเฟกต์เป็นเลือกmotionที่พาผู้ใช้เข้าใจสินค้าและยอด Prove It Works ทำให้แยกsourceปัจจุบัน, archive CSS และข้อเสนอชัดเจน งานย่อยนี้ยืนยันได้เพียงการอ่านไฟล์จริง ไม่ได้ยืนยันภาพหรือruntimeปัจจุบัน
