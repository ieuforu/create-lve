import { Field as SdkField, FieldDescription, FieldError, FieldLabel } from '@ui-sdk/solid/field'
import { Input as SdkInput } from '@ui-sdk/solid/input'
import { Textarea as SdkTextarea } from '@ui-sdk/solid/textarea'
import {
  Select as SdkSelect,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@ui-sdk/solid/select'
import { omit, Show, type ComponentProps, type ParentProps } from 'solid-js'
import type { JSX } from '@solidjs/web'
import Icon from '../components/Icon'
import s from './FormControls.module.css'

export function Field(
  props: ParentProps<{ label: string; description?: string; error?: string; name?: string }>,
) {
  return (
    <SdkField name={props.name} invalid={props.error ? true : undefined} class={s.field}>
      <FieldLabel>{props.label}</FieldLabel>
      {props.children}
      <Show when={props.description}>
        <FieldDescription>{props.description}</FieldDescription>
      </Show>
      <Show when={props.error}>
        <FieldError>{props.error}</FieldError>
      </Show>
    </SdkField>
  )
}
type Styled<P> = Omit<P, 'class'> & { class?: JSX.ClassValue }
export function Input(props: Styled<ComponentProps<typeof SdkInput>>) {
  const forwarded = omit(props, 'class')
  return <SdkInput {...forwarded} class={[s.control, props.class]} />
}
export function Textarea(props: Styled<ComponentProps<typeof SdkTextarea>>) {
  const forwarded = omit(props, 'class')
  return <SdkTextarea {...forwarded} class={[s.control, s.multiline, props.class]} />
}
export function Select(props: {
  options: readonly { value: string; label: string }[]
  value?: string
  defaultValue?: string
  placeholder?: string
  name?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}) {
  return (
    <SdkSelect<string>
      items={[...props.options]}
      value={props.value}
      defaultValue={props.defaultValue}
      name={props.name}
      disabled={props.disabled}
      placeholder={props.placeholder}
      onValueChange={(value) => {
        if (value !== null) props.onValueChange?.(value)
      }}
    >
      <SelectTrigger class={[s.control, s.select]}>
        <SelectValue />
        <Icon name="chevronDown" />
      </SelectTrigger>
      <SelectContent sideOffset={4} collisionPadding={8} class={s.options} />
    </SdkSelect>
  )
}
