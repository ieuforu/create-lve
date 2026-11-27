import { Button } from '@ui-sdk/solid/button'
import { Show } from 'solid-js'
import { StudioSiteHeader } from './StudioSite'
import styles from './StudioHeader.module.css'
import Icon from './Icon'

export default function StudioHeader(props: {
  onHome: () => void
  savedOnly: boolean
  count: number
  onNavigate: (saved: boolean) => void
}) {
  return (
    <StudioSiteHeader active="/" onHome={props.onHome}>
      <Button
        class={styles.collection}
        aria-pressed={props.savedOnly ? 'true' : 'false'}
        onClick={() => props.onNavigate(!props.savedOnly)}
      >
        <Icon name={props.savedOnly ? 'bookmarkCheck' : 'bookmark'} />
        收藏夹
        <Show when={props.count > 0}>
          <span class={styles.count}>{props.count}</span>
        </Show>
      </Button>
      <a class={styles.docs} href="https://ui-sdk.dev/docs">
        <span>文档</span>
        <Icon name="arrowUpRight" />
      </a>
    </StudioSiteHeader>
  )
}
