import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This proxy is needed to call the Vercel serverless function in development
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
