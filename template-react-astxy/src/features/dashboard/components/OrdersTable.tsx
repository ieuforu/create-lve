import { Card } from '@astryxdesign/core/Card'
import { Stack } from '@astryxdesign/core/Stack'
import { Heading } from '@astryxdesign/core/Heading'
import { Button } from '@astryxdesign/core/Button'
import { Badge } from '@astryxdesign/core/Badge'
import { Table, proportional } from '@astryxdesign/core/Table'
import { orders, statusMap, type Order } from '../../orders/data/orders'

const columns = [
  { key: 'id', header: '订单号', width: proportional(1) },
  { key: 'customer', header: '客户', width: proportional(1) },
  { key: 'email', header: '邮箱', width: proportional(2) },
  { key: 'amount', header: '金额', width: proportional(1) },
  {
    key: 'status',
    header: '状态',
    width: proportional(1),
    renderCell: (item: Order) => (
      <Badge variant={statusMap[item.status].variant} label={statusMap[item.status].label} />
    ),
  },
  { key: 'date', header: '日期', width: proportional(1) },
]

export function OrdersTable() {
  return (
    <>
      <Stack direction="horizontal" justify="between" align="center" gap={4}>
        <Heading level={3}>最近订单</Heading>
        <Button label="查看全部" variant="ghost" size="sm" />
      </Stack>

      <Card padding={0}>
        <Table
          data={orders}
          columns={columns}
          idKey="id"
          density="compact"
          hasHover
          dividers="rows"
        />
      </Card>
    </>
  )
}
