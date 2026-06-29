import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Point publicDir to the root monorepo public folder where the catalog engine outputs files
  publicDir: path.resolve(__dirname, '../public'),
  server: {
    port: 5173,
    strictPort: true
  }
})
