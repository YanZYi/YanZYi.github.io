import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { PostMeta } from './config'

const postsDir = path.join(process.cwd(), 'posts')

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDir)) return []
  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
}

export interface Post {
  meta: PostMeta
  content: string
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  const meta: PostMeta = {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    author: data.author ?? '',
    read: data.read ?? '',
    tags: data.tags ?? [],
    excerpt: data.excerpt ?? ''
  }
  return { meta, content }
}

export function getAllPosts(): Post[] {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
}

export function getSortedPosts(): Post[] {
  return getAllPosts().sort((a, b) =>
    (b.meta.date || '').localeCompare(a.meta.date || '')
  )
}
