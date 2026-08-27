import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "关于我",
};

const SKILLS = [
  "HTML5 / CSS3",
  "JavaScript (ES6+)",
  "C/C++",
  "Python",
  "Agent Engineer",
  "算法设计",
  "性能优化",
];

export default function AboutPage() {
  return (
    <section className="glass-card p-7 md:p-9">
      <h1 className="section-title">关于我</h1>

      <p className="my-4 leading-relaxed text-[rgba(240,240,255,0.78)]">
        你好！我是 <strong className="text-[var(--theme-accent)]">严正易</strong>
        ，一名充满激情的全栈开发爱好者，专注于创建Web应用并提供AI技术解决方案。我擅长将复杂的设计转化为高效、可访问的代码，把复杂的需求转化为简洁、高效的算法。
      </p>

      <h3 className="mb-3 mt-8 text-[1.2rem] font-semibold text-[var(--theme-accent)]">
        技能栈
      </h3>
      <div className="mb-6 flex flex-wrap gap-2.5">
        {SKILLS.map((s) => (
          <span
            key={s}
            className="rounded-full border px-4 py-1.5 text-[0.88rem] text-[#b8d4ff]"
            style={{
              background: "color-mix(in srgb, var(--theme-secondary) 15%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-secondary) 30%, transparent)",
            }}
          >
            {s}
          </span>
        ))}
      </div>

      <h3 className="mb-3 mt-8 text-[1.2rem] font-semibold text-[var(--theme-accent)]">
        关于这个博客
      </h3>
      <p className="my-4 leading-relaxed text-[rgba(240,240,255,0.78)]">
        本站基于 <strong>Next.js</strong> 构建，静态导出部署在 GitHub Pages。文章以 Markdown
        文件形式存放在 <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-[#ffb8d4]">content/posts/</code>{" "}
        目录，构建时解析 frontmatter 并生成页面。支持 GFM（表格、任务列表、删除线）、LaTeX 数学公式与代码语法高亮。
      </p>

      <h3 className="mb-3 mt-8 text-[1.2rem] font-semibold text-[var(--theme-accent)]">
        联系方式
      </h3>
      <p className="my-2 flex items-center gap-2 text-[rgba(240,240,255,0.78)]">
        <MapPin size={15} className="text-[var(--theme-accent)]" />
        中国 · 无锡（新吴区）
      </p>
      <p className="my-2 flex items-center gap-2 text-[rgba(240,240,255,0.78)]">
        <Mail size={15} className="text-[var(--theme-accent)]" />
        yanzhyii@outlook.com
      </p>
    </section>
  );
}
