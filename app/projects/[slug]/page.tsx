import { getAllProjects, getProjectBySlug, formatDate } from '@/lib/projects'
import Link from 'next/link'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

interface Props {
  params: { slug: string }
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown)
  return result.toString()
}

export async function generateStaticParams() {
  const projects = getAllProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProjectBySlug(params.slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const project = getProjectBySlug(params.slug)
  if (!project) notFound()

  const htmlContent = await markdownToHtml(project.content)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/projects/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-brand-500 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        All Projects
      </Link>

      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag.toLowerCase()}/`}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-900/30 
                  text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-800
                  hover:bg-brand-100 dark:hover:bg-brand-800/50 transition-colors"
              >
                <Tag className="w-3 h-3 inline mr-1" />
                {tag}
              </Link>
            ))}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-[var(--fg)] mb-4 leading-tight">
            {project.title}
          </h1>

          {project.description && (
            <p className="text-lg text-[var(--muted)] mb-4">{project.description}</p>
          )}

          {project.date && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--muted)]">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(project.date)}</span>
            </div>
          )}
        </div>

        {/* Rendered Markdown Content */}
        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  )
}
