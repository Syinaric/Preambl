import { color } from '@/tokens'

/**
 * SVG version of the die texture for the footer: blocks of tiny cells
 * separated by routing channels, masked to fade out. Same vocabulary as
 * the hero shader, rendered flat.
 */
export default function DiePattern({ id = 'footer-die', opacity = 0.35 }: { id?: string; opacity?: number }) {
  const blocks: { x: number; y: number; w: number; h: number; p: number }[] = []
  const cols = 8
  const rows = 3
  const W = 1200
  const H = 360
  const bw = W / cols
  const bh = H / rows
  let k = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p = [5, 7, 4, 9, 6][k % 5]
      blocks.push({ x: c * bw + 6, y: r * bh + 6, w: bw - 12, h: bh - 12, p })
      k++
    }
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMax slice" aria-hidden style={{ opacity, color: color.lineHi }}>
      <defs>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect width={W} height={H} fill={`url(#${id}-fade)`} />
        </mask>
        {blocks.map((b, i) => (
          <pattern key={i} id={`${id}-p${i}`} x={b.x} y={b.y} width={b.p} height={b.p} patternUnits="userSpaceOnUse">
            <rect x={b.p * 0.3} y={b.p * 0.15} width={b.p * 0.2} height={b.p * 0.7} fill="currentColor" />
            <rect x={b.p * 0.65} y={b.p * 0.45} width={b.p * 0.15} height={b.p * 0.15} fill="currentColor" />
          </pattern>
        ))}
      </defs>
      <g mask={`url(#${id}-mask)`}>
        {blocks.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={`url(#${id}-p${i})`} />
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="none" stroke={color.line} strokeWidth="1" />
          </g>
        ))}
        {/* routing channels */}
        {Array.from({ length: cols - 1 }, (_, i) => (
          <line key={`v${i}`} x1={(i + 1) * bw} y1="0" x2={(i + 1) * bw} y2={H} stroke={color.accent} strokeWidth="1" opacity="0.35" />
        ))}
        {Array.from({ length: rows - 1 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * bh} x2={W} y2={(i + 1) * bh} stroke={color.accent} strokeWidth="1" opacity="0.35" />
        ))}
      </g>
    </svg>
  )
}
