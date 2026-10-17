import React, { useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactLenis } from 'lenis/react'
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react'
import 'lenis/dist/lenis.css'

const copy = JSON.parse(document.getElementById('landing-copy').textContent)
const pictures = [
  { name: 'products', start: -200, end: 200, placement: 'left', height: 230 },
  { name: 'hands', start: 200, end: -250, placement: 'center', height: 330 },
  { name: 'underwear-shop', start: -200, end: 200, placement: 'right', height: 230 },
  { name: 'underwear-packs', start: 0, end: -500, placement: 'offset', height: 280 },
]
function CenterImage() {
  const { scrollY } = useScroll()
  const clip1 = useTransform(scrollY, [0, 1500], [25, 0])
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100])
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`
  const backgroundSize = useTransform(scrollY, [0, 2000], ['170%', '100%'])
  const opacity = useTransform(scrollY, [1500, 2000], [1, 0])
  return <motion.div className="ref-hero-center" role="img" aria-label={copy.heroAlt} style={{ clipPath, backgroundSize, opacity }} />
}
function ParallaxImage({ name, start, end, placement, height, alt }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: [`${start}px end`, `end ${end * -1}px`] })
  const opacity = useTransform(scrollYProgress, [.75, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [.75, 1], [1, .85])
  const y = useTransform(scrollYProgress, [0, 1], [start, end])
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`
  return <motion.img ref={ref} src={`/landing/${name}-960.webp`} srcSet={`/landing/${name}-480.webp 480w, /landing/${name}-960.webp 960w, /landing/${name}-1600.webp 1600w`} sizes={placement === 'center' ? '(max-width: 700px) 66vw, 680px' : '(max-width: 700px) 42vw, 430px'} alt={alt} className={`ref-parallax-image ref-parallax-${placement}`} style={{ transform, opacity, '--image-height': `${height}px` }} width="1536" height="1024" />
}
function Hero() {
  const reduced = useReducedMotion()
  const scene = <section className="ref-hero" aria-label={copy.heroAlt}><CenterImage /><div className="ref-parallax">{pictures.map((picture, index) => <ParallaxImage key={picture.name} {...picture} alt={copy.photoAlts[index]} />)}</div><div className="ref-hero-fade" aria-hidden="true" /></section>
  if (reduced) return <section className="ref-hero ref-hero-static" aria-label={copy.heroAlt}><img className="ref-static-shop" src="/landing/shop-960.webp" alt={copy.heroAlt} width="1600" height="900" /><div className="ref-static-gallery">{pictures.map((picture, index) => <img key={picture.name} src={`/landing/${picture.name}-480.webp`} alt={copy.photoAlts[index]} width="1536" height="1024" />)}</div></section>
  return <ReactLenis root options={{ lerp: .05, anchors: { offset: -112 } }}>{scene}</ReactLenis>
}
const mount = document.getElementById('khonnai-scroll-hero')
if (mount) createRoot(mount).render(<Hero />)
