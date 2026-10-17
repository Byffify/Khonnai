# Browser observation ledger

วันที่17ตุลาคม2026, targetหลัก `https://fastwork.com/selling` เริ่มจากURLผู้ใช้ `https://fastwork.com/` รหัสด้านล่างเป็นบันทึกสรุปจากtool outputsในแชต ไม่ใช่rawtraceหรือREA Evidence IDs ไม่มีscreenshot/videoบันทึกลงชุดไฟล์นี้; screenshotถูกดูระหว่างสำรวจเท่านั้น

| ID | การตรวจ/แหล่ง | ผลที่ยืนยันได้ | ข้อจำกัด |
|---|---|---|---|
| F01 | Browser open + first-party web open | rootพาไปselling; section inventoryจากDOM: hero-track, people/profile-showcase, pain, commission, platform | ไม่ใช่sitemapทุกหน้าของบริการ |
| F02 | Desktop1440×900, screenshot/computed | hero64/73.6px weight500 spacing−1.6px; orbitภาพรอบcopy; headerลอย | fontstackไม่ใช่rendered-font proof |
| F03 | Snapshotหลายเวลา | heroคำเปลี่ยนหลายภาษาและcountdownตัวเลขเปลี่ยน; languagebuttonมีชื่อ | ไม่จับcycleครบ/ไม่วัดinterval |
| F04 | Scroll cue + scroll desktop | sectionpeopleเข้ามา, heroblurระหว่างexit, profilehashเปลี่ยนตามสถานะเลื่อน | scrollthreshold/easingdriverยังไม่ทราบ |
| F05 | Sound Composer content tabs | Services/Reviews/Aboutเปลี่ยนDOMและselectedstate; Portfolioกลับได้ | ไม่ตรวจทุกsub-tab/ทุกรีวิว |
| F06 | Pain screenshot desktop/mobile +DOM | noteเอียงซ้อนpastel, buttonlabelsสำหรับdrag; mobilecomputedcursor default | ไม่ได้drag; ไม่ยืนยันphysics/inertia |
| F07 | Platform screenshot/DOM | พื้นเข้ม,illustrationsสลับแถว,ภาพจำลองsearch/profile/payment/order | ไม่ได้ใช้งานจริงหรือรอครบทุกloop |
| F08 | Why buttonเปิดdialog desktop | panel600×682.8px ณ1440×900, x816,y108.6, radius16; transform400ms ease-in-out; backdropopacity400ms | ขนาดขึ้นกับcontent; durationมาจากcomputedไม่ใช่วัดเฟรม |
| F09 | Get started→login→email | socialoptions4ทาง; emailinputมีlabel,typeemail; Continue disabledเมื่อว่าง; formcontent352px; CTA48px,radius9999 | ไม่กรอก/submit/รับOTP/acceptterms |
| F10 | Mobile390×844 +all6occupation | occupationเปลี่ยนprofile/hashได้; hero40/46px,copygap40,padding20; CTAstackคอลัมน์/รองก่อน; railoverflowauto | desktop railเคยไม่ปรากฏในบางscrollstate; ไม่มีdeviceemulationtouch |
| F11 | Language popover | English,ไทย,BahasaIndonesia; expandedstate | เปิดดูเท่านั้น ไม่เปลี่ยนpreference/ไม่ตรวจtranslatedlayout |
| F12 | MobileWhy dialog/Escape | panel390×759.6px,x0,y84.4; topradius16; backdropblur16; focusClose; Escapeแล้วpanelหาย | ไม่ตรวจfocustrap/restorationทุกกรณี |
| F13 | DOM/CSSOM inventory | sellingCSShrefตรงกับสำเนา; CSSOM1255top-levelrules; loadedsharedstylesมีreduced-motionหลายชุด | ไม่เท่ากับkeyframecount; บางsharedcomponentsยังไม่ใช้ |
| F14 | PublicHTTPretention | เก็บsellingHTML+CSS3ไฟล์และSHA-256ในmanifest | assethash/URLเปลี่ยนได้ตามdeployment |
| F15 | REAdoctor6.5.0 | Codexregistrationaligned;skill42aligned; activecallabletoolsไม่มีREA | ไม่ใช่หลักฐานว่าMCPเชื่อมแล้ว; ไม่repairซ้ำ |

## ผลที่ยังไม่ยืนยันและการลองที่ไม่สำเร็จ

- BrowserChromeไม่มีให้ควบคุมในsessionนี้ จึงใช้in-appbrowser
- Avatarpreview:พบaccessiblebuttonและCSS แต่คลิกที่ลองแล้วไม่พบpreviewpanelที่ยืนยันได้ จัดเป็นstaticrecipe/unknown
- การคลิกoccupationบนdesktopครั้งหนึ่งหาtargetไม่ได้เพราะstateไม่แสดงrail; mobileเลือกทั้ง6รายการได้ภายหลัง จึงไม่สรุปว่าfeatureเสีย
- `document.getAnimations()`ไม่รองรับในread-onlybrowserinspection จึงไม่มีWebAnimationsAPIruntimeinventory ใช้CSSdeclarationsแทน
- Snapshotหลังnavigation/transitionบางครั้งเป็นสถานะก่อนหน้า จึงตรวจซ้ำเมื่อsettledก่อนสรุปผล
- เริ่มต้นbrowser319×1724ใช้เป็นการสังเกตจอแคบเท่านั้น ไม่แทนmobilephysicaldevice

## วิธีตรวจซ้ำด้วยคน

1. เปิดrootและบันทึกresolvedURL
2. Desktop1440×900:ดูhero,ใช้scrollcue,เลื่อนผ่านshowcase→notes→commission→platform
3. ในprofileเลือกcontenttabsทั้ง4; จดselectedstateและcontentที่เปลี่ยน
4. เปิดexplanationlinkในcommission; ตรวจdialog/closebutton
5. เข้าCTAแล้วเปิดemailformโดยไม่ส่งข้อมูล
6. Mobile390×844:เริ่มheroใหม่,เลือกoccupationทั้ง6,เปิดdialogและEscape
7. ตรวจreduced-motion/touch/focustrapเพิ่มเติมหากจะใช้เป็นacceptanceของredesign

Viewportoverrideถูกresetหลังสำรวจ ไม่มีการเข้าสู่ระบบหรือเปลี่ยนข้อมูลบัญชี/ยอมรับข้อตกลง
