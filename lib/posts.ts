import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  read?: string;
  excerpt?: string;
}

export interface Post {
  meta: PostMeta;
  content: string;
}

/** 解析带 frontmatter 的 md 文件 */
function parsePostFile(fileName: string): Post | null {
  const filePath = path.join(CONTENT_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const slug = fileName.replace(/\.md$/, "");

  const title = data.title;
  if (!title) return null;

  return {
    meta: {
      slug,
      title: String(title),
      date: String(data.date || ""),
      author: String(data.author || "严正易"),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      read: data.read ? String(data.read) : undefined,
      excerpt: data.excerpt ? String(data.excerpt) : undefined,
    },
    content,
  };
}

/** 获取全部文章元数据，按日期倒序 */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parsePostFile)
    .filter((p): p is Post => p !== null)
    .map((p) => p.meta)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

/** 按 slug 获取文章详情 */
export function getPostBySlug(slug: string): Post | null {
  const fileName = `${slug}.md`;
  const filePath = path.join(CONTENT_DIR, fileName);
  if (!fs.existsSync(filePath)) return null;
  return parsePostFile(fileName);
}
