import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/bibliotech-frontend/',
  plugins: [vue()],
})
