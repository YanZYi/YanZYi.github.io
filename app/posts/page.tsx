import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = {
  title: "文章归档",
};

export default function ArchivePage() {
  const posts = getAllPosts();

  return (
    <section className="glass-card p-7">
      <h1 className="section-title">文章归档</h1>
      <div className="space-y-5">
        {posts.length ? (
          posts.map((p) => <PostCard key={p.slug} post={p} />)
        ) : (
          <p className="text-[rgba(240,240,255,0.6)]">暂无文章。</p>
        )}
      </div>
    </section>
  );
}
