import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { heroProgress } from '@/lib/progressStore'
import { scrollToTarget } from '@/lib/lenis'
import { openContact } from './contact'
import ContactModal from './ContactModal'
import './Nav.css'

export function Wordmark({ className = '' }: { className?: string }) {
  // TODO(logo): swap the text wordmark for the logo SVG once it exists.
  return (
    <Link to="/" className={`wordmark ${className}`} aria-label="Preambl home">
      <span className="wordmark__mark" aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="wordmark__text">Preambl</span>
    </Link>
  )
}

export default function Nav() {
  const location = useLocation()
  const navigate = useNavigate()
  const onHome = location.pathname === '/'
  const [dim, setDim] = useState(onHome && heroProgress.value < 0.98)

  useEffect(() => {
    setDim(onHome && heroProgress.value < 0.98)
    return heroProgress.subscribe((v) => setDim(onHome && v < 0.98))
  }, [onHome])

  const goTechnology = (e: MouseEvent) => {
    e.preventDefault()
    if (!onHome) {
      navigate('/#technology')
      return
    }
    scrollToTarget('#technology', -24)
  }

  return (
    <>
      <header className={`nav ${dim ? 'nav--dim' : ''}`}>
        <Wordmark />
        <nav className="nav__links" aria-label="Primary">
          <a href="/#technology" onClick={goTechnology} className="nav__link">
            Technology
          </a>
          <Link to="/products" className={`nav__link ${location.pathname.startsWith('/products') ? 'is-active' : ''}`}>
            Products
          </Link>
          <button className="nav__cta" onClick={() => openContact()}>
            Contact
          </button>
        </nav>
      </header>
      <ContactModal />
    </>
  )
}
