interface ConfirmModalProps {
  data?: Record<string, unknown>
  onClose: () => void
}

export function ConfirmModal({ data, onClose }: ConfirmModalProps) {
  const title = (data?.title as string) ?? 'Are you sure?'
  const description = (data?.description as string) ?? 'This action cannot be undone.'
  const confirmLabel = (data?.confirmLabel as string) ?? 'Confirm'
  const onConfirm = data?.onConfirm as (() => void) | undefined

  return (
    <div className="w-[380px] rounded-2xl border border-border/40 bg-background p-6 shadow-2xl">
      <h2 className="text-[16px] font-semibold">{title}</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-6 flex justify-end gap-2.5">
        <button
          onClick={onClose}
          className="rounded-lg border border-border/60 px-4 py-1.5 text-[13px] font-medium transition-colors hover:bg-muted/50"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm?.()
            onClose()
          }}
          className="rounded-lg bg-foreground px-4 py-1.5 text-[13px] font-medium text-background transition-all hover:opacity-90"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}
