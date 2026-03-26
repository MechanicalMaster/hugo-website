import { getAllProjects } from '@/lib/projects'
import { ProjectCard } from '@/components/ProjectCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Product case studies and technical projects by Ronak Sethiya — AI, Fintech, and Banking.',
}

export default function ProjectsPage() {
  const projects = getAllProjects()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl sm:text-4xl text-[var(--fg)] mb-3">
          Projects
        </h1>
        <p className="text-[var(--muted)]">
          {projects.length} case studies and technical projects spanning AI, Fintech, and Banking.
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
