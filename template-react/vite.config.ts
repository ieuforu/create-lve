import { defineConfig, loadEnv, lazyPlugins, type Plugin } from 'vite-plus'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'

const mode = process.env.NODE_ENV || 'development'
const env = loadEnv(mode, process.cwd(), '')

// https://vite.dev/config/
export default defineConfig({
  fmt: { semi: false, singleQuote: true },
  lint: { options: { typeAware: true, typeCheck: true } },
  staged: {
    '*': 'vp check --fix',
  },
  plugins: [
    /* VITE_PLUS_PLUGINS */
    react(),
    // lazyPlugins 返回类型与 Vite plugins 字段类型不兼容
    // 上游 issue: vitejs/vite#22085，官方确认为已知问题
    // see: https://github.com/voidzero-dev/vite-plus/pull/1215
    lazyPlugins(async () => {
      const { default: babel } = await import('@rolldown/plugin-babel')
      return [
        babel({
          presets: [reactCompilerPreset()],
        }),
      ]
    }) as Plugin[],
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'vendor-react-dom', test: /node_modules.*react-dom/ },
            { name: 'vendor-react', test: /node_modules.*react(?!-dom|-router)/ },
            { name: 'vendor-router', test: /node_modules.*react-router/ },
            { name: 'vendor-query', test: /node_modules.*@tanstack/ },
            { name: 'vendor-radix', test: /node_modules.*radix-ui/ },
            { name: 'vendor-state', test: /node_modules.*zustand/ },
            { name: 'vendor-atom', test: /node_modules.*jotai/ },
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
