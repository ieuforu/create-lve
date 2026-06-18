import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const mode = process.env.NODE_ENV || 'development'
const env = loadEnv(mode, process.cwd(), '')

// OXC — Rust native, experimental
function oxcReactCompiler(): Plugin {
  return {
    name: 'oxc-react-compiler',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\.[tj]sx$/.test(id)) return
      const { transform } = await import('oxc-transform')
      const result = await transform(id, code, {
        jsx: { runtime: 'automatic' },
        reactCompiler: { target: '19' },
      })
      return { code: result.code, map: result.map }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    /* VITE_PLUS_PLUGINS */
    oxcReactCompiler(),
    react(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // pnpm: node_modules/.pnpm/pkg@ver/node_modules/real-pkg/...
          // npm:  node_modules/real-pkg/...
          const match = id.match(
            /node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?(@[^/]+\/[^/]+|[^/]+)/,
          )
          const pkg = match?.[1]
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
