import { useEffect, useState, useSyncExternalStore } from 'react'

function useMediaQuery(query: string, fallback = false) {
  const subscribe = (cb: () => void) => {
    if (typeof window === 'undefined') return () => {}
    const mql = window.matchMedia(query)
    mql.addEventListener('change', cb)
    return () => mql.removeEventListener('change', cb)
  }
  const get = () => (typeof window === 'undefined' ? fallback : window.matchMedia(query).matches)
  return useSyncExternalStore(subscribe, get, () => fallback)
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/** Coarse pointer or narrow viewport → lighter scene settings. */
export function useIsMobile() {
  const coarse = useMediaQuery('(pointer: coarse)')
  const narrow = useMediaQuery('(max-width: 768px)')
  return coarse || narrow
}

let webglCache: boolean | null = null
export function detectWebGL(): boolean {
  if (webglCache !== null) return webglCache
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    webglCache = !!gl
  } catch {
    webglCache = false
  }
  return webglCache
}

export function useWebGL() {
  const [ok, setOk] = useState<boolean | null>(null)
  useEffect(() => setOk(detectWebGL()), [])
  return ok
}
