import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { themeAtom } from '../model/settings.atoms'

export function useTheme() {
  const [theme, setTheme] = useAtom(themeAtom)
  const cycle = useCallback(() => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'system'
      return 'light'
    })
  }, [setTheme])
  return { theme, setTheme, cycle }
}
