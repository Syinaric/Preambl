import { Link } from 'react-router-dom'
import DiePattern from '@/graphics/DiePattern'
import { Wordmark } from './Nav'
import { openContact } from './contact'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__die" aria-hidden>
        <DiePattern />
      </div>
      <div className="container footer__inner">
        <div className="footer__brand">
          <Wordmark />
          <span className="mono">The model is the chip.</span>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <Link to="/#technology">Technology</Link>
          <Link to="/products">Products</Link>
          <button onClick={() => openContact()}>Contact</button>
        </nav>
      </div>
      <div className="container footer__legal mono">
        <span>© {new Date().getFullYear()} Preambl. All rights reserved.</span>
        <span>Weights live in the silicon.</span>
      </div>
    </footer>
  )
}
