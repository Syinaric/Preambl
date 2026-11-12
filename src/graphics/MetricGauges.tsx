import { color, font, stroke } from '@/tokens'
import { GraphicDefs } from './primitives'
import { useGraphic } from './useGraphic'
import { gsap } from '@/lib/gsap'
import './MetricGauges.css'

/**
 * Instrument-style readouts. The arc levels are ILLUSTRATIVE ONLY.
 * TODO(real-data): replace `level` and `value` with measured figures and
 * remove the "illustrative" tag before launch. No performance numbers are
 * claimed here.
 */
const METRICS = [
  { key: 'latency', label: 'Latency', unit: 'per inference', value: 'TBD', level: 0.86, note: 'no weight fetch in the loop' },
  { key: 'energy', label: 'Energy', unit: 'per inference', value: 'TBD', level: 0.9, note: 'moving data is the cost' },
  { key: 'cost', label: 'Cost', unit: 'at scale', value: 'TBD', level: 0.72, note: 'no external memory to buy' },
  { key: 'privacy', label: 'Privacy', unit: 'on-device', value: '100%', level: 1, note: 'nothing leaves the device' },
]

const R = 54
const C = 2 * Math.PI * R
const SWEEP = 0.75 // fraction of the circle used by the gauge

function Gauge({ m, i }: { m: (typeof METRICS)[number]; i: number }) {
  const id = `g-${m.key}`
  const ref = useGraphic(true, ({ tl, q, reduced }) => {
    const arc = q('.arc')[0]
    gsap.set(arc, { strokeDasharray: `${C * SWEEP * m.level} ${C}` })
    tl.from(arc, { strokeDasharray: `0 ${C}`, duration: 1.4, ease: 'power3.out', delay: 0.15 * i })
    tl.from(q('.needle'), { rotate: -135, transformOrigin: '80px 80px', duration: 1.4, ease: 'power3.out' }, '<')
    tl.from(q('.readout'), { opacity: 0, duration: 0.5 }, '-=0.6')
    if (reduced) return
    gsap.to(q('.needle'), { rotate: '+=1.5', duration: 1.6 + i * 0.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.6 })
  })
  const angle = -135 + 270 * m.level
  return (
    <div className="gauge">
      <svg ref={ref} viewBox="0 0 160 130">
        <GraphicDefs id={id} />
        <rect width="160" height="130" fill={`url(#${id}-grid)`} />
        <g transform="translate(0 0)">
          <circle cx="80" cy="80" r={R} fill="none" stroke={color.line} strokeWidth={stroke.hair} strokeDasharray={`${C * SWEEP} ${C}`} transform="rotate(135 80 80)" />
          {Array.from({ length: 19 }, (_, k) => {
            const a = ((-135 + k * 15) * Math.PI) / 180
            const r1 = R + 6
            const r2 = k % 3 === 0 ? R + 13 : R + 9
            return <line key={k} x1={80 + Math.sin(a) * r1} y1={80 - Math.cos(a) * r1} x2={80 + Math.sin(a) * r2} y2={80 - Math.cos(a) * r2} stroke={k % 3 === 0 ? color.lineHi : color.line} strokeWidth={stroke.hair} />
          })}
          <circle className="arc" cx="80" cy="80" r={R} fill="none" stroke={m.key === 'privacy' ? color.amber : color.accent} strokeWidth="2.5" strokeLinecap="butt" transform="rotate(135 80 80)" filter={`url(#${id}-glow)`} />
          <g className="needle" style={{ transform: `rotate(${angle}deg)`, transformOrigin: '80px 80px' }}>
            <line x1="80" y1="80" x2="80" y2={80 - R + 8} stroke={color.core} strokeWidth="1.5" filter={`url(#${id}-glow)`} />
          </g>
          <circle cx="80" cy="80" r="3" fill={color.bg0} stroke={color.silverHi} strokeWidth="1" />
          <text className="readout" x="80" y="112" textAnchor="middle" fontFamily={font.mono} fontSize="14" fill={color.text} letterSpacing="0.06em">
            {m.value}
          </text>
          <text x="80" y="124" textAnchor="middle" fontFamily={font.mono} fontSize="8" fill={color.textMute} letterSpacing="0.16em">
            {m.unit.toUpperCase()}
          </text>
        </g>
      </svg>
      <div className="gauge__meta">
        <span className="gauge__label">{m.label}</span>
        <span className="mono">{m.note}</span>
      </div>
    </div>
  )
}

export default function MetricGauges({ play }: { play: boolean }) {
  return (
    <div className="gauges graphic" role="img" aria-label="Four instrument gauges for latency, energy, cost and privacy; values to be published">
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
      <span className="tag">
        fig 03 · <b>readouts</b> · illustrative, values TBD
      </span>
      <div className="gauges__row">{play ? METRICS.map((m, i) => <Gauge key={m.key} m={m} i={i} />) : METRICS.map((m) => <div key={m.key} className="gauge gauge--pending" />)}</div>
    </div>
  )
}
