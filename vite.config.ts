import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@engine': resolve(__dirname, 'src/engine'),
      '@strategy': resolve(__dirname, 'src/strategy'),
      '@detective': resolve(__dirname, 'src/detective'),
      '@shared': resolve(__dirname, 'src/shared'),
    },
  },
  publicDir: 'public',
  base: './',
})
