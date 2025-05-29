import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3001, // Frontend runs on 3001
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend runs on 3000
        changeOrigin: true,
      },
    },
  },
  define: {
    'process.env': {}
  }
})