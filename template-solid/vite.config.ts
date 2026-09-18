import { defineConfig } from 'vitest/config'
import solid from '@solidjs/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({ target: 'solid', autoCodeSplitting: true }),
    solid({ start: true }),
  ],
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest-setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    isolate: false,
  },
})
