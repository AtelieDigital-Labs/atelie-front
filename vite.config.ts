import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api/v1/catalog": {
        target: "http://localhost:8008",
        changeOrigin: true,
      },
      "/api/v1/accounts": {
        target: "http://localhost:8001",
        changeOrigin: true,
      },  
      "/api/v1/ia": {
        target: "http://localhost:8002",
        changeOrigin: true,
      },
      "/api/v1": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  }
})
