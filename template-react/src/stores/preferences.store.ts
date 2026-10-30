import { createStore } from 'zustand/vanilla'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

interface Preferences {
  theme: Theme
}

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function createPreferencesStore(storage?: StateStorage) {
  const store = createStore<Preferences>()(
    persist<Preferences>(() => ({ theme: 'light' }), {
      name: 'lve-preferences',
      storage: createJSONStorage(() => storage ?? localStorage),
      // Persisted browser data is untrusted and may come from an older app version.
      merge: (saved, current) => {
        const theme = saved && typeof saved === 'object' && 'theme' in saved ? saved.theme : null
        return { ...current, theme: isTheme(theme) ? theme : current.theme }
      },
    }),
  )

  const actions = {
    setTheme(theme: Theme) {
      if (!isTheme(theme)) throw new Error(`Unknown theme: ${theme}`)
      store.setState({ theme })
    },
  }

  return { store, actions }
}

export const { store: preferencesStore, actions: preferencesActions } = createPreferencesStore()
