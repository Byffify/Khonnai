# เตรียม staging สำหรับระบบบัญชีคนใน

18 ตุลาคม 2026. ผู้ใช้อนุมัติ prototype แล้ว ตรวจ public Auth settings ของ staging ได้ HTTP 200 แล้ว ยังไม่มีผลทดสอบล็อกอินหรือสิทธิ์ฐานข้อมูลจริง

## สิ่งที่ทำได้ก่อนตั้งค่าบัญชีภายนอก

- เปิด prototype ด้วย `npm.cmd run auth:prototype` แล้วเข้า `http://127.0.0.1:5292/`
- ตรวจหน้าตา ขั้นกรอกข้อมูล การย้อนกลับ ข้อความผิดพลาด และไทย/อังกฤษ
- Prototype ไม่มีการส่งข้อมูลล็อกอิน ไม่ส่งอีเมล และไม่สร้างบัญชี การตรวจหน้าฟอร์มไม่ใช่หลักฐานว่า Auth/RLS ทำงานแล้ว
- แผนงานและงานที่ยังไม่เสร็จอยู่ที่ `.scratch/supabase-auth/plan.md` และ `.scratch/supabase-auth/issues/`

## สิ่งที่เจ้าของโปรเจกต์ต้องตั้งค่าในขั้นถัดไป

1. เข้า [Supabase Dashboard](https://supabase.com/dashboard) ด้วยบัญชีของคุณ สร้างโปรเจกต์ staging แยกจาก production ตั้งรหัสฐานข้อมูลแล้วเก็บในตัวจัดการรหัสผ่าน ไม่ส่งรหัสผ่านหรือ secret ในแชต
2. เลือกภูมิภาคโดยคำนึงถึงผู้ใช้จริงและนโยบายข้อมูล เลือกแผนโดยดูข้อจำกัดปัจจุบัน ไม่ใช้คำว่า Free/Pro เป็นหลักฐานว่ารองรับทุกข้อกำหนดด้านความปลอดภัย
3. หลังยืนยัน prototype และสรุปสถาปัตยกรรมแล้ว จึงกำหนดชื่อ environment variables และใส่ค่าลงไฟล์ local ที่ถูก ignore หรือหน้าจัดการ environment ของ staging โปรเจกต์โดยตรง ค่าที่ขึ้นต้น `VITE_` ถูกส่งไปยังผู้ใช้ได้ จึงห้ามใส่ secret/service-role key ในชื่อนั้น
4. ตั้ง Site URL และ allowlist ของ callback/recovery ให้ตรงกับ staging และ localhost ของแอปจริง เส้นทางเสนอคือ `/auth/callback` และ `/auth/reset-password` อย่าใช้ port 5292 ของ prototype เป็น OAuth callback เพราะ prototype ไม่รับ token
5. เปิด email/password และการยืนยันอีเมล ตั้ง SMTP ของผู้ให้บริการที่คุณดูแลสำหรับผู้ทดลองภายนอก ค่า SMTP อยู่ใน Dashboard เท่านั้น เอกสาร Supabase ระบุว่า default SMTP จำกัดผู้รับและมีข้อจำกัดการใช้งาน ดู [SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
6. หากใช้ Google ให้สร้าง OAuth client ของ staging ใน Google Cloud ตั้ง redirect URI ตามค่าที่ Supabase แสดง แล้วใส่ Client ID/Secret ใน Google provider ของ Supabase โดยตรง ไม่ส่ง Client Secret ผ่านแชต ดู [Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google)
7. เตรียมอีเมลทดสอบอย่างน้อยสองบัญชีสำหรับตรวจว่าเข้าถึงร้านกันไม่ได้ และอีกบัญชีสำหรับพรีเซนต์ที่ไม่มีสิทธิ์ผู้ดูแล ไม่จำเป็นต้องส่งรหัสบัญชีเหล่านี้ให้ agent
8. เมื่อถึงขั้นนั้น แจ้งได้เพียงว่าโปรเจกต์ staging พร้อมแล้ว และระบุ project URL/ชื่อ environment ที่จะใช้ ส่วนการเข้าถึงฐานข้อมูลหรือเครื่องมือให้ผ่านช่องทางที่กำหนดขอบเขตสิทธิ์โดยตรง ไม่แปะ secret ในแชต

การสร้างโปรเจกต์อาจมีขั้นยอมรับเงื่อนไขหรือค่าใช้จ่าย ให้เจ้าของบัญชีดำเนินการเอง ไม่มีขั้นตอนให้เปิด production หรือเชื่อมข้อมูลร้านจริงในคู่มือนี้

## เกณฑ์ก่อนให้ผู้ทดลองภายนอกใช้

- ตรวจ RLS/grants และ API ด้วยบัญชี A/B จริง รวมกรณีแก้ `shop_id`, แอบเปลี่ยน membership และอ่านรูปของร้านอื่น
- ทดสอบยืนยันอีเมล ลืมรหัสผ่าน ลิงก์หมดอายุ login ผิด provider ยกเลิก session หมดอายุ และออกจากระบบบนเครื่องที่ใช้ร่วมกัน
- ตรวจการจำกัดคำขอจากฝั่งบริการและความแตกต่างของข้อความ/สถานะ/timing ที่อาจเปิดเผยว่ามีบัญชีหรือไม่
- ทดลองขายพร้อมกันจากสอง session เมื่อเหลือชิ้นสุดท้าย และ retry หลังเซิร์ฟเวอร์บันทึกแล้วแต่คำตอบหาย
- เทียบกระดาษบิล/PNG กับ fixture เดิม และยืนยันว่าไฟล์/ข้อมูลบนเครื่องก่อนนำเข้ายังไม่ถูกลบ
- ทดสอบด้วยข้อมูลจำนวนที่รู้คำตอบ เพื่อยืนยันว่าบัญชีเดโม ทีมงาน และ token refresh ไม่เพิ่มยอดผู้ใช้จริง
- ตรวจส่วนแสดงผลและการตั้งค่าบน staging จริงก่อนสรุปว่าผ่าน ไม่มีการใช้ mock หรือการ build ผ่านแทนผลทดสอบเหล่านี้

## เตรียมสิทธิ์สำหรับสร้างตาราง staging

Publishable key ใน `.env.staging.local` ใช้ตรวจ Auth ได้ แต่ใช้สร้างตารางไม่ได้ ขั้นต่อไปต้องมีการเชื่อมต่อฐานข้อมูลสำหรับ migration เท่านั้น

1. เปิดโปรเจกต์ staging ใน Supabase แล้วเลือก **Connect**
2. เลือก connection string แบบ **Direct connection** หากเครื่องใช้ IPv6 ได้ หากใช้ IPv4 ให้เลือก **Session pooler** พอร์ต **5432** อย่าเลือก Transaction pooler สำหรับขั้นนี้ ดู [การเชื่อมต่อ Postgres](https://supabase.com/docs/guides/database/connecting-to-postgres)
3. คัดลอก URI แล้วแทนช่องรหัสผ่านด้วยรหัสฐานข้อมูลที่คุณเก็บไว้ หากรหัสมีอักขระพิเศษ ให้ encode เฉพาะส่วนรหัสผ่านตามรูปแบบ URI ดู [Database passwords](https://supabase.com/docs/guides/database/postgres/roles)
4. ใส่ URI ในช่อง `SUPABASE_MIGRATION_DATABASE_URL=` ของไฟล์ `D:\Khonnai\.env.staging.local` ซึ่งถูก git ignore แล้ว ใส่ค่าในเครื่องเท่านั้น ไม่ส่ง URI หรือรหัสผ่านผ่านแชต
5. แจ้งว่าใส่ค่าแล้ว เพื่อให้ตรวจปลายทางและสิทธิ์ก่อนรัน migration

ค่านี้เป็นสิทธิ์สำหรับจัดการโครงสร้างฐานข้อมูล ห้ามนำไปใช้เป็น connection ของแอปปกติหรือใส่ตัวแปร `VITE_` การทดสอบ SQL ที่สร้างบัญชีจำลองต้องใช้ฐานข้อมูลทดสอบที่แยกและทิ้งได้ ตาม `supabase/README.md`

ตรวจสถานะ Auth ซ้ำได้ด้วย `npm.cmd run auth:check` คำสั่งอ่านไฟล์ local และแสดงเฉพาะ URL, HTTP status และสถานะเปิดบริการ ไม่แสดงคีย์ ไม่สร้างบัญชี และไม่ส่งอีเมล

## สถานะปัจจุบัน

ตรวจ public Auth settings ได้ HTTP 200: เปิดอีเมล เปิดสมัครสมาชิก ต้องยืนยันอีเมล และ Google ยังปิดอยู่ ผู้ใช้เลือกใช้อีเมลสมาชิกทีมทดสอบก่อน จึงยังไม่เปิดรับผู้ใช้ภายนอกด้วย default SMTP

เชื่อม Postgres staging ด้วยใบรับรอง CA ทางการและตรวจชื่อเซิร์ฟเวอร์สำเร็จ ใช้ CLI2.121.0 สร้างและ apply migration `20261018090754` แล้ว มี6ตารางพร้อม FORCE RLS ชุด SQL assertions ผ่านทั้งก่อนและหลัง apply โดย rollback บัญชีและข้อมูลจำลองหมด ยังไม่มีบัญชีจริง ดูผลใน `outputs/auth-staging/`

Client → pooler ผ่าน TLS ที่ตรวจสอบแล้ว แต่ `pg_stat_ssl` ที่ฐานข้อมูลรายงาน pooler → database เป็น `false` จึงยังไม่สรุปว่าเข้ารหัสครบทุกช่วง ตรวจ transport/enforcement ฝั่ง provider ก่อนนำข้อมูลจริงเข้า ระบบยังไม่เปลี่ยนค่าที่ทำให้ฐานข้อมูล reboot

ระบบบัญชี BFF เชื่อมกับ Supabase จริงแล้วที่ `http://127.0.0.1:5293/auth` มี runtime credentials แยกจาก migration, session เข้ารหัส, CSRF และ durable throttling ผลจริงผ่านทั้ง login/logout, session refresh พร้อมกัน, revoke และเปลี่ยนรหัสผ่านด้วยบัญชีสังเคราะห์ชั่วคราว Browser login/reload/logout และ recovery callback ขณะล็อกอินผ่านแล้ว แต่ recovery token เป็น fixture จึงยังไม่ยืนยันการรับอีเมลจริง

ดู [วิธีตั้งค่าอีเมลและเปิดหน้าบัญชีจริง](auth-staging-session-guide.md) ก่อนทดลองด้วยอีเมลสมาชิกทีม ยังไม่ได้ตรวจ email delivery, Google callback, transaction ของการขายหรือการย้ายข้อมูล ไม่ใช้บัญชีที่ล็อกอินแล้วเปิด local inventory แบบแอบอ้างว่าเป็น cloud และยังไม่มี production deployment
