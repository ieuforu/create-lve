import { describe, it, expect } from 'vitest'
import { createStore } from 'jotai'
import { isAnyModalOpenAtom, topModalAtom } from './modal.store'

// We can test the atoms directly without React
describe('modal store atoms', () => {
  it('isAnyModalOpenAtom is false by default', () => {
    const store = createStore()
    expect(store.get(isAnyModalOpenAtom)).toBe(false)
  })

  it('topModalAtom is null by default', () => {
    const store = createStore()
    expect(store.get(topModalAtom)).toBeNull()
  })
})
