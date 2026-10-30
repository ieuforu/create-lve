import { useRef } from 'react'
import { modalActions, type ConfirmModalData, type ModalProps } from '#/stores/modal.store'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '#/components/ui/dialog'

export function ConfirmModal({
  id,
  data,
  open,
  pending,
  error,
  onClose,
}: ModalProps<ConfirmModalData>) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <Dialog
      open={open}
      disablePointerDismissal={pending}
      onOpenChange={(nextOpen, details) => {
        if (nextOpen || !open) return
        if (pending) details.cancel()
        else onClose()
      }}
    >
      <DialogContent initialFocus={cancelRef} aria-busy={pending}>
        <DialogTitle>{data?.title ?? 'Are you sure?'}</DialogTitle>
        <DialogDescription>
          {data?.description ?? 'This action cannot be undone.'}
        </DialogDescription>
        {error && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        )}
        <DialogFooter>
          <DialogClose ref={cancelRef} disabled={pending} render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button type="button" disabled={pending} onClick={() => void modalActions.confirm(id)}>
            {pending ? 'Working…' : (data?.confirmLabel ?? 'Confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
