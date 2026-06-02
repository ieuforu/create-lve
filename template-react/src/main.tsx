import { createRoot } from 'react-dom/client'
import { Providers } from './app/providers'
import { router } from './app/router'
import { RouterProvider } from 'react-router'
import './style.css'

createRoot(document.getElementById('root')!).render(
  <Providers>
    <RouterProvider router={router} />
  </Providers>,
)
