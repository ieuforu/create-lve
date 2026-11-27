import type { JSX } from '@solidjs/web'
import { createSignal, For, onSettled, type ParentProps } from 'solid-js'
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@ui-sdk/solid/dialog'
import Icon from '../components/Icon'
import s from './Shell.module.css'
import dialog from './DetailDialog.module.css'

export type NavLink = { label: string; href: string; onNavigate?: () => void }
export type NavGroup = { label: string; links: readonly NavLink[] }

export function Navigation(props: {
  label: string
  links: readonly NavLink[]
  active?: string
  vertical?: boolean
  onNavigate?: () => void
}) {
  return (
    <nav
      aria-label={props.label}
      class={s.nav}
      data-direction={props.vertical ? 'vertical' : 'horizontal'}
    >
      <For each={props.links}>
        {(link) => (
          <a
            href={link.href}
            aria-current={link.href === props.active ? 'page' : undefined}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
              link.onNavigate?.()
              props.onNavigate?.()
            }}
          >
            {link.label}
          </a>
        )}
      </For>
    </nav>
  )
}

export function NavigationDrawer(props: {
  label: string
  groups: readonly NavGroup[]
  active: string
}) {
  const [open, setOpen] = createSignal(false)
  onSettled(() => {
    const desktop = window.matchMedia('(min-width: 48rem)')
    const close = () => {
      if (desktop.matches) setOpen(false)
    }
    desktop.addEventListener('change', close)
    return () => desktop.removeEventListener('change', close)
  })
  return (
    <div class={s.mobile}>
      <Dialog open={open()} onOpenChange={setOpen}>
        <DialogTrigger class={s.drawerTrigger}>
          <Icon name="menu" />
          {props.label}
        </DialogTrigger>
        <DialogBackdrop class={dialog.backdrop} />
        <DialogContent class={s.drawer}>
          <div class={s.drawerHead}>
            <DialogTitle>{props.label}</DialogTitle>
            <DialogClose aria-label="关闭导航" class={s.close}>
              ×
            </DialogClose>
          </div>
          <For each={props.groups}>
            {(group) => (
              <div class={s.group}>
                <p>{group.label}</p>
                <Navigation
                  vertical
                  label={group.label}
                  links={group.links}
                  active={props.active}
                  onNavigate={() => setOpen(false)}
                />
              </div>
            )}
          </For>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type SiteProps = { brand: JSX.Element; links: readonly NavLink[]; active: string }
export function SiteHeader(props: ParentProps<SiteProps>) {
  return (
    <header class={s.header}>
      <div class={['page-width', s.headerInner]}>
        {props.brand}
        <div class={s.desktop}>
          <Navigation label="主导航" links={props.links} active={props.active} />
        </div>
        <div class={s.headerActions}>
          {props.children}
          <NavigationDrawer
            label="主菜单"
            groups={[{ label: '页面', links: props.links }]}
            active={props.active}
          />
        </div>
      </div>
    </header>
  )
}
export function SiteFooter(props: SiteProps & { credit: string }) {
  return (
    <footer class={s.footer}>
      <div class={['page-width', s.footerInner]}>
        {props.brand}
        <Navigation label="页脚导航" links={props.links} active={props.active} />
        <small>{props.credit}</small>
      </div>
    </footer>
  )
}
export function DashboardLayout(
  props: ParentProps<{
    title: string
    groups: readonly NavGroup[]
    active: string
  }>,
) {
  return (
    <div class={['page-width', s.workspace]}>
      <aside aria-label="工作台侧栏" class={s.aside}>
        <p class={s.asideTitle}>{props.title}</p>
        <For each={props.groups}>
          {(group) => (
            <div class={s.group}>
              <p>{group.label}</p>
              <Navigation label={group.label} links={group.links} vertical active={props.active} />
            </div>
          )}
        </For>
      </aside>
      <main class={s.workspaceMain}>
        <NavigationDrawer label="工作台导航" groups={props.groups} active={props.active} />
        {props.children}
      </main>
    </div>
  )
}
