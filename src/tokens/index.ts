/**
 * Preambl design tokens — the single source of truth.
 * The three.js scene, SVG graphics and CSS all read from here.
 * `injectTokens()` mirrors everything into CSS custom properties on :root.
 */

export const color = {
  // Backgrounds: midnight cherry — near-black with a deep cherry tint, never pure black
  bg0: '#0A0407',
  bg1: '#10060A',
  bg2: '#160810',
  bg3: '#1E0B14',

  // Primary accent: cherry, used as emissive light (energy, traces, glow)
  accent: '#DC2A52',
  accentHi: '#FF5F86',
  // Amber: the rare "pop" accent — pulses, hottest flashes, CTA edges
  amber: '#FFB03A',
  // Hottest energy core: amber-white
  core: '#FFE9BC',

  // Secondary: powder white / warm graphite for chip metal
  graphite: '#221419',
  graphiteHi: '#33222A',
  silver: '#A3959B',
  silverHi: '#F2EAEE', // powder white

  // Linework: very muted cherry
  line: '#3A1A26',
  lineHi: '#5C2A3C',
  grid: '#1C0C14',

  // Text: powder white family
  text: '#F5EEF1',
  textDim: '#A89AA0',
  textMute: '#6A585F',
} as const

export const font = {
  heading: "'Space Grotesk', 'Inter Tight', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
} as const

export const space = {
  gutter: 'clamp(16px, 5vw, 96px)',
  sectionY: 'clamp(96px, 14vh, 200px)',
  maxW: '1240px',
  maxText: '640px',
} as const

export const radius = {
  sm: '2px',
  md: '4px',
} as const

/** Easing curves. CSS strings + matching GSAP ease names. */
export const ease = {
  // "power on" — slow start, confident settle
  powerOn: 'cubic-bezier(0.22, 1, 0.36, 1)',
  powerOnGsap: 'power3.out',
  // symmetric for scrubbed motion
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  inOutGsap: 'power2.inOut',
  // linear for pulses travelling along traces
  linear: 'linear',
} as const

export const duration = {
  fast: 0.32,
  base: 0.8,
  slow: 1.4,
  reveal: 1.1,
} as const

/** Line weights shared by SVG graphics and the chip linework. */
export const stroke = {
  hair: 1,
  thin: 1.25,
  trace: 1.5,
} as const

/** Scene-specific numbers so the 3D scene and page agree. */
export const scene = {
  heroScrollVh: 350, // scroll distance that scrubs the hero (in vh)
  powerStart: 0.02, // uProgress at which the chip begins to power up
  powerFull: 0.68, // uProgress at which the chip is fully powered
  dollyEnd: 0.4, // camera dolly finishes, arc begins
  maxDpr: 1.75,
} as const

export const tokens = { color, font, space, radius, ease, duration, stroke, scene }
export type Tokens = typeof tokens

/** Hex → [r,g,b] in 0..1 (for shader uniforms). */
export function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h, 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

/** Writes every token to :root as --<group>-<key>. Idempotent. */
export function injectTokens() {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const groups: Record<string, Record<string, string | number>> = {
    color,
    font,
    space,
    radius,
    ease: { powerOn: ease.powerOn, inOut: ease.inOut, linear: ease.linear },
    dur: {
      fast: `${duration.fast}s`,
      base: `${duration.base}s`,
      slow: `${duration.slow}s`,
      reveal: `${duration.reveal}s`,
    },
  }
  for (const [g, vals] of Object.entries(groups)) {
    for (const [k, v] of Object.entries(vals)) {
      root.style.setProperty(`--${g}-${k.replace(/[A-Z0-9]/g, (m) => '-' + m.toLowerCase())}`, String(v))
    }
  }
}
