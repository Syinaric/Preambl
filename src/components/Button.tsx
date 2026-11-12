import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './Button.css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  to?: string
  href?: string
  children: ReactNode
}

export default function Button({ variant = 'primary', to, href, children, className = '', ...rest }: Props) {
  const cls = `btn btn--${variant} ${className}`
  const inner = (
    <>
      <span className="btn__corner btn__corner--tl" />
      <span className="btn__corner btn__corner--br" />
      <span className="btn__label">{children}</span>
      <span className="btn__arrow" aria-hidden>
        →
      </span>
    </>
  )
  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    )
  if (href)
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    )
  return (
    <button type="button" className={cls} {...rest}>
      {inner}
    </button>
  )
}
