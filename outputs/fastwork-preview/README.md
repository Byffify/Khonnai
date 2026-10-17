# Khonnai Fastwork visual preview

ภาพร่างระบบภาพสำหรับการตรวจร่วมก่อน redesign แอปจริง ตาม approved plan step2 ข้อมูลสังเคราะห์ ไม่บันทึกข้อมูลร้าน

เปิด `index.html` เพื่อสลับสินค้า/รายละเอียด/สร้างบิล ค้นรหัส เลือกไซซ์ และเปิดstock disclosureได้ ปุ่มบันทึก/เพิ่ม/แก้เป็นภาพประกอบ การจอง/คืน/สำรองยังไม่ใช่หน้าที่implementในภาพร่างนี้

## ภาพสำหรับ review

| หน้า | Desktop | Mobile |
|---|---|---|
| สินค้ารวม | [1440px](./catalog-1440.png) | [390px](./catalog-390.png) |
| รายละเอียดสินค้า | [1440px](./detail-1440.png) | [390px](./detail-390.png) |
| สร้างบิล | [1440px](./sale-1440.png) | [390px](./sale-390.png) |

PNGกระดาษบิลในภาพร่างมาจากrendererปัจจุบัน คงรูปแบบเดิม [baseline](./receipt-baseline.png) และ [fixture/hashes](./baseline.json) ใช้เทียบเมื่อimplementจริง

ตรวจด้วย `node.exe outputs/fastwork-preview/capture.cjs` จากรากrepo สคริปต์เปิดViteชั่วคราวที่5197และbrowserที่ติดตั้ง แล้วปิดเมื่อเสร็จ ต้องใช้environmentที่browserกับserverเข้าถึงกันได้ ผลตรวจเป็นเฉพาะภาพร่าง:3หน้า×4ขนาด, explicit-size disclosure, reduced motion และdocument overflow ไม่แทนwhole-app regressionหรือWCAGaudit

ไฟล์font/logoอ้างจากpublicของrepo ควรเปิดผ่านViteเพื่อใช้ทรัพยากรครบ นี่ไม่ใช่standalonezipหรือระบบใช้งานจริง
