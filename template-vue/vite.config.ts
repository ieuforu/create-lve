import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 10000,
          groups: [
            {
              name: 'vendor-vue',
              test: /node_modules[/]vue(?!-router)/,
              priority: 35,
            },
            {
              name: 'vendor-router',
              test: /node_modules[/]vue-router/,
              priority: 30,
            },
            {
              name: 'vendor-ui',
              test: /node_modules[/](reka-ui|shadcn-vue)/,
              priority: 25,
            },
            {
              name: 'vendor-state',
              test: /node_modules[/]pinia/,
              priority: 20,
            },
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
