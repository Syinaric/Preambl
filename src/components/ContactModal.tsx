import { useEffect, useState } from 'react'
import Button from './Button'
import { CONTACT_EVENT } from './contact'
import './ContactModal.css'

const CONTACT_EMAIL = 'm59arora@uwaterloo.ca'

/**
 * Contact is under construction: for now the modal simply shows the
 * co-founder's email. TODO(contact-handler): replace with a real form + endpoint.
 */
export default function ContactModal() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onOpen = () => {
      setCopied(false)
      setOpen(true)
    }
    window.addEventListener(CONTACT_EVENT, onOpen)
    return () => window.removeEventListener(CONTACT_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
    } catch {
      /* clipboard unavailable: the mailto link still works */
    }
  }

  if (!open) return null
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="contact-title" data-lenis-prevent>
      <button className="modal__backdrop" aria-label="Close" onClick={() => setOpen(false)} />
      <div className="modal__panel">
        <span className="modal__corner tl" />
        <span className="modal__corner br" />
        <div className="modal__head">
          <span className="mono mono-hi">// contact</span>
          <button className="modal__close mono" onClick={() => setOpen(false)}>
            close ×
          </button>
        </div>
        <div className="modal__sent">
          <span className="mono">Under construction</span>
          <h3 id="contact-title" className="h2">
            This page is still being built.
          </h3>
          <p className="body">In the meantime, here is the co-founder's email. We read everything.</p>
          <a className="modal__email" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          <div className="modal__actions">
            <Button href={`mailto:${CONTACT_EMAIL}`}>Email us</Button>
            <Button variant="ghost" onClick={copy}>
              {copied ? 'Copied' : 'Copy address'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
