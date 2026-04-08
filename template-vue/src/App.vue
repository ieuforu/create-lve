<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div
    class="max-w-7xl mx-auto p-8 text-center font-sans antialiased text-[#213547] dark:text-zinc-200 min-h-dvh flex flex-col justify-center"
  >
    <div class="flex justify-center gap-12 mb-12">
      <a
        href="https://viteplus.dev"
        target="_blank"
        class="transition-filter duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]"
      >
        <img src="/favicon.svg" class="h-24 p-6" alt="VitePlus logo" />
      </a>
      <a
        href="https://vuejs.org/"
        target="_blank"
        class="transition-filter duration-300 hover:drop-shadow-[0_0_2em_#42b883aa]"
      >
        <img src="./assets/vue.svg" class="h-24 p-6" alt="Vue logo" />
      </a>
    </div>

    <h1 class="text-5xl font-bold leading-[1.1] mb-8">VitePlus + Vue</h1>

    <div class="p-8 space-y-4">
      <button
        type="button"
        @click="count++"
        class="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium bg-[#f9f9f9] dark:bg-zinc-800 cursor-pointer transition-colors hover:border-[#646cff] outline-none"
      >
        count is {{ count }}
      </button>
      <p class="text-zinc-500">
        Edit
        <code class="bg-[#f1f1f1] dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono"
          >src/App.vue</code
        >
        to test HMR
      </p>
    </div>

    <p class="text-[#888] mt-8">
      Check out
      <a
        href="https://github.com/voidzero-dev/vite-plus"
        target="_blank"
        class="font-medium text-[#646cff] hover:text-[#535bf2]"
        >VitePlus</a
      >, the unified toolchain for the web.
    </p>

    <p class="text-[#888] mt-4 text-sm">Click on the VitePlus and Vue logos to learn more</p>
  </div>
</template>

<style scoped></style>
