import { color, font, stroke } from '@/tokens'
import { Callout, CellField, GraphicDefs, GraphicFrame, GridUnderlay } from './primitives'
import { drawIn, pulseAlong, useGraphic } from './useGraphic'
import { gsap } from '@/lib/gsap'

const W = 640
const H = 360
const ID = 'bn'

/**
 * Today's inference: a compute block starving while weights trickle in
 * from a distant memory block over a long bus.
 */
export default function BottleneckDiagram({ play }: { play: boolean }) {
  const ref = useGraphic(play, ({ tl, q, reduced }) => {
    drawIn(tl, q('.draw'), 1.1, 0.06, 0)
    tl.from(q('.block'), { opacity: 0, duration: 0.8, stagger: 0.15 }, 0.2)
    tl.from(q('.callout'), { opacity: 0, y: 6, duration: 0.6, stagger: 0.12 }, 0.9)
    tl.from(q('.util'), { scaleX: 0, transformOrigin: 'left center', duration: 1, ease: 'power2.out' }, 1.0)
    if (reduced) return
    // slow pulses along the bus (weights trickling in)
    const paths = q('.bus')
    q('.pulse').forEach((dot, i) => pulseAlong(dot, paths[i % paths.length], 4.6 + i * 0.5, i * 0.9))
    // compute block flickers: waiting on data
    gsap.to(q('.starve'), { opacity: 0.55, duration: 0.9, yoyo: true, repeat: -1, ease: 'rough({ strength: 1, points: 12, randomize: true })' })
  })

  return (
    <GraphicFrame tag={<>fig 01 · <b>weights ↔ compute</b></>} aspect={`${W}/${H}`} label="Diagram of a compute block waiting on weights arriving slowly from distant memory">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} style={{ color: color.lineHi }}>
        <GraphicDefs id={ID} />
        <GridUnderlay id={ID} w={W} h={H} />

        {/* memory block */}
        <g className="block">
          <rect className="draw" x="48" y="96" width="132" height="168" fill={color.bg2} stroke={color.silver} strokeWidth={stroke.thin} />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x="62" y={110 + i * 18} width="104" height="10" fill="none" stroke={color.line} strokeWidth={stroke.hair} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={`f${i}`} x="64" y={112 + i * 18} width={30 + ((i * 37) % 60)} height="6" fill={color.accent} opacity="0.55" />
          ))}
          <text x="114" y="286" fontFamily={font.mono} fontSize="10" letterSpacing="0.16em" fill={color.textDim} textAnchor="middle">
            MEMORY
          </text>
        </g>

        {/* long bus: three lanes */}
        <g fill="none" stroke={color.line} strokeWidth={stroke.hair}>
          <path className="bus draw" d="M180 160 H440" />
          <path className="bus draw" d="M180 180 H440" />
          <path className="bus draw" d="M180 200 H440" />
          {/* distance ticks */}
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} className="draw" x1={200 + i * 20} y1="214" x2={200 + i * 20} y2={i % 4 === 0 ? 226 : 220} stroke={color.lineHi} />
          ))}
        </g>
        <text x="310" y="244" fontFamily={font.mono} fontSize="9" letterSpacing="0.16em" fill={color.textMute} textAnchor="middle">
          LONG, SLOW, POWER-HUNGRY
        </text>

        {/* pulses */}
        {Array.from({ length: 5 }, (_, i) => (
          <rect key={i} className="pulse" width="10" height="3" rx="1" fill={color.accentHi} filter={`url(#${ID}-glow)`} opacity="0" />
        ))}

        {/* compute block */}
        <g className="block">
          <rect className="draw" x="440" y="96" width="152" height="168" fill={color.bg2} stroke={color.silver} strokeWidth={stroke.thin} />
          <g className="starve" opacity="0.35">
            <CellField id={`${ID}-cells`} x={452} y={108} w={128} h={120} pitch={8} />
          </g>
          <rect x="452" y="238" width="128" height="4" fill="none" stroke={color.line} strokeWidth={stroke.hair} />
          <rect className="util" x="452" y="238" width="22" height="4" fill={color.amber} filter={`url(#${ID}-glow)`} />
          <text x="516" y="286" fontFamily={font.mono} fontSize="10" letterSpacing="0.16em" fill={color.textDim} textAnchor="middle">
            COMPUTE
          </text>
        </g>

        <Callout x={114} y={96} lx={150} ly={60} label="weights" sub="stored far away" />
        <Callout x={310} y={160} lx={330} ly={60} label="bus" sub="every weight, every time" />
        <Callout x={474} y={240} lx={520} ly={330} label="utilisation" sub="waiting on data" hi />
      </svg>
    </GraphicFrame>
  )
}
