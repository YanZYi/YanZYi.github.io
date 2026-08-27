import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import type { PostMeta } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="glass-card group block p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--theme-primary)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
    >
      <h3 className="text-[1.3rem] font-semibold text-[#eef0ff] transition-colors group-hover:text-[var(--theme-accent)]">
        {post.title}
      </h3>
      <div className="mt-2 flex flex-wrap gap-4 text-[0.85rem] text-[rgba(240,240,255,0.72)]">
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={13} className="text-[var(--theme-accent)]" />
          {post.date}
        </span>
        {post.read && (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} className="text-[var(--theme-accent)]" />
            {post.read}
          </span>
        )}
      </div>
      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((t) => (
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
      {post.excerpt && (
        <p className="mt-3 text-[0.95rem] leading-relaxed text-[rgba(240,240,255,0.68)]">
          {post.excerpt}
        </p>
      )}
    </Link>
  );
}
