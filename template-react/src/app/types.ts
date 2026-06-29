import type { ComponentType } from 'react'
import type { RouteObject } from 'react-router'

/** Feature route config — `hostRootLayout: false` to bypass RootLayout */
export interface FeatureRoute extends Omit<RouteObject, 'children' | 'handle'> {
  /** false = 不挂 RootLayout，直接渲染在 RouterProvider 下，默认 true */
  hostRootLayout?: boolean
  /** 嵌套路由，children 内的 route 不再单独处理 layout */
  children?: FeatureRoute[]
  handle?: Record<string, unknown>
}

/** FeatureRoute → RouteObject 递归转换，去掉 hostRootLayout */
export function toRouteObjects(
  routes: FeatureRoute[],
  hydrateFallback?: ComponentType,
): RouteObject[] {
  return routes.map(({ hostRootLayout: _, children, handle, ...rest }) => {
    const route: RouteObject = {
      ...rest,
      ...(handle ? { handle } : {}),
      ...(children ? { children: toRouteObjects(children, hydrateFallback) } : {}),
      ...(hydrateFallback ? { HydrateFallback: hydrateFallback } : {}),
    } as RouteObject
    return route
  })
}
