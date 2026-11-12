import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenis: Lenis | null = null

/** Creates (once) a Lenis instance synced with GSAP ScrollTrigger. */
export function initLenis(enabled: boolean) {
  if (lenis || !enabled) return lenis
  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false, // native touch scrolling feels best on mobile; Lenis still reports scroll
    touchMultiplier: 1.2,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  return lenis
}

export function getLenis() {
  return lenis
}

/** Scroll to a target with Lenis when available, else native. */
export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 3) })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target + offset, behavior: 'smooth' })
    return
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
}
