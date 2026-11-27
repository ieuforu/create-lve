import type { ComponentProps, ParentProps } from 'solid-js'
import { omit } from 'solid-js'
import type { JSX } from '@solidjs/web'
import { Button as SdkButton } from '@ui-sdk/solid/button'
import { Toggle } from '@ui-sdk/solid/toggle'
import { Checkbox as SdkCheckbox, CheckboxIndicator } from '@ui-sdk/solid/checkbox'
import { Switch as SdkSwitch, SwitchThumb } from '@ui-sdk/solid/switch'
import { TabsList } from '@ui-sdk/solid/tabs'
import { SliderControl, SliderIndicator, SliderThumb, SliderTrack } from '@ui-sdk/solid/slider'
import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@ui-sdk/solid/accordion'
import Icon from '../components/Icon'
import styles from './Controls.module.css'

type WithClass<P> = Omit<P, 'class'> & { class?: JSX.ClassValue }

export type ButtonProps = WithClass<ComponentProps<typeof SdkButton>> & {
  variant?: 'primary' | 'secondary' | 'chip' | 'link'
}

export function Button(props: ButtonProps) {
  const forwarded = omit(props, 'variant', 'class')
  return (
    <SdkButton
      {...forwarded}
      class={[styles.button, props.class]}
      data-variant={props.variant ?? 'primary'}
    />
  )
}

export function IconToggle(props: WithClass<ComponentProps<typeof Toggle>>) {
  const forwarded = omit(props, 'class')
  return <Toggle {...forwarded} class={[styles.iconToggle, props.class]} />
}

export function Switch(props: WithClass<Omit<ComponentProps<typeof SdkSwitch>, 'children'>>) {
  const forwarded = omit(props, 'class')
  return (
    <SdkSwitch {...forwarded} class={[styles.switchTrack, props.class]}>
      <SwitchThumb class={styles.switchThumb} />
    </SdkSwitch>
  )
}

export function Checkbox(props: WithClass<Omit<ComponentProps<typeof SdkCheckbox>, 'children'>>) {
  const forwarded = omit(props, 'class')
  return (
    <SdkCheckbox {...forwarded} class={[styles.checkbox, props.class]}>
      <CheckboxIndicator>
        <Icon name="check" />
      </CheckboxIndicator>
    </SdkCheckbox>
  )
}

export function SegmentedList(props: WithClass<ComponentProps<typeof TabsList>>) {
  const forwarded = omit(props, 'class')
  return <TabsList {...forwarded} class={[styles.tabsList, props.class]} />
}

export function SliderRail(props: { label: string }) {
  return (
    <SliderControl class={styles.sliderControl}>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb aria-label={props.label} />
      </SliderTrack>
    </SliderControl>
  )
}

export function DisclosureItem(props: ParentProps<{ value: string; title: string }>) {
  return (
    <AccordionItem value={props.value} class={styles.disclosure}>
      <AccordionHeader>
        <AccordionTrigger>
          {props.title}
          <Icon name="chevronDown" />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionPanel>{props.children}</AccordionPanel>
    </AccordionItem>
  )
}
