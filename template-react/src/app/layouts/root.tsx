import { Outlet } from 'react-router'

export default function RootLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Outlet />
    </div>
  )
}
