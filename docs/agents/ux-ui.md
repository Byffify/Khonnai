# UX/UI Agent Skills สำหรับ Khonnai

## เริ่มงาน UI

อ่านไฟล์นี้ก่อนออกแบบ พัฒนา หรือ review UI แล้วอ่านเฉพาะ reference ที่ตรงงานจาก `node_modules/ux-ui-agent-skills/` ใช้แพ็กเกจที่ประกาศใน package.json และเวอร์ชันที่ล็อกใน package-lock.json โดยตรง หลัง clone ใช้ `npm.cmd ci` เพื่อคืน dependency ตาม lockfile

1. อ่าน [ทิศทาง Khonnai ล่าสุด](../research/fastwork/khonnai-adaptation.md) และ [DESIGN.md](../../DESIGN.md) แยก target redesign ออกจาก current implementation
2. เลือกคู่มือจากตารางด้านล่าง แล้วใช้กับงานที่ผู้ใช้ขอ
3. ก่อนสรุปผล ระบุสิ่งที่ตรวจจริง คำสั่ง/เป้าหมาย และสิ่งที่ยังไม่ได้ตรวจ

Root AGENTS.md ยังคงเป็นกฎของ repo ชุดนี้เป็นเครื่องมือเสริม ไม่มี MCP registration, Claude hooks หรือ slash skills ที่เปิดใช้งานเพิ่มจากการติดตั้ง npm ครั้งนี้

## ลำดับการใช้กฎและข้อยกเว้นของ Khonnai

คำสั่งผู้ใช้ล่าสุดและ brief ของ Khonnai มีลำดับเหนือค่าเริ่มต้นของแพ็กเกจ ใช้ [master doctrine](../../node_modules/ux-ui-agent-skills/AGENTS.md) เป็น reference สำหรับงาน UI โดยตีความผ่านข้อกำหนดต่อไปนี้:

- **Brand:** redesign ใช้พื้นขาว ส้ม `#ed7c32` และน้ำเงิน `#193b5a`; neutral surfaces/text และ foundation จาก Fastwork สีสถานะใช้ตามความหมายได้ กฎ generic เรื่อง accent เดียวหรือ warm-white ไม่แทน brief นี้
- **ภาษาไทยและ scale:** จัดลำดับข้อความให้ชัดและอ่านง่ายสำหรับเจ้าของร้าน40+ หัวข้อในหน้าทำงานไม่จำเป็นต้องใหญ่2.5เท่าของ body คงพื้นที่แตะ48–52pxและจำนวนพร้อมหน่วยตาม brief
- **Tokens:** ใช้แหล่ง tokens/generator ที่โปรเจกต์กำหนด ตรวจเส้นทางสร้างก่อนแก้ generated CSS; ไฟล์ DTCG ในแพ็กเกจเป็น reference ไม่ใช่ธีมใหม่ที่จะ import ทับระบบปัจจุบัน การ migrate token format เป็นอีกงานหนึ่ง
- **Controls:** รักษา native controls ที่ใช้งานได้ เช่น select และ file picker จนกว่าจะมีเหตุผล UX ที่ชัดเจน หากเปลี่ยนเป็น custom ต้องคง label, keyboard, typeahead ที่เกี่ยวข้อง, focus และ ARIA ให้ครบ กฎ ban native select ของแพ็กเกจไม่บังคับกับ repo นี้
- **States:** ตรวจ default/hover/focus/active/disabled/loading/error/selected ตามชนิด control และสถานะที่มีจริง ใช้สถานะที่เหมาะสมโดยไม่สร้าง interaction ที่ไม่มีความหมาย
- **Motion:** ใช้ตาราง motion แอปใน brief; การ commit ข้อมูลและตัวเลขจริงไม่ขึ้นกับ animationend รองรับ reduced motion ส่วน landing เก็บ [reference](../research/fastwork/landing-reference.md) และ [motion inventory](../research/fastwork/css-motion-inventory.md) ไว้ออกแบบภายหลัง
- **Domain:** คง flow สินค้า/บิล/จอง/คืน/เปลี่ยน/สำรอง กติกาสต็อก schema และ recovery ตามเอกสาร domain การติดตั้งเครื่องมือไม่อนุมัติการเพิ่ม marketplace หรือเปลี่ยนพฤติกรรมแอป

อย่าคัดลอก master doctrine ทับ root AGENTS.md; ใช้หัวข้อ UX/UI เป็น pointer มายังเอกสารนี้เพื่อคงกฎ issue tracker, triage และ domain เดิม

## เลือก reference ตามงาน

ทุกลิงก์ต่อไปนี้เป็นไฟล์ของ dependency ที่ติดตั้ง ไม่ต้องคัดลอกตัวอย่างเข้ารากโปรเจกต์

| งาน | เอกสาร |
|---|---|
| วิธีติดตั้ง/ขอบเขต Codex และ gates | [INSTALL](../../node_modules/ux-ui-agent-skills/docs/INSTALL.md) |
| Button/input/พื้นฐาน | [atoms](../../node_modules/ux-ui-agent-skills/components/atoms.md), [forms](../../node_modules/ux-ui-agent-skills/components/forms-advanced.md) |
| Navigation/tabs | [navigation](../../node_modules/ux-ui-agent-skills/components/navigation.md) |
| Dialog/feedback | [overlays](../../node_modules/ux-ui-agent-skills/components/overlays.md), [feedback](../../node_modules/ux-ui-agent-skills/components/feedback.md) |
| React/Tailwind | [adapter](../../node_modules/ux-ui-agent-skills/frameworks/react-tailwind.md) |
| Redesign/review | [redesign audit](../../node_modules/ux-ui-agent-skills/workflows/redesign-audit.md), [design review](../../node_modules/ux-ui-agent-skills/workflows/design-review.md), [QA](../../node_modules/ux-ui-agent-skills/workflows/design-qa.md) |
| Accessibility | [WCAG checklist](../../node_modules/ux-ui-agent-skills/accessibility/wcag-checklist.md), [ARIA](../../node_modules/ux-ui-agent-skills/accessibility/aria-patterns.md), [i18n](../../node_modules/ux-ui-agent-skills/accessibility/i18n-rtl.md) |
| Token build | [workflow](../../node_modules/ux-ui-agent-skills/workflows/token-build.md); ใช้ร่วมกับ pipeline ปัจจุบัน ไม่แทนโดยอัตโนมัติ |

## คำสั่งที่ใช้ได้จากรากโปรเจกต์

PowerShell บน Windows ใช้ `.cmd` เพื่อไม่ขึ้นกับ execution policy ของ npm.ps1:

```powershell
npm.cmd run ux:skills
node.exe node_modules/ux-ui-agent-skills/bin/cli.js version
```

`ux:skills` แสดงรายการหมวด reference/เครื่องมือ ไม่ใช่ผล audit แอป และไม่ใช่รายชื่อ slash commands ที่ติดตั้งใน Codex

### ตรวจ source / token files

ต้องมี Python3 ที่ใช้งานได้ (`python --version`); หากเครื่องใช้ launcher ให้แทน `python` ด้วย `py -3` ตัวอย่างต่อไปนี้ใช้ path เป้าหมายที่มีจริง:

```powershell
python node_modules/ux-ui-agent-skills/scripts/lint_hardcodes.py src
```

ตัว lint รองรับ source directory หรือหลายไฟล์ เช่น CSS/TSX/TS/JS/HTML; ค่าปัจจุบันที่ยัง hardcode อาจถูกรายงาน ไม่ถือว่าการติดตั้งเครื่องมือได้แก้ค่าทั้งหมดแล้ว ตรวจความเกี่ยวข้องก่อนแก้ โดยเฉพาะแหล่งประกาศ/generated tokens

สำหรับ DTCG JSON ที่สร้างในงานอนาคตเท่านั้น:

```powershell
python node_modules/ux-ui-agent-skills/scripts/validate_tokens.py <path-to-dtcg-json>
python node_modules/ux-ui-agent-skills/scripts/validate_contrast.py <path-to-dtcg-json>
```

แทน `<path-to-dtcg-json>` ด้วยไฟล์จริงก่อนรัน `validate_tokens` ตรวจ JSON/alias ในชุดไฟล์ที่ส่งให้ ส่วน `validate_contrast` ต้องมี semantic token roles ตาม schema/pairs ของสคริปต์ ไม่รองรับ DESIGN.md หรือ CSS variables ของ Khonnai โดยตรง การรันกับ tokens ตัวอย่างใน dependency ไม่พิสูจน์ contrast ของแอป

### ตรวจ standalone HTML ด้วย gates ของแพ็กเกจ

ต้องมี Playwright ที่ resolve ได้และ browser ตาม launch ของแต่ละสคริปต์ เวอร์ชันที่ติดตั้งใช้ Chrome channel ใน gates ด้านล่าง โดย axe มี fallback ไป Chromium ตรวจ dependency/browser ก่อนรัน; หากยังไม่มี Chrome สำหรับ Playwright ให้ติดตั้งด้วย `npx.cmd playwright install chrome` เมื่ออยู่ในขอบเขตงานที่ได้รับอนุญาต

```powershell
$env:DS_REQUIRE_BROWSER = '1'
node.exe node_modules/ux-ui-agent-skills/scripts/verify_keyboard.mjs <path-to-rendered-html>
node.exe node_modules/ux-ui-agent-skills/scripts/verify_target_size.mjs <path-to-rendered-html>
node.exe node_modules/ux-ui-agent-skills/scripts/verify_overflow.mjs <path-to-rendered-html>
node.exe node_modules/ux-ui-agent-skills/scripts/verify_reduced_motion.mjs <path-to-rendered-html>
node.exe node_modules/ux-ui-agent-skills/scripts/axe_audit.mjs <path-to-rendered-html>
```

แทน placeholder ด้วย standalone HTML ที่ render เนื้อหาเป้าหมายได้จริง; ใช้ไฟล์เดียวเป็นรูปแบบร่วมที่รองรับ ตรวจ usage ก่อนส่ง directory เพราะ gates รองรับต่างกัน `axe_audit` ต้องมี axe-core ใน node_modules หรือเชื่อมต่อ CDN ที่สคริปต์กำหนดได้ เมื่อจบให้คืนค่า DS_REQUIRE_BROWSER เดิมของ shell หากมี

Gates เหล่านี้เปิด local file ผ่าน `file://` จึง **ไม่ใช้ root index.html หรือ dist/index.html ของ React/Vite เป็นหลักฐานว่าตรวจแอปแล้ว** และไม่ส่ง localhost URL ให้สคริปต์ที่รับ filesystem path

### ตรวจแอป Khonnai จริง

```powershell
npm.cmd run build
npm.cmd run test:browser
```

Browser tests ใช้ Playwright config ของโปรเจกต์ เปิด Vite ผ่าน HTTP และทดสอบแอปจริง ใช้เป็นจุดเริ่มต้นและเพิ่มกรณีเฉพาะงานเมื่อจำเป็น สำหรับ UI ที่เปลี่ยนให้เปิดดู screenshot และตรวจ mobile/desktop, keyboard/focus, error/disabled/loading, overflow และ reduced motion ตามส่วนที่เกี่ยวข้อง ผล browser tests เดิมไม่ได้หมายความว่าตรวจ accessibility/motion ครบแล้ว

## เกณฑ์รายงานผล

- แยก build, source lint, standalone harness และ live-app browser checks ชัดเจน ระบุ target ของแต่ละผล
- `SKIPPED`, missing browser, โหลด axe ไม่ได้, ไม่มีไฟล์เป้าหมาย หรือ render ได้เพียง app shell = **ยังไม่ได้ตรวจ** แม้ process บางตัว exit0
- `DS_REQUIRE_BROWSER=1` ช่วยตรวจ dependency ที่ขาด แต่ไม่แทนการอ่าน output และตรวจว่าเนื้อหาแอป render จริง
- ใช้ตัวเลข contrast/จำนวนข้อผิดพลาดจาก output ที่รันจริงเท่านั้น ความสวยและความเหมาะกับผู้ใช้ต้องดูหน้าจอและ interaction เพิ่ม
- ไม่ใช้ accuracy_report ของแพ็กเกจเป็นคะแนน Khonnai เพราะเป็น self-test สำหรับ examples/fixtures ของชุดเครื่องมือ

## ตัวอย่าง prompt

> ใช้ UX/UI Agent Skills ตาม docs/agents/ux-ui.md ออกแบบหน้ารายละเอียดสินค้า Khonnai ตาม brief Fastwork พื้นขาว ส้ม–น้ำเงินของเรา คง flow เลือกไซซ์→สีและหน่วยสินค้า เริ่มจากภาพร่างพร้อม error/disabled/loading/selected และ motion ที่เหมาะกับแอป ก่อนพัฒนาและตรวจบนเว็บจริง
