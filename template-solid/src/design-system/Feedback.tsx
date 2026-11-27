import type { ComponentProps, ParentProps } from 'solid-js'
import { omit, onCleanup } from 'solid-js'
import { Button as SdkButton } from '@ui-sdk/solid/button'
import { Tooltip as SdkTooltip, TooltipContent, TooltipTrigger } from '@ui-sdk/solid/tooltip'
import {
  Popover as SdkPopover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '@ui-sdk/solid/popover'
import {
  createToaster,
  Toast as SdkToast,
  ToastClose,
  ToastRegion,
  ToastTitle,
  ToastDescription,
} from '@ui-sdk/solid/toast'
import Icon from '../components/Icon'
import buttons from './Controls.module.css'
import s from './Feedback.module.css'

export function IconButton(
  props: Omit<ComponentProps<typeof SdkButton>, 'class' | 'children'> & {
    label: string
    icon: ComponentProps<typeof Icon>['name']
  },
) {
  const forwarded = omit(props, 'label', 'icon')
  return (
    <SdkButton {...forwarded} aria-label={props.label} class={s.iconBtn}>
      <Icon name={props.icon} />
    </SdkButton>
  )
}
export function Tooltip(props: {
  text: string
  trigger: NonNullable<ComponentProps<typeof TooltipTrigger>['render']>
}) {
  return (
    <SdkTooltip>
      <TooltipTrigger render={props.trigger} />
      <TooltipContent class={s.tip} sideOffset={5}>
        {props.text}
      </TooltipContent>
    </SdkTooltip>
  )
}
export function Popover(props: ParentProps<{ label: string; title: string }>) {
  return (
    <SdkPopover>
      <PopoverTrigger class={buttons.button} data-variant="secondary">
        {props.label}
      </PopoverTrigger>
      <PopoverContent class={s.pop} sideOffset={6} collisionPadding={10}>
        <PopoverTitle>{props.title}</PopoverTitle>
        {props.children}
      </PopoverContent>
    </SdkPopover>
  )
}
export function createNotifications() {
  const notify = createToaster()
  onCleanup(() => {
    notify.dismiss()
  })
  return notify
}
export function Toast(props: { toaster: ReturnType<typeof createNotifications> }) {
  return (
    <ToastRegion toaster={props.toaster} aria-label="通知" class={s.region}>
      {() => (
        <SdkToast class={s.toast}>
          <Icon name="check" />
          <div>
            <ToastTitle />
            <ToastDescription />
          </div>
          <ToastClose aria-label="关闭通知">×</ToastClose>
        </SdkToast>
      )}
    </ToastRegion>
  )
}
