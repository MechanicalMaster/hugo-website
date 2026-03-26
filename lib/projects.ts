import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects')

export interface Project {
  slug: string
  title: string
  date: string
  description?: string
  tags: string[]
  draft?: boolean
  cover?: string
  weight?: number
  content: string
}

export function getAllProjects(): Project[] {
  const files = fs.readdirSync(PROJECTS_DIR).filter(
    (f) => f.endsWith('.md') && f !== '_index.md'
  )

  const projects = files.map((filename) => {
    const slug = filename.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, filename), 'utf8')
    const { data, content } = matter(raw)

    return {
      slug,
      title: data.title || slug,
      date: data.date ? String(data.date) : '',
      description: data.description || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      draft: data.draft || false,
      cover: data.cover?.image,
      weight: data.weight,
      content,
    } as Project
  })

  return projects
    .filter((p) => !p.draft)
    .sort((a, b) => {
      if (a.weight !== undefined && b.weight !== undefined) return a.weight - b.weight
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
}

export function getProjectBySlug(slug: string): Project | null {
  const filePath = path.join(PROJECTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title || slug,
    date: data.date ? String(data.date) : '',
    description: data.description || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: data.draft || false,
    cover: data.cover?.image,
    weight: data.weight,
    content,
  }
}

export function getAllTags(): { tag: string; count: number }[] {
  const projects = getAllProjects()
  const tagMap: Record<string, number> = {}

  for (const project of projects) {
    for (const tag of project.tags) {
      const normalized = tag.toLowerCase()
      tagMap[normalized] = (tagMap[normalized] || 0) + 1
    }
  }

  return Object.entries(tagMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getProjectsByTag(tag: string): Project[] {
  const projects = getAllProjects()
  const normalized = tag.toLowerCase()
  return projects.filter((p) =>
    p.tags.some((t) => t.toLowerCase() === normalized)
  )
}

export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}
