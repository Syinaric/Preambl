import type { ReactNode } from 'react'
import { color, font, stroke } from '@/tokens'

/** Shared SVG defs: glow filters and grid pattern. Mount once per <svg>. */
export function GraphicDefs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.2" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id={`${id}-glow-lg`} x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="6" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <pattern id={`${id}-grid`} width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M24 0H0V24" fill="none" stroke={color.grid} strokeWidth={stroke.hair} />
      </pattern>
      <pattern id={`${id}-grid-lg`} width="120" height="120" patternUnits="userSpaceOnUse">
        <path d="M120 0H0V120" fill="none" stroke={color.line} strokeWidth={stroke.hair} opacity="0.7" />
      </pattern>
      <linearGradient id={`${id}-pulse`} x1="0" x2="1">
        <stop offset="0" stopColor={color.accent} stopOpacity="0" />
        <stop offset="0.6" stopColor={color.accentHi} stopOpacity="1" />
        <stop offset="1" stopColor={color.core} stopOpacity="1" />
      </linearGradient>
      <radialGradient id={`${id}-radial`}>
        <stop offset="0" stopColor={color.accent} stopOpacity="0.55" />
        <stop offset="1" stopColor={color.accent} stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

/** Faint grid underlay across the whole graphic. */
export function GridUnderlay({ id, w, h }: { id: string; w: number; h: number }) {
  return (
    <g aria-hidden>
      <rect width={w} height={h} fill={`url(#${id}-grid)`} />
      <rect width={w} height={h} fill={`url(#${id}-grid-lg)`} />
    </g>
  )
}

interface CalloutProps {
  /** Anchor point on the diagram. */
  x: number
  y: number
  /** Label position. */
  lx: number
  ly: number
  label: string
  sub?: string
  hi?: boolean
  anchor?: 'start' | 'end'
  className?: string
}

/** Monospace label with a leader line, like an annotated die shot. */
export function Callout({ x, y, lx, ly, label, sub, hi, anchor = 'start', className = '' }: CalloutProps) {
  const c = hi ? color.accentHi : color.textMute
  const elbowX = lx + (anchor === 'start' ? -10 : 10)
  return (
    <g className={`callout ${className}`} fontFamily={font.mono} fontSize="10" letterSpacing="0.14em">
      <path d={`M${x} ${y} L${elbowX} ${ly} L${lx} ${ly}`} fill="none" stroke={c} strokeWidth={stroke.hair} opacity="0.8" />
      <circle cx={x} cy={y} r="2" fill={hi ? color.amber : color.lineHi} />
      <text x={lx + (anchor === 'start' ? 6 : -6)} y={ly - 4} fill={c} textAnchor={anchor}>
        {label.toUpperCase()}
      </text>
      {sub ? (
        <text x={lx + (anchor === 'start' ? 6 : -6)} y={ly + 10} fill={color.textMute} textAnchor={anchor} fontSize="9">
          {sub}
        </text>
      ) : null}
    </g>
  )
}

/** Frame wrapper with corner ticks and a small tag. */
export function GraphicFrame({ tag, children, aspect, label }: { tag: ReactNode; children: ReactNode; aspect?: string; label: string }) {
  return (
    <figure className="graphic" style={{ aspectRatio: aspect, margin: 0 }} role="img" aria-label={label}>
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
      <span className="tag">{tag}</span>
      {children}
    </figure>
  )
}

/** A block of "die texture": tiny cells in a grid, pure SVG. */
export function CellField({ x, y, w, h, pitch = 6, id, opacity = 0.9 }: { x: number; y: number; w: number; h: number; pitch?: number; id: string; opacity?: number }) {
  return (
    <g>
      <pattern id={id} x={x} y={y} width={pitch} height={pitch} patternUnits="userSpaceOnUse">
        <rect x={pitch * 0.3} y={pitch * 0.15} width={pitch * 0.18} height={pitch * 0.7} fill="currentColor" />
        <rect x={pitch * 0.62} y={pitch * 0.42} width={pitch * 0.14} height={pitch * 0.14} fill="currentColor" />
      </pattern>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} opacity={opacity} />
    </g>
  )
}
