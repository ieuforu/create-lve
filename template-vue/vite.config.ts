import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), vue()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 10000,
          groups: [
            {
              name: 'vendor-vue',
              test: /node_modules[/]vue(?!-router)/,
              priority: 35,
            },
            {
              name: 'vendor-router',
              test: /node_modules[/]vue-router/,
              priority: 30,
            },
            {
              name: 'vendor-ui',
              test: /node_modules[/]reka-ui/,
              priority: 25,
            },
            {
              name: 'vendor-state',
              test: /node_modules[/]pinia/,
              priority: 20,
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
