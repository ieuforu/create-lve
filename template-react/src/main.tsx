import ReactDOM from 'react-dom/client'
import './styles.css'
import { StrictMode } from 'react'
import { startThemeSync } from '#/lib/theme'
import { RouterProvider } from '#/lib/providers/RouterProvider.tsx'
import { QueryProvider } from '#/lib/providers/QueryProvider.tsx'

const rootElement = document.getElementById('react-root')!
const stopThemeSync = startThemeSync()
import.meta.hot?.dispose(stopThemeSync)

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
