import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { configureServer } from './server.js'

// https://vite.dev/config/
export default defineConfig({
  publicPath: process.env.NODE_ENV === 'production' 
  ? '/eam_demo/' 
  : '/',
  plugins: [
    vue(),
    vueDevTools(),
    {
      name: 'configure-server',
      configureServer
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
