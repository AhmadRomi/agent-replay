import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 👈 Change this to whatever port you want
    strictPort: true, // 👈 Optional: If true, Vite fails if the port is already in use instead of automatically picking the next available port
  },
})
