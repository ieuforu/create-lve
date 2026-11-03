import { Link, useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import './system.css'

export function AppErrorPage({ error }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <SystemPage
      code="500"
      eyebrow="Application error"
      title="Something interrupted the flow."
      copy="The route could not finish its work. Retry it without throwing away the rest of the application."
      detail={import.meta.env.DEV ? errorMessage(error) : undefined}
    >
      <button
        className="system-action system-action-primary"
        onClick={() => void router.invalidate()}
      >
        Try again
      </button>
      <Link to="/" className="system-action system-action-secondary">
        Back home
      </Link>
    </SystemPage>
  )
}

export function NotFoundPage() {
  return (
    <SystemPage
      code="404"
      eyebrow="Page not found"
      title="This route ends here."
      copy="The address does not map to a feature in this application."
    >
      <Link to="/" className="system-action system-action-primary">
        Back home
      </Link>
    </SystemPage>
  )
}

function SystemPage({
  code,
  eyebrow,
  title,
  copy,
  detail,
  children,
}: {
  code: string
  eyebrow: string
  title: string
  copy: string
  detail?: string
  children: ReactNode
}) {
  return (
    <main className="system-page">
      <section className="system-panel" aria-labelledby="system-title">
        <div className="system-meta">
          <span>{eyebrow}</span>
          <span>{code}</span>
        </div>
        <div className="system-copy">
          <h1 id="system-title">{title}</h1>
          <p>{copy}</p>
          {detail ? <pre>{detail}</pre> : null}
        </div>
        <div className="system-actions">{children}</div>
      </section>
    </main>
  )
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}
