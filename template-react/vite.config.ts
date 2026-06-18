import { defineConfig, loadEnv, lazyPlugins } from 'vite-plus'
import react from '@vitejs/plugin-react'

const mode = process.env.NODE_ENV || 'development'
const env = loadEnv(mode, process.cwd(), '')
// React Compiler: true = OXC (Rust native, experimental), false = Babel (official, stable)
const USE_OXC = true

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
      if (USE_OXC) {
        const { transform } = await import('oxc-transform')
        return [
          {
            name: 'oxc-react-compiler',
            enforce: 'pre',
            transform(code, id) {
              if (!/\.[tj]sx$/.test(id)) return
              const result = transform(id, code, {
                jsx: { runtime: 'automatic' },
                reactCompiler: { target: '19' },
              })
              return { code: result.code, map: result.map }
            },
          },
        ]
      } else {
        const { reactCompilerPreset } = await import('@vitejs/plugin-react')
        const { default: babel } = await import('@rolldown/plugin-babel')
        return [
          babel({
            presets: [reactCompilerPreset()],
          }),
        ]
      }
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
          const pkg = id.match(/node_modules\/(?:@[^/]+\/)?([^/]+)/)?.[1]
          if (pkg === 'react') return 'vendor-react'
          if (pkg === 'react-dom') return 'vendor-react-dom'
          if (pkg === 'react-router') return 'vendor-router'
          if (id.includes('@tanstack')) return 'vendor-query'
          if (pkg === 'zustand') return 'vendor-state'
          if (pkg === 'jotai') return 'vendor-atom'
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
