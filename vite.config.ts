import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/upload': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/upload/, '')
      },
    }
  },
  build: {
    manifest: true,
    sourcemap: true,
  },
})
