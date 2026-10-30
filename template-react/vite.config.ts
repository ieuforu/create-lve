import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        /*
          如果和后端路径不一致，则用下面的
          等价于 /api/users  →  http://localhost:3000/users
        */
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // Browser support is independent of TypeScript's target.
  build: { target: ['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4'] },
})
