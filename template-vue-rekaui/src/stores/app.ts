import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // state
  const count = ref(0)
  const name = ref('Vue Template')

  // getters
  const doubleCount = computed(() => count.value * 2)

  // actions
  function increment() {
    count.value++
  }

  function decrement() {
    if (count.value > 0) count.value--
  }

  function reset() {
    count.value = 0
  }

  return { count, name, doubleCount, increment, decrement, reset }
})
