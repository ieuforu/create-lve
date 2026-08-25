<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  desc: string
}>()
</script>

<template>
  <div
    class="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md hover:border-gray-300"
  >
    <div class="text-2xl mb-3">{{ icon }}</div>
    <h3 class="font-semibold text-gray-900 mb-1">{{ title }}</h3>
    <p class="text-sm text-gray-500 leading-relaxed">{{ desc }}</p>
  </div>
</template>
