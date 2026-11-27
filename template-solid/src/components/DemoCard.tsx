import styles from './DemoCard.module.css'
import { IconToggle } from '../design-system/controls'
import type { Demo } from './ComponentDemos'
import Icon from './Icon'

export default function DemoCard(props: {
  demo: Demo
  saved: boolean
  onBookmark: (pressed: boolean) => void
}) {
  return (
    <article id={props.demo.id} aria-labelledby={`title-${props.demo.id}`} class={styles.card}>
      <div class={styles.canvas} data-tone={props.demo.tone}>
        <props.demo.preview />
      </div>
      <div class={styles.footer}>
        <div>
          <h3 id={`title-${props.demo.id}`} class={styles.heading}>
            <span lang="en" class={styles.title}>
              {props.demo.title}
            </span>
            <span class={styles.name}>{props.demo.name}</span>
          </h3>
          <p class={styles.description}>{props.demo.description}</p>
        </div>
        <IconToggle
          aria-label={`收藏${props.demo.name}`}
          pressed={props.saved}
          onPressedChange={(pressed) => props.onBookmark(pressed)}
        >
          <Icon name={props.saved ? 'bookmarkCheck' : 'bookmark'} />
        </IconToggle>
      </div>
    </article>
  )
}
