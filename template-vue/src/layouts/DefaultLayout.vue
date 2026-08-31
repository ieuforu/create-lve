<script setup lang="ts">
import AppNav from '@/components/AppNav.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <AppNav />
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t py-6 text-center text-sm text-muted-foreground">
      <p>VueApp &copy; {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>
