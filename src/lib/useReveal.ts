import { useEffect, useRef } from 'react'
import { ScrollTrigger } from './gsap'

/**
 * Adds `.is-on` to every `.reveal` descendant (staggered) once the host
 * element enters the viewport. Returns a callback that fires at the same
 * moment so graphics can start their GSAP timelines.
 */
export function useReveal<T extends HTMLElement>(onEnter?: () => void, start = 'top 72%') {
  const ref = useRef<T>(null)
  const cb = useRef(onEnter)
  cb.current = onEnter

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = Array.from(el.querySelectorAll<HTMLElement>('.reveal'))
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        items.forEach((it, i) => {
          it.style.transitionDelay = `${i * 0.09}s`
          it.classList.add('is-on')
        })
        cb.current?.()
      },
    })
    return () => st.kill()
  }, [start])

  return ref
}
