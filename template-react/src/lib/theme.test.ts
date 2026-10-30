import { expect, it, vi } from 'vitest'
import { createPreferencesStore } from '#/stores/preferences.store'
import { startThemeSync } from './theme'

it('applies external actions, follows system changes only in system mode, and cleans subscriptions', () => {
  const { store, actions } = createPreferencesStore({
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  })
  const media = Object.assign(new EventTarget(), { matches: true }) as MediaQueryList
  const remove = vi.spyOn(media, 'removeEventListener')
  const root = document.createElement('html')
  const stop = startThemeSync(store, media, root)
  expect(root.style.colorScheme).toBe('light')
  actions.setTheme('system')
  expect(root.classList.contains('dark')).toBe(true)
  Object.assign(media, { matches: false })
  media.dispatchEvent(new Event('change'))
  expect(root.classList.contains('dark')).toBe(false)
  actions.setTheme('dark')
  media.dispatchEvent(new Event('change'))
  expect(root.classList.contains('dark')).toBe(true)
  stop()
  expect(remove).toHaveBeenCalledWith('change', expect.any(Function))
  actions.setTheme('light')
  expect(root.classList.contains('dark')).toBe(true)
})
