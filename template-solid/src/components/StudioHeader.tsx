import { Button } from '@ui-sdk/solid/button'
import { Show } from 'solid-js'
import Icon from './Icon'

export default function StudioHeader(props: {
  savedOnly: boolean
  count: number
  onHome: () => void
  onNavigate: (saved: boolean) => void
}) {
  return (
    <header class="border-b border-line bg-paper">
      <div class="page-width flex min-h-17 items-center justify-between gap-2">
        <a
          class="brand flex shrink-0 items-center gap-1.5 sm:gap-2"
          href="#studio-top"
          onClick={() => props.onHome()}
          aria-label="Forma Studio 首页"
        >
          <span class="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span
            lang="en"
            class="font-display text-[1.12rem] leading-none font-extrabold tracking-[-.055em] sm:text-[1.55rem]"
          >
            Forma<span class="font-medium max-[360px]:hidden"> Studio</span>
          </span>
        </a>
        <nav
          aria-label="组件导航"
          class="flex h-17 items-stretch gap-3.5 whitespace-nowrap sm:gap-8"
        >
          <Button
            class="nav-link"
            aria-pressed={props.savedOnly ? 'false' : 'true'}
            onClick={() => props.onNavigate(false)}
          >
            组件库
          </Button>
          <Button
            class="nav-link"
            aria-pressed={props.savedOnly ? 'true' : 'false'}
            onClick={() => props.onNavigate(true)}
          >
            收藏夹
            <Show when={props.count > 0}>
              <span class="nav-count">{props.count}</span>
            </Show>
          </Button>
        </nav>
        <a
          href="https://ui-sdk.dev/docs"
          class="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line bg-white px-2.5 py-1.5 text-xs font-semibold hover:border-violet sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
        >
          <span>
            <span class="hidden sm:inline">ui-sdk </span>文档
          </span>
          <Icon name="arrowUpRight" />
        </a>
      </div>
    </header>
  )
}
