/**
 * A tiny mutable store shared by ScrollTrigger (writer) and the R3F
 * frame loop / React UI (readers). No React state on the hot path: the
 * scene reads `heroProgress.value` every frame without re-rendering.
 */
type Listener = (v: number) => void

function createProgress(initial = 0) {
  const listeners = new Set<Listener>()
  const store = {
    value: initial,
    /** Set and notify subscribers (UI). Scene reads `.value` directly. */
    set(v: number) {
      if (v === store.value) return
      store.value = v
      listeners.forEach((l) => l(v))
    },
    subscribe(l: Listener) {
      listeners.add(l)
      return () => {
        listeners.delete(l)
      }
    },
  }
  return store
}

/** 0..1 scrub progress of the home hero. */
export const heroProgress = createProgress(0)

/** Whether the hero canvas should render this frame (paused when off-screen). */
export const heroActive = { value: true }
