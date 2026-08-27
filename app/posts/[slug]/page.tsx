import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import Markdown from "@/components/Markdown";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: post ? post.meta.title : "文章未找到",
    description: post?.meta.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { meta, content } = post;

  return (
    <article className="glass-card p-7 md:p-9">
      <Link
        href="/posts"
        className="mb-6 inline-flex items-center gap-2 text-[0.95rem] text-[rgba(240,240,255,0.72)] transition-colors hover:text-[var(--theme-accent)]"
      >
        <ArrowLeft size={16} />
        返回归档
      </Link>

      <header
        className="mb-6 border-b pb-5"
        style={{ borderColor: "var(--card-border)" }}
      >
        <h1 className="text-[2rem] font-bold leading-snug">{meta.title}</h1>
        <div className="mt-3 flex flex-wrap gap-4 text-[0.85rem] text-[rgba(240,240,255,0.72)]">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={13} className="text-[var(--theme-accent)]" />
            {meta.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <User size={13} className="text-[var(--theme-accent)]" />
            {meta.author}
          </span>
          {meta.read && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} className="text-[var(--theme-accent)]" />
              {meta.read}
            </span>
          )}
        </div>
        {meta.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {meta.tags.map((t) => (
              <span
                key={t}
                className="rounded-full px-3 py-0.5 text-[0.78rem] text-[#d4b8ff]"
                style={{ background: "color-mix(in srgb, var(--theme-primary) 25%, transparent)" }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      <Markdown content={content} />
    </article>
  );
}
