import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/sics-official/",   // <-- EXACT REPO NAME
  plugins: [react()],
})
