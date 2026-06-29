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
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-dom')) return 'vendor-react-dom'
          if (id.includes('react') && !id.includes('react-router') && !id.includes('react-dom'))
            return 'vendor-react'
          if (id.includes('react-router')) return 'vendor-router'
          if (id.includes('@tanstack')) return 'vendor-query'
          if (id.includes('radix-ui')) return 'vendor-radix'
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
