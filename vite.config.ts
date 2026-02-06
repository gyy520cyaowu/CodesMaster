
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 设置为 './' 或你的仓库名，确保打包后的资源路径正确
  base: './', 
})
