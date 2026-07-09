import { lazyRoute } from '@/app/types'

const routes = [lazyRoute('/', () => import('./pages'), true)]

export default routes
