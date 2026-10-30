import { useRef, useState } from 'react'
import type { ConfirmModalData, ModalProps } from '#/stores/modal.store'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '#/components/ui/dialog'

export function ConfirmModal({ data, open, onClose }: ModalProps<ConfirmModalData>) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submitting = useRef(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  async function confirm() {
    if (submitting.current) return
    submitting.current = true
    setPending(true)
    setError(null)
    try {
      await data?.onConfirm?.()
      onClose()
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : typeof cause === 'string' ? cause : ''
      setError(message || 'Unable to complete this action. Please try again.')
    } finally {
      submitting.current = false
      setPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      disablePointerDismissal={pending}
      onOpenChange={(nextOpen, details) => {
        if (nextOpen || !open) return
        if (submitting.current) details.cancel()
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
          <Button type="button" disabled={pending} onClick={confirm}>
            {pending ? 'Working…' : (data?.confirmLabel ?? 'Confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
