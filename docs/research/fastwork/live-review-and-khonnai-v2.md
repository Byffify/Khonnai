# Fastwork Selling: live review และข้อเสนอ Khonnai landing v2

ตรวจ17ตุลาคม2026 จาก [Fastwork Selling](https://fastwork.com/selling) และหน้าไทยที่เมนู Language เปิดไปยัง https://fastwork.com/th/selling. รอบนี้เป็น investigation/recommendation; ไม่มีการแก้ implementation ของ landing หรือแอป

Throughput checkpoint: n/a, read-only investigation. Root ตรวจ browser สด; background researcher เทียบ source ของเราและ archive แยกไฟล์ไว้ใน .scratch/fastwork-landing-review/reference-gap.md.

## คำตัดสิน

แนะนำเปลี่ยน composition ของ landing ให้เป็นลำดับฉากตาม Fastwork มากขึ้น โดยคงสีขาว ส้ม #ed7c32 น้ำเงิน #193b5a, Anuphan/Plus Jakarta, Rammetto wordmark และ Iconly ของ Khonnai. หน้าเราปัจจุบันใช้ foundation เดียวกัน แต่ hero ยังแบ่งซ้าย/ขวาและ sections ส่วนใหญ่เป็น static editorial; ยังขาด floating navigation, surrounding cards, sticky scene handoff และการสาธิตหลายงานในฉากเดียว. ข้อเสนอนี้เป็นงาน landing ใหม่ ไม่ใช่การเปลี่ยน flow ของแอป

## หลักฐานที่ตรวจสด

| ส่วน | สิ่งที่เห็น/ลองจริง | นำมาใช้กับ Khonnai |
|---|---|---|
| Hero | ข้อความกลาง การ์ดผลงานล้อมขอบ คำแทนบุคคลสลับภาษา countdown CTAคู่ และ scroll cue | ข้อความของ Khonnai ตรงกลาง ล้อมด้วยการ์ดสินค้า/ไซซ์/สี/บิลที่ติดป้ายข้อมูลตัวอย่าง; ใช้ CTAเริ่มใช้งานและดูตัวอย่าง |
| Hero exit | ระหว่างเลื่อน copyเบลอและการ์ดแยกออก ก่อนฉากถัดไป | จัดการ์ดมารวมเป็น catalog/workbench ให้ motionอธิบายการจัดข้อมูล |
| Navbar | แถบลอย logo/language และ CTAปรากฏตามช่วงหน้า; พื้น glassปรับตามฉาก | capsuleสีขาวโปร่งเล็กน้อย ลอยด้านบน logo/language/เริ่มใช้งาน; คุม contrastน้ำเงิน |
| People | หัวเรื่องใหญ่สอดแทรก avatars แล้วเชื่อมกับตัวอย่างโปรไฟล์ | ใช้หัวเรื่องงานหน้าร้านและภาพ/การ์ดสินค้าของเรา ไม่ใช้ avatarหรือลูกค้าที่ไม่มีหลักฐาน |
| Showcase desktop | แสดงโปรไฟล์ใหญ่ มีอาชีพด้านข้าง; เลื่อนแล้วอาชีพ/โปรไฟล์/hashเปลี่ยน; กดแท็บ Reviewsแล้วเนื้อหาเปลี่ยน | ตัวเลือกสินค้า/บิล/จอง/คืน แสดงหน้าตัวอย่างใหญ่ใน sceneเดียว พร้อมปุ่มเลือกเอง |
| Showcase mobile | อาชีพเป็น railแนวนอน มีส่วนของการ์ดข้างเคียง; Enterที่ Photographerเลือกและเปลี่ยนโปรไฟล์จริง | railหรือปุ่มงานแบบแตะได้; ขนาดตัวอักษรและจำนวนไม่ย่อเหลือ10px |
| Pain notes | โน้ตสีบนพื้นเข้ม ลากได้จริง; ลากหนึ่งใบแล้วตำแหน่งและinlineleft/topเปลี่ยน | ข้อสงสัยของร้าน เช่น ไซซ์นี้เหลือเท่าไร/ของจองอยู่ตรงไหน/หาบิลเดิมไม่เจอ ใช้โทนอ่อนของส้ม/น้ำเงินบนพื้นขาว |
| Commission/value | กลับสู่พื้นขาว ตัวเลข/underline/ภาพประกอบสื่อคุณค่า; มีปุ่มอธิบายเพิ่ม | เปลี่ยนเป็นคุณค่าที่มีจริง: สินค้า→ไซซ์→สี, บิลที่เชื่อมสต็อก และการสำรองข้อมูล; ไม่ยก0%/18%หรือclaimsทางธุรกิจของเขามา |
| Explanation desktop | ปุ่มรองเปิดแผงอธิบาย โฟกัสไป Close; Escapeปิดได้ | ใช้เฉพาะคำอธิบายที่ต้องอ่านเพิ่ม เช่นข้อมูลเก็บที่ไหน; คงfocus/การปิด |
| Explanation mobile | เปิดเป็น bottomsheetพร้อมscrim/blurและปุ่มปิดด้านบน | sheetสำหรับรายละเอียดเดียวกัน โดยข้อมูลหลักยังอ่านได้บนหน้า |
| Platform stories | เรื่องพอร์ต/การค้นหา/การจ่ายเงิน/ออเดอร์ สลับภาพUIและข้อความ มีการ์ดรีวิว/การค้นหา/ใบเสนอราคาเคลื่อนไหว | สลับเรื่องสินค้า บิล จอง/คืน และสำรอง ใช้หน้าจอ/การ์ดที่ตรงฟีเจอร์เรา |
| CTAหลัก | กดด้วยคีย์บอร์ดแล้วไป /login พร้อมredirectTo=/selling/onboard?source=web_start-selling_landing | Khonnaiเปิดแอปเดิมที่ / โดยตรง ตามความสามารถปัจจุบัน |
| ภาษา | EN/ไทย/Indonesia; เลือกไทยแล้วtitleและcopyเปลี่ยน ไป /th/selling | ใช้ผู้ให้บริการภาษาไทย/อังกฤษเดิมของเรา |
| Footer | DOMมีผู้ให้บริการ/ลิขสิทธิ์/Privacyและส่วนtermsที่ซ่อนอยู่ | ใส่เฉพาะลิงก์/ข้อมูลของ Khonnai ที่มีจริง; ไม่กดรับข้อตกลงของต้นทาง |

ตรวจสองภาษาและ viewport1440×900/390×844. ขนาด viewportเริ่มแรกเปลี่ยนตามpanel จึงตั้งขนาดคงที่ในการตรวจ responsive และคืนค่าเมื่อจบ. ภาพเป็นจุดเวลาหนึ่งของ animation; ไม่ใช่การบันทึกวิดีโอทุกเฟรม

## แหล่ง CSS ที่ยืนยันซ้ำ

ส่งออกเฉพาะ stylesheetที่ browserพบจริงผ่านpageAssets. ทั้งสามไฟล์มีSHA256ตรงกับarchiveเดิมทุกbyte จึงยังใช้ inventory/keyframe appendixเดิมประกอบได้:

| ไฟล์สด | SHA256 | สำเนา |
|---|---|---|
| 50.DuRXMnFW.css |048B51BFB4C94B5097769EBCF957363E8F49DFE500518198C131A52D3E88F2C7 | live-assets/selling.css |
| 0.0gKxBXBV.css |0E8E4F9F77C8A5E806F1246C74149338BFBF32761B650E3F6975DC9223F43188 | live-assets/global.css |
| IconButton.C70IQO1T.css |DC4D6866588B5BD9E33DB6280EBA0E5B2885BD162C599358168901C4E1BA14F5 | live-assets/controls.css |

ดู [CSS/motion inventory](css-motion-inventory.md), [keyframe appendix](assets/keyframe-appendix.md), [archive observation](observations.md) และ [landing reference](landing-reference.md). SourceURLอยู่ในlive-assets/manifest.json; outputs/fastwork-live-review/css-digests.jsonบันทึกhash. ตัวเลขต่อไปเป็นCSSdeclarations ไม่ใช่การวัดdurationจากวิดีโอหรือJSorchestrationทุกstate

| Motion ต้นทาง | ค่าจาก CSS | แนวทางประยุกต์ |
|---|---|---|
| Feedback |125ms; standard cubic-bezier(.24,1,.4,1) | ใช้tokenเดิมของเรา125/160ms |
| Hero copy |700ms, blur16px, Y12px, delay1.14s | copyเข้าอย่างอ่านง่าย; ปุ่มหลักใช้งานได้ทันที |
| Card-from-ring |1.7s, cubic-bezier(.2,.9,.2,1) | รอบแรกการ์ดสินค้าเข้าฉาก; ไม่วนรอบระหว่างอ่านตัวเลข |
| Profile content |320ms/Y8px; profile body480ms/Y12px | เลือกงานแล้วเปลี่ยนแผง180–320ms;ตัวเลขแสดงค่าจริงทันที |
| Note entry |560ms | คำถามร้านเข้าฉาก แล้วเคลื่อนเป็นคำตอบ/งานที่ทำได้ |
| Navbar |width680ms; background700ms; hideopacity280ms/transform320ms | morphสั้นและคงปุ่มให้เข้าถึงได้; thresholdต้องกำหนด/ทดสอบใหม่ |
| Explanation |panel/backdrop400ms | desktopแผงข้าง/mobilebottomsheet พร้อมfocusและEscape |
| Loop effects |reviewmarquee90s, currency56s, CTAcomet3.333s | ใช้เฉพาะการเคลื่อนไหวที่มีความหมาย; ไม่สร้างรีวิวปลอมหรือเคลื่อนจำนวนสต็อก |

## โครงหน้า Khonnai ที่แนะนำ

1. **Hero — รู้ของในร้าน ก่อนขายทุกครั้ง**: headingกลาง การ์ดตัวอย่างสินค้า/ไซซ์/สี/จำนวน4–6ใบตามขอบ; primaryเริ่มใช้งานคนใน→/ และ secondaryลองดูตัวอย่าง→sceneสาธิต. โลโก้gradientเดิม; ข้อความหลักสีน้ำเงิน/ink. ไม่ใส่countdownหรือRSVPเมื่อไม่มีงานเปิดตัวจริง
2. **จากรายการกระจัดกระจาย มาเป็นสินค้าที่หาเจอ**: การ์ดจัดตัวรวมเป็นหน้าสินค้า แล้วเปิดตัวอย่างให้เลือกไซซ์และสีเอง. ยอดก่อนขาย24/ขาย2/คงเหลือ22เป็นข้อมูลสาธิต ไม่เขียนstorage
3. **งานหน้าร้านในที่เดียว**: เปลี่ยนOccupation tabsเป็นสินค้า/บิล/จอง/คืน. ให้scrollพาไปข้างหน้าได้ แต่ปุ่มเลือกเองต้องทำงานทั้งkeyboardและtouch ไม่บังคับเลื่อนผ่านทุกฉาก
4. **คำถามที่เจอทุกวัน**: โน้ตในคำถามของร้าน ใช้พื้นขาวและโทนอ่อนส้ม/น้ำเงินแทนการคัดลอกสีรุ้ง/พื้นดำ. ถ้าลากได้ ต้องมีประโยชน์หรือเป็นoptional ไม่มีข้อมูลซ่อนหลังการลาก
5. **บิลที่เชื่อมกับสต็อก**: UIเลือกสินค้า→รายการบิล→จำนวนหลังขาย ประกอบเป็นลำดับ. ตัวบิลที่ใช้จริงยังใช้renderer/ฟอนต์เดิม; ไม่ตกแต่งPNGตามธีมlanding
6. **จอง คืน และสำรอง**: ฉากUIสลับด้าน บอกว่าจองกันจำนวนออกจากยอดที่ยังขายได้, คืนมีผลตามสถานะสินค้า, สำรองเป็นไฟล์ในเครื่อง. ไม่อ้างcloud/login/syncข้ามเครื่อง
7. **คำถามและเริ่มใช้งาน**: FAQที่มีอยู่เก็บไว้ พร้อมCTAชัดหนึ่งชื่อและข้อจำกัดข้อมูลในเบราว์เซอร์ที่อ่านเจอได้ง่าย

คงwhite themeเป็นฐาน. ส้มกับน้ำเงินยังเป็นสีแบรนด์หลัก;พื้นรองneutralและtintsของสองสี. ใช้ภาพสินค้าและUIของ Khonnai หรือข้อมูลสาธิตที่ระบุชัด แทนภาพพอร์ตฯ/รีวิว/รายได้/จำนวนผู้ใช้ของ Fastwork

## ลำดับดำเนินการที่คุ้มที่สุด

P0: เปลี่ยนHeroและNavbar พร้อมโครงsceneและข้อมูลตัวอย่างให้เป็นระบบเดียวกัน.
P1: เชื่อมHero→workbench→tasktabsและfeaturestory; ทำมือถือเป็นcompositionเฉพาะ ไม่scaleorbitdesktopลงทั้งชุด.
P2: เพิ่มรายละเอียดmotion/transitionที่เหลือ พร้อมreducedmotion, keyboard, zoom200%, performanceและcleanupของscroll/observers.

Model the Domain: กำหนดsceneและselectionเป็นข้อมูลชุดเดียว;ป้องกันscrollกับtabควบคุมstateขัดกัน. Experience First: motionพาเข้าใจงานหน้าร้านและปุ่มเริ่มใช้ ไม่ยกเนื้อหาธุรกิจที่ไม่เกี่ยวมา. Prove It Works: ต้องทดสอบหน้าใหม่จริงทั้งnormal/reducedmotion,desktop/mobile,การเลือกเองและstorageisolationก่อนอ้างว่าเสร็จ

## ขอบเขตและสิ่งที่ยังไม่ยืนยัน

ไม่ได้ล็อกอิน สร้างบัญชี รับterms หรือเข้าonboardingหลังlogin. ไม่ยืนยันทุกhover/microstateหรือcurveของJSจากCSSเพียงอย่างเดียว. การ์ดรีวิวและข้อมูลโปรไฟล์ที่เห็นเป็นเนื้อหาของหน้าอ้างอิง ไม่ใช่หลักฐานลูกค้าของ Khonnai. ไม่ได้วัดFPS/CPUหรือทดสอบscreenreader/อุปกรณ์จริง. ReducedmotionของFastworkมีCSSให้ตรวจ แต่controlledruntimecaptureรอบนี้ไม่สำเร็จ จึงไม่อ้างว่าทดสอบครบ

REA capture_browser_scenario ถูกลองด้วยbrowserที่ติดตั้งอยู่ แต่providerคืนexecution_failure;อ่านdoctorพบregistrationCodexaligned ไม่ได้เปลี่ยนconfigurationหรือติดตั้งengineอื่น. หลักฐานruntimeรอบนี้จึงมาจากCUA browserโดยตรงร่วมกับCSSที่ส่งออกจริง ไม่ใช่การอ้างว่าREAจับscenarioสำเร็จ. ไม่มีการรันbuild/testsของแอป เพราะรอบนี้ไม่มีการแก้โค้ดแอป

ภาพอ้างอิงอยู่outputs/fastwork-live-review: Heroมือถือ, Profiledesktop, Mobile rail, painnotes, Platform, explanationdesktop/mobile และหน้าloginปลายทางCTA. ภาพเหล่านี้เป็นภาพหน้าFastworkเพื่อวิจัย ไม่ใช่assetที่จะนำไปเผยแพร่เป็นหน้าKhonnai

รายละเอียดภาพและการresampleอยู่outputs/fastwork-live-review/PROVENANCE.md. Browserส่งJPEGจึงใช้สกุล.jpgตามbytesจริง; ชื่อ390/1440ระบุviewportที่ขอตรวจ ไม่รับรองencodedpixelเท่ากัน ภาพHerodesktopจากtabใหม่ใช้default1265×712ตามที่บันทึกในชื่อไฟล์.
