import { useRouteError, isRouteErrorResponse, Link } from 'react-router'

export default function RouteErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-stone-50">
        <p className="font-mono text-5xl font-extralight text-stone-200">
          {error.status}
        </p>
        <p className="text-sm text-stone-400">
          {error.statusText || 'Something went wrong'}
        </p>
        <Link
          to="/"
          className="mt-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-800"
        >
          Back home
        </Link>
      </main>
    )
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-stone-50">
      <p className="font-mono text-5xl font-extralight text-stone-200">
        Oops
      </p>
      <p className="text-sm text-stone-400">
        {error instanceof Error ? error.message : 'An unexpected error occurred'}
      </p>
      <Link
        to="/"
        className="mt-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-800"
      >
        Back home
      </Link>
    </main>
  )
}
