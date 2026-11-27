import { SiteHeader, SiteFooter, type NavLink } from '../design-system/Shell'
import type { ParentProps } from 'solid-js'
import s from './StudioHeader.module.css'

const pages = [
  { label: '组件库', href: '/' },
  { label: '作品集', href: '/portfolio' },
  { label: '工作台', href: '/dashboard' },
] as const satisfies readonly NavLink[]

function Brand(props: { onHome?: () => void }) {
  return (
    <a href="/" onClick={() => props.onHome?.()} class={s.brand} aria-label="Forma Studio 首页">
      <span class={s.mark} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span class={s.name} lang="en">
        Forma<span class={s.suffix}> Studio</span>
      </span>
    </a>
  )
}
function siteLinks(onHome?: () => void) {
  return [{ ...pages[0], onNavigate: onHome }, ...pages.slice(1)]
}
export function StudioSiteHeader(props: ParentProps<{ active: string; onHome?: () => void }>) {
  return (
    <SiteHeader
      brand={<Brand onHome={props.onHome} />}
      links={siteLinks(props.onHome)}
      active={props.active}
    >
      {props.children}
    </SiteHeader>
  )
}
export function StudioFooter(props: { active: string; onHome?: () => void }) {
  return (
    <SiteFooter
      brand={<Brand onHome={props.onHome} />}
      links={[...siteLinks(props.onHome), { label: '文档', href: 'https://ui-sdk.dev/docs' }]}
      active={props.active}
      credit="© Forma Studio"
    />
  )
}
