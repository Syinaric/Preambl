import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { products, type Product } from '@/data/products'
import ChipScene from '@/scene/ChipScene'
import { useIsMobile, usePrefersReducedMotion, useWebGL } from '@/lib/hooks'
import { useReveal } from '@/lib/useReveal'
import Button from '@/components/Button'
import { openContact } from '@/components/contact'
import DataFlow from '@/graphics/DataFlow'
import './Products.css'

const powered = () => 1

const STATUS: Record<Product['status'], string> = {
  'in-development': 'In development',
  sampling: 'Sampling',
  production: 'In production',
}

function ProductHero({ p }: { p: Product }) {
  const mobile = useIsMobile()
  const reduced = usePrefersReducedMotion()
  const webgl = useWebGL()
  const host = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)
  const ref = useReveal<HTMLElement>()

  useEffect(() => {
    const el = host.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className="phero">
      <div ref={host} className="phero__scene">
        {webgl ? (
          <ChipScene progress={powered} params={{ ...p.die, hum: reduced ? 0.3 : p.die.hum }} mobile={mobile} active={active} orbit cameraRig={false} dof={false} micro={false} />
        ) : (
          <div className="hero__fallback">
            <img src="/fallback/chip-final.png" alt={`${p.name} chip render`} />
          </div>
        )}
        <span className="phero__hint mono">drag to orbit</span>
        <span className="phero__hud phero__hud--tl mono">
          {p.family.toUpperCase()} · {STATUS[p.status].toUpperCase()}
        </span>
      </div>
      <div className="container phero__copy">
        <span className="eyebrow reveal">{p.family}</span>
        <h1 className="display phero__name reveal">{p.name}</h1>
        <p className="lead reveal">{p.tagline}</p>
        <div className="phero__actions reveal">
          <Button onClick={() => openContact('early-access')}>Request early access</Button>
          <Button variant="ghost" onClick={() => openContact('sales')}>
            Contact sales
          </Button>
        </div>
      </div>
    </section>
  )
}

function ProductDetail({ p }: { p: Product }) {
  const [play, setPlay] = useState(false)
  const flow = useReveal<HTMLElement>(() => setPlay(true))
  const about = useReveal<HTMLElement>()
  return (
    <>
      <ProductHero p={p} />

      <section ref={about} className="section">
        <div className="container section-grid">
          <div className="copy">
            <span className="eyebrow reveal">What it does</span>
            <h2 className="h1 reveal">Vision inference. Fully on-chip.</h2>
            {p.description.map((d, i) => (
              <p key={i} className={`${i === 0 ? 'lead' : 'body'} reveal`}>
                {d}
              </p>
            ))}
          </div>
          <div className="usecases reveal">
            <span className="mono">Suited to</span>
            <ul>
              {p.useCases.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section ref={flow} className="section">
        <div className="container">
          <div className="copy" style={{ marginBottom: 40 }}>
            <span className="eyebrow reveal">How data flows</span>
            <h2 className="h1 reveal">In: an image. Out: an answer.</h2>
            <p className="body reveal">
              A frame enters the chip and passes through the network's layers, each one a region of the die whose weights are fixed in place. No layer waits for its weights to arrive. The classification comes out the other side.
            </p>
          </div>
          <div className="reveal">
            <DataFlow play={play} />
          </div>
        </div>
      </section>

    </>
  )
}

function ProductGrid() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="section" style={{ paddingTop: 160 }}>
      <div className="container">
        <span className="eyebrow reveal">Products</span>
        <h1 className="h1 reveal" style={{ marginTop: 16, marginBottom: 48 }}>
          Models, cast in silicon.
        </h1>
        <div className="pgrid">
          {products.map((p) => (
            <Link key={p.slug} to={`/products#${p.slug}`} className="pcard reveal">
              <span className="mono">
                {p.family} · {STATUS[p.status]}
              </span>
              <span className="h2">{p.name}</span>
              <span className="body">{p.tagline}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Products() {
  return (
    <main>
      {products.length > 1 ? <ProductGrid /> : null}
      {products.map((p) => (
        <div key={p.slug} id={p.slug}>
          <ProductDetail p={p} />
        </div>
      ))}
    </main>
  )
}
