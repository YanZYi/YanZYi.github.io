# 你好，Yan Home 博客上线了

欢迎来到我的个人博客！这是站点的第一篇文章，简单记录一下这个博客的搭建过程。

## 为什么自己搭博客

虽然现在有很多成熟的博客平台，但拥有一块完全由自己掌控的"自留地"，依然是一件让人愉快的事：

- **完全自定义**：视觉风格、交互细节都可以按自己的想法来；
- **写作即代码**：文章用 Markdown 书写，可纳入版本管理；
- **零托管成本**：借助 GitHub Pages，可以免费部署静态站点。

> 这个博客整体沿用了我之前个人主页的视觉风格——粒子背景、渐变配色和毛玻璃卡片，同时把布局重构为了更适合内容阅读的"侧边栏 + 主内容区"结构。

## 技术实现

整个站点只使用原生 HTML / CSS / JavaScript，没有引入任何前端框架，核心依赖只有两个：

| 依赖 | 作用 |
| --- | --- |
| [marked](https://marked.js.org/) | 将 Markdown 文本解析为 HTML |
| [DOMPurify](https://github.com/cure53/DOMPurify) | 对渲染后的 HTML 做 XSS 过滤，保证安全 |

文章以 `.md` 文件形式存放在 `posts/` 目录，并通过一个 `index.json` 维护元数据（标题、日期、标签、摘要等）。前端通过 `fetch` 动态加载并渲染，支持 GFM 特性（表格、任务列表、代码块等）。

```js
// 渲染流程示意
const md = await fetch('posts/hello-blog.md').then(r => r.text());
const html = DOMPurify.sanitize(marked.parse(md));
document.getElementById('postBody').innerHTML = html;
```

## 后续计划

- [x] 完成博客基础框架与 Markdown 渲染
- [ ] 增加代码高亮（如 Prism / highlight.js）
- [ ] 支持文章按标签筛选
- [ ] 优化移动端阅读体验

感谢你的到访，后续我会在这里持续更新前端学习笔记与技术思考 ✨
