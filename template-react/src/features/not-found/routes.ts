import { lazyRoute } from '@/app/types'

const routes = [lazyRoute('*', () => import('./pages'))]

export default routes
