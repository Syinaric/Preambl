export const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

export function smoothstep(a: number, b: number, x: number) {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
