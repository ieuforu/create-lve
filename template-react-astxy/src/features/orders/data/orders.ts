export type OrderStatus = 'completed' | 'processing' | 'pending' | 'cancelled'

export interface Order extends Record<string, unknown> {
  id: string
  customer: string
  email: string
  amount: string
  status: OrderStatus
  date: string
}

export const statusMap: Record<
  OrderStatus,
  { label: string; variant: 'success' | 'info' | 'warning' | 'error' }
> = {
  completed: { label: '已完成', variant: 'success' },
  processing: { label: '处理中', variant: 'info' },
  pending: { label: '待处理', variant: 'warning' },
  cancelled: { label: '已取消', variant: 'error' },
}

export const orders: Order[] = [
  {
    id: '#ORD-7821',
    customer: '张三',
    email: 'zhangsan@example.com',
    amount: '¥1,280',
    status: 'completed',
    date: '2025-08-14',
  },
  {
    id: '#ORD-7820',
    customer: '李四',
    email: 'lisi@example.com',
    amount: '¥960',
    status: 'processing',
    date: '2025-08-14',
  },
  {
    id: '#ORD-7819',
    customer: '王五',
    email: 'wangwu@example.com',
    amount: '¥2,450',
    status: 'completed',
    date: '2025-08-13',
  },
  {
    id: '#ORD-7818',
    customer: '赵六',
    email: 'zhaoliu@example.com',
    amount: '¥380',
    status: 'pending',
    date: '2025-08-13',
  },
  {
    id: '#ORD-7817',
    customer: '钱七',
    email: 'qianqi@example.com',
    amount: '¥1,720',
    status: 'cancelled',
    date: '2025-08-12',
  },
  {
    id: '#ORD-7816',
    customer: '孙八',
    email: 'sunba@example.com',
    amount: '¥890',
    status: 'completed',
    date: '2025-08-12',
  },
]
