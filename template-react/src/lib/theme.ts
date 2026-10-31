import { preferencesStore } from '#/stores/preferences.store'

// DOM synchronization belongs to application startup, independent of React mounts.
export function startThemeSync(
  store = preferencesStore,
  media = window.matchMedia('(prefers-color-scheme: dark)'),
  root = document.documentElement,
) {
  function apply() {
    const { theme } = store.getState()
    const dark = theme === 'dark' || (theme === 'system' && media.matches)
    root.classList.toggle('dark', dark)
    root.style.colorScheme = dark ? 'dark' : 'light'
  }

  apply()
  const unsubscribe = store.subscribe(apply)
  media.addEventListener('change', apply)
  return () => {
    unsubscribe()
    media.removeEventListener('change', apply)
  }
}
