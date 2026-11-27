import type { JSX } from '@solidjs/web'
import { Field, FieldLabel } from '@ui-sdk/solid/field'
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from '@ui-sdk/solid/number-input'
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@ui-sdk/solid/progress'
import { Radio, RadioGroup, RadioIndicator } from '@ui-sdk/solid/radio'
import { Rating, RatingItem } from '@ui-sdk/solid/rating'
import { For, omit, type ComponentProps } from 'solid-js'
import styles from './Fields.module.css'

type Labeled<P> = Omit<P, 'children' | 'class'> & { label: string; class?: JSX.ClassValue }

export function Stepper(props: Labeled<ComponentProps<typeof NumberInput>>) {
  const input = omit(props, 'label')
  return (
    <Field class={styles.field}>
      <FieldLabel>{props.label}</FieldLabel>
      <NumberInput {...input}>
        <NumberInputGroup class={styles.stepper}>
          <NumberInputDecrement aria-label={`减少${props.label}`}>−</NumberInputDecrement>
          <NumberInputControl />
          <NumberInputIncrement aria-label={`增加${props.label}`}>+</NumberInputIncrement>
        </NumberInputGroup>
      </NumberInput>
    </Field>
  )
}

export function StarRating(props: Labeled<ComponentProps<typeof Rating>>) {
  const rating = omit(props, 'label', 'class')
  return (
    <div class={styles.field}>
      <span>{props.label}</span>
      <Rating {...rating} aria-label={props.label} class={[styles.stars, props.class]}>
        <RatingItem>
          <span aria-hidden="true">★</span>
        </RatingItem>
      </Rating>
    </div>
  )
}

type RadioChoicesProps = Labeled<ComponentProps<typeof RadioGroup>> & {
  options: readonly { value: string; label: string }[]
}

export function RadioChoices(props: RadioChoicesProps) {
  const group = omit(props, 'label', 'options', 'class')
  return (
    <Field class={styles.field}>
      <FieldLabel>{props.label}</FieldLabel>
      <RadioGroup {...group} class={[styles.choices, props.class]}>
        <For each={props.options}>
          {(option) => (
            <label>
              <Radio value={option.value} aria-label={option.label}>
                <RadioIndicator />
              </Radio>
              {option.label}
            </label>
          )}
        </For>
      </RadioGroup>
    </Field>
  )
}

export function ProgressBar(props: Labeled<ComponentProps<typeof Progress>>) {
  const progress = omit(props, 'label', 'class')
  return (
    <Progress {...progress} class={[styles.progress, props.class]}>
      <ProgressLabel>{props.label}</ProgressLabel>
      <ProgressValue />
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  )
}
