import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)
ScrollTrigger.config({ ignoreMobileResize: true })

// Lenis drives the ticker; avoid GSAP's own lag smoothing fighting it.
gsap.ticker.lagSmoothing(0)

export { gsap, ScrollTrigger }
