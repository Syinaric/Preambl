import { color, font, stroke } from '@/tokens'
import { Callout, CellField, GraphicDefs, GraphicFrame, GridUnderlay } from './primitives'
import { drawIn, pulseAlong, useGraphic } from './useGraphic'
import { gsap } from '@/lib/gsap'

const W = 760
const H = 340
const ID = 'flow'

const STAGES = [
  { label: 'CONV', w: 70 },
  { label: 'POOL', w: 40 },
  { label: 'CONV', w: 70 },
  { label: 'POOL', w: 40 },
  { label: 'DENSE', w: 56 },
]

/**
 * How data flows through the CNN chip: an image enters, passes through
 * layer stages drawn as glowing regions on the die, a classification exits.
 * Conceptual stages only — not a circuit diagram.
 */
export default function DataFlow({ play }: { play: boolean }) {
  const ref = useGraphic(play, ({ tl, q, reduced }) => {
    drawIn(tl, q('.draw'), 1.2, 0.04, 0)
    tl.from(q('.stage'), { opacity: 0, duration: 0.6, stagger: 0.16 }, 0.6)
    tl.from(q('.px'), { opacity: 0, duration: 0.3, stagger: { each: 0.01, from: 'random' } }, 0.4)
    tl.from(q('.bar'), { scaleX: 0, transformOrigin: 'left center', duration: 0.9, stagger: 0.08 }, 1.6)
    tl.from(q('.callout'), { opacity: 0, duration: 0.5 }, 1.9)
    if (reduced) return
    const flow = q('.flow')[0]
    q('.pulse').forEach((d, i) => pulseAlong(d, flow, 3.4, i * 0.85))
    q('.stage-fill').forEach((s, i) => gsap.to(s, { opacity: 0.7, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.25 }))
  })

  let x = 250
  const stages = STAGES.map((s) => {
    const o = { ...s, x }
    x += s.w + 18
    return o
  })
  const px: { x: number; y: number; v: number }[] = []
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) px.push({ x: 60 + c * 11, y: 120 + r * 11, v: ((r * 13 + c * 7) % 10) / 10 })

  return (
    <GraphicFrame tag={<>fig 06 · <b>data flow</b> · conceptual</>} aspect={`${W}/${H}`} label="An image enters the chip, passes through convolution, pooling and dense stages drawn on the die, and a classification comes out">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} style={{ color: color.accentHi }}>
        <GraphicDefs id={ID} />
        <GridUnderlay id={ID} w={W} h={H} />

        {/* input image */}
        <rect className="draw" x="56" y="116" width="96" height="96" fill={color.bg2} stroke={color.silver} strokeWidth={stroke.thin} />
        {px.map((p, i) => (
          <rect key={i} className="px" x={p.x} y={p.y} width="8" height="8" fill={color.silverHi} opacity={0.15 + p.v * 0.7} />
        ))}
        <text x="104" y="232" textAnchor="middle" fontFamily={font.mono} fontSize="10" letterSpacing="0.16em" fill={color.textDim}>
          IMAGE IN
        </text>

        {/* die with stages */}
        <rect className="draw" x="230" y="70" width="330" height="190" fill={color.bg2} stroke={color.silverHi} strokeWidth={stroke.thin} />
        <rect className="draw" x="238" y="78" width="314" height="174" fill="none" stroke={color.line} strokeWidth={stroke.hair} />
        <g opacity="0.35">
          <CellField id={`${ID}-cells`} x={240} y={80} w={310} h={170} pitch={6} opacity={0.5} />
        </g>
        {stages.map((s, i) => (
          <g key={i} className="stage">
            <rect className="stage-fill" x={s.x} y="100" width={s.w} height="130" fill={color.accent} opacity="0.28" filter={`url(#${ID}-glow)`} />
            <rect x={s.x} y="100" width={s.w} height="130" fill="none" stroke={color.accentHi} strokeWidth={stroke.hair} />
            <text x={s.x + s.w / 2} y="94" textAnchor="middle" fontFamily={font.mono} fontSize="9" letterSpacing="0.16em" fill={color.text}>
              {s.label}
            </text>
            {Array.from({ length: Math.max(2, Math.round(s.w / 14)) }, (_, k) => (
              <line key={k} x1={s.x + 8 + k * 14} y1="108" x2={s.x + 8 + k * 14} y2="222" stroke={color.core} strokeWidth={stroke.hair} opacity="0.25" />
            ))}
          </g>
        ))}
        <text x="395" y="248" textAnchor="middle" fontFamily={font.mono} fontSize="9" letterSpacing="0.18em" fill={color.textMute}>
          WEIGHTS LIVE HERE · NOTHING FETCHED
        </text>

        {/* flow path */}
        <path className="flow draw" d="M152 164 H230 M230 164 H560 M560 164 H600" fill="none" stroke={color.lineHi} strokeWidth={stroke.hair} />
        {Array.from({ length: 4 }, (_, i) => (
          <circle key={i} className="pulse" r="3" fill={i % 2 ? color.amber : color.core} filter={`url(#${ID}-glow)`} opacity="0" />
        ))}

        {/* output classification */}
        <g transform="translate(600 118)">
          <rect className="draw" x="0" y="0" width="130" height="92" fill={color.bg2} stroke={color.silver} strokeWidth={stroke.thin} />
          {[
            ['CLASS A', 0.86, true],
            ['CLASS B', 0.3, false],
            ['CLASS C', 0.12, false],
          ].map(([l, v, hi], i) => (
            <g key={i} transform={`translate(10 ${14 + i * 24})`}>
              <text x="0" y="8" fontFamily={font.mono} fontSize="8" letterSpacing="0.14em" fill={hi ? color.amber : color.textMute}>
                {l as string}
              </text>
              <rect x="50" y="2" width="60" height="4" fill="none" stroke={color.line} strokeWidth={stroke.hair} />
              <rect className="bar" x="50" y="2" width={60 * (v as number)} height="4" fill={hi ? color.amber : color.accent} filter={`url(#${ID}-glow)`} />
            </g>
          ))}
          <text x="65" y="110" textAnchor="middle" fontFamily={font.mono} fontSize="10" letterSpacing="0.16em" fill={color.textDim}>
            RESULT OUT
          </text>
        </g>

        <Callout x={104} y={116} lx={150} ly={50} label="input" sub="camera frame" />
        <Callout x={395} y={70} lx={470} ly={40} label="layers" sub="fixed in silicon" hi />
        <Callout x={665} y={118} lx={640} ly={60} label="classification" sub="on-chip, no memory bus" anchor="end" />
      </svg>
    </GraphicFrame>
  )
}
