import Button from '@/components/Button'
import { openContact } from '@/components/contact'
import { useReveal } from '@/lib/useReveal'
import './ClosingCTA.css'

export default function ClosingCTA() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="cta section">
      <div className="cta__glow" aria-hidden />
      <div className="container cta__inner">
        <span className="eyebrow reveal">First silicon</span>
        <h2 className="h1 reveal">
          See our first chip.
          <br />
          <span className="cta__dim">A vision model, cast in silicon.</span>
        </h2>
        <div className="cta__actions reveal">
          <Button to="/products">See our first chip</Button>
          <Button variant="ghost" onClick={() => openContact('early-access')}>
            Request early access
          </Button>
        </div>
      </div>
    </section>
  )
}
