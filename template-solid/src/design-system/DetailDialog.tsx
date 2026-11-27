import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@ui-sdk/solid/dialog'
import { Show, type ParentProps } from 'solid-js'
import controls from './Controls.module.css'
import styles from './DetailDialog.module.css'

export function DetailDialog(
  props: ParentProps<{
    trigger: string
    title: string
    description?: string
    size?: 'compact' | 'regular'
    triggerVariant?: 'link' | 'secondary'
  }>,
) {
  return (
    <Dialog>
      <DialogTrigger class={controls.button} data-variant={props.triggerVariant ?? 'secondary'}>
        {props.trigger}
      </DialogTrigger>
      <DialogBackdrop class={styles.backdrop} />
      <DialogContent class={styles.content} data-size={props.size ?? 'regular'}>
        <DialogTitle class={styles.title}>{props.title}</DialogTitle>
        <Show when={props.description}>
          <DialogDescription class={styles.description}>{props.description}</DialogDescription>
        </Show>
        {props.children}
        <div class={styles.footer}>
          <DialogClose class={controls.button} data-variant="primary">
            完成
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
