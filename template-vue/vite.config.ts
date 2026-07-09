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
        codeSplitting: {
          groups: [
            { name: 'vendor-vue', test: /node_modules.*vue(?!-router)/ },
            { name: 'vendor-router', test: /node_modules.*vue-router/ },
            { name: 'vendor-pinia', test: /node_modules.*pinia/ },
            { name: 'vendor-vueuse', test: /node_modules.*@vueuse/ },
            { name: 'vendor', test: /node_modules/, minSize: 100 * 1024 },
          ],
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
