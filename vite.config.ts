import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/habbits_for_child/' : '/',
  server: {
    host: true, // 允许外部访问，便于移动设备测试
    port: 3000,
  },
  build: {
    target: 'es2015', // 确保iOS Safari兼容性
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
          'router-vendor': ['react-router-dom']
        }
      }
    },
    cssCodeSplit: true,
    sourcemap: false, // 生产环境关闭sourcemap以减少包大小
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'antd', '@ant-design/icons', 'react-router-dom']
  },
  define: {
    // 环境变量
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  }
})
