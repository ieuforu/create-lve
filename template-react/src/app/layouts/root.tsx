import { Outlet, useNavigation } from 'react-router'
import { Toaster } from 'sonner'

export default function RootLayout() {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  return (
    <div className="min-h-dvh flex flex-col">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-50/80 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-stone-600" />
        </div>
      )}

      <Outlet />

      <Toaster position="bottom-right" richColors visibleToasts={1} />
    </div>
  )
}
