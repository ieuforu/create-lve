import { createBrowserRouter, type RouteObject } from 'react-router'
import RootLayout from './layouts/root'
import type { FeatureRoute } from './types'

// 自动扫描所有 features/*/routes.ts
const routeModules = import.meta.glob<{ default: FeatureRoute[] }>('../features/*/routes.ts')

async function loadFeatureRoutes(): Promise<FeatureRoute[]> {
  const routes: FeatureRoute[] = []

  for (const [path, loader] of Object.entries(routeModules)) {
    const feature = path.match(/features\/([^/]+)\//)?.[1]
    try {
      const mod = await loader()
      if (mod.default) {
        for (const route of mod.default) {
          routes.push({
            ...route,
            handle: { feature, ...route.handle },
          })
        }
      }
    } catch (err) {
      console.error(`[router] feature "${feature}" load failed:`, err)
    }
  }

  return routes
}

let routerPromise: Promise<ReturnType<typeof createBrowserRouter>> | null = null

export function getRouter() {
  if (!routerPromise) {
    routerPromise = loadFeatureRoutes().then((featureRoutes) => {
      const independent: RouteObject[] = []
      const layoutChildren: RouteObject[] = []

      for (const route of featureRoutes) {
        const { layout: useLayout, ...rest } = route
        if (useLayout === false) {
          independent.push(rest)
        } else {
          layoutChildren.push(rest)
        }
      }

      return createBrowserRouter([
        {
          path: '/',
          element: <RootLayout />,
          children: layoutChildren,
        },
        ...independent,
      ])
    })
  }
  return routerPromise
}
