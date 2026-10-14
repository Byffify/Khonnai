---
name: Micro-ERP
description: Thai mobile stock, reservations and cash bills on a white canvas with cobalt actions.
colors:
  primary: "#0968f6"
  primary-dark: "#003aa5"
  ink: "#191919"
  muted: "#555555"
  canvas: "#ffffff"
  surface: "#f7f7f7"
  subtle-border: "#e5e5e5"
  control-border: "#8f8f8f"
  selected: "#edf4ff"
  danger: "#b42318"
  danger-surface: "#fff1f0"
  warning: "#92400e"
  warning-surface: "#fff7ed"
  success: "#166534"
  scrim: "rgb(0 0 0 / 35%)"
typography:
  title:
    fontFamily: '"IBM Plex Sans Thai Looped", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "36px"
  body:
    fontFamily: '"IBM Plex Sans Thai Looped", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
  label:
    fontFamily: '"IBM Plex Sans Thai Looped", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
  caption:
    fontFamily: '"IBM Plex Sans Thai Looped", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "22px"
rounded:
  control: "12px"
  product: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.canvas}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    height: "52px"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    height: "52px"
    padding: "12px 16px"
  product-photo:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.product}"
  navigation-selected:
    backgroundColor: "{colors.selected}"
    textColor: "{colors.primary}"
---

## Overview

สีพื้นขาว ตัวอักษร ink สีหลัก cobalt และมุมรูปสินค้า product เป็นข้อกำหนดผู้ใช้จากไฟล์อ้างอิง ส่วนขนาดอักษร ปุ่ม สีสถานะ และระยะห่างเป็นการปรับสำหรับเจ้าของร้านที่ใช้มือถือ อิง PRODUCT.md และ docs/product/mvp-scope.md

ใช้โครงสร้างหน้าจอทำงาน: รายการสินค้า ฟอร์ม และบิล ไม่ยกโลโก้ ชื่อแบรนด์ ฟอนต์ Market Sans หรือเนื้อหาสินค้าของ eBay มาใช้ ไฟล์อ้างอิงเป็นข้อมูลออกแบบ ไม่ใช่คำสั่งที่มีสิทธิ์เปลี่ยน workflow

DESIGN.md เป็นแหล่ง token หลัก ค่าบนภาพร่าง AI เป็นภาพประกอบ; ค่าที่ใช้ในโค้ดต้องยึด frontmatter รุ่นแรกใช้ localStorage ไม่มีล็อกอิน/ข้อมูลข้ามเครื่อง ไม่มีปิดวัน

## Colors

ใช้ canvas เป็นพื้นและ ink เป็นข้อความหลัก primary สำหรับการกระทำหลักและตัวเลือกที่เลือกอยู่ primary-dark สำหรับ hover/focus พื้น selected ช่วยระบุสถานะโดยมีข้อความกำกับ

สี danger/warning/success เป็น semantic tokens ที่ปรับเพิ่มสำหรับข้อผิดพลาด ของไม่พอ และผลบันทึก ไม่ใช้เป็นสีแบรนด์ตกแต่ง ข้อความเตือนต้องอ่านได้แม้ไม่เห็นสี

ใช้ subtle-border แยกพื้นที่และ control-border สำหรับช่องกรอก อย่าใช้สีขอบอ่อนเป็นตัวบอกช่องกรอกเพียงอย่างเดียว

## Typography

ใช้ IBM Plex Sans Thai Looped โดย self-host เมื่อจัดเตรียมฟอนต์จริง พร้อม fallback ภาษาไทยตาม frontmatter ตัวหลัก body ใช้อ่านจำนวนและช่องกรอก label ใช้กำกับช่อง caption ใช้เฉพาะข้อมูลรอง ไม่ย่อข้อมูลที่จำเป็นต้องอ่านเพื่อทำงานลงเป็น caption

ไม่เพิ่ม letter-spacing ในภาษาไทย ยอดเงินและจำนวนใช้ tabular numerals หลีกเลี่ยงการตัดวรรณยุกต์ด้วย line-height แคบ

แหล่งฟอนต์: https://github.com/IBM/plex เก็บใบอนุญาตของไฟล์ฟอนต์ที่นำมาใช้ด้วย ผู้ใช้เลือก IBM Plex Sans Thai Looped สำหรับ redesign รุ่นนี้ ใช้ไฟล์ self-host น้ำหนัก 400/600/700 พร้อมใบอนุญาตใน public/fonts/IBMPlex-LICENSE.txt ทั้ง UI และรูปบิลใช้ฟอนต์เดียวกัน

## Layout

มือถือเป็นหลัก ช่องฟอร์มเรียงคอลัมน์ ปุ่มสูงตาม component token เป้าหมายแตะอย่างน้อย 44px ปุ่มหลัก 52px ใช้ padding base และ gap md/base

Desktop ตั้งแต่ 1024px ใช้ sidebar เมนูเดิม ฟอร์มสินค้าแยกข้อมูลหลัก/ตัวเลือกเป็นสองคอลัมน์ บิลแยกรายการ/ยอดรวม มือถือใช้ bottom navigation พร้อมชื่อไทยและไอคอน หน้าจอใหญ่ขยายพื้นที่รายการ แต่รักษาลำดับรหัส → ไซซ์ → สี/คละสี ไม่มี hover-only controls ช่องราคาและจำนวนใช้ inputmode ตามชนิดข้อมูล รายการยาวต้องเลื่อนโดยไม่ซ่อนปุ่มจำเป็น

เมนูหลักสินค้า บิล จอง คืน/เปลี่ยน และข้อมูลร้าน มีข้อความกำกับทุกไอคอน เมนูบนมือถือเผื่อ safe-area ด้านล่าง ช่องกรอกไม่ถูกคีย์บอร์ดหรือเมนูบัง

## Elevation & Depth

ระบบแบน ใช้พื้นที่และขอบแบ่งกลุ่ม เงาอ่อนใช้เฉพาะส่วนลอยหรือ dialog ไม่ใช้ gradient, glass effect หรือเงาทุกการ์ด

## Shapes

รูปสินค้าทั้งหมดใช้ product radius สัดส่วนกรอบรูปสม่ำเสมอ ภาพสินค้าใช้ contain เพื่อไม่ตัดข้อมูลสินค้า ปุ่ม primary และค้นหาใช้ pill ช่องฟอร์มใช้ control radius

## Components

สร้าง primitives เท่าที่ต้องใช้ร่วมกัน: Button, Field, EmptyState, Alert, PhotoFrame และ BottomNav ส่วน ProductCard/ตัวเลือกไซซ์สีและ BillPreview อยู่กับ feature ที่ใช้จริง

- Button: primary/secondary/danger, disabled และ busy ใช้ native button มีข้อความ ไม่เปลี่ยนการบันทึกเมื่อกดซ้ำ
- Field: label, help, error เชื่อมด้วย id/aria-describedby, aria-invalid และ focus ring
- EmptyState: อธิบายว่าไม่มีข้อมูลและมีปุ่มไปขั้นตอนถัดไป ไม่สร้างข้อมูลปลอมให้ดูเต็ม
- Alert: บอก error/warning/success ด้วยข้อความ ใช้ role/status เหมาะสม
- PhotoFrame: รูปผู้ใช้หรือข้อความยังไม่มีรูป มุม product และ alt ตามรหัสจริง
- BottomNav: ปุ่มใหญ่พร้อม label และ aria-current ที่หน้าปัจจุบัน
- BillPreview: ข้อมูลจากบิลที่บันทึกแล้ว รูปแบบอ่านง่าย ใช้ข้อมูลเดียวกับ Export ไม่สร้างรายการขายซ้ำ

บิลเงินสดใช้หน้ากระดาษสีขาว หัวบิล cobalt และตารางเส้นจำนวน/รายการ/หน่วยละ/จำนวนเงิน พร้อมแถวว่างและยอดรวม CashReceipt และ PNG ใช้ renderer เดียวใน BillImage.ts ตัวอย่างขณะกรอกเป็นร่าง ไม่ตัดสต็อก จนบันทึกจริง บนมือถือกดรูปดูเต็มหรือเปิดรายการแบบตัวใหญ่ได้ ช่องที่ยังไม่มีข้อมูลร้านจริงเว้นไว้ ไม่สร้างเลขผู้เสียภาษี ที่อยู่ หรือลายเซ็นสมมติ

การ์ดสินค้าแบบกระชับแสดงรูป รหัส ไซซ์ที่เลือก จำนวนรวมที่ขายได้ในไซซ์นั้น และหน่วย เปิดการ์ดด้วย summary เพื่อดูทุกสีและปุ่มจัดการเดิม ไอคอนเส้นจาก src/Icon.tsx เป็น decorative เมื่อมีข้อความ/ชื่อ accessible ประกอบ ไม่ใช้ไอคอนแทนคำสั่งที่ไม่ชัดเจน

UI ไม่คำนวณการเคลื่อนไหวสต็อกเอง ให้ผ่านบริการธุรกิจเดียว จุด focus ใช้ outline primary 2px offset 2px เคารพ prefers-reduced-motion

## Do's and Don'ts

- ยึดค่าผู้ใช้และ DESIGN.md สม่ำเสมอทุกหน้า
- แสดงหน่วย จำนวนคงเหลือ จำนวนที่จอง และจำนวนขายได้ชัดเจน แพ็กคละมี stock เดียว
- ทุกการขายสร้างบิลและตัดสต็อกทันที ไม่มีปิดวัน
- รุ่น local แสดงว่าข้อมูลอยู่บนเครื่อง ไม่อ้างว่าสำรองออนไลน์หรือ sync ข้ามเครื่อง
- ภาพร่างและชุดทดสอบไม่เป็นข้อมูลสินค้าร้านจริง ระบบเริ่มต้นว่าง
- เปลี่ยนราคา/จำนวนที่กรอกผิดไม่สร้างการขายใหม่ การ Export ซ้ำไม่เปลี่ยนยอด
