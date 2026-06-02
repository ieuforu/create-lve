import { defineConfig, loadEnv } from 'vite-plus'
import vue from '@vitejs/plugin-vue'

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
    vue(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('vue') && !id.includes('vue-router'))
            return 'vendor-vue'
          if (id.includes('vue-router')) return 'vendor-router'
          if (id.includes('pinia')) return 'vendor-pinia'
          if (id.includes('@vueuse')) return 'vendor-vueuse'
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
