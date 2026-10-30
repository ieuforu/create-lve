import { atom, createStore } from 'jotai/vanilla'

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
  [Key in Type]: {
    id: string
    type: Key
    data: ModalPayloadMap[Key]
    pending: boolean
    error: string | null
  }
}[Type]

export interface ModalProps<Data> {
  id: string
  data: Data
  open: boolean
  pending: boolean
  error: string | null
  onClose: () => void
}

type OpenModalArgs = {
  [Type in ModalType]: {} extends ModalPayloadMap[Type]
    ? [type: Type, data?: ModalPayloadMap[Type]]
    : [type: Type, data: ModalPayloadMap[Type]]
}[ModalType]

const modalTypes: Record<ModalType, true> = { confirm: true }

// --- Base atoms ---
export const modalStackAtom = atom<ModalEntry[]>([])

// --- Derived atoms ---
export const isAnyModalOpenAtom = atom((get) => get(modalStackAtom).length > 0)
export const topModalAtom = atom((get) => {
  const stack = get(modalStackAtom)
  return stack[stack.length - 1] ?? null
})

// Each instance owns its IDs, state and actions. No React runtime is required.
export function createModalStore() {
  const store = createStore()
  let nextModalId = 0

  const actions = {
    open(...[type, data]: OpenModalArgs) {
      if (!Object.hasOwn(modalTypes, type)) throw new Error(`Unknown modal type: ${type}`)
      // IDs only identify entries in this in-memory stack; a counter avoids clock collisions.
      const id = `${type}-${++nextModalId}`
      // The discriminated argument tuple validates the payload before it enters the stack.
      const entry = { id, type, data: data ?? {}, pending: false, error: null } as ModalEntry
      store.set(modalStackAtom, (prev) => [...prev, entry])
      return id
    },
    close(id?: string) {
      store.set(modalStackAtom, (prev) => {
        if (id) return prev.filter((m) => m.id !== id)
        return prev.slice(0, -1)
      })
    },
    closeAll() {
      store.set(modalStackAtom, [])
    },
    dismiss(id: string) {
      if (!store.get(modalStackAtom).find((modal) => modal.id === id)?.pending) actions.close(id)
    },
    async confirm(id: string) {
      const entry = store.get(modalStackAtom).find((modal) => modal.id === id)
      if (!entry || entry.type !== 'confirm' || entry.pending) return

      store.set(modalStackAtom, (prev) =>
        prev.map((modal) => (modal.id === id ? { ...modal, pending: true, error: null } : modal)),
      )
      try {
        await entry.data.onConfirm?.()
        actions.close(id)
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : typeof cause === 'string' ? cause : ''
        store.set(modalStackAtom, (prev) =>
          prev.map((modal) =>
            modal.id === id
              ? {
                  ...modal,
                  pending: false,
                  error: message || 'Unable to complete this action. Please try again.',
                }
              : modal,
          ),
        )
      }
    },
  }

  return { store, actions }
}

// One SPA instance, shared by ordinary TS callers and the React subscription hooks.
export const { store: modalStore, actions: modalActions } = createModalStore()
