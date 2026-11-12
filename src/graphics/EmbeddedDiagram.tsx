import { color, font, stroke } from '@/tokens'
import { Callout, CellField, GraphicDefs, GraphicFrame, GridUnderlay } from './primitives'
import { drawIn, pulseAlong, useGraphic } from './useGraphic'
import { gsap } from '@/lib/gsap'

const W = 640
const H = 360
const ID = 'em'

/**
 * The same diagram, after Preambl: the memory block dissolves, the bus
 * retracts, and the weights appear inside the compute fabric, which lights
 * up at once. Concept only — nothing here describes a method.
 */
export default function EmbeddedDiagram({ play }: { play: boolean }) {
  const ref = useGraphic(play, ({ tl, q, reduced }) => {
    drawIn(tl, q('.draw'), 0.9, 0.05, 0)
    // memory dissolves, bus retracts
    tl.to(q('.memory'), { opacity: 0, scale: 0.92, transformOrigin: 'center', duration: 1.1, ease: 'power2.inOut' }, 0.8)
    tl.to(q('.bus'), { strokeDashoffset: (_i, el) => (el as SVGGeometryElement).getTotalLength(), duration: 0.9, ease: 'power2.in' }, 0.9)
    tl.to(q('.ghost'), { opacity: 1, duration: 0.8 }, 1.6)
    // the fabric powers on in a radial front
    tl.fromTo(q('.reveal'), { attr: { r: 0 } }, { attr: { r: 170 }, duration: 1.3, ease: 'power2.out' }, 1.5)
    tl.fromTo(q('.fabric'), { opacity: 0.2 }, { opacity: 1, duration: 0.6 }, 1.5)
    tl.from(q('.wmark'), { opacity: 0, scale: 0.6, transformOrigin: 'center', duration: 0.5, stagger: { each: 0.02, from: 'center' } }, 1.7)
    tl.to(q('.util'), { scaleX: 1, transformOrigin: 'left center', duration: 1.0, ease: 'power3.out' }, 1.9)
    tl.from(q('.callout'), { opacity: 0, y: 6, duration: 0.6, stagger: 0.12 }, 2.2)
    if (reduced) return
    const traces = q('.trace')
    q('.pulse').forEach((dot, i) => pulseAlong(dot, traces[i % traces.length], 1.6 + (i % 3) * 0.3, 2.4 + i * 0.35))
    gsap.to(q('.wmark'), { opacity: 0.55, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: { each: 0.03, from: 'random' }, delay: 3 })
  })

  const marks: { x: number; y: number }[] = []
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) marks.push({ x: 262 + c * 20, y: 126 + r * 22 })

  return (
    <GraphicFrame tag={<>fig 02 · <b>weights in the silicon</b></>} aspect={`${W}/${H}`} label="Diagram where external memory disappears and weights appear embedded inside the compute fabric, which lights up">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} style={{ color: color.accentHi }}>
        <GraphicDefs id={ID} />
        <GridUnderlay id={ID} w={W} h={H} />
        <clipPath id={`${ID}-clip`}>
          <circle className="reveal" cx="320" cy="180" r="0" />
        </clipPath>

        {/* memory block (dissolves) */}
        <g className="memory">
          <rect className="draw" x="48" y="96" width="112" height="168" fill={color.bg2} stroke={color.silver} strokeWidth={stroke.thin} />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x="60" y={110 + i * 18} width="88" height="10" fill="none" stroke={color.line} strokeWidth={stroke.hair} />
          ))}
          <text x="104" y="286" fontFamily={font.mono} fontSize="10" letterSpacing="0.16em" fill={color.textDim} textAnchor="middle">
            MEMORY
          </text>
        </g>
        <g className="ghost" opacity="0">
          <rect x="48" y="96" width="112" height="168" fill="none" stroke={color.line} strokeWidth={stroke.hair} strokeDasharray="3 5" />
          <text x="104" y="190" fontFamily={font.mono} fontSize="9" letterSpacing="0.14em" fill={color.textMute} textAnchor="middle">
            NONE
          </text>
        </g>
        <g fill="none" stroke={color.line} strokeWidth={stroke.hair}>
          <path className="bus draw" d="M160 170 H230" />
          <path className="bus draw" d="M160 190 H230" />
        </g>

        {/* compute fabric, now with weights inside */}
        <g className="fabric">
          <rect className="draw" x="230" y="84" width="180" height="192" fill={color.bg2} stroke={color.silverHi} strokeWidth={stroke.thin} />
          <g clipPath={`url(#${ID}-clip)`}>
            <rect x="230" y="84" width="180" height="192" fill={`url(#${ID}-radial)`} />
            <CellField id={`${ID}-cells`} x={240} y={94} w={160} h={150} pitch={7} opacity={0.75} />
            {/* internal traces */}
            <g fill="none" stroke={color.accent} strokeWidth={stroke.hair} opacity="0.7">
              <path className="trace" d="M240 112 H400" />
              <path className="trace" d="M240 156 H400" />
              <path className="trace" d="M240 200 H400" />
              <path className="trace" d="M240 236 H400" />
              <path className="trace" d="M300 94 V244" />
              <path className="trace" d="M360 94 V244" />
            </g>
            {/* embedded weights */}
            {marks.map((m, i) => (
              <rect key={i} className="wmark" x={m.x - 4} y={m.y - 4} width="8" height="8" fill={i % 7 === 0 ? color.amber : color.accentHi} filter={`url(#${ID}-glow)`} />
            ))}
          </g>
          <rect x="240" y="254" width="160" height="4" fill="none" stroke={color.line} strokeWidth={stroke.hair} />
          <rect className="util" x="240" y="254" width="160" height="4" fill={color.amber} filter={`url(#${ID}-glow)`} style={{ transform: 'scaleX(0.1)' }} />
          <text x="320" y="298" fontFamily={font.mono} fontSize="10" letterSpacing="0.16em" fill={color.textDim} textAnchor="middle">
            COMPUTE · WEIGHTS INSIDE
          </text>
        </g>

        {Array.from({ length: 6 }, (_, i) => (
          <circle key={i} className="pulse" r="2.2" fill={color.core} filter={`url(#${ID}-glow)`} opacity="0" />
        ))}

        {/* output */}
        <g fill="none" stroke={color.line} strokeWidth={stroke.hair}>
          <path className="draw" d="M410 180 H470" />
          <path className="draw" d="M470 180 l-6 -4 v8 z" fill={color.accentHi} stroke="none" />
        </g>
        <text x="540" y="184" fontFamily={font.mono} fontSize="10" letterSpacing="0.16em" fill={color.text} textAnchor="middle">
          RESULT
        </text>
        <text x="540" y="200" fontFamily={font.mono} fontSize="9" letterSpacing="0.14em" fill={color.textMute} textAnchor="middle">
          IMMEDIATELY
        </text>

        <Callout x={104} y={96} lx={150} ly={56} label="external memory" sub="removed" />
        <Callout x={338} y={142} lx={450} ly={56} label="weights" sub="live in the silicon" hi />
        <Callout x={400} y={256} lx={500} ly={330} label="utilisation" sub="never waits" hi />
      </svg>
    </GraphicFrame>
  )
}
