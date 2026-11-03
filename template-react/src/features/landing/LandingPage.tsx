import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { buttonVariants } from '#/components/ui/button'
import './landing.css'

const flow = [
  {
    index: '01',
    title: 'Route',
    label: 'MAP / LOAD / GUARD',
    copy: 'Flat route files choose a feature, prepare its data, and then get out of the way.',
    mark: <RouteMark />,
  },
  {
    index: '02',
    title: 'Feature',
    label: 'PAGE / DOMAIN / STATE',
    copy: 'Everything a person sees and does lives with the domain that owns it.',
    mark: <FeatureMark />,
  },
  {
    index: '03',
    title: 'UI',
    label: 'BASE / ACCESSIBLE',
    copy: 'Small owned primitives compose upward. Base UI handles the difficult interaction details.',
    mark: <UiMark />,
  },
  {
    index: '04',
    title: 'Data',
    label: 'QUERY / CACHE / HTTP',
    copy: 'TanStack Query owns server state; the URL owns navigation state; React keeps the rest local.',
    mark: <DataMark />,
  },
] as const

export function LandingPage() {
  return (
    <div className="landing-shell">
      <a className="landing-skip" href="#content">
        Skip to content
      </a>

      <header className="landing-header">
        <a className="landing-brand" href="#top" aria-label="lve home">
          <span className="landing-brand-mark" aria-hidden="true">
            l/
          </span>
          <span>
            LVE
            <small>React starter</small>
          </span>
        </a>

        <nav aria-label="Primary navigation">
          <a href="#flow">Flow</a>
          <a href="#principles">Principles</a>
          <a href="https://github.com/ieuforu/create-lve" target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>
      </header>

      <main id="content">
        <section className="landing-hero" id="top" aria-labelledby="hero-title">
          <div className="landing-kicker">
            <span aria-hidden="true" />
            React 19 / TanStack / Vite
          </div>

          <div className="landing-hero-copy">
            <h1 id="hero-title">
              Make more.
              <em>Carry less.</em>
            </h1>
            <p>
              A deliberate React starting point with one visible direction—from a flat route to the
              feature that owns the work.
            </p>
            <div className="landing-actions">
              <a href="#flow" className={buttonVariants({ size: 'lg' })}>
                See the flow <ArrowDown aria-hidden="true" />
              </a>
              <a
                className="landing-text-link"
                href="https://github.com/ieuforu/create-lve"
                target="_blank"
                rel="noreferrer"
              >
                Read the source <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>

          <HeroMark />
          <p className="landing-margin-note" aria-hidden="true">
            ONE ROUTE
            <br />
            ONE FEATURE
            <br />
            ONE DIRECTION
          </p>
        </section>

        <section className="landing-manifesto" id="principles" aria-labelledby="manifesto-title">
          <FoldMark />
          <div className="landing-manifesto-copy">
            <p className="landing-section-label">A small rule</p>
            <h2 id="manifesto-title">
              “Make the route boring.
              <br /> Let the feature do the work.”
            </h2>
            <p className="landing-signature">
              <PersonMark /> One route. One feature. One direction.
            </p>
          </div>
        </section>

        <section className="landing-flow" id="flow" aria-labelledby="flow-title">
          <div className="landing-section-heading">
            <div>
              <p className="landing-section-label">The application path</p>
              <h2 id="flow-title">A structure you can explain.</h2>
            </div>
            <p>01 / FLOW</p>
          </div>

          <div className="landing-flow-grid">
            {flow.map((step) => (
              <article className="landing-flow-card" key={step.title}>
                <div className="landing-card-meta">
                  <span>{step.label}</span>
                  <span>{step.index}</span>
                </div>
                <div className="landing-card-mark" aria-hidden="true">
                  {step.mark}
                </div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="landing-code-line" aria-label="Application architecture flow">
            <span>request</span>
            <i aria-hidden="true">→</i>
            <strong>route</strong>
            <i aria-hidden="true">→</i>
            <strong>feature</strong>
            <i aria-hidden="true">→</i>
            <span>ui + query</span>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>
          <strong>lve</strong> / less surface, more building.
        </p>
        <p>React · TypeScript · Vite</p>
      </footer>
    </div>
  )
}

function HeroMark() {
  return (
    <svg className="landing-hero-mark" viewBox="0 0 420 420" fill="none" aria-hidden="true">
      <path d="M58 76c92-44 208-44 303 0M69 80l35 258M113 65l45 281M170 55l35 305M229 54l-6 310M286 62l-33 288M341 80l-68 253" />
      <path d="M61 78l109-23 59-1 112 26M104 338l54 8 47 14 18 4 30-14 20-17" />
      <path d="M104 338l66-283M158 346l71-292M205 360l81-298M223 364l118-284" />
    </svg>
  )
}

function FoldMark() {
  return (
    <svg className="landing-fold-mark" viewBox="0 0 300 240" fill="none" aria-hidden="true">
      <path d="M22 53 145 16l129 38M24 56l3 137 49-23 43 29 31-25 40 31 38-35 44 22V55" />
      <path d="m76 40 1 130M119 29v170M150 17v157M190 29v176M228 40v130" />
      <path d="m27 193 49-153 43 159L150 17l40 188L228 40l44 152" />
    </svg>
  )
}

function PersonMark() {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="9" r="7" />
      <path d="M11 42c2-12 7-19 11-19s9 7 11 19M6 33l16-10 16 10" />
    </svg>
  )
}

function RouteMark() {
  return (
    <svg viewBox="0 0 96 96" fill="none">
      <circle cx="19" cy="21" r="7" />
      <circle cx="76" cy="48" r="7" />
      <circle cx="27" cy="77" r="7" />
      <path d="M26 23c30 0 43 7 43 19M70 55C59 70 48 76 34 77" />
    </svg>
  )
}

function FeatureMark() {
  return (
    <svg viewBox="0 0 96 96" fill="none">
      <path d="M15 21h28v24H15zM53 21h28v54H53zM15 55h28v20H15z" />
      <path d="M22 29h14M60 29h14M60 37h10M22 63h11" />
    </svg>
  )
}

function UiMark() {
  return (
    <svg viewBox="0 0 96 96" fill="none">
      <path d="M17 20h62v56H17z" />
      <path d="M17 34h62M27 25h1M36 25h1M45 25h1" />
      <path d="M27 45h21v17H27zM57 45h12M57 53h12M57 61h8" />
    </svg>
  )
}

function DataMark() {
  return (
    <svg viewBox="0 0 96 96" fill="none">
      <ellipse cx="48" cy="23" rx="29" ry="11" />
      <path d="M19 23v24c0 6 13 11 29 11s29-5 29-11V23" />
      <path d="M19 47v24c0 6 13 11 29 11s29-5 29-11V47" />
    </svg>
  )
}
