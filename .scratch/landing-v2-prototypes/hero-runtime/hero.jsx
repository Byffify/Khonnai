import React, { useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactLenis } from 'lenis/react'
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react'
import 'lenis/dist/lenis.css'
import './hero.css'
import 'lenis/dist/lenis.css'

const SECTION_HEIGHT = 1500
const pictures = [
  { src: 'sme-products.png', alt: 'ภาพจำลองสินค้าแยกสีบนเคาน์เตอร์ร้าน', start: -200, end: 200, placement: 'left', height: 230 },
  { src: 'sme-hands.png', alt: 'ภาพจำลองมือเจ้าของร้านกำลังจัดแพ็กสินค้า', start: 200, end: -250, placement: 'center', height: 330 },
  { src: 'sme-underwear-shop.png', alt: 'ภาพจำลองร้านเล็กขายเสื้อผ้าและชุดชั้นในที่จัดสินค้าแยกสีบนชั้น', start: -200, end: 200, placement: 'right', height: 230 },
  { src: 'sme-underwear-packs.png', alt: 'ภาพจำลองเจ้าของร้านจัดแพ็กชุดชั้นในแยกไซซ์และสีบนเคาน์เตอร์', start: 0, end: -500, placement: 'offset', height: 280 },
]

function CenterImage() {
  const { scrollY } = useScroll()
  const clip1 = useTransform(scrollY, [0, SECTION_HEIGHT], [25, 0])
  const clip2 = useTransform(scrollY, [0, SECTION_HEIGHT], [75, 100])
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`
  const backgroundSize = useTransform(scrollY, [0, SECTION_HEIGHT + 500], ['170%', '100%'])
  const opacity = useTransform(scrollY, [SECTION_HEIGHT, SECTION_HEIGHT + 500], [1, 0])
  return <motion.div className="ref-hero-center" role="img" aria-label="ภาพจำลองด้วย AI ของร้านขายส่งเสื้อผ้าไทย" style={{ clipPath, backgroundSize, opacity, backgroundImage: "url('sme-shop.png')" }} />
}

function ParallaxImage({ src, alt, start, end, placement, height }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: [`${start}px end`, `end ${end * -1}px`] })
  const opacity = useTransform(scrollYProgress, [.75, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [.75, 1], [1, .85])
  const y = useTransform(scrollYProgress, [0, 1], [start, end])
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`
  return <motion.img ref={ref} src={src} alt={alt} className={`ref-parallax-image ref-parallax-${placement}`} style={{ transform, opacity, '--image-height': `${height}px` }} width="900" height="600" />
}

function HeroScene() {
  return <section className="ref-hero" id="top" aria-label="ภาพร้านเล็กขายเสื้อผ้าและชุดชั้นใน" style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}>
    <CenterImage />
    <div className="ref-parallax">{pictures.map(picture => <ParallaxImage key={picture.src} {...picture} />)}</div>
    <div className="ref-hero-fade" aria-hidden="true" />
  </section>
}

function StaticScene() {
  return <section className="ref-hero ref-hero-static" id="top" aria-label="ภาพร้านเล็กขายเสื้อผ้าและชุดชั้นใน">
    <img className="ref-static-shop" src="sme-shop.png" alt="ภาพจำลองด้วย AI ของร้านขายส่งเสื้อผ้าไทย" width="1672" height="941" />
    <div className="ref-static-gallery">{pictures.map(picture => <img key={picture.src} src={picture.src} alt={picture.alt} width="900" height="600" />)}</div>
  </section>
}

function HeroMessage({ reduced }) {
  return <>
    <p className="ref-image-disclosure">ภาพร้านและสินค้าเป็นภาพจำลองด้วย AI ไม่ใช่ภาพร้านลูกค้า</p>
    <section className="hero-message" aria-labelledby="hero-title">
      <motion.h1 id="hero-title" initial={reduced ? false : { y: 48, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ ease: 'easeInOut', duration: reduced ? 0 : .75 }}>ระบบจัดการสต็อก<br /><span>สำหรับร้านเสื้อผ้า</span></motion.h1>
      <p>Khonnai ช่วยดูสต็อกแยกไซซ์และสี สำหรับร้านเสื้อผ้าและชุดชั้นใน<br />บันทึกขาย ออกบิล แล้วดูจำนวนคงเหลือในที่เดียว</p>
      <div className="actions"><a className="btn" href="#preview">ดูตัวอย่างทีละขั้น <span aria-hidden="true">↓</span></a><a className="btn secondary" href="#pricing">ดูแนวทางราคา</a></div>
    </section>
  </>
}

export function KhonnaiScrollHero() {
  const reduced = useReducedMotion()
  if (reduced) return <><StaticScene /><HeroMessage reduced /></>
  return <ReactLenis root options={{ lerp: .05 }}><HeroScene /><HeroMessage reduced={false} /></ReactLenis>
}

const mount = document.getElementById('khonnai-scroll-hero')
if (mount) createRoot(mount).render(<KhonnaiScrollHero />)
