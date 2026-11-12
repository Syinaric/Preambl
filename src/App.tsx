import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { initLenis, getLenis } from './lib/lenis'
import { ScrollTrigger } from './lib/gsap'
import { usePrefersReducedMotion } from './lib/hooks'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'

// Dev-only route: slider for uProgress / camera, PNG capture for the no-WebGL fallback.
const DevChip = import.meta.env.DEV ? lazy(() => import('./pages/DevChip')) : null

export default function App() {
  const reduced = usePrefersReducedMotion()
  const location = useLocation()

  useEffect(() => {
    initLenis(!reduced)
  }, [reduced])

  // Route change: reset scroll, refresh triggers after layout settles.
  useEffect(() => {
    const lenis = getLenis()
    if (location.hash) {
      const id = requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>(location.hash)
        if (el) (lenis ? lenis.scrollTo(el, { immediate: true }) : el.scrollIntoView())
        ScrollTrigger.refresh()
      })
      return () => cancelAnimationFrame(id)
    }
    lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0)
    const t = setTimeout(() => ScrollTrigger.refresh(), 50)
    return () => clearTimeout(t)
  }, [location.pathname, location.hash])

  const isDev = location.pathname.startsWith('/dev')

  return (
    <>
      {!isDev && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        {DevChip && (
          <Route
            path="/dev/chip"
            element={
              <Suspense fallback={null}>
                <DevChip />
              </Suspense>
            }
          />
        )}
        <Route path="*" element={<Home />} />
      </Routes>
      {!isDev && <Footer />}
    </>
  )
}
