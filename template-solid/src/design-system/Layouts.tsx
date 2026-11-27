import type { JSX } from '@solidjs/web'
import type { ParentProps } from 'solid-js'
import styles from './Layouts.module.css'

export function SplitLayout(props: ParentProps<{ visual: JSX.Element }>) {
  return (
    <div class={styles.split}>
      <div class={styles.visual}>{props.visual}</div>
      <div class={styles.content}>{props.children}</div>
    </div>
  )
}

export function SidebarLayout(props: ParentProps<{ sidebar: JSX.Element }>) {
  return (
    <div class={styles.shell}>
      <div class={styles.sidebar}>{props.sidebar}</div>
      <div class={styles.content}>{props.children}</div>
    </div>
  )
}

export function CollectionLayout(props: ParentProps<{ variant?: 'list' | 'grid' }>) {
  return (
    <ul class={styles.collection} data-layout={props.variant ?? 'list'}>
      {props.children}
    </ul>
  )
}

export function InspectorLayout(props: ParentProps<{ summary: JSX.Element }>) {
  return (
    <div class={styles.inspector}>
      <div>{props.summary}</div>
      <div>{props.children}</div>
    </div>
  )
}
