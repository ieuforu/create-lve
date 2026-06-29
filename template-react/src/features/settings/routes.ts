import type { FeatureRoute } from '@/app/types'

const routes: FeatureRoute[] = [
  {
    path: '/settings',
    hostRootLayout: false,
    lazy: async () => {
      const { default: Component } = await import('./pages/settings')
      return { Component }
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Component } = await import('./pages/overview')
          return { Component }
        },
      },
      {
        path: 'profile',
        lazy: async () => {
          const { default: Component } = await import('./pages/profile')
          return { Component }
        },
      },
      {
        path: 'account',
        lazy: async () => {
          const { default: Component } = await import('./pages/account')
          return { Component }
        },
      },
    ],
  },
]

export default routes
