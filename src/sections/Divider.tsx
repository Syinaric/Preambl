import { useState } from 'react'
import { color, stroke } from '@/tokens'
import { useReveal } from '@/lib/useReveal'
import { drawIn, pulseAlong, useGraphic } from '@/graphics/useGraphic'
import './Divider.css'

/**
 * A thin glowing trace between sections that "carries the current" from the
 * hero chip down the page. Draws in on entry, then pulses travel it forever.
 */
export default function Divider({ variant = 0 }: { variant?: 0 | 1 | 2 }) {
  const [play, setPlay] = useState(false)
  const host = useReveal<HTMLDivElement>(() => setPlay(true), 'top 90%')
  const svg = useGraphic(play, ({ tl, q, reduced }) => {
    drawIn(tl, q('.draw'), 1.2, 0.1)
    tl.from(q('.node'), { opacity: 0, scale: 0, transformOrigin: 'center', duration: 0.5, stagger: 0.1 }, 0.6)
    if (reduced) return
    const main = q('.main')[0]
    pulseAlong(q('.pulse')[0], main, 2.6, 0.5)
    pulseAlong(q('.pulse')[1], main, 2.6, 1.8)
  })

  const paths = [
    { main: 'M60 0 V50 H84 V140', branch: 'M60 50 H36 V96', nodes: [[60, 50], [84, 140], [36, 96]] },
    { main: 'M60 0 V40 H40 V140', branch: 'M40 90 H82 V120', nodes: [[60, 40], [40, 140], [82, 120]] },
    { main: 'M60 0 V140', branch: 'M60 70 H90 V110 M60 70 H30 V96', nodes: [[60, 70], [90, 110], [30, 96]] },
  ][variant]

  return (
    <div ref={host} className="divider" aria-hidden>
      <svg ref={svg} viewBox="0 0 120 140" width="120" height="140">
        <defs>
          <filter id={`dv${variant}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path className="main draw" d={paths.main} fill="none" stroke={color.lineHi} strokeWidth={stroke.hair} />
        <path className="draw" d={paths.branch} fill="none" stroke={color.line} strokeWidth={stroke.hair} />
        {paths.nodes.map(([x, y], i) => (
          <rect key={i} className="node" x={x - 2} y={y - 2} width="4" height="4" fill={i === 0 ? color.amber : color.accent} filter={`url(#dv${variant}-glow)`} />
        ))}
        <circle className="pulse" r="2.2" fill={color.core} filter={`url(#dv${variant}-glow)`} opacity="0" />
        <circle className="pulse" r="1.6" fill={color.accentHi} filter={`url(#dv${variant}-glow)`} opacity="0" />
      </svg>
    </div>
  )
}
