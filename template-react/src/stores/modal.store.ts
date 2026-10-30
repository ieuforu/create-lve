import { atom, useSetAtom, useAtomValue } from 'jotai'
import { useCallback } from 'react'

// --- Types ---
export interface ConfirmModalData {
  title?: string
  description?: string
  confirmLabel?: string
  onConfirm?: () => void | Promise<void>
}

export interface ModalPayloadMap {
  confirm: ConfirmModalData
}

export type ModalType = keyof ModalPayloadMap
export type ModalEntry<Type extends ModalType = ModalType> = {
  [Key in Type]: { id: string; type: Key; data: ModalPayloadMap[Key] }
}[Type]

export interface ModalProps<Data> {
  data: Data
  open: boolean
  onClose: () => void
}

type OpenModalArgs = {
  [Type in ModalType]: {} extends ModalPayloadMap[Type]
    ? [type: Type, data?: ModalPayloadMap[Type]]
    : [type: Type, data: ModalPayloadMap[Type]]
}[ModalType]

const modalTypes: Record<ModalType, true> = { confirm: true }
let nextModalId = 0

// --- Base atoms ---
export const modalStackAtom = atom<ModalEntry[]>([])

// --- Derived atoms ---
export const isAnyModalOpenAtom = atom((get) => get(modalStackAtom).length > 0)
export const topModalAtom = atom((get) => {
  const stack = get(modalStackAtom)
  return stack[stack.length - 1] ?? null
})

// --- Actions ---
export function useModalActions() {
  const setStack = useSetAtom(modalStackAtom)

  // Keep action identities stable for consumers outside Compiler-optimized code.
  const open = useCallback(
    (...[type, data]: OpenModalArgs) => {
      if (!Object.hasOwn(modalTypes, type)) throw new Error(`Unknown modal type: ${type}`)
      // IDs only identify entries in this in-memory stack; a counter avoids clock collisions.
      const id = `${type}-${++nextModalId}`
      // The discriminated argument tuple validates the payload before it enters the stack.
      const entry = { id, type, data: data ?? {} } as ModalEntry
      setStack((prev) => [...prev, entry])
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

  return { open, close, closeAll }
}

export function useModal() {
  return { ...useModalActions(), topModal: useAtomValue(topModalAtom) }
}
