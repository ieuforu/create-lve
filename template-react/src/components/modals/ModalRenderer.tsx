import type { ComponentType } from 'react'
import { useAtomValue } from 'jotai'
import {
  modalStackAtom,
  useModalActions,
  type ModalEntry,
  type ModalPayloadMap,
  type ModalProps,
  type ModalType,
} from '#/stores/modal.store'
import { ConfirmModal } from './ConfirmModal'

// Modal registry — add new modals here
const MODALS: {
  [Type in ModalType]: ComponentType<ModalProps<ModalPayloadMap[Type]>>
} = {
  confirm: ConfirmModal,
}

function ModalView<Type extends ModalType>({
  entry,
  open,
  onClose,
}: {
  entry: ModalEntry<Type>
  open: boolean
  onClose: () => void
}) {
  const ModalComponent: ComponentType<ModalProps<ModalPayloadMap[Type]>> = MODALS[entry.type]
  return <ModalComponent data={entry.data} open={open} onClose={onClose} />
}

export function ModalRenderer() {
  const stack = useAtomValue(modalStackAtom)
  const { close } = useModalActions()
  return (
    <>
      {stack.map((entry, index) => (
        <ModalView
          key={entry.id}
          entry={entry}
          open={index === stack.length - 1}
          onClose={() => close(entry.id)}
        />
      ))}
    </>
  )
}
