// ── 示例类型定义 ──
// 每个 feature 模块的类型放这里，层与层之间通过类型契约通信

export interface ExampleItem {
  id: string
  name: string
}

export interface ExampleListResponse {
  data: ExampleItem[]
  total: number
}
