const copy = JSON.parse(document.getElementById('landing-copy').textContent)
const language = document.documentElement.lang
const reduced = matchMedia('(prefers-reduced-motion: reduce)')
const nav = document.querySelector('.site-nav')
const words = [...document.querySelectorAll('.keyword-sweep')]
const visibleWords = new Set()
function syncWords() { words.forEach(word => { word.dataset.active = String(visibleWords.has(word) && !document.hidden) }) }
const wordObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) visibleWords.add(entry.target); else visibleWords.delete(entry.target) }); syncWords() })
words.forEach(word => wordObserver.observe(word))
document.addEventListener('visibilitychange', syncWords)
function updateNav() { nav.dataset.scrolled = String(scrollY > 80) }
addEventListener('scroll', updateNav, { passive: true }); updateNav()

const heading = document.querySelector('#hero-title')
if (!reduced.matches) {
  const headingObserver = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return
    heading.animate([{ transform: 'translateY(48px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 750, easing: 'ease-in-out' })
    headingObserver.disconnect()
  }, { threshold: .1 })
  headingObserver.observe(heading)
}

const track = document.querySelector('.start-viewport')
const cards = [...document.querySelectorAll('.start-card')]
const prev = document.querySelector('.start-prev'), next = document.querySelector('.start-next')
function updateCarousel() {
  const max = track.scrollWidth - track.clientWidth
  prev.disabled = track.scrollLeft < 2; next.disabled = track.scrollLeft >= max - 2
  const index = max > 0 ? Math.round(track.scrollLeft / max * (cards.length - 1)) + 1 : 1
  document.querySelector('[data-carousel-status]').textContent = `${copy.step} ${index} ${language === 'th' ? 'จาก' : 'of'} ${cards.length}`
}
function go(direction) { track.scrollBy({ left: direction * (cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track.firstElementChild).gap)), behavior: reduced.matches ? 'instant' : 'smooth' }) }
prev.addEventListener('click', () => go(-1)); next.addEventListener('click', () => go(1))
track.addEventListener('scroll', updateCarousel, { passive: true })
track.addEventListener('keydown', event => {
  if (event.target !== track) return
  if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) event.preventDefault()
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') go(event.key === 'ArrowRight' ? 1 : -1)
  if (event.key === 'Home' || event.key === 'End') track.scrollTo({ left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: reduced.matches ? 'instant' : 'smooth' })
})
new ResizeObserver(updateCarousel).observe(track); updateCarousel()

const teaserCards = [...document.querySelectorAll('.teaser-card')]
const teaserLinks = [...document.querySelectorAll('[data-teaser-link]')]
let teaserFrame = 0
function updateTeaser() {
  teaserFrame = 0
  let current = 0
  teaserCards.forEach((card, index) => { if (card.getBoundingClientRect().top < innerHeight * .6) current = index })
  teaserCards.forEach((card, index) => card.classList.toggle('spent', !reduced.matches && index < current))
  teaserLinks.forEach((link, index) => { if (index === current) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current') })
}
addEventListener('scroll', () => { if (!teaserFrame) teaserFrame = requestAnimationFrame(updateTeaser) }, { passive: true })
addEventListener('resize', updateTeaser)
reduced.addEventListener('change', updateTeaser)
updateTeaser()

document.querySelector('[data-language]').addEventListener('change', event => {
  const nextLanguage = event.target.value
  if (nextLanguage === language) return
  try { localStorage.setItem('khonnai-language', nextLanguage) } catch { /* Preference is optional; language URLs always work. */ }
  location.assign(`${nextLanguage === 'en' ? '/en/landing/' : '/landing/'}${location.hash}`)
})

const prices = [0, 299, 699]
let annual = false
document.querySelectorAll('[data-billing]').forEach(button => button.addEventListener('click', () => {
  const nextAnnual = button.dataset.billing === 'annual'
  if (nextAnnual === annual) return
  annual = nextAnnual
  document.querySelectorAll('[data-billing]').forEach(option => option.setAttribute('aria-pressed', String((option.dataset.billing === 'annual') === annual)))
  document.querySelector('.pricing-billing').dataset.period = annual ? 'annual' : 'monthly'
  document.querySelectorAll('[data-price]').forEach((element, index) => {
    const number = annual ? prices[index] * 12 * .9 : prices[index]
    const value = number.toLocaleString(language === 'th' ? 'th-TH' : 'en-US', { minimumFractionDigits: annual && number ? 2 : 0, maximumFractionDigits: 2 })
    const previous = element.querySelector('.price-current')?.textContent || element.textContent
    const current = document.createElement('span'); current.className = 'price-current'; current.textContent = value
    element.replaceChildren(current)
    if (!reduced.matches) {
      const outgoing = document.createElement('span'); outgoing.textContent = previous; outgoing.className = 'price-outgoing'; outgoing.setAttribute('aria-hidden', 'true'); element.append(outgoing)
      outgoing.animate([{ transform: 'translateY(0) rotateX(0)', opacity: 1 }, { opacity: 0, offset: .25 }, { transform: 'translateY(-65%) rotateX(35deg)', opacity: 0 }], { duration: 320, easing: 'ease-in', fill: 'forwards' }).finished.then(() => outgoing.remove()).catch(() => outgoing.remove())
      current.animate([{ transform: 'translateY(65%) rotateX(-35deg)', opacity: 0 }, { transform: 'translateY(0) rotateX(0)', opacity: 1 }], { duration: 480, delay: 160, easing: 'cubic-bezier(.24,1,.4,1)', fill: 'backwards' })
    }
  })
  document.querySelectorAll('.pricing-period [data-period]').forEach(element => { element.textContent = annual ? copy.perYear : copy.perMonth })
}))

const marquee = document.querySelector('.capability-track')
let marqueeVisible = false
function syncMarquee() { marquee.style.animationPlayState = !document.hidden && marqueeVisible ? 'running' : 'paused' }
new IntersectionObserver(entries => { marqueeVisible = entries[0].isIntersecting; syncMarquee() }).observe(marquee)
document.addEventListener('visibilitychange', syncMarquee)
