import { lazyRoute } from '@/app/types'

const routes = [
  {
    ...lazyRoute('/settings', () => import('./pages/settings')),
    hostRootLayout: false,
    children: [
      lazyRoute('/', () => import('./pages/overview'), true),
      lazyRoute('profile', () => import('./pages/profile')),
      lazyRoute('account', () => import('./pages/account')),
    ],
  },
]

export default routes
