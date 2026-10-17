# Hover.dev motion ที่เหมาะกับ landing Khonnai

ตรวจ 17 ตุลาคม 2026. เอกสารนี้แยกชื่อ component ที่อ่านจากเว็บต้นทางออกจากข้อเสนอสำหรับ Khonnai. ใช้ร่วมกับ [Fastwork review](./live-review-and-khonnai-v2.md) และ [DESIGN.md](../../../DESIGN.md).

## หลักฐานและขอบเขต

อ่าน [catalog หลัก](https://www.hover.dev/components) และหน้า 11 หมวดด้านล่างผ่านเครื่องมือเว็บ. นี่เป็น textual inventory ของหน้า official ไม่ใช่ผลทดสอบ animation ใน browser. ชื่อ component บอกแนวทางได้ แต่ยังไม่ยืนยันระยะเวลา, easing, touch, keyboard, reduced motion หรือประสิทธิภาพของต้นทาง. การตรวจ runtime ของ prototype ต้องรายงานแยก.

Catalog ระบุ React, Tailwind CSS และส่วนผสมของ Framer Motion, vanilla JavaScript, keyframes หรือ animation library อื่น. ไม่ได้ติดตั้ง dependency เพิ่ม และไม่ได้เปิดหรือคัดลอก source หลังปุ่ม Get the code.

## รายการที่เกี่ยวข้องกับ landing

ชื่อด้านล่างเป็นตัวอย่างที่พบจริงในแต่ละหมวด ไม่ใช่การรับรองว่าทดสอบทุกตัวแล้ว.

| หมวดและแหล่งต้นทาง | ชื่อที่พบ | ความเกี่ยวข้องกับ Khonnai |
|---|---|---|
| [Testimonials](https://www.hover.dev/components/testimonials#hover-greyscale-logo-carousel) | Hover Greyscale Logo Carousel, Ribbon Logos, Double Scrolling Logos, Folding Logos, Stacked Card Testimonials | ใช้จังหวะแถวเลื่อนกับความสามารถของเรา โดยไม่ใส่โลโก้ลูกค้าหรือรีวิวที่ไม่มีหลักฐาน |
| [Heros](https://www.hover.dev/components/heros) | Velocity Hero (scroll), Fifty Fifty Hero, Smooth Scroll Hero, Shuffle Hero, Image Grid Hero (scroll) | ใช้ scene สินค้าประกอบตัวเป็นพื้นที่ทำงาน หัวเรื่องและ CTA ยังคงอ่านได้ |
| [Features](https://www.hover.dev/components/features) | Sticky Cards (scroll), Tabs Features, Swap Column Features, Vertical Slide Features, Text Parallax Content (scroll) | เล่าเรื่องสินค้า บิล จอง และคืนด้วย UI ชุดเดียวที่สลับสถานะ |
| [Buttons](https://www.hover.dev/components/buttons) | Rounded Slide Button, Draw Outline Button, Spotlight Button, Magnet Button, Marquee Button | เลือก feedback แบบสั้นที่ CTA. ไม่ทำปุ่มวิ่งหนี pointer หรือข้อความปุ่มอ่านยาก |
| [Cards](https://www.hover.dev/components/cards) | Hover Tilt Card, Drag Cards, Swipe Cards, Reveal Cards, Spring Cards | ใช้การ์ดสินค้าเป็นภาพประกอบ. ไม่ tilt จำนวนหรือซ่อนข้อมูลสำคัญไว้หลัง hover |
| [Carousels](https://www.hover.dev/components/carousels) | Swipe Carousel, Horizontal Scroll Carousel, Card Carousel, Modern Carousel | ใช้ rail ที่เลือกเองได้บนมือถือแทน orbit desktop ที่ย่อทั้งชุด |
| [Navigation](https://www.hover.dev/components/navigation) | Simple Floating Nav, Glass Navbar, Rounded Drawer Nav, Hover Flip Nav | Navbar capsule สอดคล้อง Fastwork. ลิงก์และชื่อเมนูต้องคงตำแหน่งอ่านง่าย |
| [Tabs](https://www.hover.dev/components/tabs) | Slide Tabs, Shift Highlight Tabs, Chip Tabs | selected indicator เคลื่อนระหว่างสินค้า บิล จอง และคืน โดยไม่บังคับ autoplay |
| [Accordions](https://www.hover.dev/components/accordions) | Vertical Accordion, Basic FAQ, Accordion Solutions | FAQ เปิดคำตอบพร้อมเครื่องหมายหมุน. คง semantics และ focus ของ native details |
| [Progress](https://www.hover.dev/components/progress) | Morph Stepped Progress | บอกลำดับเลือกสินค้า ทำบิล และดูยอดหลังขาย. เลือกขั้นเองได้ |
| [Text](https://www.hover.dev/components/text) | Draw Circle Text, Vanish Text, Velocity Text (scroll), Bubble Text, Live Users Now | ขีดวงรอบคำสั้นครั้งเดียวได้. ไม่สลับหัวข้อไทยหรือทำยอดและตัวเลขผู้ใช้วิ่ง |

Catalog หลักยังมีหมวด FAQ, Forms, Pricing, Sign in, Stats, 3D, Kanban Boards, Calendars, Countdown, Dropdown Menus, Grids, Inputs, Links, Loaders, Modals, Notifications, Other, Tables และ Toggles. รอบนี้ตรวจชื่อหมวดจาก index เท่านั้น ไม่ได้อ่านทุกตัวในหมวดเหล่านี้. ไม่เพิ่มฟีเจอร์ login, pricing, countdown, kanban หรือ workflow ใหม่เพียงเพราะมีตัวอย่างให้ดู.

## ข้อเสนอสำหรับ prototype รอบนี้

ข้อกำหนดด้านเวลาทั้งหมดต่อจากนี้เป็นค่าที่เสนอสำหรับ Khonnai ไม่ใช่เวลาที่วัดจาก Hover.dev.

1. ทำแถวเลื่อนความสามารถต่อจาก Hero ตาม Hover Greyscale Logo Carousel. ใช้ Iconly และคำสั้น สินค้า, ไซซ์และสี, สต็อก, บิล, จอง, คืนและเปลี่ยน, สำรองข้อมูล. เริ่มเป็นสีน้ำเงินเทา เมื่อ hover หรือ focus ใช้สีแบรนด์. ไม่มีลูกค้าหรือ partner ที่แต่งขึ้น. เสนอรอบละ 32 วินาที พร้อมปุ่มหยุด, หยุดเมื่อ hover หรือ focus และมีข้อความชุดเดียวให้ assistive technology อ่าน. Reduced motion เป็นรายการนิ่งที่อ่านครบ.
2. ให้การ์ดตัวอย่างสินค้าเข้าฉากรอบหัวเรื่อง แล้วเรียงเข้า workbench เมื่อ scroll. ใช้ opacity และ transform ช่วง 480–700ms. ข้อความหลักและ CTA ไม่หายระหว่างฉาก. มือถือใช้การ์ดเรียงตามเนื้อหา ไม่บังคับผ่าน scroll ระยะยาว.
3. เพิ่ม selected pill แบบ Slide Tabs สำหรับสินค้า บิล จอง และคืน. ใช้ 160–220ms. เปลี่ยนสถานะทันทีจากการเลือก และไม่เปลี่ยนแท็บเองระหว่างผู้ใช้กดไซซ์หรืออ่านยอด.
4. ทำฉากเลือกสินค้า ทำบิล และยอดหลังขายตามแนว Sticky Cards และ Morph Stepped Progress. ใช้ภาพเชื่อมความสัมพันธ์ระหว่างรายการแทนการ count-up. ตัวอย่าง 24 ขาย 2 เหลือ 22 แสดงค่าจริงทันที. การเคลื่อนไหวเป็นคำอธิบายประกอบ ไม่ใช่เงื่อนไขคำนวณ.
5. ใช้ floating navbar แบบ Fastwork ร่วมกับแนว Simple Floating Nav. ลด padding และเพิ่มเส้นขอบเมื่อเลื่อนผ่าน Hero. CTA ยังอยู่ตำแหน่งที่กดได้ ไม่มี hide-on-scroll ที่ทำให้ต้องหาเมนู.
6. ใช้ Draw Circle Text กับคำสั้นหรือเส้นใต้จุดสำคัญในส่วนปัญหาร้านเพียงครั้งเดียว. ใช้ส้ม 400–600ms. ไม่แยกอักษรไทยเป็น span รายตัว และไม่ใส่ blur ระหว่างอ่าน.
7. เพิ่ม feedback ให้ CTA และ FAQ. CTA เปลี่ยนพื้นและเลื่อนลูกศรสั้น 125–160ms. FAQ ใช้ 200–240ms พร้อมคำตอบที่ยังเลือกข้อความได้. ไม่ใช้ magnet, marquee label หรือ text scramble กับ action หลัก.

แนะนำทดสอบ prototype ที่มีแถวเลื่อนหนึ่งแถวและฉากหลักหนึ่งฉากก่อน. เพิ่ม motion ให้เห็นเหตุและผลในงานร้าน มากกว่าทำให้ทุกส่วนเคลื่อนพร้อมกัน. คงพื้นขาว `#193b5a`, `#ed7c32`, ฟอนต์ Anuphan/Plus Jakarta Sans และ wordmark เดิม.

## ขอบเขตที่ต้องรักษาเมื่อนำไปพัฒนา

ข้อมูลตัวอย่างต้องอยู่ในหน่วยความจำของ landing. ไม่อ่านหรือเขียน `micro-erp-v1`, ไม่เปลี่ยน domain commands, schema, flow แอป หรือ renderer กระดาษบิลและ PNG. ข้อความจากสไลด์ต้องแยกเรื่องที่ทำได้จริง เรื่องใน roadmap และตัวเลขที่ยังไม่มีหลักฐานก่อนเผยแพร่.

ตรวจ keyboard, touch, 390/1440px, zoom, focus, reduced motion, ปุ่มหยุดการเลื่อน และ overflow จากหน้า prototype ที่เปิดจริง. ห้ามใช้ผล build หรือการอ่าน component name เป็นหลักฐานว่า animation ใช้งานได้.

หลัก Experience First ทำให้เลือกแถวเลื่อนที่บอกความสามารถและฉากที่อธิบายการขาย แทน Live Users Now, text scramble, cursor trail หรือ loop หลายชุดที่แข่งกับการอ่านยอด.
