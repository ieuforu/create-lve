import styles from './SearchField.module.css'
import { Field, FieldLabel } from '@ui-sdk/solid/field'
import { Input, InputClear, InputGroup } from '@ui-sdk/solid/input'
import Icon from './Icon'

export default function SearchField(
  props: {
    value?: string
    onValueChange?: (value: string) => void
    label?: string
    clearLabel?: string
  } = {},
) {
  return (
    <search class={styles.field}>
      <Field name="q">
        <FieldLabel class="sr-only">{props.label ?? 'Search'}</FieldLabel>
        <InputGroup class={styles.group}>
          <Icon name="search" />
          <Input
            type="search"
            class={styles.input}
            placeholder={props.label ?? 'Search'}
            value={props.value}
            onValueChange={(value) => props.onValueChange?.(value)}
          />
          <InputClear class={styles.clear}>{props.clearLabel ?? 'Clear'}</InputClear>
        </InputGroup>
      </Field>
    </search>
  )
}
