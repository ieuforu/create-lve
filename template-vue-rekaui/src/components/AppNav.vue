<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const mobileOpen = ref(false)

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/about', label: '关于' },
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
    <div class="mx-auto max-w-5xl flex items-center justify-between px-4 h-14">
      <!-- Logo -->
      <RouterLink to="/" class="text-lg font-bold text-gray-900 tracking-tight">
        🚀 Vue Template
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden sm:flex items-center gap-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          :class="
            route.path === link.to
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          "
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Mobile toggle -->
      <button
        class="sm:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
        @click="mobileOpen = !mobileOpen"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="!mobileOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile nav -->
    <nav v-if="mobileOpen" class="sm:hidden border-t border-gray-100 bg-white px-4 py-2">
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="block px-3 py-2 rounded-md text-sm font-medium transition-colors"
        :class="
          route.path === link.to ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
        "
        @click="mobileOpen = false"
      >
        {{ link.label }}
      </RouterLink>
    </nav>
  </header>
</template>
