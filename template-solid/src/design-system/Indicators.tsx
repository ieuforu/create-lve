import { createMemo, For, type ParentProps } from 'solid-js'
import styles from './Indicators.module.css'

export type StatusTone = 'neutral' | 'accent' | 'success' | 'warning'

export function StatusBadge(
  props: ParentProps<{ tone?: StatusTone; variant?: 'soft' | 'outline' }>,
) {
  return (
    <span
      class={styles.badge}
      data-tone={props.tone ?? 'neutral'}
      data-variant={props.variant ?? 'soft'}
    >
      {props.children}
    </span>
  )
}

export type DistributionItem = { label: string; value: number; tone: StatusTone }

export function Distribution(props: {
  label: string
  items: readonly DistributionItem[]
  variant?: 'count' | 'percent'
}) {
  const total = createMemo(() =>
    props.items.reduce((sum, item) => sum + Math.max(0, item.value), 0),
  )
  const percent = (value: number) => (total() > 0 ? (100 * Math.max(0, value)) / total() : 0)
  return (
    <figure aria-label={props.label} class={styles.distribution}>
      <div aria-hidden="true" class={styles.bar}>
        <For each={props.items}>
          {(item) => <span data-tone={item.tone} style={{ width: `${percent(item.value)}%` }} />}
        </For>
      </div>
      <dl>
        <For each={props.items}>
          {(item) => (
            <div data-tone={item.tone}>
              <dt>{item.label}</dt>
              <dd>
                {props.variant === 'percent' ? `${Math.round(percent(item.value))}%` : item.value}
              </dd>
            </div>
          )}
        </For>
      </dl>
    </figure>
  )
}
