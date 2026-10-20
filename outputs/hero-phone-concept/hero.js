const video = document.querySelector('.hero-video')
const replay = document.querySelector('.playback')
const label = replay.querySelector('span')
const reduced = matchMedia('(prefers-reduced-motion: reduce)')
let loaded = false
let failed = false
let started = false
let resumeWhenVisible = false
let inView = false

function poster() {
  video.pause()
  delete video.dataset.ready
  replay.hidden = true
}
function load() {
  if (loaded) return
  for (const [src, type] of [['hero-phone.mp4', 'video/mp4'], ['hero-phone.webm', 'video/webm']]) {
    const source = document.createElement('source')
    source.src = src
    source.type = type
    video.append(source)
  }
  loaded = true
  video.load()
}
async function play(fromStart = false) {
  if (reduced.matches || failed) return poster()
  if (document.hidden || !inView) return
  load()
  if (fromStart) video.currentTime = 0
  try { await video.play(); started = true }
  catch { poster(); replay.hidden = false; label.textContent = 'เล่นวิดีโอ' }
}
video.addEventListener('playing', () => {
  if (reduced.matches) return poster()
  video.dataset.ready = 'true'
  replay.hidden = false
  label.textContent = 'หยุดวิดีโอ'
})
video.addEventListener('ended', () => {
  // The final poster uses the same final transform and screen as the encoded hold.
  delete video.dataset.ready
  label.textContent = 'เล่นอีกครั้ง'
})
video.addEventListener('error', () => { failed = true; poster() })
replay.addEventListener('click', () => {
  if (video.paused || video.ended) play(video.dataset.ready !== 'true' || video.ended)
  else { resumeWhenVisible = false; video.pause(); label.textContent = 'เล่นต่อ' }
})
reduced.addEventListener('change', () => {
  if (reduced.matches) { resumeWhenVisible = false; poster() }
  else if (!started) play()
  else if (!failed) { replay.hidden = false; label.textContent = 'เล่นอีกครั้ง' }
})
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { resumeWhenVisible ||= !video.paused; video.pause() }
  else if (resumeWhenVisible && inView) { resumeWhenVisible = false; play() }
})
const observer = new IntersectionObserver(([entry]) => {
  inView = entry.isIntersecting
  if (inView && !document.hidden) { if (!started) play(); else if (resumeWhenVisible) { resumeWhenVisible = false; play() } }
  else if (!video.paused) { resumeWhenVisible = true; video.pause() }
}, { threshold: 0.1 })
observer.observe(video.parentElement)
if (reduced.matches) poster()
