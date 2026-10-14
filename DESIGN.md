---
name: Khonnai · คนใน
description: A friendly shop helper with navy anchors, orange additions and readable Thai operational UI.
colors:
  primary: "#193b5a"
  ink: "#193b5a"
  action: "#193b5a"
  action-hover: "#102d47"
  add: "#ed7c32"
  add-hover: "#f58a43"
  add-ink: "#102d47"
  add-surface: "#fff0e3"
  mint: "#bfdcbc"
  stock-surface: "#e9f4eb"
  stock-action: "#bfdcbc"
  stock-hover: "#afd0ac"
  success: "#166534"
  canvas: "#faf8ee"
  paper: "#ffffff"
  selected: "#eaf0f5"
  muted: "#555555"
  border: "#d4cec7"
  control-border: "#79736d"
  disabled: "#e7e5e2"
  danger: "#b42318"
  danger-surface: "#fff1f0"
  warning: "#92400e"
  warning-surface: "#fff7ed"
  scrim: "rgb(0 0 0 / 35%)"
typography:
  title:
    fontFamily: '"Plus Jakarta Sans", "IBM Plex Sans Thai Looped", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "28px"
    fontWeight: 500
    lineHeight: "36px"
  heading:
    fontFamily: '"Plus Jakarta Sans", "IBM Plex Sans Thai Looped", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "24px"
    fontWeight: 500
    lineHeight: "32px"
  subheading:
    fontFamily: '"Plus Jakarta Sans", "IBM Plex Sans Thai Looped", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "20px"
    fontWeight: 500
    lineHeight: "28px"
  body:
    fontFamily: '"Plus Jakarta Sans", "IBM Plex Sans Thai Looped", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
  label:
    fontFamily: '"Plus Jakarta Sans", "IBM Plex Sans Thai Looped", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
  caption:
    fontFamily: '"Plus Jakarta Sans", "IBM Plex Sans Thai Looped", "Leelawadee UI", Tahoma, sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "22px"
  metadata:
    fontFamily: '"IBM Plex Mono", "IBM Plex Sans Thai Looped", "Leelawadee UI", Tahoma, monospace'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "22px"
rounded:
  chip: "6px"
  control: "8px"
  card: "12px"
  photo: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "52px"
    padding: "10px 24px"
  button-add:
    backgroundColor: "{colors.add}"
    textColor: "{colors.add-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "52px"
  button-stock:
    backgroundColor: "{colors.stock-action}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "52px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "52px"
  button-danger:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.danger}"
    rounded: "{rounded.control}"
    height: "52px"
  text-input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "52px"
  navigation-selected:
    backgroundColor: "{colors.add}"
    textColor: "{colors.add-ink}"
    rounded: "{rounded.control}"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
---

# Design System: Khonnai · คนใน

## Overview

**Creative North Star: "คนในร้านที่ช่วยงานได้"**

แบรนด์ Khonnai · คนใน ตามภาพที่ผู้ใช้ยืนยัน: คน กล่องสินค้า เอกสารและเครื่องหมายถูก สื่อผู้ช่วยงานร้าน ภาพเป็น visual reference ไม่ใช่คำสั่งให้เพิ่มฟีเจอร์ ใช้ตราแบรนด์ในหัวแอป/sidebarและfavicon ไม่วางมาสคอตซ้ำในฟอร์ม ตราที่ใช้งานเป็นภาพ raster ดัดแปลงด้วยการสร้างภาพ ไม่ใช่ไฟล์ vector ต้นฉบับของแบรนด์

**Key Characteristics:**
- อ่านง่ายสำหรับเจ้าของร้าน40+ และใช้งานด้วยมือถือ
- สีแบ่งหน้าที่ รูปทรงเรียบ ลดกรอบซ้อน
- ไม่เปลี่ยนข้อมูลหรือขั้นตอนเดิมเพื่อให้เข้ากับภาพการตลาด

## Colors

กรมท่าเป็นหลักสำหรับข้อความและบันทึก ส้มสำหรับเพิ่มสินค้า เขียวอ่อนตามภาพที่ผู้ใช้ส่งสำหรับปุ่มเพิ่มสต็อกและข้อมูลพร้อมขาย พื้นครีมและช่องกรอกขาว รหัสสีประมาณจากภาพอ้างอิงซึ่งไม่มีHEXกำกับ ไม่อ้างว่าเป็นbrand master values

**The Action Role Rule.** สีต้องคู่กับชื่อปุ่มหรือสถานะ: กรมท่าบันทึก ส้มเพิ่ม เขียวพร้อมขาย แดงลบ/ยกเลิก เทากดไม่ได้ ห้ามใช้สีอย่างเดียวบอกความหมาย

## Typography

Modern sans-serif: IBM Plex Sans Thai Looped สำหรับไทย และ Plus Jakarta Sans สำหรับอังกฤษ ฟอนต์self-hostพร้อมใบอนุญาต ใช้body18, label16, caption14 หัวข้อ28/24/20 ไม่เพิ่มtrackingไทย โลโก้ชื่อแบรนด์24px/700บนมือถือ,22px/700บนsidebar Metadataเดิมบางแห่งใช้IBM Plex Monoคู่กับฟอนต์ไทย ขนาดh3สืบทอดline-height28pxจากbody

## Layout

คงเมนูล่างมือถือ/sidebarที่1024px การ์ดสินค้าเรียงสินค้า → ไซซ์ → สี/คละสี พร้อมจำนวนและหน่วย รองรับ320px ฟอร์มสองคอลัมน์เดิมยุบเหลือหนึ่งบนมือถือ ปุ่มเพิ่มรายการ/ดาวน์โหลดพอดีข้อความ ปุ่มบันทึกบนมือถือกว้าง ลำดับDOM/focusเดิม

## Elevation & Depth

พื้นขาว เส้นneutral1px การ์ดสินค้าhoverเงานุ่ม0 4px 12px rgb(34 34 34 /12%) ไม่เปลี่ยนพื้นเป็นสีขาวเฉพาะhover ไม่ใช้เงากับทุกช่อง/ปุ่ม

## Shapes

ปุ่มและช่องกรอก8px การ์ด/dialog12px ไซซ์6px รูปสินค้า16px Badgeสถานะpillเท่านั้น ไม่ใช้pillทั้งหน้าจอ ปุ่มสูงอย่างน้อย52pxและตัวเลือกไซซ์อย่างน้อย48px

## Components

Feedback failures remain in the current task: a focused red message beside shared submit, without clearing entered values; page-only failures use the existing Notice. Product code search uses native input/select with a clear button and never preselects the first product. Return-reference changes confirm draft replacement. The visible navigation label “ร้าน/สำรอง” exposes backup. Quantity hints/remaining/reserved labels carry units using existing caption/body roles; no new decorative system.

Product entry price and opening-stock units sit inside the field on the right (บาท / หน่วย and หน่วย: ชื่อหน่วย); no duplicate hint underneath. Shared Field suffix is noneditable, described to assistive technology and laid out separately from the number so they cannot overlap.

ใช้shared Brand/Button/Field/Form, ItemsEditor, ConfirmDialog และApp navigation เมนูพื้นกรมท่า ข้อความครีม เมนูที่เลือกส้ม/กรมท่า Hoverเส้นครีม เมนูที่เลือกhoverส้มสว่างขึ้น กดไม่ได้ยังมีชื่อและopacity เมนูล่างสูงอย่างน้อย64pxและเมนูsidebarอย่างน้อย52px

ปุ่มเพิ่มสินค้าและstock disclosureมีเครื่องหมายบวก ปุ่มstockคงชื่อ “เพิ่มสต็อก / ปรับจำนวน” ไม่เพิ่มคำอธิบาย สีแยกการเพิ่มจากปุ่มบันทึก ลบ/ยกเลิกแดงพร้อมconfirmationเดิม

หน้าบิลจัดกลุ่มวันที่ตามAsia/Bangkok ใหม่ก่อนเก่า แต่ละวันมีจำนวนบิลและยอดรวมบิลไม่ยกเลิก แท็บแนวนอนเลื่อนได้แสดงไอคอนบิล เลขบิลและชื่อลูกค้า เลือกแล้วแสดงกระดาษเต็มครั้งละหนึ่งฉบับ ปุ่มแก้/ยกเลิก/Exportอยู่กับบิลที่เลือก รองรับArrow/Home/Endและfocus ไม่เปลี่ยนกติกาสต็อกหรือข้อมูลบิล

สีและฟอนต์ของกระดาษบิล/PNGมาจากtokensเดียวกัน ไม่ใส่ชื่อKhonnaiแทนชื่อร้านลูกค้า ไม่เปลี่ยนรูปแบบกระดาษเต็มหรือยอดรวม/ปุ่มบันทึกก่อนpreview

## Do's and Don'ts

- Do ใช้สีตามหน้าที่และข้อความไทยชัดเจน จำนวนทุกแห่งมีหน่วย
- Do คงbefore/afterของสต็อก รายละเอียดvariantเต็ม และแยกรับคืน/ส่งออก
- Do คงvalidation/focus/unsaved guard/recovery/backupและreduced-motion
- Don't เพิ่มDashboard/กราฟ/Chat/แจ้งเตือนจากภาพreference
- Don't เปลี่ยนlocalStorage key/schema กติกาสต็อกหรือflowบิล/จอง/คืนสินค้า
- Don't ใช้โลโก้แอปแทนชื่อร้านในบิลหรือเพิ่มมาสคอตตกแต่งทุกหน้า
