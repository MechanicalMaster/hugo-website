import { getAllTags } from '@/lib/projects'
import Link from 'next/link'
import { Tag } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse projects by tag on Ronak Sethiya\'s portfolio.',
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl sm:text-4xl text-[var(--fg)] mb-3">Tags</h1>
        <p className="text-[var(--muted)]">Browse projects by topic.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${tag}/`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] 
              bg-[var(--card)] text-sm text-[var(--muted)] hover:text-brand-500 hover:border-brand-300 
              dark:hover:border-brand-600 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="font-medium">{tag}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-medium">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
