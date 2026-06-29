import type { RouteObject } from 'react-router'

/** Feature route config — supports `layout: false` to bypass RootLayout */
export interface FeatureRoute extends Omit<RouteObject, 'children'> {
  /** false = 不挂在 RootLayout 下，默认 true */
  layout?: boolean
}
