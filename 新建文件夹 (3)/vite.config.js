import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      
   },
    open:true, 
    // 当前项目启动端口
    port: 3000,
    // 反向代理
    proxy: {
      // 以/api开头的请求都进行代理
      '/api': {
        // 代理目标
        target: 'http://47.115.219.192:8080',
        // 改变源
        changeOrigin: true,
        // 重写把/api置空
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    },
  }
})
