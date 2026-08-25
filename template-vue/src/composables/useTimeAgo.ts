import { ref, onMounted } from 'vue'

export function useTimeAgo() {
  const timeAgo = ref('')

  onMounted(() => {
    const now = new Date()
    timeAgo.value = now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  })

  return { timeAgo }
}
