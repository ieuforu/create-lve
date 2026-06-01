// ── 示例 Service ──
// 只发请求，零状态，零 UI

import { http } from '@/lib/http'
import type { ExampleItem, ExampleListResponse } from '../types'

export const exampleService = {
  getList(params?: { page?: number; limit?: number }) {
    return http.get<ExampleListResponse>('/api/examples', { params })
  },

  getById(id: string) {
    return http.get<ExampleItem>(`/api/examples/${id}`)
  },

  create(data: Omit<ExampleItem, 'id'>) {
    return http.post<ExampleItem>('/api/examples', data)
  },

  delete(id: string) {
    return http.delete(`/api/examples/${id}`)
  },
}
