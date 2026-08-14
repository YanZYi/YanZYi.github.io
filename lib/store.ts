export interface LocalPost {
  slug: string
  title: string
  date: string
  author: string
  read: string
  tags: string[]
  excerpt: string
  content: string
  status: 'draft' | 'published'
  updatedAt: string
}

const STORAGE_KEY = 'yan-home-local-posts'

function readRaw(): Record<string, LocalPost> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function writeRaw(data: Record<string, LocalPost>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getLocalPosts(): LocalPost[] {
  return Object.values(readRaw()).sort(
    (a, b) => (b.date || '').localeCompare(a.date || '')
  )
}

export function getLocalPost(slug: string): LocalPost | null {
  return readRaw()[slug] ?? null
}

export function saveLocalPost(post: LocalPost): void {
  const data = readRaw()
  data[post.slug] = { ...post, updatedAt: new Date().toISOString() }
  writeRaw(data)
}

export function deleteLocalPost(slug: string): void {
  const data = readRaw()
  delete data[slug]
  writeRaw(data)
}

export function localPostExists(slug: string): boolean {
  return slug in readRaw()
}
