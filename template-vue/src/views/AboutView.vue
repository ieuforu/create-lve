<script setup lang="ts">
import { useTimeAgo } from '../composables/useTimeAgo'

const { timeAgo } = useTimeAgo()
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-16">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">关于</h1>

    <div class="prose prose-gray max-w-none">
      <p class="text-gray-600 leading-relaxed mb-6">
        这是一个自用的 Vue 3 项目模板，用于快速启动新的前端项目。
        所有工具链已经配置好，你可以直接在此基础上开发业务功能。
      </p>

      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">项目结构</h2>
        <pre class="text-sm text-gray-600 bg-gray-50 rounded-lg p-4 overflow-x-auto">
          <code>src/
            ├── assets/        # 静态资源
            ├── components/    # 公共组件
            ├── composables/   # 组合式函数
            ├── layouts/       # 布局组件
            ├── router/        # 路由配置
            ├── stores/        # Pinia 状态管理
            ├── views/         # 页面视图
            ├── App.vue        # 根组件
            └── main.ts        # 入口文件
         </code>
        </pre>
      </div>

      <p class="text-sm text-gray-400 mt-6">模板创建于 {{ timeAgo }}</p>
    </div>
  </div>
</template>
