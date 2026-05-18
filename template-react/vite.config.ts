import { defineConfig, loadEnv, lazyPlugins } from 'vite-plus'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

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
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
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
