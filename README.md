# sth-for-dad

React 19 + Vite 8 + TypeScript，部署在 GitHub Pages 上的移动端 H5 应用（安卓 PWA + 扫码）。

## 本地开发

```bash
npm install
npm run dev
```

`vite.config.ts` 里开了 `server.host = true`，dev server 会同时监听局域网地址。
手机连着同一个 Wi-Fi，直接访问终端里打印的 `Network:` 那个 IP 就能在真机上打开。

> ⚠️ 真机测摄像头扫码时不能直接用这个 HTTP 地址——浏览器只允许 HTTPS 或 localhost
> 调用摄像头。用 `npm run dev -- --host` 配合内网穿透（cloudflared / ngrok），
> 或者跑 `npm run build && npm run preview` 后同样做一层 HTTPS 代理。详见下方技术方案。

## 部署到 GitHub Pages

```bash
npm run deploy
```

这条命令做两件事：`vite build` 打出 `dist/`，然后 `gh-pages` 把 `dist/` 的内容
推到 `gh-pages` 分支。**首次部署后**要去仓库设置里选一次发布源：

> Settings → Pages → Build and deployment → Source 选 **Deploy from a branch**，
> Branch 选 **gh-pages** / **/(root)**，保存。

之后每次改完代码重新 `npm run deploy` 即可，Pages 大约一分钟后生效。
访问地址：<https://hitpc.github.io/sth-for-dad/>

### 为什么 dist 不进 main 分支

`.gitignore` 里保留了 `dist`。构建产物是压缩后的 js/css，每次改动都会产生一堆
无法阅读的 diff，塞进 main 的提交历史里没有意义。`gh-pages` 分支专门用来放这些
产物，`npm run deploy` 会自动维护它。main 分支只留源码。

### 为什么要有 `public/.nojekyll`

GitHub Pages 默认用 Jekyll 处理静态文件，Jekyll 会忽略所有以下划线开头的文件/目录。
Vite 目前不会生成这种名字，但加一个空 `.nojekyll` 文件可以让 Pages 跳过 Jekyll，
部署更快也不会哪天踩坑。

## 目录结构

```
public/          # 原样拷贝进 dist 的静态文件（.nojekyll、favicon）
src/
  main.tsx       # 入口
  App.tsx        # 根组件
  index.css      # 全局样式
  App.css        # App 组件样式
vite.config.ts   # base 路径 / 局域网调试开关都在这
```

## 注意事项：base 路径

站点挂在 `https://hitpc.github.io/sth-for-dad/` 这个**子路径**下，不是根路径。
所以：

- 生产构建的 `base` 必须是 `/sth-for-dad/`（已在 `vite.config.ts` 里按 `command` 区分）
- 代码里引用静态资源要用 `import.meta.env.BASE_URL` 拼接，不要写死 `/xxx.png`
- 如果以后加了 react-router，要用 `<BrowserRouter basename={import.meta.env.BASE_URL}>`，
  否则刷新子路由会 404（GitHub Pages 没有服务端 rewrite）
