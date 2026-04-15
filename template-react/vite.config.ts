import { defineConfig } from "vite-plus"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  fmt: { semi: false, singleQuote: true},
  staged: {
    "*": "vp check --fix",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", { target: "19" }]
        ],
      },
    } as any),
  ],
});
