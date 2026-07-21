import { useAtomValue } from 'jotai'
import { isAnyModalOpenAtom, topModalAtom } from '#/stores/modal.store'
import { useModal } from '#/stores/modal.store'
import { ConfirmModal } from './ConfirmModal'

// Modal registry — add new modals here
const MODALS: Record<string, React.FC<{ data?: Record<string, unknown>; onClose: () => void }>> = {
  confirm: ConfirmModal,
}

export function ModalRenderer() {
  const isOpen = useAtomValue(isAnyModalOpenAtom)
  const topModal = useAtomValue(topModalAtom)
  const { close } = useModal()

  if (!isOpen || !topModal) return null

  const ModalComponent = MODALS[topModal.type]
  if (!ModalComponent) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => close(topModal.id)}
      />
      {/* Content */}
      <div className="relative z-10">
        <ModalComponent data={topModal.data} onClose={() => close(topModal.id)} />
      </div>
    </div>
  )
}
