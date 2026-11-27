import { Toggle } from '@ui-sdk/solid/toggle'
import type { Demo } from './ComponentDemos'
import Icon from './Icon'

export default function DemoCard(props: {
  demo: Demo
  saved: boolean
  onBookmark: (pressed: boolean) => void
}) {
  return (
    <article
      aria-labelledby={`title-${props.demo.id}`}
      class="overflow-hidden rounded-[18px] border border-line bg-white"
    >
      <div class={`demo-canvas ${props.demo.canvas}`}>
        <props.demo.preview />
      </div>
      <div class="flex items-center justify-between gap-2 px-5 py-4">
        <div>
          <h3 id={`title-${props.demo.id}`} class="flex flex-wrap items-baseline gap-x-2">
            <span
              lang="en"
              class="font-display text-[1.35rem] leading-tight font-bold tracking-tight"
            >
              {props.demo.title}
            </span>
            <span class="text-xs font-medium text-muted">{props.demo.name}</span>
          </h3>
          <p class="mt-1 text-xs leading-5 text-muted">{props.demo.description}</p>
        </div>
        <Toggle
          aria-label={`收藏${props.demo.name}`}
          class="bookmark"
          pressed={props.saved}
          onPressedChange={(pressed) => props.onBookmark(pressed)}
        >
          <Icon name={props.saved ? 'bookmarkCheck' : 'bookmark'} />
        </Toggle>
      </div>
    </article>
  )
}
