import { Link, Outlet } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import '../styles/landing.css'

const copyrightYear = new Date().getFullYear()

export function MarketingLayout() {
  return (
    <div className="lve-site">
      <div className="lve-page">
        <a className="lve-skip" href="#main">
          Skip to content
        </a>
        <header className="lve-topbar">
          <Link to="/" className="lve-wordmark" aria-label="lve home">
            lve
          </Link>
          <p className="lve-brand-note">
            A PERSONAL REACT STARTER
            <br />
            FOR PEOPLE WHO BUILD THINGS.
          </p>
          <nav aria-label="Main navigation" className="lve-nav">
            <Link to="/examples">Examples</Link>
            <a href="https://github.com/ieuforu/create-lve" target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight aria-hidden="true" />
            </a>
          </nav>
        </header>
        <main id="main" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="lve-footer">
          <div className="lve-footer-signature">
            <Link to="/" className="lve-footer-wordmark" aria-label="lve home">
              lve
            </Link>
            <span aria-hidden="true">—</span>
            <span>Made to make things.</span>
          </div>
          <span>© {copyrightYear} lve</span>
        </footer>
      </div>
    </div>
  )
}
