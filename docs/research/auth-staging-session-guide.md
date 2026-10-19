# ทดลองระบบบัญชีคนในบนเครื่องและ staging

18 ตุลาคม2026. หน้าบัญชีเชื่อม Supabase Auth จริงแล้ว และมีร้านบน Supabase ที่ `/shop` แยกตามบัญชี ส่วน `/app` ยังเป็นเดโมในเครื่อง ไม่มีการนำเข้าข้อมูลอัตโนมัติหรือ deploy production ดู [คู่มือร้านบน Supabase](inventory-staging-guide.md)

## เปิดหน้าใช้งานจริง

รันจาก `D:\Khonnai`:

```powershell
npm.cmd run auth:dev
```

เปิด [หน้าบัญชี staging](http://127.0.0.1:5293/auth) ใช้ port5293 เท่านั้นสำหรับชุดตั้งค่านี้ Port5292 ยังเป็น prototype แยกที่ไม่เชื่อม Auth

หากรันซ้ำขณะชุดเดิมเปิดอยู่ คำสั่งจะแสดง `Khonnai Auth is already running` พร้อมลิงก์ และจบโดยไม่เปิด server ซ้อน หากพอร์ตถูกโปรแกรมอื่นใช้หรือมีเพียงบางส่วนเปิดอยู่ จะแจ้งพอร์ตที่ชน โดยไม่ปิด process ให้อัตโนมัติ

ตัวเปิดใช้ Vite5293 และ Auth API5294 ทั้งสอง bind เฉพาะ127.0.0.1 คำสั่งนี้ไม่เปิดบริการสาธารณะและไม่ deploy การตรวจ Host/Origin และ cookie สำหรับ localhost เป็นการตั้งค่าทดสอบ การนำขึ้น HTTPS ต้องมีการตรวจ deployment แยก โดยเปลี่ยนเป็น Secure `__Host-` cookie และ CSP ที่ไม่อนุญาต inline script ของ Vite

## ตั้งค่าอีเมลใน Supabase ก่อนสมัครบัญชีจริง

ใช้บัญชีเจ้าของโปรเจกต์เปิด [Authentication URL configuration](https://supabase.com/dashboard/project/brwkigtdecywivcfijvq/auth/url-configuration)

1. ตั้ง Site URL เป็น `http://127.0.0.1:5293`
2. เพิ่ม Redirect URLs แบบตรงเส้นทาง: `http://127.0.0.1:5293/auth/confirm` และ `http://127.0.0.1:5293/auth/reset-password` ไม่ใช้ wildcard กว้าง
3. เปิดการยืนยันอีเมลไว้ และตั้งนโยบายรหัสผ่านขั้นต่ำ8ตัว มีตัวอักษรภาษาอังกฤษอย่างน้อย1ตัวและตัวเลขอย่างน้อย1ตัว ตัวพิมพ์ใหญ่หรือเล็กอย่างใดอย่างหนึ่งใช้ได้ ฝั่งเว็บและ BFF ตรวจนโยบายนี้แล้ว ต้องตั้งฝั่ง Supabase ให้ตรงด้วย เพราะ Auth API ของ provider เป็นอีก boundary

เปิด **Authentication → Email Templates** แล้วเปลี่ยนลิงก์ในสองแม่แบบต่อไปนี้ ใช้ข้อความอีเมลเดิมหรือปรับเป็นแบรนด์คนในได้

**Confirm signup**:

```html
<a href="{{ .SiteURL }}/auth/confirm#token_hash={{ .TokenHash }}&amp;type=signup">ยืนยันอีเมล</a>
```

**Reset password**:

```html
<a href="{{ .SiteURL }}/auth/reset-password#token_hash={{ .TokenHash }}&amp;type=recovery">ตั้งรหัสผ่านใหม่</a>
```

อย่าใช้ลิงก์ ConfirmationURL แบบเดิมกับ BFF ชุดนี้ เพราะรูปแบบ redirect ที่มี provider access token ไม่ใช่สัญญาของหน้ารับลิงก์ ใช้ TokenHash ตาม [แนวทางแม่แบบอีเมลของ Supabase](https://supabase.com/docs/guides/auth/auth-email-templates) หน้าเว็บจะลบ fragment ทันทีและยืนยันเมื่อผู้ใช้กดปุ่ม ไม่ยืนยันผ่าน GET ที่เครื่องสแกนอีเมลอาจเปิดเอง

ผู้ใช้เลือกทดสอบด้วยอีเมลสมาชิกทีมก่อน ใช้อีเมลที่เป็นสมาชิกองค์กรใน Supabase ซึ่ง default email service อนุญาต ไม่ใช่เพียงบัญชีในแอปคนใน หากจะรับคนภายนอกต้องตั้ง custom SMTP ก่อน ดู [ข้อจำกัด default SMTP](https://supabase.com/docs/guides/auth/auth-smtp) ไม่ต้องส่งรหัส SMTP, token_hash, รหัสผ่าน หรือ connection string ในแชต

## ลองด้วยบัญชีสมาชิกทีม

1. กดสร้างบัญชี กรอกอีเมล แล้วตั้งรหัสผ่านในหน้าถัดไป ให้รายการทั้ง4ข้อเป็นสีเขียว
2. เปิดอีเมลบนเครื่องเดียวกับที่รันเว็บ กดลิงก์ แล้วกดยืนยันในหน้าเว็บ
3. ตรวจว่าเห็นอีเมลของบัญชีที่เข้าสู่ระบบ โหลดหน้าใหม่แล้วตรวจซ้ำ
4. ออกจากระบบ แล้วลองเข้าสู่ระบบด้วยรหัสผ่าน
5. ทดลองลืมรหัสผ่าน เปิดลิงก์แล้วตั้งรหัสใหม่ จากนั้นตรวจว่ารหัสเดิมใช้ไม่ได้

หากเปลี่ยนรหัสผ่านสำเร็จ BFF จะเพิกถอน session คนในทั้งหมดของบัญชีนั้น ให้เข้าสู่ระบบใหม่ ปุ่ม “เปิดร้านของคุณ” หลังล็อกอินพาไป `/shop` ซึ่งอ่านข้อมูลจาก Supabase เริ่มร้านว่างและไม่ดึงข้อมูลเดโมในเครื่อง

## คำสั่งตรวจสำหรับผู้พัฒนา

```powershell
npm.cmd run auth:check
npm.cmd run auth:db:check
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run test:browser
```

เมื่อมีบัญชีแล้ว ให้ทดสอบตามหัวข้อ “ลองด้วยบัญชีสมาชิกทีม” ด้านบน จำนวนบัญชีใน `auth:db:check` ไม่ยืนยันว่าบัญชีนั้นรับอีเมลหรือเข้าสู่ระบบสำเร็จแล้ว ส่วน `bypassrls` และ `can_create_roles` ในคำสั่งนี้เป็นสิทธิ์ของบัญชีสำหรับจัดเตรียมฐานข้อมูล ไม่ใช่สิทธิ์ runtime ของแอป

เฉพาะโปรเจกต์ staging ว่างสำหรับทดสอบแบบทิ้งได้ ใช้คำสั่งต่อไปนี้:

```powershell
node scripts/verify-auth-runtime.mjs
node scripts/verify-auth-runtime.mjs --browser
```

คำสั่ง verify-auth-runtime สร้างสองบัญชีสังเคราะห์ชั่วคราวพร้อมสถานะยืนยันอีเมลสำหรับทดสอบ จึงไม่พิสูจน์การรับอีเมลจริง และไม่ส่งอีเมลไปที่อยู่ที่สุ่มไว้ เก็บรหัสผ่านเพียงในหน่วยความจำ แล้ว cleanup เฉพาะบัญชีและข้อมูลที่ตัวทดสอบสร้างเอง หากมีบัญชีอยู่แล้วจะหยุดก่อนสร้าง fixture ด้วย `NOT RUN / STAGING_NOT_EMPTY`, `status: not_run`, `passed: null` และ exit code1 ซึ่งหมายถึงยังไม่ได้ทดสอบ ไม่ใช่ผลผ่านหรือหลักฐานว่า Auth เสีย ห้ามลบบัญชีเดิมเพื่อให้สคริปต์นี้รันได้

ผลความพยายามล่าสุดอยู่ใน `outputs/auth-staging/live-session-attempt.json` ทุกครั้ง กรณี `not_run` จะไม่เขียนทับ `live-session-verification.json` เดิม ให้ดูวันที่และ status ประกอบเสมอ ผลเดิมไม่ได้ยืนยันสถานะบัญชีปัจจุบัน

การรัน `--browser` ต้องเปิด auth:dev ไว้และมี Chromium ของ Playwright การทดสอบ recovery สร้าง one-time token เฉพาะ fixture ในฐานข้อมูล จึงข้ามเฉพาะการส่งอีเมลแต่เรียก Auth verify จริง ผลอยู่ใน `outputs/auth-staging/live-session-verification.json` และ `outputs/auth-staging/browser/verification.json`

สิทธิ์ migration ไม่ถูกใช้ในเซิร์ฟเวอร์ปกติ มี runtime credentials แยก app/vault/control อยู่ในไฟล์ ignored `.env.staging.local` การ provision รันด้วย `npm.cmd run auth:runtime:prepare` ซึ่งไม่หมุนรหัสเดิมอัตโนมัติ ห้ามเผยแพร่ไฟล์นี้

Session store ใช้ AES256GCM ที่ผูก ciphertext กับบัญชีและ session, เก็บ hash ของ opaque cookie และใช้แถวล็อกประสาน refresh ระหว่าง instance ทุกคำขอที่ต้องใช้บัญชีตรวจ remote `/user` เพื่อให้ provider ตรวจ session ที่ถูกเพิกถอน ชุดทดสอบจริงยืนยันว่าหลัง revoke token เดิมถูกปฏิเสธ จึงไม่ต้องให้ runtime เข้าถึง auth schema

การเปลี่ยนสถานะใน provider และ transaction ของเราไม่ใช่ distributed transaction หาก process ล้มหลัง provider refresh แต่ก่อน commit อาจต้องเข้าสู่ระบบใหม่ ไม่อ้างว่าทำสองระบบเป็น atomic ได้

## ขอบเขตที่ยังไม่ผ่าน

การรับอีเมลจริงและแม่แบบที่เจ้าของตั้งค่ายังต้องแยกหลักฐานจากคำยืนยันว่าใช้งานได้ของเจ้าของ รวมถึง Google, cloud restore, บัญชีเดโม/usage report, HTTPS deployment, rate-limit tuning สำหรับผู้ใช้จริง และการยืนยัน TLS จาก pooler ถึง database ยังไม่ผ่าน ผู้ใช้ยกเลิกความจำเป็นในการนำเข้า local demo แล้ว ชุดนี้คงหน้า landing, local shop, กระดาษบิลและ PNG เดิมไว้ ส่วนผล inventory cloud อยู่ในคู่มือแยกด้านบน

การ review source แยกจากผู้เขียนเสร็จแล้ว พบและแก้ CSRF คนละชนิดใน callback, การออกจากระบบระหว่าง provider ตอบไม่ได้ และการรีเฟรชหน้าตั้งรหัสผ่านหลังยืนยันลิงก์ Reviewer ตรวจแก้ซ้ำแล้ว แต่ไม่ได้รันทดสอบซ้ำด้วยตัวเอง และการ review นี้ไม่ใช่ security audit ภายนอกสำหรับ production
