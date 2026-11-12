import { useState, type ReactNode } from 'react'
import { useReveal } from '@/lib/useReveal'

interface Props {
  id?: string
  index: string
  eyebrow: string
  title: ReactNode
  children: ReactNode
  /** Graphic renderer; receives `play` once the section has entered. */
  graphic: (play: boolean) => ReactNode
  reverse?: boolean
}

/** One educational section: index, eyebrow, headline, copy, and a graphic. */
export default function Section({ id, index, eyebrow, title, children, graphic, reverse }: Props) {
  const [play, setPlay] = useState(false)
  const ref = useReveal<HTMLElement>(() => setPlay(true))
  return (
    <section id={id} ref={ref} className="section">
      <div className={`container section-grid ${reverse ? 'reverse' : ''}`}>
        <div className="copy">
          <span className="mono reveal">{index}</span>
          <span className="eyebrow reveal">{eyebrow}</span>
          <h2 className="h1 reveal">{title}</h2>
          {children}
        </div>
        <div className="reveal">{graphic(play)}</div>
      </div>
    </section>
  )
}
