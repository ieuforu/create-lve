import { useAtomValue } from 'jotai'
import { modalStackAtom, modalStore, topModalAtom } from '#/stores/modal.store'

export function useModalStack() {
  return useAtomValue(modalStackAtom, { store: modalStore })
}

export function useTopModal() {
  return useAtomValue(topModalAtom, { store: modalStore })
}
