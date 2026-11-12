import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { getLenis } from '@/lib/lenis'
import { heroProgress } from '@/lib/progressStore'
import { useIsMobile, usePrefersReducedMotion, useWebGL } from '@/lib/hooks'
import { scene as S } from '@/tokens'
import ChipScene from '@/scene/ChipScene'
import { smoothstep } from '@/scene/math'
import Preloader from './Preloader'
import './Hero.css'

/*
 * Tagline options (picked #1 for the hero; #2 returns as the closing line):
 *  1. "The model is the chip."
 *  2. "Intelligence, cast in silicon."
 *  3. "Nothing to fetch. Nothing to wait for."
 */
const TAGLINE = 'The model is the chip.'
const CLOSING = 'Intelligence, cast in silicon.'

const readProgress = () => heroProgress.value

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const mobile = useIsMobile()
  const webgl = useWebGL()

  const wrap = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const text0 = useRef<HTMLDivElement>(null)
  const text1 = useRef<HTMLDivElement>(null)
  const hint = useRef<HTMLDivElement>(null)
  const shade = useRef<HTMLDivElement>(null)

  const [ready, setReady] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [active, setActive] = useState(true)

  const pinned = !reduced && webgl !== false

  // Hold scroll until the chip is on screen, so the first scroll scrubs a visible chip.
  useEffect(() => {
    if (!pinned) return
    // Lenis is created by App's effect, which runs after this child effect: poll briefly.
    let raf = 0
    const apply = () => {
      const lenis = getLenis()
      if (!lenis) {
        raf = requestAnimationFrame(apply)
        return
      }
      if (loaded) lenis.start()
      else lenis.stop()
    }
    apply()
    return () => {
      cancelAnimationFrame(raf)
      getLenis()?.start()
    }
  }, [loaded, pinned])

  // Scroll-scrubbed timeline → progress store + text overlays
  useEffect(() => {
    if (!pinned) {
      heroProgress.set(1)
      if (text1.current) text1.current.style.opacity = '1'
      if (shade.current) shade.current.style.opacity = '1'
      return
    }
    heroProgress.set(0)
    const proxy = { p: 0 }
    const apply = () => {
      const p = proxy.p
      heroProgress.set(p)
      const t0 = 1 - smoothstep(0.015, 0.14, p)
      const t1 = smoothstep(0.8, 0.94, p)
      if (text0.current) {
        text0.current.style.opacity = String(t0)
        text0.current.style.transform = `translateY(${(1 - t0) * -24}px)`
      }
      if (text1.current) {
        text1.current.style.opacity = String(t1)
        text1.current.style.transform = `translateY(${(1 - t1) * 18}px)`
      }
      if (shade.current) shade.current.style.opacity = String(t1)
      if (hint.current) hint.current.style.opacity = String(1 - smoothstep(0, 0.045, p))
    }
    const tween = gsap.to(proxy, {
      p: 1,
      ease: 'none',
      onUpdate: apply,
      scrollTrigger: {
        trigger: wrap.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: pin.current,
        pinSpacing: false,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
    apply()
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [pinned])

  // Pause the frame loop once the hero is fully scrolled out of view
  useEffect(() => {
    const el = pin.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (webgl === false) setLoaded(true)
  }, [webgl])

  const heightStyle = pinned ? { height: `calc(100svh + ${S.heroScrollVh}vh)` } : { height: '100svh' }

  return (
    <section ref={wrap} className={`hero ${pinned ? '' : 'hero--static'}`} style={heightStyle} aria-label="Preambl">
      <div ref={pin} className="hero__pin">
        {webgl === null ? null : webgl ? (
          <ChipScene
            progress={readProgress}
            mobile={mobile}
            active={active && (pinned ? true : loaded)}
            cameraRig={pinned}
            orbit={false}
            dof={!mobile}
            onReady={() => setReady(true)}
            {...(!pinned ? { params: { hum: 0.6 } } : {})}
          />
        ) : (
          <div className="hero__fallback">
            {/* Static capture of the final powered state (from /dev/chip → Download PNG). */}
            <img src="/fallback/chip-final.png" alt="Preambl chip, powered, three-quarter view" />
          </div>
        )}

        {!pinned && webgl ? <StaticCamera /> : null}

        {webgl && !loaded ? <Preloader ready={ready} onDone={() => setLoaded(true)} /> : null}

        <div ref={shade} className="hero__shade" aria-hidden />
        <div className="hero__text">
          <div ref={text0} className="hero__t0">
            <span className="mono hero__kicker">Preambl · inference silicon</span>
            <h1 className="display hero__title">{TAGLINE}</h1>
          </div>
          <div ref={text1} className="hero__t1">
            <p className="h2 glow-text">{CLOSING}</p>
            <span className="mono">Weights live in the silicon. Nothing is fetched.</span>
          </div>
        </div>

        {pinned ? (
          <div ref={hint} className="hero__hint" aria-hidden>
            <span className="mono">scroll</span>
            <span className="hero__hint-line" />
          </div>
        ) : null}

        {/* HUD annotations: monospace callouts with leader lines */}
        <div className="hero__hud" aria-hidden>
          <span className="hero__hud-item hero__hud-item--tl mono">die · top view</span>
          <span className="hero__hud-item hero__hud-item--br mono">preambl-0 · gen 0</span>
        </div>
      </div>
    </section>
  )
}

/** Reduced-motion / static hero: place the camera at the final angle once. */
function StaticCamera() {
  useEffect(() => {
    heroProgress.set(1)
  }, [])
  return null
}
