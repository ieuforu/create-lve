import {
  Menu,
  MenuContent,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from '@ui-sdk/solid/menu'
import { Show, type ComponentProps, type ParentProps } from 'solid-js'
import Icon from '../components/Icon'
import styles from './ActionMenu.module.css'

export { MenuItem as ActionItem, MenuSeparator as ActionSeparator } from '@ui-sdk/solid/menu'

type ActionMenuProps = ParentProps<{
  label: string
  variant?: 'button' | 'icon'
  onAction: NonNullable<ComponentProps<typeof Menu>['onAction']>
}>

export function ActionMenu(props: ActionMenuProps) {
  return (
    <Menu presentation="auto" onAction={(value, details) => props.onAction(value, details)}>
      <MenuTrigger
        aria-label={props.label}
        class={styles.trigger}
        data-variant={props.variant ?? 'button'}
      >
        <Show when={props.variant !== 'icon'} fallback={<Icon name="more" />}>
          {props.label}
          <Icon name="chevronDown" />
        </Show>
      </MenuTrigger>
      <MenuContent
        aria-label={props.label}
        class={styles.popup}
        sideOffset={5}
        collisionPadding={8}
      >
        {props.children}
      </MenuContent>
    </Menu>
  )
}

export function ActionSubmenu(props: ParentProps<{ label: string }>) {
  return (
    <MenuSub>
      <MenuSubTrigger>
        {props.label}
        <span aria-hidden="true" class={styles.chevron}>
          <Icon name="chevronDown" />
        </span>
      </MenuSubTrigger>
      <MenuSubContent
        aria-label={props.label}
        class={styles.popup}
        sideOffset={4}
        collisionPadding={8}
      >
        {props.children}
      </MenuSubContent>
    </MenuSub>
  )
}
