import { act, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { createStore } from './store'
import { useStore } from './useStore'

it('updates state from a value or an updater and notifies subscribers', () => {
  const store = createStore({ count: 0 })
  const listener = vi.fn()
  store.subscribe(listener)

  store.setState({ count: 1 })
  store.setState((previous) => ({ count: previous.count + 1 }))

  expect(store.getState()).toEqual({ count: 2 })
  expect(listener).toHaveBeenCalledTimes(2)
})

it('does not notify when the state reference is unchanged or after unsubscribing', () => {
  const store = createStore({ count: 0 })
  const listener = vi.fn()
  const unsubscribe = store.subscribe(listener)

  store.setState((previous) => previous)
  unsubscribe()
  store.setState({ count: 1 })

  expect(listener).not.toHaveBeenCalled()
})

it('re-renders only when the selected value changes', () => {
  const store = createStore({ count: 0, label: 'a' })
  const onRender = vi.fn()

  function Count() {
    const count = useStore(store, (state) => state.count)
    onRender()
    return <p>{count}</p>
  }

  render(<Count />)
  const renders = onRender.mock.calls.length

  act(() => store.setState((previous) => ({ ...previous, label: 'b' })))
  expect(onRender).toHaveBeenCalledTimes(renders)

  act(() => store.setState((previous) => ({ ...previous, count: 1 })))
  expect(screen.getByText('1')).toBeInTheDocument()
})
