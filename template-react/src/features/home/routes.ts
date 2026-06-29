import type { FeatureRoute } from '@/app/types'

const routes: FeatureRoute[] = [
  {
    path: '/',
    index: true,
    lazy: async () => {
      const { default: Component } = await import('./pages')
      return { Component }
    },
  },
]

export default routes
