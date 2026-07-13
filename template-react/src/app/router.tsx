import { createBrowserRouter } from 'react-router'
import RootLayout from './layouts/root'
import RouteErrorBoundary from '@/shared/components/route-error-boundary'
import type { FeatureRoute } from './types'
import { toRouteObjects } from './types'

// ⚠️ import.meta.glob 是 eager 的——routes.ts 里不要直接 import 重依赖，
// 页面组件务必用 lazy import。routes.ts 只放路径和 lazy 配置。
const routeModules = import.meta.glob<{ default: FeatureRoute[] }>('../features/*/routes.ts')

function HydrateFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-200 border-t-stone-600" />
    </div>
  )
}

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
    routerPromise = loadFeatureRoutes()
      .then((featureRoutes) => {
        const independent: FeatureRoute[] = []
        const layoutChildren: FeatureRoute[] = []

        for (const route of featureRoutes) {
          if (route.hostRootLayout === false) {
            independent.push(route)
          } else {
            layoutChildren.push(route)
          }
        }

        return createBrowserRouter([
          {
            path: '/',
            element: <RootLayout />,
            errorElement: <RouteErrorBoundary />,
            HydrateFallback,
            children: toRouteObjects(layoutChildren, HydrateFallback),
          },
          {
            errorElement: <RouteErrorBoundary />,
            children: toRouteObjects(independent, HydrateFallback),
          },
        ])
      })
      .catch((err) => {
        console.error('[router] init failed:', err)
        // 返回一个最简 router，显示错误信息而非白屏
        return createBrowserRouter([
          {
            path: '*',
            element: <RouteErrorBoundary />,
          },
        ])
      })
  }
  return routerPromise
}
