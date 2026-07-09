import { createStore, Provider as JotaiProvider } from 'jotai'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

/** Jotai store — 在 React 外创建，生命周期不绑定组件树 */
export const jotaiStore = createStore()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider store={jotaiStore}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="bottom-right" richColors visibleToasts={1} />
      </QueryClientProvider>
    </JotaiProvider>
  )
}
