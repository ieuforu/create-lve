import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_marketing-layout/about')({
  component: About,
})

function About() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">About</h1>
      <p className="mt-2 text-gray-500">A modern React application starter.</p>
    </div>
  )
}
