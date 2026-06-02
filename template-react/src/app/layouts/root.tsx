import { Outlet } from 'react-router'

export default function RootLayout() {
  return (
    <div className="min-h-dvh">
      <Outlet />
    </div>
  )
}
