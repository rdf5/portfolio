import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' lets the built site live under any GitHub Pages path,
// e.g. https://<username>.github.io/portfolio/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // Keep artwork as real files instead of inlining it into the JS bundle.
    assetsInlineLimit: 0,
  },
})
