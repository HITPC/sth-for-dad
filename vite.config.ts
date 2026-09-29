import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages 的项目站点挂在 https://<user>.github.io/<repo>/ 这种子路径下，
  // 所以生产构建必须带上仓库名前缀，否则 index.html 里引用的静态资源全会 404。
  // 本地 dev 仍走根路径，省得每次都得手动访问 /sth-for-dad/。
  base: command === 'build' ? '/sth-for-dad/' : '/',
  plugins: [react()],
  server: {
    // 监听 0.0.0.0，方便同局域网下的安卓手机直接开 IP 调试（扫码功能必须真机测）
    host: true,
  },
}))
