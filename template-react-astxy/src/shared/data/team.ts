export interface TeamMember {
  name: string
  role: string
  status: 'online' | 'away' | 'offline'
}

export const team: TeamMember[] = [
  { name: 'Alice Chen', role: '产品经理', status: 'online' },
  { name: 'Bob Wang', role: '前端工程师', status: 'online' },
  { name: 'Carol Li', role: '设计师', status: 'away' },
  { name: 'David Zhang', role: '后端工程师', status: 'offline' },
]
