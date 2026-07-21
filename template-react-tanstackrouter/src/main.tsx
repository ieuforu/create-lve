import ReactDOM from 'react-dom/client'
import './styles.css'
import { StrictMode } from 'react'
import { RouterProvider } from '#/lib/providers/RouterProvider.tsx'
import { QueryProvider } from '#/lib/providers/QueryProvider.tsx'

const rootElement = document.getElementById('react-root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryProvider>
        <RouterProvider />
      </QueryProvider>
    </StrictMode>,
  )
}
