import React from 'react'
import { Label } from '#/components/ui/label'

export function SectionCard({
  title,
  desc,
  children,
}: {
  title: string
  desc?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/50">
      <div className="border-b border-border/30 px-6 py-4">
        <h3 className="text-[15px] font-medium">{title}</h3>
        {desc && <p className="mt-0.5 text-[13px] text-muted-foreground">{desc}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

export function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

export function Field({
  label,
  children,
  hint,
  htmlFor,
}: {
  label: string
  children: React.ReactNode
  hint?: string
  htmlFor?: string
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <div className="pt-2">
        {htmlFor ? (
          <Label htmlFor={htmlFor}>{label}</Label>
        ) : (
          <span className="text-sm font-medium">{label}</span>
        )}
        {hint && (
          <p
            id={htmlFor ? `${htmlFor}-description` : undefined}
            className="mt-0.5 text-[12px] text-muted-foreground/60"
          >
            {hint}
          </p>
        )}
      </div>
      <div className="w-full sm:w-72 sm:shrink-0">{children}</div>
    </div>
  )
}
