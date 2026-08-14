import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      // autoCodeSplitting: true,
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

  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 10000,
          groups: [
            {
              name: 'vendor-react-dom',
              test: /node_modules[\/]react-dom/,
              priority: 40,
            },
            {
              name: 'vendor-react',
              test: /node_modules[\/]react(?!-dom)/,
              priority: 35,
            },
            {
              name: 'vendor-router',
              test: /node_modules[\/]@tanstack[\/]react-router/,
              priority: 30,
            },
            {
              name: 'vendor-query',
              test: /node_modules[\/]@tanstack[\/]react-query/,
              priority: 25,
            },
            {
              name: 'vendor-astryx',
              test: /node_modules[\/]@astryxdesign/,
              priority: 20,
            },
            {
              name: 'vendor-stylex',
              test: /node_modules[\/]@stylexjs/,
              priority: 15,
            },
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
})
