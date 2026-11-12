import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { usePrefersReducedMotion } from '@/lib/hooks'

export interface GraphicCtx {
  root: SVGSVGElement
  reduced: boolean
  /** Entry timeline: plays once, then idle loops (added by `build`) take over. */
  tl: gsap.core.Timeline
  /** Query helper scoped to the graphic. */
  q: (sel: string) => Element[]
}

/**
 * Runs a GSAP build function once `play` becomes true. With reduced motion,
 * the entry timeline is jumped to its end and `build` should skip idle loops.
 */
export function useGraphic(play: boolean, build: (c: GraphicCtx) => void) {
  const ref = useRef<SVGSVGElement>(null)
  const reduced = usePrefersReducedMotion()
  const buildRef = useRef(build)
  buildRef.current = build

  useEffect(() => {
    const root = ref.current
    if (!play || !root) return
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    const ctx = gsap.context(() => {
      buildRef.current({ root, reduced, tl, q: (sel) => Array.from(root.querySelectorAll(sel)) })
      if (reduced) tl.progress(1)
    }, root)
    return () => {
      tl.kill()
      ctx.revert()
    }
  }, [play, reduced])

  return ref
}

/** Stroke-draw a set of paths/lines (stroke-dashoffset). */
export function drawIn(tl: gsap.core.Timeline, els: Element[], dur = 1.2, stagger = 0.08, at: gsap.Position = 0) {
  els.forEach((el) => {
    const len = (el as SVGGeometryElement).getTotalLength?.() ?? 300
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
  })
  tl.to(els, { strokeDashoffset: 0, duration: dur, stagger, ease: 'power2.inOut' }, at)
}

/** Send a dot along a path forever (idle loop). */
export function pulseAlong(dot: Element, path: Element, duration: number, delay = 0, ease = 'none') {
  return gsap.fromTo(
    dot,
    { opacity: 0 },
    {
      opacity: 1,
      keyframes: { '0%': { opacity: 0 }, '12%': { opacity: 1 }, '88%': { opacity: 1 }, '100%': { opacity: 0 } },
      motionPath: { path: path as SVGPathElement, align: path as SVGPathElement, alignOrigin: [0.5, 0.5] },
      duration,
      delay,
      ease,
      repeat: -1,
    },
  )
}
