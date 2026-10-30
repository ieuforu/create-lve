import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { buttonVariants } from '#/components/ui/button'
import { ProjectPlayground } from './ProjectPlayground'

export function Home() {
  return (
    <>
      <section className="lve-hero" aria-labelledby="lve-title">
        <div className="lve-hero-copy">
          <p className="lve-section-index" aria-hidden="true">
            <span>01</span>
            <span className="lve-index-rule" />
          </p>
          <h1 id="lve-title" lang="zh-CN">
            <span>先写一点，</span>
            <span>世界稍后。</span>
          </h1>
          <p className="lve-description" lang="zh-CN">
            <span>React、TypeScript，</span>
            <span>以及一些刚刚好的默认值。</span>
          </p>
          <Link
            to="/examples"
            className={buttonVariants({ size: 'lg', className: 'lve-primary-link' })}
            lang="zh-CN"
          >
            打开示例 <ArrowUpRight aria-hidden="true" />
          </Link>
          <p className="lve-stack">React 19 / TypeScript / Vite</p>
        </div>
        <div className="lve-hero-aside" aria-hidden="true">
          <svg className="lve-bracket" viewBox="0 0 114 480" preserveAspectRatio="none" fill="none">
            <path d="M113 1H1v478h112v-27H59V28h54V1Z" />
          </svg>
          <div className="lve-margin-notes">
            <p>
              LVE
              <br />/ 001
              <br />—
              <br />
              <br />
              SIMPLE
              <br />
              DEFAULTS.
              <br />
              MORE
              <br />
              BUILDING.
            </p>
            <p>
              FOR
              <br />
              INDEPENDENT
              <br />
              DEVELOPERS
              <br />—
            </p>
          </div>
        </div>
      </section>
      <ProjectPlayground />
    </>
  )
}
