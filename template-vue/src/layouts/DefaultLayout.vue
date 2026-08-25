<script setup lang="ts">
import AppNav from '../components/AppNav.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppNav />
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
      <p>Vue Template &copy; {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>
