import { color, font, stroke } from '@/tokens'
import { Callout, CellField, GraphicDefs, GraphicFrame, GridUnderlay } from './primitives'
import { drawIn, pulseAlong, useGraphic } from './useGraphic'
import { gsap } from '@/lib/gsap'

const W = 760
const H = 300
const ID = 'gen'

const GENS = [
  { label: 'GEN 1', sub: 'first weights', pitch: 9, glow: 0.35, size: 64 },
  { label: 'GEN 2', sub: 'improved weights', pitch: 7, glow: 0.55, size: 70 },
  { label: 'GEN 3', sub: 'improved weights', pitch: 5.5, glow: 0.75, size: 76 },
  { label: 'NEXT', sub: 'in development', pitch: 4.2, glow: 1, size: 82 },
]

/** Horizontal timeline: each generation more intricate and brighter than the last. */
export default function GenerationsTimeline({ play }: { play: boolean }) {
  const ref = useGraphic(play, ({ tl, q, reduced }) => {
    drawIn(tl, q('.rail'), 1.4, 0, 0)
    tl.from(q('.chip'), { opacity: 0, y: 10, duration: 0.8, stagger: 0.22 }, 0.3)
    tl.from(q('.chip-glow'), { opacity: 0, duration: 0.9, stagger: 0.22 }, 0.5)
    tl.from(q('.callout'), { opacity: 0, duration: 0.6 }, 1.4)
    if (reduced) return
    const rail = q('.rail')[0]
    q('.pulse').forEach((dot, i) => pulseAlong(dot, rail, 5.2, i * 1.7))
    q('.chip-glow').forEach((g, i) => gsap.to(g, { opacity: 0.6 + i * 0.1, duration: 1.8 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' }))
  })

  const xs = [110, 300, 490, 680]
  return (
    <GraphicFrame tag={<>fig 04 · <b>generations</b></>} aspect={`${W}/${H}`} label="Timeline of chip generations, each denser and brighter than the previous">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} style={{ color: color.accentHi }}>
        <GraphicDefs id={ID} />
        <GridUnderlay id={ID} w={W} h={H} />
        <path className="rail" d="M30 170 H730" fill="none" stroke={color.lineHi} strokeWidth={stroke.hair} />
        {Array.from({ length: 36 }, (_, i) => (
          <line key={i} x1={30 + i * 20} y1="170" x2={30 + i * 20} y2={i % 5 === 0 ? 180 : 175} stroke={color.line} strokeWidth={stroke.hair} />
        ))}
        {GENS.map((g, i) => {
          const s = g.size
          const x = xs[i] - s / 2
          const y = 170 - s / 2
          const last = i === GENS.length - 1
          return (
            <g key={g.label} className="chip">
              <circle className="chip-glow" cx={xs[i]} cy={170} r={s * 0.9} fill={`url(#${ID}-radial)`} opacity={g.glow} />
              {/* package */}
              <rect x={x - 8} y={y - 8} width={s + 16} height={s + 16} fill={color.bg2} stroke={color.line} strokeWidth={stroke.hair} />
              {/* pads */}
              {Array.from({ length: 6 }, (_, k) => (
                <g key={k} fill={color.silver} opacity="0.7">
                  <rect x={x + 6 + k * ((s - 12) / 5) - 2} y={y - 7} width="4" height="4" />
                  <rect x={x + 6 + k * ((s - 12) / 5) - 2} y={y + s + 3} width="4" height="4" />
                </g>
              ))}
              {/* die */}
              <rect x={x} y={y} width={s} height={s} fill={color.bg1} stroke={last ? color.amber : color.silverHi} strokeWidth={stroke.thin} strokeDasharray={last ? '4 3' : undefined} />
              <g style={{ color: last ? color.amber : color.accentHi }} opacity={0.5 + g.glow * 0.5}>
                <CellField id={`${ID}-c${i}`} x={x + 5} y={y + 5} w={s - 10} h={s - 10} pitch={g.pitch} />
              </g>
              <line x1={x + s / 2} y1={y + 5} x2={x + s / 2} y2={y + s - 5} stroke={color.accent} strokeWidth={stroke.hair} opacity="0.6" />
              <line x1={x + 5} y1={y + s / 2} x2={x + s - 5} y2={y + s / 2} stroke={color.accent} strokeWidth={stroke.hair} opacity="0.6" />
              <text x={xs[i]} y={y + s + 36} textAnchor="middle" fontFamily={font.mono} fontSize="10" letterSpacing="0.18em" fill={last ? color.amber : color.text}>
                {g.label}
              </text>
              <text x={xs[i]} y={y + s + 50} textAnchor="middle" fontFamily={font.mono} fontSize="9" letterSpacing="0.14em" fill={color.textMute}>
                {g.sub.toUpperCase()}
              </text>
            </g>
          )
        })}
        {Array.from({ length: 3 }, (_, i) => (
          <circle key={i} className="pulse" r="2.4" fill={color.core} filter={`url(#${ID}-glow)`} opacity="0" />
        ))}
        <Callout x={110} y={138} lx={60} ly={60} label="frozen weights" sub="one task, done well" />
        <Callout x={680} y={129} lx={600} ly={44} label="each generation" sub="better weights, same promise" hi anchor="end" />
      </svg>
    </GraphicFrame>
  )
}
