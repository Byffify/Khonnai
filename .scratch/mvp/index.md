# งาน MVP — Local Markdown

ผู้ใช้ยืนยันการแบ่งงานวันที่ 14 ตุลาคม 2026 สเปกอยู่ที่ [spec.md](spec.md) แต่ละงานมีเกณฑ์ตรวจรับและ Comments ในไฟล์ของตัวเอง

**แนวทางล่าสุด:** รุ่น localStorage พัฒนาแล้วตาม DESIGN.md และภาพร่างที่เลือก งาน 01–10 เป็น done สำหรับขอบเขต local ดู [หลักฐานตรวจ](../../docs/verification-local-mvp.md) และ [งานออนไลน์ภายหลัง](future-online.md)

## รายการงานและเงื่อนไขเริ่ม

| งาน | ต้องรอ |
| --- | --- |
| [01 สรุปรุ่น localStorage และกติกาข้อมูล](issues/01-resolve-online-decisions.md) | ไม่มี |
| [02 เก็บข้อมูลร้านใน localStorage และสร้างสินค้าพร้อมยอดเริ่มต้น](issues/02-catalog-and-initial-stock.md) | 01 |
| [03 รับสินค้าเข้าและปรับยอดตามการตรวจนับ](issues/03-receipts-and-adjustments.md) | 02 |
| [04 ขายผ่านบิลเงินสดและตัดสต็อกทันที](issues/04-cash-bills-and-sales.md) | 02 |
| [05 Export บิลเงินสดเป็นรูป](issues/05-bill-image-export.md) | 04 |
| [06 แก้บิลและยกเลิกบิลผิดพร้อมประวัติ](issues/06-bill-corrections-and-cancellation.md) | 04 |
| [07 จองสินค้าและยกเลิกจองจากมือถือ](issues/07-reservations.md) | 04 |
| [08 ขายครบจากจองและเตือนเมื่อของจริงไม่พอ](issues/08-reservation-sales-and-shortages.md) | 03, 07 |
| [09 รับคืนทั้งมีและไม่มีบิลเดิม](issues/09-returns.md) | 06 |
| [10 เปลี่ยนสินค้าและบันทึกบิลสินค้าใหม่](issues/10-exchanges.md) | 09 |

## วิธีทำงาน

- อ่าน Status และ Blocked by ในไฟล์งานก่อนเริ่ม ใช้ไฟล์นั้นเป็นแหล่งสถานะ ไม่คัดลอกสถานะจากตารางนี้
- งาน 01–10 เสร็จสำหรับรุ่น localStorage; ออนไลน์/ล็อกอินย้ายไป future-online.md ยังเป็น needs-info
- Browser ใช้ viewport มือถือจำลอง ยังไม่ได้ทดสอบอุปกรณ์จริงหรือข้อมูลจริงของร้าน
- เมื่องานเสร็จ ใช้ Status: done และบันทึกผลตรวจจริงใน Comments
- งานทุกส่วนใช้กติกาล่าสุด: ทุกการขายมีบิลและตัดสต็อกทันที ไม่มีปิดวัน
