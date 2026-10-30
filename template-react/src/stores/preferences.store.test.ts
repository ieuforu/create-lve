// @vitest-environment node
import { expect, it } from 'vitest'
import { createPreferencesStore } from './preferences.store'

function memoryStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (name: string) => values.get(name) ?? null,
    setItem: (name: string, value: string) => {
      values.set(name, value)
    },
    removeItem: (name: string) => {
      values.delete(name)
    },
  }
}

it('updates and persists preferences outside React, then restores them into a fresh store', () => {
  const storage = memoryStorage()
  const first = createPreferencesStore(storage)
  expect(first.store.getState().theme).toBe('light')
  first.actions.setTheme('dark')
  expect(createPreferencesStore(storage).store.getState().theme).toBe('dark')
  first.actions.setTheme('system')
  expect(createPreferencesStore(storage).store.getState().theme).toBe('system')
})

it('validates stored preferences and preserves the default for invalid values', () => {
  const storage = memoryStorage()
  storage.setItem('lve-preferences', JSON.stringify({ state: { theme: 'invalid' }, version: 0 }))
  const { store, actions } = createPreferencesStore(storage)
  expect(store.getState().theme).toBe('light')
  expect(() => {
    // @ts-expect-error Runtime callers cannot set unsupported themes either.
    actions.setTheme('invalid')
  }).toThrow('Unknown theme')
})
