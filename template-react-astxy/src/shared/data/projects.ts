export interface Project {
  name: string
  progress: number
}

export const projects: Project[] = [
  { name: '移动端适配', progress: 85 },
  { name: 'API v3 重构', progress: 62 },
  { name: '数据看板', progress: 100 },
  { name: '用户反馈系统', progress: 34 },
]
