import { useStore } from 'zustand'
import { preferencesStore } from '#/stores/preferences.store'

export function useTheme() {
  return useStore(preferencesStore, (state) => state.theme)
}
