import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(),  tailwindcss(),],

   server: {
    // This ensures that Vite handles client-side routes correctly
    fs: {
      strict: false,
    },
  },
  // Optional: set base if deploying to subfolder
  base: '/',

})
