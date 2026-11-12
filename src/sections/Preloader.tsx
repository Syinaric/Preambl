import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import './Preloader.css'

interface Props {
  ready: boolean
  onDone: () => void
}

/**
 * Minimal preloader: thin progress line + monospace percentage.
 * Climbs to ~85% on a timer while shaders compile, snaps to 100% on `ready`,
 * then crossfades into the dormant chip. The overlay shares the page
 * background so there is never a flash of empty canvas.
 */
export default function Preloader({ ready, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const pct = useRef<HTMLSpanElement>(null)
  const state = useRef({ v: 0 })
  const tween = useRef<gsap.core.Tween | null>(null)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    const s = state.current
    const render = () => {
      if (bar.current) bar.current.style.transform = `scaleX(${s.v})`
      if (pct.current) pct.current.textContent = `${Math.round(s.v * 100).toString().padStart(3, '0')}`
    }
    tween.current = gsap.to(s, { v: 0.86, duration: 1.1, ease: 'power2.out', onUpdate: render })
    return () => {
      tween.current?.kill()
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    const s = state.current
    tween.current?.kill()
    const tl = gsap.timeline({ onComplete: () => done.current() })
    tl.to(s, {
      v: 1,
      duration: 0.28,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (bar.current) bar.current.style.transform = `scaleX(${s.v})`
        if (pct.current) pct.current.textContent = `${Math.round(s.v * 100).toString().padStart(3, '0')}`
      },
    })
      .to(bar.current, { boxShadow: '0 0 24px rgba(255,176,58,0.9)', duration: 0.2 }, '<')
      .to(root.current, { opacity: 0, duration: 0.65, ease: 'power2.inOut' }, '+=0.1')
    return () => {
      tl.kill()
    }
  }, [ready])

  return (
    <div ref={root} className="preloader" aria-live="polite" aria-busy={!ready}>
      <div className="preloader__inner">
        <span className="mono">Preambl</span>
        <div className="preloader__track">
          <div ref={bar} className="preloader__bar" />
        </div>
        <span className="mono preloader__pct">
          <span ref={pct}>000</span>
          <span className="preloader__unit">%</span>
        </span>
      </div>
    </div>
  )
}
