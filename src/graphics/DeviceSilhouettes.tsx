import { color, font, stroke } from '@/tokens'
import { Callout, GraphicDefs, GraphicFrame, GridUnderlay } from './primitives'
import { drawIn, useGraphic } from './useGraphic'
import { gsap } from '@/lib/gsap'

const W = 760
const H = 320
const ID = 'dev'

function ChipMark({ x, y, s = 18 }: { x: number; y: number; s?: number }) {
  return (
    <g className="chipmark" transform={`translate(${x - s / 2} ${y - s / 2})`}>
      <circle cx={s / 2} cy={s / 2} r={s * 1.3} fill={`url(#${ID}-radial)`} className="chip-glow" />
      <rect width={s} height={s} fill={color.bg0} stroke={color.accentHi} strokeWidth={stroke.hair} />
      <rect x={s * 0.25} y={s * 0.25} width={s * 0.5} height={s * 0.5} fill={color.accent} filter={`url(#${ID}-glow)`} className="chip-core" />
      {[0.2, 0.5, 0.8].map((f) => (
        <g key={f} stroke={color.silver} strokeWidth={stroke.hair}>
          <line x1={s * f} y1={-4} x2={s * f} y2={0} />
          <line x1={s * f} y1={s} x2={s * f} y2={s + 4} />
          <line x1={-4} y1={s * f} x2={0} y2={s * f} />
          <line x1={s} y1={s * f} x2={s + 4} y2={s * f} />
        </g>
      ))}
    </g>
  )
}

/** 1px line-art device silhouettes, each with a glowing chip inside. */
export default function DeviceSilhouettes({ play }: { play: boolean }) {
  const ref = useGraphic(play, ({ tl, q, reduced }) => {
    drawIn(tl, q('.draw'), 1.4, 0.05, 0)
    tl.from(q('.chipmark'), { opacity: 0, scale: 0.6, transformOrigin: 'center', duration: 0.7, stagger: 0.18 }, 0.9)
    tl.from(q('.label'), { opacity: 0, duration: 0.5, stagger: 0.12 }, 1.3)
    tl.from(q('.callout'), { opacity: 0, duration: 0.5 }, 1.8)
    if (reduced) return
    gsap.to(q('.chip-core'), { opacity: 0.5, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.4 })
  })
  const line = { fill: 'none', stroke: color.silver, strokeWidth: stroke.thin } as const
  return (
    <GraphicFrame tag={<>fig 05 · <b>where it goes</b></>} aspect={`${W}/${H}`} label="Line drawings of a laptop, a phone, an edge camera and an embedded board, each containing a glowing chip">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`}>
        <GraphicDefs id={ID} />
        <GridUnderlay id={ID} w={W} h={H} />

        {/* laptop */}
        <g transform="translate(40 80)">
          <path className="draw" d="M30 10 h150 a4 4 0 0 1 4 4 v96 h-158 v-96 a4 4 0 0 1 4 -4 z" {...line} />
          <path className="draw" d="M10 112 h194 l-8 14 h-178 z" {...line} />
          <rect className="draw" x="38" y="20" width="134" height="78" {...line} stroke={color.line} />
          <ChipMark x={105} y={60} />
          <text className="label" x="107" y="160" textAnchor="middle" fontFamily={font.mono} fontSize="10" letterSpacing="0.18em" fill={color.text}>
            LAPTOP
          </text>
          <text className="label" x="107" y="174" textAnchor="middle" fontFamily={font.mono} fontSize="9" letterSpacing="0.14em" fill={color.textMute}>
            ALWAYS-ON VISION
          </text>
        </g>

        {/* phone */}
        <g transform="translate(300 60)">
          <rect className="draw" x="10" y="0" width="76" height="150" rx="10" {...line} />
          <rect className="draw" x="16" y="10" width="64" height="130" rx="6" {...line} stroke={color.line} />
          <line className="draw" x1="38" y1="5" x2="58" y2="5" stroke={color.line} strokeWidth={stroke.hair} />
          <ChipMark x={48} y={78} s={16} />
          <text className="label" x="48" y="180" textAnchor="middle" fontFamily={font.mono} fontSize="10" letterSpacing="0.18em" fill={color.text}>
            PHONE
          </text>
          <text className="label" x="48" y="194" textAnchor="middle" fontFamily={font.mono} fontSize="9" letterSpacing="0.14em" fill={color.textMute}>
            PRIVATE BY DEFAULT
          </text>
        </g>

        {/* edge camera */}
        <g transform="translate(440 70)">
          <rect className="draw" x="0" y="30" width="110" height="70" rx="4" {...line} />
          <circle className="draw" cx="80" cy="65" r="20" {...line} />
          <circle className="draw" cx="80" cy="65" r="9" {...line} stroke={color.line} />
          <path className="draw" d="M20 30 v-14 h30 v14" {...line} stroke={color.line} />
          <ChipMark x={34} y={65} s={16} />
          <text className="label" x="55" y="170" textAnchor="middle" fontFamily={font.mono} fontSize="10" letterSpacing="0.18em" fill={color.text}>
            EDGE
          </text>
          <text className="label" x="55" y="184" textAnchor="middle" fontFamily={font.mono} fontSize="9" letterSpacing="0.14em" fill={color.textMute}>
            NO ROUND TRIP
          </text>
        </g>

        {/* embedded board */}
        <g transform="translate(590 70)">
          <rect className="draw" x="0" y="20" width="130" height="90" {...line} />
          {[12, 24, 36, 48].map((y) => (
            <line key={y} className="draw" x1="8" y1={20 + y} x2="40" y2={20 + y} stroke={color.line} strokeWidth={stroke.hair} />
          ))}
          <rect className="draw" x="96" y="36" width="24" height="58" {...line} stroke={color.line} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} className="draw" cx="108" cy={44 + i * 9} r="2" {...line} stroke={color.line} />
          ))}
          <ChipMark x={66} y={65} s={20} />
          <text className="label" x="65" y="170" textAnchor="middle" fontFamily={font.mono} fontSize="10" letterSpacing="0.18em" fill={color.text}>
            EMBEDDED
          </text>
          <text className="label" x="65" y="184" textAnchor="middle" fontFamily={font.mono} fontSize="9" letterSpacing="0.14em" fill={color.textMute}>
            MILLIWATTS
          </text>
        </g>

        <Callout x={145} y={140} lx={200} ly={290} label="one frozen model" sub="same chip, same behaviour, every unit" hi />
      </svg>
    </GraphicFrame>
  )
}
