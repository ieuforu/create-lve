<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'
import FeatureCard from '../components/FeatureCard.vue'

const appStore = useAppStore()
const { count, doubleCount } = storeToRefs(appStore)

const features = [
  { icon: '⚡', title: 'Vite 8', desc: '极速的开发体验与构建速度' },
  { icon: '🧩', title: 'Vue 3 + TS', desc: 'Composition API + 类型安全' },
  { icon: '🎨', title: 'Tailwind CSS 4', desc: '实用优先的原子化样式' },
  { icon: '🧱', title: 'Reka UI', desc: '高质量无头组件库' },
  { icon: '📦', title: 'Pinia', desc: '直觉式的状态管理' },
  { icon: '🔀', title: 'Vue Router 5', desc: '路由懒加载' },
  { icon: '📏', title: 'OxLint', desc: 'Rust 驱动的极速 linter' },
]
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-16">
    <!-- Hero -->
    <section class="text-center mb-16">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Vue 3 项目模板</h1>
      <p class="text-lg text-gray-500 max-w-xl mx-auto mb-8">
        一个开箱即用的 Vue 3 + TypeScript 模板，集成了常用工具链，帮你快速开始新项目。
      </p>

      <!-- Counter demo (Pinia) -->
      <div
        class="inline-flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <button
          class="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors"
          @click="appStore.decrement()"
        >
          −
        </button>
        <div class="text-center min-w-[80px]">
          <div class="text-xl font-bold text-gray-900">{{ count }}</div>
          <div class="text-xs text-gray-400">×2 = {{ doubleCount }}</div>
        </div>
        <button
          class="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
          @click="appStore.increment()"
        >
          +
        </button>
        <button
          class="px-3 py-2 rounded-lg bg-gray-100 text-gray-500 text-xs hover:bg-gray-200 transition-colors"
          @click="appStore.reset()"
        >
          重置
        </button>
      </div>
    </section>

    <!-- Features -->
    <section>
      <h2 class="text-2xl font-semibold text-gray-900 mb-6 text-center">内置技术栈</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard
          v-for="f in features"
          :key="f.title"
          :icon="f.icon"
          :title="f.title"
          :desc="f.desc"
        />
      </div>
    </section>
  </div>
</template>
