import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(moduleId) {
          if (/node_modules\/(react|react-dom|scheduler)\b/.test(moduleId)) return 'vendor-react'
          if (/node_modules\/@tanstack\//.test(moduleId)) return 'vendor-tanstack'
          if (/node_modules\/jotai\//.test(moduleId)) return 'vendor-state'
          return null
        },
      },
    },
  },
})
