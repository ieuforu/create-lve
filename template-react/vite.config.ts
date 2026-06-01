import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv, lazyPlugins } from 'vite-plus'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'

const mode = process.env.NODE_ENV || 'development'
const env = loadEnv(mode, process.cwd(), '')

export default defineConfig({
  fmt: { semi: false, singleQuote: true },
  staged: {
    '*': 'vp check --fix',
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [
    tailwindcss(),
    react(),
    lazyPlugins(async () => {
      const { default: babel } = await import('@rolldown/plugin-babel')
      return [
        babel({
          presets: [reactCompilerPreset()],
        }),
      ]
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    proxy: {
      '/api': {
        target: env.VITE_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('/react-dom/')) return 'vendor-react-dom'
          if (id.includes('/react/') && !id.includes('react-router')) return 'vendor-react'

          if (id.includes('react-router')) return 'vendor-router'
          if (id.includes('@tanstack/react-query')) return 'vendor-query'
          if (id.includes('zustand')) return 'vendor-zustand'
          if (id.includes('jotai')) return 'vendor-jotai'

          if (
            id.includes('tailwind-merge') ||
            id.includes('clsx') ||
            id.includes('class-variance-authority')
          )
            return 'vendor-style-utils'

          return 'vendor-misc'
        },
      },
    },
  },
})
