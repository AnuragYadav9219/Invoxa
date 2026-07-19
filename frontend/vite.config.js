import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(
          new URL("./index.html", import.meta.url)
        ),

        pdf: fileURLToPath(
          new URL("./pdf.html", import.meta.url)
        ),
      },
    },
  },
});