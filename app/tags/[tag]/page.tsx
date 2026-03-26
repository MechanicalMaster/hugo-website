import { getAllTags, getProjectsByTag } from '@/lib/projects'
import { ProjectCard } from '@/components/ProjectCard'
import Link from 'next/link'
import { ArrowLeft, Tag } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: { tag: string }
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map(({ tag }) => ({ tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `#${params.tag}`,
    description: `Projects tagged with "${params.tag}" by Ronak Sethiya.`,
  }
}

export default function TagPage({ params }: Props) {
  const projects = getProjectsByTag(params.tag)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/tags/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-brand-500 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        All Tags
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-5 h-5 text-brand-500" />
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--fg)]">
            {params.tag}
          </h1>
        </div>
        <p className="text-[var(--muted)]">
          {projects.length} project{projects.length !== 1 ? 's' : ''} tagged with &quot;{params.tag}&quot;
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
