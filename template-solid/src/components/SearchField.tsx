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
    <search class="search-field">
      <Field name="q">
        <FieldLabel class="sr-only">{props.label ?? 'Search'}</FieldLabel>
        <InputGroup class="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 text-muted">
          <Icon name="search" />
          <Input
            type="search"
            class="min-w-0 grow border-0 bg-transparent py-2.5 text-sm text-ink outline-none"
            placeholder={props.label ?? 'Search'}
            value={props.value}
            onValueChange={(value) => props.onValueChange?.(value)}
          />
          <InputClear class="shrink-0 rounded-md px-1.5 py-1 text-xs font-semibold text-violet hover:bg-stone-100">
            {props.clearLabel ?? 'Clear'}
          </InputClear>
        </InputGroup>
      </Field>
    </search>
  )
}
