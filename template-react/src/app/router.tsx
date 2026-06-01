import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet, Navigate } from 'react-router'

// ── 懒加载 ──
const lazyPage = (loader: () => Promise<{ default: React.ComponentType }>) => {
  const Component = lazy(loader)
  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  )
}

// ── 路由守卫 ──
function ProtectedRoute() {
  // TODO: 替换为你的 useAuthInit hook
  const isLogged = !!localStorage.getItem('token')

  if (!isLogged) return <Navigate to="/login" replace />
  return <Outlet />
}

// ── 布局 ──
function RootLayout() {
  return (
    <div className="min-h-dvh bg-white text-neutral-900 font-sans antialiased dark:bg-neutral-950 dark:text-neutral-100">
      <Outlet />
    </div>
  )
}

// ── 路由配置 ──
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: lazyPage(() => import('@/features/_example/pages/Example')),
      },
      // TODO: 在这里添加你的路由
      // { path: 'users', element: lazyPage(() => import('@/features/user/pages/UserList')) },
      // { path: 'users/:id', element: lazyPage(() => import('@/features/user/pages/UserDetail')) },
      // {
      //   path: 'dashboard',
      //   element: <ProtectedRoute />,
      //   children: [
      //     { index: true, element: lazyPage(() => import('@/features/dashboard/pages/Dashboard')) },
      //   ],
      // },
    ],
  },
])
