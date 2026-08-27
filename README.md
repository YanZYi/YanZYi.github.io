# YanZYi.github.io — Yan Home 个人网站

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&pause=1000&width=500&lines=A+Personal+Website+For+Zhengyi+Yan+%5Ev%5E)](https://git.io/typing-svg)

基于 **Next.js** 构建的个人网站与博客，静态导出部署于 **GitHub Pages**。支持动态主题（粒子背景 / 内容透明度 / 主题色自定义）、GFM + LaTeX 增强的 Markdown 渲染与在线写作。

## 📬 联系方式

[![Bilibili](https://img.shields.io/badge/dynamic/json?style=for-the-badge&label=Bilibili+Fans&labelColor=FE7398&color=282c34&query=$.data.follower&url=https://api.bilibili.com/x/relation/stat?vmid=3546887797869252&longCache=true&logo=bilibili&logoColor=white)](https://space.bilibili.com/3546887797869252)
[![Github](https://img.shields.io/badge/dynamic/json?style=for-the-badge&label=GitHub+Followers&suffix=%20&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dgithub%26queryKey%3DYanZYi&labelColor=282c34&color=353940&logo=github&longCache=true)](https://github.com/YanZYi)

📮 **email:** yanzhyii@outlook.com

---

## 🧱 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | [Next.js 16](https://nextjs.org/)（App Router）+ React 19 + TypeScript |
| 样式 | [Tailwind CSS v4](https://tailwindcss.com/)（CSS-first 配置）+ CSS 变量动态主题 |
| 内容 | Markdown + YAML frontmatter（`gray-matter` 解析） |
| Markdown 渲染 | `react-markdown` + `remark-gfm` + `remark-math` + `rehype-katex` + `rehype-highlight` |
| 数学公式 | [KaTeX](https://katex.org/) |
| 代码高亮 | [highlight.js](https://highlightjs.org/) |
| 粒子背景 | 自研 Canvas 粒子系统（替代 particles.js） |
| 图标 | [lucide-react](https://lucide.dev/) |
| 部署 | GitHub Pages + GitHub Actions（静态导出 `output: "export"`） |

## 📁 目录结构

```
.
├── app/                  # 页面（App Router）
│   ├── layout.tsx        # 根布局：主题提供者 + 背景/粒子 + 侧边栏 + 页脚 + 设置面板
│   ├── page.tsx          # 首页（Hero + 最新文章）
│   ├── posts/            # 文章归档列表
│   ├── posts/[slug]/     # 文章详情（generateStaticParams 静态生成）
│   ├── about/            # 关于我
│   ├── write/            # 写作编辑器（生成 Markdown 文件）
│   ├── not-found.tsx     # 404
│   └── globals.css       # Tailwind + 主题变量映射 + 排版样式
├── components/
│   ├── ThemeProvider.tsx # 主题上下文（localStorage 持久化 + CSS 变量）
│   ├── SettingsPanel.tsx # 外观设置面板（背景/透明度/主题色/赛博网格）
│   ├── BackgroundLayers.tsx
│   ├── Particles.tsx     # 增强 Canvas 粒子系统
│   ├── Sidebar.tsx / Footer.tsx / PostCard.tsx
│   └── Markdown.tsx      # Markdown 渲染（GFM + KaTeX + 高亮 + 复制）
├── content/posts/        # 博客文章（Markdown + frontmatter）
├── lib/posts.ts          # 构建时读取文章的辅助函数
└── public/               # 静态资源（头像、favicon 等）
```

## 🚀 本地开发

环境要求：Node.js ≥ 20

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:3000）
npm run dev

# 生产构建（静态导出到 out/）
npm run build

# 本地预览构建产物
npx serve out
```

## ✍️ 文章管理

### frontmatter 字段

文章存放于 `content/posts/<slug>.md`，头部 YAML 元数据如下：

```yaml
---
title: "文章标题"
date: "2026-08-27"        # 日期，用于排序与展示
author: "严正易"
tags: ["前端", "JavaScript"]
read: "5 分钟"             # 可选：阅读时长
excerpt: "文章摘要"         # 可选：显示在列表页
---
```

### 写作流程

1. 访问 `/write` 页面（或本地 `npm run dev` 后打开 `http://localhost:3000/write`）；
2. 填写标题、slug、标签、正文等，右侧实时预览渲染效果；
3. 点击「下载 .md 文件」或「复制全文」；
4. 将文件放入 `content/posts/` 目录，commit 并 push 到 `main` 分支；
5. GitHub Actions 自动构建并部署到 GitHub Pages。

### Markdown 特性

- **GFM**：表格、任务列表、删除线、脚注、自动链接
- **LaTeX 数学公式**：行内 `$E=mc^2$`，块级 `$$...$$`
- **代码语法高亮**：支持 JS/TS/Python/C++ 等 highlight.js 语言，代码块带一键复制按钮

```js
// 示例代码块
const greet = (name) => `Hello, ${name}!`;
console.log(greet("Yan"));
```

$$ \int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2} $$

## 🎨 主题自定义

页面右下角的齿轮按钮可打开「外观设置」面板，所有设置保存在浏览器 `localStorage`：

| 设置项 | 说明 |
| --- | --- |
| 背景 | 6 组渐变预设、纯色、上传自定义背景图片 |
| 内容透明度 | 滑块调节卡片/侧边栏的透明度（0.2–1） |
| 主题色 | 主色 / 辅助色 / 强调色，RGB 取色器 |
| 赛博网格 | 开启/关闭背景网格叠加层 |

实现机制：设置写入 `:root` 的 CSS 变量（`--theme-primary`、`--theme-accent`、`--content-opacity` 等），Tailwind 通过 `@theme inline` 将颜色工具类直接映射到这些变量，实现运行时无刷新换肤；粒子颜色同步读取 `--theme-primary`。

## 🔧 部署流程

`.github/workflows/deploy.yml` 定义了 CI/CD：

1. 推送 `main` 分支（或手动触发 `workflow_dispatch`）；
2. `setup-node` + `npm ci` 安装依赖；
3. `npm run build` 生成静态文件到 `out/`；
4. `upload-pages-artifact` 上传产物，`deploy-pages` 部署到 GitHub Pages。

> 关键配置：`next.config.ts` 中 `output: "export"` 开启静态导出，`images.unoptimized: true`（静态导出不支持图片优化服务），`trailingSlash: true` 生成兼容 GitHub Pages 的目录式路径。

## 📝 技术要点

- **静态导出 + 动态主题**：站点本身为纯静态，主题定制完全在前端通过 CSS 变量完成，无需后端；
- **构建时文章读取**：`lib/posts.ts` 使用 `gray-matter` 在构建时解析 `content/posts/` 下的 Markdown，`generateStaticParams` 为每篇文章预渲染页面；
- **粒子性能**：Canvas + `requestAnimationFrame`，按设备像素比缩放、监听窗口 resize、卸载时清理动画帧与事件监听；
- **安全**：写作编辑器只输出文本文件，前端渲染由 react-markdown 处理（无 `dangerouslySetInnerHTML` 注入点）。
