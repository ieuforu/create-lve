import { fireEvent, render } from '@solidjs/testing-library'
import { flush } from 'solid-js'
import { describe, expect, test } from 'vitest'
import { Counter } from './Counter'

describe('<Counter />', () => {
  test('updates without rerendering the component tree', () => {
    const { getByRole } = render(() => <Counter />)
    const button = getByRole('button')

    expect(button).toHaveTextContent('Count: 0')
    fireEvent.click(button)
    flush()
    expect(button).toHaveTextContent('Count: 1')
  })
})
