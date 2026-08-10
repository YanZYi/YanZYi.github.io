/* ========== 粒子背景 ========== */
window.__scriptLoaded = true;
if (typeof particlesJS === 'function') {
particlesJS('particles-js', {
    particles: {
        number: { value: 70, density: { enable: true, value_area: 800 } },
        color: { value: "#6a11cb" },
        shape: { type: "circle" },
        opacity: { value: 0.45, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#6a11cb", opacity: 0.35, width: 1 },
        move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
    },
    interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true }
    },
    retina_detect: true
});
}

/* ========== 工具函数 ========== */
const $ = (s) => document.querySelector(s);
const contentEl = $('#content');

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toISOString().slice(0, 10);
}

function setActiveLink(route) {
    document.querySelectorAll('.side-link').forEach(a => {
        a.classList.toggle('active', a.dataset.route === route);
    });
}

/* marked 配置：启用 GitHub 风格渲染 */
marked.setOptions({
    gfm: true,
    breaks: true,
    headerIds: true,
    mangle: false
});

/* 渲染 Markdown 文本为安全的 HTML */
function renderMarkdown(md) {
    const rawHtml = marked.parse(md || '');
    return DOMPurify.sanitize(rawHtml);
}

/* ========== 视图渲染 ========== */

// 首页
function renderHome(posts) {
    setActiveLink('home');
    const recent = posts.slice(0, 5);
    contentEl.innerHTML = `
        <section class="card hero-card">
            <h1>欢迎来到 Yan Home</h1>
            <p>全栈开发 · 创意技术 · 算法设计 —— 这里记录我的学习笔记与技术思考。</p>
            <div class="hero-stats">
                <div class="stat"><div class="num">${posts.length}</div><div class="label">篇文章</div></div>
                <div class="stat"><div class="num">${new Set(posts.flatMap(p => p.tags || [])).size}</div><div class="label">个标签</div></div>
                <div class="stat"><div class="num">2026</div><div class="label">持续更新</div></div>
            </div>
        </section>
        <section class="card">
            <h2 class="section-title">最新文章</h2>
            <div class="post-list">
                ${recent.map(p => postItemHTML(p)).join('')}
            </div>
        </section>
    `;
    bindPostLinks();
}

// 归档页（全部文章）
function renderArchive(posts) {
    setActiveLink('archive');
    contentEl.innerHTML = `
        <section class="card">
            <h2 class="section-title">文章归档</h2>
            <div class="post-list">
                ${posts.length ? posts.map(p => postItemHTML(p)).join('') : '<p style="color:var(--text-muted)">暂无文章。</p>'}
            </div>
        </section>
    `;
    bindPostLinks();
}

// 文章详情页
async function renderPost(posts, slug) {
    setActiveLink('');
    const post = posts.find(p => p.slug === slug);
    if (!post) {
        contentEl.innerHTML = `<section class="card"><h2 class="section-title">文章未找到</h2>
            <p>没有找到这篇博客，可能已被删除或链接错误。</p>
            <a class="back-link" href="#/"><i class="fas fa-arrow-left"></i> 返回首页</a></section>`;
        return;
    }
    contentEl.innerHTML = `
        <section class="card">
            <a class="back-link" href="#/archive"><i class="fas fa-arrow-left"></i> 返回归档</a>
            <div class="post-header">
                <h1>${escapeHTML(post.title)}</h1>
                <div class="post-meta">
                    <span><i class="far fa-calendar"></i>${formatDate(post.date)}</span>
                    ${post.author ? `<span><i class="far fa-user"></i>${escapeHTML(post.author)}</span>` : ''}
                    ${post.read ? `<span><i class="far fa-clock"></i>${escapeHTML(post.read)}</span>` : ''}
                </div>
                ${post.tags && post.tags.length ? `<div class="post-tags">${post.tags.map(t => `<span class="post-tag">${escapeHTML(t)}</span>`).join('')}</div>` : ''}
            </div>
            <div class="post-body" id="postBody">
                <div class="status-msg"><div class="spinner"></div>正在加载文章...</div>
            </div>
        </section>
    `;
    try {
        const resp = await fetch(`posts/${encodeURIComponent(post.slug)}.md`, { cache: 'no-cache' });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const md = await resp.text();
        $('#postBody').innerHTML = renderMarkdown(md);
        document.title = `${post.title} | Yan Home`;
    } catch (err) {
        $('#postBody').innerHTML = `<p style="color:#ff7a9c">加载文章内容失败：${escapeHTML(err.message)}。<br>请确认 <code>posts/${escapeHTML(post.slug)}.md</code> 文件存在。</p>`;
    }
}

// 关于页
function renderAbout() {
    setActiveLink('about');
    contentEl.innerHTML = `
        <section class="card about-text">
            <h2 class="section-title">关于我</h2>
            <p>你好！我是 <strong>严正易</strong>，一名充满激情的全栈开发爱好者，专注于创建Web应用并提供AI技术解决方案。我擅长将复杂的设计转化为高效、可访问的代码，把复杂的需求转化为简洁、高效的算法。</p>
            <h3>技能栈</h3>
            <div class="skill-mini">
                <span>HTML5 / CSS3</span><span>JavaScript (ES6+)</span><span>C/C++</span>
                <span>Python</span><span>Vibe Coding</span><span>算法设计</span><span>性能优化</span>
            </div>
            <h3>关于这个博客</h3>
            <p>本站基于原生 HTML/CSS/JS 构建，部署在 GitHub Pages。文章以 Markdown 文件形式存放在 <code>posts/</code> 目录，由前端动态加载并渲染，支持 GFM（表格、任务列表、代码高亮等）。</p>
            <h3>联系方式</h3>
            <p><i class="fas fa-map-marker-alt" style="color:var(--accent-color)"></i> 中国 · 无锡（新吴区）</p>
            <p><i class="fas fa-envelope" style="color:var(--accent-color)"></i> yanzhyii@outlook.com</p>
        </section>
    `;
}

/* 单篇文章卡片 HTML */
function postItemHTML(p) {
    return `
        <a class="post-item" href="#/post/${encodeURIComponent(p.slug)}">
            <h3>${escapeHTML(p.title)}</h3>
            <div class="post-meta">
                <span><i class="far fa-calendar"></i>${formatDate(p.date)}</span>
                ${p.read ? `<span><i class="far fa-clock"></i>${escapeHTML(p.read)}</span>` : ''}
            </div>
            ${p.tags && p.tags.length ? `<div class="post-tags">${p.tags.map(t => `<span class="post-tag">${escapeHTML(t)}</span>`).join('')}</div>` : ''}
            ${p.excerpt ? `<div class="post-excerpt">${escapeHTML(p.excerpt)}</div>` : ''}
        </a>
    `;
}

/* 为文章链接绑定点击事件（拦截 hash 路由） */
function bindPostLinks() {
    contentEl.querySelectorAll('a[href^="#/post/"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const slug = decodeURIComponent(a.getAttribute('href').replace('#/post/', ''));
            location.hash = `#/post/${encodeURIComponent(slug)}`;
        });
    });
    contentEl.querySelectorAll('.back-link').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            location.hash = a.getAttribute('href');
        });
    });
}

/* ========== 路由 ========== */
let allPosts = [];

async function loadPosts() {
    try {
        const resp = await fetch('posts/index.json', { cache: 'no-cache' });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const data = await resp.json();
        return Array.isArray(data) ? data : (data.posts || []);
    } catch (err) {
        console.error('加载文章索引失败:', err);
        return [];
    }
}

function router() {
    const hash = location.hash || '#/';
    const m = hash.match(/^#\/post\/([^/]+)$/);
    if (m) {
        renderPost(allPosts, decodeURIComponent(m[1]));
    } else if (hash === '#/archive') {
        renderArchive(allPosts);
    } else if (hash === '#/about') {
        renderAbout();
    } else {
        renderHome(allPosts);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* 侧边栏导航点击 */
document.querySelectorAll('.side-link').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        location.hash = '#/' + (a.dataset.route === 'home' ? '' : a.dataset.route);
    });
});

/* ========== 初始化 ========== */
window.__loadPosts = loadPosts;
window.__router = router;
window.addEventListener('load', async () => {
    allPosts = await loadPosts();
    // 按日期倒序
    allPosts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    window.__allPosts = allPosts;
    router();
});
window.addEventListener('hashchange', router);
formati
