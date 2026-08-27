import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export default function HomePage() {
  const posts = getAllPosts();
  const tagCount = new Set(posts.flatMap((p) => p.tags)).size;
  const recent = posts.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="glass-card px-8 py-12 text-center">
        <h1 className="gradient-text neon-text text-[2.6rem] font-bold leading-tight">
          欢迎来到 Yan Home
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[rgba(240,240,255,0.75)]">
          全栈开发 · 创意技术 · 算法设计 —— 这里记录我的学习笔记与技术思考。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-10">
          <div>
            <div className="gradient-text text-[1.8rem] font-bold">{posts.length}</div>
            <div className="text-[0.85rem] text-[rgba(240,240,255,0.72)]">篇文章</div>
          </div>
          <div>
            <div className="gradient-text text-[1.8rem] font-bold">{tagCount}</div>
            <div className="text-[0.85rem] text-[rgba(240,240,255,0.72)]">个标签</div>
          </div>
          <div>
            <div className="gradient-text text-[1.8rem] font-bold">2026</div>
            <div className="text-[0.85rem] text-[rgba(240,240,255,0.72)]">持续更新</div>
          </div>
        </div>
      </section>

      {/* 最新文章 */}
      <section className="glass-card p-7">
        <h2 className="section-title">最新文章</h2>
        <div className="space-y-5">
          {recent.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
