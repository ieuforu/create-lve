import { Provider as JotaiProvider } from 'jotai'
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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="bottom-right" richColors visibleToasts={1} />
      </QueryClientProvider>
    </JotaiProvider>
  )
}
