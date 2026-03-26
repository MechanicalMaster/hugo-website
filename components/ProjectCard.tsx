import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { Project, formatDate } from '@/lib/projects'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}/`}
      className="card p-6 block group hover:border-brand-300 dark:hover:border-brand-600 
        transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-semibold text-[var(--fg)] group-hover:text-brand-500 transition-colors leading-snug flex-1">
          {project.title}
        </h3>
        <ArrowRight className="w-4 h-4 text-[var(--muted)] group-hover:text-brand-500 flex-shrink-0 mt-0.5 transition-colors" />
      </div>

      {project.description && (
        <p className="text-sm text-[var(--muted)] mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)]"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-0.5 rounded-full text-xs text-[var(--muted)]">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
        {project.date && (
          <div className="flex items-center gap-1 text-xs text-[var(--muted)] flex-shrink-0">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(project.date)}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
