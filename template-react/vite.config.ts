import { defineConfig, loadEnv, lazyPlugins } from 'vite-plus'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'

const mode = process.env.NODE_ENV || 'development'
const env = loadEnv(mode, process.cwd(), '')

// https://vite.dev/config/
export default defineConfig({
  fmt: { semi: false, singleQuote: true },
  staged: {
    '*': 'vp check --fix',
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [
    /* VITE_PLUS_PLUGINS */
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
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react') && !id.includes('react-router')) return 'vendor-react'
          if (id.includes('react-dom')) return 'vendor-react-dom'
          if (id.includes('react-router')) return 'vendor-router'
          if (id.includes('@tanstack')) return 'vendor-query'
          if (id.includes('zustand')) return 'vendor-state'
          if (id.includes('jotai')) return 'vendor-atom'
          return 'vendor'
        },
      },
    },
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
})
