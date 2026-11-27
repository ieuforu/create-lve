import { createSignal, onSettled } from 'solid-js'

export const papers = [
  { value: 'uncoated', label: '自然纸' },
  { value: 'coated', label: '铜版纸' },
  { value: 'recycled', label: '再生纸' },
]
const initialProfile = {
  name: 'Forma Studio',
  intro: '我们用纸张、字形和几何图案，记录印刷中的细小变化。',
  paper: 'uncoated',
}
export type StudioProfile = typeof initialProfile
const key = 'forma:studio-profile'
export function useStudioProfile() {
  const [profile, setProfile] = createSignal(initialProfile)
  onSettled(() => {
    try {
      const value = JSON.parse(localStorage.getItem(key) ?? 'null')
      if (
        value &&
        typeof value.name === 'string' &&
        value.name.trim() &&
        typeof value.intro === 'string' &&
        papers.some((p) => p.value === value.paper)
      ) {
        setProfile({ name: value.name, intro: value.intro, paper: value.paper })
      }
    } catch {
      /* Use the sample profile if storage is unavailable. */
    }
  })
  function save(next: StudioProfile) {
    setProfile(next)
    try {
      localStorage.setItem(key, JSON.stringify(next))
      return true
    } catch {
      return false
    }
  }
  return { profile, save }
}

export const works = [
  {
    id: 'fold',
    title: '折线练习',
    print: 'Fold',
    category: '海报',
    series: 'Fold Studies',
    format: 'A2 · 420 × 594 mm',
    note: '以连续折线模拟纸面起伏，观察套印后线条交界处的深浅变化。',
  },
  {
    id: 'orbit',
    title: '轨道色样',
    print: 'Orbit',
    category: '色彩',
    series: 'Orbit Editions',
    format: 'A4 · 210 × 297 mm',
    note: '用偏心圆排列暖色油墨，对照实地色与纸白之间的视觉重量。',
  },
  {
    id: 'type',
    title: '字距手册',
    print: 'Aa',
    category: '书刊',
    series: 'Letter Archive',
    format: 'B5 · 176 × 250 mm',
    note: '将同一组字形按不同字距排印，装订为可翻阅的版式样本。',
  },
] as const

export const files = [
  { name: '折线练习', format: 'PDF', stage: '校对中', date: '11.26', size: '4.2 MB' },
  { name: '轨道色样', format: 'PDF', stage: '已定稿', date: '11.24', size: '2.8 MB' },
  { name: '字距手册', format: 'INDD', stage: '草稿', date: '11.22', size: '8.1 MB' },
  { name: '折页打样', format: 'PDF', stage: '校对中', date: '11.19', size: '3.6 MB' },
  { name: '双色印刷测试', format: 'TIFF', stage: '已定稿', date: '11.16', size: '12.4 MB' },
  { name: '版式索引', format: 'PDF', stage: '草稿', date: '11.12', size: '1.7 MB' },
] as const
