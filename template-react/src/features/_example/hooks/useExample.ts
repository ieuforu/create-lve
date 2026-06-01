// ── 示例 Hooks ──
// 编排层：调 services/stores → 处理状态 → 供页面使用

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { exampleService } from '../services/example.service'

export function useExampleList(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['examples', params],
    queryFn: () => exampleService.getList(params),
  })
}

export function useDeleteExample() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => exampleService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['examples'] }),
  })
}
