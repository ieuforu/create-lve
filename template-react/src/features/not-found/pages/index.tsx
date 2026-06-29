import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-stone-50">
      <p className="font-mono text-6xl font-extralight tracking-tight text-stone-200">
        404
      </p>
      <p className="text-sm tracking-wider text-stone-400">Page not found</p>
      <Link
        to="/"
        className="mt-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-800"
      >
        Back home
      </Link>
    </main>
  )
}
