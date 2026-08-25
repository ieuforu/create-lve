import { atom, useSetAtom, useAtomValue } from 'jotai'
import { useCallback } from 'react'

// --- Base atoms ---
const modalStackAtom = atom<ModalEntry[]>([])

// --- Types ---
export interface ModalEntry {
  id: string
  type: string
  data?: Record<string, unknown>
}

// --- Derived atoms ---
export const isAnyModalOpenAtom = atom((get) => get(modalStackAtom).length > 0)
export const topModalAtom = atom((get) => {
  const stack = get(modalStackAtom)
  return stack[stack.length - 1] ?? null
})

// --- Actions ---
export function useModal() {
  const setStack = useSetAtom(modalStackAtom)
  const topModal = useAtomValue(topModalAtom)

  const open = useCallback(
    (type: string, data?: Record<string, unknown>) => {
      const id = `${type}-${Date.now()}`
      setStack((prev) => [...prev, { id, type, data }])
      return id
    },
    [setStack],
  )

  const close = useCallback(
    (id?: string) => {
      setStack((prev) => {
        if (id) return prev.filter((m) => m.id !== id)
        return prev.slice(0, -1)
      })
    },
    [setStack],
  )

  const closeAll = useCallback(() => setStack([]), [setStack])

  return { open, close, closeAll, topModal }
}
